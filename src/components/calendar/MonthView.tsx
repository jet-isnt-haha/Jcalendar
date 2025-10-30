import { ScrollView, Text, View } from "react-native";
import MonthCalendar from "./MonthCalendar";

interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MonthView({
  selectedDate,
  onDateSelect,
}: MonthViewProps) {
  //星期标题
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

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
      <MonthCalendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
    </ScrollView>
  );
}
