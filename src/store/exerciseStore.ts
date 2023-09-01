"use client";

import { Updater } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    isExerciseAvaibleToday: boolean;
    curExerciseIdx: number;
};

type Actions = {
    setIsExerciseAvailable: (v: boolean) => void;
    setCurrentExerciseIdx: Updater<number>;
}

export type ExerciseStore = State & Actions;

export const useExerciseStore = create(
    persist<ExerciseStore>(
        (set) => ({
            isExerciseAvaibleToday: false,
            setIsExerciseAvailable: (v) => set((state) => ({ ...state, isExerciseAvaibleToday: v })),
            curExerciseIdx: 0,
            setCurrentExerciseIdx: (v) => set((state) => {
                if (typeof v === 'function')
                    return { ...state, curExerciseIdx: v(state.curExerciseIdx) };
                return { ...state, curExerciseIdx: v };
            }),
        }),
        { name: 'app-storage-exercises' })
);