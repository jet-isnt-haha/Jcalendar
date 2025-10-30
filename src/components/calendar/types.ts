import { ViewType } from "@/app/(tabs)";
import { HolidaysTypes } from "date-holidays";
import { Solar2lunar } from "solarlunar-es";

export interface DateInfo {
  date: Date;
  lunarInfo?: Solar2lunar;
  holiday?: HolidaysTypes.Holiday[] | false;
}

/** 视图Tab类型定义 */
export interface TabItem {
  key: ViewType;
  label: string;
}
