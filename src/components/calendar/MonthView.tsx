import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  ScaledSize,
  ScrollView,
  Text,
  View,
} from "react-native";
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
 * @param todayDate - 今日日期
 * @param selectedDate - 被选中的日期
 */
const MonthGrid = memo(
  ({
    weeks,
    currentMonth,
    screenWidth,
    todayDate,
    selectedDate,
  }: {
    weeks: Date[][];
    currentMonth: number;
    screenWidth: number;
    todayDate: Date;
    selectedDate: Date;
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
              isSelected={
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
              }
              isToday={
                date.getDate() === todayDate.getDate() &&
                date.getMonth() === todayDate.getMonth() &&
                date.getFullYear() === todayDate.getFullYear()
              }
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
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
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
  const windowDimensions: ScaledSize = Dimensions.get("window");
  const [monthItemWidth, setMonthItemWidth] = useState<number>(0);
  const [monthArr, setMonthArr] = useState<Date[][][] | undefined>(undefined);
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [movedIndex, setMovedIndex] = useState<number | undefined>(undefined);
  const monthFlatListRef = useRef<FlatList>(null);

  /**
   * 初始化单月视图尺寸与月数组
   */
  useEffect((): void => {
    setMonthItemWidth(windowDimensions.width);
    setMonthArr([
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() - 4, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      ),
      generateMonthWeeks(new Date()),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1)
      ),
      generateMonthWeeks(
        new Date(new Date().getFullYear(), new Date().getMonth() + 4, 1)
      ),
    ]);
  }, []);

  /**
   * 计算今日日期，并初始化
   */
  useEffect((): void => {
    if (monthArr !== undefined) {
      setTodayDate(new Date());
    }
  }, [monthArr]);

  //星期标题
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const renderMonth = useCallback(
    ({ item: weeks }: { item: Date[][] }) => (
      <MonthGrid
        weeks={weeks}
        currentMonth={selectedDate.getMonth()}
        screenWidth={monthItemWidth}
        todayDate={todayDate}
        selectedDate={selectedDate}
      />
    ),
    [selectedDate, monthItemWidth, todayDate]
  );

  /**
   * 添加新month到monthArr的头部
   * @param info
   * @returns {void}
   */
  const unshiftMonth = (info: { distanceFromStart: number }) => {
    if (monthArr === undefined) return;
    console.log("unshift");
    const index = 0;
    const startIndexDate = monthArr[index][0].find(
      (date) => date.getDate() === 1
    );

    if (startIndexDate === undefined) return;
    const newMonthArr = [
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 3, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 2, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 1, 1)
      ),
    ];

    setMonthArr([...newMonthArr, ...monthArr]);

    setMovedIndex(index + newMonthArr.length);
  };
  /**
   * 添加新month到monthArr的尾部
   * @param info
   * @returns {void}
   */
  const appendMonth = (info: { distanceFromEnd: number }) => {
    if (monthArr === undefined) return;
    const index = monthArr!.length - 1;
    console.log("append");
    const startIndexDate = monthArr[index][0].find(
      (date) => date.getDate() === 1
    );
    if (startIndexDate === undefined) return;
    const newMonthArr = [
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 1, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 2, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 3, 1)
      ),
    ];

    setMonthArr([...monthArr, ...newMonthArr]);
    setMovedIndex(index);
  };

  /**
   * 确保渲染新monthArr回退到原index
   */
  useLayoutEffect((): void => {
    if (
      movedIndex !== undefined &&
      monthArr !== undefined &&
      monthFlatListRef.current !== undefined
    ) {
      monthFlatListRef.current?.scrollToIndex({
        index: movedIndex,
        animated: false,
      });
    }
  }, [monthArr, movedIndex]);

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
      {monthArr !== undefined && (
        <FlatList
          // ==================== 数据源 ====================
          data={monthArr}
          renderItem={renderMonth}
          keyExtractor={(item, index) => {
            const firstDayOfMonth = item[0].find(
              (date) => date.getDate() === 1
            );
            if (firstDayOfMonth) {
              return `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth()}`;
            }
            return index.toString();
          }}
          // ==================== 布局方向 ====================
          horizontal={true} // 横向滚动
          // ==================== 分页行为 ====================
          pagingEnabled={true} // 开启分页模式
          snapToInterval={monthItemWidth} // 每次滑动一个屏幕宽度
          snapToAlignment="start" // 对齐到起始位置
          disableIntervalMomentum={true} // 禁用连续滑动（每次只滑一页）
          // ==================== 滑动体验 ====================
          decelerationRate="fast" // 快速减速停止
          showsHorizontalScrollIndicator={false} // 隐藏横向滚动条
          // ==================== 性能优化（渲染策略） ====================
          updateCellsBatchingPeriod={200} // 批量更新间隔200ms
          removeClippedSubviews={false} // 不移除屏幕外视图（避免闪烁）
          // ==================== 性能优化（布局计算） ====================
          getItemLayout={(_, index) => ({
            // 预定义项目尺寸（跳过测量）
            length: monthItemWidth, // 每项宽度
            offset: monthItemWidth * index, // 偏移量
            index, // 索引
          })}
          initialScrollIndex={monthArr.length / 2 - 1} // 初始滚动到第1个项目（从中间开始）
          // ==================== 添加month事件并回滚 ====================
          ref={monthFlatListRef}
          onStartReachedThreshold={0.5}
          onStartReached={unshiftMonth}
          onEndReachedThreshold={0.5}
          onEndReached={appendMonth}
        />
      )}
    </ScrollView>
  );
}
