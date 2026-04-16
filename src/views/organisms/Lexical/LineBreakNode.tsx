import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';

import type { SimpleNodeProps } from '@src/views/organisms/Lexical/types';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

/**
 * Renders a soft line break (<br />).
 * Uses a space character instead of a newline to avoid excessive spacing.
 */

const LineBreakNode = ({ style }: SimpleNodeProps) => (
  <Text style={[styles.break, style]}>{'\n'}</Text>
);

export default memo(LineBreakNode);

/* ------------------------------------------------------------------ *
 *  Styles                                                             *
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  break: {
    fontSize: actuatedNormalize(2),
    lineHeight: actuatedNormalizeVertical(2)
  }
});
