import React from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

const SpecialSectionOneSkeleton = () => {
  const renderHeroSkeleton = () => (
    <View style={styles.heroContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(492)}
        width="100%"
        style={styles.heroImage}
      />
      <SkeletonLoader height={actuatedNormalizeVertical(40)} width="90%" style={styles.heroTitle} />
      <View style={styles.heroInfoRow}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width="20%"
          style={styles.heroDuration}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(16)}
          width={actuatedNormalizeVertical(16)}
          style={styles.heroBookmark}
        />
      </View>
    </View>
  );

  const renderBookmarkSkeleton = () => (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkContent}>
        <View style={styles.bookmarkTextGroup}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(12)}
            width="30%"
            style={styles.bookmarkCategory}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(20)}
            width="80%"
            style={styles.bookmarkTitle}
          />
        </View>
        <View style={styles.bookmarkBottom}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(12)}
            width="25%"
            style={styles.bookmarkDuration}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalizeVertical(16)}
            style={styles.bookmarkIcon}
          />
        </View>
      </View>
      <SkeletonLoader
        height={actuatedNormalizeVertical(130)}
        width={actuatedNormalizeVertical(130)}
        style={styles.bookmarkImage}
      />
    </View>
  );

  const renderCarouselSkeleton = () => (
    <View style={styles.carouselCard}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(130)}
        width={actuatedNormalize(130)}
        style={styles.carouselImage}
      />
      <View style={styles.carouselContent}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width="40%"
          style={styles.carouselCategory}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(16)}
          width="90%"
          style={styles.carouselTitle}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width="20%"
          style={styles.carouselDuration}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SkeletonLoader height={actuatedNormalizeVertical(32)} width="60%" style={styles.title} />

        {renderHeroSkeleton()}

        {[1, 2, 3].map((_, index) => (
          <View key={`bookmark-${index}`}>{renderBookmarkSkeleton()}</View>
        ))}

        <FlatList
          data={[1, 2, 3]}
          renderItem={renderCarouselSkeleton}
          keyExtractor={(item) => `carousel-${item}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: actuatedNormalize(spacing.xs)
  },
  title: {
    marginBottom: actuatedNormalizeVertical(spacing.s),
    borderRadius: radius.xxs
  },
  heroContainer: {
    marginVertical: actuatedNormalizeVertical(spacing.s),
    width: '100%',
    height: actuatedNormalizeVertical(492),
    position: 'relative'
  },
  heroImage: {
    borderRadius: radius.m
  },
  heroTitle: {
    position: 'absolute',
    bottom: actuatedNormalizeVertical(40),
    left: actuatedNormalize(12),
    borderRadius: radius.xxs
  },
  heroInfoRow: {
    position: 'absolute',
    bottom: actuatedNormalizeVertical(spacing.xs),
    left: actuatedNormalize(spacing.xs),
    right: actuatedNormalize(spacing.xs),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroDuration: {
    borderRadius: radius.xxs
  },
  heroBookmark: {
    borderRadius: radius.m
  },
  bookmarkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: actuatedNormalizeVertical(spacing.xs),
    paddingVertical: actuatedNormalizeVertical(spacing.s)
  },
  bookmarkContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  bookmarkTextGroup: {
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  bookmarkCategory: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  bookmarkTitle: {
    borderRadius: radius.xxs
  },
  bookmarkBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bookmarkDuration: {
    borderRadius: radius.xxs
  },
  bookmarkIcon: {
    borderRadius: radius.m
  },
  bookmarkImage: {
    borderRadius: radius.m,
    marginLeft: actuatedNormalize(spacing.s)
  },
  carouselContainer: {
    marginTop: actuatedNormalizeVertical(spacing.s),
    paddingLeft: actuatedNormalize(spacing.xs)
  },
  carouselCard: {
    width: actuatedNormalize(320),
    flexDirection: 'row',
    marginRight: actuatedNormalize(spacing.xs),
    paddingVertical: actuatedNormalizeVertical(spacing.xs)
  },
  carouselImage: {
    borderRadius: radius.m,
    marginRight: actuatedNormalize(spacing.xs)
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: actuatedNormalizeVertical(spacing.xs)
  },
  carouselCategory: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  carouselTitle: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  carouselDuration: {
    borderRadius: radius.xxs
  }
});

export default SpecialSectionOneSkeleton;
