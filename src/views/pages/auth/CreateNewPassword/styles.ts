import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fullContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    childContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    header: {
      marginLeft: actuatedNormalize(spacing.xl)
    },
    scrollContainer: {
      paddingHorizontal: actuatedNormalize(spacing.xl),
      paddingBottom: actuatedNormalizeVertical(spacing.m)
    },
    inputContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    confirmPasswordInputContainer: {
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    footerText: {
      textAlign: 'center',
      marginTop: actuatedNormalize(spacing.m)
    },
    footerLink: {
      textDecorationLine: 'underline'
    },
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    formErrorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: actuatedNormalize(spacing.m)
    },
    formErrorText: {
      textAlign: 'center',
      color: theme.errorTextColor,
      fontSize: actuatedNormalizeVertical(fontSize.s)
    },
    titleText: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      lineHeight: lineHeight['2xl']
    },
    subtitleText: {
      marginBottom: actuatedNormalizeVertical(spacing['2xl']),
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    labelText: {
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    textInputStyles: {
      paddingRight: '20%'
    },
    validContinueButtonStyle: {
      height: actuatedNormalizeVertical(52),
      marginTop: actuatedNormalizeVertical(72),
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.filledButtonPrimary,
      borderRadius: radius.m
    },
    inValidContinueButtonStyle: {
      height: actuatedNormalizeVertical(52),
      marginTop: actuatedNormalizeVertical(72),
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.greyButtonDisabled,
      borderRadius: radius.m
    },
    passwordMatchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    circle: {
      width: actuatedNormalize(18),
      height: actuatedNormalize(18),
      borderRadius: actuatedNormalize(18),
      marginRight: actuatedNormalize(spacing.xxs),
      marginLeft: actuatedNormalize(spacing.xxxs),
      backgroundColor: 'transparent'
    },
    circleFilled: {
      backgroundColor: theme.iconIconographyVerifiedState,
      borderColor: theme.iconIconographyVerifiedState
    },
    circleEmpty: {
      borderWidth: borderWidth.m,
      borderColor: theme.iconIconographyDisabledState1,
      backgroundColor: 'transparent'
    },
    tickIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    passwordMatchText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    passwordLabel: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    confirmPasswordLabel: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    headerText: {
      top: '5%'
    },
    circleRedFilled: {
      backgroundColor: theme.iconIconographyError
    }
  });
