import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface HomeIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({
  width = 25,
  height = 25,
  color = '#7E7E81',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M5.5 20.35V9.89914L12.5 4.65002L19.5 9.89914V20.35H13.9808V14.8172H11.0192V20.35H5.5ZM6.66667 19.1205H9.85254V13.5877H15.1475V19.1205H18.3333V10.5139L12.5 6.19645L6.66667 10.5139V19.1205Z"
      fill={color}
    />
  </Svg>
);

export default HomeIcon;
