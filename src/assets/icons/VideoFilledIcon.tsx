import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface VideoFilledIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const VideoFilledIcon: React.FC<VideoFilledIconProps> = ({
  width = 24,
  height = 25,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" {...props}>
    <Path
      d="M9.5 17L16.5 12.5L9.5 8V17ZM4 20.5C3.45 20.5 2.97917 20.3042 2.5875 19.9125C2.19583 19.5208 2 19.05 2 18.5V6.5C2 5.95 2.19583 5.47917 2.5875 5.0875C2.97917 4.69583 3.45 4.5 4 4.5H20C20.55 4.5 21.0208 4.69583 21.4125 5.0875C21.8042 5.47917 22 5.95 22 6.5V18.5C22 19.05 21.8042 19.5208 21.4125 19.9125C21.0208 20.3042 20.55 20.5 20 20.5H4Z"
      fill={color}
    />
  </Svg>
);

export default VideoFilledIcon;
