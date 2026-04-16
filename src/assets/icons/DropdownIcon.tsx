import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DropdownIconProps {
  stroke?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const DropdownIcon: React.FC<DropdownIconProps> = ({
  stroke = '#2C2E33',
  width = 18,
  height = 18,
  strokeWidth = 1,
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    strokeWidth={strokeWidth}
    {...props}
  >
    <Path
      d="M4.5 6.75L9 11.25L13.5 6.75"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DropdownIcon;
