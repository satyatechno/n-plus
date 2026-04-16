import { Push } from 'indigitall-react-native-plugin';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import useAuthStore from '@src/zustand/auth/authStore';
import { DeviceTokenService } from '@src/services/api/DeviceTokenService';

export interface IPushNotificationService {
  initialize(): void;
  requestPermission(): NodeJS.Timeout | void;
}

class IndigitallPushService implements IPushNotificationService {
  public initialize(): void {
    const handleDeviceRegistered = (device: { deviceId: string }) => {
      if (device?.deviceId) {
        useAuthStore.getState().setDeviceId(device.deviceId);
        DeviceTokenService.storeToken(device.deviceId).catch(() => {});
      }
    };

    Push.init(
      {
        appKey: Config.INDIGITALL_APP_KEY || '',
        senderId: Config.FIREBASE_SENDER_ID || '',
        urlDeviceApi: 'https://am1.device-api.indigitall.com/v1',
        autoRequestPushPermission: Platform.OS === 'ios',
        requestLocation: false
      } as Parameters<typeof Push.init>[0] & { requestLocation?: boolean },
      handleDeviceRegistered,
      handleDeviceRegistered, // onNewUser triggered when a new device is registered on indigitall
      () => {
        // Failure callback intentionally left empty (non-critical)
      }
    );
  }

  public requestPermission(): NodeJS.Timeout | void {
    if (Platform.OS === 'android' && typeof Push.requestPushPermission === 'function') {
      // Small delay to ensure UI stability after navigation/auth updates
      return setTimeout(() => {
        try {
          Push.requestPushPermission();
        } catch {
          // Ignored intentionally: Silent failure is allowed if the native permission prompt fails or is preemptively denied
        }
      }, 3000);
    } else if (Platform.OS === 'ios') {
      // For iOS, the push permission natively triggers upon SDK initialization.
      // We deferred its initialization until this moment exactly to orchestrate the prompt timing.
      this.initialize();
    }
  }
}

export const indigitallService = new IndigitallPushService();
