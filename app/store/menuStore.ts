import { create } from 'zustand';

interface MenuStore {
  isActive: boolean;
  toggleMenu: () => void;
  setActive: (value: boolean) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isActive: false,
  toggleMenu: () => set((state) => ({ isActive: !state.isActive })),
  setActive: (value) => set({ isActive: value }),
}));