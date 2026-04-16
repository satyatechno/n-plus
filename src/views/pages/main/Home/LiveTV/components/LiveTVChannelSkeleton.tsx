import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

const LiveTVChannelSkeleton = () => {
  const styles = useMemo(() => themeStyles(), []);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((_, index) => (
        <SkeletonLoader
          key={index}
          height={actuatedNormalizeVertical(42)}
          width={actuatedNormalize(80)}
          style={styles.channelItem}
        />
      ))}
    </View>
  );
};

export default LiveTVChannelSkeleton;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: actuatedNormalize(spacing.xs),
      columnGap: actuatedNormalize(spacing.xxxs)
    },
    channelItem: {
      flex: 1,
      borderRadius: radius.xxs
    }
  });
