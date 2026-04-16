import { themeStyles } from '@src/views/pages/main/MyAccount/NotificationSetting/styles';

export interface NotificationItem {
  id: string;
  topic: string;
  isSubscribed: boolean;
}

export interface NotificationListResponse {
  pushAndInAppNotificationList: {
    push: NotificationItem[];
    inApp: NotificationItem[];
  };
}

export interface ToggleNotificationInput {
  id: string;
  isSubscribed: boolean;
}

export interface NotificationSectionProps {
  title: string;
  allEnabled: boolean;
  onToggleAll: () => void;
  types: { id: string; title: string; isSubscribed: boolean }[];
  onToggle: (index: number) => void;
  onPressViewAll: () => void;
  styles: ReturnType<typeof themeStyles>;
}

export interface NotificationType {
  id: string;
  title: string;
}
