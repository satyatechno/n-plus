import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, lineHeight, radius, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xs'])
    },
    headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing['l'])
    },
    authorName: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl'])
    },
    designation: {
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      marginTop: actuatedNormalizeVertical(spacing['xxs'])
    },
    authorNameContainer: {
      width: '50%'
    },
    imageContainer: {
      borderRadius: 100,
      width: actuatedNormalizeVertical(148),
      height: actuatedNormalizeVertical(148),
      resizeMode: 'cover'
    },
    describingText: {
      lineHeight: actuatedNormalize(lineHeight['2xl']),
      marginTop: actuatedNormalizeVertical(spacing['l'])
    },
    bookMarkContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing['m']),
      marginTop: actuatedNormalizeVertical(spacing['l'])
    },
    moreFromAuthorText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      borderBottomWidth: borderWidth['m'],
      paddingBottom: actuatedNormalizeVertical(spacing['xxs']),
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      borderBottomColor: theme.sectionTextTitleSpecial
    },
    recommendedLine: {
      borderRadius: radius.m,
      alignSelf: 'flex-start',
      marginBottom: actuatedNormalizeVertical(spacing['xs'])
    },
    recommendedBlock: {
      borderRadius: radius.m,
      alignSelf: 'flex-start',
      marginBottom: actuatedNormalizeVertical(spacing['xs'])
    },
    recommendedRow: {
      width: '98%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    recommendedAudioLine: {
      borderRadius: radius.m
    },
    recommendedBulletDot: {
      borderRadius: radius['xxs']
    },
    recommended: {
      marginTop: actuatedNormalizeVertical(spacing['xs'])
    },
    authorNameSkeleton: {
      borderRadius: radius.m
    },
    nameSpacing: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    authorMeta: {
      borderRadius: radius.m
    },
    profileImage: {
      borderRadius: 100
    },
    bannerContainer: {
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    banner: {
      borderRadius: radius.m
    },
    iconRow: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing.m),
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    icon: {
      borderRadius: radius.m
    },
    headingContainer: {
      marginTop: actuatedNormalizeVertical(spacing['6xl']),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    sectionHeading: {
      borderRadius: radius.m
    },
    recommendationContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderRadius: radius.m,
      overflow: 'hidden'
    },
    modalButtonContainer: { paddingTop: 0 },
    loadMoreContainer: {
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    loadMoreButton: {
      backgroundColor: theme.filledButtonPrimary,
      paddingHorizontal: actuatedNormalize(spacing.xl),
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      borderRadius: radius.m,
      minWidth: actuatedNormalize(120)
    },
    loadMoreButtonDisabled: {
      backgroundColor: theme.filledButtonDisabled,
      opacity: 0.6
    },
    loadMoreText: {
      color: theme.primaryCTATextDefault,
      textAlign: 'center'
    },
    loadMoreTextDisabled: {
      color: theme.primaryCTATextDisabled
    },
    footerContainer: {
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.s)
    },
    loadingText: {
      color: theme.filledButtonPrimary
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    seeAllButton: {
      marginVertical: actuatedNormalizeVertical(spacing.xs),
      alignSelf: 'flex-start'
    },
    seeAllButtonHitSlop: {
      top: actuatedNormalizeVertical(spacing.xs),
      bottom: actuatedNormalizeVertical(spacing.xs),
      left: actuatedNormalize(spacing.xs),
      right: actuatedNormalize(spacing.xs)
    },
    errorScreen: {
      marginTop: actuatedNormalizeVertical(200)
    }
  });
