import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: actuatedNormalizeVertical(3)
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    topicChipsTitle: {
      lineHeight: spacing['2xl'],
      letterSpacing: -0.25,
      marginBottom: spacing.xx
    },
    topicChipsContainerStyle: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.s,
      marginBottom: spacing.xs,
      paddingBottom: spacing.xx,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.iconIconographyGenericState
    },
    contentContainerStyle: {
      width: '49%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    titleStyles: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      lineHeight: lineHeight.l
    },
    subTitleStyles: {
      lineHeight: lineHeight.xs,
      marginTop: spacing.xxxs
    },
    skeletonWrapper: {
      width: '48%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    skeletonSpacing: {
      marginBottom: actuatedNormalizeVertical(6)
    },
    errorContainer: {
      top: actuatedNormalizeVertical(-50)
    },
    scrollContent: {
      flexGrow: 1
    },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    columnWrapper: {
      justifyContent: 'space-between',
      gap: spacing.xs
    },
    loader: {
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: 'auto',
      backgroundColor: theme.filledButtonPrimary,
      overflow: 'hidden',
      aspectRatio: 4 / 5
    },
    programHeroImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: 4 / 5
    },
    programDetailContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m),
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    programTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    talentsTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      textAlign: 'center'
    },
    scheduleText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    lastEpisodeButton: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    description: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    bookMarkContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing['m']),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    modalButtonContainer: { paddingTop: 0 },
    toastContainer: { width: '92%' },

    date: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      color: theme.labelsTextLabelPlace
    },
    divider: {
      marginVertical: actuatedNormalizeVertical(spacing.s),
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
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    relatedVideoTitle: {
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerBlack,
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    separator: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginVertical: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    verticalSubheading: {
      bottom: actuatedNormalizeVertical(5)
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    programContainer: {
      width: actuatedNormalize(100),
      alignItems: 'center'
    },
    programImage: {
      width: 80,
      height: 80,
      alignSelf: 'center',
      borderRadius: 80
    },
    talentsContainer: {
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingVertical: actuatedNormalizeVertical(spacing['2xl'])
    },
    planetHeading: {
      color: theme.newsTextDarkThemePages,
      borderBottomColor: theme.newsTextDarkThemePages,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    relatedHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      borderBottomWidth: 1,
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      borderBottomColor: theme.iconIconographyGenericState
    },
    relatedContainer: {
      marginTop: actuatedNormalizeVertical(spacing['2xl'])
    },
    lastRelatedContainer: {
      marginVertical: actuatedNormalizeVertical(spacing['2xl'])
    },
    imageStyle: { marginTop: actuatedNormalizeVertical(spacing.s) },
    programTitleStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    programSubtitleStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    programSkeletonImage: {
      borderRadius: actuatedNormalizeVertical(80)
    },
    seeMoreText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      paddingTop: actuatedNormalizeVertical(spacing.xxs)
    },
    adBannerContainer: {
      marginBottom: actuatedNormalizeVertical(spacing['2xl']),
      marginTop: actuatedNormalizeVertical(spacing.s)
    }
  });
