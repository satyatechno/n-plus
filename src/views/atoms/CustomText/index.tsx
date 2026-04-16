import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { fontSize } from '@src/config/styleConsts';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { scaleFont } from '@src/utils/fontScaler';

interface Props extends TextProps {
  children: React.ReactNode;
  size?: number;
  weight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  textStyles?: TextStyle | TextStyle[];
  color?: string;
  fontFamily?: string;
}

const getFontFamilyStyle = (
  weight: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med',
  fontFamily: string
) => {
  switch (weight) {
    case 'L':
      return { fontFamily: `${fontFamily}-Light` }; // 300 or lower
    case 'R':
      return { fontFamily: `${fontFamily}-Regular` }; // 400
    case 'M':
      return { fontFamily: `${fontFamily}-Medium` }; // 500
    case 'B':
      return { fontFamily: `${fontFamily}-Bold` }; // 700 or above
    case 'Boo':
      return { fontFamily: `${fontFamily}-Boo` }; // 400
    case 'Med':
      return { fontFamily: `${fontFamily}-Med` }; // 500
    case 'Dem':
      return { fontFamily: `${fontFamily}-Dem` }; // 600
    default:
      return { fontFamily: `${fontFamily}-Regular` };
  }
};

const getColorStyle = (color: string) => ({ color });

/**
 * A customizable text component that allows you to set font size, weight, color, and additional styles.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the text component.
 * @param {number} [props.size=16] - The font size of the text. Defaults to 16.
 * @param {'R' | 'B' | 'L' | 'M'} [props.weight='R'] - The font weight of the text. Defaults to 'R'.
 * @param {object} [props.textStyles={}] - Additional styles to be applied to the text.
 * @param {string} [props.color=colors.black] - The color of the text. Defaults to `colors.black`.
 * @param {object} props.props - Additional props to be passed to the underlying `Text` component.
 *
 * @returns {JSX.Element} A styled `Text` component with the specified properties.
 */

/**
 * Returns the first non-undefined line height value from an array of styles,
 * or the line height value from a single style object if it exists.
 *
 * @param {TextStyle | TextStyle[]} styles - The styles to search for a line height value.
 *
 * @returns {number | undefined} The first non-undefined line height value, or undefined if no line height is found.
 */

const getLineHeightFromStyles = (styles?: TextStyle | TextStyle[]): number | undefined => {
  if (!styles) return;

  if (Array.isArray(styles)) {
    for (let i = styles.length - 1; i >= 0; i--) {
      if (styles[i]?.lineHeight) {
        return styles[i].lineHeight;
      }
    }
  } else {
    return styles.lineHeight;
  }
  return;
};

const CustomText = ({
  children,
  size = fontSize.s,
  weight = 'R',
  textStyles = {},
  color,
  fontFamily = fonts.notoSerif,
  ...props
}: Props) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const textSize = useSettingsStore((state) => state.textSize);
  const fontFamilyStyle = getFontFamilyStyle(weight, fontFamily);
  const colorStyle = getColorStyle(color ?? theme.sectionTextTitleSpecial);
  const rawLineHeight = getLineHeightFromStyles(textStyles);

  const scaledTextStyle: TextStyle = {
    fontSize: scaleFont(size, textSize),
    ...(rawLineHeight && {
      lineHeight: scaleFont(rawLineHeight, textSize)
    })
  };

  return (
    <Text
      allowFontScaling={textSize === 'System'}
      style={[styles.text, fontFamilyStyle, colorStyle, textStyles, scaledTextStyle]}
      {...props}
    >
      {children}
    </Text>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    text: {
      color: theme.sectionTextTitleSpecial
    }
  });

export default CustomText;
