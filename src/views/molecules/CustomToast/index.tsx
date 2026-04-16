import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import { SuccessIcon, WarningIcon } from '@src/assets/icons';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, lineHeight, spacing, radius, borderWidth } from '@src/config/styleConsts';

interface Props {
  type: 'error' | 'success';
  isVisible: boolean;
  onDismiss?: () => void;
  message: string | undefined;
  subMessage?: string;
  onButtonPress?: () => void;
  buttonText?: string;
  toastContainerStyle?: ViewStyle;
  customTheme?: 'light' | 'dark';
}

/**
 * CustomToast is a React Native component that displays a toast notification with optional animation, icon, message, sub-message, and action button.
 *
 * @param {Object} props - The props for the CustomToast component.
 * @param {'error' | 'success'} props.type - The type of toast to display, which determines the icon and color (e.g., 'error' or 'success').
 * @param {string} props.message - The main message to display in the toast.
 * @param {string} [props.subMessage] - An optional sub-message to display below the main message.
 * @param {boolean} props.isVisible - Controls the visibility of the toast.
 * @param {() => void} [props.onDismiss] - Optional callback invoked when the toast is dismissed.
 * @param {() => void} [props.onButtonPress] - Optional callback invoked when the action button is pressed.
 * @param {string} [props.buttonText] - The text to display on the action button.
 *
 * @returns {JSX.Element | null} The rendered toast component or null if not visible.
 */

const CustomToast = ({
  type,
  isVisible,
  onDismiss,
  message,
  subMessage,
  onButtonPress,
  buttonText,
  toastContainerStyle,
  customTheme
}: Props) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const color = type === 'error' ? theme.actionCTAToastError : theme.actionCTAToastDefault;
  const Icon = type === 'error' ? WarningIcon : SuccessIcon;
  const borderColor = type === 'error' ? theme.actionCTAToastError : theme.actionCTAToastDefault;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          onDismiss?.();
        });
      }, 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      }).start();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { transform: [{ translateY: slideAnim }] },
        { borderColor },
        toastContainerStyle
      ]}
    >
      <View style={styles.iconWrapper}>
        <Icon
          height={actuatedNormalizeVertical(18)}
          width={actuatedNormalize(18)}
          color={color}
          midIconColor={theme.inverse}
        />

        <View style={styles.textWrapper}>
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            weight="Dem"
            size={fontSize['s']}
            color={color}
            textStyles={styles.message}
          >
            {message}
          </CustomText>
        </View>

        {buttonText && (
          <CustomButton
            onPress={onButtonPress ?? (() => {})}
            buttonText={buttonText}
            variant="text"
            buttonTextWeight="Med"
            buttonTextColor={theme.iconIconographyError}
            buttonTextStyles={styles.message}
          />
        )}
      </View>

      {subMessage && (
        <CustomText
          fontFamily={fonts.franklinGothicURW}
          weight="Boo"
          size={fontSize['xxs']}
          color={color}
          textStyles={styles.subMessage}
        >
          {subMessage}
        </CustomText>
      )}
    </Animated.View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    toastContainer: {
      position: 'absolute',
      top: isIos ? actuatedNormalizeVertical(54) : actuatedNormalizeVertical(30),
      alignSelf: 'center',
      borderRadius: radius.l,
      backgroundColor: theme.toastAndAlertsTextBackground,
      width: '100%',
      borderWidth: borderWidth.m,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingVertical: actuatedNormalizeVertical(spacing.s),
      zIndex: 999
    },
    iconWrapper: {
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs),
      alignItems: 'center'
    },
    textWrapper: {
      flex: 1
    },
    message: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    subMessage: {
      lineHeight: actuatedNormalizeVertical(lineHeight['m']),
      marginTop: actuatedNormalizeVertical(spacing['xxs'])
    }
  });

export default CustomToast;
