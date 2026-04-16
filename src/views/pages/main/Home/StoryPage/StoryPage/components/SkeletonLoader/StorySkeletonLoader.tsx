import React from 'react';
import { View, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import RecommendedSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/RecommendationSkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import LatestNewsSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LatestNewsSkeleton';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import TopicChipSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/TopicChipSkeleton';

const StorySkeletonCard = ({ customTheme }: { customTheme?: 'light' | 'dark' }) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <CategoryHeaderSkeleton />

        {[20, 20, 20, 80].map((height, index) => (
          <SkeletonLoader
            key={`media-${index}`}
            height={actuatedNormalizeVertical(height)}
            width={'90%'}
            style={styles.mediaBlock}
          />
        ))}

        <View style={styles.audioRow}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(16)}
            width={actuatedNormalize(16)}
            style={styles.avatar}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(8)}
            width={actuatedNormalize(157)}
            style={styles.audioLine}
          />
        </View>

        <SkeletonLoader
          height={actuatedNormalizeVertical(492)}
          width={'100%'}
          style={styles.largeMediaBlock}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(26)}
          width={'92%'}
          style={styles.bottomLine}
        />

        <View style={styles.profileRow}>
          <SkeletonLoader
            height={actuatedNormalize(40)}
            width={actuatedNormalize(40)}
            style={styles.circle}
          />
          <View>
            <SkeletonLoader
              height={actuatedNormalizeVertical(12)}
              width={'60%'}
              style={styles.profileLine}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(10)}
              width={'40%'}
              style={styles.profileLine}
            />
            <View style={styles.bulletRow}>
              <SkeletonLoader
                height={actuatedNormalize(14)}
                width={actuatedNormalize(14)}
                style={styles.bulletDot}
              />
              <SkeletonLoader
                height={actuatedNormalizeVertical(9)}
                width={'70%'}
                style={styles.bulletLine}
              />
            </View>
          </View>
        </View>

        <SkeletonLoader
          height={actuatedNormalizeVertical(26)}
          width={'92%'}
          style={styles.bottomLine}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(96)}
          width={actuatedNormalize(300)}
          style={styles.midContent}
        />
        {[1, 2, 3].map((_, index) => (
          <SkeletonLoader
            key={`mid-content-${index}`}
            height={actuatedNormalizeVertical(48)}
            width={actuatedNormalize(300)}
            style={styles.midContent}
          />
        ))}

        <SkeletonLoader
          height={actuatedNormalizeVertical(288)}
          width={'94%'}
          style={styles.footerBar}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(144)}
          width={'94%'}
          style={styles.bottomSmall}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(222)}
          width={'100%'}
          style={styles.largeMediaBlock}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(8)}
          width={'94%'}
          style={styles.largeMediaBlock}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(43)}
          width={'94%'}
          style={styles.largeMediaBlock}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(168)}
          width={'94%'}
          style={styles.largeMediaBlock}
        />

        {[1, 2, 3].map((_, index) => (
          <SkeletonLoader
            key={`mid-content-extra-${index}`}
            height={actuatedNormalizeVertical(131)}
            width={'94%'}
            style={styles.midContent}
          />
        ))}
        <SkeletonLoader
          height={actuatedNormalizeVertical(168)}
          width={'94%'}
          style={styles.largeMediaBlock}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(16)}
          width={'20%'}
          style={styles.topBarStartAligned}
        />

        <View style={styles.profileRow}>
          <SkeletonLoader
            height={actuatedNormalize(130)}
            width={actuatedNormalize(130)}
            style={styles.largeCircle}
          />
          <View style={styles.profileColumn}>
            <View style={styles.profileLineGroup}>
              <SkeletonLoader
                height={actuatedNormalizeVertical(16)}
                width={actuatedNormalize(63)}
                style={styles.profileLine}
              />
              <SkeletonLoader
                height={actuatedNormalizeVertical(56)}
                width={actuatedNormalize(200)}
                style={styles.profileLine}
              />
            </View>
            <SkeletonLoader
              height={actuatedNormalizeVertical(8)}
              width={actuatedNormalize(31)}
              style={styles.profileLine}
            />
          </View>
        </View>

        <View>
          <TopicChipSkeleton />
        </View>

        <View style={styles.recommendedWrapper}>
          <RecommendedSkeleton />
        </View>

        <View style={styles.finalWrapper}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(8)}
            width={'100%'}
            style={styles.finalTopBar}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(250)}
            width={actuatedNormalize(300)}
            style={styles.finalCard}
          />

          <LatestNewsSkeleton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StorySkeletonCard;
