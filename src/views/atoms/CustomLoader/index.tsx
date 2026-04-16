import React from 'react';
import { ActivityIndicator, StyleSheet, View, ActivityIndicatorProps } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';

interface CustomLoaderProps {
  backgroundColor?: string;
  size?: ActivityIndicatorProps['size'];
}

const CustomLoader = ({ backgroundColor, size = 'large' }: CustomLoaderProps) => {
  const [theme] = useTheme();
  return (
    <View
      style={[styles.loadingContainer, { backgroundColor: backgroundColor ?? 'rgba(0,0,0,0.3)' }]}
    >
      <ActivityIndicator size={size} color={theme.bodyTextMain} />
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});
