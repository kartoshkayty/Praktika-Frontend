import { getUsers } from "@/api/users/getUsers";
import { UserData } from "@/api/users/me/getMe";
import { create } from "zustand";

interface UsersStore {
  users?: UserData[];
  set: (users: UserData[]) => UserData[];
  add: (user: UserData) => UserData[];
  remove: (userId: number) => UserData[] | undefined;
  update: (userId: number, newData: UserData) => UserData[] | undefined;
  fetch: () => Promise<UserData[]>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  doctors: undefined,
  set: (users: UserData[]) => {
    set({ users });
    return users;
  },
  add: (user: UserData) => {
    set((data) => ({ users: data.users ? [...data.users, user] : [user] }));
    return get().users!;
  },
  remove: (userId: number) => {
    set((data) => ({ users: data.users?.filter((u) => u.id !== userId) }));
    return get().users;
  },
  update: (userId: number, bdata: UserData) => {
    set((data) => {
      const removed = data.users?.filter((u) => u.id !== userId);

      if (removed) {
        removed.push(bdata);
      }

      return { users: removed };
    });

    return get().users;
  },
  fetch: async () => {
    const users = await getUsers().catch(() => []);

    set({ users });
    return users;
  },
}));
