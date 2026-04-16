import React from 'react';

import Svg, { Path } from 'react-native-svg';

interface AudioMuteProps {
  width?: number;
  height?: number;
  fill?: string;
}

const AudioMute: React.FC<AudioMuteProps> = ({ width = 24, height = 25, fill = '#2C2E33' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
    <Path
      d="M8.00049 14.5791V10.5791H11.4235L15.0005 7.00208V18.1561L11.4235 14.5791H8.00049ZM9.00049 13.5791H11.8505L14.0005 15.7291V9.42908L11.8505 11.5791H9.00049V13.5791Z"
      fill={fill}
    />
  </Svg>
);

export default AudioMute;
