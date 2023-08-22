"use client";

import { ChildUser, LoggedParent } from "@/lib/types";
import { create } from "zustand";

type State = {
  userType: "parent" | "child" | null;
  parentUser: LoggedParent | null;
  childUser: ChildUser | null;
  requestLoading: boolean;
};

type Actions = {
  setUserType: (userType: "parent" | "child" | null) => void;
  setParentUser: (user: LoggedParent | null) => void;
  setChildUser: (user: ChildUser | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export type Store = State & Actions;

const useStore = create<Store>((set) => ({
  parentUser: null,
  userType: null,
  requestLoading: false,
  childUser: null,
  setUserType: (userType) => set((state) => ({ ...state, userType })),
  setParentUser: (parentUser) => set((state) => ({ ...state, parentUser })),
  setChildUser: (childUser) => set((state) => ({ ...state, childUser })),
  setRequestLoading: (requestLoading) => set((state) => ({ ...state, requestLoading })),
  reset: () => set({ parentUser: null, requestLoading: false, childUser: null, userType: null }),
}));

export default useStore;
