import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

const LiveTVProgramListSkeleton = () => {
  const styles = useMemo(() => themeStyles(), []);

  return (
    <View style={styles.container}>
      <SkeletonLoader height={actuatedNormalizeVertical(16)} width={'30%'} style={styles.title} />
      <SkeletonLoader
        height={actuatedNormalizeVertical(94)}
        width={'100%'}
        style={styles.programView}
      />
    </View>
  );
};

export default LiveTVProgramListSkeleton;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    title: {
      borderRadius: radius.xxs
    },
    programView: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(spacing.xs)
    }
  });
