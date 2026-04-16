import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import themeStyles from '@src/views/organisms/AudioPlayerCard/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const AudioPlayerSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.playerContainer}>
      <View style={styles.header}>
        <SkeletonLoader height={actuatedNormalizeVertical(20)} width={'60%'} style={styles.title} />
        <View style={styles.headerIcons}>
          <SkeletonLoader height={actuatedNormalizeVertical(20)} width={actuatedNormalize(20)} />
          <SkeletonLoader height={actuatedNormalizeVertical(20)} width={actuatedNormalize(20)} />
        </View>
      </View>

      <View style={styles.controls}>
        <SkeletonLoader height={actuatedNormalizeVertical(20)} width={actuatedNormalize(20)} />

        <SkeletonLoader height={actuatedNormalizeVertical(20)} width={actuatedNormalize(20)} />

        <SkeletonLoader height={actuatedNormalizeVertical(20)} width={actuatedNormalize(20)} />

        <View style={styles.progressBarContainer}>
          <SkeletonLoader height={3} width={'100%'} style={styles.progressContainer} />
        </View>
      </View>
    </View>
  );
};

export default AudioPlayerSkeleton;
