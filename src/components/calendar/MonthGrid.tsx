import { memo } from "react";
import { Text, View } from "react-native";
import DateCell from "./DateCell";

/**
 * 月视图网格类型定义
 */
interface MonthGridProps {
  weeks: (Date | null)[][];
  currentMonth: number;
  screenWidth: number;
  todayDate: Date;
  selectedDate: Date;
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
function MonthGrid({
  weeks,
  currentMonth,
  screenWidth,
  todayDate,
  selectedDate,
}: MonthGridProps) {
  return (
    <View style={{ width: screenWidth }} className="gap-y-4">
      {weeks.map((week, index) => (
        <View
          key={index}
          className="flex-row border-t-[0.5px] border-t-[#d7d7d7] dark:border-t-[#323232]"
        >
          {week.map((dateInfo, index) =>
            !dateInfo ? (
              <View
                key={index + new Date().toISOString()}
                className={`flex-1 aspect-[1px] p-1 `}
              >
                <View className="flex-1 items-center justify-center">
                  {/* 公历日期 */}
                  <View
                    className={`w-8 h-8 rounded-2xl items-center justify-center mb-0.5  `}
                  >
                    <Text
                      className={`text-[17px] font-medium  dark:text-white  `}
                    ></Text>
                    {/* 农历日期 */}
                    {/* <Text
            className={`text-[9px] font-medium  dark:text-white ${
              isSelected && "text-white "
            }  ${
              isToday && !isSelected && "text-[#007AFF] dark:text-[#007AFF]"
            } `}
          >
            {holiday === false ? lunarText : holiday[0].name}
          </Text> */}
                  </View>
                  {/* 事件指示点 */}
                  {/*   <View className=""></View> */}
                </View>
              </View>
            ) : (
              <DateCell
                key={dateInfo.toISOString()}
                dateInfo={dateInfo}
                isCurrentMonth={
                  dateInfo.getMonth() === currentMonth &&
                  dateInfo.getFullYear() === selectedDate.getFullYear()
                }
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
            )
          )}
        </View>
      ))}
    </View>
  );
}

export default memo(MonthGrid);
