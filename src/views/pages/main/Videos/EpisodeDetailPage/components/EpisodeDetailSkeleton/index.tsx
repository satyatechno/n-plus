import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import RelatedVideoSkeletonLoader from '@src/views/pages/main/Videos/Programs/components/RelatedVideoSkeletonLoader';
import LiveTVChannelVideoSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelVideoSkeleton';

const EpisodeDetailSkeleton = () => (
  <View style={styles.container}>
    <LiveTVChannelVideoSkeleton />
    <View style={styles.liveTVChannelcontainer}>
      <View style={[styles.title, { width: '80%' }]}>
        <SkeletonLoader height="100%" width="100%" />
      </View>

      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={[styles.textLine, item === 4 && { width: '70%' }]}>
          <SkeletonLoader height="100%" width="100%" />
        </View>
      ))}

      <View style={styles.halfTextLine}>
        <SkeletonLoader height="100%" width="100%" />
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.date}>
          <SkeletonLoader height="100%" width="100%" />
        </View>
        <View style={styles.actionButtons}>
          <View style={styles.button}>
            <SkeletonLoader height="100%" width="100%" />
          </View>
          <View style={styles.button}>
            <SkeletonLoader height="100%" width="100%" />
          </View>
        </View>
      </View>
    </View>
    <RelatedVideoSkeletonLoader arrayList={[1, 2, 3, 4, 5, 6, 7]} showHeading={true} />
  </View>
);

export default EpisodeDetailSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: actuatedNormalizeVertical(spacing.m),
    borderRadius: actuatedNormalize(spacing.xs)
  },
  title: {
    width: '80%',
    height: actuatedNormalizeVertical(32),
    marginVertical: actuatedNormalizeVertical(spacing.m),
    borderRadius: actuatedNormalize(spacing.xxs)
  },
  textLine: {
    width: '100%',
    height: actuatedNormalizeVertical(16),
    marginBottom: actuatedNormalizeVertical(spacing.xs),
    borderRadius: actuatedNormalize(spacing.xxs)
  },
  halfTextLine: {
    width: '50%',
    height: actuatedNormalizeVertical(16),
    marginBottom: actuatedNormalizeVertical(spacing.l),
    borderRadius: actuatedNormalize(spacing.xxs)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: actuatedNormalizeVertical(spacing.l),
    alignItems: 'center'
  },
  date: {
    width: actuatedNormalize(120),
    height: actuatedNormalizeVertical(16),
    borderRadius: actuatedNormalize(spacing.xxs)
  },
  actionButtons: {
    flexDirection: 'row'
  },
  button: {
    width: actuatedNormalize(40),
    height: actuatedNormalize(40),
    borderRadius: actuatedNormalize(20),
    marginLeft: actuatedNormalize(spacing.s)
  },
  sectionTitle: {
    width: actuatedNormalize(150),
    height: actuatedNormalizeVertical(24),
    marginBottom: actuatedNormalizeVertical(spacing.m),
    borderRadius: actuatedNormalize(spacing.xxs)
  },
  relatedVideosContainer: {
    marginBottom: actuatedNormalizeVertical(spacing.l)
  },
  relatedVideo: {
    width: '100%',
    height: actuatedNormalizeVertical(120),
    marginBottom: actuatedNormalizeVertical(spacing.m),
    borderRadius: actuatedNormalize(spacing.xs)
  },
  liveTVChannelcontainer: {
    paddingHorizontal: spacing.xs
  }
});
