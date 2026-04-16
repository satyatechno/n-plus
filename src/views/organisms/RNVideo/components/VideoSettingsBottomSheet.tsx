/**
 * VideoSettingsBottomSheet - Settings Menu for Video Player
 *
 * A bottom sheet modal with submenu navigation:
 * - Main menu: Subtitles, Speed, Quality
 * - Submenus: Individual selection options with checkmarks
 */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Modal, Pressable, StyleSheet, View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import { colors } from '@src/themes/colors';
import { fonts } from '@src/config/fonts';
import { fontSize, spacing, radius, lineHeight, letterSpacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import {
  Speed1x,
  VideoQualityIcon,
  ArrowForwardIcon,
  VideoQualityCheckIcon
} from '@src/assets/icons';
import ClosedCaption from '@src/assets/icons/closed_caption.svg';

type SettingsView = 'main' | 'subtitles' | 'speed' | 'quality';

export interface QualityOption {
  label: string;
  value: string;
  isRecommended?: boolean;
}

export interface VideoSettingsBottomSheetProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Whether captions are currently enabled */
  captionsEnabled?: boolean;
  /** Callback when captions setting changes */
  onCaptionsChange?: (enabled: boolean) => void;
  /** Current playback speed */
  currentSpeed?: number;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
  /** Current quality value */
  currentQuality?: string;
  /** Available quality options */
  qualityOptions?: QualityOption[];
  /** Callback when quality changes */
  onQualityChange?: (quality: string) => void;
  /** Whether to show quality option */
  showQualityOption?: boolean;
  /** Whether this is a live stream (hides speed option) */
  isLive?: boolean;
  /** Whether to show subtitles option (false when no text tracks available) */
  showSubtitlesOption?: boolean;
  /** List of available resolutions (e.g. ['720', '1080']) */
  availableQualities?: string[];
}

const SPEED_OPTIONS = [
  { label: '2X', value: 2 },
  { label: '1.5X', value: 1.5 },
  { label: '1X', value: 1, isNormal: true }
];

