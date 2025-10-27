# Jcalendar 开发文档

> **项目版本**: 1.0.0  
> **最后更新**: 2025-10-25  
> **开发框架**: React Native + Expo

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [架构设计](#架构设计)
4. [功能模块](#功能模块)
5. [技术实现](#技术实现)
6. [开发指南](#开发指南)
7. [待开发功能](#待开发功能)

---

## 项目概述

### 产品定位

Jcalendar 是一款跨平台的日历应用，支持 iOS、Android 和 Web。它提供多视图模式（年/月/周/日/日程），并集成中国农历和法定节假日显示。

### 核心特性

- ✅ 多视图切换（年/月/周/日/日程）
- ✅ 中文农历显示
- ✅ 中国法定节假日标注
- ✅ 深色模式支持
- ✅ 流畅的视图切换动画
- 🚧 事件管理（待开发）
- 🚧 日程提醒（待开发）

---

## 技术栈

### 核心框架

```json
{
  "运行时": "React 19.1.0",
  "框架": "React Native 0.81.5",
  "路由": "Expo Router 6.0.10",
  "样式": "NativeWind 4.2.1 (Tailwind CSS)",
  "开发平台": "Expo 54.0.19"
}
```

### 关键依赖

| 库名                      | 版本   | 用途             |
| ------------------------- | ------ | ---------------- |
| `date-fns`                | 4.1.0  | 日期计算和格式化 |
| `solarlunar-es`           | 1.0.9  | 农历转换         |
| `date-holidays`           | 3.26.2 | 节假日查询       |
| `react-native-reanimated` | 4.1.3  | 动画引擎         |
| `@expo/vector-icons`      | 15.0.2 | 图标库           |

---

## 架构设计

### 目录结构

```
Jcalendar/
├── app/                    # 路由页面
│   ├── (tabs)/            # Tab 导航页面
│   │   ├── index.tsx      # 首页（日历主界面）
│   │   └── setting.tsx    # 设置页
│   ├── event/             # 事件相关页面（模态）
│   │   ├── [id].tsx       # 事件详情
│   │   ├── create.tsx     # 创建事件
│   │   └── edit/[id].tsx  # 编辑事件
│   └── _layout.tsx        # 根布局
├── src/
│   ├── components/        # 可复用组件
│   │   └── calendar/      # 日历组件
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定义 Hooks
│   ├── styles/            # 主题配置
│   └── utils/             # 工具函数
└── assets/                # 静态资源
```

### 数据流

```
用户交互
   ↓
组件状态 (useState/useCallback)
   ↓
自定义 Hooks (业务逻辑封装)
   ↓
工具函数 (纯函数计算)
   ↓
UI 渲染 (React Native 组件)
```

---

## 功能模块

### 1. 日历主界面 (`app/(tabs)/index.tsx`)

**功能描述**  
显示日历的主视图，支持 5 种视图模式切换。

**状态管理**

- `selectedDate`: 当前选中的日期
- `currentView`: 当前激活的视图类型
- `renderedViews`: 已渲染过的视图缓存

**组件树**

```
HomeScreen
├── CalendarHeader (顶部标题栏)
├── ViewTabs (视图切换 Tab)
└── 视图容器
    ├── MonthView (月视图) ✅
    ├── WeekView (周视图) 🚧
    ├── YearView (年视图) 🚧
    ├── DayView (日视图) 🚧
    └── AgendaView (日程视图) 🚧
```

---

### 2. 月视图 (`src/components/calendar/MonthView.tsx`)

**核心功能**

- 显示当前月份的日历网格
- 支持横向滑动切换月份（前/当前/后 三个月预加载）
- 显示农历日期和节假日信息

**技术实现**

#### 2.1 日期网格生成

```typescript
// 关键函数：generateMonthWeeks
const generateMonthWeeks = (date: Date) => {
  // 1. 获取月份起止日期
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  // 2. 扩展到完整周（包括上月尾和下月头）
  const calendarStart = startOfWeek(monthStart, { locale: zhCN });
  const calendarEnd = endOfWeek(monthEnd, { locale: zhCN });

  // 3. 生成日期区间
  const allDates = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 4. 按周分组（7 天一组）
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }
  return weeks;
};
```

#### 2.2 性能优化策略

**FlatList 配置**

```typescript
{
  monthArr !== undefined && (
    <FlatList
      // ==================== 数据源 ====================
      data={monthArr}
      renderItem={renderMonth}
      keyExtractor={(item, index) => {
        const firstDayOfMonth = item[0].find((date) => date.getDate() === 1);
        if (firstDayOfMonth) {
          return `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth()}`;
        }
        return index.toString();
      }}
      // ==================== 布局方向 ====================
      horizontal={true} // 横向滚动
      // ==================== 分页行为 ====================
      pagingEnabled={true} // 开启分页模式
      snapToInterval={monthItemWidth} // 每次滑动一个屏幕宽度
      snapToAlignment="start" // 对齐到起始位置
      disableIntervalMomentum={true} // 禁用连续滑动（每次只滑一页）
      // ==================== 滑动体验 ====================
      decelerationRate="fast" // 快速减速停止
      showsHorizontalScrollIndicator={false} // 隐藏横向滚动条
      // ==================== 性能优化（渲染策略） ====================
      updateCellsBatchingPeriod={200} // 批量更新间隔200ms
      removeClippedSubviews={false} // 不移除屏幕外视图（避免闪烁）
      // ==================== 性能优化（布局计算） ====================
      getItemLayout={(_, index) => ({
        // 预定义项目尺寸（跳过测量）
        length: monthItemWidth, // 每项宽度
        offset: monthItemWidth * index, // 偏移量
        index, // 索引
      })}
      initialScrollIndex={monthArr.length / 2 - 1} // 初始滚动到第1个项目（从中间开始）
      // ==================== 添加month事件并回滚 ====================
      ref={monthFlatListRef}
      onStartReachedThreshold={0.5}
      onStartReached={unshiftMonth}
      onEndReachedThreshold={0.5}
      onEndReached={appendMonth}
    />
  );
}
```

**组件缓存**

- 使用 `memo` 缓存 `MonthGrid` 组件
- 使用 `useMemo` 缓存月份数据
- 使用 `useCallback` 缓存渲染函数

#### 2.3 月视图的动态加载

```typescript

/**
   * 添加新month到monthArr的头部
   * @param info
   * @returns {void}
   */
  const unshiftMonth = (info: { distanceFromStart: number }) => {
    if (monthArr === undefined) return;
    console.log("unshift");
    const index = 0;
    const startIndexDate = monthArr[index][0].find(
      (date) => date.getDate() === 1
    );

    if (startIndexDate === undefined) return;
    const newMonthArr = [
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 3, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 2, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() - 1, 1)
      ),
    ];

    setMonthArr([...newMonthArr, ...monthArr]);

    setMovedIndex(index + newMonthArr.length);
  };
  /**
   * 添加新month到monthArr的尾部
   * @param info
   * @returns {void}
   */
  const appendMonth = (info: { distanceFromEnd: number }) => {
    if (monthArr === undefined) return;
    const index = monthArr!.length - 1;
    console.log("append");
    const startIndexDate = monthArr[index][0].find(
      (date) => date.getDate() === 1
    );
    if (startIndexDate === undefined) return;
    const newMonthArr = [
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 1, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 2, 1)
      ),
      generateMonthWeeks(
        new Date(startIndexDate.getFullYear(), startIndexDate.getMonth() + 3, 1)
      ),
    ];

    setMonthArr([...monthArr, ...newMonthArr]);
    setMovedIndex(index);
  };

  /**
   * 确保渲染新monthArr回退到原index
   */
  useLayoutEffect((): void => {
    if (
      movedIndex !== undefined &&
      monthArr !== undefined &&
      monthFlatListRef.current !== undefined
    ) {
      monthFlatListRef.current?.scrollToIndex({
        index: movedIndex,
        animated: false,
      });
    }
  }, [monthArr, movedIndex]);


//FlatList内部
 // ==================== 添加month事件并回滚 ====================
          ref={monthFlatListRef}
          onStartReachedThreshold={0.5}
          onStartReached={unshiftMonth}
          onEndReachedThreshold={0.5}
          onEndReached={appendMonth}
```

**存在问题**
`Expo Go` 端动态加载缓慢容易报错,渲染不稳定易出现闪烁

---

### 3. 日期单元格 (`src/components/calendar/DateCell.tsx`)

**显示内容**

1. 公历日期（数字）
2. 农历日期或节假日名称
3. 选中状态高亮
4. 当日标记（蓝色）

**状态样式**

```typescript
// 优先级：今日选中 > 普通选中 > 今日 > 普通
<View
  className={`w-8 h-8 rounded-2xl items-center justify-center mb-0.5  ${
    isSelected && !isToday && "bg-[#696969] dark:bg-[#adb7c2]"
  } ${isToday && isSelected && "bg-[#2b7df8] dark:bg-[#2b7df8]"}`}
>
  <Text
    className={`text-[17px] font-medium  dark:text-white ${
      isSelected && "text-white "
    }  ${isToday && !isSelected && "text-[#007AFF] dark:text-[#007AFF]"} `}
  >
    {dayNumber}
  </Text>
</View>
```

---

### 4. 视图切换系统

#### 4.1 视图缓存 Hook (`src/hooks/useViewCache.ts`)

**设计目标**  
避免重复渲染已访问的视图，提升切换性能。

**实现原理**

```typescript
export function useViewCache(initialView: ViewType = "month") {
  const [currentView, setCurrentView] = useState(initialView);
  const [renderedViews, setRenderedViews] = useState(new Set([initialView]));

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    // 将新视图加入已渲染集合（不会重复添加）
    setRenderedViews((prev) => new Set(prev).add(view));
  };

  return {
    currentView,
    isViewRendered: (view) => renderedViews.has(view),
    isViewActive: (view) => currentView === view,
    handleViewChange,
  };
}
```

**使用示例**

```typescript
// 只渲染已访问过的视图
{
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
  );
}
```

#### 4.2 视图 Tab 组件 (`src/components/calendar/ViewTabs.tsx`)

**交互特性**

- 激活状态：白色背景 + 黑色文字
- 非激活状态：透明背景 + 灰色文字
- 禁用已激活 Tab 的点击（防止重复触发）

---

### 5. 工具函数库 (`src/utils/dateHelper.ts`)

#### 5.1 ISO 8601 周数计算

```typescript
export function getISOWeekNumber(date: Date): number {
  // 标准规定：周一为第一天，包含第一个周四的周为第 1 周
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // 调整到周四

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
```

#### 5.2 农历转换

```typescript
export function getLunarDate(date: Date) {
  return solarlunar.solar2lunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}
// 返回：{ lDay: 15, monthCn: "十月", dayCn: "十五", ... }
```

#### 5.3 节假日查询

```typescript
export function getHoliday_CN(date: Date) {
  const hd = new Holidays("CN");
  return hd.isHoliday(date);
}
// 返回：[{ name: "国庆节", type: "public" , ...}] 或 false
```

---

## 技术实现

### 1. 深色模式

**实现方案**  
使用 NativeWind 的 `useColorScheme` Hook 管理主题。

```typescript
import { useColorScheme } from "nativewind";

const { colorScheme, toggleColorScheme } = useColorScheme();

// 样式绑定
<View className="bg-white dark:bg-black">
  <Text className="text-black dark:text-white">Hello</Text>
</View>;
```

**配置文件** (`tailwind.config.js`)

```javascript
module.exports = {
  darkMode: "class", // 启用类名模式
  // ...
};
```

---

### 2. 路由系统

**Expo Router 文件路由**

| 文件路径                  | 路由              | 说明             |
| ------------------------- | ----------------- | ---------------- |
| `app/(tabs)/index.tsx`    | `/`               | 首页（Tab 内）   |
| `app/(tabs)/setting.tsx`  | `/setting`        | 设置页（Tab 内） |
| `app/event/create.tsx`    | `/event/create`   | 创建事件（模态） |
| `app/event/[id].tsx`      | `/event/123`      | 事件详情（模态） |
| `app/event/edit/[id].tsx` | `/event/edit/123` | 编辑事件（模态） |

**布局嵌套**

```
_layout.tsx (根布局)
└── (tabs)/_layout.tsx (Tab 导航)
    ├── index.tsx
    └── setting.tsx
```

---

### 3. 性能优化总结

| 优化点   | 实现方式                     | 效果           |
| -------- | ---------------------------- | -------------- |
| 视图缓存 | `useViewCache` Hook          | 避免重复渲染   |
| 组件缓存 | `memo`                       | 减少子组件更新 |
| 计算缓存 | `useMemo`                    | 避免重复计算   |
| 函数缓存 | `useCallback`                | 避免重复创建   |
| 列表优化 | `FlatList` + `getItemLayout` | 提升滚动性能   |
| 预加载   | 前后月份预渲染               | 减少切换延迟   |

---

## 开发指南

### 环境搭建

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm expo start
```

### 代码规范

#### 组件命名

- 文件名：PascalCase（如 `MonthView.tsx`）
- 组件导出：默认导出
- Props 接口：`组件名 + Props`

#### 样式约定

```typescript
// ✅ 推荐：使用 Tailwind 类名
<View className="flex-1 bg-white dark:bg-black" />

// ❌ 避免：内联样式
<View style={{ flex: 1, backgroundColor: '#fff' }} />
```

#### 注释规范

```typescript
/**
 * 组件功能描述
 *
 * @param props - 参数说明
 * @returns 返回值说明
 */
```

---

### 添加新视图的步骤

假设要添加**周视图**：

1. **创建组件** (`src/components/calendar/WeekView.tsx`)

```typescript
interface WeekViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function WeekView({ selectedDate }: WeekViewProps) {
  return <View className="flex-1">{/* 实现周视图 */}</View>;
}
```

2. **注册到 viewComponents** (`app/(tabs)/index.tsx`)

```typescript
const viewComponents = useMemo(
  () => ({
    month: <MonthView />,
    week: (
      <WeekView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
    ), // 新增
    // ...
  }),
  [selectedDate]
);
```

3. **更新渲染列表**

```typescript
const renderView = () =>
  (["month", "week", "year", "day", "agenda"] as const)
    .map
    // 确保 'week' 在数组中
    ();
```

---

## 待开发功能

### 高优先级

- [ ] **周视图**：显示一周的日期和事件
- [ ] **日视图**：显示单日的时间轴和事件
- [ ] **事件管理**：增删改查事件
- [ ] **本地存储**：使用 AsyncStorage 持久化数据

### 中优先级

- [ ] **年视图**：显示 12 个月的缩略日历
- [ ] **日程视图**：列表展示所有事件
- [ ] **事件提醒**：本地通知功能
- [ ] **日历同步**：接入系统日历 API

### 低优先级

- [ ] **主题定制**：自定义颜色方案
- [ ] **多语言支持**：国际化 (i18n)
- [ ] **手势优化**：双指缩放切换视图
- [ ] **数据导入导出**：iCal 格式支持

---

## 附录

### 常见问题

**Q: 为什么月视图滑动会卡顿？**  
A: 检查 `FlatList` 的 `removeClippedSubviews` 是否设为 `false`，设为 `true` 可能导致滑动时内容闪烁。

**Q: 如何调试深色模式样式？**  
A: 在 `CalendarHeader` 中点击折叠按钮可手动切换主题。

**Q: 农历显示不正确？**  
A: 检查 `solarlunar-es` 的日期参数是否为 `getMonth() + 1`（月份从 0 开始）。

---

### 更新日志

#### v1.0.0 (2025-10-25)

- ✅ 实现月视图基础功能
- ✅ 集成农历和节假日显示
- ✅ 深色模式支持
- ✅ 视图切换系统

---

**文档维护者**: jet-isnt-haha
**联系方式**: [Jcalendar](https://github.com/jet-isnt-haha/Jcalendar)
