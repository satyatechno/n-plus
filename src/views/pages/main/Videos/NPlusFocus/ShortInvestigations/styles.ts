import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: actuatedNormalizeVertical(3),
      letterSpacing: letterSpacing.none
    },
    headerStyle: {
      justifyContent: 'space-between',
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    title: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      marginTop: spacing.s,
      borderBottomColor: theme.dividerSecondary,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs
    },
    listContainer: {
      paddingBottom: actuatedNormalizeVertical(spacing.l)
    },
    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    verticalImageStyle: {
      width: 100,
      height: 100
    },
    verticalVideoItemSeparator: {
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      borderBottomColor: theme.dividerPrimary
    },
    verticalHeading: {
      marginTop: actuatedNormalizeVertical(0),
      color: theme.newsTextDarkThemePages
    },
    verticalSubHeading: {
      color: theme.newsTextDarkThemePages,
      marginTop: spacing.xxxs
    },
    verticalSubHeadingNoImage: {
      color: theme.newsTextDarkThemePages,
      marginTop: spacing.xxxs
    },
    shortsContainer: {
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    listContentContainer: {
      flexGrow: 1
    },
    loaderContainer: {
      paddingVertical: spacing.m,
      alignItems: 'center',
      justifyContent: 'center'
    },
    skeletonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.s),
      columnGap: actuatedNormalize(spacing.xs),
      width: '100%',
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    skeletonImage: {
      borderRadius: radius.xxs
    },
    skeletonTextContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: actuatedNormalize(spacing.s)
    },
    skeletonTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      borderRadius: radius.xxs
    },
    skeletonDuration: {
      borderRadius: radius.xxs
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    seeAllButton: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      alignSelf: 'flex-start'
    },
    duration: {
      borderRadius: radius.xxs
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.s),
      columnGap: actuatedNormalize(spacing.xs)
    },
    image: {
      borderRadius: radius.xxs
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: actuatedNormalize(spacing.s)
    },
    buttonStyle: {
      borderColor: theme.buttonOutlineGrey
    }
  });
