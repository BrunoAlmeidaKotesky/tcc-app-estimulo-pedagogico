"use client";

import { ChildUser, LoggedParent } from "@/lib/types";
import { create } from "zustand";

type Store = {
  parentUser: LoggedParent | null;
  childUser: ChildUser | null;
  requestLoading: boolean;
  setParentUser: (user: LoggedParent | null) => void;
  setChildUser: (user: ChildUser | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
  reset: () => void;
};

const useStore = create<Store>((set) => ({
  parentUser: null,
  requestLoading: false,
  childUser: null,
  setParentUser: (parentUser) => set((state) => ({ ...state, parentUser })),
  setChildUser: (childUser) => set((state) => ({ ...state, childUser })),
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
  reset: () => set({ parentUser: null, requestLoading: false, childUser: null }),
}));

export default useStore;
