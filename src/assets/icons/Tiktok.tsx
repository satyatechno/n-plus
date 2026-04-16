import * as React from 'react';

import Svg, { Path, SvgProps } from 'react-native-svg';

interface TiktokIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const Tiktok: React.FC<TiktokIconProps> = ({
  width = 18,
  height = 20,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 18 20" fill="none" {...props}>
    <Path
      d="M17.6809 8.09526C17.5116 8.10804 17.3489 8.12083 17.1797 8.12083C15.3442 8.12083 13.6324 7.21319 12.6301 5.70472V13.9246C12.6301 17.2803 9.85737 20.0032 6.44028 20.0032C3.0232 20.0032 0.250488 17.2803 0.250488 13.9246C0.250488 10.5689 3.0232 7.84598 6.44028 7.84598C6.57046 7.84598 6.69412 7.85876 6.8243 7.86515V10.8565C6.70063 10.8437 6.57046 10.8182 6.44028 10.8182C4.69595 10.8182 3.28356 12.2052 3.28356 13.9182C3.28356 15.6312 4.69595 17.0182 6.44028 17.0182C8.18462 17.0182 9.72719 15.6696 9.72719 13.9566L9.75974 -0.00317383H12.6756C12.949 2.56634 15.0578 4.57337 17.6809 4.75873V8.08887"
      fill={color}
    />
  </Svg>
);

export default Tiktok;
