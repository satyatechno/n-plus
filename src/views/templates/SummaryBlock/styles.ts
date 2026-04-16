import { Platform, StyleSheet } from 'react-native';

import { letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { colors } from '@src/themes/colors';
import { fonts } from '@src/config/fonts';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    summaryContainer: {
      backgroundColor: colors.gainsBoro,
      borderColor: theme.dividerGrey,
      paddingHorizontal: spacing.s,
      marginTop: spacing.s,
      borderRadius: radius.xxs
    },
    summarheading: {
      letterSpacing: letterSpacing.xxxs,
      marginTop: spacing.xs,
      lineHeight: lineHeight['5xl'],
      fontStyle: 'italic',
      ...(Platform.OS === 'android' && {
        fontFamily: `${fonts.notoSerifExtraCondensed}-Italic`,
        fontStyle: 'normal'
      })
    },
    summarySubHeading: {
      lineHeight: lineHeight.m,
      marginTop: spacing.xxxxs,
      marginBottom: spacing.s
    }
  });
