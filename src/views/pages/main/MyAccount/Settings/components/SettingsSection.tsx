import React, { ReactNode } from 'react';
import { View, StyleSheet, TextStyle, Pressable } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  labelAction?: string;
  showSeparator?: boolean;
  onLabelPress?: () => void;
  disabled?: boolean;
  titleFontSize?: number;
  titleFontFamily?: string;
  titleFontWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  subtitleFontSize?: number;
  subtitleFontFamily?: string;
  subtitleFontWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  subtitleTextStyle?: TextStyle;
}

const SettingsSection: React.FC<Props> = ({
  title,
  subtitle,
  children,
  labelAction,
  showSeparator,
  onLabelPress,
  disabled = false,
  titleFontSize,
  titleFontFamily,
  titleFontWeight,
  subtitleFontSize,
  subtitleFontFamily,
  subtitleFontWeight,
  subtitleTextStyle
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={[styles.container, disabled && styles.disabledVisual]}>
      <View style={styles.headerRow}>
        <CustomText
          size={titleFontSize ?? fontSize['l']}
          fontFamily={titleFontFamily ?? fonts.notoSerifExtraCondensed}
          weight={titleFontWeight}
          textStyles={[styles.textStyles, ...(disabled ? [styles.disabledText] : [])]}
        >
          {title}
        </CustomText>

        {labelAction ? (
          <Pressable style={styles.labelContainer} onPress={onLabelPress} disabled={disabled}>
            {({ pressed }) => (
              <CustomText
                size={fontSize.xs}
                fontFamily={fonts.franklinGothicURW}
                weight="Dem"
                color={pressed ? theme.accentSecondaryPressed : theme.tagsTextBreakingNews}
                textStyles={[styles.label, ...(disabled ? [styles.disabledText] : [])]}
              >
                {labelAction}
              </CustomText>
            )}
          </Pressable>
        ) : null}
      </View>

      {showSeparator && <View style={styles.separator} />}

      {subtitle && (
        <CustomText
          size={subtitleFontSize ?? fontSize.xxs}
          fontFamily={subtitleFontFamily ?? fonts.franklinGothicURW}
          weight={subtitleFontWeight ?? 'Boo'}
          textStyles={StyleSheet.flatten([
            styles.subTextStyles,
            ...(disabled ? [styles.disabledText] : []),
            ...(subtitleTextStyle ? [subtitleTextStyle] : [])
          ])}
        >
          {subtitle}
        </CustomText>
      )}

      <View style={disabled && styles.disabledChildren} pointerEvents={disabled ? 'none' : 'auto'}>
        {children}
      </View>
    </View>
  );
};

export default SettingsSection;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: actuatedNormalize(spacing['xs']),
      marginTop: actuatedNormalizeVertical(spacing['s'])
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    labelContainer: {
      justifyContent: 'center'
    },
    textStyles: {
      color: theme.sectionTextTitleNormal,
      letterSpacing: letterSpacing['s']
    },
    subTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      color: theme.onBoardingTextLabel,
      top: actuatedNormalizeVertical(spacing['xxxs']),
      width: '95%'
    },
    label: {
      lineHeight: actuatedNormalizeVertical(lineHeight['s'])
    },
    separator: {
      borderBottomWidth: borderWidth['m'],
      borderBottomColor: theme.dividerPrimary,
      marginVertical: actuatedNormalizeVertical(spacing['xxxs'])
    },
    disabledVisual: {
      borderColor: theme.trackDisabled,
      backgroundColor: theme.mainBackgroundSecondary
    },
    disabledText: {
      color: theme.greyButtonHover
    },
    disabledChildren: {
      opacity: 0.5
    }
  });
