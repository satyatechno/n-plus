import React from 'react';
import { View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, radius } from '@src/config/styleConsts';

interface RecommendationsSkeletonsProps {
  type: 'interests' | 'buttons';
}

const RecommendationsSkeletons: React.FC<RecommendationsSkeletonsProps> = ({ type }) => {
  if (type === 'interests') {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(30)}
            width={'38%'}
            style={{
              borderRadius: radius.xl,
              marginBottom: actuatedNormalizeVertical(spacing.s),
              marginRight: actuatedNormalize(spacing.xs)
            }}
          />
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(30)}
            width={'28%'}
            style={{
              borderRadius: radius.xl,
              marginBottom: actuatedNormalizeVertical(spacing.s),
              marginRight: actuatedNormalize(spacing.xs)
            }}
          />
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(30)}
            width={'38%'}
            style={{
              borderRadius: radius.xl,
              marginBottom: actuatedNormalizeVertical(spacing.s),
              marginRight: actuatedNormalize(spacing.xs)
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {Array.from({ length: 1 }).map((_, index) => (
        <SkeletonLoader
          key={index}
          height={actuatedNormalizeVertical(52)}
          width={'100%'}
          style={{ borderRadius: radius.m }}
        />
      ))}
    </View>
  );
};

export default RecommendationsSkeletons;
