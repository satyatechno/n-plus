import { StyleSheet } from 'react-native';

import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, radius, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';

export const FOOTER_HEIGHT = actuatedNormalizeVertical(72);

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    container: {
      paddingBottom: actuatedNormalizeVertical(62)
    },
    titleText: {
      lineHeight: lineHeight['4xl'],
      marginTop: spacing.s,
      marginHorizontal: actuatedNormalize(spacing.xs),
      fontWeight: '700'
    },
    excerpt: {
      marginTop: spacing.xxs,
      marginHorizontal: actuatedNormalize(spacing.xs),
      fontWeight: '400',
      lineHeight: 18
    },
    date: {
      lineHeight: lineHeight.xs,
      color: theme.labelsTextLabelPlay,
      marginHorizontal: spacing.xs,
      marginTop: spacing.xs
    },
    screenWidthStyles: { width: SCREEN_WIDTH },
    videoContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center'
    },
    videoContainerPortrait: {
      aspectRatio: 4 / 5
    },
    blankView: {
      backgroundColor: theme.filledButtonAction,
      aspectRatio: 16 / 9,
      width: '100%',
      zIndex: 99,
      justifyContent: 'center',
      alignItems: 'center'
    },
    videoSection: {
      marginVertical: spacing.s
    },
    summaryContainer: {
      marginHorizontal: spacing.s
    },
    textStyles: {
      color: theme.labelsTextLabelTime
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    paginationDot: {
      width: actuatedNormalize(8),
      height: actuatedNormalize(8),
      borderRadius: radius.xxs,
      marginHorizontal: actuatedNormalize(3),
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.m,
      bottom: actuatedNormalizeVertical(6)
    },
    paginationDotActive: {
      backgroundColor: theme.iconIconographyGenericState
    },
    contentContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    captionTextStyle: {
      minHeight: actuatedNormalizeVertical(0)
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
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
    },
    caption: {
      color: theme.labelsTextLabelPlace,
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      top: actuatedNormalizeVertical(spacing.xxxs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    extraCaptionMargin: {
      top: actuatedNormalizeVertical(spacing.xxs)
    },
    scrollContent: {
      paddingBottom: FOOTER_HEIGHT + actuatedNormalizeVertical(spacing.xs)
    },
    pipModeBackground: { position: 'absolute', top: 0, left: 0 },
    imageContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    opinionsListContent: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    itemSeparator: {
      borderRightWidth: borderWidth.s,
      borderRightColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.l),
      height: '90%'
    },
    opinionRecentTitle: {
      marginTop: spacing['xl'],
      marginBottom: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['5xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    imageStyle: {
      borderRadius: actuatedNormalize(80),
      alignSelf: 'flex-start',
      width: 80,
      height: 80,
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    titleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    categoryTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      color: theme.labelsTextLabelPlay,
      bottom: actuatedNormalizeVertical(3)
    },
    subTitleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      width: actuatedNormalize(174),
      color: theme.sectionTextTitleSpecial
    },
    contentContainerStyle: {
      width: actuatedNormalize(190)
    },
    headerStyle: {
      lineHeight: lineHeight.m,
      marginBottom: 0
    },
    subHeadingStyles: {
      lineHeight: lineHeight.xs
    },
    toastContainer: {
      width: '92%',
      backgroundColor: theme.mainBackgroundSecondary
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
    divider: {
      top: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs),
      width: '88%',
      marginVertical: actuatedNormalizeVertical(spacing.m)
    }
  });
