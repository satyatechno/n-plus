import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View
} from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { borderWidth, fontSize, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  index: number;
  borderColor?: string;
  backgroundColor?: string;
  inputRef: ((instance: TextInput | null) => void) | React.RefObject<TextInput>;
  showBorder: boolean;
}

const OtpDigitInput: React.FC<Props> = ({
  value,
  onChange,
  onKeyPress,
  borderColor,
  backgroundColor,
  inputRef,
  showBorder,
  index
}) => {
  const [theme] = useTheme();

  const dynamicStyles = {
    borderColor: showBorder ? borderColor : theme.inputFillforegroundInteractiveDefault,
    backgroundColor: backgroundColor,
    fontWeight: value ? 'bold' : ('normal' as 'normal' | 'bold'),
    color: theme.onBoardingTextInputText,
    fontSize: actuatedNormalizeVertical(fontSize['xl']),
    paddingHorizontal: isIos
      ? undefined
      : value
        ? actuatedNormalize(spacing.s)
        : actuatedNormalize(spacing.m)
  };

  return (
    <View style={styles.boxWrapper}>
      {!value ? (
        <View style={styles.hyphenWrapper} pointerEvents="none">
          <Text style={[styles.hyphen, { color: theme.onBoardingTextPlaceholder }]}>-</Text>
        </View>
      ) : null}
      <TextInput
        style={StyleSheet.flatten([styles.otpBox, styles.input, dynamicStyles])}
        value={value}
        onChangeText={onChange}
        onKeyPress={onKeyPress}
        keyboardType="number-pad"
        maxLength={index === 0 ? 6 : 1}
        ref={inputRef}
        autoFocus={false}
      />
    </View>
  );
};

export default OtpDigitInput;

const styles = StyleSheet.create({
  boxWrapper: {
    position: 'relative',
    alignSelf: 'center'
  },
  hyphenWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  hyphen: {
    textAlign: 'center',
    includeFontPadding: false,
    fontSize: actuatedNormalizeVertical(fontSize['xl'])
  },
  input: {
    zIndex: 1
  },
  otpBox: {
    width: actuatedNormalize(spacing['6xl']),
    height: actuatedNormalizeVertical(spacing['6xl']),
    borderWidth: isIos ? actuatedNormalize(borderWidth.m) : actuatedNormalize(borderWidth.xl),
    borderRadius: radius.m,
    fontSize: actuatedNormalizeVertical(fontSize.xl),
    textAlignVertical: 'center',
    lineHeight: isIos ? 0 : actuatedNormalizeVertical(fontSize.xl),
    includeFontPadding: false,
    alignSelf: 'center',
    textAlign: 'center'
  }
});
