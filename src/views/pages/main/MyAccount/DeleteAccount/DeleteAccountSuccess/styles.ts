import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    continueButton: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(spacing['9xl']),
      width: actuatedNormalize(320),
      height: actuatedNormalizeVertical(52),
      marginTop: actuatedNormalizeVertical(spacing['6xl']),
      borderRadius: radius['m'],
      backgroundColor: theme.filledButtonPrimary
    },
    headingStyle: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing['s'])
    },
    subHeadingStyle: {
      textAlign: 'center',
      marginHorizontal: actuatedNormalizeVertical(spacing['xs'])
    }
  });
