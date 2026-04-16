import React, { useEffect, useMemo } from 'react';
import { Modal, ScrollView, View, Animated } from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomModal from '@src/views/organisms/CustomModal';
import CustomToast from '@src/views/molecules/CustomToast';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/main/MyAccount/MyAccount/styles';
import { useTheme } from '@src/hooks/useTheme';
import { useMyAccountViewModel } from '@src/viewModels/main/MyAccount/MyAccount/useMyAccountViewModel';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useUserStore from '@src/zustand/main/userStore';
import {
  getAllOptions,
  getSecondaryOptions,
  getSocialLoginOptions
} from '@src/views/pages/main/MyAccount/MyAccount/config/options';
import MyAccountSkeleton from '@src/views/pages/main/MyAccount/MyAccount/Components/MyAccountSkeleton';
import MyAccountOptionsSection from '@src/views/pages/main/MyAccount/MyAccount/Components/MyAccountOptionsSection';
import {
  XIcon,
  FbIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  ThreadIcon
} from '@src/assets/icons';
import { SOCIAL_LINKS } from '@src/views/pages/main/MyAccount/MyAccount/config/socialLinks';
import getGreetings from '@src/utils/getGreetings';
import CustomLoader from '@src/views/atoms/CustomLoader';

const socialIcons = [
  { icon: FbIcon, link: SOCIAL_LINKS.FACEBOOK },
  { icon: XIcon, link: SOCIAL_LINKS.TWITTER },
  { icon: InstagramIcon, link: SOCIAL_LINKS.INSTAGRAM },
  { icon: TiktokIcon, link: SOCIAL_LINKS.TIKTOK },
  { icon: YoutubeIcon, link: SOCIAL_LINKS.YOUTUBE },
  { icon: ThreadIcon, link: SOCIAL_LINKS.THREADS }
];

const MyAccount = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const email = useUserStore((state) => state.userData?.email);
  const name = useUserStore((state) => state.userData?.name);
  const secondaryOptions = getSecondaryOptions(t);

  const {
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
  } = useMyAccountViewModel();

  const allOptions = signInUsingSocialMedia ? getSocialLoginOptions(t) : getAllOptions(t);
  const filteredOptions = allOptions.filter((option) => {
    const guestHidden = [
      t('screens.myAccount.options.updateProfile'),
      t('screens.myAccount.options.changePassword')
    ];
    return isLoggedIn || !guestHidden.includes(option.label);
  });

  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  if (showWebView) {
    return (
      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWebView(false)}
      >
        <Animated.View
          style={[styles.webViewContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => setShowWebView(false)}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Animated.View>
      </Modal>
    );
  }

  if (loading) {
    return <MyAccountSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomHeader
          variant="secondary"
          onPress={handleSettingsIconPress}
          headerText={t('screens.myAccount.title')}
          headerTextWeight="Med"
          headerTextFontFamily={fonts.franklinGothicURW}
          headerStyle={styles.headerStyles}
          headerTextStyles={styles.headerTextStyles}
          buttonStyle={styles.headerIconStyles}
        />
      </View>

      <CustomDivider style={styles.headerDivider} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.headingContainer,
            isLoggedIn && {
              marginBottom: actuatedNormalizeVertical(fontSize['l'])
            }
          ]}
        >
          {isLoggedIn ? (
            <CustomHeading
              headingText={name?.first ? `${t(getGreetings())}, ${name?.first}` : t(getGreetings())}
              subHeadingText={email ?? ''}
              headingWeight="R"
              subHeadingWeight="R"
              headingStyles={styles.heading}
              subHeadingStyles={styles.subHeading}
              subHeadingFont={fonts.notoSerif}
              headingFont={fonts.notoSerifExtraCondensed}
            />
          ) : (
            <>
              <CustomText
                weight="R"
                fontFamily={fonts.notoSerifExtraCondensed}
                size={fontSize['2xl']}
                textStyles={styles.guestHeading}
              >
                {t(getGreetings())}
              </CustomText>

              <CustomButton
                variant="link"
                buttonText={t('screens.guestMyAccount.title')}
                onPress={handleGuestCTA}
                buttonTextWeight="R"
                buttonTextSize={fontSize['xs']}
                buttonTextFontFamily={fonts.notoSerif}
                underlineColor={theme.carouselTextOther}
                buttonStyles={styles.loginRegisterButton}
              />
            </>
          )}
        </View>

        <MyAccountOptionsSection
          isLoggedIn={isLoggedIn}
          filteredOptions={filteredOptions}
          secondaryOptions={secondaryOptions}
          socialIcons={socialIcons}
          handleOptionPress={handleOptionPress}
          handleSocialPress={handleSocialPress}
          styles={styles}
        />

        <View style={styles.logoutContainer}>
          {isLoggedIn && (
            <CustomButton
              variant="outlined"
              buttonText={t('screens.myAccount.logoutModal.title')}
              onPress={handleLogoutPress}
              buttonTextColor={theme.onBoardingTextErrorHelperText}
              buttonStyles={styles.logoutBtn}
              buttonTextStyles={styles.logoutText}
              getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
            />
          )}

          <CustomText
            weight="Boo"
            fontFamily={fonts.franklinGothicURW}
            size={fontSize['xxs']}
            textStyles={styles.versionText}
          >
            {`${t('screens.myAccount.appVersion')} ${appVersion}`}
          </CustomText>
        </View>
      </ScrollView>
      <CustomToast
        type={toastType}
        isVisible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        message={toastMessage}
        toastContainerStyle={styles.toastContainer}
      />

      <CustomModal {...modalProps} />
      {isLogoutLoading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default MyAccount;
