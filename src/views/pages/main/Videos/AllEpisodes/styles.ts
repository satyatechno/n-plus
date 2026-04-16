import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerText: {
      top: isIos ? actuatedNormalizeVertical(3) : actuatedNormalizeVertical(4),
      flex: 1,
      textAlign: 'center',
      lineHeight: lineHeight['2xl'],
      marginLeft: actuatedNormalize(0),
      marginRight: actuatedNormalize(spacing.xxs)
    },
    separator: {
      width: '100%',
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    headerWrapper: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    verticalHeading: {
      marginTop: actuatedNormalizeVertical(0)
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
    relatedVideosContainer: {
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing['4xl'])
    },
    relatedVideoTitle: {
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerBlack,
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    verticalSubheading: {
      bottom: actuatedNormalizeVertical(5)
    },
    divider: {
      marginVertical: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    loadingContainer: {
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      justifyContent: 'center',
      alignItems: 'center'
    },
    loader: {
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    flatList: {
      flex: 1
    },
    errorContainer: {
      top: actuatedNormalizeVertical(-50)
    },
    scrollContent: {
      flexGrow: 1
    },
    seeMoreText: {
      alignSelf: 'flex-start',
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs,
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      paddingTop: actuatedNormalizeVertical(spacing.s)
    }
  });
