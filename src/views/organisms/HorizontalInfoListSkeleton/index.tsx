import React from 'react';
import { FlatList, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

interface Props {
  itemCount?: number;
  imageHeight?: number;
  imageWidth?: number;
  showSeeAll?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: ViewStyle;
  showHeadingSkeleton?: boolean;
}

const HorizontalInfoListSkeleton = ({
  itemCount = 4,
  imageHeight = actuatedNormalizeVertical(277),
  imageWidth = actuatedNormalize(156),
  showSeeAll = true,
  containerStyle,
  imageStyle,
  showHeadingSkeleton = true
}: Props) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    heading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      borderRadius: actuatedNormalize(spacing.xxxs)
    },
    line: {
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderRadius: actuatedNormalize(spacing.xxs)
    },
    itemContainer: {
      width: imageWidth,
      marginRight: actuatedNormalize(spacing.xs)
    },
    image: {
      width: '90%',
      height: imageHeight
    },
    title: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      height: actuatedNormalizeVertical(18),
      width: '85%',
      borderRadius: actuatedNormalize(spacing.xxs)
    },
    subTitle: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      height: actuatedNormalizeVertical(14),
      width: '60%',
      borderRadius: actuatedNormalize(spacing.xxs)
    },
    seeAll: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xl),
      borderRadius: actuatedNormalize(spacing.xxs)
    }
  });

  const skeletonItems = Array.from({ length: itemCount }, (_, i) => ({ id: i.toString() }));

  return (
    <>
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        {showHeadingSkeleton && (
          <>
            <SkeletonLoader
              height={actuatedNormalizeVertical(26)}
              width={'70%'}
              style={styles.heading}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(5)}
              width={'100%'}
              style={styles.line}
            />
          </>
        )}

        <FlatList
          data={skeletonItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={() => (
            <View style={styles.itemContainer}>
              <SkeletonLoader
                height={styles.image.height}
                width={styles.image.width}
                style={StyleSheet.flatten([styles.image, imageStyle])}
              />
              <SkeletonLoader
                height={styles.title.height}
                width={styles.title.width}
                style={styles.title}
              />
              <SkeletonLoader
                height={styles.subTitle.height}
                width={styles.subTitle.width}
                style={styles.subTitle}
              />
            </View>
          )}
        />
      </View>
      {showSeeAll && (
        <SkeletonLoader
          height={actuatedNormalizeVertical(15)}
          width={'90%'}
          style={styles.seeAll}
        />
      )}
    </>
  );
};

export default HorizontalInfoListSkeleton;
