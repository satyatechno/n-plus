import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      justifyContent: 'space-between',
      paddingTop: actuatedNormalizeVertical(spacing['2xl']),
      paddingBottom: actuatedNormalizeVertical(spacing['xs']),
      paddingHorizontal: actuatedNormalize(spacing['2xl'])
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: borderWidth['s'],
      borderBottomColor: theme.borderWidth,
      minHeight: actuatedNormalizeVertical(68),
      alignItems: 'center'
    },
    flatListContentContainer: {
      paddingHorizontal: actuatedNormalize(spacing['m']),
      borderRadius: radius['l'],
      marginVertical: actuatedNormalizeVertical(spacing['m']),
      backgroundColor: theme.mainBackgroundSecondary
    },
    buttonTextStyle: {
      top: isIos
        ? actuatedNormalizeVertical(2) //TODO-> not given in styleConsts,when taking nearby value UI is breaking need to discuss with UI/UX.
        : actuatedNormalizeVertical(1)
    },
    buttonContainer: {
      justifyContent: 'space-between',
      marginBottom: actuatedNormalizeVertical(spacing['m']),
      flexDirection: 'row',
      marginTop: actuatedNormalizeVertical(spacing['3xl'])
    },
    skipButton: {
      width: '47%'
    },
    continueButton: {
      width: '47%'
    },
    containerView: {
      flex: 1
    },
    buttonSkeleton: {
      borderRadius: radius['l']
    },
    errorContainer: { marginTop: actuatedNormalizeVertical(120) }
  });
