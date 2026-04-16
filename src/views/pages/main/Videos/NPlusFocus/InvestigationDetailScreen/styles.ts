import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    headerText: {
      top: actuatedNormalizeVertical(2)
    },
    headerStyle: {
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    title: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.xxs,
      marginHorizontal: spacing.xs,
      marginTop: spacing.xx,
      marginBottom: spacing.xxx
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerButton: {
      padding: actuatedNormalize(spacing.xxxs)
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      marginTop: spacing.s
    },
    summaryContainer: {
      flex: 0.5
    },
    summaryText: {
      marginTop: spacing.xxx,
      color: theme.carouselTextDarkTheme
    },
    date: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      color: theme.carouselTextDarkTheme
    },
    divider: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      bottom: actuatedNormalizeVertical(spacing.xs)
    },
    separator: {
      marginHorizontal: spacing.xs,
      marginVertical: spacing.xs,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    lastEpisodeButton: {
      marginTop: spacing.s,
      width: '94%',
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    toastContainer: {
      width: '90%',
      backgroundColor: theme.mainBackgroundSecondary
    },
    researchBy: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: spacing.xxs,
      marginTop: spacing.xs
    },
    mainContainerStyle: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xl)
    },
    contentContainerStyle: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    titleStyles: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.lg,
      color: theme.carouselTextDarkTheme
    },
    imageStyle: {
      borderRadius: actuatedNormalize(30),
      width: actuatedNormalize(52),
      height: actuatedNormalize(52)
    },
    subTitleStyles: {
      color: theme.carouselTextDarkTheme,
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    crewSubTitleStyles: {
      color: theme.labelsTextLabelName,
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    imageContainerStyle: {
      width: actuatedNormalize(52),
      height: actuatedNormalize(52),
      backgroundColor: theme.toggleIcongraphyDisabledState,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: actuatedNormalize(30)
    },
    image: {
      height: '100%',
      width: '100%',
      borderRadius: actuatedNormalize(30)
    },
    researchContainer: {
      bottom: actuatedNormalizeVertical(10)
    },
    seeAllStyles: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    awardsSectionTitle: {
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      paddingBottom: spacing.xxs,
      marginTop: spacing.xs
    },
    icon: {
      marginRight: actuatedNormalize(10)
    },
    awardsSection: {
      flexDirection: 'row',
      alignItems: 'center',
      top: actuatedNormalizeVertical(spacing.xxxs)
    },
    awardsStyles: {
      color: theme.carouselTextDarkTheme,
      top: actuatedNormalizeVertical(3),
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    awardTitleStyles: {
      flex: 1,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      color: theme.carouselTextDarkTheme
    },
    awardsContainer: {
      flexDirection: 'row',
      gap: 10
    },
    crewContainer: { flexDirection: 'row', gap: 10 },
    pipModeContainerBackground: {
      width: actuatedNormalize(215)
    },
    viewInvestigationTextStyles: {
      color: theme.carouselTextDarkTheme,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['5xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: spacing.xxs,
      marginTop: spacing.xs,
      marginBottom: spacing.s
    },
    headingStyles: {
      color: theme.carouselTextDarkTheme
    },
    subheadingStyles: {
      color: theme.carouselTextDarkTheme
    },
    bottomRowStyles: {},
    listContainerStyle: {
      marginBottom: spacing.s
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s),
      color: theme.newsTextDarkThemePages
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xxs,
      marginHorizontal: spacing.xs,
      marginBottom: spacing.xs
    },
    flatList: {
      paddingHorizontal: spacing.xs
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    flatlistContainerStyle: {
      width: '48%',
      marginBottom: spacing.s
    },
    imageCard: {
      height: actuatedNormalize(316)
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    buttonStyle: {
      borderColor: theme.buttonOutlineGrey
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
    headingTextStyles: {
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs
    },
    lastEpisodeButtonText: {
      top: isIos ? actuatedNormalizeVertical(2) : 0
    },
    recentlyAddedContainer: {}
  });
