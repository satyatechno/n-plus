import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerContainer: {
      paddingHorizontal: spacing.xs,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xs,
      height: 36
    },
    pipModeContainer: {
      position: 'absolute',
      bottom: 130,
      right: 5,
      width: 279,
      height: 150,
      backgroundColor: theme.mainBackgroundDefault
    },
    latestNewsTitle: {
      marginBottom: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['5xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    nPlusVideoTitle: {
      marginBottom: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['5xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    searchButton: {
      borderWidth: 0
    },
    scrollView: {
      paddingBottom: 70,
      flexGrow: 1
    },
    sectionGap: {
      marginBottom: spacing.l
    },
    programContainer: {
      width: 110
    },
    programImage: {
      width: 80,
      height: 80,
      borderRadius: 45
    },
    programTitle: {
      width: 70,
      textAlign: 'center',
      lineHeight: lineHeight.l
    },
    planetTitle: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      marginTop: spacing.xxs
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs
    },
    fullCarouselContainer: {
      paddingLeft: spacing.xs
    },
    videosList: {
      paddingLeft: spacing.xs
    },
    topicChipsTitle: {
      marginBottom: spacing.xx,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs
    },
    mainContainerStyle: {
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xx,
      marginHorizontal: spacing.xs,
      borderBottomColor: theme.iconIconographyGenericState,
      marginBottom: spacing.xs
    },
    programTitleStyle: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxxs
    },
    programSubtitleStyle: {
      lineHeight: lineHeight.xs,
      marginTop: spacing.xxxs
    },
    videosListTitle: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.xs,
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    videoItemSeparator: {
      height: spacing.m
    },
    nPlusFocusImage: {
      width: '100%',
      height: 584
    },
    fullImageContainer: {
      width: '100%',
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.xs
    },
    fullNplusPrimaryImageContainer: {
      width: undefined,
      height: 200
    },
    nplusVideoHeroTitle: {
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs,
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.none
    },
    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: spacing.xs
    },
    verticalImageStyle: {
      width: 100,
      height: 100
    },
    verticalVideoItemSeparator: {
      height: 1,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      backgroundColor: theme.dividerGrey
    },
    verticalHeading: {
      marginTop: -2,
      lineHeight: lineHeight.s
    },
    carouselContainerView: {
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: spacing.s
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 120
    },
    containerStyle: {
      marginTop: spacing.l
    },
    planetHeading: {
      color: theme.newsTextDarkThemePages,
      borderBottomColor: theme.newsTextDarkThemePages,
      marginHorizontal: spacing.xs,
      lineHeight: lineHeight['5xl'],
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs
    },
    contentContainerStyle: {
      marginVertical: spacing.xxxs
    },
    programasSkeletonContainer: {
      marginTop: spacing.s
    },
    toastContainer: { width: '92%' },
    seeAllButtonStyle: {
      marginBottom: spacing.m
    },
    seeAllButtonStyles: {
      marginVertical: spacing.s
    },
    exclusiveHeadingStyles: {
      marginHorizontal: spacing.xs,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs
    },
    titleStyles: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxs
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: spacing.xs,
      backgroundColor: theme.mainBackgroundDefault
    },
    adBannerContainer: {},
    carouselTagStyle: {
      lineHeight: lineHeight.s,
      letterSpacing: 0.12,
      marginTop: spacing.xxs
    },
    carouselTitleStyle: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs
    },
    errorContainer: {
      top: actuatedNormalizeVertical(195)
    },
    scrollViewWithWidgets: {}
  });
