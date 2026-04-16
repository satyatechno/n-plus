import { StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { lineHeight, radius, spacing } from '@src/config/styleConsts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    contentContainerStyle: {
      width: '48%',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    titleStyles: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
    },
    subTitleStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    relatedHeading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      borderBottomWidth: 1,
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginBottom: actuatedNormalize(spacing.l),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      borderBottomColor: theme.iconIconographyGenericState
    },
    skeletonWrapper: {
      width: '48%',
      marginVertical: actuatedNormalizeVertical(spacing.s),
      marginRight: actuatedNormalize(spacing.xxxs)
    },
    skeletonSpacing: {
      marginBottom: actuatedNormalizeVertical(6)
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
    headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    authorNameContainer: {
      width: '50%'
    },
    modalButtonContainer: { paddingTop: 0 },
    divider: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    errorScreenStyle: { top: actuatedNormalizeVertical(220) },
    columnWrapper: {
      justifyContent: 'space-between'
    }
  });
