import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    backButtonStyle: {
      borderColor: theme.outlinedButtonDarkTheme
    },
    detailImage: {
      width: '100%',
      height: actuatedNormalizeVertical(222)
    },
    detailView: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    detailTitle: {
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.xxs,
      color: theme.carouselTextDarkTheme,
      marginTop: spacing.xx,
      marginBottom: spacing.xxx,
      marginHorizontal: spacing.xs
    },
    detailPublishedAtContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.s,
      marginHorizontal: spacing.xs,
      justifyContent: 'space-between'
    },
    detailPublishedAtSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.s
    },
    detailPublishedAt: {
      letterSpacing: letterSpacing.none,
      color: theme.carouselTextDarkTheme
    },
    recentlyAddedContainer: {},
    summaryText: {
      marginTop: spacing.xxx,
      color: theme.carouselTextDarkTheme
    },
    recentlyAddedTitle: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: spacing.xxs,
      marginTop: spacing.xs,
      marginBottom: spacing.s
    },
    recentlyAddedItem: {
      width: '48%',
      marginBottom: spacing.s
    },
    recentlyAddedItemTitle: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      color: theme.carouselTextDarkTheme
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    separator: {
      marginHorizontal: spacing.xs,
      marginVertical: spacing.xs,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    listContainer: {
      paddingBottom: spacing.s
    },
    flatList: {
      paddingHorizontal: spacing.xs
    },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    toastContainer: {
      width: '92%'
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
