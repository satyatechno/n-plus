import React from 'react';
import { DimensionValue } from 'react-native';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

interface EmbedsSkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  isSmall?: boolean;
}

const EmbedsSkeletonLoader: React.FC<EmbedsSkeletonLoaderProps> = ({
  width = '100%',
  height = 300,
  isSmall = false
}) => {
  const embedHeight = isSmall ? 152 : height;

  return <SkeletonLoader height={embedHeight} width={width} />;
};

export default EmbedsSkeletonLoader;
