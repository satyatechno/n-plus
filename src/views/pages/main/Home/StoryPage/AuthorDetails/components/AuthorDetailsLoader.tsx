import React from 'react';
import { FlatList, View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/AuthorDetails/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const RecommendationSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const articlePlaceholder = Array.from({ length: 3 }).map((_, i) => ({
    key: i.toString()
  }));
  return (
    <>
      <View style={styles.headingContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(30)}
          width={'90%'}
          style={styles.sectionHeading}
        />
      </View>

      <FlatList
        data={articlePlaceholder}
        scrollEnabled={false}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <View style={styles.recommendationContainer}>
            {[1, 2].map((_, index) => (
              <View key={`skeleton-block-${index}`} style={styles.recommended}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(16)}
                  width={'50%'}
                  style={styles.recommendedLine}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(96)}
                  width={'100%'}
                  style={styles.recommendedBlock}
                />
                <View style={styles.recommendedRow}>
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(8)}
                    width={'20%'}
                    style={styles.recommendedAudioLine}
                  />
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(12)}
                    width={actuatedNormalize(12)}
                    style={styles.recommendedBulletDot}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </>
  );
};

export const AuthorDetailSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <>
      <View style={styles.headerSection}>
        <View style={styles.authorNameContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(30)}
            width={actuatedNormalize(160)}
            style={styles.authorNameSkeleton}
          />
          <View style={styles.nameSpacing} />
          <SkeletonLoader
            height={actuatedNormalizeVertical(12)}
            width={actuatedNormalize(100)}
            style={styles.authorMeta}
          />
        </View>

        <SkeletonLoader
          height={actuatedNormalizeVertical(148)}
          width={actuatedNormalizeVertical(148)}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.bannerContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(180)}
          width="100%"
          style={styles.banner}
        />
      </View>

      <View style={styles.iconRow}>
        {[0, 1].map((_, i) => (
          <SkeletonLoader
            key={i}
            height={actuatedNormalizeVertical(24)}
            width={actuatedNormalize(24)}
            style={styles.icon}
          />
        ))}
      </View>

      <RecommendationSkeleton />
    </>
  );
};
