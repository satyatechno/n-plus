import React from 'react';
import { View, StyleSheet, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { BlackTickIcon, WhiteTickIcon } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;

  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  labelWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  checkboxStyle?: StyleProp<ViewStyle>;
  checkedColor?: string;
  iconSize?: number;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  labelColor,
  labelStyle,
  labelWeight = 'Boo',
  checkboxStyle,
  checkedColor,
  iconSize
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const iconDimension = iconSize ?? actuatedNormalize(spacing.xxs);
  const TickIcon = checked ? (
    <BlackTickIcon
      width={iconDimension}
      height={iconDimension}
      fill={theme.mainBackgroundSecondary}
    />
  ) : (
    <WhiteTickIcon width={iconDimension} height={iconDimension} />
  );

  return (
    <Pressable style={styles.checkboxWrapper} onPress={onChange}>
      <View
        style={[
          styles.checkboxBox,
          checkboxStyle,
          checked && styles.checkboxChecked,
          checked && checkedColor && { backgroundColor: checkedColor },
          checked && { backgroundColor: theme.bodyTextOther }
        ]}
      >
        {checked && TickIcon}
      </View>

      <CustomText
        size={fontSize['xs']}
        weight={labelWeight}
        fontFamily={fonts.franklinGothicURW}
        textStyles={[styles.checkboxLabel, labelStyle as TextStyle]}
        color={labelColor ?? theme.bodyTextOther}
      >
        {label}
      </CustomText>
    </Pressable>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    checkboxWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    checkboxBox: {
      width: actuatedNormalize(20),
      height: actuatedNormalizeVertical(20),
      borderWidth: borderWidth.xl,
      borderColor: theme.bodyTextOther,
      borderRadius: radius.xxs,
      marginRight: actuatedNormalize(spacing.xs),
      justifyContent: 'center',
      alignItems: 'center'
    },
    checkboxChecked: {
      backgroundColor: theme.checkBoxIcongraphyDefaultState
    },
    checkboxLabel: {
      flex: 1,
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    }
  });

export default CustomCheckbox;
