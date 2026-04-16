import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';

const LiveBlogEnteriesSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.enteryContainer}>
      {[1, 2, 3].map((_, timelineIndex) => (
        <View key={timelineIndex} style={styles.enteryBlock}>
          <View style={styles.entryTimeColumn}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing.xs)}
              width={actuatedNormalize(50)}
              style={styles.timeText}
            />

            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing.xs)}
              width={actuatedNormalize(40)}
              style={styles.dateText}
            />
          </View>

          <View style={styles.dotColumn}>
            <SkeletonLoader
              height={actuatedNormalize(8)}
              width={actuatedNormalize(8)}
              style={styles.inactiveDot}
            />
          </View>

          <View style={styles.contentColumn}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing.s)}
              width={'95%'}
              style={styles.contentLineOne}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing.s)}
              width={'80%'}
              style={styles.contentLineTwo}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default LiveBlogEnteriesSkeleton;
