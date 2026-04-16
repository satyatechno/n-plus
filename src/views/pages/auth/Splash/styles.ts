import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';

/** Height of the buttons footer: button height (52) + spacing.l + bottom safe inset (19) */
const BOTTOM_SPACER_HEIGHT = 52 + spacing['l'] + 19;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: actuatedNormalize(spacing['m']),
      paddingVertical: actuatedNormalizeVertical(spacing['6xl']),
      backgroundColor: theme.mainBackgroundDefault
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    loginButtonStyle: {
      width: '47%'
    },
    registerButtonStyle: {
      width: '47%'
    },
    text: {
      color: theme.labelsTextLabelPlace,
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    subHeadingText: {
      color: theme.labelsTextLabelPlace,
      lineHeight: actuatedNormalizeVertical(lineHeight['4xl']),
      letterSpacing: actuatedNormalizeVertical(letterSpacing['xs']),
      top: actuatedNormalizeVertical(spacing['xxs'])
    },
    textWrapper: {
      top: actuatedNormalizeVertical(spacing['xxs'])
    },
    animationWrapper: {
      width: '100%',
      height: actuatedNormalizeVertical(125),
      marginBottom: actuatedNormalizeVertical(spacing['3xl'])
    },
    logoAnimation: {
      width: '100%',
      height: actuatedNormalizeVertical(125)
    },
    guestUserText: {
      color: theme.titleForegroundInteractiveDefault,
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    guestUserButton: {
      marginTop: actuatedNormalizeVertical(spacing['l']),
      alignSelf: 'center'
    },
    logo: {
      marginTop: actuatedNormalizeVertical(spacing['m'])
    },
    bottomSpacer: {
      height: actuatedNormalizeVertical(BOTTOM_SPACER_HEIGHT),
      width: '100%'
    }
  });
