import { ViewType } from "@/app/(tabs)";
import { useCallback, useState } from "react";

export function useViewCache(initialView: ViewType = "month") {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);

  const [renderedViews, setRenderedViews] = useState<Set<ViewType>>(
    new Set([initialView])
  );

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    setRenderedViews((prev) => new Set(prev).add(view));
  }, []);

  const isViewRendered = useCallback(
    (view: ViewType) => renderedViews.has(view),
    [renderedViews]
  );

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
