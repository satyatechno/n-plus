import React from 'react';
import { Pressable, StyleSheet, TextStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { ArrowIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';

interface Props {
  text: string;
  onPress: () => void;
  color?: string;
  buttonStyle?: TextStyle;
  textStyle?: TextStyle;
  hitSlop?: number;
}

/**
 * Reusable SeeAllButton component with ArrowIcon
 * Shows adaptiveDangerSecondary color when pressed
 */
const SeeAllButton: React.FC<Props> = ({
  text,
  onPress,
  color,
  buttonStyle,
  textStyle,
  hitSlop = 10
}) => {
  const [theme] = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [styles.container, buttonStyle, pressed && styles.pressed]}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      {({ pressed }) => (
        <>
          <CustomText
            weight={'Dem'}
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.xs}
            color={
              pressed ? theme.adaptiveDangerSecondary : (color ?? theme.greyButtonSecondaryOutline)
            }
            textStyles={textStyle}
          >
            {text}
          </CustomText>
          <ArrowIcon
            stroke={
              pressed ? theme.adaptiveDangerSecondary : (color ?? theme.greyButtonSecondaryOutline)
            }
          />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  pressed: {
    opacity: 0.8
  }
});

export default SeeAllButton;
