import React from 'react';
import { View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const LiveTVChannelVideoSkeleton = () => (
  <View>
    <SkeletonLoader height={actuatedNormalizeVertical(222)} width={'100%'} />
  </View>
);

export default LiveTVChannelVideoSkeleton;
