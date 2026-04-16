import React from 'react';

import Svg, { Path } from 'react-native-svg';

interface Speed1xProps {
  width?: number;
  height?: number;
  fill?: string;
}

const Speed1x: React.FC<Speed1xProps> = ({ width = 24, height = 24, fill = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.3 16.75V8.375H4.25V7.25H7.425V16.75H6.3ZM11.225 16.75L14.225 11.675L11.55 7.25H12.875L14.925 10.6L16.875 7.25H18.175L15.6 11.675L18.55 16.75H17.25L14.9 12.775L12.525 16.75H11.225Z"
      fill={fill}
    />
  </Svg>
);

export default Speed1x;
