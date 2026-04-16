import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.xxxs,
      gap: spacing.xxs
    },
    playerContainer: {
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault,
      borderTopWidth: borderWidth.s,
      borderTopColor: theme.labelsTextLabelPlace
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    title: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      width: '85%'
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    progressContainer: {
      flex: 1,
      height: actuatedNormalizeVertical(40),
      justifyContent: 'center'
    },
    progressBarWrapper: {
      borderRadius: radius.m,
      overflow: 'hidden',
      marginHorizontal: actuatedNormalize(spacing.xxs),
      justifyContent: 'center',
      backgroundColor: theme.iconIconographyIconBoundaries
    },
    progressBar: {
      height: actuatedNormalizeVertical(5),
      borderRadius: radius.m,
      backgroundColor: theme.iconIconographyGenericState
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '70%'
    },
    playSpeedStyle: {
      width: '5%'
    },
    crossIconStyles: {
      justifyContent: 'center',
      height: actuatedNormalizeVertical(18),
      paddingHorizontal: actuatedNormalize(spacing['xxs'])
    },
    headerIcons: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center'
    },
    playIconStyles: { top: actuatedNormalizeVertical(1), justifyContent: 'center' },
    localTooltipBox: {
      position: 'absolute',
      right: actuatedNormalize(30),
      borderRadius: 5,
      backgroundColor: theme.colorSecondary200,
      paddingHorizontal: actuatedNormalize(spacing.s),
      paddingVertical: actuatedNormalize(spacing.xxs),
      width: actuatedNormalize(288)
    },
    pointer: {
      position: 'absolute',
      width: 0,
      height: 0,
      right: actuatedNormalize(12),
      bottom: actuatedNormalizeVertical(-7),
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.colorSecondary200
    },
    profileImages: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    textStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    profileImage: {
      width: actuatedNormalize(30),
      height: actuatedNormalize(30),
      borderRadius: actuatedNormalize(15),
      marginLeft: -actuatedNormalize(10)
    },
    progressBarText: {
      top: isIos ? actuatedNormalizeVertical(2) : 0
    },
    modalOverlay: {
      flex: 1
    }
  });

export default themeStyles;
