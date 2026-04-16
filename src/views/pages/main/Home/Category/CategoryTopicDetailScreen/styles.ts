import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },

    contentContainer: {
      marginTop: spacing.xs,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      marginBottom: 0
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

    listContainer: {
      paddingHorizontal: actuatedNormalize(spacing.s),
      paddingVertical: actuatedNormalizeVertical(spacing.s)
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },

    cardContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },

    cardStyle: {
      width: '100%',
      marginRight: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },

    cardImageStyle: {
      width: actuatedNormalize(120),
      height: actuatedNormalizeVertical(80),
      borderRadius: actuatedNormalize(8)
    },

    separator: {
      backgroundColor: theme.dividerPrimary
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
      width: 100,
      height: 100
    },
    verticalSubheading: {},
    relatedCategoryContainer: {
      flexGrow: 1
    },
    moreCategoryContainer: {
      flexGrow: 1,
      marginTop: spacing.xs
    },
    divider: {
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },

    firstItemContainer: {},
    firstItemImageContainer: {
      width: '100%',
      marginBottom: spacing.xs
    },
    firstItemImage: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: 'auto',
      aspectRatio: 4 / 5,
      marginHorizontal: spacing.xs,
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    landscapeImage: {
      width: '100%',
      height: 'auto',
      aspectRatio: 16 / 9,
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
    firstItemMetadata: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    firstItemMetadataContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    firstItemCategory: {
      lineHeight: lineHeight.s,
      marginBottom: spacing.xxs
    },
    firstItemHeadingContainer: {
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.xxs,
      marginTop: 0
    },
    firstItemHeading: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.sm
    },
    firstItemBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xxxxs
    },
    firstItemTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs
    },
    firstItemTime: {
      top: actuatedNormalizeVertical(2),
      letterSpacing: letterSpacing.none
    },
    firstItemBookmarkContainer: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      justifyContent: 'center',
      alignItems: 'center'
    },
    firstItemExcerpt: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxx
    },
    bookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(2)
    },
    bookmarkIconContainerStyleRight: {
      right: actuatedNormalize(spacing.xs)
    },
    headingChipsstyle: {
      lineHeight: lineHeight['2xl'],
      letterSpacing: letterSpacing.s
    },
    chipsListContainerStyle: {
      paddingStart: actuatedNormalize(spacing.xs)
    },
    moreNewsText: {
      lineHeight: lineHeight['5xl'],
      marginTop: spacing.l,
      marginHorizontal: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      borderBottomColor: theme.sectionTextTitleSpecial
    },
    verMasButton: {
      paddingVertical: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.m),
      borderRadius: actuatedNormalize(8),
      borderWidth: borderWidth.s,
      borderColor: theme.sectionTextTitleSpecial,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    seeAllButton: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    seeAllText: {
      letterSpacing: letterSpacing.xxxs
    },
    seeAllButtonHitSlop: {
      top: actuatedNormalizeVertical(spacing.xxs),
      bottom: actuatedNormalizeVertical(spacing.xxs),
      left: actuatedNormalize(spacing.xxs),
      right: actuatedNormalize(spacing.xxs)
    },
    carouselCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    modalButtonContainer: {
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs)
    },
    liveBlogTextBlock: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    liveBlogHeadingWithoutImage: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    liveBlogContainer: {
      width: '100%'
    },
    bottomTitleContainer: {
      marginHorizontal: -actuatedNormalize(spacing.xs)
    },
    countdownTimerContainer: {
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    headerStyleWithExchangeWidget: {
      borderBottomWidth: 0,
      borderBottomColor: 'transparent',
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    adBannerContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xl)
    }
  });
