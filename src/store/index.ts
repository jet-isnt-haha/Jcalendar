import { create } from "zustand";

type EventSlice = {
  events?: any[];
  addEvent?: (e: any) => void;
  removeEvent?: (id: string) => void;
};

export type AppStore = EventSlice;

export const useAppStore = create<AppStore>()((set, get) => ({
  events: [],
}));
