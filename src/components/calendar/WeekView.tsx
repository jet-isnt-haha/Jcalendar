import { SCREEN_WIDTH } from "@/src/constants";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";
import WeekGrid from "./WeekGrid";

/**
 * 周组件类型定义
 */
interface WeekViewProps {
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

export default function WeekView({
  selectedDate,
  onDateSelect,
}: WeekViewProps) {
  const [todayDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(
    startOfWeek(selectedDate)
  );
  const weekFlatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const weeks = useMemo(() => {
    const prev = generateMonthWeek(subWeeks(currentDate, 1));
    const current = generateMonthWeek(currentDate);
    const next = generateMonthWeek(addWeeks(currentDate, 1));
    return [prev, current, next];
  }, [currentDate]);
  //星期标题
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

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
      />
    ),
    [selectedDate, todayDate]
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
        const next = addWeeks(currentDate, 1);
        setCurrentDate(next);
        onDateSelect(next);
        weekFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      } else if (page === 0) {
        isScrollingRef.current = true;
        const prev = subWeeks(currentDate, 1);
        setCurrentDate(prev);
        onDateSelect(prev);
        weekFlatListRef.current?.scrollToIndex({ index: 1, animated: false });
      }
    },
    [currentDate]
  );

  return (
    <ScrollView className="flex-1 dark:bg-[#000000]">
      {/* 星期标题行 */}
      <View className="flex-row py-3 px-3 border-b-[0.5px] border-b-[#d7d7d7] dark:border-b-[#323232]">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[13px] dark:color-[#e0e0e0] font-medium">
              {day}
            </Text>
          </View>
        ))}
      </View>
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
    </ScrollView>
  );
}
