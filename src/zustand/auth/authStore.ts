import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { mmkvAuthStorage } from '@src/utils/mmkv';

interface AuthState {
  authToken: string | null;
  refreshToken: string | null;
  guestId: string | null;
  guestToken?: string | null;
  guestRefreshToken?: string | null;
  passwordToken?: string | null;
  xApiKey?: string | null;
  isTutorialShow: boolean;
  showLogoGif?: boolean | null;
  isLogin: boolean;
  userId: string | null;
  signInUsingSocialMedia: boolean;
  hasShownSplashAnimation?: boolean;
  isOnboardingRegistration?: boolean;
  showLogin?: boolean;
  deviceId?: string | null;
  hasHydrated: boolean;
  hasAppFlyerIsReady: boolean;
  analyticsInstanceId: string;
  emailSHA256: string;
}

interface AuthActions {
  setIsLogin: (value: boolean) => void;
  setTokens: (authToken: string, refreshToken: string, xApiKey?: string | null) => void;
  setGuestTokens: (guestToken: string, guestRefreshToken: string, xApiKey?: string | null) => void;
  clearGuestToken: () => void;
  clearGuestId: () => void;
  setMfaToken: (mfaToken: string | null) => void;
  setXApiKey: (xApiKey: string | null) => void;
  clearAuth: (showLogin?: boolean) => void;
  setIsTutorialShow: (value: boolean) => void;
  setGuestToken: (token: string) => void;
  setAuthToken: (token: string) => void;
  setPasswordToken?: (token: string) => void;
  setShowLogoGif: (value: boolean) => void;
  mfaToken?: string | null;
  setUserId: (userId: string) => void;
  setSignInUsingSocialMedia: (value: boolean) => void;
  setHasShownSplashAnimation: (value: boolean) => void;
  setIsOnboardingRegistration: (value: boolean) => void;
  setDeviceId: (deviceId: string) => void;
  setHasHydrated: (value: boolean) => void;
  setGuestId: (guestId: string) => void;
  setHasAppFlyerIsReady: (value: boolean) => void;
  setAnalyticsInstanceId: (value: string) => void;
  setEmailSHA256: (value: string) => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  immer(
    persist(
      (set) => ({
        isLogin: false,
        authToken: null,
        isTutorialShow: true,
        refreshToken: null,
        passwordToken: null,
        guestId: null,
        guestRefreshToken: null,
        xApiKey: null,
        signInUsingSocialMedia: false,
        showLogoGif: true,
        userId: null,
        hasShownSplashAnimation: false,
        isOnboardingRegistration: false,
        showLogin: false,
        hasHydrated: false,
        hasAppFlyerIsReady: false,
        analyticsInstanceId: '',
        emailSHA256: '',
        setPasswordToken: (token) =>
          set((state) => {
            state.passwordToken = token;
          }),
        setSignInUsingSocialMedia: (value) =>
          set((state) => {
            state.signInUsingSocialMedia = value;
          }),
        setShowLogoGif: (value) =>
          set((state) => {
            state.showLogoGif = value;
          }),
        setTokens: (authToken, refreshToken, xApiKey) => {
          set((state) => {
            state.authToken = authToken;
            state.refreshToken = refreshToken;
            if (xApiKey !== undefined) {
              state.xApiKey = xApiKey;
            }
          });
        },
        setGuestTokens: (guestToken, guestRefreshToken, xApiKey) => {
          set((state) => {
            state.guestToken = guestToken;
            state.guestRefreshToken = guestRefreshToken;
            if (xApiKey !== undefined) {
              state.xApiKey = xApiKey;
            }
          });
        },
        setXApiKey: (xApiKey) => {
          set((state) => {
            state.xApiKey = xApiKey;
          });
        },
        clearGuestToken: () => {
          set((state) => {
            state.guestToken = null;
            state.guestRefreshToken = null;
          });
        },
        clearGuestId: () => {
          set((state) => {
            state.guestId = null;
          });
        },
        setIsTutorialShow: (value) =>
          set((state) => {
            state.isTutorialShow = value;
          }),

        setMfaToken: (mfaToken) =>
          set((state) => {
            state.mfaToken = mfaToken;
          }),

        setUserId: (userId: string) =>
          set((state) => {
            state.userId = userId;
          }),

        clearAuth: (showLogin = false) => {
          set((state) => {
            state.authToken = null;
            state.refreshToken = null;
            state.passwordToken = undefined;
            state.guestToken = null;
            state.guestRefreshToken = null;
            state.xApiKey = null;
            state.isLogin = false;
            state.userId = null;
            state.showLogin = showLogin;
            state.isOnboardingRegistration = false;
            state.analyticsInstanceId = '';
            state.emailSHA256 = '';
          });
        },

        setAuthToken: (token) =>
          set((state) => {
            state.authToken = token;
          }),
        setIsLogin: (value) =>
          set((state) => {
            state.isLogin = value;
          }),
        setGuestToken: (token) =>
          set((state) => {
            state.guestToken = token;
          }),
        setDeviceId: (deviceId) =>
          set((state) => {
            state.deviceId = deviceId;
          }),
        setHasShownSplashAnimation: (value) =>
          set((state) => {
            state.hasShownSplashAnimation = value;
          }),
        setIsOnboardingRegistration: (value) =>
          set((state) => {
            state.isOnboardingRegistration = value;
          }),
        setHasHydrated: (value) =>
          set((state) => {
            state.hasHydrated = value;
          }),
        setGuestId: (guestId) =>
          set((state) => {
            state.guestId = guestId;
          }),
        setHasAppFlyerIsReady: (value) =>
          set((state) => {
            state.hasAppFlyerIsReady = value;
          }),
        setAnalyticsInstanceId: (value) =>
          set((state) => {
            state.analyticsInstanceId = value;
          }),
        setEmailSHA256: (value) =>
          set((state) => {
            state.emailSHA256 = value;
          })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => mmkvAuthStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
        partialize: (state) => {
          const stateToPersist = { ...state } as Partial<AuthState & AuthActions>;
          delete stateToPersist.showLogoGif;
          delete stateToPersist.hasShownSplashAnimation;
          delete stateToPersist.isOnboardingRegistration;
          delete stateToPersist.hasHydrated;
          return stateToPersist;
        }
      }
    )
  )
);

export default useAuthStore;
