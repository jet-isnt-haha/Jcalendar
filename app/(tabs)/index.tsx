//* 首页 -> 日历主界面

import CalendarHeader from "@/src/components/calendar/CalendarHeader";
import MonthView from "@/src/components/calendar/MonthView";
import ViewTabs from "@/src/components/calendar/ViewTabs";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export type ViewType = "year" | "month" | "week" | "day" | "agenda";

export default function HomeScreen() {
  //当前选中的视图
  const [currentView, setCurrentView] = useState<ViewType>("month");

  //当前选中的日期
  const [selectedDate, setSelectedDate] = useState(new Date());

  //渲染对应的视图
  const renderView = () => {
    switch (currentView) {
      case "month":
        return (
          <MonthView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        );
    }
  };

  return (
    <>
      {/* 配置当前页面的header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 dark:bg-[#000000]">
        {/* 顶部标题栏 */}
        <CalendarHeader />
        {/* 视图切换Tab */}
        <ViewTabs currentView={currentView} onViewChange={setCurrentView} />
        {/* 视图显示区域 */}
        <View className="flex-1">{renderView()}</View>
      </View>
    </>
  );
}
