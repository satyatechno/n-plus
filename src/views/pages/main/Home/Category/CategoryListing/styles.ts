import { StyleSheet } from 'react-native';

import { borderWidth, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_HEIGHT
} from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.mainBackgroundDefault,
      minHeight: SCREEN_HEIGHT
    },
    listContainer: {
      paddingTop: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing['10xl'])
    },
    divider: {
      borderBottomWidth: borderWidth.s,
      borderColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      color: theme.mainBackgroundDefault
    },
    toastContainer: {
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    }
  });
