import { Iuser } from "@/interfaces";
import { create } from "zustand";

export interface IUsersGlobalStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
}

const usersGlobalStore = create<IUsersGlobalStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
}));

export default usersGlobalStore;