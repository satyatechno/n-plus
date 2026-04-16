import { StyleSheet } from 'react-native';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, radius } from '@src/config/styleConsts';

export const skeletonStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: actuatedNormalizeVertical(spacing['4xl']),
    paddingHorizontal: actuatedNormalize(spacing.xs)
  },
  headerTitle: {
    alignSelf: 'center',
    borderRadius: radius.m
  },
  headerIcon: {
    borderRadius: radius.xs
  },
  dividerBottom: {
    marginBottom: actuatedNormalizeVertical(spacing.m),
    marginTop: actuatedNormalizeVertical(spacing.xs)
  },
  headingSection: {
    marginBottom: actuatedNormalizeVertical(spacing.s),
    marginLeft: actuatedNormalize(spacing.xs)
  },
  headingText: {
    marginBottom: actuatedNormalizeVertical(spacing.xs),
    borderRadius: radius.m
  },
  subHeadingText: {
    borderRadius: radius.m
  },
  optionContainer: {
    marginHorizontal: actuatedNormalize(spacing.xs)
  },
  optionItem: {
    marginBottom: actuatedNormalizeVertical(spacing.l)
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionIcon: {
    marginRight: actuatedNormalize(spacing.xs),
    borderRadius: radius.xs
  },
  optionLabel: {
    borderRadius: radius.m
  },
  secondaryOptionLabel: {
    borderRadius: radius.m
  },
  optionArrow: {
    marginLeft: 'auto',
    borderRadius: radius.xxs
  },
  optionDivider: {
    marginVertical: actuatedNormalizeVertical(spacing.s)
  },
  followUsTitle: {
    marginBottom: actuatedNormalizeVertical(spacing.s),
    borderRadius: radius.m
  },
  socialIconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: actuatedNormalizeVertical(spacing.m)
  },
  socialIcon: {
    marginRight: actuatedNormalize(27),
    borderRadius: radius.xs
  },
  dividerBottomLarge: {
    marginBottom: actuatedNormalizeVertical(spacing.xl)
  },
  logoutButton: {
    borderRadius: radius.l,
    marginTop: actuatedNormalizeVertical(spacing.xxs)
  },
  versionTextWrapper: {
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(spacing.m)
  },
  versionText: {}
});
