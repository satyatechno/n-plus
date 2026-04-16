import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaViewOnboarding: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingTop: actuatedNormalizeVertical(spacing['2xl']),
      paddingBottom: actuatedNormalizeVertical(spacing['s']),
      paddingHorizontal: actuatedNormalize(spacing['xl'])
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingBottom: actuatedNormalizeVertical(spacing['s']),
      paddingHorizontal: actuatedNormalize(spacing['xs'])
    },
    container: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1
    },
    introScreen: {
      flex: 1
    },
    contentContainer: { justifyContent: 'space-between', flex: 1 },
    topicsContainer: {
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      width: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    interestButton: {
      height: actuatedNormalizeVertical(spacing['2xl']),
      paddingHorizontal: actuatedNormalize(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginRight: actuatedNormalize(spacing.xs),
      borderRadius: actuatedNormalizeVertical(32),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: borderWidth.s,
      borderColor: theme.interestButtonBackground
    },
    notSelectedInterestButton: {
      borderColor: theme.chipTextInactive,
      borderWidth: borderWidth.s
    },
    selectedInterestButton: {
      borderColor: theme.chipTextActive,
      backgroundColor: theme.interestButtonBackground
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    viewMorePressable: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs)
    },
    viewMoreText: {
      color: theme.tagsTextCategory,
      top: isIos ? actuatedNormalizeVertical(3) : actuatedNormalizeVertical(0)
    },
    skipButtonStyle: {
      height: actuatedNormalizeVertical(52),
      width: '47%',
      borderWidth: borderWidth.m,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.m
    },
    continueButtonStyle: {
      height: actuatedNormalizeVertical(52)
    },
    continueButtonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    buttonTextStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      top: isIos ? actuatedNormalizeVertical(1.4) : actuatedNormalizeVertical(3.1)
    },
    interestChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxs)
    },
    plusCircle: {
      height: actuatedNormalize(16),
      width: actuatedNormalize(16),
      borderRadius: actuatedNormalizeVertical(20),
      backgroundColor: theme.toastAndAlertsTextBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    addCircle: {
      bottom: actuatedNormalizeVertical(0.5),
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconWrapper: {
      width: actuatedNormalize(18),
      height: actuatedNormalize(18),
      alignItems: 'center',
      justifyContent: 'center'
    },
    toastStyle: {
      alignSelf: 'center'
    },
    headerTextStyles: {
      top: actuatedNormalizeVertical(3)
    },
    arrowUpIcon: {
      top: actuatedNormalizeVertical(6)
    },
    introScreenView: {
      flex: 1
    },
    activityOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.gradientBlack30Alpha
    }
  });
