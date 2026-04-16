import { create } from 'zustand';
import Geofencing, { Authorization } from '@rn-org/react-native-geofencing';
import { NativeModules, Platform, Linking } from 'react-native';

const { MockLocation } = NativeModules;
const blockedCountry = ['US'];

const isFakeLocation = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  try {
    return await MockLocation.isLocationMocked();
  } catch {
    return false;
  }
};

type LocationStore = {
  permissionDenied: boolean;
  isLocationBlocked: boolean;
  setLocationBlocked: (blocked: boolean) => void;
  requestLocation: () => Promise<void>;
  checkLocationIsBlocked: () => Promise<void>;
  openSettings: () => void;
};

export const useLocationStore = create<LocationStore>((set, get) => ({
  permissionDenied: true,
  isLocationBlocked: false,
  setLocationBlocked: (blocked) => set({ isLocationBlocked: blocked }),

  requestLocation: async () => {
    try {
      const status = await Geofencing.getLocationAuthorizationStatus();

      if (status === Authorization.Always || status === Authorization.WhenInUse) {
        set({ permissionDenied: false });
      } else {
        set({ permissionDenied: true });

        const request = await Geofencing.requestLocation({
          allowAlways: true,
          allowWhileUsing: true
        });

        set({ permissionDenied: !request.success });
      }
    } catch {
      // Error handle for request location permission
    }
  },

  checkLocationIsBlocked: async () => {
    try {
      const { permissionDenied, requestLocation } = get();

      if (permissionDenied) {
        await requestLocation();
      }

      const IsFake = await isFakeLocation();
      if (IsFake) {
        set({ isLocationBlocked: true });
        return;
      }

      const location = await Geofencing.getCurrentLocation();

      set({
        isLocationBlocked: blockedCountry.includes(location.isoCountryCode)
      });
    } catch {
      // Error handle for get user current location
    }
  },

  openSettings: () => {
    Linking.openSettings();
  }
}));
