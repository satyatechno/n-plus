import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import OtpDigitInput from '@src/views/templates/auth/Otp/components/OtpDigitInput';

interface Props {
  onChange: (otp: string) => void;
  borderColor?: string;
  backgroundColor?: string;
  theme?: 'light' | 'dark' | 'system';
  resetOtpTrigger: boolean;
}

const OtpInput: React.FC<Props> = ({ onChange, borderColor, backgroundColor, resetOtpTrigger }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setOtp(['', '', '', '', '', '']);
  }, [resetOtpTrigger]);

  const handleChange = (text: string, index: number) => {
    const numericOnly = text.replace(/[^0-9]/g, '');

    if (numericOnly.length > 1) {
      const newOtp = numericOnly.slice(0, 6).split('');
      const filledOtp = [...otp];

      for (let i = 0; i < newOtp.length; i++) {
        filledOtp[i] = newOtp[i];
      }

      setOtp(filledOtp);
      onChange(filledOtp.join(''));

      const nextIndex = Math.min(newOtp.length, 5);
      inputs.current[nextIndex]?.focus();

      if (filledOtp.every((val) => val !== '')) {
        inputs.current[5]?.blur();
        Keyboard.dismiss();
      }

      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericOnly;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (numericOnly && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((val) => val !== '')) {
      inputs.current[5]?.blur();
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (
    { nativeEvent: { key } }: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '') {
        if (index > 0) {
          newOtp[index - 1] = '';
          setOtp(newOtp);
          onChange(newOtp.join(''));
          inputs.current[index - 1]?.focus();
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    }
  };

  const shouldShowBorder = otp.some((digit) => digit !== '');

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
    width: '99%'
  }
});
