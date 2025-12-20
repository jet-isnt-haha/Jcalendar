//* 创建事件
import EventForm from "@/components/EventForm";
import { useEventForm } from "@/hooks/useEventCreate";
import { FormFields } from "@/types";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventCreate() {
  const insets = useSafeAreaInsets();

  const { handleSubmit, showMode, control } = useEventForm();

  const onSubmit = (data: FormFields) => {
    console.log(data);
  };
  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* create-header */}
      <View
        className="flex-row justify-between px-8 py-4 items-center absolute left-0 right-0 z-10"
        style={{ top: insets.top }}
      >
        <Pressable className="" onPress={() => router.back()}>
          <Text className="text-lg font-medium color-blue-500">取消</Text>
        </Pressable>
        <Text className="text-2xl">新建日程</Text>
        <Pressable
          className=""
          onPress={() => {
            //handleSubmit(onSubmit)会返回一个函数
            handleSubmit(onSubmit)();
            router.back();
          }}
        >
          <Text className="text-lg font-medium color-blue-500">完成</Text>
        </Pressable>
      </View>
      {/* create-body */}
      <ScrollView
        className="flex-1 p-8"
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      >
        <EventForm showMode={showMode} control={control} />
      </ScrollView>
    </View>
  );
}
