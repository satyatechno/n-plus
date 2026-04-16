import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BlackTickProps {
  fill?: string;
  width?: number;
  height?: number;
}

const BlackTickIcon: React.FC<BlackTickProps> = ({
  fill = '#2C2E33',
  width = 24,
  height = 18,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 18" fill="none" {...props}>
    <Path
      d="M23.6486 0.538992C23.1799 0.0703359 22.4202 0.0703359 21.9515 0.538992L7.57474 14.9159L2.04855 9.3897C1.57995 8.92104 0.820195 8.92109 0.351492 9.3897C-0.117164 9.8583 -0.117164 10.6181 0.351492 11.0867L6.72621 17.4613C7.19468 17.9299 7.95499 17.9296 8.42327 17.4613L23.6486 2.23605C24.1172 1.76745 24.1172 1.00765 23.6486 0.538992Z"
      fill={fill}
      strokeWidth={2}
      stroke={fill}
    />
  </Svg>
);

export default BlackTickIcon;
