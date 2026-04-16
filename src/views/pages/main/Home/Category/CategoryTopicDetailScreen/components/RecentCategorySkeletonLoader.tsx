import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

const ITEM_WIDTH = SCREEN_WIDTH;
const ITEM_HEIGHT = (SCREEN_WIDTH * 5) / 4;

const RecentCategorySkeletonLoader = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.skeletonContainer}>
      <View>
        <SkeletonLoader height={ITEM_HEIGHT} width={ITEM_WIDTH} style={styles.firstItemImage} />

        <View style={styles.firstItemMetadataContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width="40%"
            style={styles.firstItemMetadata}
          />

          {/* Category Skeleton */}
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width="25%"
            style={styles.firstItemCategory}
          />

          {/* Title Skeleton - Multi-line */}
          <SkeletonLoader
            height={actuatedNormalizeVertical(32)}
            width="95%"
            style={styles.firstItemHeadingContainer}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(32)}
            width="85%"
            style={styles.firstItemHeadingContainerSecondary}
          />

          {/* Subtitle Skeleton */}
          <SkeletonLoader
            height={actuatedNormalizeVertical(18)}
            width="90%"
            style={styles.firstItemHeading}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(18)}
            width="75%"
            style={styles.firstItemHeadingSecondary}
          />

          {/* Bottom Row - Time and Bookmark */}
          <View style={styles.firstItemBottomRow}>
            <View style={styles.firstItemTimeContainer}>
              <SkeletonLoader
                height={actuatedNormalizeVertical(16)}
                width={actuatedNormalize(50)}
                style={styles.firstItemTime}
              />
            </View>
            <SkeletonLoader
              height={actuatedNormalize(24)}
              width={actuatedNormalize(24)}
              style={styles.firstItemBookmarkContainer}
            />
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Regular Articles List */}
      {[1, 2, 3, 4].map((_, index) => (
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

              {/* Thumbnail Image */}
              <SkeletonLoader
                height={actuatedNormalizeVertical(130)}
                width={actuatedNormalize(130)}
                style={styles.verticalImageStyle}
              />
            </View>
          </View>

          {/* Divider between articles */}
          {index < 3 && <View style={styles.divider} />}
        </View>
      ))}

      {/* Related Topics Section */}
      <View style={styles.skeletonTopicsContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(24)}
          width="40%"
          style={styles.skeletonTopicsHeading}
        />

        <View style={styles.skeletonChipsContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <SkeletonLoader
              key={`chip-${index}`}
              height={actuatedNormalizeVertical(32)}
              width={actuatedNormalize(80 + index * 20)}
              style={styles.skeletonChip}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    skeletonContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    firstItemImage: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT
    },
    firstItemMetadata: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    firstItemMetadataContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    firstItemCategory: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    firstItemHeadingContainer: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      letterSpacing: letterSpacing.xxs,
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    firstItemHeadingContainerSecondary: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      letterSpacing: letterSpacing.xxs,
      marginTop: actuatedNormalizeVertical(4)
    },
    firstItemHeading: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.sm
    },
    firstItemHeadingSecondary: {
      marginTop: actuatedNormalizeVertical(4),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      letterSpacing: letterSpacing.sm
    },
    firstItemBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    firstItemTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxxs)
    },
    firstItemTime: {
      top: actuatedNormalizeVertical(2),
      letterSpacing: letterSpacing.none
    },
    firstItemBookmarkContainer: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      justifyContent: 'center',
      alignItems: 'center'
    },
    divider: {
      marginTop: actuatedNormalize(spacing.xxxs),
      marginBottom: actuatedNormalize(spacing.l),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    carouselCardContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    verticalCategoryContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: actuatedNormalize(spacing.xs)
    },
    verticalImageStyle: {
      width: actuatedNormalize(130),
      height: actuatedNormalizeVertical(130)
    },
    skeletonTextContainer: {
      flex: 1,
      paddingRight: actuatedNormalize(spacing.xs)
    },
    skeletonCategoryLabel: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    skeletonTitleLine: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    skeletonTitleLineSecondary: {
      marginTop: actuatedNormalizeVertical(4)
    },
    skeletonBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    skeletonTime: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonBookmark: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    skeletonTopicsContainer: {
      marginTop: actuatedNormalizeVertical(spacing['2xl']),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    skeletonTopicsHeading: {
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    skeletonChipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: actuatedNormalize(spacing.xs)
    },
    skeletonChip: {
      borderRadius: actuatedNormalize(16),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    }
  });

export default RecentCategorySkeletonLoader;
