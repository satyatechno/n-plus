import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface HomeFilledIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const HomeFilledIcon: React.FC<HomeFilledIconProps> = ({
  width = 15,
  height = 17,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 15 17" fill="none" {...props}>
    <Path
      d="M0.5 16.3942V5.89421L7.5 0.605713L14.5 5.89421V16.3942H9.30775V10.0097H5.69225V16.3942H0.5Z"
      fill={color}
    />
  </Svg>
);

export default HomeFilledIcon;
