import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    searchButton: {
      borderWidth: borderWidth.none
    },
    headerTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: actuatedNormalizeVertical(3)
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    topicChipsTitle: {
      lineHeight: actuatedNormalizeVertical(spacing['6xl']),
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.iconIconographyGenericState
    },
    topicChipsContainerStyle: {
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    mainContainerStyle: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    contentContainerStyle: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    titleStyles: {
      flex: 1,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    imageStyle: {
      borderRadius: actuatedNormalize(30),
      width: actuatedNormalize(52),
      height: actuatedNormalize(52)
    },
    divider: {
      width: '100%',
      height: actuatedNormalizeVertical(isIos ? 1 : 2),
      backgroundColor: theme.dividerPrimary,
      marginVertical: actuatedNormalizeVertical(spacing.s)
    }
  });
