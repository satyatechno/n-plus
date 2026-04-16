import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    subContainer: {
      flex: 1,
      paddingBottom: actuatedNormalizeVertical(spacing.xs)
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    emptyTextStyles: {
      lineHeight: actuatedNormalize(lineHeight['6xl']),
      textAlign: 'center',
      paddingTop: actuatedNormalizeVertical(spacing.s)
    },
    emptySubTextStyles: {
      lineHeight: actuatedNormalize(lineHeight.l),
      textAlign: 'center'
    },
    emptyIconContainer: {
      width: actuatedNormalize(98),
      height: actuatedNormalize(98),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 70,
      borderWidth: borderWidth.l,
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    headerText: {
      flex: 1,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    itemContainer: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xxs),
      marginVertical: actuatedNormalize(spacing.ss),
      alignItems: 'center'
    },
    detailsContainer: {
      flex: 1,
      paddingBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    readDot: {
      width: 6,
      height: 6,
      borderRadius: 6,
      marginRight: 8,
      backgroundColor: theme.tagsTextLive
    },
    imageContainer: {
      width: actuatedNormalize(120),
      height: actuatedNormalize(120)
    },
    imageSmallContainer: {
      width: actuatedNormalize(88),
      height: actuatedNormalize(88)
    },
    imageBlock: {
      width: '100%',
      height: '100%'
    },
    titleText: {
      flex: 1
    },
    contentText: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    createdAtText: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    checkboxContainer: {
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.xs)
    },
    deleteButton: {
      borderColor: theme.buttonOutlineGrey,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    seeMoreText: {
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs
    },
    toastContainer: {
      backgroundColor: theme.mainBackgroundSecondary
    }
  });
