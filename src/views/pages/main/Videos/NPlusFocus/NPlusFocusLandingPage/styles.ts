import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage
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
      borderBottomColor: theme.dividerPrimary,
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: actuatedNormalizeVertical(452),
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    programHeroImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: 4 / 5
    },
    programDetailContainer: {
      marginHorizontal: spacing.xs,
      paddingBottom: spacing.xxxs,
      bottom: spacing.s
    },
    programTitle: {
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.xxs,
      color: theme.carouselTextDarkTheme
    },
    talentsTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      textAlign: 'center'
    },
    scheduleText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    lastEpisodeButton: {
      marginTop: spacing.s,
      marginBottom: spacing.s
    },
    description: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.xs,
      marginBottom: spacing.s,
      color: theme.carouselTextDarkTheme
    },
    bookMarkContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing['m']),
      marginTop: actuatedNormalizeVertical(spacing['l'])
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: actuatedNormalizeVertical(120)
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    toastContainer: { width: '92%' },
    videosList: {
      marginBottom: spacing.l,
      paddingLeft: spacing.xs
    },
    videoItemSeparator: {
      height: spacing.m
    },
    videosListTitle: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.xs,
      borderBottomColor: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      color: theme.carouselTextDarkTheme
    },
    modalContainer: {
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    modalOverlay: {
      backgroundColor: theme.outlinedButtonDarkTheme
    },
    modalTitle: {
      color: theme.carouselTextDarkTheme
    },
    carouselContainerView: {
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    containerStyle: {
      marginTop: actuatedNormalizeVertical(spacing['2xl'])
    },
    contentContainerStyle: {
      marginVertical: spacing.xxxs
    },
    planetTitle: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      marginTop: spacing.xxs
    },
    nPlusFocusImage: {
      width: '100%',
      aspectRatio: 9 / 16
    },
    headeringTextStyles: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.xs
    },
    viewInteractiveButton: {
      width: '94%',
      marginHorizontal: actuatedNormalize(spacing.xs),
      bottom: actuatedNormalizeVertical(spacing.xs)
    },
    seeAllButton: {
      marginTop: spacing.s
    },
    viewInvestigationTextStyles: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      paddingBottom: spacing.xxs,
      marginTop: spacing.l,
      marginBottom: spacing.xs
    },
    headingStyles: {
      color: theme.carouselTextDarkTheme
    },
    subheadingStyles: {
      color: theme.carouselTextDarkTheme
    },
    bottomRowStyles: {},
    listContainerStyle: {
      marginBottom: spacing.s
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs
    },
    bookmarkHeadingTextStyles: {
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s),
      color: theme.newsTextDarkThemePages
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xxs,
      marginHorizontal: spacing.xs,
      marginBottom: spacing.m
    },
    middleIconStyle: {
      right: actuatedNormalize(140)
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxxs)
    },
    webviewAbsoluteContainer: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    scrollContent: {
      flexGrow: 1
    },
    buttonStyle: {
      borderColor: theme.buttonOutlineGrey
    },
    headingTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    investigationsContainer: {
      bottom: actuatedNormalizeVertical(spacing.xs)
    },
    durationText: {
      top: isIos ? actuatedNormalizeVertical(2) : 0
    },
    adBannerContainer: {
      marginBottom: actuatedNormalizeVertical(spacing['4xl'])
    }
  });
