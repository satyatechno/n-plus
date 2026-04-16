import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xl'])
    },
    innerContainer: {
      alignItems: 'center'
    },
    headingStyle: {
      textAlign: 'center',
      fontSize: actuatedNormalizeVertical(fontSize['l'])
    },
    subHeadingStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l']),
      textAlign: 'center',
      fontSize: actuatedNormalizeVertical(fontSize['s'])
    },
    continueText: {
      top: actuatedNormalizeVertical(3),
      fontSize: actuatedNormalizeVertical(fontSize['s']),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    }
  });
