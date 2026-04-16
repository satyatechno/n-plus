import * as React from 'react';
import Svg, { Path, Rect, Mask, G, Defs } from 'react-native-svg';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface CustomIconProps {
  stroke?: string;
  width?: number;
  height?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  stroke,
  width = actuatedNormalize(12),
  height = actuatedNormalizeVertical(12),
  ...props
}) => {
  const [theme] = useTheme();
  const iconStroke = stroke ?? theme.iconIconographyGenericState;

  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" {...props}>
      <Defs>
        <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
          <Rect width="12" height="12" fill="#D9D9D9" />
        </Mask>
      </Defs>
      <G mask="url(#mask0)">
        <Path
          d="M0 9.33333V10.6667H4V9.33333H0ZM0 1.33333V2.66667H6.66667V1.33333H0ZM6.66667 12V10.6667H12V9.33333H6.66667V8H5.33333V12H6.66667ZM2.66667 4V5.33333H0V6.66667H2.66667V8H4V4H2.66667ZM12 6.66667V5.33333H5.33333V6.66667H12ZM8 4H9.33333V2.66667H12V1.33333H9.33333V0H8V4Z"
          fill={iconStroke}
        />
      </G>
    </Svg>
  );
};

export default CustomIcon;
