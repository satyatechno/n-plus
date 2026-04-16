import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { radius, spacing } from '@src/config/styleConsts';

const NPlusFocusSkeletonLoader = () => {
  const [theme] = useTheme();

  const styles = StyleSheet.create({
    heroImage: {
      width: '100%',
      height: actuatedNormalizeVertical(492),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 8,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    title: {
      width: '70%',
      height: actuatedNormalizeVertical(30),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 4,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    button: {
      width: '60%',
      height: actuatedNormalizeVertical(40),
      backgroundColor: theme.skeletonLoaderBackground,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    description: {
      width: '100%',
      height: actuatedNormalizeVertical(60),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 4,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    icon: {
      width: actuatedNormalize(40),
      height: actuatedNormalize(40),
      backgroundColor: theme.skeletonLoaderBackground,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    sectionTitle: {
      width: '50%',
      height: actuatedNormalizeVertical(24),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 4,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    videoItem: {
      width: actuatedNormalize(200),
      height: actuatedNormalizeVertical(120),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 8,
      marginRight: actuatedNormalize(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    carouselItem: {
      width: '100%',
      height: actuatedNormalizeVertical(200),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: 8,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    bookmarkCard: {
      width: '100%',
      height: actuatedNormalizeVertical(100),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    }
  });

  const renderVideoSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => <View key={index} style={styles.videoItem} />);

  const renderBookmarkSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => <View key={index} style={styles.bookmarkCard} />);

  return (
    <ScrollView>
      <View style={styles.heroImage} />

      <View style={styles.title} />

      <View style={styles.button} />

      <View style={styles.description} />

      <View style={styles.iconRow}>
        <View style={styles.icon} />
        <View style={styles.icon} />
      </View>

      <View style={styles.sectionTitle} />
      <View style={{ flexDirection: 'row', marginBottom: actuatedNormalizeVertical(spacing.l) }}>
        {renderVideoSkeletons(3)}
      </View>

      <View style={styles.sectionTitle} />
      <View style={styles.carouselItem} />

      <View style={[styles.sectionTitle, { marginTop: actuatedNormalizeVertical(spacing.s) }]} />
      <View style={{ flexDirection: 'row', marginBottom: actuatedNormalizeVertical(spacing.l) }}>
        {renderVideoSkeletons(3)}
      </View>

      <View style={styles.sectionTitle} />
      <View style={{ marginBottom: actuatedNormalizeVertical(spacing.l) }}>
        {renderBookmarkSkeletons(3)}
      </View>
    </ScrollView>
  );
};

export default NPlusFocusSkeletonLoader;
