import React from 'react';
import { FlatList, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Videos/components/styles';

interface SkeletonItem {
  id: number;
}

const PorElPlanetaDetailPageSkeleton = () => {
  const skeletonData: SkeletonItem[] = Array.from({ length: 4 }, (_, index) => ({
    id: index
  }));
  const numColumns = 2;
  const styles = themeStyles();

  const renderSkeletonItem = () => (
    <View style={styles.cardContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(316)}
        width={'100%'}
        style={styles.imageSkeleton}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="100%"
        style={styles.titleSkeleton}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="80%"
        style={styles.subtitleSkeleton}
      />
    </View>
  );

  return (
    <View style={styles.detailContainer}>
      <SkeletonLoader height={actuatedNormalizeVertical(200)} width={'100%'} />
      <View style={[styles.titleView, styles.alignmentContainer]}>
        {[1, 2, 3].map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(22)}
            width={index === 2 ? '40%' : '100%'}
          />
        ))}
      </View>
      <View style={[styles.subTitleView, styles.alignmentContainer]}>
        {[1, 2, 3, 4].map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(12)}
            width={index === 3 ? '70%' : '100%'}
          />
        ))}
      </View>
      <View style={[styles.publishedAtContainer, styles.alignmentContainer]}>
        <SkeletonLoader height={actuatedNormalizeVertical(8)} width={'30%'} />
        <View style={styles.publishedAtSubContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalizeVertical(16)}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalizeVertical(16)}
          />
        </View>
      </View>
      <View style={[styles.recommendedView, styles.alignmentContainer]}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(32)}
          width={'100%'}
          style={styles.recommendedLine}
        />
      </View>

      <FlatList
        data={skeletonData}
        renderItem={renderSkeletonItem}
        numColumns={numColumns}
        keyExtractor={(item: SkeletonItem) => `skeleton-${item.id}`}
        style={styles.flatList}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PorElPlanetaDetailPageSkeleton;
