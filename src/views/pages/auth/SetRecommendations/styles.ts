import { StyleSheet } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const styles = StyleSheet.create({
  modalSubtitle: {
    top: 0
  },
  modalTitleStyle: {
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  }
});
