import React from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

const SpecialSectionSixSkeleton = () => {
  const renderTitleSkeleton = () => (
    <View style={styles.titleContainer}>
      <SkeletonLoader height={actuatedNormalizeVertical(32)} width="60%" style={styles.title} />
      <SkeletonLoader height={actuatedNormalizeVertical(16)} width="40%" style={styles.subtitle} />
    </View>
  );

  const renderCarouselItem = () => (
    <View style={styles.carouselItem}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(180)}
        width={actuatedNormalize(280)}
        style={styles.carouselImage}
      />
      <View style={styles.carouselContent}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width="40%"
          style={styles.carouselTopic}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(20)}
          width="90%"
          style={styles.carouselTitle}
        />
        <View style={styles.carouselBottom}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(12)}
            width="30%"
            style={styles.carouselDuration}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalizeVertical(16)}
            style={styles.carouselBookmark}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderTitleSkeleton()}

        <FlatList
          data={[1, 2, 3]}
          renderItem={() => renderCarouselItem()}
          keyExtractor={(item) => `carousel-${item}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />

        <View style={styles.seeAllContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width="20%"
            style={styles.seeAllText}
          />
          <SkeletonLoader
            height={actuatedNormalize(16)}
            width={actuatedNormalize(16)}
            style={styles.arrowIcon}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: actuatedNormalizeVertical(spacing['2xl'])
  },
  titleContainer: {
    marginHorizontal: actuatedNormalize(spacing.xs),
    marginTop: actuatedNormalizeVertical(spacing['2xl']),
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  title: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  subtitle: {
    borderRadius: radius.xxs
  },
  carouselContainer: {
    paddingLeft: actuatedNormalize(spacing.xs),
    marginTop: actuatedNormalizeVertical(spacing['2xl'])
  },
  carouselItem: {
    width: actuatedNormalize(280),
    marginRight: actuatedNormalize(spacing.m),
    borderRadius: radius.m,
    overflow: 'hidden'
  },
  carouselImage: {
    borderTopLeftRadius: radius.m,
    borderTopRightRadius: radius.m
  },
  carouselContent: {
    padding: actuatedNormalize(spacing.s)
  },
  carouselTopic: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  carouselTitle: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.s)
  },
  carouselBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  carouselDuration: {
    borderRadius: radius.xxs
  },
  carouselBookmark: {
    borderRadius: radius.m
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(spacing.m),
    marginHorizontal: actuatedNormalize(spacing.xs),
    paddingBottom: actuatedNormalizeVertical(spacing.s)
  },
  seeAllText: {
    borderRadius: radius.xxs,
    marginRight: actuatedNormalize(spacing.xxs)
  },
  arrowIcon: {
    borderRadius: radius.m
  }
});

export default SpecialSectionSixSkeleton;
