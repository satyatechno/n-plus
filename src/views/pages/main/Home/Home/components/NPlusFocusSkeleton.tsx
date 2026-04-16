import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';

const NPlusFocusSkeleton = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.programHeroImageContainer}>
        <SkeletonLoader
          width="100%"
          height={actuatedNormalizeVertical(492)}
          style={styles.skeletonImage}
        />
      </View>

      <View style={styles.programDetailContainer}>
        <View style={styles.skeletonButton}>
          <SkeletonLoader width="100%" height={actuatedNormalizeVertical(48)} />
        </View>

        <View style={styles.divider} />

        {/* Section Title Skeleton */}
        <SkeletonLoader
          width="60%"
          height={actuatedNormalizeVertical(24)}
          style={styles.skeletonSectionTitle}
        />

        {/* Carousel Items Skeleton */}
        <View style={styles.carouselContainer}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.carouselItem}>
              <SkeletonLoader
                width={actuatedNormalize(130)}
                height={actuatedNormalizeVertical(130)}
                style={styles.skeletonCarouselImage}
              />
              <SkeletonLoader
                width="80%"
                height={actuatedNormalizeVertical(16)}
                style={styles.skeletonCarouselText}
              />
              <SkeletonLoader
                width="60%"
                height={actuatedNormalizeVertical(14)}
                style={styles.skeletonCarouselText}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: actuatedNormalizeVertical(spacing.m)
    },
    programHeroImageContainer: {
      width: '100%',
      height: actuatedNormalizeVertical(492),
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    programDetailContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.s)
    },
    skeletonImage: {
      position: 'absolute'
    },
    skeletonTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderRadius: 4
    },
    skeletonButton: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonSectionTitle: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderRadius: 4
    },
    divider: {
      marginVertical: actuatedNormalizeVertical(spacing.m),
      backgroundColor: theme.borderColor,
      height: 1
    },
    carouselContainer: {
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    carouselItem: {
      width: actuatedNormalize(130)
    },
    skeletonCarouselImage: {
      borderRadius: 8,
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonCarouselText: {
      borderRadius: 4,
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    }
  });

export default NPlusFocusSkeleton;
