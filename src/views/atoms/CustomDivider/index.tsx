import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { borderWidth } from '@src/config/styleConsts';

interface DividerProps {
  style?: ViewStyle;
}

/**
 * A simple divider component.
 *
 * @param {ViewStyle} style - The divider style to override the default.
 *
 * @returns {React.ReactElement} A simple divider component.
 */

const CustomDivider = ({ style }: DividerProps) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return <View style={StyleSheet.flatten([styles.divider, style])} />;
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    divider: {
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerGrey
    }
  });

export default CustomDivider;
