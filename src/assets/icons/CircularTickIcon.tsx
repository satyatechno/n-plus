import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface CheckCircleIconProps {
  width?: number;
  height?: number;
  color?: string;
  borderColor?: string;
}

const CheckCircleIcon = ({
  width = 96,
  height = 96,
  color = '#2C2E33',
  borderColor = '#E1E1E2'
}: CheckCircleIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 96 96" fill="none">
    <Rect
      x="0.75"
      y="0.75"
      width="94.5"
      height="94.5"
      rx="47.25"
      stroke={borderColor}
      strokeWidth="1.5"
    />
    <Path
      d="M59.6486 39.539C59.1799 39.0703 58.4202 39.0703 57.9515 39.539L43.5747 53.9159L38.0486 48.3897C37.5799 47.921 36.8202 47.9211 36.3515 48.3897C35.8828 48.8583 35.8828 49.6181 36.3515 50.0867L42.7262 56.4613C43.1947 56.9299 43.955 56.9296 44.4233 56.4613L59.6486 41.2361C60.1172 40.7674 60.1172 40.0076 59.6486 39.539Z"
      fill={color}
    />
  </Svg>
);

export default CheckCircleIcon;
