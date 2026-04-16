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
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    description: {
      lineHeight: lineHeight.l,
      marginBottom: spacing.s,
      letterSpacing: letterSpacing.xs,
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
      lineHeight: lineHeight['5xl'],
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
    programasSkeletonContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    planetHeading: {
      lineHeight: lineHeight['5xl'],
      color: theme.newsTextDarkThemePages,
      borderBottomColor: theme.newsTextDarkThemePages,
      borderBottomWidth: borderWidth.m,
      marginHorizontal: spacing.xs,
      paddingBottom: spacing.xxs
    },
    planetTitle: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxs,
      letterSpacing: letterSpacing.lg
    },
    containerStyle: {
      marginBottom: spacing.l
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
    }
  });
