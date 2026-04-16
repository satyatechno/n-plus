import { StyleSheet } from 'react-native';

import { fonts } from '@src/config/fonts';
import {
  borderWidth,
  fontSize,
  letterSpacing,
  lineHeight,
  radius,
  spacing
} from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerWrapper: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    headerContent: {
      alignItems: 'center'
    },
    headerTextStyles: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs)
    },
    accountInfoWrapper: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    accountHeading: {
      marginBottom: actuatedNormalizeVertical(spacing.xxxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    accountSubHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    descriptionWrapper: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    descriptionText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      color: theme.bodyTextOther,
      fontSize: fontSize.xs
    },
    divider: {
      borderColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    primaryDivider: {
      borderColor: theme.dividerPrimary
    },
    reasonLabel: {
      letterSpacing: letterSpacing.xs,
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    reasonListWrapper: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    otherReasonWrapperContainer: {
      height: actuatedNormalizeVertical(180),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    otherReasonWrapper: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      position: 'relative'
    },
    otherReasonInput: {
      height: actuatedNormalizeVertical(150),
      borderWidth: borderWidth.m,
      borderColor: theme.dividerGrey,
      borderRadius: radius.m,
      padding: actuatedNormalize(spacing.s),
      fontSize: fontSize.s,
      fontFamily: fonts.franklinGothicURW,
      backgroundColor: theme.inputOutlineInteractiveDefault,
      color: theme.bodyTextMain
    },
    otherReasonCharCount: {
      position: 'absolute',
      alignSelf: 'flex-end',
      bottom: actuatedNormalizeVertical(-2),
      right: actuatedNormalize(spacing.xs),
      fontSize: fontSize['xxs'],
      color: theme.dividerPrimary,
      fontFamily: fonts.franklinGothicURW,
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    confirmationWrapper: {
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    deleteButtonWrapper: {
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    deleteButtonText: {
      textAlign: 'center'
    },
    secondaryDivider: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderColor: theme.dividerPrimary
    }
  });
