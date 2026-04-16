import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface AccountIconFilledProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const AccountIconFilled: React.FC<AccountIconFilledProps> = ({
  width = 25,
  height = 25,
  color = '#2C2E33',
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.5 12.036C11.675 12.036 10.9688 11.7423 10.3812 11.1548C9.79375 10.5673 9.5 9.86101 9.5 9.03601C9.5 8.21101 9.79375 7.50476 10.3812 6.91726C10.9688 6.32976 11.675 6.03601 12.5 6.03601C13.325 6.03601 14.0313 6.32976 14.6188 6.91726C15.2063 7.50476 15.5 8.21101 15.5 9.03601C15.5 9.86101 15.2063 10.5673 14.6188 11.1548C14.0313 11.7423 13.325 12.036 12.5 12.036ZM5.5 19.267V17.6208C5.5 17.2079 5.62017 16.8217 5.8605 16.462C6.101 16.1025 6.42442 15.8233 6.83075 15.6245C7.77442 15.172 8.71867 14.8326 9.6635 14.6063C10.6083 14.3801 11.5538 14.267 12.5 14.267C13.4462 14.267 14.3917 14.3801 15.3365 14.6063C16.2813 14.8326 17.2256 15.172 18.1693 15.6245C18.5756 15.8233 18.899 16.1025 19.1395 16.462C19.3798 16.8217 19.5 17.2079 19.5 17.6208V19.267H5.5Z"
      fill={color}
    />
  </Svg>
);

export default AccountIconFilled;
