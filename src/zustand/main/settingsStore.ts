import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvSettingsStorage } from '@src/utils/mmkv';
import { TextSize } from '@src/models/main/MyAccount/Settings';
import { VideoAutoPlay } from '@src/config/constants';

type SettingsState = {
  textSize: TextSize;
  videoAutoPlay: string;
  isImageDownloadEnabled: boolean;
  lastCustomSize: TextSize;
  systemFontScale: number;
  setTextSize: (size: TextSize) => void;
  setVideoAutoPlay: (value: string) => void;
  setIsImageDownloadEnabled: (value: boolean) => void;
  setLastCustomSize: (value: TextSize) => void;
  setSystemFontScale: (value: number) => void;
  isWifiConnected: boolean;
  setIsWifiConnected: (value: boolean) => void;
  shouldAutoPlay: () => boolean;
  clearSettings: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      textSize: 'Mediana',
      videoAutoPlay: 'Solo con Wi-Fi',
      isImageDownloadEnabled: true,
      lastCustomSize: 'Mediana',
      systemFontScale: 1,
      isWifiConnected: false,

      setTextSize: (size) => {
        if (size !== 'System') {
          set({ lastCustomSize: size });
        }
        set({ textSize: size });
      },

      setVideoAutoPlay: (value) => set({ videoAutoPlay: value }),
      setIsImageDownloadEnabled: (value) => set({ isImageDownloadEnabled: value }),
      setLastCustomSize: (value) => set({ lastCustomSize: value }),
      setSystemFontScale: (value) => set({ systemFontScale: value }),
      setIsWifiConnected: (value) => set({ isWifiConnected: value }),
      shouldAutoPlay: () => {
        const { videoAutoPlay, isWifiConnected } = get();
        if (videoAutoPlay === VideoAutoPlay.NEVER) return false;
        if (videoAutoPlay === VideoAutoPlay.ALWAYS) return true;
        if (videoAutoPlay === VideoAutoPlay.WIFI_ONLY) return isWifiConnected;
        return false;
      },
      clearSettings: () => {
        // Reset settings to default values
        set({
          textSize: 'Mediana',
          videoAutoPlay: 'Solo con Wi-Fi',
          isImageDownloadEnabled: true,
          lastCustomSize: 'Mediana',
          systemFontScale: 1,
          isWifiConnected: false
        });
      }
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => mmkvSettingsStorage)
    }
  )
);
