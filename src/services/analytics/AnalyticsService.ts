import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { getApp } from '@react-native-firebase/app';
import analytics, { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { sha256 } from 'js-sha256';

import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';

type AnalyticsParams = Record<string, unknown>;

interface AppsFlyerEvent {
  name: string;
  values: AnalyticsParams;
}

type EventMapper = (params: AnalyticsParams) => AppsFlyerEvent;

const getFirebaseAnalytics = () => getAnalytics(getApp());
const FIREBASE_USER_PROPERTY_MAX_LENGTH = 36;

/**
 * Gets Firebase App Instance ID (device identifier)
 * Since React Native Firebase doesn't expose getAppInstanceId() directly,
 * we use DeviceInfo.getUniqueId() as the device identifier
 */
const getFirebaseAppInstanceId = async (): Promise<string> => DeviceInfo.getUniqueId();

const EVENT_MAPPERS: Record<string, string | EventMapper> = {
  screen_view: ({ collection, ...restParams }) => ({
    name: 'af_screen_view',
    values: {
      ...restParams,
      screen_name: restParams.screen_name,
      Tipo_Contenido: collection
    }
  }),
  register_successfull: 'af_register_successfull',
  register_guest_user: 'af_register_guest_user',
  login_successfull: 'af_login_successfull',
  logout_successfull: 'af_logout_successfull',
  interests_modify: 'af_interests_modify',
  profile_change_password: 'af_profile_change_password',
  profile_delete_account_successfull: 'af_profile_delete_account_successfull',
  profile_newsletter_subscribe: 'af_profile_newsletter_subscribe',
  profile_push_notifications_enable: 'af_profile_push_notifications_enable',
  profile_update_successfull: 'af_profile_update_successfull',
  register_guess_user_setting_notifications: 'af_register_guess_user_setting_notifications',
  video_live: 'af_video_live'
};

function mapToAppsFlyerEvent(eventName: string, params: AnalyticsParams): AppsFlyerEvent | null {
  const mapper = EVENT_MAPPERS[eventName];

  if (typeof mapper === 'string') {
    return { name: mapper, values: params };
  }

  if (typeof mapper === 'function') {
    return mapper(params);
  }

  return null;
}

/**
 * Centralized Analytics Service (Analytics Wrapper)
 * logEvent: Firebase only | logAppsFlyerEvent: AppsFlyer only
 */
export const AnalyticsService = {
  /**
   * MUST be called after login/logout
   * Handles GA4 identity correctly
   */
  setUserContext: async (userEmail: string) => {
    const { setAnalyticsInstanceId, setEmailSHA256 } = useAuthStore.getState();

    const analyticsInstanceId = await analytics().getAppInstanceId();
    const firebaseAppInstanceId = await getFirebaseAppInstanceId();
    const emailSHA256Data = sha256(userEmail.trim().toLowerCase());
    const firebaseSafeUserId = emailSHA256Data.slice(0, FIREBASE_USER_PROPERTY_MAX_LENGTH);

    setAnalyticsInstanceId(analyticsInstanceId ?? '');
    setEmailSHA256(emailSHA256Data);

    await analytics().setUserId(emailSHA256Data);
    await analytics().setUserProperties({
      user_id_nmas_user: firebaseSafeUserId,
      device_id_user: firebaseAppInstanceId || 'undefined'
    });
  },

  /**
   * Unified event logger
   */
  logEvent: async (eventName: string, params: AnalyticsParams = {}) => {
    const { userId, hasAppFlyerIsReady, analyticsInstanceId, emailSHA256 } =
      useAuthStore.getState();
    const { hasNetworkAvailable } = useNetworkStore.getState();

    if (!hasNetworkAvailable || !hasAppFlyerIsReady) return;

    // Get Firebase App Instance ID (common identifier linking Firebase and AppsFlyer)
    const firebaseAppInstanceId = await getFirebaseAppInstanceId();

    const buildFirebaseParams = (): AnalyticsParams => {
      const firebaseParams: AnalyticsParams = {
        ...params
      };

      firebaseParams.device_id_hit = analyticsInstanceId || 'undefined';
      firebaseParams.device_id_user = analyticsInstanceId || 'undefined';
      firebaseParams.user_id = emailSHA256 || 'undefined';
      firebaseParams.user_id_nmas_user = emailSHA256 || 'undefined';
      firebaseParams.user_id_nmas_hit = emailSHA256 || 'undefined';

      return firebaseParams;
    };

    // Send to Firebase
    try {
      const analyticsInstance = getFirebaseAnalytics();
      const firebaseParams = buildFirebaseParams();
      await logEvent(analyticsInstance, eventName, firebaseParams);
    } catch {
      // Error logging Firebase analytics event - silently fail to not interrupt user flow
    }

    const buildAppsFlyerParams = (): AnalyticsParams => {
      const appsFlyerParams: AnalyticsParams = {
        ...params,
        device_id: firebaseAppInstanceId,
        client_ID_hit: firebaseAppInstanceId,
        user_id_nmas_hit: userId || undefined
      };

      return appsFlyerParams;
    };

    // Send to AppsFlyer
    const appsFlyerParams = buildAppsFlyerParams();
    const afEvent = mapToAppsFlyerEvent(eventName, appsFlyerParams);

    if (afEvent) {
      appsFlyer.logEvent(
        afEvent.name,
        afEvent.values,
        () => {},
        () => {}
      );
    }
  },

  /**
   * Log event to AppsFlyer only (no Firebase).
   * Use for events that should only be tracked in AppsFlyer.
   */
  logAppsFlyerEvent: async (eventName: string, params: AnalyticsParams = {}) => {
    const { userId, hasAppFlyerIsReady } = useAuthStore.getState();
    const { hasNetworkAvailable } = useNetworkStore.getState();

    if (!hasNetworkAvailable || !hasAppFlyerIsReady) return;

    const firebaseAppInstanceId = await getFirebaseAppInstanceId();

    const appsFlyerParams: AnalyticsParams = {
      ...params,
      device_id: firebaseAppInstanceId,
      client_ID_hit: firebaseAppInstanceId,
      user_id_nmas_hit: userId || undefined
    };

    const afEvent = mapToAppsFlyerEvent(eventName, appsFlyerParams);

    if (afEvent) {
      appsFlyer.logEvent(
        afEvent.name,
        afEvent.values,
        () => {},
        () => {}
      );
    }
  }
};
