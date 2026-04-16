import React from 'react';
import { View, StyleSheet } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

const AllEpisodesSkeletonLoader: React.FC = () => (
  <View style={styles.container}>
    {[1, 2, 3, 4, 5].map((item) => (
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
    marginLeft: actuatedNormalize(spacing['7xl']),
    borderRadius: radius.xxs
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: actuatedNormalizeVertical(spacing.s),
    marginBottom: actuatedNormalizeVertical(spacing.m)
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
  }
});

export default AllEpisodesSkeletonLoader;
