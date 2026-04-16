import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BackIconProps {
  stroke?: string;
  fill?: string;
  width?: number;
  height?: number;
}

const BackIcon: React.FC<BackIconProps> = ({
  stroke = '#000',
  fill = 'none',
  width = actuatedNormalize(20),
  height = actuatedNormalizeVertical(20),
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...props}>
    <Path
      d="M15 18l-6-6 6-6"
      stroke={stroke}
      strokeWidth={2}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackIcon;
