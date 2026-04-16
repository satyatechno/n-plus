import React from 'react';

import Svg, { G, Path, Mask, Rect, Defs, ClipPath } from 'react-native-svg';

interface InfoIconProps {
  width?: number;
  height?: number;
  color?: string;
  midIconColor?: string;
}

const WarningIcon: React.FC<InfoIconProps> = ({
  width = 18,
  height = 18,
  color = '#3355FF',
  midIconColor = '#3355FF'
}) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <G clipPath="url(#clip0_61345_121)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2129 0H4.78707C1.83896 0 0 2.08117 0 5.02636V12.9736C0 15.9188 1.83896 18 4.78707 18H13.2129C16.161 18 18 15.9188 18 12.9736V5.02636C18 2.08117 16.161 0 13.2129 0Z"
        fill={color}
        stroke={color}
        strokeWidth={1.45946}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Mask id="mask0_61345_121" maskUnits="userSpaceOnUse" x={3} y={3} width={12} height={12}>
        <Rect x={3} y={3} width={12} height={12} fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0_61345_121)">
        <Path
          d="M9 6.50009C8.725 6.50009 8.48958 6.40217 8.29375 6.20634C8.09792 6.01051 8 5.77509 8 5.50009C8 5.22509 8.09792 4.98967 8.29375 4.79384C8.48958 4.59801 8.725 4.50009 9 4.50009C9.275 4.50009 9.51042 4.59801 9.70625 4.79384C9.90208 4.98967 10 5.22509 10 5.50009C10 5.77509 9.90208 6.01051 9.70625 6.20634C9.51042 6.40217 9.275 6.50009 9 6.50009ZM9 13.5001C8.79167 13.5001 8.61458 13.4272 8.46875 13.2813C8.32292 13.1355 8.25 12.9584 8.25 12.7501V8.25009C8.25 8.04176 8.32292 7.86467 8.46875 7.71884C8.61458 7.57301 8.79167 7.50009 9 7.50009C9.20833 7.50009 9.38542 7.57301 9.53125 7.71884C9.67708 7.86467 9.75 8.04176 9.75 8.25009V12.7501C9.75 12.9584 9.67708 13.1355 9.53125 13.2813C9.38542 13.4272 9.20833 13.5001 9 13.5001Z"
          fill={midIconColor}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_61345_121">
        <Rect width={18} height={18} rx={9} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default WarningIcon;
