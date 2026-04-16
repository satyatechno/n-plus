import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { themeStyles } from '@src/views/organisms/RNVideo/styles';
import {
  FullscreenPortal,
  FullscreenPortalProvider,
  FullscreenPortalHost,
  VideoSettingsBottomSheet
} from '@src/views/organisms/RNVideo/components';
import LiveVideoCore from '@src/views/organisms/RNVideo/components/LiveVideoCore';
import LiveVideoOverlay from '@src/views/organisms/RNVideo/components/LiveVideoOverlay';
import { useVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import { useTheme } from '@src/hooks/useTheme';
import { colors } from '@src/themes/colors';
import useNetworkStore from '@src/zustand/networkStore';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { fontSize } from '@src/config/styleConsts';
import {
  VideoPlayerProvider,
  useVideoPlayerContext
} from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import GeoblockWarningScreen from '@src/views/organisms/RNVideo/components/GeoblockWarningScreen';
import { useLocationStore } from '@src/zustand/locationStore';

const BITRATE_MAPPING: Record<string, number> = {
  '1080': 6000000, // 6 Mbps
  '720': 4000000, // 4 Mbps
  '540': 2500000, // 2.5 Mbps
  '480': 1800000, // 1.8 Mbps
  '360': 1200000, // 1.2 Mbps
  '270': 900000, // 900 kbps
  '240': 900000, // 900 kbps (grouped with 270)
  '180': 600000, // 600 kbps
  auto: 0 // Unlimited
};

export interface RNLiveStreamPlayerProps {
  /** The URL of the live stream to play */
  videoUrl: string;
  /** Whether playback starts automatically (default: true for live) */
  autoStart?: boolean;
  /** Aspect ratio of the player (default: 16/9) */
  aspectRatio?: number;
  /** Callback when an error occurs */
  onError?: (error: unknown) => void;
  /** Analytics configuration for tracking live stream events */
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
    /** Live channel identifier (e.g. 'N+', 'N+ FORO'). Required to trigger af_video_live events. */
    channel?: string;
  };
  /** Whether the video is blocked */
  blocked?: boolean;
}

/**
 * RNLiveStreamPlayerContent - Internal component with live stream logic
 */
