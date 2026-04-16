import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  NavigationContainer,
  createNavigationContainerRef,
  type LinkingOptions
} from '@react-navigation/native';
import { Modal, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { routeNames } from '@src/navigation/screenNames';
import { handleBackgroundDeepLink, linking } from '@src/navigation/linkingConfig';
import { ANALYTICS_COLLECTION_MAPPING } from '@src/config/constants';
import MyAccountStackScreens from '@src/navigation/MyAccountStack';
import HomeStackScreens from '@src/navigation/HomeStack';
import AuthStackScreens from '@src/navigation/AuthStack';
import VideosStackScreens from '@src/navigation/VideosStack';
import OpinionStackScreens from '@src/navigation/OpinionStack';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import useAuthStore from '@src/zustand/auth/authStore';
import useDeeplinkWebViewStore from '@src/zustand/deeplinkWebViewStore';
import { RootStackParamList } from '@src/navigation/types';
import { subscribeToNotifications } from '@src/native/notificationBridge';
import LoadingScreen from '@src/views/pages/auth/Splash/LoadingScreen';
import SplashOverlay from '@src/views/pages/auth/Splash/SplashOverlay';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { useTheme } from '@src/hooks/useTheme';
import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';

type NotificationTapPayload = {
  data?: {
    action?: {
      app?: string;
    };
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const webViewThemeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    }
  });

const AppNavigation = () => {
  const routeNameRef = useRef<string | undefined>(undefined);
  const isNavigationReadyRef = useRef<boolean>(false);
  const pendingNotificationUrlRef = useRef<string | null>(null);
  const { authToken, isOnboardingRegistration, hasHydrated } = useAuthStore();
  const { url: deeplinkWebViewUrl, close: closeDeeplinkWebView } = useDeeplinkWebViewStore();
  const [theme] = useTheme();
  const styles = webViewThemeStyles(theme);
  const [showSplashOverlay, setShowSplashOverlay] = useState(true);

  const isAuthenticated = Boolean(authToken) && !isOnboardingRegistration;

  const showWebView = Boolean(deeplinkWebViewUrl);
  const handleWebViewClose = useCallback(() => {
    closeDeeplinkWebView();
  }, [closeDeeplinkWebView]);

  const handleOnReady = useCallback(async () => {
    isNavigationReadyRef.current = true;
    const currentRoute = navigationRef.getCurrentRoute();
    routeNameRef.current = currentRoute?.name;

    if (currentRoute?.name) {
      AnalyticsService.logEvent('screen_view', {
        screen_name: currentRoute.name,
        collection: ANALYTICS_COLLECTION_MAPPING[currentRoute.name]
      });
    }

    const pendingUrl = pendingNotificationUrlRef.current;
    if (pendingUrl) {
      pendingNotificationUrlRef.current = null;
      await new Promise((resolve) => setTimeout(resolve, 800));
      handleBackgroundDeepLink(pendingUrl);
    }
  }, []);

  const handleOnStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (previousRouteName !== currentRouteName) {
      if (currentRouteName) {
        AnalyticsService.logEvent('screen_view', {
          screen_name: currentRouteName,
          screen_name_previous: previousRouteName,
          collection: ANALYTICS_COLLECTION_MAPPING[currentRouteName]
        });
      }
      routeNameRef.current = currentRouteName;
    }
  }, []);

  useEffect(() => {
    const notificationUnsubscribe = subscribeToNotifications({
      onTap: (payload: unknown) => {
        const url = (payload as NotificationTapPayload | null | undefined)?.data?.action?.app;
        if (!url) return;

        if (!isNavigationReadyRef.current) {
          pendingNotificationUrlRef.current = url;
          return;
        }

        setTimeout(() => {
          handleBackgroundDeepLink(url);
        }, 0);
      }
    });

    return notificationUnsubscribe;
  }, []);

  const handleSplashAnimationComplete = useCallback(() => {
    setShowSplashOverlay(false);
  }, []);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={handleOnReady}
        linking={linking as unknown as LinkingOptions<RootStackParamList>}
        onStateChange={handleOnStateChange}
      >
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <RootStack.Screen name={routeNames.HOME_STACK} component={HomeStackScreens} />
              <RootStack.Screen
                name={routeNames.MY_ACCOUNT_STACK}
                component={MyAccountStackScreens}
              />
              <RootStack.Screen name={routeNames.VIDEOS_STACK} component={VideosStackScreens} />
              <RootStack.Screen name={routeNames.OPINION_STACK} component={OpinionStackScreens} />
            </>
          ) : (
            <RootStack.Screen name={routeNames.AUTH_STACK} component={AuthStackScreens} />
          )}
        </RootStack.Navigator>
        {showWebView && deeplinkWebViewUrl && (
          <Modal
            visible={showWebView}
            animationType="slide"
            transparent
            onRequestClose={handleWebViewClose}
          >
            <CustomWebView
              uri={deeplinkWebViewUrl}
              isVisible={true}
              onClose={handleWebViewClose}
              containerStyle={styles.webViewContainer}
              headerContainerStyle={styles.webViewHeaderContainer}
            />
          </Modal>
        )}
      </NavigationContainer>
      {showSplashOverlay && <SplashOverlay onAnimationComplete={handleSplashAnimationComplete} />}
    </>
  );
};

export default AppNavigation;
