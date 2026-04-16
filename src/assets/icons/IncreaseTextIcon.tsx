import React from 'react';
import Svg, { Mask, Rect, G, Path } from 'react-native-svg';

interface IncreaseTextIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const IncreaseTextIcon: React.FC<IncreaseTextIconProps> = ({
  width = 24,
  height = 24,
  fill = '#2C2E33'
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Mask id="mask0_23042_2862" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
      <Rect width={24} height={24} fill="#D9D9D9" />
    </Mask>

    <G mask="url(#mask0_23042_2862)">
      <Path
        d="M1.61548 18.5001L6.90373 5.50006H7.86548L13.1537 18.5001H11.9462L10.498 14.8673H4.19423L2.74623 18.5001H1.61548ZM4.55373 13.9001H10.1385L7.42823 7.10006H7.29623L4.55373 13.9001ZM18.3845 15.5001V12.5001H15.3845V11.5001H18.3845V8.50006H19.3845V11.5001H22.3845V12.5001H19.3845V15.5001H18.3845Z"
        fill={fill}
      />
    </G>
  </Svg>
);

export default IncreaseTextIcon;
