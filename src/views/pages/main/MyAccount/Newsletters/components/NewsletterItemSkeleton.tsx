import React from 'react';
import { View } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages//main/MyAccount/Newsletters/styles';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

const NewsletterItemSkeleton = () => {
  const { theme } = useNewslettersViewModel();
  const styles = themeStyles(theme);

  return (
    <View style={styles.skeletonLoaderContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(18)}
        width={actuatedNormalize(18)}
        style={styles.SkeletonLoaderCheckBox}
      />

      <View style={styles.descContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(16)}
          width={'70%'}
          style={styles.borderRadius}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(48)}
          width={'100%'}
          style={styles.SkeletonLoaderDesc}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(12)}
          width={'40%'}
          style={styles.borderRadius}
        />
      </View>

      <SkeletonLoader
        height={actuatedNormalizeVertical(88)}
        width={actuatedNormalize(88)}
        style={styles.borderRadius}
      />
    </View>
  );
};

export default NewsletterItemSkeleton;
