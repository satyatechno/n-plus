import { View, StyleSheet, ActivityIndicator, ViewStyle, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import { SignalDisconnectedIcon, ErrorAlertIcon } from '@src/assets/icons';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

type ErrorStatus = 'noInternet' | 'error' | 'loading';

interface Props {
  status: ErrorStatus;
  onRetry?: () => void;
  containerStyles?: ViewStyle;
  fontSizeHeading?: number;
  fontSizeSubheading?: number;
  showRetryButton?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  showErrorButton?: boolean;
  contentContainerStyle?: ViewStyle;
  customTheme?: 'light' | 'dark';
  OnPressRetry?: () => void;
  buttonText?: string;
  errorTitle?: string;
  errorSubTitle?: string;
  Icon?: React.ElementType;
}

const ErrorScreen: React.FC<Props> = ({
  status,
  onRetry,
  fontSizeHeading,
  fontSizeSubheading,
  containerStyles,
  showRetryButton = true,
  showErrorButton = true,
  iconHeight,
  iconWidth,
  contentContainerStyle,
  customTheme,
  OnPressRetry,
  buttonText,
  errorTitle,
  errorSubTitle,
  Icon = ErrorAlertIcon
}) => {
  const navigation = useNavigation();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const handleBack = () => {
    navigation.goBack();
  };

  const renderContent = () => {
    switch (status) {
      case 'noInternet':
        return (
          <>
            <SignalDisconnectedIcon
              height={iconHeight}
              width={iconWidth}
              color={theme.iconIconographyGenericState}
            />
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              size={fontSizeHeading ?? fontSize['l']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.title}
            >
              {t('screens.splash.text.noInternetConnection')}
            </CustomText>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Boo"
              size={fontSizeHeading ?? fontSize['s']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.subtitle}
            >
              {t('screens.splash.text.checkConnection')}
            </CustomText>
            {showRetryButton && (
              <CustomButton
                variant="outlined"
                onPress={onRetry}
                buttonText={t('screens.splash.text.tryAgain')}
                buttonStyles={styles.button}
                buttonTextColor={theme.toastAndAlertsTextLiveToast}
                getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
              />
            )}
          </>
        );

      case 'error':
        return (
          <>
            <Icon height={iconHeight} width={iconWidth} fill={theme.iconIconographyGenericState} />
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              size={fontSizeHeading ?? fontSize['l']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.title}
            >
              {errorTitle ?? t('screens.validation.form.somethingWentWrong')}
            </CustomText>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Boo"
              size={fontSizeSubheading ?? fontSize['s']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.subtitle}
            >
              {errorSubTitle ?? t('screens.splash.text.somethingWentWrongDesc')}
            </CustomText>

            {showErrorButton && (
              <CustomButton
                variant="outlined"
                onPress={OnPressRetry ?? handleBack}
                buttonText={buttonText ?? t('screens.splash.text.back')}
                buttonStyles={styles.button}
                buttonTextColor={theme.toastAndAlertsTextLiveToast}
                getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
              />
            )}
          </>
        );

      case 'loading':
        return (
          <>
            <ActivityIndicator size="large" color={theme.subtitleTextSubtitle} />
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              size={fontSizeHeading ?? fontSize['l']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.title}
            >
              {t('screens.splash.text.contentLoads')}
            </CustomText>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Boo"
              size={fontSizeSubheading ?? fontSize['s']}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.subtitle}
            >
              {t('screens.splash.text.contentLoadsDesc')}
            </CustomText>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyles])}>
      <ScrollView
        contentContainerStyle={StyleSheet.flatten([styles.scrollContent, contentContainerStyle])}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollView}
      >
        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>
    </View>
  );
};

export default ErrorScreen;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: actuatedNormalizeVertical(spacing.xxs)
    },
    content: {
      alignItems: 'center'
    },
    title: {
      lineHeight: lineHeight['6xl'],
      marginTop: actuatedNormalizeVertical(spacing.s),
      textAlign: 'center'
    },
    subtitle: {
      lineHeight: lineHeight.l,
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      textAlign: 'center'
    },
    button: {
      marginTop: actuatedNormalizeVertical(spacing['4xl']),
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing['7xl']),
      textAlign: 'center',
      borderWidth: borderWidth.m,
      borderRadius: radius.m,
      width: '80%'
    }
  });
