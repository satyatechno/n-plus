import React from 'react';
import { View, StyleSheet } from 'react-native';

import { radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import RelatedVideoSkeletonLoader from '@src/views/pages/main/Videos/Programs/components/RelatedVideoSkeletonLoader';

const ProgramasSkeletonLoader: React.FC = () => (
  <View>
    <View style={styles.programHeroImageContainer}>
      <SkeletonLoader height={actuatedNormalizeVertical(492)} width="100%" />
    </View>

    <View style={styles.programDetailContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="70%"
        style={styles.programTitle}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(10)}
        width="40%"
        style={styles.scheduleText}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(60)}
        width="90%"
        style={styles.lastEpisodeButton}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(120)}
        width="100%"
        style={styles.description}
      />

      <View style={styles.bookMarkContainer}>
        <SkeletonLoader height={actuatedNormalizeVertical(24)} width={24} />
        <SkeletonLoader height={actuatedNormalizeVertical(24)} width={24} />
      </View>

      <SkeletonLoader
        height={actuatedNormalizeVertical(6)}
        width="100%"
        style={styles.description}
      />
    </View>

    <RelatedVideoSkeletonLoader arrayList={[1, 2, 3, 4, 5]} />
  </View>
);

const styles = StyleSheet.create({
  programHeroImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.m
  },
  programDetailContainer: {
    paddingHorizontal: spacing.xs
  },
  programTitle: {
    borderRadius: radius.m,
    marginBottom: spacing.s
  },
  scheduleText: {
    borderRadius: radius.m,
    marginBottom: spacing.m
  },
  lastEpisodeButton: {
    borderRadius: radius.m,
    marginBottom: spacing.m,
    alignSelf: 'center'
  },
  description: {
    borderRadius: radius.m,
    marginBottom: spacing.s
  },
  bookMarkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.m,
    marginVertical: spacing.xs
  }
});

export default ProgramasSkeletonLoader;
