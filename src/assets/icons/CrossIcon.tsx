import React from 'react';

import Svg, { Path } from 'react-native-svg';

interface CrossIconProps {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
}

const CrossIcon: React.FC<CrossIconProps> = ({
  width = 10,
  height = 10,
  stroke = '#2C2E33',
  strokeWidth = 1.01796
}) => (
  <Svg width={width} height={height} viewBox="0 0.5 10 10" fill="none" strokeWidth={strokeWidth}>
    <Path
      d="M1 1L9 9M1 9L9 1"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CrossIcon;
