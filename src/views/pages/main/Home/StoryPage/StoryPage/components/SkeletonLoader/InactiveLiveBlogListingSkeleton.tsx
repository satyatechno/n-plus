import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';

const InactiveLiveBlogListingSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const renderSimpleCardSkeleton = (index: number) => (
    <View key={`simple-${index}`} style={styles.simpleCardContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(222)}
        width={'100%'}
        style={styles.imagePlaceholder}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(spacing['l'])}
        width={'85%'}
        style={styles.title}
      />

      <SkeletonLoader
        height={actuatedNormalizeVertical(spacing['s'])}
        width={'70%'}
        style={styles.subtitle}
      />
    </View>
  );

  return (
    <View style={styles.recommendedContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(32)}
        width={'100%'}
        style={styles.recommendedLine}
      />

      {[1, 2].map((_, index) => renderSimpleCardSkeleton(index))}
    </View>
  );
};

export default InactiveLiveBlogListingSkeleton;
