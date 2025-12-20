import { HolidaysTypes } from "date-holidays";
import { Solar2lunar } from "solarlunar-es";
import { ViewType } from "~/(tabs)";

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

/**
 * 日程类型定义
 */
export interface event {
  title: string;
  startTime: Date;
  endTime: Date;
  remark: string;
}

export interface eventInfo {
  id: number;
  event: event;
}
