import { SCREEN_WIDTH } from "@/constants";

import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import WeekGrid from "./WeekGrid";

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

/**
 * 生成指定月份的周数据
 * @param date
 * @returns {Date[]}
 */
const generateMonthWeek = (date: Date): Date[] => {
  const calendarStart = startOfWeek(date);
  const calendarEnd = endOfWeek(date);

  const week = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  return week;
};

function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [todayDate] = useState<Date>(new Date());
  const weekFlatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const weeks = useMemo(() => {
    const prev = generateMonthWeek(subWeeks(selectedDate, 1));
    const current = generateMonthWeek(selectedDate);
    const next = generateMonthWeek(addWeeks(selectedDate, 1));
    return [prev, current, next];
  }, [selectedDate]);

  /**
   * 渲染周视图
   */
  const renderWeek = useCallback(
    ({ item: week }: { item: Date[] }) => (
      <WeekGrid
        week={week}
        screenWidth={SCREEN_WIDTH}
        todayDate={todayDate}
        selectedDate={selectedDate}
        handlePress={onDateSelect}
      />
    ),
    [selectedDate, todayDate, onDateSelect]
  );
  /**
   * FlatList onMomentumScrollEnd方法函数
   *
   * 通过滑动动态加载下一张周视图并处理对应状态变量
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

      if (page === 2) {
        isScrollingRef.current = true;
        const next = addWeeks(selectedDate, 1);
        onDateSelect(next);
        weekFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      } else if (page === 0) {
        isScrollingRef.current = true;
        const prev = subWeeks(selectedDate, 1);
        onDateSelect(prev);
        weekFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      }
    },
    [selectedDate, onDateSelect]
  );

  return (
    <FlatList
      ref={weekFlatListRef}
      data={weeks}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderWeek}
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

export default memo(WeekCalendar);
