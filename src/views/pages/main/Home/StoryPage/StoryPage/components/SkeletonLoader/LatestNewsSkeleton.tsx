import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';

const LatestNewsSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View>
      <SkeletonLoader
        height={actuatedNormalizeVertical(32)}
        width={'94%'}
        style={styles.finalTitle}
      />

      <View style={styles.sideBySide}>
        {[1, 2].map((_, i) => (
          <View key={`card-${i}`} style={styles.finalCardItem}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(146)}
              width={actuatedNormalize(260)}
              style={styles.cardImage}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(16)}
              width={'30%'}
              style={styles.cardLineShort}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(56)}
              width={'90%'}
              style={styles.cardLineFull}
            />
            <View style={styles.cardBottomRow}>
              <View style={styles.cardRow}>
                <SkeletonLoader
                  height={actuatedNormalize(17)}
                  width={actuatedNormalize(17)}
                  style={styles.dot}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(8)}
                  width={actuatedNormalize(31)}
                  style={styles.smallLine}
                />
              </View>
              <SkeletonLoader
                height={actuatedNormalizeVertical(15)}
                width={actuatedNormalize(12)}
                style={styles.dot}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LatestNewsSkeleton;
