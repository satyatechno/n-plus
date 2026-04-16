import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import { lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs'])
    },
    headerTextStyles: {
      top: actuatedNormalizeVertical(3)
    },
    headerContainer: {
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },

    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    verticalImageStyle: {
      width: actuatedNormalize(130),
      height: actuatedNormalizeVertical(130)
    },
    verticalVideoItemSeparator: {
      height: actuatedNormalizeVertical(isIos ? 1 : 2),
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.s),
      backgroundColor: theme.dividerGrey
    },
    indevidualContentdivider: {
      height: actuatedNormalizeVertical(isIos ? 1 : 2),
      marginBottom: actuatedNormalizeVertical(spacing.s),
      backgroundColor: theme.dividerGrey
    },
    verticalHeading: {
      marginTop: -2,
      lineHeight: undefined // undefined is used to remove the default line height
    },
    recommendedContainer: {
      flex: 1
    },
    primeContentContainer: {
      width: '100%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    primeImageStyle: {
      height: actuatedNormalizeVertical(207)
    },
    primeSubheadingStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['4xl']),
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    sectionHeading: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    }
  });
