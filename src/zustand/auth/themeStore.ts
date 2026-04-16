import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { mmkvThemeStorage } from '@src/utils/mmkv';
import constants from '@src/config/constants';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

interface ThemeActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  clearTheme: () => void;
}

const useThemeStore = create<ThemeState & ThemeActions>()(
  immer(
    persist(
      (set) => ({
        theme: constants.SYSTEM,
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),
        clearTheme: () =>
          set((state) => {
            state.theme = constants.SYSTEM;
          })
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => mmkvThemeStorage)
      }
    )
  )
);

export default useThemeStore;
