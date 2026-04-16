import React from 'react';
import { Svg, Circle } from 'react-native-svg';

type MenuProps = {
  width?: number;
  height?: number;
  fill?: string;
};

const Menu: React.FC<MenuProps> = ({ width = 24, height = 24, fill = '#2C2E33' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="5" r="2" fill={fill} />
    <Circle cx="12" cy="12" r="2" fill={fill} />
    <Circle cx="12" cy="19" r="2" fill={fill} />
  </Svg>
);

export default Menu;
