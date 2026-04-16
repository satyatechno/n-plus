import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { radius, spacing } from '@src/config/styleConsts';

const ProductionSkeletonLoader = () => {
  const [theme] = useTheme();

  const styles = StyleSheet.create({
    heroImage: {
      width: '100%',
      height: actuatedNormalizeVertical(492),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(16)
    },
    title: {
      width: '70%',
      height: actuatedNormalizeVertical(30),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    button: {
      width: '94%',
      height: actuatedNormalizeVertical(50),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    description: {
      width: '94%',
      height: actuatedNormalizeVertical(120),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    icon: {
      width: actuatedNormalize(40),
      height: actuatedNormalize(40),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs
    },
    sectionTitle: {
      width: '50%',
      height: actuatedNormalizeVertical(24),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    videoItem: {
      width: actuatedNormalize(200),
      height: actuatedNormalizeVertical(120),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginRight: actuatedNormalize(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs)
    }
  });

  const renderVideoSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => <View key={index} style={styles.videoItem} />);

  return (
    <ScrollView>
      {/* Hero Image Skeleton */}
      <View style={styles.heroImage} />

      {/* Title Skeleton */}
      <View style={styles.title} />

      {/* Button Skeleton */}
      <View style={styles.button} />

      {/* Description Skeleton */}
      <View style={styles.description} />

      {/* Icons Row Skeleton */}
      <View style={styles.iconRow}>
        <View style={styles.icon} />
        <View style={styles.icon} />
      </View>

      {/* Continue Watching Section Skeleton */}
      <View style={styles.sectionTitle} />
      <View style={{ flexDirection: 'row', marginBottom: actuatedNormalizeVertical(24) }}>
        {renderVideoSkeletons(3)}
      </View>
    </ScrollView>
  );
};

export default ProductionSkeletonLoader;
