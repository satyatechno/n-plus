import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Svg, { Circle } from 'react-native-svg';

interface CustomCircleIconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle> | undefined;
}

const LiveDotIcon: React.FC<CustomCircleIconProps> = ({
  width = 16,
  height = 16,
  color = '#FF3640',
  style
}) => (
  <View style={style}>
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="3.73333" stroke={color} strokeOpacity="0.4" strokeWidth="0.533333" />
      <Circle
        cx="8.00002"
        cy="7.99999"
        r="5.16667"
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth="0.333333"
      />
      <Circle
        cx="7.99998"
        cy="8.00001"
        r="6.5"
        stroke={color}
        strokeOpacity="0.1"
        strokeWidth="0.333333"
      />
      <Circle cx="7.99998" cy="8.00001" r="2.66667" fill={color} />
    </Svg>
  </View>
);

export default LiveDotIcon;
