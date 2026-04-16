import { Dimensions, StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

const { width: screenWidth } = Dimensions.get('window');
export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.mainBackgroundDefault },
    headerContainer: { zIndex: 1000 },
    contentContainer: {
      marginHorizontal: spacing.xs
    },
    heading: {
      lineHeight: lineHeight['4xl'],
      letterSpacing: letterSpacing.xxs,
      marginBottom: spacing.xxx,
      marginTop: spacing.xxxs
    },
    subHeading: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.s,
      marginTop: 0
    },
    timeStampLabel: {
      lineHeight: lineHeight.xs,
      marginTop: spacing.xx
    },
    error: { padding: actuatedNormalize(spacing.s) },
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
    videoContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center'
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    paginationDot: {
      width: actuatedNormalize(6),
      height: actuatedNormalize(6),
      borderRadius: radius.xxs,
      marginHorizontal: actuatedNormalize(3),
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.m
    },
    paginationDotActive: {
      backgroundColor: theme.iconIconographyGenericState
    },
    captionArea: {
      paddingVertical: actuatedNormalizeVertical(spacing.xxs),
      minHeight: actuatedNormalizeVertical(spacing['4xl']),
      justifyContent: 'center'
    },
    captionText: {
      color: theme.labelsTextLabelPlace,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(spacing.xxxs),
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    videoSection: {
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    pipModeContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(100),
      right: actuatedNormalize(5),
      width: actuatedNormalize(279)
    },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    screenWidthStyles: {
      width: screenWidth
    },
    recommendedStoriesTitle: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginTop: spacing.l,
      marginBottom: spacing.xs
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    liveBlogStatusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    liveBlogTextBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxxs)
    },
    liveDot: {
      paddingRight: actuatedNormalize(spacing.xxxs)
    },
    liveBlogStatusText: {
      lineHeight: lineHeight.s,
      marginTop: spacing.xxx
    },
    liveBlogCircle: {
      height: actuatedNormalizeVertical(spacing.xxs),
      width: actuatedNormalizeVertical(spacing.xxs),
      borderRadius: radius.xxs,
      backgroundColor: theme.tagsTextLive
    },
    flexBlock: {
      flex: 1
    },
    notificationContainer: {
      width: actuatedNormalize(spacing['4xl']),
      height: actuatedNormalize(spacing['4xl']),
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: theme.iconIconographyGenericState,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 1
    },
    notificationStickyContainer: {
      position: 'absolute',
      right: actuatedNormalize(spacing.xs),
      top: actuatedNormalizeVertical(isIos ? 64 : 60)
    },
    seeAllLiveNewsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xs,
      marginBottom: spacing.l
    },
    seeAllLiveNewsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    scoreContainer: {
      backgroundColor: theme.semiTransparentWhite
    },
    bluePillContainer: {
      flexDirection: 'row',
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 35,
      backgroundColor: theme.toastAndAlertsTextInfo,
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing.m),
      columnGap: actuatedNormalize(spacing.xs)
    },
    pillText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      letterSpacing: letterSpacing.none
    },
    redPillContainer: {
      flexDirection: 'row',
      position: 'absolute',
      alignSelf: 'center',
      borderRadius: 35,
      backgroundColor: theme.toastAndAlertsTextLiveToast,
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing.m)
    },
    blogStatusContainer: {
      columnGap: actuatedNormalize(spacing.xxs),
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    endOfCoverageText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    entriesContainer: {
      position: 'relative',
      marginTop: actuatedNormalize(spacing.xl)
    },
    entryEmptyContainer: {
      paddingVertical: actuatedNormalizeVertical(isIos ? 1 : 2)
    },
    mediaCarouselContainer: {
      marginHorizontal: actuatedNormalize(isIos ? 0 : 1)
    },
    heroCaptionTextStyle: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      height: actuatedNormalizeVertical(0)
    },
    summaryContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginBottom: 0
    },
    entryFooterContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    seeMoreText: {
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs
    },
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
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
    notificationIconContainer: {
      marginTop: -actuatedNormalizeVertical(spacing['s'])
    },
    caption: {
      minHeight: actuatedNormalizeVertical(38),
      color: theme.labelsTextLabelPlace,
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      bottom: actuatedNormalizeVertical(10)
    },
    extraCaptionMargin: {
      top: actuatedNormalizeVertical(spacing.xxs)
    },
    mediaImageView: {
      marginTop: actuatedNormalize(isIos ? spacing.xxxs : spacing.xxs)
    },
    liveText: {
      top: isIos ? 2 : 0
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundDefault,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerGrey,
      paddingLeft: actuatedNormalize(spacing.xs)
    }
  });
