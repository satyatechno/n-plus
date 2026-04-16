import { Platform, StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    imageContainerView: {
      height: '100%'
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute'
    },
    continueButtonStyle: {
      width: '85%',
      marginHorizontal: actuatedNormalize(spacing['xl']),
      alignSelf: 'center'
    },
    textContainerView: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    textStyles: {
      lineHeight: actuatedNormalizeVertical(105),
      textTransform: 'uppercase',
      alignSelf: 'center',
      top: actuatedNormalizeVertical(spacing['m']),
      marginTop: actuatedNormalizeVertical(-18)
    },
    continueButtonTextStyle: {
      top:
        Platform.OS === 'ios'
          ? actuatedNormalizeVertical(2) //TODO-> not given in styleConsts,when taking nearby value UI is breaking need to discuss with UI/UX.
          : actuatedNormalizeVertical(1)
    },
    containerView: {
      flex: 1,
      justifyContent: 'space-evenly',
      paddingBottom: actuatedNormalizeVertical(20),
      bottom: actuatedNormalizeVertical(5)
    },
    progressContainer: {
      position: 'absolute',
      top: actuatedNormalizeVertical(spacing[isIos ? '10xl' : '7xl']),
      left: actuatedNormalize(spacing['m']),
      right: actuatedNormalize(spacing['m']),
      height: actuatedNormalizeVertical(6),
      borderRadius: actuatedNormalize(3),
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs),
      zIndex: 999
    },
    progressSegment: {
      flex: 1,
      backgroundColor: theme.gradientBlack20Alpha,
      borderRadius: actuatedNormalize(3),
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primaryCTATextDefault
    }
  });
