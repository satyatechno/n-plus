import * as React from 'react';

import Svg, { Path, SvgProps } from 'react-native-svg';

interface YoutubeIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const YoutubeIcon: React.FC<YoutubeIconProps> = ({
  width = 21,
  height = 14,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 21 14" fill="none" {...props}>
    <Path
      d="M20.4869 4.46248C20.4869 2.1039 18.5408 0.192749 16.1391 0.192749H5.02871C2.62699 0.192749 0.680878 2.1039 0.680878 4.46248V9.53759C0.680878 11.8962 2.62699 13.8073 5.02871 13.8073H16.1391C18.5408 13.8073 20.4869 11.8962 20.4869 9.53759V4.46248ZM13.9522 7.38354L8.973 9.80604C8.77774 9.90831 8.11384 9.76769 8.11384 9.55037V4.58393C8.11384 4.36021 8.78425 4.22599 8.97952 4.33465L13.7504 6.88498C13.9522 6.99364 14.1605 7.28128 13.9587 7.38994L13.9522 7.38354Z"
      fill={color}
    />
  </Svg>
);

export default YoutubeIcon;
