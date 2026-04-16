import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: spacing.xs
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: actuatedNormalizeVertical(3)
    },
    backButtonStyle: {
      borderColor: theme.outlinedButtonDarkTheme
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
    titleStyles: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      color: theme.carouselTextDarkTheme
    },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    seeMoreButton: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      alignSelf: 'flex-start'
    },
    seeMoreText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    separator: {
      marginTop: actuatedNormalizeVertical(spacing.l)
    }
  });
