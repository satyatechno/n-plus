import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface QuotesProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const Quotes: React.FC<QuotesProps> = ({ width = 61, height = 43, color = '#7E7E81', style }) => (
  <View style={style}>
    <Svg width={width} height={height} viewBox="0 0 61 43" fill="none">
      <Path
        d="M28.6465 14.7896L2.41787 14.7896C2.46399 11.196 7.88742 8.29311 14.5733 8.29311L14.5733 0.789551C6.80223 0.78955 0.500003 7.05659 0.500002 14.7871L0.5 42.7896H28.6465L28.6465 14.7896ZM60.5 42.7896L32.3535 42.7896L32.3535 14.7871C32.3535 7.0566 38.6558 0.789553 46.4266 0.789554V8.29311C39.7409 8.29311 34.3175 11.196 34.2714 14.7896L60.5 14.7896L60.5 42.7896Z"
        fill={color}
      />
    </Svg>
  </View>
);

export default Quotes;
