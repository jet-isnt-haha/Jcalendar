//* 首页 -> 日历主界面

import CalendarHeader from "@/src/components/calendar/CalendarHeader";
import MonthView from "@/src/components/calendar/MonthView";
import ViewTabs from "@/src/components/calendar/ViewTabs";
import { useViewCache } from "@/src/hooks/useViewCache";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

export type ViewType = "year" | "month" | "week" | "day" | "agenda";

export default function HomeScreen() {
  const { currentView, handleViewChange, isViewRendered, isViewActive } =
    useViewCache("month");

  //当前选中的日期
  const [selectedDate, setSelectedDate] = useState(new Date());

  const viewComponents = useMemo(
    () => ({
      month: (
        <MonthView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      ),
      week: <View className="flex-1" />,
      year: <View className="flex-1" />,
      day: <View className="flex-1" />,
      agenda: <View className="flex-1" />,
    }),
    [selectedDate]
  );

  //渲染对应的视图
  const renderView = () =>
    (["month", "week", "year", "day", "agenda"] as const).map(
      (viewType) =>
        isViewRendered(viewType) && (
          <View
            key={viewType}
            className={`absolute top-0 left-0 right-0 bottom-0 ${
              !isViewActive(viewType) && "opacity-0 z-0"
            }`}
            pointerEvents={isViewActive(viewType) ? "auto" : "none"}
          >
            {viewComponents[viewType]}
          </View>
        )
    );

  return (
    <>
      {/* 配置当前页面的header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 dark:bg-[#000000]">
        {/* 顶部标题栏 */}
        <CalendarHeader />
        {/* 视图切换Tab */}
        <ViewTabs currentView={currentView} onViewChange={handleViewChange} />
        {/* 视图显示区域 */}
        <View className="flex-1 relative">{renderView()}</View>
      </View>
    </>
  );
}
