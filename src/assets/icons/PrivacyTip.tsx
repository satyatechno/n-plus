import * as React from 'react';

import Svg, { Mask, Rect, G, Path, SvgProps } from 'react-native-svg';

interface PrivacyTipIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const PrivacyTipIcon: React.FC<PrivacyTipIconProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="privacy-tip-mask"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <Rect width="24" height="24" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#privacy-tip-mask)">
      <Path
        d="M11.5 16.2299H12.5V10.5762H11.5V16.2299ZM12 8.99917C12.1743 8.99917 12.3205 8.94017 12.4385 8.82217C12.5565 8.70434 12.6155 8.55817 12.6155 8.38367C12.6155 8.20934 12.5565 8.06325 12.4385 7.94542C12.3205 7.82742 12.1743 7.76842 12 7.76842C11.8257 7.76842 11.6795 7.82742 11.5615 7.94542C11.4435 8.06325 11.3845 8.20934 11.3845 8.38367C11.3845 8.55817 11.4435 8.70434 11.5615 8.82217C11.6795 8.94017 11.8257 8.99917 12 8.99917ZM12 20.9607C9.991 20.3645 8.32208 19.1475 6.99325 17.3097C5.66442 15.4718 5 13.4017 5 11.0992V5.69142L12 3.07617L19 5.69142V11.0992C19 13.4017 18.3356 15.4718 17.0068 17.3097C15.6779 19.1475 14.009 20.3645 12 20.9607ZM12 19.8992C13.7333 19.3492 15.1667 18.2492 16.3 16.5992C17.4333 14.9492 18 13.1158 18 11.0992V6.37417L12 4.14342L6 6.37417V11.0992C6 13.1158 6.56667 14.9492 7.7 16.5992C8.83333 18.2492 10.2667 19.3492 12 19.8992Z"
        fill={color}
      />
    </G>
  </Svg>
);

export default PrivacyTipIcon;
