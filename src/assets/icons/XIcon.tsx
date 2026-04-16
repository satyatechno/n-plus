// XIcon.tsx
import * as React from 'react';

import Svg, { Path, SvgProps } from 'react-native-svg';

interface XIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const XIcon: React.FC<XIconProps> = ({ width = 16, height = 16, color = '#2C2E33', ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M9.24629 6.84311L14.8438 0.451294H13.516L8.654 5.99939L4.76829 0.451294H0.290283L6.16115 8.84375L0.290283 15.5488H1.61806L6.75345 9.68747L10.8539 15.5488H15.332L9.23978 6.84311H9.24629ZM7.42385 8.91406L6.83155 8.07673L2.09971 1.42924H4.13694L7.95756 6.79837L8.54986 7.6357L13.516 14.6092H11.4788L7.42385 8.91406Z"
      fill={color}
    />
  </Svg>
);

export default XIcon;
