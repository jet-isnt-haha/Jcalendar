import { Text, TouchableOpacity, View } from "react-native";
import type { ViewType } from "~/(tabs)";
import { TabItem } from "../../types";

interface ViewTabsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const tabs: TabItem[] = [
  { key: "year", label: "年" },
  { key: "month", label: "月" },
  { key: "week", label: "周" },
  { key: "day", label: "日" },
  { key: "agenda", label: "日程" },
];

export default function ViewTabs({ currentView, onViewChange }: ViewTabsProps) {
  return (
    <View className="flex-row  px-2 py-2  rounded-3xl bg-[#bcbcbc] dark:bg-[#1A1A1A]">
      {tabs.map((tab) => {
        const isActive = currentView === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            className={`flex-1 px-4 py-3 items-center bg-transparent ${
              isActive && "rounded-3xl bg-white dark:bg-[#2C2C2E]"
            }`}
            disabled={isActive}
            onPress={() => {
              onViewChange(tab.key);
            }}
          >
            <Text
              className={`text-[15px] color-[#8E8E93] font-medium ${
                isActive && "color-[#000000] dark:color-[#FFFFFF]"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
