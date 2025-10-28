import { memo } from "react";
import { View } from "react-native";
import DateCell from "./DateCell";

interface WeekGridProps {
  week: Date[];
  screenWidth: number;
  selectedDate: Date;
  todayDate: Date;
}

/**
 * 周网格组件
 *
 * 渲染单个周的日历网格，包含该周的所有天
 *
 * @param week - 周数组
 * @param screenWidth - 屏幕宽度
 * @param selectedDate -  被选中的日期
 */
function WeekGrid({
  week,
  screenWidth,
  selectedDate,
  todayDate,
}: WeekGridProps) {
  return (
    <View style={{ width: screenWidth }} className="">
      <View className="flex-row items-center justify-around px-3">
        {week.map((dateInfo, index) => (
          <View key={dateInfo.toISOString()} className="">
            <DateCell
              dateInfo={dateInfo}
              isCurrentMonth={true}
              isSelected={
                dateInfo.getDate() === selectedDate.getDate() &&
                dateInfo.getMonth() === selectedDate.getMonth() &&
                dateInfo.getFullYear() === selectedDate.getFullYear()
              }
              isToday={
                dateInfo.getDate() === todayDate.getDate() &&
                dateInfo.getMonth() === todayDate.getMonth() &&
                dateInfo.getFullYear() === todayDate.getFullYear()
              }
              onPress={() => console.log("pressed")}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(WeekGrid);
