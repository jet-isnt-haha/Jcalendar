import { Text, View } from "react-native";
import { event } from "./types";

interface EventCardProps {
  event: event;
}

export default function EventCard({ event }: EventCardProps) {
  const { title, startTime, endTime, remark } = event;
  return (
    <View className=" flex-row rounded-2xl justify-between p-3 bg-slate-300 dark:bg-[#78786a]">
      <View className="flex-row">
        {/*  */}
        <View className="w-1 rounded-full mr-3 bg-red-400"></View>
        {/* 日程标题 */}
        <View className="justify-center items-center">
          <Text>{title}</Text>
        </View>
      </View>
      {/* 日程起止日 */}
      <View className="flex-col justify-center items-center">
        <Text>{startTime.getHours() + ":" + startTime.getMinutes()}</Text>
        <Text>{endTime.getHours() + ":" + endTime.getMinutes()}</Text>
      </View>
    </View>
  );
}
