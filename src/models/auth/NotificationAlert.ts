import { Key } from 'react';
import { StyleSheet } from 'react-native';

export interface NotificationAlertTypes {
  title: string;
}

export interface NotificationAlertItem {
  id: string;
  title: string;
  isSubscribed: boolean;
}

export interface NotificationViewModel {
  notificationAlerts: {
    id: Key | null | undefined;
    title: string;
    isSubscribed: boolean;
  }[];
  onToggle: (index: number) => void;
  t: (text: string) => string;
  loading: boolean;
  styles: ReturnType<typeof StyleSheet.create>;
  onContinuePress: () => void;
  alertToggleLoading: boolean;
  toastMessage: string;
  setToastMessage: (message: string) => void;
  onSkipPress: () => void;
  internetFail: boolean;
  internetLoader: boolean;
  onPressRetry: () => void;
  isInternetConnection: boolean;
}

export interface AlertNotificationResponse {
  id: string;
  isSubscribed: boolean;
  topic: string;
}

export interface AlertNotificationListData {
  alertNotificationList: AlertNotificationResponse[];
}

export interface AlertNotificationToggleVariables {
  input: {
    id: string;
    isSubscribed: boolean;
  }[];
}

export interface AlertNotificationToggleData {
  alertNotificationToggle: boolean;
}

export interface AlertNotificationListOutput {
  id: string;
  isSubscribed: boolean;
  topic: string;
}
