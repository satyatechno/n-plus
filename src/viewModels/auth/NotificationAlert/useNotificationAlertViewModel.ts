import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  AlertNotificationListOutput,
  NotificationAlertItem,
  NotificationViewModel
} from '@src/models/auth/NotificationAlert';
import { ALERT_NOTIFICATION_TOGGLE_MUTATION } from '@src/graphql/auth/mutations';
import { ALERT_NOTIFICATION_LIST_QUERY } from '@src/graphql/auth/queries';
import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/pages/auth/NotificationAlert/styles';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';

/**
 * Custom hook that provides the view model for managing notification alerts.
 *
 * This hook interacts with a GraphQL API to fetch and toggle notification alert subscriptions.
 * It manages the state of notification alerts, including their subscription status.
 * The hook also provides functions to toggle individual alert subscriptions and to submit
 * subscription changes to the server.
 *
 * @returns {NotificationViewModel} The view model containing:
 * - `notificationAlerts`: An array of notification alert items with their subscription statuses.
 * - `onToggle`: A function to toggle the subscription status of a notification alert by index.
 * - `t`: The translation function for localized text.
 * - `loading`: A boolean indicating if the alert data is being fetched.
 * - `styles`: The styles for the notification alert screen based on the current theme.
 * - `onContinuePress`: A function to submit the current subscription statuses to the server.
 * - `error`: An ApolloError object representing any error during the alert data query.
 */

const useNotificationAlertViewModel = (): NotificationViewModel => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { t } = useTranslation();

  const [toastMessage, setToastMessage] = useState<string>('');
  const [notificationAlerts, setNotificationAlerts] = useState<NotificationAlertItem[]>([]);
  const { isInternetConnection } = useNetworkStore();
  const [internetFail, setInternetFail] = useState<boolean>(isInternetConnection);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);

  const [notificationAlertToggle, { loading: alertToggleLoading, error: alertToggleError }] =
    useMutation(ALERT_NOTIFICATION_TOGGLE_MUTATION);

  const [notificationList, { error, data, loading, refetch }] = useLazyQuery(
    ALERT_NOTIFICATION_LIST_QUERY,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network'
    }
  );

  useEffect(() => {
    const fetchNotificationList = async () => {
      await notificationList({
        variables: {
          input: { type: 'ALERT' }
        }
      });
    };

    fetchNotificationList();
  }, []);

  const { setIsLogin, guestToken, setIsTutorialShow, setAuthToken } = useAuthStore();

  useEffect(() => {
    if (data?.alertNotificationList?.length) {
      const mappedAlerts = data.alertNotificationList.map((item: AlertNotificationListOutput) => ({
        id: item.id,
        title: item.topic,
        isSubscribed:
          item.topic === t('screens.notificationAlert.text.breakingNews') ? true : item.isSubscribed
      }));

      setNotificationAlerts(mappedAlerts);
    }
  }, [data]);

  useEffect(() => {
    const combinedError = error ?? alertToggleError;
    setInternetLoader(false);
    if (combinedError) {
      setInternetFail(isInternetConnection ? true : false);
      const message =
        (combinedError?.graphQLErrors?.[0]?.extensions?.message as string) ||
        t('screens.recommendedForYou.text.resendError');

      setToastMessage(message);
    }
  }, [error, alertToggleError]);

  const onToggle = (index: number) => {
    setNotificationAlerts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isSubscribed: !item.isSubscribed } : item))
    );
  };

  const onContinuePress = async () => {
    try {
      const input = notificationAlerts.map(({ id, isSubscribed }) => ({
        id,
        isSubscribed
      }));

      await notificationAlertToggle({
        variables: { input }
      });

      if (guestToken) {
        if (typeof guestToken === 'string') {
          setAuthToken(guestToken);
        }
      }
    } catch {
      setToastMessage(alertToggleError?.message || t('screens.recommendedForYou.text.resendError'));
    }
  };

  const onSkipPress = () => {
    setIsTutorialShow(false);
    setIsLogin(true);
    if (guestToken) {
      if (typeof guestToken === 'string') {
        setAuthToken(guestToken);
      }
    }
  };

  const onPressRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([refetch()]);
    } catch {
      setInternetLoader(true);
      setInternetFail(true);
    }
  };

  return {
    notificationAlerts,
    onToggle,
    t,
    loading,
    styles,
    onContinuePress,
    alertToggleLoading,
    toastMessage,
    setToastMessage,
    onSkipPress,
    internetFail,
    internetLoader,
    onPressRetry,
    isInternetConnection
  };
};

export default useNotificationAlertViewModel;
