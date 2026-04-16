import * as React from 'react';

import Svg, { Path, Mask, Rect, G } from 'react-native-svg';

import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface ProblemIconProps {
  fill?: string;
  width?: number;
  height?: number;
}

const ProblemIcon: React.FC<ProblemIconProps> = ({
  fill,
  width = actuatedNormalize(64),
  height = actuatedNormalizeVertical(64),
  ...props
}) => {
  const [theme] = useTheme();
  const iconFill = fill ?? theme.iconIconographyGenericState;

  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
      <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
        <Rect width="64" height="64" fill="#D9D9D9" />
      </Mask>

      <G mask="url(#mask0)">
        <Path
          d="M19.5854 42.4947C19.9369 42.1431 20.1127 41.7118 20.1127 41.2007C20.1127 40.6896 19.9369 40.25 19.5854 39.882C19.2338 39.514 18.8025 39.33 18.2914 39.33C17.7803 39.33 17.3407 39.514 16.9727 39.882C16.6047 40.25 16.4207 40.6896 16.4207 41.2007C16.4207 41.7118 16.6047 42.1431 16.9727 42.4947C17.3407 42.8462 17.7803 43.022 18.2914 43.022C18.8025 43.022 19.2338 42.8462 19.5854 42.4947ZM17.1387 35.022H19.3947V20.858H17.1387V35.022ZM28.2054 38.4067H46.8614V36.1507H28.2054V38.4067ZM28.2054 27.5247H46.8614V25.2687H28.2054V27.5247ZM11.7467 50.6667C10.6547 50.6667 9.73225 50.2902 8.97937 49.5373C8.22603 48.7845 7.84937 47.8618 7.84937 46.7693V17.2307C7.84937 16.1382 8.22603 15.2156 8.97937 14.4627C9.73225 13.7098 10.6547 13.3333 11.7467 13.3333H52.2534C53.3454 13.3333 54.2678 13.7098 55.0207 14.4627C55.774 15.2156 56.1507 16.1382 56.1507 17.2307V46.7693C56.1507 47.8618 55.774 48.7845 55.0207 49.5373C54.2678 50.2902 53.3454 50.6667 52.2534 50.6667H11.7467ZM11.7467 48.41H52.2534C52.6636 48.41 53.0396 48.2391 53.3814 47.8973C53.7231 47.5556 53.894 47.1796 53.894 46.7693V17.2307C53.894 16.8205 53.7231 16.4445 53.3814 16.1027C53.0396 15.7609 52.6636 15.59 52.2534 15.59H11.7467C11.3365 15.59 10.9605 15.7609 10.6187 16.1027C10.2769 16.4445 10.106 16.8205 10.106 17.2307V46.7693C10.106 47.1796 10.2769 47.5556 10.6187 47.8973C10.9605 48.2391 11.3365 48.41 11.7467 48.41Z"
          fill={iconFill}
        />
      </G>
    </Svg>
  );
};

export default ProblemIcon;
