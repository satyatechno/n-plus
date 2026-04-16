import React from 'react';

import Svg, { Mask, Rect, G, Path, Defs } from 'react-native-svg';

interface CheckedBookmarkIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const CheckedBookmarkIcon = ({
  width = 24,
  height = 24,
  color = '#2C2E33'
}: CheckedBookmarkIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
    <Defs>
      <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
        <Rect x="0.5" width="24" height="24" fill="#D9D9D9" />
      </Mask>
    </Defs>
    <G mask="url(#mask0)">
      <Path
        d="M6.5 19.5V5.6155C6.5 5.15517 6.65417 4.77083 6.9625 4.4625C7.27083 4.15417 7.65517 4 8.1155 4H16.8845C17.3448 4 17.7292 4.15417 18.0375 4.4625C18.3458 4.77083 18.5 5.15517 18.5 5.6155V19.5L12.5 16.923L6.5 19.5Z"
        fill={color}
      />
    </G>
  </Svg>
);

export default CheckedBookmarkIcon;
