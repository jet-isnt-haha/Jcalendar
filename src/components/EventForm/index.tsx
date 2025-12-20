import { DateField, FormFields } from "@/types";
import { Control, Controller } from "react-hook-form";
import { Pressable, Text, TextInput } from "react-native";

interface EventFormProps {
  showMode: (field: DateField) => void;
  control: Control<FormFields, any, FormFields>;
}

export default function EventForm(PropsData: EventFormProps) {
  const { showMode, control } = PropsData;

  return (
    <>
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
        render={({ field: { value } }) => {
          console.log("start-field-value ", value);
          return (
            <Pressable
              onPress={() => showMode("start_time")}
              className="p-2 border border-gray-200 rounded-md my-2"
            >
              <Text>开始时间: {value.toLocaleString()}</Text>
            </Pressable>
          );
        }}
      />
      {/* 结束时间 */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="end_time"
        render={({ field: { value } }) => {
          console.log("end-field-value ", value);
          return (
            <Pressable
              onPress={() => showMode("end_time")}
              className="p-2 border border-gray-200 rounded-md my-2"
            >
              <Text>结束时间: {value.toLocaleString()}</Text>
            </Pressable>
          );
        }}
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
    </>
  );
}
