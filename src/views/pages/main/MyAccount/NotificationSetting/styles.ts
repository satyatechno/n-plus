import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs']),
      paddingBottom: actuatedNormalizeVertical(spacing['xxxs'])
    },
    flatListContentContainer: {
      borderRadius: radius['l'],
      marginVertical: actuatedNormalizeVertical(spacing['m']),
      backgroundColor: theme.mainBackgroundSecondary
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: borderWidth['s'],
      borderBottomColor: theme.borderWidth,
      paddingVertical: actuatedNormalizeVertical(spacing['m']),
      marginHorizontal: actuatedNormalize(spacing['m'])
    },
    itemText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l']),
      top: actuatedNormalizeVertical(5),
      width: '85%'
    },
    sectionTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      width: '90%'
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: borderWidth['m'],
      borderBottomColor: theme.borderWidth,
      paddingVertical: actuatedNormalizeVertical(spacing['m']),
      width: '100%',
      paddingHorizontal: actuatedNormalize(spacing['m'])
    },
    viewAllTitle: {
      paddingVertical: actuatedNormalizeVertical(spacing['m']),
      paddingHorizontal: actuatedNormalize(spacing['m']),
      lineHeight: actuatedNormalizeVertical(lineHeight['s'])
    },
    viewAllContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.overlayGray,
      borderBottomRightRadius: radius['l'],
      borderBottomLeftRadius: radius['l']
    },
    scrollContent: {
      flexGrow: 1
    },
    flexContent: {
      flex: 1
    },
    contentContainer: {
      flex: 1
    },
    headerText: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    switchView: {
      borderRadius: radius['l']
    },
    lastItemContainer: {
      borderBottomWidth: 0
    }
  });
