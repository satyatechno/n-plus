import React from 'react';
import { View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages//main/MyAccount/NotificationSetting/styles';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const NotificationSectionSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.flatListContentContainer}>
      <View style={styles.titleRow}>
        <SkeletonLoader height={20} width={'60%'} />
        <SkeletonLoader height={20} width={40} style={styles.switchView} />
      </View>

      {Array.from({ length: 6 }).map((_, index) => {
        const isLastItem = index === 5;

        return (
          <View key={index} style={[styles.itemContainer, isLastItem && { borderBottomWidth: 0 }]}>
            <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'70%'} />
            <SkeletonLoader
              height={actuatedNormalizeVertical(18)}
              width={actuatedNormalize(36)}
              style={styles.switchView}
            />
          </View>
        );
      })}
    </View>
  );
};

export default NotificationSectionSkeleton;
