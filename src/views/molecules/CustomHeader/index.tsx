import React, { useMemo } from 'react';
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { BackIcon } from '@src/assets/icons';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import SettingsIcon from '@src/assets/icons/SettingsIcon';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  variant?: 'primary' | 'secondary' | 'dualVariant';
  onPress?: () => void;
  headerText?: string;
  headerTextColor?: string;
  headerTextSize?: number;
  headerTextWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  headerTextStyles?: TextStyle;
  headerTextFontFamily?: string;
  iconComponent?: React.ReactNode;
  headerStyle?: TextStyle;
  buttonStyle?: TextStyle;
  additionalIcon?: React.ReactNode;
  additionalButtonStyle?: ViewStyle;
  onAdditionalButtonPress?: () => void;
  backIconStrokeColor?: string;
  middleIconStyle?: ViewStyle;
  middleIcon?: React.ReactNode;
}

/**
 * CustomHeader
 *
 * A custom header component for use in the app. It comes in two variants, primary and secondary.
 * The primary variant has a back icon on the left and a header text in the middle.
 * The secondary variant has a header text on the left and a settings icon on the right.
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - The variant of the header. Can be 'primary' or 'secondary'. Defaults to 'primary'.
 * @param {Function} props.onPress - The function to call when the header is pressed.
 * @param {string} props.headerText - The text to display in the header.
 * @param {string} props.headerTextColor - The color of the header text. Defaults to theme.sectionTextTitleSpecial.
 * @param {number} props.headerTextSize - The size of the header text. Defaults to fontSize['s'].
 * @param {string} props.headerTextWeight - The weight of the header text. Can be 'L', 'R', 'M', 'B', 'Boo', or 'Dem'. Defaults to 'R'.
 * @param {TextStyle} props.headerTextStyles - Additional styles to apply to the header text.
 * @param {string} props.headerTextFontFamily - The font family to use for the header text. Defaults to fonts.notoSerif for primary variant and fonts.franklinGothicURW for secondary variant.
 * @param {React.ReactNode} props.iconComponent - The icon to use instead of the default back icon for the primary variant and the settings icon for the secondary variant.
 * @param {TextStyle} props.headerStyle - Additional styles to apply to the header.
 * @param {TextStyle} props.buttonStyle - Additional styles to apply to the button.
 * @param {string} props.backIconStrokeColor - The color to use for the back icon stroke. Defaults to theme.greyButtonSecondaryOutline.
 */

const CustomHeader = ({
  variant = 'primary',
  onPress,
  headerText,
  headerTextColor,
  headerTextSize = fontSize['s'],
  headerTextWeight = variant === 'primary' ? 'R' : 'Med',
  headerTextStyles = {},
  headerTextFontFamily = variant === 'primary' ? fonts.notoSerif : fonts.franklinGothicURW,
  iconComponent,
  headerStyle = {},
  buttonStyle = {},
  additionalIcon,
  additionalButtonStyle = {},
  onAdditionalButtonPress,
  backIconStrokeColor,
  middleIconStyle,
  middleIcon
}: Props) => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onPressingSearch = () => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const Icon =
    iconComponent ||
    (variant !== 'secondary' ? (
      <BackIcon stroke={backIconStrokeColor || theme.greyButtonSecondaryOutline} />
    ) : (
      <SettingsIcon color={theme.greyButtonSecondaryOutline} />
    ));

  return (
    <View
      style={StyleSheet.flatten([
        styles.header,
        variant !== 'secondary' ? styles.primary : styles.secondary,
        headerStyle
      ])}
    >
      {variant !== 'secondary' && (
        <Pressable
          style={({ pressed }) =>
            StyleSheet.flatten([
              styles.button,
              buttonStyle,
              pressed && { backgroundColor: theme.toggleIcongraphyDisabledState }
            ])
          }
          onPress={onPress}
        >
          {Icon}
        </Pressable>
      )}

      {headerText && (
        <CustomText
          weight={headerTextWeight}
          fontFamily={headerTextFontFamily}
          size={headerTextSize}
          color={headerTextColor ?? theme.sectionTextTitleSpecial}
          textStyles={StyleSheet.flatten([
            styles.text,
            variant !== 'secondary' && styles.textPrimary,
            headerTextStyles
          ])}
        >
          {headerText}
        </CustomText>
      )}

      {variant === 'secondary' && (
        <Pressable
          style={StyleSheet.flatten([styles.button, buttonStyle])}
          onPress={onPress ?? onPressingSearch}
        >
          {Icon}
        </Pressable>
      )}

      {variant === 'dualVariant' && middleIcon && (
        <View style={StyleSheet.flatten([styles.middleIcon, middleIconStyle])}>{middleIcon}</View>
      )}

      {variant === 'dualVariant' && additionalIcon && (
        <Pressable
          style={StyleSheet.flatten([styles.button, additionalButtonStyle])}
          onPress={onAdditionalButtonPress ?? onPressingSearch}
        >
          {additionalIcon}
        </Pressable>
      )}
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      height: actuatedNormalizeVertical(60),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.mainBackgroundDefault
    },
    primary: {
      justifyContent: 'flex-start'
    },
    secondary: {
      justifyContent: 'space-between'
    },
    button: {
      height: actuatedNormalizeVertical(36),
      width: actuatedNormalizeVertical(36),
      borderRadius: radius.m,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: borderWidth.m,
      borderColor: theme.outlinedButtonSecondaryOutline
    },
    middleIcon: {
      justifyContent: 'center'
    },
    text: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    textPrimary: {
      marginLeft: actuatedNormalize(spacing.s)
    }
  });

export default CustomHeader;
