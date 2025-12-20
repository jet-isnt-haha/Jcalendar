import { event } from "@/types";
import { format } from "date-fns";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
interface DateCellProps {
  dateInfo: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  onPress: (date: Date) => void;
  hasEvent?: event | null;
}

function DateCell({
  dateInfo = new Date(0),
  isCurrentMonth = false,
  isSelected = false,
  isToday = false,
  onPress,
  hasEvent = null,
}: DateCellProps) {
  const date = dateInfo;
  const dayNumber = format(date, "d");

  //判断是否显示农历信息 （初一显示月份，其他显示日期）
  // const lunarText = lunarInfo.lDay === 1 ? lunarInfo.monthCn : lunarInfo.dayCn;

  const handlePress = (event: GestureResponderEvent) => {
    onPress(dateInfo);
  };

  return (
    <Pressable
      className={`flex-1 aspect-square p-1  ${!isCurrentMonth && "opacity-30"}`}
      onPress={handlePress}
    >
      <View className="flex-1 items-center justify-center">
        {/* 公历日期 */}
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mb-0.5  ${
            isSelected && !isToday && "bg-[#696969] dark:bg-[#adb7c2]"
          } ${isToday && isSelected && "bg-[#2b7df8] dark:bg-[#2b7df8]"}`}
        >
          <Text
            className={`text-[17px] font-medium  dark:text-white ${
              isSelected && "text-white "
            }  ${
              isToday && !isSelected && "text-[#007AFF] dark:text-[#007AFF]"
            } `}
          >
            {dayNumber}
          </Text>
          {/* 事件指示点 */}
          <View className="w-2/5 h-1 bg-red-500 "></View>
        </View>
      </View>
    </Pressable>
  );
}

export default DateCell;
