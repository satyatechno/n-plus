import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';

const MoreFromCategorySkeletonLoader = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.skeletonMoreFromContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(28)}
        width="50%"
        style={styles.moreNewsText}
      />

      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={`more-article-${index}`}>
          <View style={styles.carouselCardContainer}>
            <View style={styles.verticalCategoryContainer}>
              <View style={styles.skeletonTextContainer}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(14)}
                  width="35%"
                  style={styles.skeletonCategoryLabel}
                />

                <SkeletonLoader
                  height={actuatedNormalizeVertical(16)}
                  width="92%"
                  style={styles.skeletonTitleLine}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(16)}
                  width="88%"
                  style={styles.skeletonTitleLineSecondary}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(16)}
                  width="75%"
                  style={styles.skeletonTitleLineSecondary}
                />

                <View style={styles.skeletonBottomRow}>
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(12)}
                    width={actuatedNormalize(35)}
                    style={styles.skeletonTime}
                  />
                  <SkeletonLoader
                    height={actuatedNormalize(18)}
                    width={actuatedNormalize(18)}
                    style={styles.skeletonBookmark}
                  />
                </View>
              </View>

              <SkeletonLoader
                height={actuatedNormalizeVertical(120)}
                width={actuatedNormalize(120)}
                style={styles.verticalImageStyle}
              />
            </View>
          </View>

          {index < 4 && <View style={styles.divider} />}
        </View>
      ))}

      <SkeletonLoader
        height={actuatedNormalizeVertical(48)}
        width="30%"
        style={styles.seeAllButton}
      />
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    skeletonMoreFromContainer: {
      backgroundColor: theme.mainBackgroundDefault
    },
    moreNewsText: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginHorizontal: actuatedNormalize(spacing.xs),
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.m),
      borderBottomColor: theme.sectionTextTitleSpecial
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
    divider: {
      marginTop: actuatedNormalize(spacing.xxxs),
      marginBottom: actuatedNormalize(spacing.l),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    seeAllButton: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginVertical: actuatedNormalizeVertical(spacing.m)
    }
  });

export default MoreFromCategorySkeletonLoader;
