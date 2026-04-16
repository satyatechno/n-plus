import React from 'react';
import { Animated, ViewStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/organisms/IntroScreen/styles';

interface Props {
  translateX: Animated.Value | Animated.AnimatedInterpolation<number>;
  text: string;
}

/**
 * AnimatedTextSlide is a React functional component that renders an animated
 * text slide for the intro screens of the application.
 *
 * The component takes two props:
 *
 * - `translateX`: an Animated.Value or Animated.AnimatedInterpolation<number>
 *   that determines the horizontal position of the text slide.
 * - `text`: the content of the text slide to be displayed.
 *
 * The component returns an Animated.View with the specified transform style,
 * containing a CustomText component with the specified text content.
 */

const AnimatedTextSlide = ({ translateX, text }: Props) => {
  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ translateX }]
  };
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <Animated.View style={animatedStyle}>
      <CustomText
        size={fontSize['13xl']}
        weight="M"
        fontFamily={fonts.mongoose}
        textStyles={[styles.textStyles, { includeFontPadding: false }]}
      >
        {text}
      </CustomText>
    </Animated.View>
  );
};

export default AnimatedTextSlide;
