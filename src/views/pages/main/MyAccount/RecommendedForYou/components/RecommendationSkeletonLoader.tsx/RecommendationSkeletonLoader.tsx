import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import CustomDivider from '@src/views/atoms/CustomDivider';
import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const SkeletonCard = () => (
  <View style={styles.recommendedContainer}>
    <SkeletonLoader height={actuatedNormalizeVertical(207)} width="100%" style={styles.rounded} />
    <View style={styles.mt8}>
      <SkeletonLoader height={actuatedNormalizeVertical(20)} width="70%" style={styles.rounded} />
    </View>
  </View>
);

const VerticalVideoItem = () => (
  <>
    <View style={styles.verticalVideoContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(130)}
        width={actuatedNormalize(130)}
        style={styles.rounded}
      />
      <View style={styles.flex1}>
        <View style={styles.ml8}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(18)}
            width="85%"
            style={styles.textLine}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(18)}
            width="75%"
            style={styles.textLine}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(14)}
            width="35%"
            style={styles.rounded}
          />
        </View>
      </View>
    </View>
    <CustomDivider style={styles.verticalVideoItemSeparator} />
  </>
);

const RecommendedSkeleton = () => (
  <>
    <SkeletonCard />

    <View style={styles.recommendedContainer}>
      <FlatList
        data={[1, 2, 3]}
        keyExtractor={(i) => `sk-${i}`}
        scrollEnabled={false}
        renderItem={() => <VerticalVideoItem />}
      />

      {/* Repeated cards (4 total) */}
      {[...Array(4)].map((_, index) => (
        <SkeletonCard key={`card-${index}`} />
      ))}
    </View>
  </>
);

export default RecommendedSkeleton;

const styles = StyleSheet.create({
  recommendedContainer: {
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  verticalVideoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: actuatedNormalizeVertical(12)
  },
  verticalVideoItemSeparator: {
    marginVertical: actuatedNormalizeVertical(12)
  },
  rounded: {
    borderRadius: radius.xxs
  },
  mt8: {
    marginTop: actuatedNormalizeVertical(8)
  },
  ml8: {
    marginLeft: actuatedNormalize(8)
  },
  textLine: {
    marginBottom: actuatedNormalizeVertical(6),
    borderRadius: radius.xxs
  },
  flex1: {
    flex: 1
  }
});
