import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLazyQuery } from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';

import { BackArrow, BookMark, CheckedBookMark, IncreaseIcon } from '@src/assets/icons';
import ShareIcon from '@src/assets/icons/Share';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';

import { RootStackParamList } from '@src/navigation/types';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import useAuthStore from '@src/zustand/auth/authStore';
import CustomModal from '@src/views/organisms/CustomModal';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { themeStyles } from '@src/views/organisms/BottomNavigationBar/styles';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { TextSize } from '@src/models/main/MyAccount/Settings';
import { shareContent } from '@src/utils/shareContent';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/utils/storyAnalyticsHelpers';

interface StoryData {
  id?: string;
  fullPath?: string;
  title?: string;
  openingType?: string;
  displayType?: string;
  category?: { title?: string };
  provinces?: Array<{ title?: string }>;
  topics?: Array<{ title?: string }>;
  channel?: { title?: string };
  production?: { title?: string };
}

interface BottomNavigationBarProps {
  item: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    isBookmarked: boolean;
    goBack: () => void;
    heroImage?: Array<{ url: string }>;
    fullPath?: string;
  };
  onToggleBookmark?: (id: string) => void;
  customTheme?: 'light' | 'dark';
  story?: StoryData | null;
  currentSlug?: string;
  previousSlug?: string;
  screenName?: string;
  tipoContenido?: string;
}

const BottomNavigationBar = ({
  item,
  onToggleBookmark,
  customTheme,
  story,
  currentSlug,
  previousSlug,
  screenName,
  tipoContenido
}: BottomNavigationBarProps) => {
  const textSize = useSettingsStore((state) => state.textSize);
  const setTextSize = useSettingsStore((state) => state.setTextSize);
  const [showTextSizeModal, setShowTextSizeModal] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const { guestToken, clearAuth } = useAuthStore();
  const {
    setIsVideoPlaying,
    setIsPipMode,
    setIsMediaPipMode,
    setIsMediaVideoPlaying,
    setActiveVideoUrl
  } = useVideoPlayerStore();

  const [toggleBookmarkByUser] = useLazyQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const [theme] = useTheme(customTheme);
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  useEffect(() => {
    toggleBookmark(item?.id);
  }, []);

  const handleBookmarkPress = async () => {
    if (story && currentSlug) {
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.BOTTOM_NAVIGATION_BAR.BUTTON_BOOKMARK,
        contentName: item?.title || '',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: isToggleBookmark ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK
      });
    }

    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    onToggleBookmark?.(item?.id);
    setIsToggleBookmark(!isToggleBookmark);
  };

  const toggleBookmark = async (contentId: string) => {
    const res = await toggleBookmarkByUser({
      variables: { contentId: contentId, type: 'Content' }
    });
    setIsToggleBookmark(res.data.isBookmarkedByUser);
  };

  const onSharePress = async () => {
    if (story && currentSlug) {
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.BOTTOM_NAVIGATION_BAR.BUTTON_SHARE,
        contentName: story?.title || item?.title || '',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: ANALYTICS_ATOMS.SHARE
      });
    }

    if (!item?.fullPath) return;

    await shareContent({ fullPath: item.fullPath });
  };

  const handleTextSizeChange = (size: TextSize) => {
    if (story && currentSlug) {
      const sizeMap: Record<TextSize, number> = {
        Chica: 1,
        Mediana: 2,
        Grande: 3,
        System: 1
      };

      const radioNumber = sizeMap[size] || 1;
      const content_action = `radio | ${radioNumber}`;

      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL_TYPOGRAPHY,
        molecule: ANALYTICS_MOLECULES.OPINION.FONT_SIZE_SELECTOR,
        contentName: story?.title || item?.title || '',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: content_action
      });
    }

    setTextSize(size);
    setShowTextSizeModal(false);
  };

  const handleOpenTextSizeModal = () => {
    if (story && currentSlug) {
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.BOTTOM_NAVIGATION_BAR.BUTTON_SIZE_TIPOGRAPHY,
        contentName: story?.title || item?.title || 'undefined',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: ANALYTICS_ATOMS.TEXT_INCREASE
      });
    }
    setShowTextSizeModal(true);
  };

  const handleCloseTextSizeModal = () => {
    if (story && currentSlug) {
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.BOTTOM_NAVIGATION_BAR.BUTTON_SIZE_TIPOGRAPHY,
        contentName: story?.title || item?.title || '',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: ANALYTICS_ATOMS.TEXT_INCREASE
      });
    }
    setShowTextSizeModal(false);
  };

  const goBack = () => {
    if (story && currentSlug) {
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.OPINION.BOTTOMNAV_FINAL,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.BOTTOM_NAVIGATION_BAR.BUTTON_BACK,
        contentName: story?.title || item?.title || '',
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido,
        contentAction: ANALYTICS_ATOMS.ARROW_BACK
      });
    }

    setIsPipMode(false);
    setIsVideoPlaying(false);
    setIsMediaVideoPlaying(false);
    setIsMediaPipMode(false);
    setActiveVideoUrl('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          `${theme.gradientBackground}FF`,
          `${theme.gradientBackgroundSecondary}E6`,
          `${theme.gradientBackgroundTertiary}E6`,
          `${theme.gradientBackgroundQuaternary}CC`
        ]}
        locations={[0.3, 0.7, 0.9, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <BackArrow fill={theme.tagsTextAuthor} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={onSharePress}>
            <ShareIcon color={theme.tagsTextAuthor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={handleBookmarkPress}>
            {isToggleBookmark ? (
              <CheckedBookMark color={theme.tagsTextAuthor} />
            ) : (
              <BookMark color={theme.tagsTextAuthor} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={handleOpenTextSizeModal}>
            <IncreaseIcon fill={theme.tagsTextAuthor} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showTextSizeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseTextSizeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseTextSizeModal}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.popoverContainer}>
            <View style={styles.popoverBox}>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                weight="Med"
                size={14}
                textStyles={styles.modalTitle}
              >
                {t('screens.storyPageNavigator.text.selectSize')}
              </CustomText>

              <View style={styles.segmentContainer}>
                {(['Chica', 'Mediana', 'Grande'] as TextSize[]).map((size) => {
                  const isActive = textSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={styles.radioOption}
                      onPress={() => handleTextSizeChange(size)}
                    >
                      <View style={[styles.radioCircle, isActive && styles.radioCircleSelected]}>
                        {isActive && <View style={styles.radioDot} />}
                      </View>

                      <CustomText
                        fontFamily={fonts.franklinGothicURW}
                        size={12}
                        weight={isActive ? 'Dem' : 'Boo'}
                        textStyles={[styles.radioLabel, isActive ? styles.radioLabelSelected : {}]}
                      >
                        {size}
                      </CustomText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.pointerContainer}>
              <View style={styles.pointer} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <CustomModal
        visible={bookmarkModalVisible}
        modalTitle={t('screens.guestMyAccount.restricted.acessBookmarks')}
        modalMessage={t('screens.guestMyAccount.restricted.simplyLogIn')}
        cancelButtonText={t('screens.splash.text.login')}
        confirmButtonText={t('screens.splash.text.signUp')}
        onCancelPress={() => {
          setBookmarkModalVisible(false);
          clearAuth(true);
        }}
        onConfirmPress={() => {
          setBookmarkModalVisible(false);
          clearAuth();
        }}
        onOutsidePress={() => setBookmarkModalVisible(false)}
        onRequestClose={() => setBookmarkModalVisible(false)}
        buttonContainerStyle={{ paddingTop: 0 }}
      />
    </View>
  );
};

export default BottomNavigationBar;
