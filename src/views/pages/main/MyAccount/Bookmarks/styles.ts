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
    headerStyles: {
      marginHorizontal: actuatedNormalize(spacing['xs'])
    },
    headerTextStyles: {
      top: actuatedNormalizeVertical(3)
    },
    resultsContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingTop: actuatedNormalizeVertical(spacing.m)
    },
    chipsListContainer: {
      paddingTop: actuatedNormalizeVertical(isIos ? spacing.xxxs : spacing.m),
      paddingLeft: actuatedNormalize(spacing.xs),
      paddingRight: actuatedNormalize(spacing.xxs),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    chipsHeadingText: {
      marginBottom: 0,
      lineHeight: 0
    },
    dimmedScroll: {
      opacity: 0.5
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    modalButtonContainer: { paddingTop: 0 },
    root: { flex: 1 },
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
    videosTextColumn: {
      flex: 1,
      rowGap: actuatedNormalizeVertical(spacing.xs),
      justifyContent: 'space-between'
    },
    videosBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    seeMoreButtonDisabled: { opacity: 0.7 },
    postsContainer: { marginHorizontal: actuatedNormalize(spacing.xs) },
    postsItem: { paddingVertical: actuatedNormalizeVertical(spacing.s) },
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
    bookmarkContainer: { marginHorizontal: actuatedNormalizeVertical(spacing.xs) },
    programsItem: {
      marginVertical: actuatedNormalizeVertical(8),
      gap: actuatedNormalizeVertical(spacing.xxs),
      marginHorizontal: actuatedNormalize(4)
    },
    talentsContainer: {
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
      marginTop: actuatedNormalizeVertical(180),
      alignItems: 'center'
    },
    emptyStateTitle: {
      marginTop: actuatedNormalizeVertical(spacing.l),
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
    liveBlogTextContainer: { marginTop: actuatedNormalizeVertical(spacing.xs) },
    liveBlogSubtitleSpacer: { height: actuatedNormalizeVertical(spacing.xxs) },
    liveBlogDivider: {
      borderBottomWidth: borderWidth.s,
      opacity: 0.4,
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    defaultContainer: { padding: actuatedNormalize(spacing.xs) },
    defaultItem: { marginBottom: actuatedNormalizeVertical(spacing.s) },
    defaultSpacer: { height: actuatedNormalizeVertical(spacing.xxs) },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    columnWrapper: { justifyContent: 'space-between' },
    bookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(3)
    },
    liveBlogBookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(4),
      right: actuatedNormalize(12)
    },
    titleStyles: {
      width: '80%',
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    titleRowStyles: {
      width: '70%',
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    authorBookmarkIconContainerStyle: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: actuatedNormalizeVertical(3)
    },
    subTitleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    contentContainerStyle: {
      width: '49%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    loadMoreButton: {
      marginVertical: actuatedNormalizeVertical(30)
    },
    skeletonflatList: {
      paddingHorizontal: actuatedNormalize(spacing.xxs)
    },
    verMasButton: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    }
  });

export type BookmarksStyles = ReturnType<typeof themeStyles>;
