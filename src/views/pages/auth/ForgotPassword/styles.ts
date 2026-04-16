import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { radius, spacing } from '@src/config/styleConsts';
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
    inputContainer: {
      height: actuatedNormalizeVertical(95),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing['6xl'])
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
    headerTextStyles: {
      top: actuatedNormalizeVertical(2)
    }
  });
