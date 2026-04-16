import React, { useMemo, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing, radius, borderWidth } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import {
  CrossIcon,
  CheckboxIcon,
  BadgingCircularIcon,
  TrashIcon,
  AlertIcon,
  DeleteAllIcon
} from '@src/assets/icons';
import CustomModal from '@src/views/organisms/CustomModal';

export interface NotificationOptionsModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  onViewUnreadPress?: () => void;
  onMarkReadPress?: () => void;
  onDeletePress?: () => void;
  onDeleteAllPress?: () => void;
  onManageNotificationPress?: () => void;
  modalOverlayStyle?: StyleProp<ViewStyle>;
  modalContainerStyle?: StyleProp<ViewStyle>;
  modalTitleStyle?: StyleProp<TextStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconWidth?: number;
  iconHeight?: number;
  isListEmpty?: boolean;
}

const NotificationOptionsModal: React.FC<NotificationOptionsModalProps> = ({
  visible,
  onRequestClose,
  title,
  onViewUnreadPress,
  onMarkReadPress,
  onDeletePress,
  onDeleteAllPress,
  onManageNotificationPress,
  modalOverlayStyle,
  modalContainerStyle,
  modalTitleStyle,
  optionTextStyle,
  iconColor,
  iconWidth = 22,
  iconHeight = 18,
  isListEmpty
}) => {
  const [theme] = useTheme();
  const slideAnim = useMemo(() => new Animated.Value(1000), []);
  const { t } = useTranslation();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const onCancelPress = () => {
    setIsDeleteModalVisible(false);
  };

  const onConfirmPress = () => {
    setIsDeleteModalVisible(false);
    if (onDeleteAllPress) {
      onDeleteAllPress();
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [visible, slideAnim]);

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const effectiveIconColor =
    (iconColor ?? isListEmpty) ? theme.colorSecondary200 : theme.iconIconographyGenericState;

  return (
    <>
      <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
        <Pressable
          style={StyleSheet.flatten([styles.modalOverlay, modalOverlayStyle])}
          onPress={onRequestClose}
        >
          <Animated.View
            style={StyleSheet.flatten([
              styles.modalContainer,
              modalContainerStyle,
              { transform: [{ translateY: slideAnim }] }
            ])}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <CustomText
                fontFamily={fonts.notoSerifExtraCondensed}
                size={fontSize['2xl']}
                numberOfLines={1}
                ellipsizeMode="tail"
                textStyles={StyleSheet.flatten([styles.modalTitle, modalTitleStyle])}
              >
                {title}
              </CustomText>
              <Pressable onPress={onRequestClose} style={styles.closeIconContainer}>
                <CrossIcon
                  height={actuatedNormalizeVertical(12)}
                  width={actuatedNormalize(12)}
                  stroke={iconColor ?? theme.iconIconographyGenericState}
                  strokeWidth={2}
                />
              </Pressable>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {isListEmpty && (
                <Pressable style={styles.optionItem} onPress={onManageNotificationPress}>
                  <View style={styles.iconContainer}>
                    <AlertIcon
                      color={iconColor ?? theme.iconIconographyGenericState}
                      width={iconWidth}
                      height={20}
                    />
                  </View>
                  <CustomText
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  >
                    {t('screens.myNotifications.text.manageNotifications')}
                  </CustomText>
                </Pressable>
              )}

              <Pressable
                style={styles.optionItem}
                onPress={() => !isListEmpty && onViewUnreadPress?.()}
              >
                <View style={styles.iconContainer}>
                  <BadgingCircularIcon
                    color={effectiveIconColor}
                    width={iconWidth}
                    height={iconHeight}
                  />
                </View>
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  color={isListEmpty ? theme.colorSecondary200 : theme.newsTextTitlePrincipal}
                >
                  {t('screens.myNotifications.text.seeUnread')}
                </CustomText>
              </Pressable>

              <Pressable
                style={styles.optionItem}
                onPress={() => !isListEmpty && onMarkReadPress?.()}
              >
                <View style={styles.iconContainer}>
                  <CheckboxIcon
                    stroke={effectiveIconColor}
                    fill={effectiveIconColor}
                    width={iconWidth}
                    height={iconHeight}
                  />
                </View>
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  color={isListEmpty ? theme.colorSecondary200 : theme.newsTextTitlePrincipal}
                >
                  {t('screens.myNotifications.text.markAsRead')}
                </CustomText>
              </Pressable>

              <Pressable
                style={styles.optionItem}
                onPress={() => !isListEmpty && onDeletePress?.()}
              >
                <View style={styles.iconContainer}>
                  <TrashIcon color={effectiveIconColor} width={iconWidth} height={iconHeight} />
                </View>
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  color={isListEmpty ? theme.colorSecondary200 : theme.newsTextTitlePrincipal}
                >
                  {t('screens.myNotifications.text.deleteNotifications')}
                </CustomText>
              </Pressable>

              <Pressable
                style={styles.optionItem}
                onPress={() => {
                  if (isListEmpty) return;
                  setIsDeleteModalVisible(true);
                  if (onRequestClose) {
                    onRequestClose();
                  }
                }}
              >
                <View style={styles.iconContainer}>
                  <DeleteAllIcon color={effectiveIconColor} width={iconWidth} height={iconHeight} />
                </View>
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  color={isListEmpty ? theme.colorSecondary200 : theme.newsTextTitlePrincipal}
                >
                  {t('screens.myNotifications.text.deleteAllNotifications')}
                </CustomText>
              </Pressable>

              {!isListEmpty && (
                <Pressable style={styles.optionItem} onPress={onManageNotificationPress}>
                  <View style={styles.iconContainer}>
                    <AlertIcon
                      color={iconColor ?? theme.iconIconographyGenericState}
                      width={iconWidth}
                      height={20}
                    />
                  </View>
                  <CustomText
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                  >
                    {t('screens.myNotifications.text.manageNotifications')}
                  </CustomText>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      <CustomModal
        visible={isDeleteModalVisible}
        modalTitle={t('screens.videos.text.removeFromList')}
        modalMessage={t('screens.videos.text.removeThisVideo')}
        cancelButtonText={t('screens.settings.text.cancel')}
        confirmButtonText={t('screens.videos.text.remove')}
        onCancelPress={onCancelPress}
        onConfirmPress={onConfirmPress}
        onOutsidePress={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        buttonContainerStyle={styles.modalButtonContainer}
        textBoxContainerStyle={styles.textBoxContainerStyle}
        showCrossIcon={false}
        modalContainerStyle={styles.modalContainerStyle}
      />
    </>
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
      paddingTop: actuatedNormalizeVertical(spacing.s),
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingVertical: actuatedNormalizeVertical(spacing.m)
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.s),
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    closeIconContainer: {
      padding: spacing.xxs,
      borderRadius: actuatedNormalize(100),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: borderWidth.m,
      borderColor: theme.dividerGrey,
      marginLeft: actuatedNormalize(spacing.l)
    },
    modalTitle: {
      flex: 1,
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    optionsContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.s)
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.xs)
    },
    optionText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    modalButtonContainer: { paddingTop: 0 },
    textBoxContainerStyle: {
      width: '100%'
    },
    modalContainerStyle: {
      paddingTop: actuatedNormalizeVertical(spacing['4xl'])
    }
  });

export default NotificationOptionsModal;
