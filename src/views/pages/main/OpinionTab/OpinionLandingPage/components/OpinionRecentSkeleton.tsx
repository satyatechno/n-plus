import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';

type Props = {
  itemWidth: number;
  imageSize: number;
  separatorWidth: number;
  count?: number;
};

const createStyles = (itemWidth: number, imageSize: number, separatorWidth: number) => {
  const circleRadius = imageSize / 2;
  return StyleSheet.create({
    contentContainer: {
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    item: {
      width: actuatedNormalize(itemWidth)
    },
    avatar: {
      borderRadius: actuatedNormalize(circleRadius),
      alignSelf: 'flex-start'
    },
    spacerXs: {
      height: actuatedNormalizeVertical(spacing.xs)
    },
    spacerXxs: {
      height: actuatedNormalizeVertical(spacing.xxs)
    },
    separator: {
      width: actuatedNormalize(separatorWidth),
      marginHorizontal: actuatedNormalize(spacing.l),
      height: '80%'
    }
  });
};

const OpinionRecentSkeleton = ({ itemWidth, imageSize, separatorWidth, count = 5 }: Props) => {
  const items = Array.from({ length: count });
  const styles = createStyles(itemWidth, imageSize, separatorWidth);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {items.map((_, idx) => (
        <View key={idx} style={styles.row}>
          <View style={styles.item}>
            <SkeletonLoader
              width={actuatedNormalize(imageSize)}
              height={actuatedNormalizeVertical(imageSize)}
              style={styles.avatar}
            />
            <View style={styles.spacerXs} />
            <SkeletonLoader width={actuatedNormalize(110)} height={actuatedNormalizeVertical(12)} />
            <View style={styles.spacerXxs} />
            <SkeletonLoader width={actuatedNormalize(174)} height={actuatedNormalizeVertical(12)} />
            <View style={styles.spacerXxs} />
            <SkeletonLoader width={actuatedNormalize(150)} height={actuatedNormalizeVertical(12)} />
          </View>
          {idx < count - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </ScrollView>
  );
};

export default OpinionRecentSkeleton;
