import * as React from 'react';

import Svg, { Path, Rect, Mask, G } from 'react-native-svg';

import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface BookmarkCollectionIconProps {
  stroke?: string;
  width?: number;
  height?: number;
}

const BookmarkCollectionIcon: React.FC<BookmarkCollectionIconProps> = ({
  stroke,
  width = actuatedNormalize(24),
  height = actuatedNormalizeVertical(24),
  ...props
}) => {
  const [theme] = useTheme();
  const iconStroke = stroke ?? theme.iconIconographyGenericState;

  return (
    <Svg width={width} height={height} viewBox="0 0 65 64" fill="none" {...props}>
      <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="65" height="64">
        <Rect x="0.5" width="64" height="64" fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0)">
        <Path
          d="M22.141 42.6667H50.8583C51.269 42.6667 51.6452 42.4958 51.987 42.154C52.3288 41.8122 52.4997 41.436 52.4997 41.0253V12.308C52.4997 11.8973 52.3288 11.5211 51.987 11.1793C51.6452 10.8376 51.269 10.6667 50.8583 10.6667H47.1663V26.9747L41.833 23.7947L36.4997 26.9747V10.6667H22.141C21.7303 10.6667 21.3541 10.8376 21.0123 11.1793C20.6706 11.5211 20.4997 11.8973 20.4997 12.308V41.0253C20.4997 41.436 20.6706 41.8122 21.0123 42.154C21.3541 42.4958 21.7303 42.6667 22.141 42.6667ZM22.141 45.3333C20.9135 45.3333 19.8886 44.9222 19.0663 44.1C18.2441 43.2778 17.833 42.2529 17.833 41.0253V12.308C17.833 11.0804 18.2441 10.0556 19.0663 9.23333C19.8886 8.41111 20.9135 8 22.141 8H50.8583C52.0859 8 53.1108 8.41111 53.933 9.23333C54.7552 10.0556 55.1663 11.0804 55.1663 12.308V41.0253C55.1663 42.2529 54.7552 43.2778 53.933 44.1C53.1108 44.9222 52.0859 45.3333 50.8583 45.3333H22.141ZM14.141 53.3333C12.9135 53.3333 11.8886 52.9222 11.0663 52.1C10.2441 51.2778 9.83301 50.2531 9.83301 49.026V17.6413H12.4997V49.026C12.4997 49.4362 12.6706 49.8122 13.0123 50.154C13.3541 50.4958 13.7303 50.6667 14.141 50.6667H45.525V53.3333H14.141ZM22.141 10.6667H20.4997H52.4997H22.141Z"
          fill={iconStroke}
        />
      </G>
    </Svg>
  );
};

export default BookmarkCollectionIcon;
