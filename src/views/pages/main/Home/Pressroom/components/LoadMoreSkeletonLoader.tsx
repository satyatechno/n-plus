import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';

const LoadMoreSkeletonLoader = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {[1, 2].map((_, index) => (
        <View key={`article-${index}`}>
          <View style={styles.carouselCardContainer}>
            <View style={styles.verticalCategoryContainer}>
              {/* Text Content */}
              <View style={styles.skeletonTextContainer}>
                {/* Category Label */}
                <SkeletonLoader
                  height={actuatedNormalizeVertical(14)}
                  width="30%"
                  style={styles.skeletonCategoryLabel}
                />

                {/* Title Lines */}
                <SkeletonLoader
                  height={actuatedNormalizeVertical(18)}
                  width="95%"
                  style={styles.skeletonTitleLine}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(18)}
                  width="85%"
                  style={styles.skeletonTitleLineSecondary}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(18)}
                  width="70%"
                  style={styles.skeletonTitleLineSecondary}
                />

                {/* Time and Bookmark Row */}
                <View style={styles.skeletonBottomRow}>
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(14)}
                    width={actuatedNormalize(40)}
                    style={styles.skeletonTime}
                  />
                  <SkeletonLoader
                    height={actuatedNormalize(20)}
                    width={actuatedNormalize(20)}
                    style={styles.skeletonBookmark}
                  />
                </View>
              </View>

              <SkeletonLoader
                height={actuatedNormalizeVertical(130)}
                width={actuatedNormalize(130)}
                style={styles.verticalImageStyle}
              />
            </View>
          </View>

          {index < 1 && <View style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    carouselCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.l),
      marginVertical: actuatedNormalizeVertical(spacing.xs)
    },
    verticalCategoryContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    skeletonTextContainer: {
      flex: 1,
      paddingRight: actuatedNormalize(spacing.m),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonCategoryLabel: {
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonTitleLine: {
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonTitleLineSecondary: {
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    skeletonTime: {
      borderRadius: radius.xxs
    },
    skeletonBookmark: {
      borderRadius: radius.xxs
    },
    verticalImageStyle: {
      borderRadius: radius.m
    },
    divider: {
      height: actuatedNormalizeVertical(1),
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerPrimary,
      marginHorizontal: actuatedNormalize(spacing.l),
      marginVertical: actuatedNormalizeVertical(spacing.s)
    }
  });

export default LoadMoreSkeletonLoader;
