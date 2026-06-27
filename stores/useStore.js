// stores/useStore.js — Zustand 5 (same runtime JS API as v4)
import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
