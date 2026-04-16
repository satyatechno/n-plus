import * as React from 'react';

import Svg, { Path, SvgProps } from 'react-native-svg';

interface FbIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const Fb: React.FC<FbIconProps> = ({ width = 11, height = 20, color = '#2C2E33', ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 11 20" fill="none" {...props}>
    <Path
      d="M6.81464 19.4375V11.1793H9.6199L10.1536 7.75969H6.81464V5.54173C6.81464 4.60852 7.28327 3.69449 8.77377 3.69449H10.2903V0.792605C10.2903 0.792605 8.91045 0.5625 7.59569 0.5625C4.849 0.5625 3.05259 2.19881 3.05259 5.15822V7.75969H0V11.1793H3.0591V19.4375H6.82115H6.81464Z"
      fill={color}
    />
  </Svg>
);

export default Fb;
