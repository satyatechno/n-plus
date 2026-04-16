import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle
} from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, radius } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import useThemeStore from '@src/zustand/auth/themeStore';
import { colors } from '@src/themes/colors';

interface Props {
  onPress?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'text' | 'link' | 'outlined';
  disabled?: boolean;
  isLoading?: boolean;
  buttonText: string;
  underlineColor?: string;
  buttonStyles?: ViewStyle | ViewStyle[];
  buttonTextColor?: string;
  buttonTextSize?: number;
  buttonTextWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  buttonTextStyles?: TextStyle | TextStyle[];
  buttonTextFontFamily?: string;
  disabledButtonStyle?: ViewStyle | ViewStyle[];
  outlinedBorderColor?: string;
  getTextColor?: (pressed: boolean) => string | undefined;
}

/**
 * A customizable button component that renders either a filled, outlined, or text-only button based on the variant prop.
 *
 * The component takes the following props:
 * - onPress: a required function to be called when the button is pressed
 * - variant: an optional string that determines the button style. Defaults to 'primary'.
 * - disabled: an optional boolean that determines whether the button is disabled. Defaults to false.
 * - isLoading: an optional boolean that determines whether the button is in a loading state. Defaults to false.
 * - buttonText: a required string that sets the button text.
 * - buttonStyles: an optional object or array of objects that sets the button styles.
 * - buttonTextColor: an optional string that sets the button text color. Defaults to theme.primaryCTATextDefault.
 * - buttonTextSize: an optional number that sets the button text size. Defaults to fontSize['s'].
 * - buttonTextWeight: an optional string that sets the button text weight. Defaults to 'Dem'.
 * - buttonTextFontFamily: an optional string that sets the button text font family. Defaults to fonts.franklinGothicURW.
 * - buttonTextStyles: an optional object or array of objects that sets the button text styles.
 *
 * The component renders a Pressable component with the specified button styles and text properties.
 *
 * If the variant is 'link', the component renders a link button with a single underline on all characters except 'y'.
 * If the variant is 'outlined', the component renders an outlined button with a border.
 * If the variant is 'text', the component renders a text-only button with no background or border.
 * If the variant is 'primary', the component renders a filled button with a background color.
 *
 * The component also renders an ActivityIndicator if the isLoading prop is true.
 *
 * @param {object} props - The properties passed to the component.
 * @param {function} props.onPress - A required function to be called when the button is pressed.
 * @param {string} [props.variant='primary'] - An optional string that determines the button style. Defaults to 'primary'.
 * @param {boolean} [props.disabled=false] - An optional boolean that determines whether the button is disabled. Defaults to false.
 * @param {boolean} [props.isLoading=false] - An optional boolean that determines whether the button is in a loading state. Defaults to false.
 * @param {string} props.buttonText - A required string that sets the button text.
 * @param {object|object[]} [props.buttonStyles={}] - An optional object or array of objects that sets the button styles.
 * @param {string} [props.buttonTextColor=theme.primaryCTATextDefault] - An optional string that sets the button text color. Defaults to theme.primaryCTATextDefault.
 * @param {number} [props.buttonTextSize=fontSize['s']] - An optional number that sets the button text size. Defaults to fontSize['s'].
 * @param {string} [props.buttonTextWeight='Dem'] - An optional string that sets the button text weight. Defaults to 'Dem'.
 * @param {string} [props.buttonTextFontFamily=fonts.franklinGothicURW] - An optional string that sets the button text font family. Defaults to fonts.franklinGothicURW.
 * @param {object|object[]} [props.buttonTextStyles={}] - An optional object or array of objects that sets the button text styles.
 *
 * @returns {JSX.Element} A button component with the specified properties.
 */

