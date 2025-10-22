//* 首页 -> 日历主界面

import CalendarHeader from "@/src/components/calendar/CalendarHeader";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <>
      {/* 配置当前页面的header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* 顶部标题栏 */}
        <CalendarHeader />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
