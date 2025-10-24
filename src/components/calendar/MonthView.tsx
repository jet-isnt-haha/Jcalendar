import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { ScrollView, Text, View } from "react-native";
import DateCell from "./DateCell";

interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MonthView({
  selectedDate,
  onDateSelect,
}: MonthViewProps) {
  //获取当月所有日期
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  //获取显示范围（包括前后月份的日期以填满日历网格）
  const calendarStart = startOfWeek(monthStart, { locale: zhCN });
  const calendarEnd = endOfWeek(monthEnd, { locale: zhCN });

  const allDates = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  console.log(monthStart);
  console.log(calendarStart);
  console.log(allDates);

  //星期标题
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  //将日期按周分组
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }

  const renderMonth = (weeks: Date[][]) => {
    return (
      <View className="grid grid-flow-row gap-y-4">
        {weeks.map((week, index) => (
          <View
            key={index}
            className="grid grid-cols-7  border-b-[0.5px] border-b-[#d7d7d7] dark:border-b-[#1C1C1E]"
          >
            {week.map((date) => (
              <DateCell
                key={date.toISOString()}
                date={date}
                isCurrentMonth={date.getMonth() === selectedDate.getMonth()}
                isSelected={false}
                isToday={false}
                onPress={() => console.log("pressed")}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 dark:bg-[#000000]">
      {/* 星期标题行 */}
      <View className="flex-row py-3 border-b-[0.5px] border-b-[#d7d7d7] dark:border-b-[#1C1C1E]">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[13px] dark:color-[#e0e0e0] font-medium">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 日期网格 */}
      {renderMonth(weeks)}
      {/* <FlatList
        data={weeks}
        renderItem={({ item, index }) =>
          item.map((date) => (
            <DateCell
              key={date.toISOString()}
              date={date}
              isCurrentMonth={date.getMonth() === selectedDate.getMonth()}
              isSelected={false}
              isToday={false}
              onPress={() => console.log("pressed")}
            />
          ))
        }
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false} //隐藏滚动条
        windowSize={3} //渲染窗口大小
        initialNumToRender={1} //初始渲染数量
        maxToRenderPerBatch={1} //每批渲染数量
        removeClippedSubviews={true} //移除屏幕外视图
      /> */}
    </ScrollView>
  );
}
