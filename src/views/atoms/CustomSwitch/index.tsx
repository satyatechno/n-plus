import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { actuatedNormalize } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { radius } from '@src/config/styleConsts';

interface Props {
  value: boolean;
  onToggle: () => void;
}

/**
 * A toggle switch component that can be used to represent a boolean value.
 *
 * The component is a pressable element with a track and a thumb.
 * The track is styled according to the theme. The thumb is positioned
 * at the beginning or end of the track depending on the value of the switch.
 *
 * @param {{value: boolean, onToggle: () => void}} props - The props for the component.
 * @param {boolean} props.value - The value of the switch.
 * @param {() => void} props.onToggle - The callback function triggered when the switch is toggled.
 *
 * @returns {JSX.Element} The rendered switch component.
 */

const CustomSwitch: React.FC<Props> = ({ value, onToggle }) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        styles.customSwitchTrack,
        {
          backgroundColor: value ? theme.toggleIcongraphyPrimary : theme.trackDisabled
        }
      ]}
    >
      <View style={[styles.customSwitchThumb, value ? styles.thumbRight : styles.thumbLeft]} />
    </Pressable>
  );
};

export default CustomSwitch;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    customSwitchTrack: {
      width: 32,
      height: 20,
      borderRadius: 27,
      justifyContent: 'center'
    },
    customSwitchThumb: {
      width: 16,
      height: 16,
      borderRadius: radius['m'],
      backgroundColor: theme.toggleIcongraphySwitch,
      position: 'absolute',
      left: actuatedNormalize(14.11) // TODO-> not given in styleConsts,when taking near by value UI is breaking need to discuss with UI/UX
    },
    trackEnabled: {
      backgroundColor: theme.toggleIcongraphyPrimary
    },
    trackDisabled: {
      backgroundColor: theme.trackDisabled
    },
    thumbLeft: {
      left: actuatedNormalize(2)
    },
    thumbRight: {
      backgroundColor: theme.toggleIcongraphySwitch
    }
  });
