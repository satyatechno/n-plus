import React from 'react';
import Svg, { Mask, Rect, G, Path } from 'react-native-svg';

type ArrowBackIconProps = {
  width?: number;
  height?: number;
  fill?: string;
};

const ArrowBackIcon: React.FC<ArrowBackIconProps> = ({
  width = 24,
  height = 24,
  fill = '#2C2E33'
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Mask id="mask0_23059_24035" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
      <Rect width={24} height={24} fill="#D9D9D9" />
    </Mask>

    <G mask="url(#mask0_23059_24035)">
      <Path
        d="M6.92125 12.5L12.7135 18.2923L12 19L5 12L12 5L12.7135 5.70775L6.92125 11.5H19V12.5H6.92125Z"
        fill={fill}
      />
    </G>
  </Svg>
);

export default ArrowBackIcon;
