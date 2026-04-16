import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { themeStyles } from '@src/views/organisms/RNVideo/styles';
import {
  FullscreenPortal,
  FullscreenPortalProvider,
  FullscreenPortalHost,
  VideoCore
} from '@src/views/organisms/RNVideo/components';
import SocialVideoOverlay from '@src/views/organisms/RNVideo/components/SocialVideoOverlay';
import InitialPlayerView from '@src/views/organisms/RNVideo/components/InitialPlayerView';

import { useTheme } from '@src/hooks/useTheme';

import {
  VideoPlayerProvider,
  useVideoPlayerContext
} from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import useNetworkStore from '@src/zustand/networkStore';
import ErrorScreen from '@src/views/organisms/ErrorScreen';

import { ResizeMode } from 'react-native-video';

// Hooks
import { useVideoHandlers } from '@src/views/organisms/RNVideo/hooks/useVideoHandlers';
import { useVideoLifecycle } from '@src/views/organisms/RNVideo/hooks/useVideoLifecycle';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';

const DEFAULT_PERFORMANCE_CONFIG = {
  lowMemoryMode: true,
  progressUpdateInterval: 500,
  // Ensure playback stops when app is backgrounded/locked (e.g. power button press)
  disableBackgroundPlayback: true
};

export interface RNSocialVideoPlayerProps {
  videoUrl: string;
  aspectRatio?: number;
  autoStart?: boolean;
  thumbnail?: string;
  isMutedProp?: boolean;
  isActive?: boolean;
  onSharePress?: () => void;
}

const RNSocialVideoPlayerContent = (props: RNSocialVideoPlayerProps) => {
  const {
    videoUrl,
    aspectRatio = 16 / 9,
    autoStart = true,
    thumbnail,
    isMutedProp = true,
    isActive = true,
    onSharePress
  } = props;

  // Theme
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const isFocused = useIsFocused();
  const isInternetConnection = useNetworkStore((state) => state.isInternetConnection);

  // Context
  const { setIsPlaying, setIsMuted } = useVideoPlayerContext();

  // Local State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasStarted, setHasStarted] = useState<boolean>(autoStart);
  const hasAutoStartedRef = useRef(false);

  // Store
  const currentVideoType = useVideoPlayerStore((state) => state.currentVideoType);
  const activeVideoUrl = useVideoPlayerStore((state) => state.activeVideoUrl);

  // Initial constants
  // For social/carousel videos we don't strictly have a unique videoType passed via props currently,
  // but we can register them as 'social' or use the URL as a unique footprint.
  const videoTypeFootprint = `social-${videoUrl}`;

  // --- Hooks ---

  const { handleStart } = useVideoHandlers({
    videoUrl,
    videoType: videoTypeFootprint,
    initialSeekTime: 0,
    isInternetConnection,
    runOnPlay: true,
    setHasStarted
  });

  useVideoLifecycle({
    isFocused,
    currentVideoType: currentVideoType ?? '',
    videoType: videoTypeFootprint,
    setHasStarted
  });

  // --- Local Logic ---

  const handleFullScreenPress = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const handleExitFullscreen = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  const resizeMode = useMemo(() => {
    if (isFullScreen) return ResizeMode.CONTAIN;
    // The Carousel card strictly enforces the video's aspect ratio on its container.
    // CONTAIN on Android lists sometimes yields a black screen due to texture size mismatch,
    // Using COVER safely matches the exact bounds without crop due to aforementioned aspect ratio match.
    return ResizeMode.COVER;
  }, [isFullScreen]);

  // --- Auto Play / Network Logic ---

  useEffect(() => {
    if (isMutedProp) {
      setIsMuted(true);
    }
  }, [isMutedProp, setIsMuted]);

  // Auto-start (Triggered once when conditions are met)
  useEffect(() => {
    if (!isActive) return;

    if (autoStart && !hasAutoStartedRef.current && isInternetConnection && isFocused) {
      hasAutoStartedRef.current = true;
      handleStart();
    }
  }, [autoStart, isActive, isInternetConnection, isFocused, handleStart]);

  // Cleanup when becoming inactive (prevent multi-decoder crash on Android)
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
      setHasStarted(false); // Unmount decoder completely when off-screen

      // Allow restarting if it becomes active again
      hasAutoStartedRef.current = false;
    }
  }, [isActive, setIsPlaying, setHasStarted]);

  // Cross-Player Collision Prevention: Pause if a different video grabs the active global state
  useEffect(() => {
    if (currentVideoType !== videoTypeFootprint && (activeVideoUrl || '') !== videoUrl) {
      setIsPlaying(false);
      setHasStarted(false);
      hasAutoStartedRef.current = false; // allow to restart if it gets focus again
    }
  }, [currentVideoType, videoTypeFootprint, activeVideoUrl, videoUrl, setIsPlaying]);

  // --- Render ---

  // 1. Render Video Core (Memoized)
  const stableVideoCore = useMemo(
    () => (
      <VideoCore
        videoUrl={videoUrl}
        style={isFullScreen ? styles.fullScreenPlayer : styles.player}
        resizeMode={resizeMode}
        thumbnail={thumbnail}
        performanceConfig={DEFAULT_PERFORMANCE_CONFIG}
        // We might need to add onEnd to replay or show replay button. For now let's stop.
      />
    ),
    [videoUrl, styles, resizeMode, thumbnail, isFullScreen]
  );

  // Overlay
  const overlay = (
    <SocialVideoOverlay
      onFullScreenPress={handleFullScreenPress}
      onSharePress={onSharePress}
      aspectRatio={aspectRatio}
    />
  );

  const videoContent = (
    <View style={isFullScreen ? styles.fullScreenPlayer : styles.player}>
      {stableVideoCore}
      {overlay}
    </View>
  );

  // 2. Render Lazy Thumbnail if Not Started OR Not Active
  if (!hasStarted || !isActive) {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
        <InitialPlayerView
          thumbnail={thumbnail}
          aspectRatio={aspectRatio}
          onStart={handleStart}
          reelMode={true} // Re-use reel icon style inside card
        />
      </View>
    );
  }

  if (!isInternetConnection) {
    return (
      <ErrorScreen
        status="noInternet"
        showRetryButton={false}
        containerStyles={styles.noInternetContainer}
      />
    );
  }

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
      <FullscreenPortal
        id={`social-video-${videoUrl}`}
        isActive={isFullScreen}
        onExitFullscreen={handleExitFullscreen}
      >
        {videoContent}
      </FullscreenPortal>
    </View>
  );
};

const RNSocialVideoPlayer = (props: RNSocialVideoPlayerProps) => (
  <VideoPlayerProvider>
    <FullscreenPortalProvider>
      <RNSocialVideoPlayerContent {...props} />
      <FullscreenPortalHost />
    </FullscreenPortalProvider>
  </VideoPlayerProvider>
);

export default RNSocialVideoPlayer;
