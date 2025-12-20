//* 首页 -> 日历主界面
/**
 * 首页 - 日历主页面
 *
 * 显示日历的主视图，支持年/月/周/日/日程视图切换
 *
 * @page
 * @route /(tabs)/
 */
import CalendarHeader from "@/components/CalendarHeader";
import Button from "@/components/Common/Button";
import EventCard from "@/components/EventCard";
import ViewTabs from "@/components/ViewTabs";
import { useViewCache } from "@/hooks/useViewCache";
import DayView from "@/pages/DayView";
import MonthView from "@/pages/MonthView";
import WeekView from "@/pages/WeekView";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

/** 视图类型定义 */
export type ViewType = "year" | "month" | "week" | "day" | "agenda";

export default function HomeScreen() {
  const { currentView, handleViewChange, isViewRendered, isViewActive } =
    useViewCache("month");

  //当前选中的日期
  const [selectedDate, setSelectedDate] = useState(new Date());

  //返回对应key的视图组件的对象
  const viewComponents = useMemo(
    () => ({
      year: <View className="flex-1" />,
      month: (
        <MonthView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      ),
      week: (
        <WeekView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      ),
      day: (
        <DayView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      ),

      agenda: (
        <>
          <EventCard
            event={{
              title: "上课",
              remark: "上数学课",
              startTime: new Date(),
              endTime: new Date(),
            }}
          />
          <Button
            iconName="add-outline"
            iconSize={24}
            onPress={() => {
              router.push("/event/create");
            }}
          />
        </>
      ),
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
        <CalendarHeader selectedDate={selectedDate} />
        {/* 视图切换Tab */}
        <ViewTabs currentView={currentView} onViewChange={handleViewChange} />
        {/* 视图显示区域 */}
        <View className="flex-1 relative">{renderView()}</View>
      </View>
    </>
  );
}
