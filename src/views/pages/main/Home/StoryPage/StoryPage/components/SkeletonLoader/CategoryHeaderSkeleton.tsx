import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const CategoryHeaderSkeleton = ({ customTheme }: { customTheme?: 'light' | 'dark' }) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  return (
    <View style={styles.headerRow}>
      {[54, 3, 54, 100, 43, 39].map((width, index) => (
        <SkeletonLoader
          key={`avatar-${index}`}
          height={actuatedNormalizeVertical(9)}
          width={actuatedNormalize(width)}
          style={styles.avatar}
        />
      ))}
    </View>
  );
};

export default CategoryHeaderSkeleton;
