import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: actuatedNormalizeVertical(spacing.xs)
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: actuatedNormalizeVertical(3)
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    title: {
      lineHeight: lineHeight['5xl'],
      marginTop: spacing.s,
      marginBottom: spacing.s,
      letterSpacing: letterSpacing.xxxs,
      color: theme.carouselTextDarkTheme,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      paddingBottom: spacing.xxs
    },
    contentContainerStyle: {
      width: '48%',
      marginBottom: spacing.s
    },
    listContentContainer: {},
    titleStyles: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      color: theme.carouselTextDarkTheme
    },
    subTitleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    loader: {
      marginVertical: actuatedNormalizeVertical(spacing.s)
    },
    skeletonWrapper: {
      width: '48%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    skeletonSpacing: {
      marginBottom: actuatedNormalizeVertical(6)
    },
    errorContainer: {
      top: actuatedNormalizeVertical(-50)
    },
    buttonStyle: {
      borderColor: theme.buttonOutlineGrey
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    seeAllButton: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      alignSelf: 'flex-start'
    }
  });
