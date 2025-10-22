import { useTheme } from "@/src/contexts/ThemeContext";
import { getDateInfo } from "@/src/utils/dateHelper";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * 日历顶部标题栏组件
 * 显示当前年月、周数，以及折叠和菜单按钮
 */

export default function CalendarHeader() {
  const { theme, toggleTheme } = useTheme();
  const [currentDate] = useState(new Date());
  const { year, month, week } = getDateInfo(currentDate);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 左侧：日期和周数 */}
      <View style={styles.leftSection}>
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          {year}年{month}月
        </Text>
        <Text style={styles.weekText}>第{week}周</Text>
      </View>
      {/* 右侧：按钮组 */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => toggleTheme()}
        >
          <Ionicons
            name="chevron-up-circle-outline"
            size={28}
            color={theme.colors.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log("菜单按钮点击")}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={28}
            color={theme.colors.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  weekText: {
    fontSize: 14,
    color: "#888",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
