import React from 'react';
import { View, StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

export const LandingPageCarouselSkeleton: React.FC = () => (
  <View style={styles.container}>
    <SkeletonLoader height="100%" width="100%" style={styles.media} />

    <SkeletonLoader height={actuatedNormalizeVertical(24)} width="80%" style={styles.text} />

    <View style={styles.pagination}>
      {[0, 1, 2].map((i) => (
        <SkeletonLoader
          key={i}
          height={actuatedNormalize(8)}
          width={actuatedNormalize(8)}
          style={styles.dot}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    padding: 0
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  text: {
    position: 'absolute',
    bottom: actuatedNormalize(spacing['2xl']),
    left: actuatedNormalize(spacing['2xl']),
    right: actuatedNormalize(spacing['2xl'])
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: actuatedNormalize(8),
    height: actuatedNormalize(8),
    borderRadius: radius.xxs,
    marginHorizontal: actuatedNormalize(3)
  }
});

export default LandingPageCarouselSkeleton;
