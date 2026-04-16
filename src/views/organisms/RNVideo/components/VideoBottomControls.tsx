/**
 * VideoBottomControls - Bottom Playback Control Bar
 *
 * A presentational component that renders the bottom control bar of the video player,
 * including play/pause, time display, speed selector, mute, PiP, and fullscreen buttons.
 *
 * Layout structure:
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Bottom Controls Bar                                             │
 * │  ├── Left Section                                               │
 * │  │     ├── Play/Pause button                                    │
 * │  │     ├── Time display (currentTime / duration)                │
 * │  │     └── Speed selector (1x → 1.5x → 2x → 1x)                 │
 * │  └── Right Section                                              │
 * │        ├── Mute/Unmute button                                   │
 * │        ├── PiP button (when showPiPIcon=true)                   │
 * │        └── Fullscreen button (when reelMode=false)              │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Copyright text (when reelMode=false)                            │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * Behavior & responsibilities:
 * - Pure presentational component (no internal state)
 * - All actions delegated to parent via callback props
 * - Speed cycles through: 1x → 1.5x → 2x → 1x
 * - Live mode hides: time display, speed selector, progress bar
 * - Reel mode hides: fullscreen button, copyright text
 *
 * Visual adaptations:
 * - Fullscreen mode adds bottom padding for safe area
 * - PiP button hidden during ad playback (via showPiPIcon prop)
 * - Speed icon changes based on current speed (1x, 1.5x, 2x icons)
 * - Mute icon toggles between VolumeIcon and NoSound
 *
 * @example
 * <VideoBottomControls
 *   isPlaying={isPlaying}
 *   isMuted={isMuted}
 *   currentTime={currentTime}
 *   duration={duration}
 *   speed={speed}
 *   onTogglePlay={togglePlay}
 *   onToggleMute={toggleMute}
 *   onChangeSpeed={cycleSpeed}
 *   onEnterPiP={enterPiP}
 *   onFullScreenPress={toggleFullscreen}
 *   formatTime={formatTime}
 *   theme={theme}
 *   styles={overlayStyles}
 *   fullScreen={isFullscreen}
 * />
 */
import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize, spacing } from '@src/config/styleConsts';
import {
  Play,
  VideoPause,
  Speed2XIcon,
  VolumeIcon,
  NoSound,
  PIP,
  FullScreen,
  Speed1x
} from '@src/assets/icons';
import SettingsGearIcon from '@src/assets/icons/settings.svg';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import Speed1pt5x from '@src/assets/icons/Speed1pt5x';
import { AppTheme } from '@src/themes/theme';

/**
 * Playback speed constant for 2x multiplier.
 * Used for speed icon selection and comparison.
 */
const SPEED_2X = 2;

/**
 * Playback speed constant for 1.5x multiplier.
 * Used for speed icon selection and comparison.
 */
const SPEED_1_5X = 1.5;

/**
 * Props for the VideoBottomControls component.
 *
 * @property isPlaying - Current playback state for play/pause icon
 * @property isMuted - Current mute state for volume icon
 * @property currentTime - Elapsed time in seconds for time display
 * @property duration - Total duration in seconds for time display
 * @property speed - Current playback speed multiplier (1, 1.5, or 2)
 * @property showPiPIcon - Whether to render PiP button (false during ads)
 * @property fullScreen - Affects padding and layout adjustments
 * @property isLive - Live mode hides time and speed controls
 * @property reelMode - Reel mode hides fullscreen and copyright
 * @property formatTime - Function to convert seconds to display string (MM:SS)
 * @property theme - App theme for icon colors
 * @property styles - Pre-computed style objects from overlayStyles
 */
