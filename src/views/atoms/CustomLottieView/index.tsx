import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import LottieView, { AnimationObject } from 'lottie-react-native';

interface LottieProp {
  source: string | AnimationObject | { uri: string };
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  lottieStyle?: StyleProp<ViewStyle> | undefined;
}

const CustomLottieView = (props: LottieProp) => {
  const { source, contentContainerStyle, lottieStyle } = props;
  const styles = themeStyles();

  return (
    <View style={[styles.container, contentContainerStyle]}>
      <LottieView source={source} style={[styles.lottie, lottieStyle]} autoPlay loop />
    </View>
  );
};

export default CustomLottieView;

const themeStyles = () =>
  StyleSheet.create({
    container: {
      height: 18,
      width: 18
    },
    lottie: {
      flex: 1
    }
  });
