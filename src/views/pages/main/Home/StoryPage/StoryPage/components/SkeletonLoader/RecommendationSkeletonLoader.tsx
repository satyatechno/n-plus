import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface RecommendationSkeletonProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const RecommendedSkeleton = ({ contentContainerStyle }: RecommendationSkeletonProps) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={StyleSheet.flatten([styles.recommendedContainer, contentContainerStyle])}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(32)}
        width={'100%'}
        style={styles.recommendedLine}
      />

      {[1, 2].map((_, index) => (
        <View key={`skeleton-block-${index}`} style={styles.recommended}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={'100%'}
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
              width={'80%'}
              style={styles.recommendedAudioLine}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(10)}
              width={actuatedNormalize(8)}
              style={styles.recommendedBulletDot}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default RecommendedSkeleton;
