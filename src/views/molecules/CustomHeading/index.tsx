import React from 'react';
import { StyleSheet, TextStyle, useColorScheme, View } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { NPlusLogo, NPlusLogoWhite } from '@src/assets/images';
import { useTheme } from '@src/hooks/useTheme';
import useThemeStore from '@src/zustand/auth/themeStore';

interface Props {
  logo?: React.ReactNode;
  logoHeight?: number;
  logoWidth?: number;
  isLogoVisible?: boolean;
  headingColor?: string;
  headingSize?: number;
  headingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  headingFont?: string;
  headingStyles?: TextStyle;
  headingText?: string;
  subHeadingColor?: string;
  subHeadingSize?: number;
  subHeadingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  subHeadingFont?: string;
  subHeadingStyles?: TextStyle;
  subHeadingText?: string;
  customTheme?: 'light' | 'dark';
  onHeadingTextPress?: () => void;
}

/**
 * CustomHeading is a reusable component that renders a heading with a logo, main heading text and subheading text.
 *
 * @param {Object} props - The props for the CustomHeading component.
 * @param {number} [props.logoHeight] - The height of the logo. Defaults to 40.
 * @param {number} [props.logoWidth] - The width of the logo. Defaults to 40.
 * @param {boolean} [props.isLogoVisible=true] - Whether to show the logo or not. Defaults to true.
 * @param {string} [props.headingText] - The main heading text.
 * @param {string} [props.subHeadingText] - The subheading text.
 * @param {number} [props.headingSize=fontSize['2xl']] - The font size of the main heading text. Defaults to fontSize['2xl'].
 * @param {'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med'} [props.headingWeight='R'] - The font weight of the main heading text. Defaults to 'R'.
 * @param {TextStyle} [props.headingStyles={}] - Additional styles to apply to the main heading text.
 * @param {string} [props.headingColor] - The color of the main heading text. Defaults to theme.sectionTextTitleSpecial.
 * @param {string} [props.headingFont=fonts.notoSerif] - The font family of the main heading text. Defaults to fonts.notoSerif.
 * @param {number} [props.subHeadingSize=fontSize['xs']] - The font size of the subheading text. Defaults to fontSize['xs'].
 * @param {'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med'} [props.subHeadingWeight='R'] - The font weight of the subheading text. Defaults to 'R'.
 * @param {TextStyle} [props.subHeadingStyles={}] - Additional styles to apply to the subheading text.
 * @param {string} [props.subHeadingColor] - The color of the subheading text. Defaults to theme.subtitleTextSubtitle.
 * @param {string} [props.subHeadingFont=fonts.notoSerifExtraCondensed] - The font family of the subheading text. Defaults to fonts.notoSerifExtraCondensed.
 *
 * @returns {JSX.Element} A heading component with a logo, main heading text and subheading text.
 */

const CustomHeading = ({
  logoHeight,
  logoWidth,
  logo,
  isLogoVisible,
  headingText,
  subHeadingText,
  headingSize = fontSize['2xl'],
  headingWeight = 'R',
  headingStyles = {},
  headingColor,
  headingFont = fonts.notoSerif,
  subHeadingSize = fontSize.xs,
  subHeadingWeight = 'Boo',
  subHeadingStyles = {},
  subHeadingColor,
  subHeadingFont = fonts.franklinGothicURW,
  customTheme,
  onHeadingTextPress
}: Props) => {
  const [theme] = useTheme(customTheme);
  const darkMode = useThemeStore();
  const colorScheme = useColorScheme();

  const styles = themeStyles(theme);

  return (
    <View>
      {isLogoVisible &&
        (logo ? (
          logo
        ) : darkMode.theme === 'dark' || (darkMode.theme === 'system' && colorScheme === 'dark') ? (
          <NPlusLogoWhite height={logoHeight} width={logoWidth} />
        ) : (
          <NPlusLogo height={logoHeight} width={logoWidth} />
        ))}

      {headingText && (
        <CustomText
          weight={headingWeight}
          fontFamily={headingFont}
          size={headingSize}
          color={headingColor ?? theme.sectionTextTitleSpecial}
          textStyles={StyleSheet.flatten([styles.heading, headingStyles])}
          onPress={onHeadingTextPress}
        >
          {headingText}
        </CustomText>
      )}

      {subHeadingText && (
        <CustomText
          weight={subHeadingWeight}
          fontFamily={subHeadingFont}
          size={subHeadingSize}
          color={subHeadingColor ?? theme.subtitleTextSubtitle}
          textStyles={StyleSheet.flatten([styles.subHeading, subHeadingStyles])}
        >
          {subHeadingText}
        </CustomText>
      )}
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heading: {
      color: theme.sectionTextTitleSpecial,
      lineHeight: lineHeight['6xl'],
      marginTop: spacing.xxs
    },
    subHeading: {
      marginTop: spacing.xxs,
      color: theme.bodyTextOther,
      lineHeight: lineHeight.l
    }
  });

export default CustomHeading;
