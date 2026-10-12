"use client";

import { AuthData, getAuthData, setAuthData } from "@/helpers/authStorage";
import { create } from "zustand";

interface AuthStore {
  access_token?: string;
  refresh_token?: string;

  authificated: boolean;

  setAuthificated: (authificated: boolean) => void;

  setAuthData: (data: AuthData | undefined) => void;
  clearAuthData: () => void;

  update: () => AuthData | undefined;
}

export const useAuthStore = create<AuthStore>((set) => ({
  access_token: undefined,
  refresh_token: undefined,
  authificated: false,

  setAuthificated: (data) => {
    set({ authificated: data });
  },

  setAuthData: (data) => {
    setAuthData(data);
    set({
      access_token: data?.access_token,
      refresh_token: data?.refresh_token,
    });
  },

  clearAuthData: () => {
    setAuthData(undefined);
    set({ access_token: undefined, refresh_token: undefined });
  },

  update: () => {
    const data = getAuthData();
    set({
      access_token: data?.access_token,
      refresh_token: data?.refresh_token,
    });

    return data;
  },
}));
