import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import { radius, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs'])
    },
    keyboardAvoid: {
      flex: 1
    },
    container: {
      flex: 1
    },
    headerTextStyles: {
      top: actuatedNormalizeVertical(2)
    },
    formContainer: {
      marginVertical: actuatedNormalizeVertical(spacing['4xl']),
      gap: actuatedNormalizeVertical(spacing.l),
      marginRight: actuatedNormalize(spacing.xxxs)
    },
    validContinueButtonStyle: {
      width: '100%',
      alignSelf: 'center',
      borderRadius: radius.m,
      backgroundColor: theme.filledButtonPrimary,
      marginBottom: actuatedNormalizeVertical(spacing['s'])
    },
    inValidContinueButtonStyle: {
      width: '100%',
      alignSelf: 'center',
      borderRadius: radius.m,
      backgroundColor: theme.greyButtonDisabled,
      marginBottom: actuatedNormalizeVertical(spacing['s'])
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    dropdownContainer: {
      position: 'absolute',
      top: '75%',
      width: '100%',
      alignSelf: 'center',
      borderRadius: radius['m'],
      borderColor: theme.inputFillForegroundInteractiveFilled,
      borderWidth: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    dropdownText: {
      marginHorizontal: actuatedNormalize(spacing['m']),
      marginVertical: actuatedNormalizeVertical(spacing['xs']),
      color: theme.sectionTextTitleSpecial
    },
    rightIconStyle: {
      top: '35%'
    },
    toastStyle: {
      alignSelf: 'center'
    },
    toastContainerStyles: {
      borderColor: theme.iconIconographyVerifiedState
    },
    formErrorContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    formErrorText: {
      textAlign: 'center'
    }
  });
