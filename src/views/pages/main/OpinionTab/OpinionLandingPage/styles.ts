import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import {
  borderWidth,
  letterSpacing,
  lineHeight,
  spacing,
  fontWeight
} from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerContainer: {
      paddingHorizontal: actuatedNormalize(spacing.s),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      height: actuatedNormalizeVertical(36)
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.xl)
    },
    opinionContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
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
      height: 100,
      top: 0
    },
    verticalSubheading: {
      lineHeight: lineHeight.l,
      color: theme.newsTextTitlePrincipal,
      fontWeight: fontWeight.semiBold,
      marginBottom: spacing.xxxxs,
      marginTop: spacing.xxxxs
    },
    carouselCardContainer: {
      marginHorizontal: spacing.xs
    },
    publishedTextStyle: {
      fontWeight: '400',
      lineHeight: lineHeight.xs,
      color: theme.labelsTextLabelPlay,
      height: 10
    },
    cardBottomBorder: {
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      paddingBottom: spacing.xs,
      marginBottom: spacing.xs
    },
    errorContainer: {
      top: actuatedNormalizeVertical(195)
    },
    scrollContent: {
      flexGrow: 1
    },
    contentContainerStyle: {
      width: actuatedNormalize(190)
    },
    itemSeparator: {
      borderRightWidth: borderWidth.s,
      borderRightColor: theme.dividerPrimary,
      marginHorizontal: spacing.l,
      height: '90%'
    },
    opinionRecentTitle: {
      fontWeight: fontWeight.regular,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['5xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    otherOpinions: {
      fontWeight: fontWeight.regular,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['5xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    imageStyle: {
      borderRadius: 80,
      alignSelf: 'flex-start',
      width: 80,
      height: 80,
      marginBottom: spacing.xs,
      marginTop: spacing.xxxxs
    },
    titleStyles: {
      marginTop: 0,
      marginBottom: spacing.xxxs,
      lineHeight: lineHeight.m
    },
    categoryTextStyles: {
      lineHeight: lineHeight.m,
      color: theme.labelsTextLabelPlay,
      bottom: undefined
    },
    subTitleStyles: {
      lineHeight: lineHeight.m,
      width: actuatedNormalize(174),
      color: theme.sectionTextTitleSpecial
    },
    headerStyle: {
      marginTop: spacing.xxxxs,
      lineHeight: lineHeight.l,
      fontWeight: fontWeight.semiBold
    },
    subHeadingTextStyles: {
      lineHeight: lineHeight.xs
    },
    modalButtonContainer: { paddingTop: 0 },
    toastContainer: {
      width: '92%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    seeMoreText: {
      left: actuatedNormalize(spacing.s),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs
    },
    seeMoreView: {
      paddingVertical: spacing.xs
    },
    bottomRowStyles: {
      bottom: 0,
      marginTop: 0
    },
    bookmarkCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    containerStyle: {
      paddingBottom: actuatedNormalizeVertical(80)
    }
  });
