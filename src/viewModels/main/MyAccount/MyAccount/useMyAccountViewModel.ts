import { useState, useEffect, useCallback } from 'react';
import { Share } from 'react-native';

import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { getAuth } from '@react-native-firebase/auth';

import { routeNames, screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import useUserStore from '@src/zustand/main/userStore';
import { MY_PROFILE_DATA_QUERY } from '@src/graphql/main/MyAccount/queries';
import { LOGOUT_MUTATION } from '@src/graphql/auth/mutations';
import { RootStackParamList } from '@src/navigation/types';
import { REMOVE_DEVICE_ID_QUERY } from '@src/graphql/main/home/queries';
import { isIos } from '@src/utils/platformCheck';
import client from '@src/services/apollo/apolloClient';
import { clearCache } from '@src/utils/mmkv';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE,
  MY_ACCOUNT_OPTIONS_MOLECULES,
  MY_ACCOUNT_SOCIAL,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';
import {
  PRIVACY_POLICY_URL,
  RIGHT_TO_REPLY,
  TERMS_CONDITIONS_URL,
  SOCIAL_LINKS
} from '@src/views/pages/main/MyAccount/MyAccount/config/socialLinks';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';

export const useMyAccountViewModel = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const guestToken = useAuthStore((state) => state.guestToken);
  const isLoggedIn = !guestToken;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [appVersion, setAppVersion] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');
  const { deviceId, setShowLogoGif, signInUsingSocialMedia } = useAuthStore();
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  // Skip profile API call if user is a guest (has guestToken)
  const { data, loading, refetch } = useQuery(MY_PROFILE_DATA_QUERY, {
    fetchPolicy: 'network-only',
    skip: !!guestToken
  });

  const [removeDeviceToken, { error: removeDeviceTokenError }] =
    useMutation(REMOVE_DEVICE_ID_QUERY);
  const [logout, { error }] = useMutation(LOGOUT_MUTATION);

  const setUserData = useUserStore((state) => state.setUserData);

  useEffect(() => {
    if (error || removeDeviceTokenError) {
      setIsLogoutLoading(false);
      setToastMessage(t('screens.login.text.somethingWentWrong'));
      setToastType('error');
      setToastVisible(true);
    }
  }, [error, removeDeviceTokenError]);

  useFocusEffect(
    useCallback(() => {
      // Only refetch if user is logged in (not a guest)
      if (!guestToken) {
        refetch();
      }
    }, [refetch, guestToken])
  );

  useEffect(() => {
    if (data?.myProfile) {
      setUserData(data.myProfile);
    }
  }, [data]);

  useEffect(() => {
    try {
      logContentViewEvent({
        idPage: ANALYTICS_ID_PAGE.MY_ACCOUNT_HOME,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_ACCOUNT_HOME,
        screen_name: ANALYTICS_PAGE.MY_ACCOUNT_HOME,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_ACCOUNT_HOME}`,
        content_title: t('screens.myAccount.title')
      });
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, [t]);

  useEffect(() => {
    const fetchVersion = async () => {
      const version = await DeviceInfo.getVersion();
      const buildNumber = await DeviceInfo.getBuildNumber();
      setAppVersion(`${version} (${buildNumber})`);
    };
    fetchVersion();
  }, []);

  const logMyAccountOptionAnalytics = (molecule: string) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_ACCOUNT_HOME,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_ACCOUNT_HOME,
      screen_name: ANALYTICS_PAGE.MY_ACCOUNT_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_ACCOUNT_HOME}`,
      organisms: 'undefined',
      content_type: molecule,
      content_name: molecule,
      content_action: ANALYTICS_ATOMS.TAP
    });
  };

  const getMoleculeForOption = (actionType: string, target?: string): string | null => {
    const targetToMolecule: Record<string, string> = {
      [screenNames.UPDATE_PROFILE]: MY_ACCOUNT_OPTIONS_MOLECULES.UPDATE_PROFILE,
      [screenNames.CHANGE_PASSWORD]: MY_ACCOUNT_OPTIONS_MOLECULES.CHANGE_PASSWORD,
      [screenNames.BOOKMARKS]: MY_ACCOUNT_OPTIONS_MOLECULES.BOOKMARKS,
      SavedArticlesScreen: MY_ACCOUNT_OPTIONS_MOLECULES.BOOKMARKS,
      [screenNames.MY_NOTIFICATION]: MY_ACCOUNT_OPTIONS_MOLECULES.MY_NOTIFICATION,
      [screenNames.NOTIFICATION_SETTING]: MY_ACCOUNT_OPTIONS_MOLECULES.MY_NOTIFICATION,
      [screenNames.RECOMMENDED_FOR_YOU]: MY_ACCOUNT_OPTIONS_MOLECULES.RECOMMENDED_FOR_YOU,
      [screenNames.NEWSLETTERS]: MY_ACCOUNT_OPTIONS_MOLECULES.NEWSLETTER,
      [screenNames.CONTACT_US]: MY_ACCOUNT_OPTIONS_MOLECULES.SUPPORT,
      [RIGHT_TO_REPLY]: MY_ACCOUNT_OPTIONS_MOLECULES.RIGHT_OF_REPLY,
      [RIGHT_TO_REPLY.trim()]: MY_ACCOUNT_OPTIONS_MOLECULES.RIGHT_OF_REPLY,
      [TERMS_CONDITIONS_URL]: MY_ACCOUNT_OPTIONS_MOLECULES.TERMS_AND_CONDITIONS,
      [PRIVACY_POLICY_URL]: MY_ACCOUNT_OPTIONS_MOLECULES.PRIVACY_POLICY
    };

    if (actionType === 'share') return MY_ACCOUNT_OPTIONS_MOLECULES.SHARE_APP;
    if (actionType === 'webview' && target?.includes('play.google'))
      return MY_ACCOUNT_OPTIONS_MOLECULES.RATE_APP;
    if (actionType === 'webview' && target?.includes('appstore'))
      return MY_ACCOUNT_OPTIONS_MOLECULES.RATE_APP;

    return targetToMolecule[target ?? ''] ?? null;
  };

  const handleCancel = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CERRAR_SESION,
      screen_page_web_url: ANALYTICS_PAGE.CERRAR_SESION,
      screen_name: ANALYTICS_PAGE.CERRAR_SESION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CERRAR_SESION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.CANCELAR,
      content_name: 'Cancel',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setModalVisible(false);
  };

  const handleLogoutConfirm = async () => {
    setModalVisible(false);
    setIsLogoutLoading(true);
    if (isLoggedIn) {
      await logout({
        variables: {
          input: { deviceId }
        }
      });
    }
    logSelectContentEvent(
      {
        idPage: ANALYTICS_PAGE.CERRAR_SESION,
        screen_page_web_url: ANALYTICS_PAGE.CERRAR_SESION,
        screen_name: ANALYTICS_PAGE.CERRAR_SESION,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CERRAR_SESION}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_LOG_OUT,
        content_name: 'Cerrar sesión',
        content_action: ANALYTICS_ATOMS.TAP,
        meta_content_action: ANALYTICS_META_EVENTS.LOGOUT_SUCCESSFULL
      },
      ANALYTICS_META_EVENTS.LOGOUT_SUCCESSFULL
    );
    AnalyticsService.logAppsFlyerEvent('logout_successfull');
    const { clearAuth, signInUsingSocialMedia, setSignInUsingSocialMedia } =
      useAuthStore.getState();
    setShowLogoGif(false);

    if (signInUsingSocialMedia) {
      try {
        await Promise.allSettled([
          GoogleSignin.signOut(),
          (async () => {
            LoginManager.logOut();
          })(),
          getAuth().signOut()
        ]);
        setSignInUsingSocialMedia(false);
      } catch {
        setIsLogoutLoading(false);
        setModalMessage(t('screens.login.text.somethingWentWrong'));
        setModalVisible(true);
        return;
      }
    }

    await removeDeviceToken({
      variables: {
        deviceId
      }
    });

    await client.clearStore();
    clearCache();
    clearAuth(true);
    setIsLogoutLoading(false);
  };

  const handleGuestCTA = () => {
    const { clearAuth } = useAuthStore.getState();
    setShowLogoGif(false);
    clearAuth();
    setModalVisible(false);
  };

  const handleLogoutPress = () => {
    logMyAccountOptionAnalytics(MY_ACCOUNT_OPTIONS_MOLECULES.LOGOUT);
    setModalTitle(t('screens.myAccount.logoutModal.title'));
    setModalMessage(t('screens.myAccount.logoutModal.message'));
    setModalVisible(true);
  };

  const handleRestrictedOptionPress = (key?: string) => {
    switch (key) {
      case 'SavedArticlesScreen':
        setModalTitle(t('screens.guestMyAccount.restricted.bookmarkTitle'));
        setModalMessage(t('screens.guestMyAccount.restricted.bookmarkMessage'));
        break;
      case screenNames.NOTIFICATION_SETTING:
        setModalTitle(t('screens.guestMyAccount.restricted.notificationTitle'));
        setModalMessage(t('screens.guestMyAccount.restricted.notificationMessage'));
        break;
      case screenNames.RECOMMENDED_FOR_YOU:
        setModalTitle(t('screens.guestMyAccount.restricted.recommendedTitle'));
        setModalMessage(t('screens.guestMyAccount.restricted.recommendedMessage'));
        break;
      default:
        setModalTitle(t('screens.guestMyAccount.restricted.defaultTitle'));
        setModalMessage(t('screens.guestMyAccount.restricted.defaultMessage'));
    }
    setModalVisible(true);
  };

  const handleOptionPress = (actionType: string, target?: string) => {
    const molecule = getMoleculeForOption(actionType, target);
    if (molecule) logMyAccountOptionAnalytics(molecule);

    const guestProtected = [
      'SavedArticlesScreen',
      screenNames.SETTINGS,
      screenNames.NOTIFICATION_SETTING,
      screenNames.RECOMMENDED_FOR_YOU,
      screenNames.CHANGE_PASSWORD,
      screenNames.UPDATE_PROFILE,
      screenNames.BOOKMARKS,
      screenNames.MY_NOTIFICATION
    ];

    if (!isLoggedIn && guestProtected.includes(target || '')) {
      handleRestrictedOptionPress(target);
      return;
    }

    switch (actionType) {
      case 'navigate':
        navigation.navigate(routeNames.MY_ACCOUNT_STACK, { screen: target as never });
        break;
      case 'webview':
        setWebUrl(target || '');
        setShowWebView(true);
        break;
      case 'share':
        if (target) Share.share({ message: isIos ? '' : target, url: target });
        break;
      default:
        break;
    }
  };

  const logMyAccountSocialAnalytics = (atom: string) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_ACCOUNT_HOME,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_ACCOUNT_HOME,
      screen_name: ANALYTICS_PAGE.MY_ACCOUNT_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_ACCOUNT_HOME}`,
      organisms: 'undefined',
      content_type: MY_ACCOUNT_SOCIAL.MOLECULE,
      content_name: MY_ACCOUNT_SOCIAL.MOLECULE,
      content_action: atom
    });
  };

  const getSocialAtomForLink = (link: string): string | null => {
    const linkToAtom: Record<string, string> = {
      [SOCIAL_LINKS.FACEBOOK]: MY_ACCOUNT_SOCIAL.ATOMS.FACEBOOK,
      [SOCIAL_LINKS.TWITTER]: MY_ACCOUNT_SOCIAL.ATOMS.X,
      [SOCIAL_LINKS.INSTAGRAM]: MY_ACCOUNT_SOCIAL.ATOMS.INSTAGRAM,
      [SOCIAL_LINKS.TIKTOK]: MY_ACCOUNT_SOCIAL.ATOMS.TIKTOK,
      [SOCIAL_LINKS.YOUTUBE]: MY_ACCOUNT_SOCIAL.ATOMS.YOUTUBE,
      [SOCIAL_LINKS.THREADS]: MY_ACCOUNT_SOCIAL.ATOMS.THREADS
    };
    return linkToAtom[link] ?? null;
  };

  const handleSocialPress = (link: string) => {
    const atom = getSocialAtomForLink(link);
    if (atom) logMyAccountSocialAnalytics(atom);
  };

  const handleSettingsIconPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_ACCOUNT_HOME,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_ACCOUNT_HOME,
      screen_name: ANALYTICS_PAGE.MY_ACCOUNT_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_ACCOUNT_HOME}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER_MY_ACCOUNT_MAIN,
      content_action: ANALYTICS_MOLECULES.MY_ACCOUNT.SETTINGS
    });
    if (isLoggedIn) {
      navigation.navigate(routeNames.MY_ACCOUNT_STACK, { screen: screenNames.SETTINGS });
    } else {
      handleRestrictedOptionPress(screenNames.SETTINGS);
    }
  };

  const modalProps = {
    visible: modalVisible,
    modalTitle,
    modalMessage,
    cancelButtonText: isLoggedIn
      ? t('screens.myAccount.logoutModal.cancel')
      : t('screens.splash.text.login'),
    confirmButtonText: isLoggedIn
      ? t('screens.myAccount.logoutModal.title')
      : t('screens.splash.text.signUp'),
    onCancelPress: isLoggedIn ? handleCancel : handleLogoutConfirm,
    onConfirmPress: isLoggedIn ? handleLogoutConfirm : handleGuestCTA,
    onOutsidePress: handleCancel,
    onRequestClose: handleCancel,
    buttonContainerStyle: {
      paddingTop: 0
    }
  };

  return {
    isLoggedIn,
    appVersion,
    modalProps,
    handleOptionPress,
    handleLogoutPress,
    handleGuestCTA,
    handleSocialPress,
    handleSettingsIconPress,
    showWebView,
    webUrl,
    setShowWebView,
    loading,
    signInUsingSocialMedia,
    isLogoutLoading,
    toastVisible,
    setToastVisible,
    toastMessage,
    toastType
  };
};
