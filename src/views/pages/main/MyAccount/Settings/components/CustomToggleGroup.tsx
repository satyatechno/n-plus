import React, { Fragment } from 'react';
import { View, StyleSheet, DimensionValue, Pressable } from 'react-native';

import { t } from 'i18next';

import CustomText from '@src/views/atoms/CustomText';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, fontSize, radius, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type CustomToggleGroupProps<T extends string | number> = {
  options: Option<T>[];
  selected: T;
  onChange: (val: T) => void;
  variant?: 'default' | 'textSize';
  dividerHeight?: DimensionValue;
  disabled?: boolean;
};

const TEXT_SIZE_FONT_MAP: Record<string, number> = {
  Chica: fontSize.xxs,
  Mediana: fontSize.xs,
  Grande: fontSize.s
};

/**
 * CustomToggleGroup is a component that displays a group of toggle options.
 * It allows selecting one option from the provided list and can be customized
 * with different styles and behaviors.
 *
 * @template T - The type for the value of the options, either string or number.
 *
 * @param {Option<T>[]} options - An array of options to be displayed in the toggle group.
 * @param {T} selected - The currently selected value among the options.
 * @param {(val: T) => void} onChange - Callback function invoked when an option is selected.
 * @param {'default' | 'textSize'} [variant='default'] - The appearance variant of the toggle group.
 * @param {DimensionValue} [dividerHeight] - The height of the divider between options, if applicable.
 * @param {boolean} [disabled=false] - If true, the toggle group is disabled and non-interactive.
 *
 * @returns {JSX.Element} The rendered toggle group component.
 */

const CustomToggleGroup = <T extends string | number>({
  options,
  selected,
  onChange,
  variant = 'default',
  dividerHeight,
  disabled = false
}: CustomToggleGroupProps<T>) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const isTextSize = variant === 'textSize';

  return (
    <View style={styles.wrapper}>
      <View style={isTextSize ? styles.textSizeContainer : styles.defaultContainer}>
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          const isLast = index === options.length - 1;

          return (
            <Fragment key={option.value}>
              <Pressable
                disabled={disabled}
                style={({ pressed }) =>
                  StyleSheet.flatten([
                    isTextSize ? styles.textSizeOption : styles.defaultOption,
                    isSelected && styles.selectedOption,
                    disabled && styles.disabledVisual,
                    pressed && !disabled ? styles.pressed : styles.notPressed
                  ])
                }
                onPress={() => {
                  if (!disabled) onChange(option.value);
                }}
              >
                <View style={styles.contentContainer}>
                  {isTextSize && (
                    <CustomText
                      size={TEXT_SIZE_FONT_MAP[option.value as string] ?? fontSize.xs}
                      textStyles={[
                        isSelected ? styles.previewSelectedText : styles.previewText,
                        ...(disabled ? [styles.disabledText] : [])
                      ]}
                    >
                      {t('screens.settings.text.abc')}
                    </CustomText>
                  )}

                  <CustomText
                    textStyles={[
                      isSelected ? styles.previewSelectedSubText : styles.previewSubText,
                      ...(disabled ? [styles.disabledText] : []),
                      styles.centeredText
                    ]}
                    size={fontSize.xxs}
                    weight={isSelected ? 'Dem' : 'Boo'}
                    fontFamily={fonts.franklinGothicURW}
                    allowFontScaling={false}
                  >
                    {option.label}
                  </CustomText>
                </View>
              </Pressable>

              {!isTextSize &&
                !isLast &&
                !(selected === option.value || selected === options[index + 1]?.value) && (
                  <View
                    style={StyleSheet.flatten([styles.verticalDivider, { height: dividerHeight }])}
                  />
                )}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default CustomToggleGroup;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      marginTop: actuatedNormalizeVertical(spacing['l']),
      marginBottom: actuatedNormalizeVertical(spacing['s'])
    },
    defaultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: actuatedNormalizeVertical(40),
      borderWidth: borderWidth['s'],
      borderColor: theme.dividerPrimary,
      borderRadius: radius['m'],
      overflow: 'hidden'
    },
    textSizeContainer: {
      flexDirection: 'row',
      width: '100%',
      borderRadius: radius['m'],
      height: actuatedNormalizeVertical(66)
    },
    defaultOption: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '110%'
    },
    textSizeOption: {
      flex: 1,
      paddingVertical: actuatedNormalizeVertical(spacing['xs']),
      paddingHorizontal: actuatedNormalize(spacing['xs']),
      borderWidth: borderWidth['s'],
      borderColor: theme.dividerPrimary,
      borderRadius: radius['m'],
      marginHorizontal: actuatedNormalize(spacing['xxxs']),
      justifyContent: 'center'
    },
    selectedOption: {
      backgroundColor: theme.iconIconographyDisabledState2
    },
    contentContainer: {
      alignItems: 'center'
    },
    previewText: {
      color: theme.sectionTextTitleNormal,
      bottom: isIos ? actuatedNormalizeVertical(0) : actuatedNormalizeVertical(-1)
    },
    previewSubText: {
      color: theme.onBoardingTextLabel,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    previewSelectedText: {
      color: theme.inputOutlineInteractiveDefault,
      bottom: isIos ? actuatedNormalizeVertical(0) : actuatedNormalizeVertical(-1)
    },
    previewSelectedSubText: {
      color: theme.inputOutlineInteractiveDefault,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    verticalDivider: {
      width: borderWidth['s'],
      height: '50%',
      alignSelf: 'center',
      backgroundColor: theme.dividerPrimary
    },
    disabledOption: {
      opacity: 0.5
    },
    disabledVisual: {
      borderColor: theme.trackDisabled,
      backgroundColor: theme.mainBackgroundSecondary
    },
    disabledText: {
      color: theme.greyButtonHover
    },
    pressed: {
      opacity: 0.7
    },
    notPressed: {
      opacity: 1
    },
    centeredText: { textAlign: 'center' }
  });
