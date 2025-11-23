//* 创建事件
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormFields = {
  event_title: string;
  start_time: Date;
  end_time: Date;
  mark: string;
};

// 定义当前正在编辑的日期字段类型
type DateField = "start_time" | "end_time";

export default function EventCreate() {
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);
  const [editingField, setEditingField] = useState<DateField>("start_time");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      event_title: "",
      start_time: new Date(),
      end_time: new Date(),
      mark: "",
    },
  });

  const renderMainContent = () => {
    const onSubmit = (data: any) => {
      console.log(data);
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === "set" && selectedDate) {
        setValue(editingField, selectedDate); // 使用 setValue 更新 react-hook-form 的值
        DateTimePickerAndroid.open({
          value: selectedDate,
          onChange: onTimeChange,
          mode: "time",
          is24Hour: true,
        });
      }
    };
    const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
      if (event.type === "set" && selectedTime) {
        setValue(editingField, selectedTime);
      }
    };

    // 显示日期选择器
    const showMode = (field: DateField) => {
      setEditingField(field);
      DateTimePickerAndroid.open({
        value: new Date(),
        onChange: onDateChange,
        mode: "date",
        is24Hour: true,
      });
    };

    return (
      <ScrollView
        className="flex-1 p-8"
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      >
        {/* 标题 */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="event_title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="日程标题"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {/* 开始时间 */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="start_time"
          render={({ field: { value } }) => (
            <Pressable
              onPress={() => showMode("start_time")}
              className="p-2 border border-gray-200 rounded-md my-2"
            >
              <Text>开始时间: {value.toLocaleString()}</Text>
            </Pressable>
          )}
        />
        {/* 结束时间 */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="end_time"
          render={({ field: { value } }) => (
            <Pressable
              onPress={() => showMode("end_time")}
              className="p-2 border border-gray-200 rounded-md my-2"
            >
              <Text>结束时间: {value.toLocaleString()}</Text>
            </Pressable>
          )}
        />

        {/* 备注 */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="mark"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="备注"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={true}
              numberOfLines={4}
            />
          )}
        />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    );
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {/* create-header */}
      <View
        className="flex-row justify-between px-8 py-4 items-center absolute left-0 right-0 z-10"
        style={{ top: insets.top }}
      >
        <Pressable className="">
          <Text className="text-lg font-medium color-blue-500">取消</Text>
        </Pressable>
        <Text className="text-2xl">新建日程</Text>
        <Pressable className="">
          <Text className="text-lg font-medium color-blue-500">完成</Text>
        </Pressable>
      </View>
      {/* create-body */}

      {renderMainContent()}
    </View>
  );
}
