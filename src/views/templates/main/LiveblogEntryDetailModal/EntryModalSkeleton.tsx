import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const EntryModalSkeleton = () => {
  const styles = useMemo(() => themeStyles(), []);

  return (
    <View style={styles.container}>
      <SkeletonLoader height={actuatedNormalizeVertical(12)} width={'50%'} style={styles.radiusM} />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'100%'}
        style={styles.normalText}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'100%'}
        style={styles.normalText}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'30%'}
        style={styles.normalText}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(150)}
        width={'100%'}
        style={styles.normalText}
      />
      <SkeletonLoader height={actuatedNormalizeVertical(10)} width={'80%'} style={styles.subText} />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'100%'}
        style={styles.normalText}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={'30%'}
        style={styles.normalText}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(55)}
        width={'100%'}
        style={styles.normalText}
      />
    </View>
  );
};

export default EntryModalSkeleton;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xs)
    },
    radiusM: {
      borderRadius: radius.m
    },
    normalText: {
      borderRadius: radius.m,
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    subText: {
      borderRadius: radius.m,
      marginTop: actuatedNormalizeVertical(spacing.xxxs)
    }
  });
