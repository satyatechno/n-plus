import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface BellIconProps extends Omit<SvgProps, 'width' | 'height'> {
  width?: number;
  height?: number;
  color?: string;
}

const BellIcon: React.FC<BellIconProps> = ({
  width = 24,
  height = 24,
  color = '#2C2E33',
  ...props
}) => (
  <Svg {...props} width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 18.7693V17.7693H6.6155V9.84625C6.6155 8.53975 7.02892 7.39067 7.85575 6.399C8.68275 5.40733 9.73083 4.78975 11 4.54625V4C11 3.72217 11.097 3.48608 11.291 3.29175C11.485 3.09725 11.7206 3 11.9978 3C12.2749 3 12.5113 3.09725 12.7067 3.29175C12.9022 3.48608 13 3.72217 13 4V4.54625C14.2692 4.78975 15.3173 5.40733 16.1443 6.399C16.9711 7.39067 17.3845 8.53975 17.3845 9.84625V17.7693H19V18.7693H5ZM11.9965 21.3845C11.5513 21.3845 11.1714 21.2263 10.8568 20.91C10.5419 20.5937 10.3845 20.2134 10.3845 19.7693H13.6155C13.6155 20.2168 13.4569 20.5978 13.1398 20.9125C12.8228 21.2272 12.4417 21.3845 11.9965 21.3845Z"
      fill={color}
    />
  </Svg>
);

export default BellIcon;
