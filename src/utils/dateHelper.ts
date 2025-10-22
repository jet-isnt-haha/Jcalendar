/**
 * dateHelper.ts
 * 包含常用的日期辅助函数。
 */

/**
 * 获取日期的 ISO 8601 标准周数 (1 - 53)。
 * 标准规定：周一为每周第一天；包含当年第一个周四的周为第 1 周。
 * @param date 要计算的日期对象
 * @returns 当年的 ISO 周数 (1 - 53)
 */
export function getISOWeekNumber(date: Date): number {
  // 1. 创建一个日期副本，避免修改原始日期
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // 2. 将日期调整到本周的周四（周四是判断周数的关键）
  // JavaScript 的 getUTCDay()： 0=周日, 1=周一, ..., 6=周六
  // 目标：将 d 调整到本周的周四。
  // (d.getUTCDay() || 7) 将周日(0) 映射为 7。
  // + 4 - (当前周几数字) 确保结果是周四。
  const dayNum = d.getUTCDay() || 7; // 周日转为 7，其他保持 1-6
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // 3. 获取包含当前日期的 ISO 年份的 1 月 1 日
  // 注意：这里用的是调整到周四后的年份！
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // 4. 计算周数
  // (d - yearStart) / 86400000: 计算调整后的周四与当年 1 月 1 日之间的天数差
  // + 1: 加上 1 (因为天数差是从 0 开始的)
  // / 7: 转换为周数
  // Math.ceil(): 向上取整得到最终周数
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return weekNo;
}

/**
 * 获取当前年份
 * @param date
 * @returns 四位数的年份
 */
export function getYear(date: Date): number {
  return date.getFullYear();
}

/**
 * 获取当前月份
 * @param date
 * @returns 1-12的月份
 */
export function getMonth(date: Date): number {
  return date.getMonth() + 1;
}

/**
 * 统一获取日期的年、月、ISO周数。
 * @param date
 * @returns 年、月、周数
 */
export function getDateInfo(date: Date): {
  year: number;
  month: number;
  week: number;
} {
  return {
    year: getYear(date),
    month: getMonth(date),
    week: getISOWeekNumber(date),
  };
}
