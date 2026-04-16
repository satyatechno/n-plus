import { useEffect } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { InteractionManager } from 'react-native';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

/**
 * A hook that watches for changes in the device's wifi connection status and
 * updates the settings store accordingly.
 *
 * @returns {void} A function that unsubscribes the NetInfo event listener.
 */

export const useWifiWatcher = () => {
  const setIsWifiConnected = useSettingsStore((s) => s.setIsWifiConnected);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Defer initial NetInfo work until after initial interactions
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      NetInfo.fetch().then((state) => {
        setIsWifiConnected(state.type === 'wifi' && state.isConnected);
      });

      unsubscribe = NetInfo.addEventListener((state) => {
        setIsWifiConnected(state.type === 'wifi' && state.isConnected);
      });
    });

    return () => {
      interactionHandle.cancel?.();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setIsWifiConnected]);
};
