import * as React from 'react';
import Svg, { Mask, Rect, G, Path, SvgProps } from 'react-native-svg';

interface NewsModeProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const NewsMode: React.FC<NewsModeProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="news-mode-mask"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <Rect width="24" height="24" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#news-mode-mask)">
      <Path
        d="M4.6155 20C4.15517 20 3.77083 19.8458 3.4625 19.5375C3.15417 19.2292 3 18.8448 3 18.3845V5.6155C3 5.15517 3.15417 4.77083 3.4625 4.4625C3.77083 4.15417 4.15517 4 4.6155 4H19.3845C19.8448 4 20.2292 4.15417 20.5375 4.4625C20.8458 4.77083 21 5.15517 21 5.6155V18.3845C21 18.8448 20.8458 19.2292 20.5375 19.5375C20.2292 19.8458 19.8448 20 19.3845 20H4.6155ZM4.6155 19H19.3845C19.5385 19 19.6796 18.9359 19.8078 18.8077C19.9359 18.6796 20 18.5385 20 18.3845V5.6155C20 5.4615 19.9359 5.32042 19.8078 5.19225C19.6796 5.06408 19.5385 5 19.3845 5H4.6155C4.4615 5 4.32042 5.06408 4.19225 5.19225C4.06408 5.32042 4 5.4615 4 5.6155V18.3845C4 18.5385 4.06408 18.6796 4.19225 18.8077C4.32042 18.9359 4.4615 19 4.6155 19ZM6.76925 16.2308H17.2308V15.2308H6.76925V16.2308ZM6.76925 12.5H10.1537V7.76925H6.76925V12.5ZM12.5385 12.5H17.2308V11.5H12.5385V12.5ZM12.5385 8.76925H17.2308V7.76925H12.5385V8.76925Z"
        fill={color}
      />
    </G>
  </Svg>
);

export default NewsMode;
