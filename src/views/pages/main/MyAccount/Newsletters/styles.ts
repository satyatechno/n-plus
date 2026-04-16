import { Platform, StyleSheet } from 'react-native';

import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs'])
    },
    headerTextStyles: {
      top: actuatedNormalizeVertical(3)
    },
    toggleContainer: {
      flexDirection: 'row',
      borderWidth: borderWidth['s'],
      borderColor: theme.tabsBackgroundSelceted,
      borderRadius: radius['m'],
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing['m']),
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    toggleButtonLeft: {
      width: '50%',
      height: actuatedNormalizeVertical(40),
      alignItems: 'center',
      borderTopLeftRadius: radius['m'],
      borderBottomLeftRadius: radius['m'],
      justifyContent: 'center'
    },
    toggleButtonRight: {
      width: '50%',
      height: actuatedNormalizeVertical(40),
      alignItems: 'center',
      borderTopRightRadius: radius['m'],
      borderBottomRightRadius: radius['m'],
      justifyContent: 'center'
    },
    subscriptionsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      top: actuatedNormalizeVertical(2)
    },
    contentContainerStyle: {
      marginTop: actuatedNormalizeVertical(spacing['xl']),
      gap: actuatedNormalizeVertical(spacing['xxs'])
    },
    newsletterItemContainer: {
      flexDirection: 'row',
      paddingBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    skeletonLoaderContainer: {
      flexDirection: 'row',
      paddingVertical: actuatedNormalizeVertical(spacing['xxs']),
      marginTop: actuatedNormalizeVertical(spacing['xs'])
    },
    descContainer: {
      width: '64%',
      marginLeft: actuatedNormalize(spacing['xs']),
      marginRight: actuatedNormalize(spacing['xxs'])
    },
    checkBox: {
      alignSelf: 'center'
    },
    desc: {
      marginTop: actuatedNormalizeVertical(spacing['xxs']),
      marginBottom: actuatedNormalizeVertical(spacing['xs']),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    thumbnailImage: {
      height: actuatedNormalizeVertical(88),
      width: actuatedNormalize(88),
      aspectRatio: 1 / 1
    },
    nameTextStyle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['m'])
    },
    buttonTextStyles: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    buttonStyles: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginBottom: actuatedNormalizeVertical(spacing['s'])
    },
    headingStyles: {
      marginTop: actuatedNormalizeVertical(spacing['xxs'])
    },
    unSubscribeButtonStyle: {
      height: actuatedNormalizeVertical(52),
      borderWidth: borderWidth.m,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.m,
      marginTop: actuatedNormalizeVertical(spacing.xxxs)
    },
    unSubscribeEverything: {
      height: actuatedNormalizeVertical(52),
      alignItems: 'center',
      justifyContent: 'center'
    },
    noSubscriptionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    noSubscriptionText: {
      textAlign: 'center'
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end'
    },
    modalContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing['m']),
      borderTopLeftRadius: radius['xl'],
      borderTopRightRadius: radius['xl']
    },
    modalTitle: {
      marginBottom: actuatedNormalizeVertical(spacing['xs']),
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    modalMessage: {
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight['l'])
    },
    modalSubtitle: {
      marginBottom: actuatedNormalizeVertical(spacing['xl']),
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight['l']),
      alignSelf: 'center',
      width: '70%',
      top: actuatedNormalizeVertical(spacing['m'])
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: actuatedNormalizeVertical(spacing['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    cancelButtonStyle: {
      height: actuatedNormalizeVertical(52),
      width: '48%',
      borderWidth: borderWidth['m'],
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius['m']
    },
    confirmButtonStyle: {
      width: '48%'
    },
    buttonTextStyle: {
      top: Platform.OS === 'ios' ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    textBoxContainer: {
      width: '90%',
      height: actuatedNormalizeVertical(89),
      alignSelf: 'center'
    },
    maodalItemContainer: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing['xxxs']),
      gap: actuatedNormalize(spacing['xxs'])
    },
    modalCheckboxText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    checkBoxFlatlist: {
      marginTop: actuatedNormalizeVertical(spacing['s']),
      gap: actuatedNormalizeVertical(spacing['xxs'])
    },
    otherReasonInput: {
      marginTop: actuatedNormalizeVertical(spacing['s']),
      paddingHorizontal: actuatedNormalize(spacing['s']),
      paddingVertical: actuatedNormalizeVertical(spacing['s']),
      borderWidth: borderWidth['m'],
      borderRadius: radius['m'],
      borderColor: theme.dividerGrey,
      height: actuatedNormalizeVertical(135),
      textAlignVertical: 'top',
      color: theme.iconIconographyDisabledState2
    },
    otherReasonCounter: {
      alignSelf: 'flex-end',
      marginTop: actuatedNormalizeVertical(spacing.xxxs)
    },
    toastStyle: {
      alignSelf: 'center'
    },
    toastContainerStyles: {
      borderColor: theme.iconIconographyVerifiedState
    },
    scrollViewStyle: {
      backgroundColor: theme.mainBackgroundSecondary,
      paddingTop: actuatedNormalizeVertical(spacing['4xl']),
      paddingBottom: isIos ? actuatedNormalizeVertical(spacing['s']) : actuatedNormalizeVertical(0),
      borderTopLeftRadius: radius['xl'],
      borderTopRightRadius: radius['xl']
    },
    SkeletonLoaderDesc: {
      marginVertical: actuatedNormalizeVertical(3),
      borderRadius: radius.xxs
    },
    SkeletonLoaderCheckBox: {
      alignSelf: 'center',
      borderRadius: radius.xxs
    },
    toastContainerStyle: {
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(10)
    },
    borderRadius: {
      borderRadius: radius.xxs
    }
  });
