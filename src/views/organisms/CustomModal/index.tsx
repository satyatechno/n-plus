import React, { useMemo, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle, TextStyle, Animated } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton/index';
import { isIos } from '@src/utils/platformCheck';
import { CrossIcon } from '@src/assets/icons';

interface CustomModalProps {
  visible: boolean;
  onRequestClose: () => void;
  modalTitle: string;
  modalMessage?: string;
  cancelButtonText: string;
  confirmButtonText: string;
  onCancelPress: () => void;
  onConfirmPress: () => void;
  onOutsidePress: () => void;
  modalOverlayStyle?: ViewStyle;
  modalContainerStyle?: ViewStyle;
  modalTitleStyle?: TextStyle;
  modalMessageStyle?: TextStyle;
  buttonTextStyle?: TextStyle;
  cancelButtonTextStyle?: TextStyle;
  confirmButtonTextStyle?: TextStyle;
  modalSubtitle?: string;
  modalSubtitleStyle?: TextStyle;
  buttonContainerStyle?: ViewStyle;
  icon?: React.ReactNode;
  iconContainerStyle?: ViewStyle;
  textBoxContainerStyle?: ViewStyle;
  showCrossIcon?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onRequestClose,
  modalTitle,
  modalMessage,
  cancelButtonText,
  confirmButtonText,
  onCancelPress,
  onConfirmPress,
  onOutsidePress,
  modalOverlayStyle,
  modalContainerStyle,
  modalTitleStyle,
  modalMessageStyle,
  modalSubtitleStyle,
  cancelButtonTextStyle,
  confirmButtonTextStyle,
  modalSubtitle,
  buttonContainerStyle,
  icon,
  iconContainerStyle,
  textBoxContainerStyle,
  showCrossIcon = true
}) => {
  const [theme] = useTheme();
  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 12
        }).start();
      });
    } else {
      Animated.spring(slideAnim, {
        toValue: 1000,
        useNativeDriver: true,
        tension: 50,
        friction: 12
      }).start();
    }
  }, [visible, slideAnim]);

  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <Modal transparent visible={visible} onRequestClose={onRequestClose}>
      <Pressable
        style={StyleSheet.flatten([styles.modalOverlay, modalOverlayStyle])}
        onPress={onOutsidePress}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            modalContainerStyle,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {showCrossIcon && (
            <Pressable onPress={onOutsidePress} style={styles.closeIconContainer}>
              <CrossIcon
                height={actuatedNormalizeVertical(12)}
                width={actuatedNormalizeVertical(12)}
                stroke={theme.dividerBlack}
                strokeWidth={1.4}
              />
            </Pressable>
          )}

          {icon && <View style={[styles.iconContainer, iconContainerStyle]}>{icon}</View>}
          <CustomText
            weight="R"
            fontFamily={fonts.notoSerifExtraCondensed}
            size={fontSize['2xl']}
            textStyles={StyleSheet.flatten([styles.modalTitle, modalTitleStyle])}
          >
            {modalTitle}
          </CustomText>

          {(modalMessage || modalSubtitle) && (
            <View style={StyleSheet.flatten([styles.textBoxContainer, textBoxContainerStyle])}>
              {modalMessage && (
                <CustomText
                  weight="Boo"
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xs}
                  color={theme.newsTextPictureCarouselTitle}
                  textStyles={StyleSheet.flatten([styles.modalMessage, modalMessageStyle])}
                >
                  {modalMessage}
                </CustomText>
              )}

              {modalSubtitle && (
                <CustomText
                  weight="Boo"
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xs}
                  color={theme.newsTextPictureCarouselTitle}
                  textStyles={StyleSheet.flatten([styles.modalSubtitle, modalSubtitleStyle])}
                >
                  {modalSubtitle}
                </CustomText>
              )}
            </View>
          )}

          <View style={StyleSheet.flatten([styles.buttonContainer, buttonContainerStyle])}>
            <CustomButton
              onPress={onCancelPress}
              buttonText={cancelButtonText}
              buttonStyles={styles.cancelButtonStyle}
              variant="outlined"
              buttonTextColor={theme.filledButtonPrimary}
              buttonTextStyles={StyleSheet.flatten([styles.buttonTextStyle, cancelButtonTextStyle])}
              getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
            />

            <CustomButton
              onPress={onConfirmPress}
              buttonText={confirmButtonText}
              buttonStyles={styles.confirmButtonStyle}
              buttonTextStyles={StyleSheet.flatten([
                styles.buttonTextStyle,
                confirmButtonTextStyle
              ])}
            />
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.titleForegroundInteractiveDefault30Alpha
    },
    modalContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xl),
      paddingHorizontal: actuatedNormalize(spacing.xs),
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl
    },
    cancelButtonStyle: {
      height: actuatedNormalizeVertical(52),
      width: '47%',
      borderWidth: borderWidth.m,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.m
    },
    modalTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.m),
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl']),
      marginHorizontal: actuatedNormalize(spacing.xxs)
    },
    modalMessage: {
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    modalSubtitle: {
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      alignSelf: 'center',
      width: '70%',
      top: actuatedNormalizeVertical(spacing.m)
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: actuatedNormalize(spacing.xxs)
    },
    confirmButtonStyle: {
      width: '47%'
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    textBoxContainer: {
      width: '90%',
      paddingBottom: actuatedNormalizeVertical(spacing['3xl']),
      alignSelf: 'center',
      paddingHorizontal: actuatedNormalize(spacing.xxs)
    },
    closeIconContainer: {
      alignSelf: 'flex-end',
      padding: spacing['xxs'],
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: borderWidth.m,
      borderColor: theme.iconIconographyIconBoundaries
    },
    iconContainer: {
      width: actuatedNormalize(spacing['10xl']),
      height: actuatedNormalize(spacing['10xl']),
      borderWidth: borderWidth['m'],
      borderColor: theme.outlinedButtonSecondaryOutline,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.mainBackgroundSecondary,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.m),
      paddingHorizontal: actuatedNormalize(spacing.xxs)
    }
  });

export default CustomModal;
