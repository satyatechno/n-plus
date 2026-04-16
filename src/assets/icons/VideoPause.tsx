import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Mask, Rect, G, Path, Defs } from 'react-native-svg';

interface BarChartIconProps {
  fill?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const VideoPause: React.FC<BarChartIconProps> = ({
  fill = '#2C2E33',
  width = 24,
  height = 24,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Defs>
      <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <Rect width="24" height="24" fill="#D9D9D9" />
      </Mask>
    </Defs>
    <G mask="url(#mask0)">
      <Path
        d="M13.25 18.5V5.5H18.5V18.5H13.25ZM5.5 18.5V5.5H10.75V18.5H5.5ZM14.75 17H17V7H14.75V17ZM7 17H9.25V7H7V17Z"
        fill={fill}
      />
    </G>
  </Svg>
);

export default VideoPause;
