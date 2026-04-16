import { StyleSheet } from 'react-native';

import { letterSpacing, spacing, radius, lineHeight } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { borderWidth } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    header: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    liveHeader: {
      letterSpacing: letterSpacing.sm,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    middleIconStyle: {
      flex: 1,
      alignItems: 'center'
    },
    headerMiddleView: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxxs)
    },
    additionalButton: {
      borderWidth: borderWidth.none
    },
    subContainer: {
      flex: 1,
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    channelListView: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xxxs),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    channelItem: {
      flex: 1,
      height: actuatedNormalizeVertical(38),
      borderRadius: radius.xxs,
      alignItems: 'center',
      justifyContent: 'center'
    },
    channelItemDark: {
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    channelLogo: {
      alignItems: 'center'
    },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    blankView: {
      backgroundColor: theme.filledButtonAction,
      aspectRatio: 16 / 9,
      width: '100%',
      zIndex: 99,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textStyles: {
      color: theme.labelsTextLabelTime
    },
    pipModeContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(130),
      right: actuatedNormalize(5),
      width: actuatedNormalize(279)
    },
    pipModeBackground: {
      top: 0,
      left: 0,
      position: 'absolute'
    },
    videoContainer: {
      paddingVertical: spacing.xxs,
      backgroundColor: theme.mainBackgroundDefault
    },
    chanelDataContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: spacing.xs
    },
    chanelDataContainerIos: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: spacing.xs,
      marginBottom: spacing.xs
    },
    channelName: {
      letterSpacing: letterSpacing.xs,
      lineHeight: lineHeight.s,
      marginBottom: spacing.xxxxs
    },
    programContainer: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    programTitle: {
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.xl,
      marginBottom: spacing.xxxxs,
      includeFontPadding: false,
      paddingTop: spacing.xxxs
    },
    programDescription: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.s
    },
    shareButton: {
      marginTop: spacing.xxxxs
    },
    programsView: {},
    programsText: {
      paddingTop: spacing.xxxs,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      letterSpacing: letterSpacing.s
    },
    programBottomDivider: {
      borderTopWidth: borderWidth.ss,
      borderTopColor: theme.dividerPrimary,
      marginTop: spacing.xs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    programBottomDividerIos: {
      borderWidth: borderWidth.ss,
      borderColor: 'transparent',
      borderTopColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    programDivider: {
      borderTopWidth: borderWidth.ss,
      borderTopColor: theme.dividerPrimary,
      marginVertical: spacing.xxs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    programDividerIos: {
      borderWidth: borderWidth.ss,
      borderColor: 'transparent',
      borderTopColor: theme.dividerPrimary,
      marginVertical: spacing.xxs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    transmissionView: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxxs),
      marginBottom: spacing.xxx
    },
    programTimeSlot: {
      letterSpacing: letterSpacing.none
    },
    programName: {
      marginBottom: spacing.xxx,
      top: 2
    },
    programItemDescription: {
      marginTop: actuatedNormalizeVertical(spacing.xxxs)
    },
    programVerticalDivider: {
      borderLeftWidth: borderWidth.ss,
      borderLeftColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    programVerticalDividerIos: {
      borderWidth: borderWidth.ss,
      borderColor: 'transparent',
      borderLeftColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    activeTitle: {
      lineHeight: lineHeight['5xl'],
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.xs,
      marginTop: spacing.l,
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    blogMediaContainerStyle: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: 'auto',
      aspectRatio: 16 / 9,
      marginHorizontal: spacing.xs,
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    divider: {
      borderTopWidth: borderWidth.ss,
      borderColor: theme.dividerPrimary,
      marginVertical: spacing.xs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    inactiveDivider: {
      borderTopWidth: borderWidth.ss,
      borderColor: theme.dividerPrimary,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    inactiveTitle: {
      lineHeight: lineHeight['5xl'],
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      marginBottom: spacing.xs,
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.l
    },
    inactiveBlogTitle: {
      lineHeight: lineHeight['3xl'],
      marginTop: spacing.xxxxs
    },
    inactiveBlogContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    seeAllLiveNewsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: spacing.xs
    },
    seeAllInactiveBlogsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    seeAllLiveNewsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    liveDot: {
      marginTop: spacing.xxxxs
    },
    fullScreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '110%',
      backgroundColor: theme.mainBackgroundDefault,
      zIndex: 1000
    },
    scrollViewContainer: {
      paddingBottom: actuatedNormalizeVertical(spacing.xl)
    },
    liveText: {
      flex: 1,
      letterSpacing: letterSpacing.sm
    },
    adBannerContainer: {
      marginTop: spacing.xs
    }
  });

export default themeStyles;
