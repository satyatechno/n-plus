import React from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { fonts } from '@src/config/fonts';
import CustomHeader from '@src/views/molecules/CustomHeader';

import ConsentFooter from '@src/views/organisms/ConsentFooter';

import CustomToast from '@src/views/molecules/CustomToast';

import CustomLoader from '@src/views/molecules/CustomLoader';
import { useNotificationSettingsViewModel } from '@src/viewModels/main/MyAccount/NotificationSetting/useNotificationSettingViewModel';
import { themeStyles } from './styles';
import NotificationSection from './components/NotificationSection';

/**
 * NotificationSetting is a React functional component that renders a page for
 * managing notification settings.
 *
 * The component displays a header with a logo and a subheading, a list of
 * notification alert types with their toggle statuses, and a button to
 * continue to the next step.
 *
 * The component also renders a footer with terms and conditions and a link to
 * the privacy policy.
 *
 * @returns {JSX.Element} A screen component for managing notification alerts.
 */

const NotificationSettings: React.FC = () => {
  const {
    t,
    theme,
    pushNotifications,
    inAppNotifications,
    onToggle,
    isPushNotificationsEnabledForAll,
    toggleAllPush,
    isInAppNotificationsEnabledForAll,
    toggleAllInApp,
    navigateToPushDetails,
    navigateToInAppDetails,
    loading,
    goBack,
    alertVisible,
    setAlertVisible,
    toggleNotificationError
  } = useNotificationSettingsViewModel();

  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.notificationSettings.title')}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Boo"
        headerTextStyles={styles.headerText}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.flexContent}>
            <NotificationSection
              title={t('screens.notificationSettings.text.pushTitle')}
              allEnabled={isPushNotificationsEnabledForAll}
              onToggleAll={toggleAllPush}
              types={pushNotifications}
              onToggle={(index) => onToggle('push', index)}
              onPressViewAll={navigateToPushDetails}
              styles={styles}
            />

            <NotificationSection
              title={t('screens.notificationSettings.text.inAppTitle')}
              allEnabled={isInAppNotificationsEnabledForAll}
              onToggleAll={toggleAllInApp}
              types={inAppNotifications}
              onToggle={(index) => onToggle('inApp', index)}
              onPressViewAll={navigateToInAppDetails}
              styles={styles}
            />
          </View>

          <ConsentFooter />
        </ScrollView>
      </View>

      <CustomToast
        type="error"
        message={toggleNotificationError?.message}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {loading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default NotificationSettings;
