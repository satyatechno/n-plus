import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TrashIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ width = 14, height = 16, color = '#2C2E33' }) => (
  <Svg width={width} height={height} viewBox="0 0 14 16" fill="none">
    <Path
      d="M2.6155 16C2.168 16 1.78683 15.8426 1.472 15.528C1.15733 15.2131 1 14.832 1 14.3845V1.99996H0V0.999963H4V0.230713H10V0.999963H14V1.99996H13V14.3845C13 14.8448 12.8458 15.2291 12.5375 15.5375C12.2292 15.8458 11.8448 16 11.3845 16H2.6155ZM12 1.99996H2V14.3845C2 14.564 2.05767 14.7115 2.173 14.827C2.2885 14.9423 2.436 15 2.6155 15H11.3845C11.5385 15 11.6796 14.9359 11.8077 14.8077C11.9359 14.6795 12 14.5385 12 14.3845V1.99996ZM4.80775 13H5.80775V3.99996H4.80775V13ZM8.19225 13H9.19225V3.99996H8.19225V13Z"
      fill={color}
    />
  </Svg>
);

export default TrashIcon;
