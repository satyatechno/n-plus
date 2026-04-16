import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface ArrowUpIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

const ArrowUpIcon: React.FC<ArrowUpIconProps> = ({
  width = 12,
  height = 7,
  color = '#2C2E33',
  strokeWidth = 0.7,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 12 7" fill="none" {...props}>
    <Path
      d="M11 5.5869L10.4287 6.1582L6 1.7295L1.5713 6.1582L1 5.5869L6 0.586905L11 5.5869Z"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export default ArrowUpIcon;
