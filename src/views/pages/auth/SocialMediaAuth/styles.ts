import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['2xl'])
    },
    container: {
      flex: 1
    },
    introScreen: {
      flex: 1
    },
    headerContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    inputContainer: {
      height: actuatedNormalizeVertical(82),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing['7xl'])
    },
    socialButtonContainer: {
      height: actuatedNormalizeVertical(52),
      width: '100%',
      borderWidth: 1,
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: radius.m,
      justifyContent: 'center',
      borderColor: theme.outlinedButtonSecondaryOutline,
      backgroundColor: theme.tabsBackgroundDefault,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      gap: actuatedNormalize(spacing.xs)
    },
    descriptionText: {
      textAlign: 'center',
      color: theme.filledButtonAction,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    logInLinkContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing['9xl']),
      gap: actuatedNormalize(spacing.xxxs)
    },
    validContinueButtonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.filledButtonPrimary,
      borderRadius: radius.m
    },
    inValidContinueButtonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.greyButtonDisabled,
      borderRadius: radius.m
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    orDividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    orLineLeft: {
      flex: 1,
      height: 1
    },
    orLineRight: {
      flex: 1,
      height: 1
    },
    orText: {
      marginHorizontal: actuatedNormalize(spacing.s),
      lineHeight: actuatedNormalizeVertical(lineHeight.xs),
      color: theme.bodyTextOther,
      top: actuatedNormalizeVertical(3)
    },
    textStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    labelTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing['xxxs'])
    },
    formErrorContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    formErrorText: {
      textAlign: 'center'
    },
    innerContainer: {
      flex: 1
    },
    introScreenView: {
      flex: 1
    }
  });
