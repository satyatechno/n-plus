import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@src/hooks/useTheme';
import { MyAccountStackParamList } from '@src/navigation/types';
import client from '@src/services/apollo/apolloClient';
import { settingsStorage, themeStorage, videoPlayerStorage } from '@src/utils/mmkv';
import useSearchHistoryStore from '@src/zustand/main/searchHistoryStore';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import useThemeStore from '@src/zustand/auth/themeStore';
import { screenNames } from '@src/navigation/screenNames';
import { VideoAutoPlay } from '@src/config/constants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * A custom hook that provides the view model for the settings screen.
 *
 * This hook manages the state and translations for different settings,
 * including text size, video auto play, and theme.
 * It also provides functions to toggle the modal visibility and
 * handle confirm and cancel actions.
 *
 * @returns {Object} The view model containing:
 * - `t`: The translation function for localized text.
 * - `themes`: The currently selected theme.
 * - `setThemes`: A function to set the theme.
 * - `textSize`: The currently selected text size.
 * - `setTextSize`: A function to set the text size.
 * - `videoAutoPlay`: The currently selected video auto play setting.
 * - `setVideoAutoPlay`: A function to set the video auto play setting.
 * - `theme`: The current theme object.
 * - `isModalVisible`: A boolean indicating if the modal is visible.
 * - `handleCancel`: A function to cancel the modal.
 * - `handleConfirm`: A function to confirm the modal.
 * - `setModalVisible`: A function to set the modal visibility.
 * - `selectedTheme`: The currently selected theme.
 * - `setTheme`: A function to set the theme.
 * - `systemAppearance`: The system appearance setting.
 */

