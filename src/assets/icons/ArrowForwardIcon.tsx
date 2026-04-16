import * as React from 'react';

import Svg, { Mask, Rect, G, Path, SvgProps } from 'react-native-svg';

interface ArrowForwardIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

const ArrowForwardIcon: React.FC<ArrowForwardIconProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  strokeWidth = 0.7,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask id="arrow-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <Rect width="24" height="24" fill="#ffffff" />
    </Mask>
    <G mask="url(#arrow-mask)">
      <Path
        d="M9.91114 17L9.33984 16.4287L13.7685 12L9.33984 7.5713L9.91114 7L14.9111 12L9.91114 17Z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </G>
  </Svg>
);

export default ArrowForwardIcon;
