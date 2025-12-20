import { DateField, FormFields } from "@/types";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useForm } from "react-hook-form";

export const useEventForm = () => {
  // 初始化表单
  const form = useForm<FormFields>({
    defaultValues: {
      event_title: "",
      start_time: new Date(),
      end_time: new Date(),
      mark: "",
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const showMode = (field: DateField) => {
    console.log("field ", field);

    // 为当前字段创建专属的回调函数，避免闭包问题
    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === "set" && selectedDate) {
        setValue(field, selectedDate); // 直接使用 field 参数
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
        setValue(field, selectedTime); // 直接使用 field 参数
      }
    };

    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: onDateChange,
      mode: "date",
      is24Hour: true,
    });
  };

  return {
    handleSubmit,
    showMode,
    control,
  };
};
