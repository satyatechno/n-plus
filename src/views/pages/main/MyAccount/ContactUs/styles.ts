import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fullContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerWrapper: {
      marginLeft: actuatedNormalize(spacing['xs'])
    },
    headerText: {
      marginTop: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(spacing['xxxs'])
    },
    contentWrapper: {
      flex: 1,
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(88)
    },
    contentCard: {
      paddingHorizontal: actuatedNormalize(spacing['m']),
      backgroundColor: theme.mainBackgroundSecondary,
      borderRadius: actuatedNormalize(radius['l']),
      borderWidth: isIos ? borderWidth['m'] : borderWidth['xl'],
      borderColor: theme.outlinedButtonSecondaryOutline,
      marginHorizontal: actuatedNormalize(spacing['xs']),
      alignItems: 'center'
    },
    primaryHeadingWrapper: {
      marginHorizontal: actuatedNormalize(spacing['m'])
    },
    primaryHeading: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing['xl'])
    },
    primarySubheading: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing['xs']),
      fontSize: fontSize['s']
    },
    iconWrapper: {
      marginTop: actuatedNormalizeVertical(spacing['xl'])
    },
    divider: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      borderBottomColor: theme.dividerGrey,
      borderBottomWidth: borderWidth.m
    },
    secondaryHeading: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing['xs']),
      color: theme.labelsTextLabelName,
      fontSize: fontSize['xs']
    },
    secondarySubheading: {
      textAlign: 'center',
      marginTop: actuatedNormalizeVertical(spacing['xxs']),
      marginBottom: actuatedNormalizeVertical(spacing['xl']),
      fontSize: fontSize['xs'],
      color: theme.titleForegroundInteractiveDefault
    },
    contactUsButton: {
      marginTop: actuatedNormalizeVertical(spacing['l']),
      marginBottom: actuatedNormalizeVertical(spacing['xl']),
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    }
  });
