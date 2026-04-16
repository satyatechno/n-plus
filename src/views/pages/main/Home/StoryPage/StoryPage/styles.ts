import { Dimensions, StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';

const { width: screenWidth } = Dimensions.get('window');
export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.mainBackgroundDefault },
    headerContainer: { zIndex: 1000 },
    bannerAdContainer: {
      alignItems: 'center',
      backgroundColor: theme.adsBackground,
      paddingTop: spacing.s
    },
    contentContainer: { paddingHorizontal: spacing.xs },
    heading: {
      lineHeight: lineHeight['4xl'],
      letterSpacing: letterSpacing.xxs,
      marginBottom: spacing.xxs,
      marginTop: 0
    },
    headingWithMargin: {
      lineHeight: lineHeight['7xl'],
      letterSpacing: letterSpacing.xxs,
      marginTop: spacing.s,
      marginBottom: spacing.xxx
    },
    breakingNewsText: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.sm,
      marginTop: spacing.m
    },
    subHeading: {
      lineHeight: lineHeight['l'],
      letterSpacing: letterSpacing.xs,
      marginTop: 0
    },
    summaryContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      borderWidth: borderWidth.m,
      borderColor: theme.dividerGrey,
      paddingHorizontal: spacing.s,
      marginVertical: spacing.m
    },
    summarheading: {
      lineHeight: lineHeight['6xl'],
      letterSpacing: letterSpacing.xxxs
    },
    summarySubHeading: {
      lineHeight: lineHeight['2xl'],
      letterSpacing: letterSpacing.xs,
      marginVertical: spacing.s
    },
    error: {
      padding: spacing.s
    },
    recommendedStoriesTitle: {
      lineHeight: lineHeight['6xl'],
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginTop: spacing['2xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      letterSpacing: letterSpacing.xxxs
    },
    blankView: {
      backgroundColor: theme.filledButtonAction,
      aspectRatio: 16 / 9,
      width: '100%',
      zIndex: 99,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textStyles: {
      color: theme.labelsTextLabelTime
    },
    videoContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center'
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: radius.xxs,
      marginHorizontal: 3,
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.s
    },
    paginationDotActive: {
      backgroundColor: theme.iconIconographyGenericState
    },
    captionArea: {
      minHeight: spacing['6xl'],
      justifyContent: 'center'
    },
    captionText: {
      color: theme.labelsTextLabelPlace,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: spacing.xxs,
      paddingVertical: spacing.xxxs,
      textAlign: 'center',
      lineHeight: lineHeight.m
    },
    videoSection: {
      marginVertical: spacing.xxs
    },
    pipModeContainer: {
      position: 'absolute',
      bottom: 130,
      right: 5,
      width: 279
    },
    pipModeContainerBackground: {
      width: 215
    },
    latestNewsTitle: {
      lineHeight: lineHeight['6xl'],
      letterSpacing: letterSpacing.xxxs,
      marginTop: spacing['2xl'],
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.m,
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    screenWidthStyles: { width: screenWidth },
    caption: {
      minHeight: 38,
      color: theme.labelsTextLabelPlace,
      lineHeight: lineHeight.s
    },
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
    },
    extraCaptionMargin: {},
    mainContainerstyle: {
      marginTop: spacing['2xl']
    },
    headingChipsstyle: {
      letterSpacing: letterSpacing.s,
      marginBottom: 0,
      lineHeight: lineHeight['2xl']
    },
    chipsContainerStyle: {
      borderWidth: borderWidth.s
    },
    chipsListContainerStyle: {
      paddingStart: spacing.xs,
      paddingVertical: 2
    },
    latestNewslistContainer: {
      paddingLeft: spacing.xs,
      paddingRight: 0
    },
    fullScreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.mainBackgroundDefault,
      zIndex: 1000
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundDefault,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerGrey,
      paddingLeft: spacing.xs
    }
  });
