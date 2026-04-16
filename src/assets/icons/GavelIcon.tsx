import * as React from 'react';

import Svg, { Mask, Rect, G, Path, SvgProps } from 'react-native-svg';

interface GavelIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const Gavel: React.FC<GavelIconProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask id="gavel-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <Rect width="24" height="24" fill="#ffffff" />
    </Mask>
    <G mask="url(#gavel-mask)">
      <Path
        d="M4.11719 20.4997V19.4997H15.1172V20.4997H4.11719ZM10.0747 15.0342L5.11719 10.0767L6.52469 8.61899L11.5324 13.5767L10.0747 15.0342ZM15.5787 9.53048L10.6209 4.52273L12.0787 3.11523L17.0362 8.07273L15.5787 9.53048ZM20.6017 19.3075L8.24394 6.94973L8.95169 6.24198L21.3094 18.5997L20.6017 19.3075Z"
        fill={color}
      />
    </G>
  </Svg>
);

export default Gavel;
