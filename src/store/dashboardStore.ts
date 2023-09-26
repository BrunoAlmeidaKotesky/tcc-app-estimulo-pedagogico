"use client";

import { Updater } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  selectedChild: string;
  isEveryChild: boolean;
  generatedColors: string[];
};

type Actions = {
  setSelectedChild: (Value: string) => void;
  setIsEveryChild: (value: boolean) => void;
  setGeneratedColors: (value: string[]) => void;
};

export type DashboardStore = State & Actions;

export const useDashboardStore = create<DashboardStore>()((set) => ({
  selectedChild: "Todos os filhos",
  setSelectedChild: (child) =>
    set((state) => {
      return { ...state, selectedChild: child };
    }),
  isEveryChild: true,
  setIsEveryChild: (value) => set({ isEveryChild: value }),
  generatedColors: [],
  setGeneratedColors: (colors) =>
    set((state) => ({ ...state, generatedColors: colors })),
}));
