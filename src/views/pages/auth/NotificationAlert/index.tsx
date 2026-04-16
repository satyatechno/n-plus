import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomSwitch from '@src/views/atoms/CustomSwitch';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useNotificationAlertViewModel from '@src/viewModels/auth/NotificationAlert/useNotificationAlertViewModel';
import { fonts } from '@src/config/fonts';
import CustomFooter from '@src/views/organisms/ConsentFooter';
import NotificationAlertSkeleton from '@src/views/pages/auth/NotificationAlert/components/NotificationAlertSkeleton';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomLoader from '@src/views/atoms/CustomLoader';
import ErrorScreen from '@src/views/organisms/ErrorScreen';

const NotificationAlert: React.FC = () => {
  const [theme] = useTheme();

  const {
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
    isInternetConnection,
    onPressRetry
  } = useNotificationAlertViewModel();

  const renderContent = () => {
    if (loading) {
      return <NotificationAlertSkeleton />;
    }

    if (internetLoader) {
      return (
        <View style={styles.errorContainer}>
          <ErrorScreen status="loading" />
        </View>
      );
    }

    if (!internetFail || !isInternetConnection) {
      return (
        <View style={styles.errorContainer}>
          <ErrorScreen status="noInternet" onRetry={onPressRetry} />
        </View>
      );
    }

    if (!notificationAlerts.length) {
      return (
        <View style={styles.errorContainer}>
          <ErrorScreen status="error" />
        </View>
      );
    }

    return (
      <>
        <View style={styles.flatListContentContainer}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
          >
            {notificationAlerts.map((item, index) => (
              <View
                key={item.id}
                style={StyleSheet.flatten([
                  styles.itemContainer,
                  index === notificationAlerts.length - 1 && { borderBottomWidth: 0 }
                ])}
              >
                <CustomText weight="Boo" fontFamily={fonts.franklinGothicURW}>
                  {item.title}
                </CustomText>

                <CustomSwitch value={item.isSubscribed} onToggle={() => onToggle(index)} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={onSkipPress}
            variant="outlined"
            buttonText={t('screens.notificationAlert.text.skip')}
            buttonTextStyles={styles.buttonTextStyle}
            buttonStyles={styles.skipButton}
            buttonTextColor={theme.filledButtonPrimary}
          />
          <CustomButton
            onPress={onContinuePress}
            buttonText={t('screens.notificationAlert.text.continue')}
            buttonTextStyles={styles.buttonTextStyle}
            buttonStyles={styles.skipButton}
            disabled={!notificationAlerts.some((item) => item.isSubscribed)}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>
        <CustomHeading
          isLogoVisible={true}
          logoHeight={actuatedNormalizeVertical(29)}
          logoWidth={actuatedNormalize(52)}
          headingText={t('screens.notificationAlert.text.stayUpToDateWithLatestNews')}
          subHeadingText={t('screens.notificationAlert.text.selectAlertsOfInterestAndStayUpdated')}
          subHeadingWeight="Boo"
          subHeadingFont={fonts.franklinGothicURW}
        />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {renderContent()}
        </ScrollView>
      </View>
      <CustomFooter />

      <CustomToast
        type="error"
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
      />

      {alertToggleLoading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default NotificationAlert;
