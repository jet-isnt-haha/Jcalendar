import { getDateInfo } from "@/src/utils/dateHelper";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
/**
 * 日历顶部标题栏组件
 * 显示当前年月、周数，以及折叠和菜单按钮
 */

export default function CalendarHeader() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [currentDate] = useState(new Date());
  const { year, month, week } = getDateInfo(currentDate);

  return (
    <View
      className="flex-row justify-between items-center px-5 py-4 pt-[50px]
       dark:bg-[#000000]"
    >
      {/* 左侧：日期和周数 */}
      <View className="flex-row items-baseline gap-3">
        <Text className="text-xl font-bold dark:color-[#FFFFFF]">
          {year}年{month}月
        </Text>
        <Text className="text-sm color-[#888]">第{week}周</Text>
      </View>
      {/* 右侧：按钮组 */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="p-1" onPress={toggleColorScheme}>
          <Ionicons
            name="chevron-up-circle-outline"
            size={28}
            color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-1"
          onPress={() => console.log("菜单按钮点击")}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={28}
            color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
