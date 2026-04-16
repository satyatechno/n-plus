import React, { JSX } from 'react';
import { View, FlatList, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

interface FlatListSkeletonProps {
  styles?: StyleProp<ViewStyle>;
  theme: AppTheme;
  numColumns?: number;
  itemCount?: number;
}

interface SkeletonItem {
  id: number;
}

const FlatListSkeleton: React.FC<FlatListSkeletonProps> = ({ numColumns = 2, itemCount = 6 }) => {
  const skeletonData: SkeletonItem[] = Array.from({ length: itemCount }, (_, index) => ({
    id: index
  }));

  const renderSkeletonItem = (): JSX.Element => (
    <View style={skeletonStyles.cardContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(316)}
        width={actuatedNormalize(178)}
        style={skeletonStyles.imageSkeleton}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="100%"
        style={skeletonStyles.titleSkeleton}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="80%"
        style={skeletonStyles.subtitleSkeleton}
      />
    </View>
  );

  return (
    <FlatList
      data={skeletonData}
      renderItem={renderSkeletonItem}
      numColumns={numColumns}
      keyExtractor={(item: SkeletonItem) => `skeleton-${item.id}`}
      style={skeletonStyles.flatList}
      columnWrapperStyle={numColumns > 1 ? skeletonStyles.columnWrapper : undefined}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const skeletonStyles = StyleSheet.create({
  flatList: {
    paddingHorizontal: actuatedNormalize(spacing.xs)
  },
  columnWrapper: {
    justifyContent: 'space-between'
  },
  cardContainer: {
    width: '48%',
    marginBottom: actuatedNormalizeVertical(spacing.s),
    marginTop: actuatedNormalizeVertical(spacing.s)
  },
  imageSkeleton: {
    borderRadius: radius.m,
    marginBottom: actuatedNormalizeVertical(spacing.s)
  },
  titleSkeleton: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalizeVertical(spacing.xs)
  },
  subtitleSkeleton: {
    borderRadius: radius.xxs
  }
});

export default FlatListSkeleton;
