import React from 'react';
import { View, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import CustomDivider from '@src/views/atoms/CustomDivider';

const OpinionsSectionSkeleton = () => {
  const renderHeroSkeleton = () => (
    <View style={styles.heroContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(492)}
        width="100%"
        style={styles.heroImage}
      />
      <View style={styles.heroTextContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width="30%"
          style={styles.authorName}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(20)}
          width="90%"
          style={styles.heroTitle}
        />
        <View style={styles.bookmarkWrapper}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalizeVertical(16)}
            style={styles.bookmarkIcon}
          />
        </View>
        <SkeletonLoader height={actuatedNormalizeVertical(1)} width="100%" style={styles.divider} />
      </View>
    </View>
  );

  const renderOpinionItem = () => (
    <View style={styles.opinionItem}>
      <SkeletonLoader
        height={actuatedNormalize(80)}
        width={actuatedNormalize(80)}
        style={styles.opinionImage}
      />
      <View style={styles.opinionTextContainer}>
        <SkeletonLoader height={actuatedNormalize(12)} width="70%" style={styles.opinionTitle} />
        <SkeletonLoader height={actuatedNormalize(14)} width="90%" style={styles.opinionSubtitle} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SkeletonLoader height={actuatedNormalize(32)} width="40%" style={styles.sectionTitle} />

      {renderHeroSkeleton()}

      <View style={styles.opinionsList}>
        {[1, 2, 3].map((item) => (
          <React.Fragment key={item}>
            {renderOpinionItem()}
            {item < 3 && <CustomDivider style={styles.itemSeparator} />}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.seeAllContainer}>
        <SkeletonLoader height={actuatedNormalize(16)} width="30%" style={styles.seeAllText} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: actuatedNormalize(spacing.xs)
  },
  sectionTitle: {
    marginBottom: actuatedNormalizeVertical(spacing.s),
    marginLeft: actuatedNormalize(spacing.xs)
  },
  heroContainer: {
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  heroImage: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  heroTextContainer: {
    paddingHorizontal: actuatedNormalize(spacing.xs)
  },
  authorName: {
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  heroTitle: {
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  bookmarkWrapper: {
    alignSelf: 'flex-end',
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  bookmarkIcon: {
    borderRadius: radius.m
  },
  divider: {
    marginTop: actuatedNormalizeVertical(spacing.xs)
  },
  opinionsList: {
    flexDirection: 'row',
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  opinionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: actuatedNormalize(280)
  },
  opinionImage: {
    borderRadius: radius.xxs,
    marginRight: actuatedNormalize(spacing.s)
  },
  opinionTextContainer: {
    flex: 1
  },
  opinionTitle: {
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  opinionSubtitle: {
    borderRadius: 2
  },
  itemSeparator: {
    width: actuatedNormalize(2),
    height: '80%',
    marginHorizontal: actuatedNormalize(spacing.s)
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: actuatedNormalizeVertical(spacing.m),
    paddingRight: actuatedNormalize(spacing.xs)
  },
  seeAllText: {
    borderRadius: 2
  }
});

export default OpinionsSectionSkeleton;
