import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@apollo/client';
import DeviceInfo from 'react-native-device-info';

import { themeStyles } from '@src/views/pages/auth/Splash/styles';
import { useTheme } from '@src/hooks/useTheme';
import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { GUEST_LOGIN_MUTATION } from '@src/graphql/auth/mutations';
import useThemeStore from '@src/zustand/auth/themeStore';
import { GuestLoginResponse } from '@src/models/auth/Splash';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

/**
 * Hook that provides the view model for the Splash screen.
 *
 * It returns an object with the following properties:
 *
 * - showLogo: a boolean indicating whether the logo should be shown or not.
 * - logoOpacity: an Animated.Value that can be used to animate the opacity of the logo.
 * - dateOpacity: an Animated.Value that can be used to animate the opacity of the current date.
 * - buttonsOpacity: an Animated.Value that can be used to animate the opacity of the buttons.
 * - t: the translation function from the react-i18next library.
 * - currentDateInSpanish: the current date in Spanish, formatted as "dd de mmmm de yyyy".
 *
 * It also starts an animation that
 * 1. shows the current date,
 * 2. shows the logo after a delay of 800ms,
 * 3. shows the buttons after a delay of 3000ms,
 * 4. animates the opacity of the logo on and off after a delay of 3000ms.
 *
 * @returns {Object} The view model for the Splash screen.
 */

const useSplashViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const darkMode = useThemeStore();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  useEffect(() => {
    logContentViewEvent({
      screen_name: ANALYTICS_PAGE.SPLASH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.SPLASH}`
    });
  }, []);

  const [guestLogin, { error, loading }] = useMutation<GuestLoginResponse>(GUEST_LOGIN_MUTATION);

  const {
    guestToken,
    setGuestTokens,
    setShowLogoGif,
    showLogoGif,
    setUserId,
    hasShownSplashAnimation,
    setHasShownSplashAnimation,
    setIsLogin,
    setGuestId
  } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();

  const onRegisterPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.SPLASH,
      screen_page_web_url: ANALYTICS_PAGE.SPLASH,
      screen_name: ANALYTICS_PAGE.SPLASH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.SPLASH}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON_ACTIONS,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_REGISTER,
      content_name: 'Register',
      content_action: ANALYTICS_ATOMS.TAP
    });

    setShowLogoGif(false);
    navigation.navigate(screenNames.SOCIAL_AUTH, { email: '', showLoginScreen: false });
  };

  const onLoginPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.SPLASH,
      screen_page_web_url: ANALYTICS_PAGE.SPLASH,
      screen_name: ANALYTICS_PAGE.SPLASH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.SPLASH}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON_ACTIONS,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN,
      content_name: 'Login',
      content_action: ANALYTICS_ATOMS.TAP
    });

    setShowLogoGif(false);
    navigation.navigate(screenNames.SOCIAL_AUTH, { email: '', showLoginScreen: true });
  };

  useEffect(() => {
    if (error?.message) {
      setAlertVisible(true);
    }
  }, [error?.message]);

  const onGuestUserPress = async () => {
    logSelectContentEvent(
      {
        idPage: ANALYTICS_PAGE.SPLASH,
        screen_page_web_url: ANALYTICS_PAGE.SPLASH,
        screen_name: ANALYTICS_PAGE.SPLASH,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_Guest userRecommended for you`,
        organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON_ACTIONS,
        content_type: ANALYTICS_MOLECULES.ONBOARDING.GUEST_BUTTON,
        content_name: 'Continuar',
        content_action: ANALYTICS_ATOMS.TAP,
        meta_content_action: ANALYTICS_ATOMS.REGITER_GUESS_USER
      },
      ANALYTICS_META_EVENTS.REGITER_GUESS_USER
    );

    try {
      const deviceId = await DeviceInfo.getUniqueId();

      setIsLogin(false);
      if (!guestToken) {
        const resp = await guestLogin({
          variables: {
            input: {
              guestId: null,
              deviceId
            }
          }
        });
        const token = resp?.data?.guestLogin.authToken;
        const refreshToken = resp?.data?.guestLogin.refreshToken;
        const xApiKey = resp?.data?.guestLogin.xApiKey;
        const id = resp?.data?.guestLogin.guestId ?? '';
        if (token && refreshToken) {
          setGuestTokens(token, refreshToken, xApiKey);
          setUserId(id);
          setGuestId(id);
        }
        AnalyticsService.logAppsFlyerEvent('register_guest_user', {
          user_id_nmas_hit: id
        });
      }

      setShowLogoGif(false);
      navigation.navigate(screenNames.SET_RECOMMENDATIONS, { isOnboarding: true });
    } catch {
      setAlertVisible(true);
    }
  };

  const dateOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  const [currentDateInSpanish, setCurrentDateInSpanish] = useState(
    new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      setCurrentDateInSpanish((prevDate) => {
        if (prevDate !== now) {
          return now;
        }
        return prevDate;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const delay = hasShownSplashAnimation ? 0 : 500;
    setHasShownSplashAnimation(true);

    const timer = setTimeout(() => {
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }, delay);

    Animated.timing(dateOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    return () => clearTimeout(timer);
  }, []);

  return {
    logoOpacity,
    dateOpacity,
    buttonsOpacity,
    t,
    currentDateInSpanish,
    styles,
    theme,
    onRegisterPress,
    onLoginPress,
    showLogoGif,
    onGuestUserPress,
    loading,
    error,
    alertVisible,
    setAlertVisible,
    darkMode,
    isInternetConnection
  };
};

export default useSplashViewModel;
