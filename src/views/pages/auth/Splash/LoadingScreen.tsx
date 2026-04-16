import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';

const LoadingScreen = () => {
  const [theme] = useTheme();

  return <View style={[styles.container, { backgroundColor: theme.mainBackgroundDefault }]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LoadingScreen;
