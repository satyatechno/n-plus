import Config from 'react-native-config';
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const themeStorage = new MMKV({
  id: 'theme-storage'
});

export const mmkvThemeStorage: StateStorage = {
  setItem: (name: string, value: string) => themeStorage.set(name, value),
  getItem: (name: string) => {
    const value = themeStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => themeStorage.delete(name)
};

export const authStorage = new MMKV({
  id: 'auth-storage',
  encryptionKey: Config.MMKV_AUTH_STORAGE_ENCRYPTION_KEY
});

export const mmkvAuthStorage: StateStorage = {
  setItem: (name, value) => authStorage.set(name, value),
  getItem: (name) => authStorage.getString(name) ?? null,
  removeItem: (name) => authStorage.delete(name)
};

export const settingsStorage = new MMKV({ id: 'settings-storage' });

export const clearCache = () => {
  settingsStorage.clearAll();
};

export const mmkvSettingsStorage: StateStorage = {
  setItem: (name: string, value: string) => settingsStorage.set(name, value),
  getItem: (name: string) => settingsStorage.getString(name) ?? null,
  removeItem: (name: string) => settingsStorage.delete(name)
};

export const videoPlayerStorage = new MMKV({ id: 'video-player-storage' });
export const mmkvVideoPlayerStorage: StateStorage = {
  setItem: (name: string, value: string) => videoPlayerStorage.set(name, value),
  getItem: (name: string) => {
    const value = videoPlayerStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => videoPlayerStorage.delete(name)
};
