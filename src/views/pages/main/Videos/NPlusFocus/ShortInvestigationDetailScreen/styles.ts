import { Dimensions, StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const { width: screenWidth } = Dimensions.get('window');
export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.mainBackgroundDefault },
    scrollContainer: { paddingBottom: actuatedNormalizeVertical(84) },
    headerContainer: { zIndex: 1000 },
    contentContainer: { paddingHorizontal: actuatedNormalize(spacing.xs) },
    heading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      letterSpacing: letterSpacing.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
      marginTop: 0
    },
    headingWithMargin: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      letterSpacing: letterSpacing.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    breakingNewsText: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.sm,
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    subHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      letterSpacing: letterSpacing.xs,
      marginTop: 0
    },
    summaryContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      borderWidth: borderWidth.m,
      borderColor: theme.dividerGrey,
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    summarheading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      letterSpacing: letterSpacing.xxxs
    },
    summarySubHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      letterSpacing: letterSpacing.xs,
      marginVertical: actuatedNormalizeVertical(spacing.s)
    },
    error: {
      padding: actuatedNormalize(spacing.s)
    },
    recommendedStoriesTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
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
      width: actuatedNormalize(6),
      height: actuatedNormalize(6),
      borderRadius: radius.xxs,
      marginHorizontal: actuatedNormalize(3),
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.m,
      bottom: actuatedNormalizeVertical(6)
    },
    paginationDotActive: {
      backgroundColor: theme.iconIconographyGenericState
    },
    captionArea: {
      minHeight: actuatedNormalizeVertical(spacing['6xl']),
      justifyContent: 'center'
    },
    captionText: {
      color: theme.labelsTextLabelPlace,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(spacing.xxxs),
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    videoSection: {
      marginVertical: actuatedNormalizeVertical(spacing.s)
    },
    pipModeContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(130),
      right: actuatedNormalize(5),
      width: actuatedNormalize(279)
    },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    latestNewsTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      letterSpacing: letterSpacing.xxxs,
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    screenWidthStyles: { width: screenWidth },
    caption: {
      minHeight: actuatedNormalizeVertical(38),
      color: theme.labelsTextLabelPlace,
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      bottom: actuatedNormalizeVertical(10)
    },
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
    },
    extraCaptionMargin: {
      top: actuatedNormalizeVertical(spacing.xxs)
    },
    mainContainerstyle: {
      marginTop: actuatedNormalizeVertical(spacing['2xl'])
    },
    headingChipsstyle: {
      letterSpacing: letterSpacing.s
    },
    chipsContainerStyle: {
      borderWidth: borderWidth.s
    },
    chipsListContainerStyle: {
      paddingStart: actuatedNormalize(spacing.xs)
    },
    latestNewslistContainer: {
      paddingLeft: actuatedNormalize(spacing.xs),
      paddingRight: 0
    },
    viewInvestigationTextStyles: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: actuatedNormalize(spacing.xs),
      bottom: actuatedNormalizeVertical(spacing.m),
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      lineHeight: actuatedNormalizeVertical(lineHeight['8xl']),
      paddingBottom: actuatedNormalizeVertical(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing['6xl'])
    },
    headingStyles: {
      color: theme.carouselTextDarkTheme
    },
    subheadingStyles: {
      color: theme.overlayWhite
    },
    bottomRowStyles: {
      bottom: actuatedNormalizeVertical(spacing.s)
    },
    bookmarkCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      bottom: actuatedNormalizeVertical(spacing.s)
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
    }
  });
