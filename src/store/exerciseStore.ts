"use client";

import { Updater } from "@/lib/types";
import { create } from "zustand";

type State = {
  isExerciseAvailableToday: boolean;
  curExerciseIdx: number;
};

type Actions = {
  setIsExerciseAvailable: (v: boolean) => void;
  setCurrentExerciseIdx: Updater<number>;
};

export type ExerciseStore = State & Actions;

export const useExerciseStore = create<ExerciseStore>((set) => ({
  isExerciseAvailableToday: false,
  setIsExerciseAvailable: (v) =>
    set((state) => ({ ...state, isExerciseAvailableToday: v })),
  curExerciseIdx: 0,
  setCurrentExerciseIdx: (v) =>
    set((state) => {
      if (typeof v === "function")
        return { ...state, curExerciseIdx: v(state.curExerciseIdx) };
      return { ...state, curExerciseIdx: v };
    }),
}));
