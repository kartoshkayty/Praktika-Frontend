import { UserData } from "@/api/users/me/getMe";
import { create } from "zustand";

export interface UserStore {
  data?: UserData | undefined;
  setData: (data: UserData | undefined) => void;
  clearData: () => void;

  setAvatar: (avatar: string | null) => void;
}

export const normalizeAvatar = (source: string | null) => {
  if (source === null) {
    return source;
  }

  if (["http://", "https://"].some((e) => source.startsWith(e))) {
    return source;
  }

  return `${process.env.NEXT_PUBLIC_API_URL?.replace("api/", "")}${source}`;
};

export const useUserStore = create<UserStore>((set) => ({
  data: undefined,
  setData: (data) => {
    set({
      data:
        data !== undefined
          ? { ...data, avatar: normalizeAvatar(data?.avatar) }
          : undefined,
    });
  },
  setAvatar: (avatar) => {
    set((state) => ({
      data: state.data
        ? { ...state.data, avatar: normalizeAvatar(avatar) }
        : undefined,
    }));
  },
  clearData: () => {
    set({ data: undefined });
  },
}));
