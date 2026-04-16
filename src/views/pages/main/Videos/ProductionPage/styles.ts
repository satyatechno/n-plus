import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    scrollContent: {
      flexGrow: 1
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
      overflow: 'hidden'
    },
    programHeroImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: 4 / 5
    },
    programDetailContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      bottom: actuatedNormalizeVertical(spacing.s)
    },
    programTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
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
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    description: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.s),
      color: theme.carouselTextDarkTheme
    },
    bookMarkContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing.m),
      marginTop: actuatedNormalizeVertical(spacing.l)
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
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxxs)
    },
    videosList: {
      paddingBottom: actuatedNormalizeVertical(spacing.m),
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    videoItemSeparator: {
      height: actuatedNormalizeVertical(spacing.m)
    },
    videosListTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['8xl']),
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.s),
      borderBottomColor: theme.carouselTextDarkTheme,
      marginHorizontal: actuatedNormalize(spacing.xs),
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
    programasSkeletonContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    planetHeading: {
      color: theme.newsTextDarkThemePages,
      borderBottomColor: theme.newsTextDarkThemePages,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    planetTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['4xl']),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    containerStyle: {
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    seeAllButtonStyle: {
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    durationText: {
      top: isIos ? actuatedNormalizeVertical(2) : 0
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    buttonStyle: {
      borderColor: theme.buttonOutlineGrey
    },
    adBannerContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    viewInvestigationTextStyles: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      paddingBottom: actuatedNormalizeVertical(spacing.xxxs),
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    headingStyles: {
      color: theme.carouselTextDarkTheme
    },
    subheadingStyles: {
      color: theme.overlayWhite
    },
    bottomRowStyles: {
      bottom: actuatedNormalizeVertical(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    bookmarkCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      bottom: actuatedNormalizeVertical(spacing.s),
      top: actuatedNormalizeVertical(spacing.xxxxs)
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s),
      color: theme.newsTextDarkThemePages
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    infoCardStyle: { width: SCREEN_WIDTH / 2 - 20 },
    columnStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs)
    }
  });
