import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    scrollContent: {
      flexGrow: 1
    },
    topBar: {
      flexDirection: 'row',
      height: actuatedNormalizeVertical(60),
      alignItems: 'center',
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      justifyContent: 'space-evenly'
    },
    headerStyle: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'center',
      height: actuatedNormalizeVertical(spacing['3xl'])
    },
    searchBar: {
      height: actuatedNormalizeVertical(spacing['3xl']),
      backgroundColor: theme.mainBackgroundSecondary,
      paddingLeft: actuatedNormalize(spacing.xs),
      paddingVertical: actuatedNormalizeVertical(3),
      borderRadius: actuatedNormalize(radius.m),
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    errorContainer: {
      top: actuatedNormalizeVertical(-50)
    },
    latestNewsTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.m),
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['7xl']),
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    interestedInTitle: {
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.m
    },
    contentContainerStyle: {
      width: '49%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    mostPopularSearchStyle: {
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    popularContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    divider: {
      top: actuatedNormalizeVertical(spacing.l),
      borderBottomWidth: borderWidth.m,
      opacity: 0.5,
      borderColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    resultsContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingTop: actuatedNormalizeVertical(spacing.m)
    },
    resultsHeaderRow: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    resultsTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: actuatedNormalizeVertical(spacing.xxs)
    },
    filterButton: {
      width: actuatedNormalize(40),
      height: actuatedNormalizeVertical(40),
      borderRadius: actuatedNormalize(12),
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.mainBackgroundSecondary
    },
    resultsDivider: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.m,
      borderColor: theme.dividerPrimary
    },
    mostViewedTopicsHeadingText: {
      marginTop: actuatedNormalizeVertical(spacing['4xl']),
      marginHorizontal: actuatedNormalize(spacing.xs),
      lineHeight: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    chipsListContainer: {
      paddingTop: isIos ? 0 : actuatedNormalizeVertical(spacing.m),
      paddingLeft: actuatedNormalize(spacing.xs),
      paddingRight: actuatedNormalize(spacing.xxs),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    getMostViewedchipsContainer: {
      paddingLeft: actuatedNormalize(spacing.xs),
      paddingRight: actuatedNormalize(spacing.xxs)
    },
    chipsHeadingText: {
      marginBottom: 0,
      lineHeight: 0
    },
    filterPopoverContainer: {
      position: 'absolute',
      right: actuatedNormalize(spacing.xs),
      top: actuatedNormalizeVertical(64),
      backgroundColor: theme.mainBackgroundSecondary,
      borderRadius: actuatedNormalize(radius.m),
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline,
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      paddingHorizontal: actuatedNormalize(spacing.ss),
      gap: actuatedNormalize(spacing.m),
      zIndex: 1,
      // Shadow (iOS)
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: actuatedNormalize(8),
      shadowOffset: { width: 0, height: actuatedNormalizeVertical(4) },
      // Shadow (Android)
      elevation: 8
    },
    filterOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: actuatedNormalize(125),
      gap: actuatedNormalize(spacing.xs)
    },
    filterBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 0
    },
    radioOuter: {
      width: actuatedNormalize(16),
      height: actuatedNormalize(16),
      borderRadius: actuatedNormalize(16),
      borderWidth: borderWidth.m,
      borderColor: theme.iconIconographyDisabledState1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioInnerSelected: {
      width: actuatedNormalize(8),
      height: actuatedNormalize(8),
      borderRadius: actuatedNormalize(8),
      backgroundColor: theme.radioButtonIcongraphyActiveState
    },
    microphoneHeader: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      marginTop: isIos ? actuatedNormalizeVertical(spacing['7xl']) : 0
    },
    voiceModalContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      justifyContent: 'space-between'
    },
    voiceHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    voiceContentContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: actuatedNormalizeVertical(spacing['6xl'])
    },
    voiceSubtitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    voiceTitle: {
      lineHeight: actuatedNormalizeVertical(lineHeight['5xl']),
      marginBottom: actuatedNormalizeVertical(spacing['8xl'])
    },
    voiceCenterArtwork: {
      width: actuatedNormalize(220),
      height: actuatedNormalize(220),
      borderRadius: actuatedNormalize(110),
      backgroundColor: theme.gradientBackgroundTertiary,
      opacity: 0.25
    },
    voiceMicContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: actuatedNormalizeVertical(spacing['10xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    voiceMicButton: {
      width: actuatedNormalize(64),
      height: actuatedNormalize(64),
      borderRadius: actuatedNormalize(32),
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center'
    },
    spokenText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      marginTop: actuatedNormalizeVertical(spacing.m),
      textAlign: 'center'
    },
    pulseWrapper: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
    },
    pulseRing: {
      position: 'absolute',
      width: actuatedNormalize(64),
      height: actuatedNormalize(64),
      borderRadius: actuatedNormalize(48),
      borderWidth: borderWidth.m,
      borderColor: theme.tagsTextLive
    },
    rightIcon: {
      top: actuatedNormalizeVertical(spacing.xxs)
    },
    searchOverlayBg: {
      backgroundColor: theme.gradientBlack30Alpha,
      opacity: 0.5
    },
    dimmedScroll: {
      opacity: 0.5
    },
    searchResultContainer: {
      position: 'absolute',
      top: actuatedNormalizeVertical(47),
      width: isIos ? '90.6%' : '90.4%',
      alignSelf: 'center',
      borderBottomEndRadius: actuatedNormalize(radius.m),
      borderBottomLeftRadius: actuatedNormalize(radius.m),
      backgroundColor: theme.mainBackgroundSecondary,
      zIndex: 999,
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    searchResultText: {
      paddingHorizontal: actuatedNormalize(spacing.s),
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs),
      alignItems: 'center'
    },
    searchHistoryText: {
      paddingHorizontal: actuatedNormalize(spacing.m),
      paddingVertical: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs
    },
    searchSuggestionText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.xs,
      width: '92%'
    },
    carouselContainerVideo: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      gap: actuatedNormalizeVertical(spacing.xs),
      flex: 1
    },
    verticalHeading: {
      marginTop: actuatedNormalizeVertical(0),
      lineHeight: undefined
    },
    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    verticalImageStyle: {
      width: actuatedNormalize(100),
      height: actuatedNormalizeVertical(100)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    modalButtonContainer: { paddingTop: 0 },
    titleStyles: {
      width: '80%',
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    titleRowStyles: {
      marginTop: 0,
      alignSelf: 'center',
      width: '75%',
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    subTitleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    skeletonflatList: {
      paddingHorizontal: actuatedNormalize(spacing.xxs)
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    bookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(2)
    },
    authorBookmarkIconContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    liveBlogBookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(4),
      right: actuatedNormalize(12)
    },
    root: {
      flex: 1
    },
    postsContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    postsItem: {
      paddingVertical: actuatedNormalizeVertical(spacing.s)
    },
    postsSubtitleRow: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    postsDivider: {
      borderBottomWidth: borderWidth.m,
      borderColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    liveBlogItemSeparator: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderBottomColor: theme.dividerPrimary
    },
    bookmarkContainer: {
      marginHorizontal: actuatedNormalizeVertical(spacing.xs)
    },
    videosTextColumn: {
      flex: 1,
      rowGap: actuatedNormalizeVertical(spacing.xs),
      justifyContent: 'space-between'
    },
    videosBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    programsItem: {
      marginVertical: actuatedNormalizeVertical(8),
      gap: actuatedNormalizeVertical(spacing.xxs),
      marginHorizontal: actuatedNormalize(4)
    },
    talentsContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      gap: actuatedNormalizeVertical(spacing.xl)
    },
    talentsRow: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    talentsAvatar: {
      borderRadius: actuatedNormalize(30),
      width: actuatedNormalize(52),
      height: actuatedNormalize(52),
      alignSelf: 'center'
    },
    talentsTextCol: {
      flex: 1,
      rowGap: actuatedNormalizeVertical(spacing.xxs)
    },
    emptyStateContainer: {
      flex: 1,
      marginTop: actuatedNormalizeVertical(160),
      alignItems: 'center'
    },
    emptyStateTitle: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      textAlign: 'center'
    },
    emptyStateSubtitle: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      textAlign: 'center'
    },
    liveBlogItemContainer: {
      paddingHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    liveBlogTextContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    liveBlogSubtitleSpacer: {
      height: actuatedNormalizeVertical(spacing.xxs)
    },
    liveBlogDivider: {
      borderBottomWidth: borderWidth.s,
      opacity: 0.4,
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    defaultContainer: {
      padding: actuatedNormalize(spacing.xs)
    },
    defaultItem: {
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    defaultSpacer: {
      height: actuatedNormalizeVertical(spacing.xxs)
    },
    verMasButton: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    seeMoreButtonDisabled: {
      opacity: 0.7
    },
    interestedInContainer: {
      marginVertical: actuatedNormalizeVertical(spacing.l)
    },
    headingStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      color: theme.tagsTextCategory,
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    containerStyle: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    lastCard: {
      borderRightWidth: 0,
      marginRight: 0
    },
    contentStyle: {
      paddingTop: actuatedNormalizeVertical(spacing.xxs)
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    lottieStyle: {
      height: actuatedNormalizeVertical(250),
      width: actuatedNormalize(250)
    },
    spokenTextStyle: {
      maxHeight: actuatedNormalizeVertical(160),
      width: '90%',
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    separator: {
      height: '86%',
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary,
      marginRight: actuatedNormalize(spacing.s)
    },
    loadMoreButton: {
      marginVertical: actuatedNormalizeVertical(30)
    }
  });
