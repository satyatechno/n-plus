import { StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    header: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.ss,
      borderBottomColor: theme.dividerPrimary
    },
    headerIos: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderWidth: borderWidth.xs,
      borderColor: 'transparent',
      borderBottomColor: theme.dividerPrimary
    },
    headerText: {
      flex: 1,
      textAlign: 'center',
      top: actuatedNormalizeVertical(2),
      lineHeight: lineHeight['2xl'],
      letterSpacing: letterSpacing.xs
    },
    additionalButton: {
      borderWidth: borderWidth.none
    },
    listingContainer: {
      flex: 1
    },
    divider: {
      borderTopWidth: borderWidth.ss,
      borderColor: theme.dividerPrimary,
      marginVertical: actuatedNormalizeVertical(spacing.l)
    },
    inactiveTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    inactiveBlogContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    seeAllLiveNewsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    seeAllLiveNewsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    error: { padding: actuatedNormalize(spacing.s) },
    inactiveDivider: {
      borderTopWidth: borderWidth.ss,
      borderColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(10),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    liveBlogTextBlock: {
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    liveBlogTextBlockWithImage: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    }
  });
