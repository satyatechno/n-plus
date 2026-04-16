import { StyleSheet } from 'react-native';

import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { radius, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    continueButton: {
      width: '90%',
      height: actuatedNormalizeVertical(52),
      marginTop: actuatedNormalizeVertical(spacing['6xl']),
      borderRadius: radius['m'],
      backgroundColor: theme.filledButtonPrimary
    }
  });
