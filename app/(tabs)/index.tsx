//* 首页 -> 日历主界面

import CalendarHeader from "@/src/components/calendar/CalendarHeader";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <>
      {/* 配置当前页面的header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 dark:bg-[#000000]">
        {/* 顶部标题栏 */}
        <CalendarHeader />
      </View>
    </>
  );
}
