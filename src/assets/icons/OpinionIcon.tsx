import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface OpinionIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const OpinionIcon: React.FC<OpinionIconProps> = ({
  width = 24,
  height = 25,
  color = '#7E7E81',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" {...props}>
    <Path
      d="M3 20.577L6.077 17.5H19.3845C19.8448 17.5 20.2292 17.3458 20.5375 17.0375C20.8458 16.7292 21 16.3448 21 15.8845V5.1155C21 4.65517 20.8458 4.27083 20.5375 3.9625C20.2292 3.65417 19.8448 3.5 19.3845 3.5H4.6155C4.15517 3.5 3.77083 3.65417 3.4625 3.9625C3.15417 4.27083 3 4.65517 3 5.1155V20.577ZM19.3845 16.5H5.65L4 18.1443V5.1155C4 4.9615 4.06408 4.82042 4.19225 4.69225C4.32042 4.56408 4.4615 4.5 4.6155 4.5H19.3845C19.5385 4.5 19.6796 4.56408 19.8077 4.69225C19.9359 4.82042 20 4.9615 20 5.1155V15.8845C20 16.0385 19.9359 16.1796 19.8077 16.3078C19.6796 16.4359 19.5385 16.5 19.3845 16.5Z"
      fill={color}
    />
  </Svg>
);

export default OpinionIcon;
