import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { colors } from '@src/themes/colors';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    scrollView: {
      rowGap: spacing.xxs, // NOTE: THIS SPACE BETWEEN SECTIONS IS 8px
      marginTop: -spacing.xxxxs,
      paddingBottom: actuatedNormalizeVertical(90)
    },
    sectionGap: {
      marginBottom: spacing.s // NOTE: THIS SPACE BETWEEN SECTIONS IS 16px
    },
    floatingView: {
      width: actuatedNormalize(130),
      borderRadius: radius.l,
      overflow: 'hidden',
      position: 'absolute',
      bottom: actuatedNormalize(110),
      right: actuatedNormalize(spacing.s),
      padding: actuatedNormalize(spacing.xxs),
      backgroundColor: colors.ultraMarineBlue
    },
    toastContainer: {
      width: '92%'
    },
    containerStyles: {
      top: actuatedNormalizeVertical(240)
    }
  });
