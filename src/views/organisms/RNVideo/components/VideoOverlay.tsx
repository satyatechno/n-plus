import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, TouchableWithoutFeedback, PanResponder, StyleSheet } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '@src/hooks/useTheme';
import { spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useVideoRef, getGlobalVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import VideoTopControls from '@src/views/organisms/RNVideo/components/VideoTopControls';
import VideoBottomControls from '@src/views/organisms/RNVideo/components/VideoBottomControls';
import { overlayStyles } from '@src/views/organisms/RNVideo/styles';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import { ANALYTICS_MOLECULES, ANALYTICS_ATOMS } from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logVideoEvent } from '@src/services/analytics/videoPlayerContentAnalyticsHelper';

export interface VideoOverlayProps {
  /** Whether the player is in fullscreen mode */
  fullScreen: boolean;
  /** Whether this is a live stream */
  isLive?: boolean;
  /** Whether the player is in reel/shorts mode */
  reelMode?: boolean;
  /** Whether to show the Picture-in-Picture icon */
  showPiPIcon?: boolean;
  /** Callback to toggle fullscreen mode */
  onFullScreenPress: () => void;
  /** Callback to enter Picture-in-Picture mode */
  onEnterPiP: () => void;
  /** Callback to toggle closed captions */
  onToggleCaptions: () => void;
  /** Whether closed captions are enabled */
  captionsEnabled?: boolean;
  /** Whether to show the settings icon */
  showSettingsIcon?: boolean;
  /** Callback when settings icon is pressed */
  onSettingsPress?: () => void;
  /** Analytics configuration for tracking cast button events */
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
    idPage?: string;
    screenPageWebUrl?: string;
    publication?: string;
    duration?: string;
    tags?: string;
    videoType?: string;
    production?: string;
  };
}

const CONTROLS_HIDE_DELAY_MS = 5000;

/**
 * VideoOverlay - Interactive Controls Layer
 *
 * A transparent overlay component that renders all video player controls including
 * top bar (close, captions, cast), bottom bar (play, mute, speed, PiP, fullscreen),
 * and a draggable progress bar with gesture-based seeking.
 *
 * Architecture overview:
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ VideoOverlay (TouchableWithoutFeedback)                         │
 * │  ├── LinearGradient (top/bottom fade for readability)           │
 * │  ├── VideoTopControls                                           │
 * │  │     ├── Close button (fullscreen only)                       │
 * │  │     ├── Captions toggle                                      │
 * │  │     └── Chromecast button                                    │
 * │  └── Bottom Controls Zone (onTouchStart prevents hide)          │
 * │        ├── Progress Bar (PanResponder for drag seek)            │
 * │        │     ├── Animated.View (progress fill)                  │
 * │        │     └── Thumb indicator                                │
 * │        └── VideoBottomControls                                  │
 * │              ├── Play/Pause, Time display, Speed                │
 * │              └── Mute, PiP, Fullscreen                          │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * Behavior & responsibilities:
 * - Auto-hide controls after 5 seconds of inactivity (CONTROLS_HIDE_DELAY_MS)
 * - Tap overlay to toggle controls visibility
 * - Taps on bottom controls zone don't trigger hide (for easier interaction)
 * - Progress bar supports drag-to-seek with real-time preview
 * - Hidden during ad playback to show native IMA SDK UI (Skip, Learn More)
 *
 * Gesture handling:
 * - PanResponder captures drag gestures on progress bar
 * - Calculates seek position relative to progress bar bounds
 * - Updates store and performs native seek on release
 * - Maintains dragging state to prevent auto-hide during seek
 *
 * Side effects & external dependencies:
 * - Reads playback state from rnVideoPlayerStore (isPlaying, currentTime, duration, etc.)
 * - Writes seek position via store.setCurrentTime() and videoRef.seek()
 * - Uses react-native-reanimated for smooth progress bar animations
 * - Accesses global video ref via getGlobalVideoRef() for seek operations
 *
 * @example
 * <VideoOverlay
 *   fullScreen={isFullscreen}
 *   onFullScreenPress={toggleFullscreen}
 *   onEnterPiP={enterPictureInPicture}
 *   onToggleCaptions={toggleCaptions}
 *   captionsEnabled={captionsEnabled}
 * />
 */
