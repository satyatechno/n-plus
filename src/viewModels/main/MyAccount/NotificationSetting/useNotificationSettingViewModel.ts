import { useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, TypedDocumentNode } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@src/hooks/useTheme';
import { MyAccountStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import {
  NotificationListResponse,
  ToggleNotificationInput
} from '@src/models/main/MyAccount/NotificationSettings';
import { GET_PUSH_AND_INAPP_NOTIFICATION_LIST } from '@src/graphql/main/MyAccount/queries';
import { ALERT_NOTIFICATION_TOGGLE_MUTATION } from '@src/graphql/auth/mutations';

/**
 * A custom React hook that provides the view model for managing notification settings.
 *
 * This hook handles the retrieval and management of push and in-app notification types
 * and their toggle statuses. It provides functionalities to toggle individual notifications,
 * as well as enable or disable all notifications of a certain type.
 *
 * It also manages navigation to detailed notification settings views and provides
 * translation and theme information.
 *
 * @returns {Object} The view model containing:
 * - `t`: Translation function for localized text.
 * - `theme`: Current theme object.
 * - `notificationPushAlertTypes`: Array of push notification types with titles and ids.
 * - `notificationPushAlertStatuses`: Array of boolean values representing the toggle status of each push alert type.
 * - `notificationInAppAlertTypes`: Array of in-app notification types with titles and ids.
 * - `notificationInAppAlertStatuses`: Array of boolean values representing the toggle status of each in-app alert type.
 * - `onToggle`: Function to toggle the status of a specific notification type by its index.
 * - `loading`: Boolean indicating if the notification data is being loaded.
 * - `error`: Error object if the query for notification data fails.
 * - `allPushEnabled`: Boolean indicating if all push notifications are enabled.
 * - `toggleAllPush`: Function to toggle the status of all push notifications.
 * - `allInAppEnabled`: Boolean indicating if all in-app notifications are enabled.
 * - `toggleAllInApp`: Function to toggle the status of all in-app notifications.
 * - `navigateToInAppDetails`: Function to navigate to the detailed in-app notification settings view.
 * - `handlePushViewAllPress`: Function to navigate to the detailed push notification settings view.
 */

export const useNotificationSettingsViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const [pushNotifications, setPushNotifications] = useState<
    { id: string; title: string; isSubscribed: boolean }[]
  >([]);

  const [inAppNotifications, setInAppNotifications] = useState<
    { id: string; title: string; isSubscribed: boolean }[]
  >([]);

  const { error, data, loading } = useQuery<NotificationListResponse>(
    GET_PUSH_AND_INAPP_NOTIFICATION_LIST as TypedDocumentNode<NotificationListResponse>
  );

  const [toggleNotificationStatuses, { error: toggleNotificationError }] = useMutation<
    { alertNotificationToggle: boolean },
    { input: ToggleNotificationInput[] }
  >(ALERT_NOTIFICATION_TOGGLE_MUTATION);

  useEffect(() => {
    if (error) {
      setAlertVisible(true);
    }
  }, [error]);

  useEffect(() => {
    if (data?.pushAndInAppNotificationList) {
      const pushList = data.pushAndInAppNotificationList.push || [];
      const inAppList = data.pushAndInAppNotificationList.inApp || [];

      setPushNotifications(
        pushList.map((item) => ({
          id: item.id,
          title: item.topic,
          isSubscribed: item.isSubscribed
        }))
      );

      setInAppNotifications(
        inAppList.map((item) => ({
          id: item.id,
          title: item.topic,
          isSubscribed: item.isSubscribed
        }))
      );
    }
  }, [data]);

  const isPushNotificationsEnabledForAll = useMemo(
    () => pushNotifications.every((item) => item.isSubscribed),
    [pushNotifications]
  );

  const isInAppNotificationsEnabledForAll = useMemo(
    () => inAppNotifications.every((item) => item.isSubscribed),
    [inAppNotifications]
  );

  const navigateToInAppDetails = () => {
    navigation.navigate(screenNames.NOTIFICATION_DETAIL, { type: 'inApp' });
  };

  const navigateToPushDetails = () => {
    navigation.navigate(screenNames.NOTIFICATION_DETAIL, { type: 'push' });
  };

  const handleToggleNotificationStatuses = async (updates: ToggleNotificationInput[]) => {
    try {
      await toggleNotificationStatuses({ variables: { input: updates } });
    } catch {
      setAlertVisible(true);
    }
  };

  const onToggle = async (type: 'push' | 'inApp', index: number) => {
    const stateMap = {
      push: { list: pushNotifications, setList: setPushNotifications },
      inApp: { list: inAppNotifications, setList: setInAppNotifications }
    };

    const { list, setList } = stateMap[type];
    const updated = [...list];
    updated[index] = {
      ...updated[index],
      isSubscribed: !updated[index].isSubscribed
    };
    setList(updated);

    handleToggleNotificationStatuses([
      { id: updated[index].id, isSubscribed: updated[index].isSubscribed }
    ]);
  };

  const toggleAllPush = async () => {
    const newValue = !isPushNotificationsEnabledForAll;
    const updated = pushNotifications.map((item) => ({
      ...item,
      isSubscribed: newValue
    }));
    setPushNotifications(updated);

    handleToggleNotificationStatuses(updated.map(({ id, isSubscribed }) => ({ id, isSubscribed })));
  };

  const toggleAllInApp = async () => {
    const newValue = !isInAppNotificationsEnabledForAll;
    const updated = inAppNotifications.map((item) => ({
      ...item,
      isSubscribed: newValue
    }));
    setInAppNotifications(updated);

    handleToggleNotificationStatuses(updated.map(({ id, isSubscribed }) => ({ id, isSubscribed })));
  };

  const goBack = () => navigation.goBack();

  return {
    t,
    theme,
    pushNotifications,
    inAppNotifications,
    onToggle,
    loading,
    error,
    isPushNotificationsEnabledForAll,
    toggleAllPush,
    isInAppNotificationsEnabledForAll,
    toggleAllInApp,
    navigateToInAppDetails,
    navigateToPushDetails,
    goBack,
    alertVisible,
    toggleNotificationError,
    setAlertVisible
  };
};
