import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';

type Props = {
  count?: number;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: actuatedNormalize(spacing.s)
  },
  item: {
    marginBottom: actuatedNormalizeVertical(spacing.m),
    flexDirection: 'row',
    gap: 10
  },
  image: {
    borderRadius: actuatedNormalize(6)
  },
  spacerXs: {
    height: actuatedNormalizeVertical(spacing.xs)
  },
  spacerXxs: {
    height: actuatedNormalizeVertical(spacing.xxs)
  },
  spacerLs: {
    height: actuatedNormalizeVertical(spacing['2xl'])
  }
});

const OpinionOtherSkeleton = ({ count = 6 }: Props) => {
  const items = Array.from({ length: count });
  return (
    <View style={styles.container}>
      {items.map((_, idx) => (
        <View key={idx} style={styles.item}>
          <View>
            <View style={styles.spacerXs} />
            <SkeletonLoader width={actuatedNormalize(120)} height={actuatedNormalizeVertical(12)} />
            <View style={styles.spacerXxs} />
            <SkeletonLoader width={actuatedNormalize(220)} height={actuatedNormalizeVertical(14)} />
            <View style={styles.spacerXxs} />
            <SkeletonLoader width={actuatedNormalize(180)} height={actuatedNormalizeVertical(14)} />
            <View style={styles.spacerLs} />
            <SkeletonLoader width={actuatedNormalize(50)} height={actuatedNormalizeVertical(12)} />
          </View>
          <SkeletonLoader
            width={'35%'}
            height={actuatedNormalizeVertical(130)}
            style={styles.image}
          />
        </View>
      ))}
    </View>
  );
};

export default OpinionOtherSkeleton;
