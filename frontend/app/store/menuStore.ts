import { create } from "zustand";

interface MenuStore {
  isActive: boolean;
  toggleMenu: () => void;
  setActive: (_value: boolean) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isActive: false,
  toggleMenu: () => set((state) => ({ isActive: !state.isActive })),
  setActive: (_value) => set({ isActive: _value }),
}));
