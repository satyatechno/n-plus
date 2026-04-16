import { StyleSheet } from 'react-native';

import { radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = () =>
  StyleSheet.create({
    detailContainer: {
      marginVertical: actuatedNormalizeVertical(spacing.xxs)
    },
    alignmentContainer: {
      paddingHorizontal: actuatedNormalizeVertical(spacing.xs)
    },
    titleView: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      rowGap: actuatedNormalizeVertical(spacing.xs)
    },
    subTitleView: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      rowGap: actuatedNormalizeVertical(spacing.xs)
    },
    publishedAtContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: actuatedNormalizeVertical(spacing.m),
      columnGap: actuatedNormalizeVertical(spacing.xs)
    },
    publishedAtSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalizeVertical(spacing.xs)
    },
    recommendedView: {
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    recommendedLine: {
      borderRadius: radius.m,
      alignSelf: 'flex-start'
    },
    flatList: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    columnWrapper: {
      justifyContent: 'space-between'
    },
    cardContainer: {
      width: '48%',
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    imageSkeleton: {
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    titleSkeleton: {
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    subtitleSkeleton: {
      borderRadius: radius.xxs
    }
  });