const VideoOverlay: React.FC<VideoOverlayProps> = ({
  fullScreen,
  isLive = false,
  reelMode = false,
  showPiPIcon = true,
  onFullScreenPress,
  onEnterPiP,
  onToggleCaptions,
  captionsEnabled = false,
  showSettingsIcon = false,
  onSettingsPress,
  analyticsConfig
}) => {
  const [theme] = useTheme();
  const styles = useMemo(() => overlayStyles(theme), [theme]);

  // Context Actions
  const {
    state,
    togglePlay,
    toggleMute,
    cycleSpeed,
    formatTime,
    setCurrentTime,
    setIsBuffering,
    setPendingSeekResume
  } = useVideoPlayerContext();

  const { isPlaying, isMuted, speed, currentTime, duration, isAdPlaying } = state;

  // Refs for stable access in PanResponder
  const setCurrentTimeRef = useRef(setCurrentTime);
  const setIsBufferingRef = useRef(setIsBuffering);
  const setPendingSeekResumeRef = useRef(setPendingSeekResume);

  useEffect(() => {
    setCurrentTimeRef.current = setCurrentTime;
    setIsBufferingRef.current = setIsBuffering;
    setPendingSeekResumeRef.current = setPendingSeekResume;
  }, [setCurrentTime, setIsBuffering, setPendingSeekResume]);

  // Refs
  const progressBarRef = useRef<View>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef<boolean>(false);
  const progressBarWidth = useRef<number>(0);
  const progressBarX = useRef<number>(0);
  const isBottomZoneTouched = useRef<boolean>(false);

  // Refs for PanResponder closure
  const durationRef = useRef<number>(0);

  // Animated progress
  const progress = useSharedValue(0);

  // Keep durationRef in sync with duration
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Re-measure progress bar when fullScreen changes
  useEffect(() => {
    // Small delay to allow layout to settle after fullscreen transition
    const timer = setTimeout(() => {
      progressBarRef.current?.measureInWindow((x, _y, width) => {
        progressBarX.current = x;
        progressBarWidth.current = width;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [fullScreen]);

  // Ensure video ref hook is initialized
  useVideoRef();

  // Controls visibility state
  const [isControlsVisible, setIsControlsVisible] = React.useState(true);

  // Update progress when currentTime changes
  useEffect(() => {
    if (!isDragging.current && duration > 0) {
      progress.value = currentTime / duration;
    }
  }, [currentTime, duration, progress]);

  // Show controls with auto-hide
  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (!isDragging.current) {
        setIsControlsVisible(false);
      }
    }, CONTROLS_HIDE_DELAY_MS);
  }, []);

  // Initial show and cleanup
  useEffect(() => {
    showControls();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [showControls]);

  // Handle tap on overlay
  const onTap = useCallback(() => {
    // Don't hide controls if bottom zone was touched
    if (isBottomZoneTouched.current) {
      isBottomZoneTouched.current = false;
      showControls(); // Reset hide timer
      return;
    }

    if (isControlsVisible) {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setIsControlsVisible(false);
    } else {
      showControls();
    }
  }, [isControlsVisible, showControls]);

  // Handle touch on bottom controls zone
  const onBottomZoneTouchStart = useCallback(() => {
    isBottomZoneTouched.current = true;
  }, []);

  // Progress bar layout handler
  const handleProgressBarLayout = useCallback(() => {
    progressBarRef.current?.measureInWindow((x, _y, width) => {
      progressBarX.current = x;
      progressBarWidth.current = width;
    });
  }, [fullScreen]);

  // Refs for dynamic offset calculation during drag
  const dragStartX = useRef<number>(0);
  const dragStartProgress = useRef<number>(0);

  // Pan responder for seek gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        // Store the starting position and current progress
        // This allows us to calculate relative movement without relying on potentially stale measureInWindow values
        dragStartX.current = gestureState.x0;
        dragStartProgress.current = progress.value;

        isDragging.current = true;
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
      },
      onPanResponderMove: (_, gestureState) => {
        const width = progressBarWidth.current || 1;
        // Calculate progress change based on how far the finger moved from start position
        const deltaX = gestureState.moveX - dragStartX.current;
        const deltaProgress = deltaX / width;
        const newProgress = Math.min(Math.max(dragStartProgress.current + deltaProgress, 0), 1);

        progress.value = newProgress;

        const currentDuration = durationRef.current;
        if (currentDuration > 0) {
          const newTime = newProgress * currentDuration;
          // Use refs to access context actions
          setCurrentTimeRef.current(newTime);
        }
      },
      onPanResponderRelease: () => {
        const currentDuration = durationRef.current;
        if (currentDuration > 0) {
          const seekTime = progress.value * currentDuration;
          // Log analytics for seeked event
          logSelectContentEvent({
            screen_name: analyticsConfig?.screenName,
            organisms: analyticsConfig?.organisms,
            content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
            content_action: ANALYTICS_ATOMS.SEEKED,
            content_title: analyticsConfig?.videoTitle,
            Tipo_Contenido: analyticsConfig?.contentType
          });

          logVideoEvent({
            screen_name: analyticsConfig?.screenName,
            organisms: analyticsConfig?.organisms,
            content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
            event_action: ANALYTICS_ATOMS.SEEKED,
            event_label: analyticsConfig?.videoTitle,
            Tipo_Contenido: analyticsConfig?.contentType,
            idPage: analyticsConfig?.idPage,
            screen_page_web_url: analyticsConfig?.screenPageWebUrl,
            Fecha_Publicacion_Video: analyticsConfig?.publication,
            Video_Duration: analyticsConfig?.duration,
            video_detail: `${analyticsConfig?.idPage}_${analyticsConfig?.videoType}`,
            EtiquetasVOD: analyticsConfig?.tags,
            production: analyticsConfig?.production
          });

          setIsBufferingRef.current(true);
          setCurrentTimeRef.current(seekTime);
          setPendingSeekResumeRef.current(true);

          const videoRef = getGlobalVideoRef();
          if (videoRef) {
            videoRef.seek(seekTime);
          }
        }
        setTimeout(() => {
          isDragging.current = false;
          setIsControlsVisible(true);
        }, 500);
      }
    })
  ).current;

  // Animated progress bar style
  const progressBarStyle = useAnimatedStyle(() => {
    const widthPercent = Math.min(Math.max(progress.value, 0), 1) * 100;
    return { width: `${widthPercent}%` };
  });

  if (isAdPlaying) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Background tap layer to toggle controls */}
      <TouchableWithoutFeedback onPress={onTap}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {isControlsVisible && (
        <>
          <LinearGradient
            colors={[theme.gradientOverlay91Alpha, 'transparent', theme.gradientOverlay91Alpha]}
            style={StyleSheet.absoluteFill}
          />

          {!reelMode && (
            <VideoTopControls
              fullScreen={fullScreen}
              onPressingCross={onFullScreenPress}
              onToggleCaptions={onToggleCaptions}
              captionsEnabled={captionsEnabled}
              styles={styles}
              isLive={isLive}
              analyticsConfig={analyticsConfig}
            />
          )}

          {/* Bottom controls zone - taps here don't hide controls */}
          <View style={styles.bottomControlsZone} onTouchStart={onBottomZoneTouchStart}>
            {!isLive && (
              <View
                ref={progressBarRef}
                style={StyleSheet.flatten([
                  styles.progressBarContainer,
                  {
                    bottom: actuatedNormalizeVertical(spacing[fullScreen ? '10xl' : '5xl'])
                  }
                ])}
                {...panResponder.panHandlers}
                onLayout={handleProgressBarLayout}
              >
                <Animated.View style={[styles.progressBar, progressBarStyle]}>
                  <View style={styles.progressThumb} />
                </Animated.View>
              </View>
            )}

            <VideoBottomControls
              isMuted={isMuted}
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onChangeSpeed={cycleSpeed}
              onEnterPiP={onEnterPiP}
              formatTime={formatTime}
              theme={theme}
              styles={styles}
              speed={speed}
              isPlaying={isPlaying}
              showPiPIcon={showPiPIcon}
              fullScreen={fullScreen}
              isLive={isLive}
              onFullScreenPress={onFullScreenPress}
              reelMode={reelMode}
              showSettingsIcon={showSettingsIcon}
              onSettingsPress={onSettingsPress}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default React.memo(VideoOverlay);