export interface VideoBottomControlsProps {
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Whether the video is muted */
  isMuted: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total video duration in seconds */
  duration: number;
  /** Current playback speed multiplier */
  speed: number;
  /** Whether to show the Picture-in-Picture icon */
  showPiPIcon?: boolean;
  /** Whether the player is in fullscreen mode */
  fullScreen: boolean;
  /** Whether this is a live stream */
  isLive?: boolean;
  /** Whether the player is in reel/shorts mode */
  reelMode?: boolean;
  /** Callback to toggle play/pause */
  onTogglePlay: () => void;
  /** Callback to toggle mute */
  onToggleMute: () => void;
  /** Callback to cycle through playback speeds */
  onChangeSpeed: () => void;
  /** Callback to enter Picture-in-Picture mode */
  onEnterPiP: () => void;
  /** Callback to open settings/quality menu */
  onSettingsPress?: () => void;
  /** Callback to toggle fullscreen mode */
  onFullScreenPress: () => void;
  /** Function to format time in seconds to display string */
  formatTime: (time: number) => string;
  /** Current app theme */
  theme: AppTheme;
  /** Style definitions for control elements */
  styles: {
    controlsRow: ViewStyle;
    bottomLeftIcons: ViewStyle;
    bottomRightIcons: ViewStyle;
    bottomRightIconsWithoutPiP: ViewStyle;
    bottomRightIconsStyleLive: ViewStyle;
    bottomIconsContainer: ViewStyle;
    bottomIconsContainerPiP: ViewStyle;
    iconWrapper: ViewStyle;
    timeText: TextStyle;
    copyright: TextStyle;
  };
  /** Whether to show the settings icon */
  showSettingsIcon?: boolean;
}

/**
 * Bottom controls bar component implementation.
 *
 * Pure presentational component - receives all state and handlers via props.
 * Memoized with React.memo for performance optimization.
 *
 * @see VideoOverlay - Parent component that provides state and handlers
 * @see VideoTopControls - Complementary top control bar
 */
const VideoBottomControls: React.FC<VideoBottomControlsProps> = ({
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
  onChangeSpeed,
  onEnterPiP,
  onFullScreenPress,
  formatTime,
  theme,
  styles,
  speed,
  isPlaying,
  showPiPIcon = true,
  fullScreen,
  isLive = false,
  reelMode = false,
  showSettingsIcon = false,
  onSettingsPress
}) => {
  const { t } = useTranslation();

  const getBottomRightIconsStyle = () => {
    if (isLive) return styles.bottomRightIconsStyleLive;
    if (!showPiPIcon) return styles.bottomRightIconsWithoutPiP;
    return styles.bottomRightIcons;
  };

  return (
    <View>
      <View
        style={StyleSheet.flatten([
          styles.controlsRow,
          fullScreen ? { paddingBottom: actuatedNormalizeVertical(spacing.m) } : {}
        ])}
      >
        <View style={styles.bottomLeftIcons}>
          <Pressable onPress={onTogglePlay} style={styles.iconWrapper}>
            {isPlaying ? (
              <VideoPause width={28} height={28} fill={theme.iconIconographyActiveState} />
            ) : (
              <Play width={28} height={28} />
            )}
          </Pressable>

          {!isLive && (
            <CustomText
              weight="Boo"
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xxs}
              textStyles={styles.timeText}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </CustomText>
          )}

          {!isLive && !showSettingsIcon && (
            <Pressable onPress={onChangeSpeed}>
              {speed === SPEED_2X ? (
                <Speed2XIcon fill={theme.iconIconographyActiveState} width={28} height={28} />
              ) : speed === SPEED_1_5X ? (
                <Speed1pt5x color={theme.iconIconographyActiveState} width={28} height={28} />
              ) : (
                <Speed1x fill={theme.iconIconographyActiveState} width={28} height={28} />
              )}
            </Pressable>
          )}
        </View>

        <View style={!showPiPIcon ? styles.bottomIconsContainer : styles.bottomIconsContainerPiP}>
          <View style={[getBottomRightIconsStyle()]}>
            <Pressable onPress={onToggleMute}>
              <View>
                {isMuted ? (
                  <NoSound width={28} height={28} />
                ) : (
                  <VolumeIcon width={28} height={28} fill={theme.iconIconographyActiveState} />
                )}
              </View>
            </Pressable>

            {showPiPIcon && (
              <Pressable onPress={onEnterPiP}>
                <PIP width={28} height={28} />
              </Pressable>
            )}

            {showSettingsIcon && onSettingsPress && (
              <Pressable onPress={onSettingsPress}>
                <SettingsGearIcon width={28} height={28} />
              </Pressable>
            )}

            {!reelMode && (
              <Pressable onPress={onFullScreenPress}>
                <FullScreen width={28} height={28} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {!reelMode && (
        <CustomText
          fontFamily={fonts.franklinGothicURW}
          weight="Boo"
          size={6}
          textStyles={styles.copyright}
        >
          {t('screens.jwPlayer.text.copyRight')}
        </CustomText>
      )}
    </View>
  );
};

export default React.memo(VideoBottomControls);
