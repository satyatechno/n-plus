import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

const LiveTVChannelDetailSkeleton = () => {
  const styles = useMemo(() => themeStyles(), []);

  return (
    <View style={styles.container}>
      <SkeletonLoader height={actuatedNormalizeVertical(9)} width={'15%'} style={styles.radiusM} />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'100%'}
        style={styles.radiusM}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(32)}
        width={'100%'}
        style={styles.radiusM}
      />
      <SkeletonLoader
        height={actuatedNormalize(26)}
        width={actuatedNormalize(26)}
        style={styles.radiusM}
      />
    </View>
  );
};

export default LiveTVChannelDetailSkeleton;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xs),
      rowGap: actuatedNormalizeVertical(spacing.xs)
    },
    radiusM: {
      borderRadius: radius.m
    }
  });
