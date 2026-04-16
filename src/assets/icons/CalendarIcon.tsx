import * as React from 'react';
import Svg, { Path, Rect, Mask, G, Defs } from 'react-native-svg';

import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface CalendarIconProps {
  stroke?: string;
  width?: number;
  height?: number;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
  stroke,
  width = actuatedNormalize(24),
  height = actuatedNormalizeVertical(24),
  ...props
}) => {
  const [theme] = useTheme();
  const iconStroke = stroke ?? theme.iconIconographyGenericState;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Defs>
        <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
      </Defs>
      <G mask="url(#mask0)">
        <Path
          d="M5.6155 21.0003C5.15517 21.0003 4.77083 20.8461 4.4625 20.5378C4.15417 20.2294 4 19.8451 4 19.3848V6.61578C4 6.15545 4.15417 5.77111 4.4625 5.46278C4.77083 5.15445 5.15517 5.00028 5.6155 5.00028H7.3845V2.76953H8.4615V5.00028H15.6155V2.76953H16.6155V5.00028H18.3845C18.8448 5.00028 19.2292 5.15445 19.5375 5.46278C19.8458 5.77111 20 6.15545 20 6.61578V19.3848C20 19.8451 19.8458 20.2294 19.5375 20.5378C19.2292 20.8461 18.8448 21.0003 18.3845 21.0003H5.6155ZM5.6155 20.0003H18.3845C18.5385 20.0003 18.6796 19.9362 18.8077 19.808C18.9359 19.6799 19 19.5388 19 19.3848V10.6158H5V19.3848C5 19.5388 5.06408 19.6799 5.19225 19.808C5.32042 19.9362 5.4615 20.0003 5.6155 20.0003ZM5 9.61553H19V6.61578C19 6.46178 18.9359 6.3207 18.8077 6.19253C18.6796 6.06436 18.5385 6.00028 18.3845 6.00028H5.6155C5.4615 6.00028 5.32042 6.06436 5.19225 6.19253C5.06408 6.3207 5 6.46178 5 6.61578V9.61553Z"
          fill={iconStroke}
        />
      </G>
    </Svg>
  );
};

export default CalendarIcon;
