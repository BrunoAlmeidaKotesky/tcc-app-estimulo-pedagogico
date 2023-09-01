"use client";

import { ChildUser, LoggedParent, Updater } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    userType: "parent" | "child" | null;
    parentUser: LoggedParent | null;
    childUser: ChildUser | null;
    requestLoading: boolean;
};

type Actions = {
    setUserType: (userType: "parent" | "child" | null) => void;
    setParentUser: (user: LoggedParent | null) => void;
    setChildUser: Updater<ChildUser>;
    setRequestLoading: (isLoading: boolean) => void;
    reset: (resetUserType: boolean) => void;
}

export type Store = State & Actions;

export const useAppStore = create(
    persist<Store>(
        (set) => ({
            parentUser: null,
            userType: null,
            requestLoading: false,
            childUser: null,
            setUserType: (userType) => set((state) => ({ ...state, userType })),
            setParentUser: (parentUser) => set((state) => ({ ...state, parentUser })),
            setChildUser: (childUser) => set((state) => {
                if (typeof childUser === 'function')
                    return { ...state, childUser: childUser(state?.childUser!) };
                return { ...state, childUser };
            }),
            setRequestLoading: (requestLoading) => set((state) => ({ ...state, requestLoading })),
            reset: (resetUserType) => set((state) => ({
                parentUser: null,
                requestLoading: false,
                childUser: null,
                userType: resetUserType ? null : state.userType
            })),
        }),
        { name: 'app-storage' })
);