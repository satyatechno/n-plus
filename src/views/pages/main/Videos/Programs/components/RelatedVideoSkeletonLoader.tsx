import React from 'react';
import { View, StyleSheet } from 'react-native';

import { radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

const RelatedVideoSkeletonLoader = ({
  arrayList,
  showHeading = false
}: {
  showHeading?: boolean;
  arrayList: number[];
}) => (
  <View style={styles.container}>
    {showHeading && (
      <>
        <SkeletonLoader height={actuatedNormalizeVertical(24)} width="40%" style={styles.header} />
        <SkeletonLoader
          height={actuatedNormalizeVertical(5)}
          width={'100%'}
          style={styles.divider}
        />
      </>
    )}
    {arrayList.map((item) => (
      <View key={item} style={styles.itemContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(130)}
          width={actuatedNormalize(130)}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <SkeletonLoader height={actuatedNormalizeVertical(20)} width="80%" style={styles.title} />
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width="40%"
            style={styles.duration}
          />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: actuatedNormalizeVertical(spacing.l),
    marginHorizontal: actuatedNormalize(spacing.xs)
  },
  header: {
    marginTop: actuatedNormalizeVertical(spacing['2xl'])
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: actuatedNormalizeVertical(spacing.s),
    columnGap: actuatedNormalize(spacing.xs)
  },
  image: {
    borderRadius: radius.xxs
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: actuatedNormalize(spacing.s)
  },
  title: {
    marginBottom: actuatedNormalizeVertical(spacing.xs),
    borderRadius: radius.xxs
  },
  duration: {
    borderRadius: radius.xxs
  },
  divider: {
    marginVertical: actuatedNormalizeVertical(spacing.m)
  }
});

export default RelatedVideoSkeletonLoader;
