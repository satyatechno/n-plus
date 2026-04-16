import { StyleSheet } from 'react-native';

import { borderWidth, lineHeight, spacing, letterSpacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    title: {
      color: theme.tagsTextAuthor,
      lineHeight: lineHeight['3xl'],
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.xx
    },
    summaryText: {
      marginTop: spacing.xxx,
      letterSpacing: letterSpacing.xs
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerButton: {
      padding: actuatedNormalize(spacing.xxxs)
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.xxs
    },
    summaryContainer: {
      flex: 0.5
    },
    date: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      top: actuatedNormalizeVertical(3)
    },
    divider: {
      marginVertical: spacing.xs,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
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
      flex: 1,
      marginTop: spacing.xs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    relatedVideoTitle: {
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerBlack,
      marginTop: spacing.xl,
      lineHeight: lineHeight['5xl'],
      paddingBottom: spacing.xxs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    separator: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.xxxs,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    verticalSubheading: {},
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    errorContainer: {
      top: actuatedNormalizeVertical(-50)
    },
    scrollContent: {
      flexGrow: 1
    },
    toastContainer: { width: '92%' },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    fullScreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '110%',
      backgroundColor: theme.mainBackgroundDefault,
      zIndex: 1000
    }
  });
