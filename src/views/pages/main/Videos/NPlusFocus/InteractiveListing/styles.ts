import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: actuatedNormalizeVertical(3),
      letterSpacing: letterSpacing.none
    },
    headerStyle: {
      justifyContent: 'space-between',
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    title: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      marginTop: spacing.s,
      marginBottom: spacing.xs,
      borderBottomColor: theme.dividerSecondary,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs
    },
    interactiveTitle: {
      letterSpacing: letterSpacing.lg,
      lineHeight: lineHeight.l,
      marginTop: spacing.xxs
    },
    itemContainer: {
      marginTop: spacing.xs,
      marginBottom: spacing.xs
    },
    itemImage: {
      width: '100%',
      aspectRatio: 16 / 9
    },
    loadingContainer: {
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      alignItems: 'center'
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center'
    },
    scrollContent: {
      flexGrow: 1
    },
    toastContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(spacing.xl),
      alignSelf: 'center'
    },
    loader: {
      paddingVertical: spacing.xxs
    },
    seeAllText: {
      lineHeight: lineHeight.s
    },
    seeAllButton: {
      marginVertical: spacing.xs
    },
    webViewWrapper: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    }
  });
