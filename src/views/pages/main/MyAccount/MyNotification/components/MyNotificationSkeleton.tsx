import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';

interface MyNotificationSkeletonProps {
  count: number;
}

const MyNotificationSkeleton = (SkeletonProps: MyNotificationSkeletonProps) => {
  const { count = 1 } = SkeletonProps;
  const styles = useMemo(() => themeStyles(), []);

  return (
    <FlatList
      data={Array(count).fill(1)}
      renderItem={({ index }) => (
        <View key={index} style={styles.container}>
          <View style={styles.subContainer}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(10)}
              width={'40%'}
              style={styles.title}
            />
            {[1, 2, 3].map((_, index) => (
              <SkeletonLoader
                key={index}
                height={actuatedNormalizeVertical(16)}
                width={index == 2 ? '75%' : '100%'}
                style={styles.subTitle}
              />
            ))}
            <SkeletonLoader
              height={actuatedNormalizeVertical(10)}
              width={'50%'}
              style={styles.time}
            />
          </View>
          <SkeletonLoader
            height={actuatedNormalize(120)}
            width={actuatedNormalize(120)}
            style={styles.title}
          />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default MyNotificationSkeleton;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs)
    },
    subContainer: {
      flex: 1
    },
    title: {
      borderRadius: radius.xxs
    },
    subTitle: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    time: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    separator: {
      height: actuatedNormalizeVertical(spacing.xs)
    },
    contentContainer: {
      paddingBottom: actuatedNormalizeVertical(spacing.xs)
    }
  });
