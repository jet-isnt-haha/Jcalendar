import { getHoliday_CN, getLunarDate } from "@/src/utils/dateHelper";
import { format } from "date-fns";
import { Text, TouchableOpacity, View } from "react-native";
interface DateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

export default function DateCell({
  date,
  isCurrentMonth,
  isSelected,
  isToday,
  onPress,
}: DateCellProps) {
  const dayNumber = format(date, "d");

  //获取农历信息
  const lunarInfo = getLunarDate(date);

  //获取中国节假日信息
  const holiday = getHoliday_CN(date);

  //判断是否显示农历信息 （初一显示月份，其他显示日期）
  const lunarText = lunarInfo.lDay === 1 ? lunarInfo.monthCn : lunarInfo.dayCn;
  return (
    <TouchableOpacity
      className={`flex-1 aspect-[1px] p-1 ${!isCurrentMonth && "opacity-30"}`}
    >
      <View className="flex-1 items-center justify-center">
        {/* 公里日期 */}
        <View
          className={`w-8 h-8 rounded-2xl items-center justify-center mb-0.5  ${
            isSelected && "bg-[#696969] dark:bg-[#adb7c2]"
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
          {/* 农历日期 */}
          <Text
            className={`text-[9px] font-medium  dark:text-white ${
              isSelected && "text-white "
            }  ${
              isToday && !isSelected && "text-[#007AFF] dark:text-[#007AFF]"
            } `}
          >
            {holiday === false ? lunarText : holiday[0].name}
          </Text>
        </View>
        {/* 事件指示点 */}
        {/*   <View className=""></View> */}
      </View>
    </TouchableOpacity>
  );
}
