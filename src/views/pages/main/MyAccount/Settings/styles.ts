import { StyleSheet } from 'react-native';

import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs']),
      paddingBottom: actuatedNormalizeVertical(spacing['xl'])
    },
    appearanceContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      borderRadius: radius['m'],
      marginTop: actuatedNormalizeVertical(spacing['m'])
    },
    textContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      marginTop: actuatedNormalizeVertical(spacing['s']),
      borderRadius: radius['m']
    },
    descriptionStyles: {
      marginBottom: undefined,
      bottom: actuatedNormalizeVertical(spacing['s'])
    },
    deleteAccountButton: {
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing['5xl'])
    },
    deleteAccountButtonText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l']),
      color: theme.titleForegroundInteractiveDefault
    },
    toastIconStyle: {
      alignSelf: 'center'
    },
    toastContainerStyles: {
      borderColor: theme.toastAndAlertsTextSuccess
    },
    settingOptionContainer: {
      marginHorizontal: actuatedNormalize(1),
      marginTop: actuatedNormalizeVertical(spacing['xs'])
    },
    divider: {
      borderBottomWidth: borderWidth['m'],
      borderBottomColor: theme.dividerPrimary
    },
    sectionContainer: {
      marginHorizontal: actuatedNormalize(-10)
    },
    subtitleText: {
      top: actuatedNormalizeVertical(spacing['xxxs'])
    },
    headerText: {
      top: actuatedNormalizeVertical(3)
    },
    description: {
      width: '90%'
    }
  });
