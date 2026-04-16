import React from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';

import { fonts } from '@src/config/fonts';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomText from '@src/views/atoms/CustomText';
import useSplashViewModel from '@src/viewModels/auth/Splash/useSplashViewModel';
import { fontSize } from '@src/config/styleConsts';
import { nPLusLogoGif, whiteNPlusLogoGif } from '@src/assets/gifs';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { NPlusLogo, NPlusLogoWhite } from '@src/assets/images';
import CustomLoader from '@src/views/atoms/CustomLoader';
import CustomToast from '@src/views/molecules/CustomToast';

/**
 * SplashScreen is a React functional component that renders the splash screen
 * of the application with animated logo and text slides.
 *
 * The component takes no props.
 *
 * The component displays a header with a logo, a subheading, and a list of
 * notification alert types with their toggle statuses.
 *
 * The component also renders a button to continue to the next step and a
 * footer with terms and conditions and a link to the privacy policy.
 *
 * @returns {JSX.Element} A screen component for managing notification alerts.
 */

const SplashScreen = () => {
  const {
    dateOpacity,
    buttonsOpacity,
    logoOpacity,
    t,
    currentDateInSpanish,
    styles,
    theme,
    showLogoGif,
    onLoginPress,
    onRegisterPress,
    onGuestUserPress,
    error,
    loading,
    alertVisible,
    darkMode,
    setAlertVisible,
    isInternetConnection
  } = useSplashViewModel();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.animationWrapper}>
          {showLogoGif ? (
            <Animated.Image
              source={
                darkMode.theme === 'dark' || (darkMode.theme === 'system' && colorScheme === 'dark')
                  ? whiteNPlusLogoGif
                  : nPLusLogoGif
              }
              style={StyleSheet.flatten([styles.logoAnimation, { opacity: logoOpacity }])}
              resizeMode="contain"
            />
          ) : darkMode.theme === 'dark' ||
            (darkMode.theme === 'system' && colorScheme === 'dark') ? (
            <NPlusLogoWhite
              height={actuatedNormalizeVertical(92)}
              width="100%"
              style={styles.logo}
            />
          ) : (
            <NPlusLogo height={actuatedNormalizeVertical(92)} width="100%" style={styles.logo} />
          )}
        </View>

        {showLogoGif ? (
          <>
            <Animated.Text style={{ opacity: dateOpacity }}>
              <CustomText
                size={fontSize['m']}
                weight="R"
                textStyles={styles.text}
                fontFamily={fonts.notoSerifExtraCondensed}
              >
                {currentDateInSpanish}
              </CustomText>
            </Animated.Text>

            <Animated.Text style={[styles.textWrapper, { opacity: dateOpacity }]}>
              <CustomText
                size={fontSize['2xl']}
                weight="M"
                textStyles={styles.subHeadingText}
                fontFamily={fonts.notoSerifExtraCondensed}
              >
                {t('screens.splash.text.decideInformed')}
              </CustomText>
            </Animated.Text>
          </>
        ) : (
          <>
            <View>
              <CustomText
                size={fontSize['m']}
                weight="R"
                textStyles={styles.text}
                fontFamily={fonts.notoSerifExtraCondensed}
              >
                {currentDateInSpanish}
              </CustomText>
            </View>

            <View>
              <CustomText
                size={fontSize['2xl']}
                weight="M"
                textStyles={styles.subHeadingText}
                fontFamily={fonts.notoSerifExtraCondensed}
              >
                {t('screens.splash.text.decideInformed')}
              </CustomText>
            </View>
          </>
        )}
      </View>

      {showLogoGif ? (
        <Animated.View style={{ opacity: buttonsOpacity }}>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={onLoginPress}
              buttonText={t('screens.splash.text.login')}
              buttonStyles={styles.loginButtonStyle}
              variant="outlined"
              buttonTextColor={theme.filledButtonPrimary}
              buttonTextStyles={styles.buttonTextStyle}
              getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
            />
            <CustomButton
              onPress={onRegisterPress}
              buttonText={t('screens.splash.text.signUp')}
              buttonStyles={styles.registerButtonStyle}
              buttonTextStyles={styles.buttonTextStyle}
            />
          </View>

          <CustomButton
            variant="text"
            buttonStyles={styles.guestUserButton}
            buttonText={t('screens.splash.text.continueAsGuest')}
            onPress={onGuestUserPress}
            buttonTextWeight="Dem"
            buttonTextStyles={styles.guestUserText}
          />
        </Animated.View>
      ) : (
        <View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={onLoginPress}
              buttonText={t('screens.splash.text.login')}
              buttonStyles={styles.loginButtonStyle}
              variant="outlined"
              buttonTextColor={theme.filledButtonPrimary}
              buttonTextStyles={styles.buttonTextStyle}
              getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
            />
            <CustomButton
              onPress={onRegisterPress}
              buttonText={t('screens.splash.text.signUp')}
              buttonStyles={styles.registerButtonStyle}
              buttonTextStyles={styles.buttonTextStyle}
            />
          </View>

          <CustomButton
            variant="text"
            buttonStyles={styles.guestUserButton}
            buttonText={t('screens.splash.text.continueAsGuest')}
            onPress={onGuestUserPress}
            buttonTextWeight="Dem"
            buttonTextStyles={styles.guestUserText}
            getTextColor={(pressed) =>
              pressed ? theme.adaptiveDangerSecondary : theme.titleForegroundInteractiveDefault
            }
          />
        </View>
      )}

      <CustomToast
        type="error"
        message={
          !isInternetConnection ? t('screens.splash.text.noInternetConnection') : error?.message
        }
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {loading && <CustomLoader />}
    </View>
  );
};

export default SplashScreen;
