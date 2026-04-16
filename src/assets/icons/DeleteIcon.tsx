import * as React from 'react';
import Svg, { Path, G, Mask, Rect } from 'react-native-svg';

interface DeleteIconProps {
  fill?: string;
  width?: number;
  height?: number;
}

const DeleteIcon: React.FC<DeleteIconProps> = ({
  fill = '#2C2E33',
  width = 24,
  height = 24,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask id="mask0" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
      <Rect width={24} height={24} fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0)">
      <Path
        d="M9.4 15.8077L12 13.2077L14.6 15.8077L15.3077 15.1L12.7077 12.5L15.3077 9.89996L14.6 9.19221L12 11.7922L9.4 9.19221L8.69225 9.89996L11.2923 12.5L8.69225 15.1L9.4 15.8077ZM7.6155 20C7.15517 20 6.77083 19.8458 6.4625 19.5375C6.15417 19.2291 6 18.8448 6 18.3845V5.99996H5V4.99996H9V4.23071H15V4.99996H19V5.99996H18V18.3845C18 18.8448 17.8458 19.2291 17.5375 19.5375C17.2292 19.8458 16.8448 20 16.3845 20H7.6155ZM17 5.99996H7V18.3845C7 18.5385 7.06408 18.6795 7.19225 18.8077C7.32042 18.9359 7.4615 19 7.6155 19H16.3845C16.5385 19 16.6796 18.9359 16.8077 18.8077C16.9359 18.6795 17 18.5385 17 18.3845V5.99996Z"
        fill={fill}
      />
    </G>
  </Svg>
);

export default DeleteIcon;
