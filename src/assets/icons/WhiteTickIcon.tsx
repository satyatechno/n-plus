import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface WhiteTickIconProps {
  fill?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const WhiteTickIcon: React.FC<WhiteTickIconProps> = ({
  fill = 'white',
  width = 8,
  height = 6,
  strokeWidth = 2,
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 8 6"
    strokeWidth={strokeWidth}
    fill="none"
    {...props}
  >
    <Path
      d="M2.77486 4.575L7.01236 0.3375C7.11236 0.2375 7.23111 0.1875 7.36861 0.1875C7.50611 0.1875 7.62486 0.2375 7.72486 0.3375C7.82486 0.4375 7.87486 0.55625 7.87486 0.69375C7.87486 0.83125 7.82486 0.95 7.72486 1.05L3.12486 5.65C3.02486 5.75 2.90819 5.8 2.77486 5.8C2.64153 5.8 2.52486 5.75 2.42486 5.65L0.274859 3.5C0.174859 3.4 0.126943 3.28125 0.131109 3.14375C0.135276 3.00625 0.187359 2.8875 0.287359 2.7875C0.387359 2.6875 0.506109 2.6375 0.643609 2.6375C0.781109 2.6375 0.899859 2.6875 0.999859 2.7875L2.77486 4.575Z"
      fill={fill}
      stroke={fill}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export default WhiteTickIcon;
