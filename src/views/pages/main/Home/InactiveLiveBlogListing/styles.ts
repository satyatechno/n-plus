import { StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    header: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    headerText: {
      flex: 1,
      textAlign: 'center',
      top: actuatedNormalizeVertical(2),
      lineHeight: lineHeight['2xl'],
      letterSpacing: letterSpacing.xs
    },
    inactiveTitle: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    additionalButton: {
      borderWidth: borderWidth.none
    },
    listingContainer: {
      flex: 1
    },
    divider: {
      borderTopWidth: borderWidth.ss,
      borderColor: theme.dividerPrimary,
      marginVertical: actuatedNormalizeVertical(spacing.l)
    },
    inactiveBlogContainer: {
      paddingBottom: actuatedNormalizeVertical(spacing.xl)
    },
    seeAllLiveNewsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    seeAllLiveNewsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    error: { padding: actuatedNormalize(spacing.s) }
  });
