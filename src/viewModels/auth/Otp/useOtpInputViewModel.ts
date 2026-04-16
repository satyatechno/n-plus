import { useRef, useState, useMemo } from 'react';
import { TextInput } from 'react-native';

/**
 * Custom hook to manage OTP (One-Time Password) input fields.
 *
 * @param {function} onChange - Callback function that is called whenever the OTP input changes.
 *
 * This hook provides:
 * - State management for an array of 6 OTP digits.
 * - Functions to handle changes to input fields and key presses (e.g., backspace).
 * - Logic to automatically move focus to the next or previous input field based on user input.
 * - A ref to store references to the input fields for programmatic focus control.
 * - A flag to determine if any OTP digit has been entered (used for conditional styling).
 *
 * @returns {object} An object containing:
 * - `otp`: The current OTP input as an array of strings.
 * - `handleChange`: Function to update the OTP when a digit is entered.
 * - `handleKeyPress`: Function to handle backspace key presses.
 * - `inputs`: Ref storing the input fields for focus management.
 * - `shouldShowBorder`: Boolean indicating if any OTP digit is filled.
 */

export const useOtpInputViewModel = (onChange: (otp: string) => void) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

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
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericOnly;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (numericOnly && index < 5) {
      inputs.current[index + 1]?.focus();
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

  const shouldShowBorder = useMemo(() => otp.some((digit) => digit !== ''), [otp]);

  return {
    otp,
    handleChange,
    handleKeyPress,
    inputs,
    shouldShowBorder
  };
};
