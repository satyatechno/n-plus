import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, borderWidth, lineHeight, radius } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';
import { AppTheme } from '@src/themes/theme';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
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
    },
    headerContainer: {
      paddingTop: isIos
        ? actuatedNormalizeVertical(spacing.m)
        : actuatedNormalizeVertical(spacing.xl),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    headerStyles: {
      alignItems: 'center',
      height: actuatedNormalizeVertical(24)
    },
    headerTextStyles: {
      alignSelf: 'flex-end',
      marginTop: isIos
        ? actuatedNormalizeVertical(spacing.xxs)
        : actuatedNormalizeVertical(spacing.xxxs)
    },
    headerIconStyles: {
      borderWidth: borderWidth.none
    },
    headerDivider: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      width: '100%'
    },
    loginRegisterButton: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    headingContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    heading: {
      marginBottom: 0,
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    guestHeading: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    subHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      marginBottom: 0
    },
    dividerAfterTwo: {
      backgroundColor: isIos ? theme.dividerPrimary : theme.dividerGrey,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    dividerAfterHeading: {
      borderWidth: borderWidth.s,
      borderColor: theme.dividerGrey,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    optionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    iconWrapper: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: actuatedNormalize(spacing.xs)
    },
    labelWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    label: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      lineHeight: actuatedNormalizeVertical(spacing.l)
    },
    arrowWrapper: {
      marginLeft: 'auto',
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      justifyContent: 'center',
      alignItems: 'center'
    },
    endingDivider: {
      marginTop: -actuatedNormalizeVertical(spacing.xxxs),
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    followUs: {
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(spacing.m)
    },
    socialIconContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    socialRow: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing.l),
      alignItems: 'center'
    },
    iconOnly: {
      marginRight: actuatedNormalize(spacing.xs),
      paddingRight: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalize(spacing.xxxs)
    },
    logoutContainer: {
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    logoutBtn: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    logoutText: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    versionText: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(72)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    secondaryContainer: {
      flex: 1,
      marginLeft: radius.m,
      backgroundColor: theme.mainBackgroundDefault
    }
  });
