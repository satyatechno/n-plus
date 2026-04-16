import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const TopicChipSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <>
      <SkeletonLoader
        height={actuatedNormalizeVertical(16)}
        width={actuatedNormalize(167)}
        style={styles.pillButton}
      />

      <View style={styles.bottomTabs}>
        {[1, 2, 3, 4].map((_, index) => (
          <SkeletonLoader
            key={`bottom-tab-${index}`}
            height={actuatedNormalizeVertical(8)}
            width={actuatedNormalize(52)}
            style={styles.tabBarItem}
          />
        ))}
      </View>
    </>
  );
};

export default TopicChipSkeleton;
