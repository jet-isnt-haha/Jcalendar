import { SCREEN_WIDTH } from "@/src/constants";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import MonthGrid from "./MonthGrid";

interface MonthCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

/**
 * 生成指定月份的周数据数组
 *
 * 包含月份前后的日期以填满完整的日历网格
 * @param date
 * @returns {(Date | null)[][]}
 */
const generateMonthWeeks = (date: Date): (Date | null)[][] => {
  //获取当月所有日期
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  //获取显示范围（包括前后月份的日期以填满日历网格）
  const calendarStart = startOfWeek(monthStart);

  const allDates = eachDayOfInterval({
    start: calendarStart,
    end: monthEnd,
  });

  //预计算农历和节假日数据
  // const enrichedDates = allDates.map((date) => ({
  //   date: date,
  //   lunarInfo: getLunarDate(date),
  //   holiday: getHoliday_CN(date),
  // }));
  //将日期按周分组
  const weeks: (Date | null)[][] = [];

  let currentWeek: (Date | null)[] = [];
  allDates.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};
function MonthCalendar({ selectedDate, onDateSelect }: MonthCalendarProps) {
  const [todayDate] = useState<Date>(new Date());
  const monthFlatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const months = useMemo(() => {
    const prev = generateMonthWeeks(subMonths(startOfMonth(selectedDate), 1));
    const current = generateMonthWeeks(startOfMonth(selectedDate));
    const next = generateMonthWeeks(addMonths(startOfMonth(selectedDate), 1));
    return [prev, current, next];
  }, [selectedDate]);

  /**
   * 渲染月视图
   */
  const renderMonth = useCallback(
    ({ item: weeks }: { item: (Date | null)[][] }) => (
      <MonthGrid
        weeks={weeks}
        currentMonth={selectedDate.getMonth()}
        screenWidth={SCREEN_WIDTH}
        todayDate={todayDate}
        selectedDate={selectedDate}
        handlePress={onDateSelect}
      />
    ),
    [selectedDate, todayDate, onDateSelect]
  );

  /**
   * FlatList滑动事件处理函数
   *
   * 通过滑动动态加载下一张月视图并处理对应状态变量
   * @param {e: NativeSyntheticEvent<NativeScrollEvent>}
   * @returns {void}
   */
  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      //设置防抖标志避免scrollToIndex({ index: 1, animated: false })后再次触发
      if (isScrollingRef.current) {
        isScrollingRef.current = false;
        return;
      }

      //获取page
      const offsetX = e.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);
      console.log(page);

      if (page === 2) {
        isScrollingRef.current = true;
        const next = addMonths(startOfMonth(selectedDate), 1);
        onDateSelect(next);
        monthFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      } else if (page === 0) {
        isScrollingRef.current = true;
        const prev = subMonths(startOfMonth(selectedDate), 1);
        onDateSelect(prev);
        monthFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      }
    },
    [selectedDate, onDateSelect]
  );

  return (
    <FlatList
      ref={monthFlatListRef}
      data={months}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderMonth}
      keyExtractor={(_, i) => i.toString()}
      initialScrollIndex={1}
      getItemLayout={(_, i) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * i,
        index: i,
      })}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      decelerationRate="fast"
      removeClippedSubviews={false}
      maxToRenderPerBatch={3}
      windowSize={3}
      initialNumToRender={3}
      updateCellsBatchingPeriod={50}
    />
  );
}

export default memo(MonthCalendar);
