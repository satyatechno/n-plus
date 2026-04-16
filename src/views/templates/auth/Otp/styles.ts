import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainRootContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xl'])
    },
    rootContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    scrollContent: {
      flexGrow: 1
    },
    scrollContainer: {
      flex: 1
    },
    headingTitle: {
      textAlign: 'left',
      marginTop: actuatedNormalizeVertical(spacing['s']),
      lineHeight: actuatedNormalizeVertical(spacing['2xl']),
      color: theme.sectionTextTitleSpecial
    },
    headingSubtitle: {
      textAlign: 'left',
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      fontSize: actuatedNormalizeVertical(fontSize['xs']),
      color: theme.subtitleTextSubtitle
    },
    errorMessage: {
      fontSize: actuatedNormalizeVertical(fontSize['xxs']),
      marginTop: actuatedNormalizeVertical(spacing['xs']),
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      color: theme.onBoardingTextErrorHelperText
    },
    resendMessage: {
      textAlign: 'center',
      fontSize: actuatedNormalizeVertical(fontSize['xs']),
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    resendUnderline: {
      textDecorationLine: 'underline'
    },
    primaryButtonDisabled: {
      backgroundColor: theme.greyButtonDisabled
    },
    primaryButtonEnabled: {
      backgroundColor: theme.filledButtonPrimary
    },
    mainContent: {
      marginTop: actuatedNormalizeVertical(spacing['m']),
      paddingRight: actuatedNormalize(2)
    },
    primaryButton: {
      marginTop: actuatedNormalizeVertical(spacing['m'])
    },
    resendCountdownWrapper: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    buttonText: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    otpInputWrapper: {
      marginTop: actuatedNormalizeVertical(spacing['4xl']),
      marginBottom: actuatedNormalizeVertical(72)
    },
    headerText: {
      top: actuatedNormalizeVertical(2)
    },
    text: {
      color: theme.subtitleTextSubtitle,
      lineHeight: lineHeight.l,
      bottom: actuatedNormalizeVertical(spacing.xxs),
      textAlign: 'center'
    }
  });
