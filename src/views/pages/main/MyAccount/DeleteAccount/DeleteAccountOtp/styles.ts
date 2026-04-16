import { StyleSheet } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize } from '@src/utils/pixelScaling';

export const themeStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: actuatedNormalize(spacing.xs)
    }
  });
