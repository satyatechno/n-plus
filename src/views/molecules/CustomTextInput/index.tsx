import React, { useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  TextStyle,
  View,
  StyleProp,
  TextInputProps,
  Pressable,
  ViewStyle,
  Keyboard,
  AppState,
  AppStateStatus
} from 'react-native';

import { useFormContext, useController, UseControllerProps } from 'react-hook-form';

import CustomText from '@src/views/atoms/CustomText';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';

export interface CustomTextInputProps {
  label: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onPress?: () => void;
  editable?: boolean;
  labelTextColor?: string;
  labelTextSize?: number;
  labelTextWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  labelTextStyles?: TextStyle;
  errorTextColor?: string;
  errorTextSize?: number;
  errorTextWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  errorTextStyles?: TextStyle;
  rightIconStyle?: StyleProp<TextStyle>;
  textInputStyles?: StyleProp<TextStyle>;
  labelTextFontFamily?: string;
  errorTextFontFamily?: string;
  showError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * CustomTextInput is a reusable input component that integrates with React Hook Form
 * and provides customizable label, error message, and right icon support.
 *
 * @param {string} label - The label text displayed above the text input.
 * @param {React.ReactNode} [rightIcon] - An optional icon displayed on the right of the text input.
 * @param {() => void} [onRightIconPress] - A callback function triggered when the right icon is pressed.
 * @param {string} [labelTextColor] - The color of the label text.
 * @param {number} [labelTextSize=fontSize['s']] - The font size of the label text.
 * @param {'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med'} [labelTextWeight='R'] - The font weight of the label text.
 * @param {TextStyle} [labelTextStyles={}] - Additional styles for the label text.
 * @param {string} [errorTextColor] - The color of the error text.
 * @param {number} [errorTextSize=fontSize['xxs']] - The font size of the error text.
 * @param {'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med'} [errorTextWeight='R'] - The font weight of the error text.
 * @param {TextStyle} [errorTextStyles={}] - Additional styles for the error text.
 * @param {StyleProp<TextStyle>} [textInputStyles={}] - Additional styles for the text input.
 * @param {string} [labelTextFontFamily=fonts.notoSerif] - The font family for the label text.
 * @param {string} [errorTextFontFamily=fonts.notoSerif] - The font family for the error text.
 * @param {StyleProp<ViewStyle>} [containerStyle={}] - Additional styles for the outer container of the input.
 * @param {object} props - Additional props passed to the TextInput component.
 *
 * @returns A styled text input component with optional label, error message, and right icon.
 */

const CustomTextInput = ({
  label,
  rightIcon,
  onRightIconPress,
  onPress,
  editable = true,
  labelTextColor,
  labelTextSize = fontSize['s'],
  labelTextWeight = 'Med',
  labelTextStyles = {},
  errorTextColor,
  errorTextSize = fontSize['xxs'],
  errorTextWeight = 'Boo',
  errorTextStyles = {},
  textInputStyles = {},
  rightIconStyle = {},
  labelTextFontFamily = fonts.franklinGothicURW,
  errorTextFontFamily = fonts.franklinGothicURW,
  showError = true,
  containerStyle = {},
  ...props
}: CustomTextInputProps & TextInputProps & UseControllerProps) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const formContext = useFormContext();
  const { formState } = formContext;

  const { name, rules, defaultValue } = props;
  const { field } = useController({ name, rules, defaultValue });
  const hasError = Boolean(formState?.errors[name]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        Keyboard.dismiss();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {label && (
        <CustomText
          weight={labelTextWeight}
          fontFamily={labelTextFontFamily}
          size={labelTextSize}
          color={labelTextColor ?? theme.subtitleTextSubtitle}
          textStyles={StyleSheet.flatten([styles.labelText, labelTextStyles])}
        >
          {label}
        </CustomText>
      )}
      <Pressable onPress={onPress}>
        <TextInput
          style={StyleSheet.flatten([
            styles.textInput,
            field.value && styles.textInput18Size,
            hasError && styles.errorBorder,
            textInputStyles
          ])}
          placeholderTextColor={theme.labelsTextLabelPlace}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          editable={editable}
          onPress={onPress}
          {...props}
        />
        {rightIcon && (
          <Pressable
            style={StyleSheet.flatten([styles.rightIcon, rightIconStyle])}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </Pressable>
        )}
      </Pressable>
      {hasError && showError !== false && (
        <CustomText
          weight={errorTextWeight}
          fontFamily={errorTextFontFamily}
          size={errorTextSize}
          color={errorTextColor ?? theme.actionCTAToastError}
          textStyles={StyleSheet.flatten([styles.errorText, errorTextStyles])}
        >
          {typeof formState.errors[name]?.message === 'string'
            ? formState.errors[name].message
            : ''}
        </CustomText>
      )}
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%'
    },
    textInput: {
      height: actuatedNormalizeVertical(52),
      width: '100%',
      borderRadius: radius['m'],
      borderWidth: borderWidth['m'],
      borderColor: theme.inputFillForegroundInteractiveFilled,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['s']),
      fontSize: actuatedNormalizeVertical(fontSize['s']),
      color: theme.sectionTextTitleSpecial,
      fontFamily: `${fonts.franklinGothicURW}-Boo`
    },
    textInput18Size: {
      fontSize: actuatedNormalizeVertical(fontSize['m'])
    },
    errorBorder: {
      borderColor: theme.actionCTAToastError
    },
    rightIcon: {
      position: 'absolute',
      right: actuatedNormalize(spacing['s']),
      top: actuatedNormalizeVertical(spacing['s'])
    },
    labelText: {
      marginBottom: actuatedNormalizeVertical(spacing['xs'])
    },
    errorText: {
      marginTop: actuatedNormalizeVertical(spacing['xxs'])
    }
  });

export default CustomTextInput;