const RNLiveStreamPlayerContent = (props: RNLiveStreamPlayerProps) => {
  const { videoUrl, autoStart = true, aspectRatio = 16 / 9, onError } = props;

  // Theme & Navigation
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const isFocused = useIsFocused();
  const { enterPictureInPicture } = useVideoRef();

  // Network
  const isInternetConnection = useNetworkStore((state) => state.isInternetConnection);
  const { isLocationBlocked } = useLocationStore();
  const { shouldPause } = useLiveTVStore();

  // Context State & Actions
  const { state, setIsPlaying, setIsBuffering, setCaptionsEnabled, setIsMuted } =
    useVideoPlayerContext();

  const { isBuffering, captionsEnabled } = state;

  // Fullscreen state - simple local state for live streaming
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Settings bottom sheet visibility
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Selected video quality ('auto' | '1080' | '720' | '480' | etc)
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  // Whether subtitles are available in the stream
  const [hasSubtitles, setHasSubtitles] = useState(false);

  // Fullscreen handlers
  const handleFullScreenPress = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const handleExitFullscreen = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  // Track if auto-started
  const hasAutoStartedRef = useRef(false);

  // Auto-start effect for live streams
  useEffect(() => {
    if (autoStart && !hasAutoStartedRef.current && isInternetConnection && isFocused) {
      hasAutoStartedRef.current = true;
      setIsPlaying(true);
      setIsBuffering(true); // Show loader while initial buffering
    }
  }, [autoStart, isInternetConnection, isFocused, setIsPlaying, setIsBuffering]);

  // Pause when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      setIsPlaying(false);
    } else if (hasAutoStartedRef.current) {
      // Resume when returning to screen
      setIsPlaying(true);
    }
  }, [isFocused, setIsPlaying]);

  // Pause and Mute when Live TV should pause (e.g., WebView opens)
  useEffect(() => {
    if (shouldPause) {
      setIsPlaying(false);
      setIsMuted(true); // Mute when pausing
    } else if (hasAutoStartedRef.current && isFocused) {
      setIsPlaying(true);
    }
  }, [shouldPause, isFocused, setIsPlaying, setIsMuted]);

  // Stable video style
  const videoStyle = useMemo(
    () => (isFullScreen ? styles.fullScreenPlayer : styles.player),
    [isFullScreen, styles.fullScreenPlayer, styles.player]
  );

  // PiP handler
  const handleEnterPiP = useCallback(() => {
    if (isFullScreen) {
      // Exit fullscreen first if active
      setIsFullScreen(false);
      // Wait for layout animation/transition
      setTimeout(() => {
        enterPictureInPicture();
      }, 300);
    } else {
      enterPictureInPicture();
    }
  }, [isFullScreen, enterPictureInPicture]);

  // Settings handler - toggle bottom sheet visibility
  const handleSettingsPress = useCallback(() => {
    setSettingsVisible(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsVisible(false);
  }, []);

  const handleQualityChange = useCallback((quality: string) => {
    setSelectedQuality(quality);
  }, []);

  // State for available video qualities (resolutions)
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);

  // Calculate maxBitRate for iOS (iOS ignores selectedVideoTrack for HLS)
  const maxBitRate = useMemo(() => {
    if (Platform.OS === 'ios' && selectedQuality !== 'auto') {
      return BITRATE_MAPPING[selectedQuality] || 0;
    }
    return 0; // 0 means no limit (or auto)
  }, [selectedQuality]);

  // LiveVideoCore - memoized to prevent recreation
  const stableLiveVideoCore = useMemo(
    () => (
      <LiveVideoCore
        videoUrl={videoUrl}
        style={videoStyle}
        title="N+ Live"
        onError={onError}
        selectedQuality={Platform.OS === 'android' ? selectedQuality : 'auto'} // Explicitly use 'auto' for resolution on iOS to let maxBitRate handle it
        onTextTracksChange={setHasSubtitles}
        captionsEnabled={captionsEnabled}
        onVideoTracksChange={setAvailableQualities}
        maxBitRate={maxBitRate}
      />
    ),
    [videoUrl, videoStyle, onError, selectedQuality, captionsEnabled, maxBitRate]
  );

  // Video content with overlay
  const videoContent = useMemo(
    () => (
      <View style={isFullScreen ? styles.fullScreenPlayer : styles.player}>
        {stableLiveVideoCore}
        <LiveVideoOverlay
          fullScreen={isFullScreen}
          onFullScreenPress={handleFullScreenPress}
          onEnterPiP={handleEnterPiP}
          showPiPIcon={true}
          showSettingsIcon={true}
          onSettingsPress={handleSettingsPress}
        />
        {isBuffering && (
          <View style={loaderStyles.overlay}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}

        {/* Settings Bottom Sheet - Inside Portal to work in Fullscreen */}
        <VideoSettingsBottomSheet
          visible={settingsVisible}
          onClose={handleSettingsClose}
          captionsEnabled={captionsEnabled}
          onCaptionsChange={setCaptionsEnabled}
          currentQuality={selectedQuality}
          onQualityChange={handleQualityChange}
          isLive={true}
          showQualityOption={true}
          showSubtitlesOption={hasSubtitles}
          availableQualities={availableQualities}
        />
      </View>
    ),
    [
      isFullScreen,
      styles.fullScreenPlayer,
      styles.player,
      stableLiveVideoCore,
      handleFullScreenPress,
      handleEnterPiP,
      handleSettingsPress,

      isBuffering,
      settingsVisible,
      captionsEnabled,
      setCaptionsEnabled,
      selectedQuality,
      handleQualityChange,
      handleSettingsClose,
      hasSubtitles
    ]
  );

  // No internet connection
  if (!isInternetConnection) {
    return (
      <ErrorScreen
        status="noInternet"
        showRetryButton={false}
        fontSizeHeading={fontSize.xs}
        fontSizeSubheading={fontSize.xxxs}
        containerStyles={styles.noInternetContainer}
      />
    );
  }

  if (isLocationBlocked) {
    return (
      <View style={[styles.playerContainer, { aspectRatio }]}>
        <GeoblockWarningScreen />
      </View>
    );
  }

  return (
    <View style={[styles.playerContainer, { aspectRatio }]}>
      <FullscreenPortal
        id={`live-stream-${videoUrl}`}
        isActive={isFullScreen}
        onExitFullscreen={handleExitFullscreen}
      >
        {videoContent}
      </FullscreenPortal>

      {/* Settings Bottom Sheet */}
    </View>
  );
};

const loaderStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

/**
 * RNLiveStreamPlayer - Dedicated component for live streaming
 *
 * A specialized video player component optimized for live streaming content.
 * Unlike RNVideoPlayer (VOD), this component:
 * - Always auto-starts playback
 * - Uses optimized buffer configuration for live streams
 * - Shows simplified controls (no seek, no speed, no progress bar)
 * - Displays a LIVE badge
 * - Auto-retries on network errors
 * - Does not pause on headphone disconnect
 *
 * @example
 * <RNLiveStreamPlayer
 *   videoUrl="https://example.com/live.m3u8"
 * />
 */
const RNLiveStreamPlayer = (props: RNLiveStreamPlayerProps) => (
  <VideoPlayerProvider
    initialState={{ isMuted: props.autoStart ?? true }}
    analyticsConfig={props.analyticsConfig}
  >
    <FullscreenPortalProvider>
      <RNLiveStreamPlayerContent {...props} />
      <FullscreenPortalHost />
    </FullscreenPortalProvider>
  </VideoPlayerProvider>
);

export default RNLiveStreamPlayer;
