import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

interface CheckboxIconProps {
  stroke?: string;
  fill?: string;
  checkStroke?: string;
  width?: number;
  height?: number;
}

const CheckboxIcon: React.FC<CheckboxIconProps> = ({
  stroke = '#2C2E33',
  fill = '#2C2E33',
  checkStroke = 'white',
  width = 20,
  height = 20,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2129 1H5.78707C2.83896 1 1 3.08117 1 6.02636V13.9736C1 16.9188 2.83896 19 5.78707 19H14.2129C17.161 19 19 16.9188 19 13.9736V6.02636C19 3.08117 17.161 1 14.2129 1Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={1.45946}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.53516 9.99998L8.84122 12.3088L13.4628 7.69113"
      stroke={checkStroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckboxIcon;
