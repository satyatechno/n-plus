import * as React from 'react';

import Svg, { Mask, Rect, G, Path, SvgProps } from 'react-native-svg';

interface ChatInfoIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const ChatInfoIcon: React.FC<ChatInfoIconProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask id="chat-info-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <Rect width="24" height="24" fill="#ffffff" />
    </Mask>
    <G mask="url(#chat-info-mask)">
      <Path
        d="M12 7.6155C12.1808 7.6155 12.3286 7.55808 12.4433 7.44325C12.5581 7.32858 12.6155 7.18083 12.6155 7C12.6155 6.81917 12.5581 6.67142 12.4433 6.55675C12.3286 6.44192 12.1808 6.3845 12 6.3845C11.8192 6.3845 11.6714 6.44192 11.5568 6.55675C11.4419 6.67142 11.3845 6.81917 11.3845 7C11.3845 7.18083 11.4419 7.32858 11.5568 7.44325C11.6714 7.55808 11.8192 7.6155 12 7.6155ZM11.5 15.423H12.5V9.34625H11.5V15.423ZM3 21.077V5.6155C3 5.15517 3.15417 4.77083 3.4625 4.4625C3.77083 4.15417 4.15517 4 4.6155 4H19.3845C19.8448 4 20.2292 4.15417 20.5375 4.4625C20.8458 4.77083 21 5.15517 21 5.6155V16.3845C21 16.8448 20.8458 17.2292 20.5375 17.5375C20.2292 17.8458 19.8448 18 19.3845 18H6.077L3 21.077ZM5.65 17H19.3845C19.5385 17 19.6796 16.9359 19.8078 16.8078C19.9359 16.6796 20 16.5385 20 16.3845V5.6155C20 5.4615 19.9359 5.32042 19.8078 5.19225C19.6796 5.06408 19.5385 5 19.3845 5H4.6155C4.4615 5 4.32042 5.06408 4.19225 5.19225C4.06408 5.32042 4 5.4615 4 5.6155V18.6443L5.65 17Z"
        fill={color}
      />
    </G>
  </Svg>
);

export default ChatInfoIcon;
