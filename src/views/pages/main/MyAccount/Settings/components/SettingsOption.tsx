import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomSwitch from '@src/views/atoms/CustomSwitch';

interface Props {
  label?: string;
  description?: string;
  descriptionStyles?: TextStyle | TextStyle[];
  value?: boolean;
  onToggle?: () => void;
  isCustomSwitchVisible?: boolean;
}

/**
 * Renders a settings option with an optional label and description.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} [props.label] - The label text of the setting.
 * @param {string} [props.description] - The description text of the setting.
 * @param {TextStyle | TextStyle[]} [props.descriptionStyles] - Additional styles for the description text.
 *
 * @returns {JSX.Element} A view containing the label and description.
 */

const SettingsOption: React.FC<Props> = ({
  label,
  description,
  descriptionStyles,
  value,
  onToggle,
  isCustomSwitchVisible
}) => (
  <>
    <View style={styles.rowContainer}>
      <CustomText
        textStyles={styles.label}
        size={fontSize['s']}
        weight="Boo"
        fontFamily={fonts.franklinGothicURW}
      >
        {label}
      </CustomText>

      {isCustomSwitchVisible && value !== undefined && onToggle && (
        <CustomSwitch value={value} onToggle={onToggle} />
      )}
    </View>

    {description && (
      <CustomText
        textStyles={StyleSheet.flatten([styles.description, descriptionStyles])}
        size={fontSize['xxs']}
        weight="Boo"
        fontFamily={fonts.franklinGothicURW}
      >
        {description}
      </CustomText>
    )}
  </>
);

export default SettingsOption;

const styles = StyleSheet.create({
  label: {
    lineHeight: actuatedNormalizeVertical(lineHeight['2xl'])
  },
  description: {
    marginBottom: actuatedNormalizeVertical(spacing['s']),
    lineHeight: actuatedNormalizeVertical(lineHeight['m']),
    width: '80%'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
