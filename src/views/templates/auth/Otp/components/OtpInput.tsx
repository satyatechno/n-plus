import React from 'react';
import { StyleSheet, View } from 'react-native';

import OtpDigitInput from '@src/views/templates/auth/Otp/components/OtpDigitInput';
import { useOtpInputViewModel } from '@src/viewModels/auth/Otp/useOtpInputViewModel';

interface Props {
  onChange: (otp: string) => void;
  borderColor?: string;
  backgroundColor?: string;
  theme?: 'light' | 'dark' | 'system';
}

const OtpInput: React.FC<Props> = ({ onChange, borderColor, backgroundColor }) => {
  const { otp, handleChange, handleKeyPress, inputs, shouldShowBorder } =
    useOtpInputViewModel(onChange);

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <OtpDigitInput
          key={index}
          value={digit}
          onChange={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          index={index}
          borderColor={borderColor}
          backgroundColor={backgroundColor}
          showBorder={shouldShowBorder}
          inputRef={(ref) => (inputs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
});