export const useSettingsViewModel = () => {
  const {
    textSize,
    setTextSize,
    lastCustomSize,
    videoAutoPlay,
    setVideoAutoPlay,
    isImageDownloadEnabled,
    setIsImageDownloadEnabled,
    isWifiConnected,
    setIsWifiConnected,
    shouldAutoPlay,
    clearSettings
  } = useSettingsStore();

  const { clearTheme } = useThemeStore();

  const { t } = useTranslation();
  const [theme, selectedTheme, setTheme] = useTheme();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getThemeAnalyticsData = (value: string) => {
    const themeMap = {
      light: { molecule: 'Segmented 3 Tabs | Claro', name: 'Claro' },
      dark: { molecule: 'Segmented 3 Tabs | Oscuro', name: 'Oscuro' },
      system: { molecule: 'Segmented 3 Tabs | Tema del sistema', name: 'Tema del sistema' }
    };
    return (
      themeMap[value as keyof typeof themeMap] || {
        molecule: 'Segmented 3 Tabs | Tema del sistema',
        name: 'Tema del sistema'
      }
    );
  };

  const getTextSizeAnalyticsData = (value: string) => {
    const textSizeMap = {
      Chica: { molecule: 'Tab | Chica', name: 'Chica' },
      Mediana: { molecule: 'Tab | Mediana', name: 'Mediana' },
      Grande: { molecule: 'Tab | Grande', name: 'Grande' }
    };
    return textSizeMap[value as keyof typeof textSizeMap] || { molecule: 'MEDIUM', name: 'Medium' };
  };

  const getAutoplayAnalyticsData = (value: string) => {
    const autoplayMap = {
      Siempre: { molecule: 'Segmented 3 Tabs | Siempre', name: 'Siempre' },
      'Solo con Wi-Fi': { molecule: 'Segmented 3 Tabs | Solo con Wi-Fi', name: 'Solo con Wi-Fi' },
      Nunca: { molecule: 'Segmented 3 Tabs | Nunca', name: 'Nunca' }
    };
    return autoplayMap[value as keyof typeof autoplayMap] || { molecule: 'NEVER', name: 'Never' };
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CONFIGURACION,
      screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
      screen_name: ANALYTICS_PAGE.CONFIGURACION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const themeOptions = [
    { label: t('screens.settings.text.light'), value: 'light' },
    { label: t('screens.settings.text.dark'), value: 'dark' },
    { label: t('screens.settings.text.system'), value: 'system' }
  ];

  const textSizeOptions = [
    { label: t('screens.settings.text.small'), value: 'Chica' },
    { label: t('screens.settings.text.medium'), value: 'Mediana' },
    { label: t('screens.settings.text.large'), value: 'Grande' }
  ];

  const videoAutoPlayOptions = [
    {
      label: t('screens.settings.text.autoPlayAlways'),
      value: VideoAutoPlay.ALWAYS
    },
    {
      label: t('screens.settings.text.autoPlayWifiOnly'),
      value: VideoAutoPlay.WIFI_ONLY
    },
    {
      label: t('screens.settings.text.autoPlayNever'),
      value: VideoAutoPlay.NEVER
    }
  ];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.type === 'wifi' && state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const handlePress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CONFIGURACION,
      screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
      screen_name: ANALYTICS_PAGE.CONFIGURACION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DELETE_ACCOUNT,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.DELETE_ACCOUNT,
      content_name: 'Eliminar Cuenta',
      content_action: ANALYTICS_ATOMS.TAP
    });
    navigation.navigate(screenNames.DELETE_ACCOUNT_CONFIRMATION);
  };

  const handleToggleDownloadImages = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CONFIGURACION,
      screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
      screen_name: ANALYTICS_PAGE.CONFIGURACION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DATA_USAGE,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.DOWNLOAD_IMAGES,
      content_name: 'toggle_download_images',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsImageDownloadEnabled(!isImageDownloadEnabled);
  };

  const handleClearCache = async () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.BORRAR_CACHE,
      screen_page_web_url: ANALYTICS_PAGE.BORRAR_CACHE,
      screen_name: ANALYTICS_PAGE.BORRAR_CACHE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.BORRAR_CACHE}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_DELETE,
      content_name: 'Borrar cache',
      content_action: ANALYTICS_ATOMS.TAP
    });

    try {
      setIsLoading(true);
      setModalVisible(false);
      // Clear Apollo GraphQL cache and reset store for immediate effect
      await client.clearStore();
      await client.resetStore();

      // Clear MMKV storages except auth (to keep user logged in)
      settingsStorage.delete('settings'); // Delete specific key to trigger rehydration
      themeStorage.clearAll();
      videoPlayerStorage.clearAll();

      // Clear Zustand stores except user data (to keep user logged in)
      useSearchHistoryStore.getState().clearHistory();

      // Clear FastImage cache using dynamic import
      try {
        const FastImage = await import('react-native-fast-image');
        if (FastImage.default) {
          // Clear both memory and disk cache for react-native-fast-image v8.6.3
          if (typeof FastImage.default.clearMemoryCache === 'function') {
            FastImage.default.clearMemoryCache();
          }
          if (typeof FastImage.default.clearDiskCache === 'function') {
            FastImage.default.clearDiskCache();
          }
        }
      } catch {
        // FastImage cache clearing failed, but continue with other caches
      }

      setModalVisible(false);
      setAlertVisible(true);

      // Clear settings to reset to default values
      clearSettings();

      // Clear theme to reset to system default
      clearTheme();
      setIsLoading(false);
    } catch {
      // Still show success message to user even if some caches fail to clear
      setModalVisible(false);
      setAlertVisible(true);
    }
  };

  const handleNotification = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CONFIGURACION,
      screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
      screen_name: ANALYTICS_PAGE.CONFIGURACION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.MY_INTEREST,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.MANAGE,
      content_name: 'Administrar',
      content_action: ANALYTICS_ATOMS.TAP
    });
    navigation.navigate(screenNames.SET_RECOMMENDATIONS, {
      isOnboarding: false
    });
  };

  return {
    t,
    textSize,
    setTextSize,
    videoAutoPlay,
    setVideoAutoPlay,
    theme,
    isModalVisible,
    handleCancel: () => setModalVisible(false),
    setModalVisible,
    alertVisible,
    setAlertVisible,
    selectedTheme,
    setTheme,
    handleClearCache,
    handleToggleDownloadImages,
    getThemeAnalyticsData,
    getTextSizeAnalyticsData,
    getAutoplayAnalyticsData,
    isImageDownloadEnabled,
    setIsImageDownloadEnabled,
    isWifiConnected,
    shouldAutoPlay,
    handlePress,
    lastCustomSize,
    goBack,
    handleNotification,
    themeOptions,
    textSizeOptions,
    videoAutoPlayOptions,
    isLoading
  };
};