const CustomButton = ({
  onPress,
  variant = 'primary',
  disabled,
  isLoading,
  buttonText,
  buttonStyles = {},
  buttonTextColor,
  buttonTextSize = fontSize['s'],
  buttonTextWeight = 'Dem',
  buttonTextFontFamily = fonts.franklinGothicURW,
  disabledButtonStyle,
  underlineColor,
  buttonTextStyles = {},
  outlinedBorderColor,
  getTextColor,
  ...props
}: Props & Omit<PressableProps, 'onPress'>) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const darkMode = useThemeStore();
  const colorScheme = useColorScheme();

  return (
    <Pressable
      style={({ pressed }) => [
        variant === 'primary' && styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'text' && styles.linkButton,
        variant === 'link' && styles.linkButton,
        variant === 'outlined' && [
          styles.outlinedButton,
          { borderColor: outlinedBorderColor ?? theme.outlinedButtonPrimaryOutline },
          (darkMode.theme === 'dark' ||
            (darkMode.theme === 'system' && colorScheme === 'dark')) && {
            borderColor: outlinedBorderColor ?? colors.white
          }
        ],
        buttonStyles,
        disabled && (disabledButtonStyle ?? styles.disabledButton),
        pressed &&
          !disabled &&
          !isLoading &&
          (variant === 'primary'
            ? { backgroundColor: theme.filledButtonPressed }
            : variant === 'secondary'
              ? { backgroundColor: theme.filledButtonPressed }
              : variant === 'outlined'
                ? {
                    backgroundColor: theme.buttonFilledSecondaryOutline,
                    borderColor: 'transparent'
                  }
                : null),
        pressed &&
          !disabled &&
          !isLoading && {
            transform: [{ scale: 0.98 }]
          }
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...props}
    >
      {({ pressed }) =>
        isLoading ? (
          <ActivityIndicator
            color={
              disabled
                ? theme.iconIconographyDisabledState1
                : (buttonTextColor ?? theme.primaryCTATextDefault)
            }
          />
        ) : variant === 'link' ? (
          <CustomText
            weight={buttonTextWeight}
            fontFamily={buttonTextFontFamily}
            size={buttonTextSize}
            color={
              pressed
                ? (getTextColor?.(pressed) ?? underlineColor ?? theme.bodyTextHyperlinked)
                : (underlineColor ?? theme.bodyTextHyperlinked)
            }
            textStyles={styles.linkText}
          >
            {buttonText.split('').map((char, index) => {
              const isCharY = char === 'y';
              return (
                <CustomText
                  key={index}
                  size={buttonTextSize}
                  weight={buttonTextWeight}
                  fontFamily={buttonTextFontFamily}
                  color={
                    pressed
                      ? (getTextColor?.(pressed) ?? underlineColor ?? theme.bodyTextHyperlinked)
                      : (underlineColor ?? theme.bodyTextHyperlinked)
                  }
                  textStyles={{
                    textDecorationLine: isCharY ? 'none' : 'underline'
                  }}
                >
                  {char}
                </CustomText>
              );
            })}
          </CustomText>
        ) : (
          <CustomText
            weight={buttonTextWeight}
            fontFamily={buttonTextFontFamily}
            size={buttonTextSize}
            color={
              disabled
                ? theme.iconIconographyDisabledState1
                : (getTextColor?.(pressed) ??
                  (variant === 'outlined' &&
                  (darkMode.theme === 'dark' ||
                    (darkMode.theme === 'system' && colorScheme === 'dark'))
                    ? colors.white
                    : (buttonTextColor ?? theme.primaryCTATextDefault)))
            }
            textStyles={
              getTextColor
                ? (() => {
                    const textColor = getTextColor(pressed);
                    return textColor
                      ? [
                          ...(Array.isArray(buttonTextStyles)
                            ? buttonTextStyles
                            : [buttonTextStyles]),
                          { color: textColor }
                        ]
                      : buttonTextStyles;
                  })()
                : buttonTextStyles
            }
          >
            {buttonText}
          </CustomText>
        )
      }
    </Pressable>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      height: actuatedNormalizeVertical(52),
      width: '100%',
      backgroundColor: theme.filledButtonPrimary,
      borderRadius: radius['m'],
      justifyContent: 'center',
      alignItems: 'center'
    },
    secondaryButton: {
      height: actuatedNormalizeVertical(52),
      width: '100%',
      borderRadius: radius['m'],
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: borderWidth['m'],
      borderColor: theme.onBoardingTextErrorHelperText
    },
    disabledButton: {
      backgroundColor: theme.greyButtonDisabled
    },
    linkButton: {
      height: actuatedNormalizeVertical(19)
    },
    linkText: {
      color: theme.bodyTextHyperlinked,
      top: actuatedNormalizeVertical(3)
    },
    underline: {
      textDecorationLine: 'underline',
      color: theme.bodyTextHyperlinked
    },
    noUnderline: {
      textDecorationLine: 'none',
      color: theme.bodyTextHyperlinked
    },
    outlinedButton: {
      borderWidth: borderWidth['m'],
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius['m'],
      height: actuatedNormalizeVertical(52),
      borderColor: theme.outlinedButtonPrimaryOutline,
      width: '100%'
    }
  });

export default CustomButton;
