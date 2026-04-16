import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface MicrophoneIconProps {
  fill?: string;
  width?: number;
  height?: number;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({
  fill,
  width = actuatedNormalize(20),
  height = actuatedNormalizeVertical(20),
  ...props
}) => {
  const [theme] = useTheme();
  const iconFill = fill ?? theme.iconIconographyGenericState;

  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M10.0013 1.66699C10.6643 1.66699 11.3002 1.93038 11.7691 2.39923C12.2379 2.86807 12.5013 3.50395 12.5013 4.16699V9.16699C12.5013 9.83003 12.2379 10.4659 11.7691 10.9348C11.3002 11.4036 10.6643 11.667 10.0013 11.667C9.33826 11.667 8.70238 11.4036 8.23353 10.9348C7.76469 10.4659 7.5013 9.83003 7.5013 9.16699V4.16699C7.5013 3.50395 7.76469 2.86807 8.23353 2.39923C8.70238 1.93038 9.33826 1.66699 10.0013 1.66699ZM15.8346 9.16699C15.8346 12.1087 13.6596 14.5337 10.8346 14.942V17.5003H9.16797V14.942C6.34297 14.5337 4.16797 12.1087 4.16797 9.16699H5.83464C5.83464 10.2721 6.27362 11.3319 7.05502 12.1133C7.83643 12.8947 8.89623 13.3337 10.0013 13.3337C11.1064 13.3337 12.1662 12.8947 12.9476 12.1133C13.729 11.3319 14.168 10.2721 14.168 9.16699H15.8346Z"
        fill={iconFill}
      />
    </Svg>
  );
};

export default MicrophoneIcon;
