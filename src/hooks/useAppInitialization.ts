import { useEffect, useRef } from 'react';

import { InteractionManager } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import useAuthStore from '@src/zustand/auth/authStore';
import { appsFlyerConfig } from '@src/config/appsFlyerConfig';
import useNetworkStore from '@src/zustand/networkStore';
import { isIos } from '@src/utils/platformCheck';
import { indigitallService } from '@src/services/pushNotification/IndigitallService';

/**
 * Dev-only network inspector
 */
const useNetworkActivityDevToolsSafe = () => {
  if (__DEV__) {
    return useNetworkActivityDevTools();
  }
  return null;
};

export const useAppInitialization = () => {
  const { setShowLogoGif, setDeviceId, setHasAppFlyerIsReady } = useAuthStore();

  const { initializeNetworkListener, hasNetworkAvailable } = useNetworkStore();
  /**
   * Prevent multiple SDK initialization (VERY important on iOS)
   */
  const sdkInitializedRef = useRef(false);

  /**
   * Store interaction task reference for cleanup
   */
  const interactionTaskRef = useRef<ReturnType<
    typeof InteractionManager.runAfterInteractions
  > | null>(null);

  // Dev tools
  useNetworkActivityDevToolsSafe();

  /**
   * Show splash gif
   */
  useEffect(() => {
    setShowLogoGif(true);
  }, [setShowLogoGif]);

  /**
   * Orientation + Network listener
   */
  useEffect(() => {
    // iOS stability delay
    if (isIos) {
      setTimeout(() => {
        Orientation.lockToPortrait();
      }, 300);
    } else {
      Orientation.lockToPortrait();
    }
    const unsubscribe = initializeNetworkListener?.();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  /**
   * SDK Initialization (Indigitall + AppsFlyer)
   * Runs ONLY ONCE when internet becomes available
   * Deferred using InteractionManager for smooth UI startup
   */
  useEffect(() => {
    if (!hasNetworkAvailable) return;

    // Prevent multiple initialization
    if (sdkInitializedRef.current) return;

    sdkInitializedRef.current = true;

    /**
     * Register task with InteractionManager
     * Ensures SDK initializes AFTER UI is fully stable
     */
    interactionTaskRef.current = InteractionManager.runAfterInteractions(() => {
      const initializeSDKs = async () => {
        try {
          /**
           * ---------- Indigitall ----------
           */
          if (!isIos) {
            indigitallService.initialize();
          }

          /**
           * ---------- AppsFlyer ----------
           */
          appsFlyer.initSdk(
            appsFlyerConfig,
            async () => {
              const anonId = await DeviceInfo.getUniqueId();

              appsFlyer.setCustomerUserId(anonId);

              setHasAppFlyerIsReady(true);
            },
            () => {}
          );
        } catch {
          // Allow retry if initialization fails
          sdkInitializedRef.current = false;
        }
      };

      /**
       * Small delay improves native bridge stability (especially iOS)
       */
      setTimeout(initializeSDKs, 300);
    });

    /**
     * Cleanup interaction task if component unmounts
     */
    return () => {
      interactionTaskRef.current?.cancel?.();
      interactionTaskRef.current = null;
    };
  }, [hasNetworkAvailable, setDeviceId, setHasAppFlyerIsReady]);
};
