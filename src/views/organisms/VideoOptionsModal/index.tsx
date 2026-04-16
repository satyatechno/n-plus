import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, Animated } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { fonts } from '@src/config/fonts';
import {
  fontSize,
  lineHeight,
  spacing,
  radius,
  borderWidth,
  fontWeight
} from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import { CrossIcon, ShareIcon, DeleteIcon, BookMark, CheckedBookMark } from '@src/assets/icons';
import { VideoOptionsModalProps } from '@src/models/main/Videos/Videos';
import CustomModal from '@src/views/organisms/CustomModal';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import useAuthStore from '@src/zustand/auth/authStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

const VideoOptionsModal: React.FC<VideoOptionsModalProps> = ({
  visible,
  onRequestClose,
  videoTitle,
  onSharePress,
  onRemovePress,
  onBookmarkPress,
  isBookmarked = false,
  modalOverlayStyle,
  modalContainerStyle,
  modalTitleStyle,
  optionTextStyle,
  iconColor
}) => {
  const [theme] = useTheme();
  const slideAnim = useMemo(() => new Animated.Value(1000), []);
  const { t } = useTranslation();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);

  const onCancelPress = () => {
    setIsDeleteModalVisible(false);
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET_MODAL,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CANCEL,
      content_action: ANALYTICS_ATOMS.TAP,
      content_title: videoTitle,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE
    });
  };

  const onConfirmPress = () => {
    setIsDeleteModalVisible(false);
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET_MODAL,
      content_type: ANALYTICS_MOLECULES.VIDEOS.ELIMINAR,
      content_action: ANALYTICS_ATOMS.TAP,
      content_title: videoTitle,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE
    });
    if (onRemovePress) {
      onRemovePress();
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
  const { guestToken } = useAuthStore();

  return (
    <>
      {guestToken ? (
        <GuestBookmarkModal visible={visible} onClose={onRequestClose} />
      ) : (
        <>
          <GuestBookmarkModal
            visible={bookmarkModalVisible}
            onClose={() => setBookmarkModalVisible(false)}
          />
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
                    fontFamily={fonts.franklinGothicURW}
                    size={fontSize.m}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    textStyles={StyleSheet.flatten([styles.modalTitle, modalTitleStyle])}
                  >
                    {videoTitle}
                  </CustomText>
                  <Pressable onPress={onRequestClose} style={styles.closeIconContainer}>
                    <CrossIcon
                      height={actuatedNormalizeVertical(12)}
                      width={actuatedNormalize(12)}
                      stroke={iconColor}
                    />
                  </Pressable>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                  <Pressable style={styles.optionItem} onPress={onBookmarkPress}>
                    <View style={styles.iconContainer}>
                      {isBookmarked ? (
                        <CheckedBookMark color={iconColor ?? theme.iconIconographyGenericState} />
                      ) : (
                        <BookMark color={iconColor ?? theme.iconIconographyGenericState} />
                      )}
                    </View>
                    <CustomText
                      fontFamily={fonts.franklinGothicURW}
                      textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                    >
                      {isBookmarked
                        ? t('screens.videoOptionsModal.text.saved')
                        : t('screens.videoOptionsModal.text.save')}
                    </CustomText>
                  </Pressable>

                  <Pressable style={styles.optionItem} onPress={onSharePress}>
                    <View style={styles.iconContainer}>
                      <ShareIcon color={iconColor} />
                    </View>
                    <CustomText
                      fontFamily={fonts.franklinGothicURW}
                      textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                    >
                      {t('screens.videoOptionsModal.text.share')}
                    </CustomText>
                  </Pressable>

                  <Pressable
                    style={styles.optionItem}
                    onPress={() => {
                      setIsDeleteModalVisible(true);
                      if (onRequestClose) {
                        onRequestClose();
                      }
                    }}
                  >
                    <View style={styles.iconContainer}>
                      <DeleteIcon fill={iconColor} />
                    </View>
                    <CustomText
                      fontFamily={fonts.franklinGothicURW}
                      textStyles={StyleSheet.flatten([styles.optionText, optionTextStyle])}
                    >
                      {t('screens.videoOptionsModal.text.removeFromMyList')}
                    </CustomText>
                  </Pressable>
                </View>
              </Animated.View>
            </Pressable>
          </Modal>

          <CustomModal
            visible={isDeleteModalVisible}
            modalTitle={t('screens.videos.text.deleteFromList')}
            modalMessage={t('screens.videos.text.removeVideoFromContinueWatching')}
            cancelButtonText={t('screens.settings.text.cancel')}
            confirmButtonText={t('screens.videos.text.remove')}
            onCancelPress={onCancelPress}
            onConfirmPress={onConfirmPress}
            onOutsidePress={() => setIsDeleteModalVisible(false)}
            onRequestClose={() => setIsDeleteModalVisible(false)}
            buttonContainerStyle={styles.modalButtonContainer}
          />
        </>
      )}
    </>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.nPlusFocusModalBackground
    },
    modalContainer: {
      backgroundColor: theme.mainBackgroundSecondary,
      paddingTop: actuatedNormalizeVertical(spacing.s),
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: actuatedNormalize(spacing.m),
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
      lineHeight: lineHeight.l,
      fontWeight: fontWeight.bold
    },
    optionsContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginLeft: actuatedNormalize(spacing.xs),
      marginBottom: spacing.s
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.xs)
    },
    optionText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    modalButtonContainer: { paddingTop: 0 }
  });

export default VideoOptionsModal;
