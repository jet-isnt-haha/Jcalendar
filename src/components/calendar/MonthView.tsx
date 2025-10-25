import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { memo, useCallback, useMemo } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import DateCell from "./DateCell";

interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

/**
 * 月份网格组件
 *
 * 渲染单个月份的日历网格，包含该月的所有周
 *
 * @param weeks - 月份的周数组
 * @param currentMonth
 * @param screenWidth - 屏幕宽度，用于将MonthView填满FlatList
 */
const MonthGrid = memo(
  ({
    weeks,
    currentMonth,
    screenWidth,
  }: {
    weeks: Date[][];
    currentMonth: number;
    screenWidth: number;
  }) => (
    <View style={{ width: screenWidth }} className="gap-y-4">
      {weeks.map((week, index) => (
        <View
          key={index}
          className="flex-row border-t-[0.5px] border-t-[#d7d7d7] dark:border-t-[#323232]"
        >
          {week.map((date) => (
            <DateCell
              key={date.toISOString()}
              date={date}
              isCurrentMonth={date.getMonth() === currentMonth}
              isSelected={false}
              isToday={false}
              onPress={() => console.log("pressed")}
            />
          ))}
        </View>
      ))}
    </View>
  )
);
//显示标注组件displayName
MonthGrid.displayName = "MonthGrid";

/**
 * 生成指定月份的周数据
 *
 * 包含月份前后的日期以填满完整的日历网格
 * @param date
 * @returns {Date[][]}
 */
const generateMonthWeeks = (date: Date) => {
  //获取当月所有日期
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  //获取显示范围（包括前后月份的日期以填满日历网格）
  const calendarStart = startOfWeek(monthStart, { locale: zhCN });
  const calendarEnd = endOfWeek(monthEnd, { locale: zhCN });

  const allDates = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  //将日期按周分组
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }
  return weeks;
};

export default function MonthView({
  selectedDate,
  onDateSelect,
}: MonthViewProps) {
  // 获取屏幕宽度
  const screenWidth = Dimensions.get("window").width;

  // 使用 useMemo 缓存月份数据
  const months = useMemo(
    () => [
      generateMonthWeeks(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
      ),
      generateMonthWeeks(selectedDate),
      generateMonthWeeks(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
      ),
    ],
    [selectedDate]
  );

  //星期标题
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const renderMonth = useCallback(
    ({ item: weeks }: { item: Date[][] }) => (
      <MonthGrid
        weeks={weeks}
        currentMonth={selectedDate.getMonth()}
        screenWidth={screenWidth}
      />
    ),
    [selectedDate, screenWidth]
  );

  return (
    <ScrollView className="flex-1 dark:bg-[#000000]">
      {/* 星期标题行 */}
      <View className="flex-row py-3 border-b-[0.5px] border-b-[#d7d7d7] dark:border-b-[#323232]">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[13px] dark:color-[#e0e0e0] font-medium">
              {day}
            </Text>
          </View>
        ))}
      </View>
      <FlatList
        // ==================== 数据源 ====================
        data={months}
        renderItem={renderMonth}
        keyExtractor={(_, index) => index.toString()}
        // ==================== 布局方向 ====================
        horizontal={true} // 横向滚动
        // ==================== 分页行为 ====================
        pagingEnabled={true} // 开启分页模式
        snapToInterval={screenWidth} // 每次滑动一个屏幕宽度
        snapToAlignment="start" // 对齐到起始位置
        disableIntervalMomentum={true} // 禁用连续滑动（每次只滑一页）
        // ==================== 滑动体验 ====================
        decelerationRate="fast" // 快速减速停止
        showsHorizontalScrollIndicator={false} // 隐藏横向滚动条
        // ==================== 性能优化（渲染策略） ====================
        windowSize={5} // 渲染窗口大小（当前+前后各2屏）
        initialNumToRender={3} // 首次加载渲染3个项目
        maxToRenderPerBatch={1} // 每批次最多渲染1个项目
        updateCellsBatchingPeriod={200} // 批量更新间隔200ms
        removeClippedSubviews={false} // 不移除屏幕外视图（避免闪烁）
        // ==================== 性能优化（布局计算） ====================
        getItemLayout={(_, index) => ({
          // 预定义项目尺寸（跳过测量）
          length: screenWidth, // 每项宽度
          offset: screenWidth * index, // 偏移量
          index, // 索引
        })}
        initialScrollIndex={1} // 初始滚动到第1个项目（从中间开始）
      />
    </ScrollView>
  );
}
