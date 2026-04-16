import React, { memo, useEffect, useRef } from 'react';
import { Animated, DimensionValue, Easing, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { radius } from '@src/config/styleConsts';

interface Props {
  height: DimensionValue;
  width: DimensionValue;
  style?: ViewStyle;
  backgroundColor?: string;
}

const SkeletonLoader = ({ height, width, style, backgroundColor }: Props) => {
  const [theme] = useTheme();
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          width,
          backgroundColor: backgroundColor ?? theme.skeletonLoaderBackground,
          opacity
        },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xs,
    overflow: 'hidden'
  }
});

export default memo(SkeletonLoader);
