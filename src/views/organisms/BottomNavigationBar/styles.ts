import { StyleSheet } from 'react-native';

import { borderWidth, radius, spacing } from '@src/config/styleConsts';
import { colors } from '@src/themes/colors';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: actuatedNormalizeVertical(75),
      borderTopWidth: borderWidth.xs,
      borderTopColor: theme.dividerPrimary
    },
    pointerContainer: {
      alignItems: 'flex-end',
      paddingLeft: isIos ? actuatedNormalize(215) : actuatedNormalize(200)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.s),
      paddingVertical: actuatedNormalizeVertical(spacing.xs)
    },
    backButton: {
      padding: actuatedNormalize(spacing.xxs)
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerButton: {
      padding: actuatedNormalize(spacing.xxs),
      marginLeft: actuatedNormalize(spacing.xxs)
    },
    popoverContainer: {
      position: 'absolute',
      bottom: isIos ? actuatedNormalizeVertical(85) : actuatedNormalizeVertical(55),
      right: isIos ? actuatedNormalize(spacing.xs) : actuatedNormalize(spacing.xxs),
      alignItems: 'center',
      zIndex: 1000
    },
    popoverBox: {
      backgroundColor: theme.mainBackgroundSecondary,
      padding: actuatedNormalize(spacing.s),
      borderRadius: radius.xxs,
      borderColor: theme.mainBackgroundSecondary,
      borderWidth: borderWidth.m,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 6
    },
    pointer: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.mainBackgroundSecondary
    },
    modalTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      color: theme.newsTextPictureCarouselTitle
    },
    segmentContainer: {
      flexDirection: 'row',
      overflow: 'hidden'
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: actuatedNormalize(spacing.s)
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: borderWidth.xl,
      borderColor: theme.iconIconographyDisabledState1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.xxs)
    },
    radioCircleSelected: {
      borderColor: theme.iconIconographyPrimary
    },
    radioDot: {
      height: actuatedNormalize(10),
      width: actuatedNormalize(10),
      borderRadius: 5,
      backgroundColor: theme.iconIconographyPrimary
    },
    radioLabel: {
      color: theme.newsTextPictureCarouselTitle,
      top: isIos ? 2 : 0
    },
    radioLabelSelected: {
      color: theme.newsTextPictureCarouselTitle
    }
  });
