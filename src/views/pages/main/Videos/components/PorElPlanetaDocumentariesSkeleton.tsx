import React from 'react';
import { FlatList, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Videos/components/styles';

interface SkeletonItem {
  id: number;
}

interface DocumentariesSkeletonProps {
  elementCount: number;
  isShowHeader?: boolean;
}

const PorElPlanetaDocumentariesSkeleton = ({
  elementCount,
  isShowHeader
}: DocumentariesSkeletonProps) => {
  const skeletonData: SkeletonItem[] = Array.from({ length: elementCount }, (_, index) => ({
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
      {isShowHeader && (
        <View style={[styles.recommendedView, styles.alignmentContainer]}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(32)}
            width={'100%'}
            style={styles.recommendedLine}
          />
        </View>
      )}

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

export default PorElPlanetaDocumentariesSkeleton;
