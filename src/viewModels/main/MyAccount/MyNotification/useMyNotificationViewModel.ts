import { useCallback, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@src/navigation/types';
import {
  DELETE_ALL_NOTIFICATION,
  DELETE_SELECTED_NOTIFICATION,
  GET_MY_NOTIFICATION_LIST,
  MARK_ALL_NOTIFICATION_AS_UNREAD,
  MARK_NOTIFICATION_AS_READ
} from '@src/graphql/main/MyAccount/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

export const useMyNotificationViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showCheckBox, setShowCheckBox] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [notificationMoreLoader, setNotificationMoreLoader] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isNotRead, setIsNotRead] = useState<boolean>(false);
  const notificationLimit = 10;

  const {
    data: useNotificationData,
    loading: notificationLoading,
    refetch: refetchNotification,
    fetchMore: fetchMoreNotification
  } = useQuery(GET_MY_NOTIFICATION_LIST, {
    variables: { input: { nextCursor: null, limit: notificationLimit, isRead: undefined } },
    fetchPolicy: 'network-only'
  });

  const notificationData = useMemo(
    () => useNotificationData?.getUserNotifications?.notifications || [],
    [useNotificationData]
  );

  const hasMoreNotification = useMemo(
    () => useNotificationData?.getUserNotifications?.pagination?.hasNext || false,
    [useNotificationData]
  );

  const nextNotificationCursor = useMemo(
    () => useNotificationData?.getUserNotifications?.pagination?.nextCursor,
    [useNotificationData]
  );

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [GET_MY_NOTIFICATION_LIST],
    fetchPolicy: 'network-only'
  });

  const [markAllNotificationAsRead] = useMutation(MARK_ALL_NOTIFICATION_AS_UNREAD, {
    refetchQueries: [GET_MY_NOTIFICATION_LIST],
    fetchPolicy: 'network-only'
  });

  const [deleteSelectedNotification] = useMutation(DELETE_SELECTED_NOTIFICATION, {
    refetchQueries: [GET_MY_NOTIFICATION_LIST],
    fetchPolicy: 'network-only'
  });

  const [deleteAllNotification] = useMutation(DELETE_ALL_NOTIFICATION, {
    refetchQueries: [GET_MY_NOTIFICATION_LIST],
    fetchPolicy: 'network-only'
  });

  const onMenuPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.MENU_3_DOTS,
      content_name: '3 dots',
      content_action: ANALYTICS_ATOMS.MENU_3_DOTS
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const onViewUnreadPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET_MENU_DOTS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.SEE_UNREAD,
      content_name: 'See unread',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsModalVisible(false);
    setIsNotRead(true);
    refetchNotification({
      input: {
        nextCursor: null,
        limit: notificationLimit,
        isRead: false
      }
    });
  };

  const onMarkReadPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET_MENU_DOTS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.MARK_AS_READ,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsModalVisible(false);
    markAllNotificationAsRead();
    setToastType('success');
    setToastMessage(t('screens.myNotifications.text.allMarkedAsRead'));
  };

  const onDeletePress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET_MENU_DOTS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.ELIMINATE_NOTIFICATION,
      content_name: 'Eliminate notification',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsModalVisible(false);
    setShowCheckBox(true);
  };

  const onDeleteAllPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET_MENU_DOTS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.ELIMINATE_ALL_NOTIFICATIONS,
      content_name: 'Eliminate all notifications',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsModalVisible(false);
    deleteAllNotification();
    setToastType('success');
    setToastMessage(t('screens.myNotifications.text.notificationDeletedSuccessfully'));
  };

  const onManageNotificationPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET_MENU_DOTS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.MANAGE_NOTIFICATIONS,
      content_name: 'Manage notifications',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsModalVisible(false);
    navigation.navigate(routeNames.MY_ACCOUNT_STACK, {
      screen: screenNames.SET_RECOMMENDATIONS,
      params: {
        isOnboarding: false
      }
    });
  };

  const onDeleteSelectedNotificationPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_ELIMINATE_NOTIFICATION,
      content_action: ANALYTICS_ATOMS.TAP
    });
    deleteSelectedNotification({ variables: { notificationIds: selectedNotification ?? [] } });
    setShowCheckBox(false);
    setSelectedNotification([]);
    setToastType('success');
    setToastMessage(t('screens.myNotifications.text.notificationDeletedSuccessfully'));
  };

  const onNotificationPres = (notification: {
    id: string;
    isRead?: boolean;
    collection?: string;
    slug?: string;
    liveblogEntryId?: string;
  }) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.NOTIFICATION_LIST,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.NOTIFICATION_CARD,
      content_name: 'Notification card',
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (showCheckBox) {
      setSelectedNotification((prev) =>
        prev.includes(notification?.id)
          ? prev.filter((id) => id !== notification?.id)
          : [...prev, notification?.id]
      );
    } else {
      if (!notification?.isRead) {
        markNotificationAsRead({ variables: { notificationId: notification?.id } });
      }
      if (
        notification?.collection == 'live-blogs' ||
        notification?.collection == 'live-blog-entries'
      ) {
        navigation.navigate(routeNames.HOME_STACK, {
          screen: screenNames.LIVE_BLOG,
          params: {
            slug: notification?.slug || '',
            isLive: true,
            entryId: notification?.liveblogEntryId || ''
          }
        });
      }
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetchNotification({ input: { nextCursor: null, limit: notificationLimit } });
    } finally {
      setRefreshing(false);
    }
  }, [refetchNotification]);

  const onSeeMoreNotificationPress = () => {
    if (hasMoreNotification) {
      setNotificationMoreLoader(true);
      fetchMoreNotification({
        variables: {
          input: {
            limit: notificationLimit,
            nextCursor: nextNotificationCursor,
            isRead: isNotRead ? false : undefined
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          setNotificationMoreLoader(false);
          return {
            getUserNotifications: {
              ...fetchMoreResult.getUserNotifications,
              notifications: [
                ...prev.getUserNotifications.notifications,
                ...fetchMoreResult.getUserNotifications.notifications
              ]
            }
          };
        }
      });
    }
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MY_NOTIFICATION,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MY_NOTIFICATION,
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.MY_NOTIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.BACK
    });
    setShowCheckBox(false);
    setSelectedNotification([]);
    navigation.goBack();
  };

  return {
    t,
    goBack,
    notificationLoading,
    notificationData,
    isModalVisible,
    onMenuPress,
    handleCloseModal,
    onViewUnreadPress,
    onMarkReadPress,
    onDeletePress,
    onDeleteAllPress,
    onManageNotificationPress,
    showCheckBox,
    onNotificationPres,
    selectedNotification,
    refreshing,
    onRefresh,
    toastType,
    toastMessage,
    setToastMessage,
    hasMoreNotification,
    notificationMoreLoader,
    onSeeMoreNotificationPress,
    onDeleteSelectedNotificationPress
  };
};
