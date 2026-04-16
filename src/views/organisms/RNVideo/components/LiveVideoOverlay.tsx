import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '@src/hooks/useTheme';
import { useVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import VideoTopControls from '@src/views/organisms/RNVideo/components/VideoTopControls';
import VideoBottomControls from '@src/views/organisms/RNVideo/components/VideoBottomControls';
import { overlayStyles } from '@src/views/organisms/RNVideo/styles';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import { createVideoLiveTracker } from '@src/services/analytics/videoLiveAnalyticsHelpers';
import { logLiveVideoEvent } from '@src/services/analytics/videoPlayerContentAnalyticsHelper';
import { getCurrentSignalTime } from '@src/utils/dateFormatter';

export interface LiveVideoOverlayProps {
  /** Whether the player is in fullscreen mode */
  fullScreen: boolean;
  /** Whether the player is in reel/shorts mode */
  reelMode?: boolean;
  /** Whether to show the Picture-in-Picture icon */
  showPiPIcon?: boolean;
  /** Callback to toggle fullscreen mode */
  onFullScreenPress: () => void;
  /** Callback to enter Picture-in-Picture mode */
  onEnterPiP?: () => void;
  /** Callback to toggle closed captions */
  onToggleCaptions?: () => void;
  /** Whether closed captions are enabled */
  captionsEnabled?: boolean;
  /** Whether to show the settings icon */
  showSettingsIcon?: boolean;
  /** Callback when settings icon is pressed */
  onSettingsPress?: () => void;
}

const CONTROLS_HIDE_DELAY_MS = 5000;

/**
 * LiveVideoOverlay - Interactive Controls Layer for Live Streaming
 *
 * A transparent overlay component that renders video player controls for live streaming.
 * This is based on VideoOverlay but optimized for live content:
 * - No progress bar (live streams don't have seekable progress)
 * - No speed controls (live must play at 1x)
 * - No time display (duration is not applicable for live)
 * - Shows LIVE badge via VideoTopControls
 *
 * Architecture overview:
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LiveVideoOverlay (TouchableWithoutFeedback)                     │
 * │  ├── LinearGradient (top/bottom fade for readability)           │
 * │  ├── VideoTopControls                                           │
 * │  │     ├── Close button (fullscreen only)                       │
 * │  │     ├── Captions toggle                                      │
 * │  │     ├── Chromecast button                                    │
 * │  │     └── LIVE badge (via isLive=true)                         │
 * │  └── Bottom Controls Zone                                       │
 * │        └── VideoBottomControls                                  │
 * │              ├── Play/Pause                                     │
 * │              ├── Mute/Unmute                                    │
 * │              ├── PiP button                                     │
 * │              └── Fullscreen button                              │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @example
 * <LiveVideoOverlay
 *   fullScreen={isFullscreen}
 *   onFullScreenPress={toggleFullscreen}
 *   onEnterPiP={enterPictureInPicture}
 *   onToggleCaptions={toggleCaptions}
 *   captionsEnabled={captionsEnabled}
 * />
 */
const LiveVideoOverlay: React.FC<LiveVideoOverlayProps> = ({
  fullScreen,
  reelMode = false,
  showPiPIcon = true,
  onFullScreenPress,
  onEnterPiP = () => {},
  onToggleCaptions = () => {},
  captionsEnabled = false,
  showSettingsIcon = true,
  onSettingsPress
}) => {
  const [theme] = useTheme();
  const styles = useMemo(() => overlayStyles(theme), [theme]);

  // Context Actions
  const { state, togglePlay, toggleMute, cycleSpeed, formatTime, analyticsConfig } =
    useVideoPlayerContext();

  const { isPlaying, isMuted, speed, currentTime, duration, isAdPlaying } = state;

  // ─── af_video_live tracker ─────────────────────────────────────────────────
  const liveTracker = useMemo(
    () =>
      analyticsConfig?.channel
        ? createVideoLiveTracker({
            channel: analyticsConfig.channel,
            videoTitle: analyticsConfig?.videoTitle
          })
        : null,
    [analyticsConfig?.channel, analyticsConfig?.videoTitle]
  );
  // ─────────────────────────────────────────────────────────────────────────

  // Analytics handlers
  const handleFullScreenPress = useCallback(() => {
    AnalyticsService.logEvent('select_content', {
      screenName: ANALYTICS_COLLECTION.LIVE,
      organisms: ANALYTICS_ORGANISMS.LIVE.LIVE_PRINCIPAL,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.FULLSCREEN,
      content_title: 'N+ Live',
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`
    });
    logLiveVideoEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.PIP,
      event_label: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType,
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      production: analyticsConfig?.channel,
      signal_time: getCurrentSignalTime()
    });

    // af_video_live: fullscreen (enter) / exit_fullscreen (exit)
    if (fullScreen) {
      liveTracker?.liveVideoExitFullscreen();
    } else {
      liveTracker?.liveVideoFullscreen();
    }

    onFullScreenPress();
  }, [onFullScreenPress, liveTracker, fullScreen]);

  const handleEnterPiP = useCallback(() => {
    AnalyticsService.logEvent('select_content', {
      screenName: ANALYTICS_COLLECTION.LIVE,
      organisms: ANALYTICS_ORGANISMS.LIVE.LIVE_PRINCIPAL,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.PIP,
      content_title: 'N+ Live',
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`
    });
    logLiveVideoEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.PIP,
      event_label: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType,
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      production: analyticsConfig?.channel,
      signal_time: getCurrentSignalTime()
    });
    onEnterPiP();
  }, [onEnterPiP]);

  // Refs
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const isBottomZoneTouched = useRef<boolean>(false);

  // Ensure video ref hook is initialized
  useVideoRef();

  // Controls visibility state
  const [isControlsVisible, setIsControlsVisible] = React.useState(true);

  // Show controls with auto-hide
  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setIsControlsVisible(false);
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

          <VideoTopControls
            fullScreen={fullScreen}
            onPressingCross={handleFullScreenPress}
            onToggleCaptions={onToggleCaptions}
            captionsEnabled={captionsEnabled}
            styles={styles}
            isLive={true}
          />

          {/* Bottom controls zone - taps here don't hide controls */}
          {/* No progress bar for live streams */}
          <View style={styles.bottomControlsZone} onTouchStart={onBottomZoneTouchStart}>
            <VideoBottomControls
              isMuted={isMuted}
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onChangeSpeed={cycleSpeed}
              onEnterPiP={handleEnterPiP}
              formatTime={formatTime}
              theme={theme}
              styles={styles}
              speed={speed}
              isPlaying={isPlaying}
              showPiPIcon={showPiPIcon}
              fullScreen={fullScreen}
              isLive={true}
              onFullScreenPress={handleFullScreenPress}
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

export default React.memo(LiveVideoOverlay);
