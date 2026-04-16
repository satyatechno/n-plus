import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface OpinionFilledIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const OpinionFilledIcon: React.FC<OpinionFilledIconProps> = ({
  width = 24,
  height = 25,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" {...props}>
    <Path
      d="M19.3845 17.5C19.8448 17.5 20.2292 17.3458 20.5375 17.0375C20.8458 16.7292 21 16.3448 21 15.8845V5.1155C21 4.65517 20.8458 4.27083 20.5375 3.9625C20.2292 3.65417 19.8448 3.5 19.3845 3.5H4.6155C4.15517 3.5 3.77083 3.65417 3.4625 3.9625C3.15417 4.27083 3 4.65517 3 5.1155V20.577L6.077 17.5H19.3845Z"
      fill={color}
    />
  </Svg>
);

export default OpinionFilledIcon;
