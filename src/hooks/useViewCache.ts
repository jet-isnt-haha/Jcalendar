import { ViewType } from "@/app/(tabs)";
import { useCallback, useState } from "react";

/**
 * 视图缓存Hook
 *
 * 用于管理日历视图切换和缓存，避免重复渲染已访问的视图
 *
 *
 * @param initialView - 初始显示的视图类型，默认为 "month"
 * @returns {Object} 返回视图管理对象
 * @returns {ViewType} currentView - 当前激活的视图类型
 * @returns {Function} isViewRendered - 判断视图是否已渲染
 * @returns {Function} isViewActive - 判断视图是否为激活状态
 */
export function useViewCache(initialView: ViewType = "month") {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);

  const [renderedViews, setRenderedViews] = useState<Set<ViewType>>(
    new Set([initialView])
  );

  /**
   * 切换当前视图并将其添加到已渲染列表
   * @param view - 要切换的视图类型
   */
  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    setRenderedViews((prev) => new Set(prev).add(view));
  }, []);

  /**
   * 检查指定视图是否已被渲染过
   * @param view - 要检查的视图类型
   * @returns {boolean}
   */
  const isViewRendered = useCallback(
    (view: ViewType) => renderedViews.has(view),
    [renderedViews]
  );

  /**
   * 检查指定视图是否为当前激活状态
   * @param view -要检查的视图类型
   * @returns {boolean}
   */
  const isViewActive = useCallback(
    (view: ViewType) => currentView === view,
    [currentView]
  );

  return {
    currentView,
    handleViewChange,
    isViewActive,
    isViewRendered,
  };
}
