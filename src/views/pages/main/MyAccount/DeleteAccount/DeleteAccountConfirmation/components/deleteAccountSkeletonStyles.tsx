import { StyleSheet } from 'react-native';

import { spacing, radius } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const skeletonStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: actuatedNormalizeVertical(spacing.m),
    marginHorizontal: actuatedNormalize(spacing.xs)
  },
  headerIcon: {
    marginRight: actuatedNormalize(spacing.l)
  },
  headerTitle: {
    borderRadius: radius.l
  },
  accountEmail: {
    marginBottom: actuatedNormalizeVertical(spacing.xxs)
  },
  descriptionItem: {
    borderRadius: radius.l,
    marginBottom: actuatedNormalizeVertical(spacing.l)
  },
  reasonTitle: {
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reasonIcon: {
    marginBottom: actuatedNormalizeVertical(spacing.xl),
    marginRight: actuatedNormalize(spacing.xs)
  },
  reasonLabel: {
    borderRadius: radius.l,
    marginBottom: actuatedNormalizeVertical(spacing.xl)
  },
  largeTextArea: {
    borderRadius: radius.l,
    marginTop: actuatedNormalizeVertical(spacing.xl)
  },
  confirmationText: {
    borderRadius: radius.l
  },
  confirmationButton: {
    borderRadius: radius.l,
    marginTop: actuatedNormalizeVertical(spacing.xl)
  }
});
