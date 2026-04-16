import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useNotificationSettingsViewModel } from '@src/viewModels/main/MyAccount/NotificationSetting/useNotificationSettingViewModel';

/**
 * A custom React hook that provides the view model for the notification detail screen.
 *
 * The hook provides the data and functions necessary to render the notification detail
 * screen, including the list of notification types, their toggle statuses, and the
 * toggle function to change the status of individual notification types. It also
 * provides the toggle function to toggle the status of all notification types of
 * the same type (push or in-app).
 *
 * The hook also provides the title of the section, which is either "Push" or "In-app"
 * depending on the type of notification.
 *
 * @returns {Object} The view model containing:
 * - `theme`: The current theme object.
 * - `data`: The list of notification types.
 * - `statuses`: The list of boolean values representing the toggle status of each notification type.
 * - `onToggle`: The function to toggle the status of a specific notification type by its index.
 * - `toggleValue`: The boolean value indicating if all notification types of the same type are enabled.
 * - `onToggleAll`: The function to toggle the status of all notification types of the same type.
 * - `sectionTitle`: The title of the section.
 * - `type`: The type of notification, either "push" or "inApp".
 */

export const useNotificationDetailsViewModel = () => {
  const route = useRoute();
  const { type } = route.params as { type: 'push' | 'inApp' };
  const { t } = useTranslation();

  const {
    theme,
    pushNotifications,
    inAppNotifications,
    onToggle,
    isPushNotificationsEnabledForAll,
    isInAppNotificationsEnabledForAll,
    toggleAllPush,
    toggleAllInApp,
    loading,
    goBack
  } = useNotificationSettingsViewModel();

  const data = type === 'push' ? pushNotifications : inAppNotifications;

  const sectionTitle =
    type === 'push'
      ? t('screens.notificationSettings.text.pushTitle')
      : t('screens.notificationSettings.text.inAppTitle');

  const toggleValue =
    type === 'push' ? isPushNotificationsEnabledForAll : isInAppNotificationsEnabledForAll;

  const onToggleAll = type === 'push' ? toggleAllPush : toggleAllInApp;

  return {
    theme,
    data,
    onToggle,
    toggleValue,
    onToggleAll,
    sectionTitle,
    type,
    loading,
    goBack
  };
};
