import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DeleteAllIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DeleteAllIcon: React.FC<DeleteAllIconProps> = ({
  width = 14,
  height = 16,
  color = '#2C2E33'
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 14 16"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
  >
    <Path
      d="M4.4 11.8077L7 9.20771L9.6 11.8077L10.3077 11.1L7.70775 8.49996L10.3077 5.89996L9.6 5.19221L7 7.79221L4.4 5.19221L3.69225 5.89996L6.29225 8.49996L3.69225 11.1L4.4 11.8077ZM2.6155 16C2.15517 16 1.77083 15.8458 1.4625 15.5375C1.15417 15.2291 1 14.8448 1 14.3845V1.99996H0V0.999963H4V0.230713H10V0.999963H14V1.99996H13V14.3845C13 14.8448 12.8458 15.2291 12.5375 15.5375C12.2292 15.8458 11.8448 16 11.3845 16H2.6155ZM12 1.99996H2V14.3845C2 14.5385 2.06408 14.6795 2.19225 14.8077C2.32042 14.9359 2.4615 15 2.6155 15H11.3845C11.5385 15 11.6796 14.9359 11.8077 14.8077C11.9359 14.6795 12 14.5385 12 14.3845V1.99996Z"
      fill={color}
    />
  </Svg>
);

export default DeleteAllIcon;
