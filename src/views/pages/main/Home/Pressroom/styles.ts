import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { borderWidth, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

const ITEM_WIDTH = SCREEN_WIDTH;
const ITEM_HEIGHT = (SCREEN_WIDTH * 5) / 4;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },

    contentContainer: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },

    searchButton: {
      borderWidth: borderWidth.none
    },

    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerTextStyles: {
      top: 2
    },
    backButtonStyle: {
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    firstItemContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center'
    },
    firstItemImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    bottomGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: ITEM_HEIGHT * 0.6
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.m),
      width: '100%',
      alignItems: 'flex-start'
    },
    bottomInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      width: '100%',
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    publishedDate: {
      color: theme.newsTextDarkThemePages,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    bookmarkButton: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: actuatedNormalizeVertical(220)
    },
    title: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      color: theme.newsTextDarkThemePages
    },
    verticalHeading: {
      marginTop: actuatedNormalizeVertical(0)
    },
    verticalCategoryContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    verticalImageStyle: {
      width: actuatedNormalize(130),
      height: actuatedNormalizeVertical(130)
    },
    verticalSubheading: {
      bottom: actuatedNormalizeVertical(5),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      color: theme.subtitleTextSubtitle
    },
    carouselCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    publishedTextStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      color: theme.labelsTextLabelPlay
    },
    cardBottomBorder: {
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    seeMoreButtonStyle: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginBottom: actuatedNormalizeVertical(spacing.l),
      alignSelf: 'flex-start'
    },
    seeMoreButtonTextStyle: {
      textAlign: 'center'
    },
    seeMoreButtonHitSlop: {
      top: actuatedNormalizeVertical(spacing.s),
      bottom: actuatedNormalizeVertical(spacing.s),
      left: actuatedNormalize(spacing.s),
      right: actuatedNormalize(spacing.s)
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundDefault,
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    remainingItemsContainer: {
      paddingTop: actuatedNormalizeVertical(spacing.m)
    }
  });
