import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xl'])
    },
    formErrorContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    formErrorText: {
      textAlign: 'center'
    },
    emailLabel: {
      marginTop: actuatedNormalizeVertical(spacing['2xl'])
    },
    passwordLabel: {
      marginTop: actuatedNormalizeVertical(spacing['l'])
    },
    forgotPasswordButton: {
      marginTop: actuatedNormalizeVertical(spacing['xxs']),
      alignSelf: 'flex-end'
    },
    forgotPasswordButtonText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    button: {
      marginTop: actuatedNormalizeVertical(72) //TODO-> not listed in styleConsts
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    toastIconStyle: {
      alignSelf: 'flex-start'
    },
    passwordInput: {
      paddingRight: '20%',
      paddingVertical: actuatedNormalizeVertical(10)
    },
    headerText: {
      top: actuatedNormalizeVertical(2)
    },
    keyboardAvoidingView: {
      flex: 1
    },
    scrollContainer: {
      paddingHorizontal: actuatedNormalize(2),
      flexGrow: 1
    }
  });