const VideoSettingsBottomSheet: React.FC<VideoSettingsBottomSheetProps> = ({
  visible,
  onClose,
  availableQualities = [],
  captionsEnabled = false,
  onCaptionsChange,
  currentSpeed = 1,
  onSpeedChange,
  currentQuality = 'auto',
  onQualityChange,
  showQualityOption = true,
  isLive = false,
  showSubtitlesOption = true
}) => {
  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(), [theme]);

  // Internal navigation state
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  // Reset to main view when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentView('main');
    }
  }, [visible]);

  const getSpeedLabel = (speed: number): string => {
    if (speed === 1.5) return '1.5X';
    if (speed === 2) return '2X';
    return '1X';
  };

  // Compute quality options derived from availableQualities or fallback
  const derivedQualityOptions = useMemo(() => {
    const options: { label: string; value: string; subtitle?: string }[] = [];
    // Always add Auto option
    options.push({ label: 'Automática', value: 'auto', subtitle: '' });

    if (availableQualities && availableQualities.length > 0) {
      availableQualities.forEach((q) => {
        options.push({ label: `${q}p`, value: q, subtitle: '' });
      });
    } else {
      // Fallback default list if no dynamic qualities found
      const defaults = ['1080', '720', '540', '480', '360', '240'];
      defaults.forEach((q) => {
        options.push({ label: `${q}p`, value: q, subtitle: '' });
      });
    }
    return options;
  }, [availableQualities]);

  const getQualityLabel = (): string => {
    const option = derivedQualityOptions.find((q) => q.value === currentQuality);
    return option?.label || 'Automática';
  };

  // Navigation handlers
  const navigateToSubtitles = useCallback(() => setCurrentView('subtitles'), []);
  const navigateToSpeed = useCallback(() => setCurrentView('speed'), []);
  const navigateToQuality = useCallback(() => setCurrentView('quality'), []);

  // Selection handlers
  const handleCaptionsSelect = useCallback(
    (enabled: boolean) => {
      onCaptionsChange?.(enabled);
      setCurrentView('main');
    },
    [onCaptionsChange]
  );

  const handleSpeedSelect = useCallback(
    (speed: number) => {
      onSpeedChange?.(speed);
      setCurrentView('main');
    },
    [onSpeedChange]
  );

  const handleQualitySelect = useCallback(
    (quality: string) => {
      onQualityChange?.(quality);
      setCurrentView('main');
    },
    [onQualityChange]
  );

  // Render selection row with checkmark
  const renderSelectionRow = (
    key: string,
    label: string,
    isSelected: boolean,
    onPress: () => void,
    subtitle?: string
  ) => (
    <Pressable
      key={key}
      style={[styles.selectionRow, isSelected && styles.selectionRowSelected]}
      onPress={onPress}
    >
      <View style={styles.checkPlaceholder}>
        {isSelected && (
          <VideoQualityCheckIcon width={actuatedNormalize(24)} height={actuatedNormalize(24)} />
        )}
      </View>
      <CustomText
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.m}
        textStyles={styles.selectionLabel}
      >
        {label}
        {subtitle && (
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.s}
            textStyles={styles.superscript}
          >
            {subtitle}
          </CustomText>
        )}
      </CustomText>
    </Pressable>
  );

  // Render submenu header
  const renderSubmenuHeader = (title: string, subtitle: string) => (
    <View style={styles.submenuHeader}>
      <CustomText
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.xs}
        textStyles={styles.submenuTitle}
      >
        {title}
      </CustomText>
      {subtitle && (
        <>
          <View style={styles.headerDot} />
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.m}
            textStyles={styles.submenuSubtitle}
          >
            {subtitle}
          </CustomText>
        </>
      )}
    </View>
  );

  // Render main menu view
  const renderMainMenu = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {/* Subtitles Option - only shown when text tracks are available */}
      {showSubtitlesOption && (
        <Pressable style={styles.optionRow} onPress={navigateToSubtitles}>
          <View style={styles.optionLeft}>
            <View style={styles.iconContainer}>
              <ClosedCaption width={24} height={24} />
            </View>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.m}
              textStyles={styles.optionLabel}
            >
              {t('screens.jwPlayer.text.subtitles', 'Subtítulos')}
            </CustomText>
          </View>
          <View style={styles.optionRight}>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.s}
              textStyles={styles.optionValue}
            >
              {captionsEnabled
                ? t('screens.jwPlayer.text.activated', 'Activados')
                : t('screens.jwPlayer.text.deactivated', 'Desactivados')}
            </CustomText>
            <ArrowForwardIcon width={24} height={24} color="white" />
          </View>
        </Pressable>
      )}

      {/* Speed Option - hidden for live streams */}
      {!isLive && (
        <Pressable style={styles.optionRow} onPress={navigateToSpeed}>
          <View style={styles.optionLeft}>
            <View style={styles.iconContainer}>
              <Speed1x fill="white" />
            </View>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.m}
              textStyles={styles.optionLabel}
            >
              {t('screens.jwPlayer.text.playbackSpeed', 'Velocidad de reproducción')}
            </CustomText>
          </View>
          <View style={styles.optionRight}>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.s}
              textStyles={styles.optionValue}
            >
              {getSpeedLabel(currentSpeed)}
            </CustomText>
            <ArrowForwardIcon width={24} height={24} color="white" />
          </View>
        </Pressable>
      )}

      {/* Quality Option */}
      {showQualityOption && (
        <Pressable style={styles.optionRow} onPress={navigateToQuality}>
          <View style={styles.optionLeft}>
            <View style={styles.iconContainer}>
              <VideoQualityIcon width={24} height={24} />
            </View>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.m}
              textStyles={styles.optionLabel}
            >
              {t('screens.jwPlayer.text.quality', 'Calidad')}
            </CustomText>
          </View>
          <View style={styles.optionRight}>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.s}
              textStyles={styles.optionValue}
            >
              {getQualityLabel()}
            </CustomText>
            <ArrowForwardIcon width={24} height={24} color="white" />
          </View>
        </Pressable>
      )}
    </Animated.View>
  );

  // Render subtitles submenu
  const renderSubtitlesMenu = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {renderSubmenuHeader(
        t('screens.jwPlayer.text.subtitles', 'Subtítulos'),
        captionsEnabled ? 'Activados' : 'Desactivados'
      )}
      {renderSelectionRow('captions-on', 'Activados', captionsEnabled, () =>
        handleCaptionsSelect(true)
      )}
      {renderSelectionRow('captions-off', 'Desactivados', !captionsEnabled, () =>
        handleCaptionsSelect(false)
      )}
    </Animated.View>
  );

  // Render speed submenu
  const renderSpeedMenu = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {renderSubmenuHeader(
        t('screens.jwPlayer.text.speed', 'Velocidad'),
        `${getSpeedLabel(currentSpeed)} Normal`
      )}
      {SPEED_OPTIONS.map((option) =>
        renderSelectionRow(
          `speed-${option.value}`,
          option.label,
          currentSpeed === option.value,
          () => handleSpeedSelect(option.value)
        )
      )}
    </Animated.View>
  );

  // Render quality submenu
  const renderQualityMenu = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {renderSubmenuHeader(
        t('screens.jwPlayer.text.quality', 'Calidad'),
        derivedQualityOptions.find((q) => q.value === currentQuality)?.label ||
          t('screens.jwPlayer.text.automatic', 'Automática')
      )}
      {derivedQualityOptions.map((option) =>
        renderSelectionRow(
          `quality-${option.value}`,
          option.label,
          currentQuality === option.value,
          () => handleQualitySelect(option.value),
          option.value === '1080' ? 'HD' : undefined
        )
      )}
    </Animated.View>
  );

  // Render current view content
  const renderContent = () => {
    const viewMap: Record<SettingsView, () => React.ReactNode> = {
      main: renderMainMenu,
      subtitles: renderSubtitlesMenu,
      speed: renderSpeedMenu,
      quality: renderQualityMenu
    };

    const renderView = viewMap[currentView] || renderMainMenu;
    return renderView();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View>{renderContent()}</View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const themeStyles = () =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
      backgroundColor: colors.darkCharcoal, // Matches Figma #2C2E33
      borderRadius: 16, // Floating menu has all corners rounded
      marginHorizontal: actuatedNormalize(16), // Floating side margins
      marginBottom: actuatedNormalizeVertical(32), // Floating bottom margin
      paddingTop: actuatedNormalizeVertical(8), // Figma spec
      paddingHorizontal: actuatedNormalize(16), // Figma spec
      paddingBottom: actuatedNormalizeVertical(24), // Figma spec
      maxWidth: actuatedNormalize(400), // Limit width on landscape
      width: '90%', // Responsive width up to maxWidth
      alignSelf: 'center', // Center in landscape
      maxHeight: '80%' // Allow scrolling if content is too tall
    },
    dragHandle: {
      width: actuatedNormalize(40),
      height: actuatedNormalizeVertical(4),
      backgroundColor: '#666',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(12) // Restore margin since gap is removed
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: actuatedNormalizeVertical(spacing.xxxxs), // Reduced from 24 to 12
      marginBottom: actuatedNormalizeVertical(12) // Simulate gap
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    optionRight: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    iconContainer: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.m)
    },

    optionLabel: {
      color: 'white',
      fontFamily: fonts.franklinGothicURW,
      fontSize: fontSize.xxs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none
    },
    optionValue: {
      color: 'white',
      opacity: 0.7,
      fontFamily: fonts.franklinGothicURW,
      fontSize: fontSize.xxs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none,
      marginRight: actuatedNormalize(spacing.s)
    },
    submenuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    submenuTitle: {
      color: 'white',
      fontWeight: '600',
      fontSize: fontSize.xs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none
    },
    headerDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#666',
      marginHorizontal: actuatedNormalize(spacing.s)
    },
    submenuSubtitle: {
      color: '#8C93A2',
      fontWeight: '400',
      fontFamily: fonts.franklinGothicURW,
      fontSize: fontSize.xxs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none,
      flex: 1
    },
    selectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: actuatedNormalizeVertical(spacing.xxxxs),
      paddingHorizontal: actuatedNormalize(spacing.m),
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(12)
    },
    selectionRowSelected: {
      backgroundColor: '#3A3C42'
    },
    checkPlaceholder: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: actuatedNormalize(spacing.m)
    },
    selectionLabel: {
      color: 'white',
      fontFamily: fonts.franklinGothicURW,
      fontSize: fontSize.xxs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none
    },
    superscript: {
      color: 'white',
      fontSize: 10,
      lineHeight: 14,
      textAlignVertical: 'top',
      marginTop: -2
    }
  });

export default React.memo(VideoSettingsBottomSheet);
