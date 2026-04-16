import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

interface IconProps {
  color?: string;
  width?: number;
  height?: number;
}

const NPlusIcon: React.FC<IconProps> = ({ color = '#2C2E33', width = 41, height = 23 }) => (
  <Svg width={width} height={height} viewBox="0 0 705.4 410.36" fill="none">
    <Polygon
      points="615.78 225.69 615.78 128.9 551.33 128.9 551.33 225.69 461.71 225.69 461.71 290.14 551.33 290.14 551.33 386.92 615.78 386.92 615.78 290.14 705.4 290.14 705.4 225.69 615.78 225.69"
      fill={color}
    />
    <Polygon points="354.14 0 275.23 316.48 380.8 410.36 483.11 0 354.14 0" fill={color} />
    <Polygon
      points="0 386.7 118.06 386.7 118.17 386.7 236.23 386.7 251.77 324.38 58.41 152.44 0 386.7"
      fill={color}
    />
    <Polygon points="80.35 64.45 64.28 128.9 257.64 300.84 316.57 64.45 80.35 64.45" fill={color} />
  </Svg>
);

export default NPlusIcon;
