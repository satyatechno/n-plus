import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import InactiveLiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/InactiveLiveBlogListingSkeleton';

interface BlogListingSkeletonProps {
  blogStatus: boolean;
  isShowLiveBlogHeader?: boolean;
  liveBlogCount?: number;
  isShowLiveBlogEnteries?: boolean;
  isShowInactiveBlog?: boolean;
}

const LiveBlogListingSkeleton = ({
  blogStatus,
  isShowLiveBlogHeader,
  liveBlogCount = 5,
  isShowInactiveBlog,
  isShowLiveBlogEnteries
}: BlogListingSkeletonProps) => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const renderBlogCardSkeleton = (index: number) => (
    <View key={index} style={styles.cardContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(222)}
        width={'100%'}
        style={styles.imagePlaceholder}
      />

      {blogStatus && (
        <View style={styles.liveIndicatorContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(spacing['xs'])}
            width={actuatedNormalize(50)}
            style={styles.liveIndicator}
          />
        </View>
      )}

      <SkeletonLoader
        height={actuatedNormalizeVertical(spacing['l'])}
        width={'90%'}
        style={styles.title}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(spacing['s'])}
        width={'75%'}
        style={styles.subtitle}
      />

      {isShowLiveBlogEnteries && index == 0 && (
        <View style={styles.timelineContainer}>
          {[1, 2, 3, 4, 5].map((_, timelineIndex) => (
            <View key={timelineIndex} style={styles.inactiveTimelineItem}>
              <View style={styles.timeColumn}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing['xs'])}
                  width={actuatedNormalize(45)}
                  style={styles.timeText}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing['xs'])}
                  width={actuatedNormalize(35)}
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
                  height={actuatedNormalizeVertical(spacing['s'])}
                  width={'95%'}
                  style={styles.contentLineOne}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing['s'])}
                  width={'80%'}
                  style={styles.contentLineTwo}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isShowLiveBlogHeader && (
          <SkeletonLoader
            height={actuatedNormalizeVertical(32)}
            width={'100%'}
            style={styles.recommendedLine}
          />
        )}
        {Array.from({ length: liveBlogCount }).map((_, index) => renderBlogCardSkeleton(index))}

        {isShowInactiveBlog && <InactiveLiveBlogListingSkeleton />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LiveBlogListingSkeleton;
