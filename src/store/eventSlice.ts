import { eventInfo } from "@/types";
import { StateCreator } from "zustand";
import { AppStore } from ".";

export interface EventSlice {
  eventList: eventInfo[];
  addEvent: () => void;
  editEvent: () => void;
  deletEvent: () => void;
  getEventById: (id: Pick<eventInfo, "id">) => void;
}

export const createEventSlice: StateCreator<AppStore, [], [], EventSlice> = (
  set,
  get
) => ({
  eventList: [],
  addEvent: () => {},
  editEvent: () => {},
  deletEvent: () => {},
  getEventById: (id) => {},
});
