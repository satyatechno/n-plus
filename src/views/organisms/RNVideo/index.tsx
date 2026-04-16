import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState, AppStateStatus } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { themeStyles } from '@src/views/organisms/RNVideo/styles';
import { RNVideoPlayerProps } from '@src/views/organisms/RNVideo/types';
import {
  VideoCore,
  VideoOverlay,
  FullscreenPortal,
  FullscreenPortalProvider,
  FullscreenPortalHost,
  VODSettingsBottomSheet
} from '@src/views/organisms/RNVideo/components';
import {
  useVideoTransition,
  useVideoLifecycle,
  useVideoHandlers
} from '@src/views/organisms/RNVideo/hooks';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize } from '@src/config/styleConsts';
import { colors } from '@src/themes/colors';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import useNetworkStore from '@src/zustand/networkStore';
import useRNVideoGlobalStore from '@src/zustand/main/rnVideoPlayerStore';
import InitialPlayerView from '@src/views/organisms/RNVideo/components/InitialPlayerView';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import {
  VideoPlayerProvider,
  useVideoPlayerContext
} from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import GeoBlockingOverlay from './components/GeoBlockingOverlay';
import { ANALYTICS_MOLECULES, ANALYTICS_ATOMS } from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logVideoEvent } from '@src/services/analytics/videoPlayerContentAnalyticsHelper';

const DEFAULT_PERFORMANCE_CONFIG = {
  lowMemoryMode: true,
  progressUpdateInterval: 500,
  // Ensure playback stops when app is backgrounded/locked (e.g. power button press)
  disableBackgroundPlayback: true
};

/**
 * RNVideoPlayerContent - Internal component with video logic
 * Refactored to use custom hooks and Context for state management
 */
const RNVideoPlayerContent = (props: RNVideoPlayerProps) => {
  // 1. Props Destructuring
  const {
    videoUrl,
    closedCaptionUrl,
    persistPlaybackTime,
    initialSeekTime,
    videoType,
    setToastType,
    setToastMessage,
    videos,
    media,
    fullScreen = false,
    isMutedProp = false,
    isCaptionsEnabled: isCaptionsEnabledProp = false,
    thumbnail,
    data,
    onTimeUpdate,
    runOnPlay = true,
    alwaysEnablePiP,
    onFullScreenPress,
    isShowLive = false,
    autoStart = false,
    reelMode = false,
    aspectRatio = 16 / 9,
    onExitPiP,
    onEnterPiP,
    setIsVideoPlaying: setIsVideoPlayingProp,
    keys,
    activeVideoIndex,
    showPiPIcon = true,
    performanceConfig,
    adTagUrl,
    adLanguage,
    onReceiveAdEvent,
    onAdStatusChanged,
    has9_16,
    blocked,
    onSettingsRequest
  } = props;

  const config = useMemo(
    () => performanceConfig || DEFAULT_PERFORMANCE_CONFIG,
    [performanceConfig]
  );

  // Capture initial values to prevent unnecessary VideoCore recreation
  // These values should only be used for initialization, not updated during playback
  const initialAdTagUrlRef = useRef(adTagUrl);
  const initialSeekTimeRef = useRef(initialSeekTime);

  // Only update refs if videoUrl changes (new video)
  const prevVideoUrlRef = useRef(videoUrl);
  if (prevVideoUrlRef.current !== videoUrl) {
    prevVideoUrlRef.current = videoUrl;
    initialAdTagUrlRef.current = adTagUrl;
    initialSeekTimeRef.current = initialSeekTime;
  }

  // 2. Theme & Navigation
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const isFocused = useIsFocused();

  // 3. Local State
  const [hasStarted, setHasStarted] = useState<boolean>(autoStart);
  // Settings bottom sheet visibility
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Selected video quality ('auto' | '1080' | '720' | '480' | etc)
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  // State for available video qualities (resolutions)
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  // Whether subtitles are available in the stream
  const [hasSubtitles, setHasSubtitles] = useState(false);

  // Settings handlers
  const handleSettingsPress = useCallback(() => {
    setSettingsVisible(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsVisible(false);
  }, []);

  const handleQualityChange = useCallback((quality: string) => {
    setSelectedQuality(quality);
  }, []);

  // Sync settings with parent if onSettingsRequest is provided (Case-by-case fix for clipping)

  // 4. Store/Context Connections
  const currentVideoType = useVideoPlayerStore((state) => state.currentVideoType);
  const storeFullScreen = useVideoPlayerStore((state) => state.isFullScreen);
  const initDeviceCapabilities = useRNVideoGlobalStore((state) => state.initDeviceCapabilities);

  const isFullScreen = storeFullScreen || fullScreen;
  const isInternetConnection = useNetworkStore((state) => state.isInternetConnection);

  // Instance Context
  const {
    state,
    setIsPlaying,
    setIsMuted,
    setCaptionsEnabled,
    toggleCaptions,
    setSpeed,
    analyticsConfig
  } = useVideoPlayerContext();

  const { isPlaying, isBuffering, captionsEnabled, speed } = state;

  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      // Log analytics event for speed selection
      let speedAction;
      switch (newSpeed) {
        case 1:
          speedAction = ANALYTICS_ATOMS.SPEED_1X;
          break;
        case 1.5:
          speedAction = ANALYTICS_ATOMS.SPEED_1_5X;
          break;
        case 2:
          speedAction = ANALYTICS_ATOMS.SPEED_2X;
          break;
        default:
          speedAction = ANALYTICS_ATOMS.SPEED_1X;
      }

      logSelectContentEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        content_action: speedAction,
        content_title: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType
      });
      logVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: speedAction,
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

      setSpeed(newSpeed);
    },
    [setSpeed, analyticsConfig, ANALYTICS_ATOMS, ANALYTICS_MOLECULES]
  );

  // Sync settings with parent if onSettingsRequest is provided (Case-by-case fix for clipping)
  useEffect(() => {
    if (!onSettingsRequest) return;

    if (settingsVisible) {
      onSettingsRequest({
        visible: true,
        onClose: handleSettingsClose,
        captionsEnabled,
        onCaptionsChange: setCaptionsEnabled,
        currentSpeed: speed,
        onSpeedChange: handleSpeedChange,
        currentQuality: selectedQuality,
        onQualityChange: handleQualityChange,
        isLive: isShowLive,
        showQualityOption: true,
        showSubtitlesOption: hasSubtitles || !!closedCaptionUrl,
        availableQualities
      });
    } else {
      onSettingsRequest(null);
    }
  }, [
    settingsVisible,
    onSettingsRequest,
    handleSettingsClose,
    captionsEnabled,
    setCaptionsEnabled,
    speed,
    handleSpeedChange,
    selectedQuality,
    handleQualityChange,
    isShowLive,
    hasSubtitles,
    closedCaptionUrl,
    availableQualities
  ]);

  // 5. Custom Hooks
  const { isTransitioning, handleTransitionComplete } = useVideoTransition(isFullScreen, {
    hasStarted
  });

  useVideoLifecycle({
    isFocused,
    currentVideoType: currentVideoType ?? '',
    videoType: videoType ?? undefined,
    keys,
    activeVideoIndex,
    persistPlaybackTime,
    setIsVideoPlayingProp,
    setHasStarted
  });

  const {
    handleStart,
    handleFullScreenPress,
    handleExitFullscreen,
    handleEnterPiP,
    stableHandleVideoEnd,
    stableOnReceiveAdEvent,
    stableOnAdStatusChanged
  } = useVideoHandlers({
    videoUrl,
    videoType: videoType ?? undefined,
    initialSeekTime: initialSeekTime,
    isInternetConnection,
    runOnPlay,
    persistPlaybackTime,
    setIsVideoPlayingProp,
    setToastType,
    setToastMessage,
    setHasStarted,
    onExitPiP,
    onEnterPiP,
    onFullScreenPress,
    onReceiveAdEvent,
    onAdStatusChanged,
    analyticsConfig
  });

  // 6. Initialization Effects
  useEffect(() => {
    initDeviceCapabilities();
  }, [initDeviceCapabilities, videoUrl, activeVideoIndex]);

  // Handle AutoStart logic (once on mount if enabled)
  // Delegate to handleStart so autoStart behaves exactly like a manual "play" action.
  const hasAutoStartedRef = useRef(false);

  // Reset auto-start ref when active video index changes in reel mode
  // This allows previously played items to auto-start again when scrolled back to
  useEffect(() => {
    // Only run this effect in reel mode
    if (!reelMode) {
      return;
    }

    // Ensure we have the required numeric props for reel mode
    if (typeof keys === 'number' && typeof activeVideoIndex === 'number') {
      // Reset the auto-start flag when this video becomes the active one in reel mode
      if (keys === activeVideoIndex) {
        hasAutoStartedRef.current = false;
      }
    }
  }, [reelMode, keys, activeVideoIndex]);

  useEffect(() => {
    if (!autoStart || hasAutoStartedRef.current || !isInternetConnection) {
      return;
    }

    // In reel mode, only auto-start when this instance corresponds to the
    // currently active index (e.g. visible item in the vertical reel list).
    if (reelMode && typeof keys === 'number') {
      // If activeVideoIndex is not set yet, allow auto-start for the first video (index 0)
      if (typeof activeVideoIndex === 'number') {
        if (keys !== activeVideoIndex) {
          return;
        }
      } else if (keys !== 0) {
        // Only allow auto-start for first video if activeVideoIndex is not yet available
        return;
      }
    }

    hasAutoStartedRef.current = true;
    handleStart();
  }, [autoStart, isInternetConnection, handleStart, reelMode, keys, activeVideoIndex]);

  // 7. Props Sync Effects
  useEffect(() => {
    if (isCaptionsEnabledProp) setCaptionsEnabled(true);
  }, [isCaptionsEnabledProp, setCaptionsEnabled]);

  useEffect(() => {
    if (isMutedProp) {
      setIsMuted(true);
    }
  }, [isMutedProp, setIsMuted]);

  // Keep auto-started videos muted by default for regular playback
  //  Reel mode explicitly wants auto-start with sound.

  useEffect(() => {
    if (autoStart && !reelMode) {
      setIsMuted(true);
    }
  }, [autoStart, reelMode]);

  // Pause/stop video when app goes to background or becomes inactive

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        setIsPlaying(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [setIsPlaying]);

  useEffect(() => {
    setIsVideoPlayingProp?.(isPlaying);
  }, [isPlaying, setIsVideoPlayingProp]);

  // Sync time updates to prop
  // We use the state directly from context which updates on every tick (via useReducer/state update)
  // This might cause re-renders of this component every second.
  // Optimization: Component is memoized? No.
  // The context updates cause re-renders of consumers.
  // RNVideoPlayerContent consumes context. So it re-renders every 500ms (progress interval).
  // This is acceptable for the progress bar update, but let's check if onTimeUpdate prop needs it.
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(Math.floor(state.currentTime));
    }
  }, [state.currentTime, onTimeUpdate]);

  // 8. Render Logic
  // Use stable refs for adTagUrl and times to prevent unnecessary VideoCore recreation
  const stableVideoCore = useMemo(
    () => (
      <VideoCore
        videoUrl={videoUrl}
        style={styles.player}
        closedCaptionUrl={closedCaptionUrl}
        thumbnail={thumbnail || data?.Video?.content?.heroImage?.url}
        title={data?.Video?.title}
        isShowLive={isShowLive}
        reelMode={reelMode}
        alwaysEnablePiP={alwaysEnablePiP !== false}
        initialSeekTime={initialSeekTimeRef.current}
        onEnd={stableHandleVideoEnd}
        performanceConfig={config}
        adTagUrl={initialAdTagUrlRef.current}
        adLanguage={adLanguage}
        onReceiveAdEvent={stableOnReceiveAdEvent}
        onAdStatusChanged={stableOnAdStatusChanged}
        onReadyForDisplay={handleTransitionComplete}
        analyticsConfig={analyticsConfig}
        selectedQuality={selectedQuality}
        onVideoTracksChange={setAvailableQualities}
        onTextTracksChange={setHasSubtitles}
      />
    ),
    [
      videoUrl,
      styles.player,
      closedCaptionUrl,
      thumbnail,
      data?.Video?.content?.heroImage?.url,
      data?.Video?.title,
      isShowLive,
      reelMode,
      alwaysEnablePiP,
      initialSeekTime,
      stableHandleVideoEnd,
      config,
      adTagUrl,
      adLanguage,
      stableOnReceiveAdEvent,
      stableOnAdStatusChanged,
      handleTransitionComplete,
      analyticsConfig,
      selectedQuality
    ]
  );

  const videoContent = useMemo(
    () => (
      <View style={reelMode || isFullScreen ? styles.fullScreenPlayer : styles.player}>
        {stableVideoCore}
        {!settingsVisible && (
          <>
            <VideoOverlay
              fullScreen={reelMode || isFullScreen}
              isLive={isShowLive}
              reelMode={reelMode}
              showPiPIcon={showPiPIcon}
              onFullScreenPress={handleFullScreenPress}
              onEnterPiP={handleEnterPiP}
              onToggleCaptions={toggleCaptions}
              captionsEnabled={captionsEnabled}
              showSettingsIcon={!reelMode}
              onSettingsPress={handleSettingsPress}
              analyticsConfig={analyticsConfig}
            />
            {(isTransitioning || isBuffering) && (
              <View style={transitionStyles.overlay}>
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            )}
          </>
        )}

        {/* In fullscreen: render settings INSIDE videoContent so it teleports
            into the FullscreenPortalHost Modal along with the video */}
        {isFullScreen && (
          <VODSettingsBottomSheet
            visible={settingsVisible}
            onClose={handleSettingsClose}
            captionsEnabled={captionsEnabled}
            onCaptionsChange={setCaptionsEnabled}
            currentSpeed={speed}
            onSpeedChange={handleSpeedChange}
            currentQuality={selectedQuality}
            onQualityChange={handleQualityChange}
            isLive={isShowLive}
            showQualityOption={true}
            showSubtitlesOption={hasSubtitles || !!closedCaptionUrl}
            availableQualities={availableQualities}
          />
        )}
      </View>
    ),
    [
      isFullScreen,
      reelMode,
      styles.fullScreenPlayer,
      styles.player,
      stableVideoCore,
      isShowLive,
      showPiPIcon,
      handleFullScreenPress,
      handleEnterPiP,
      toggleCaptions,
      captionsEnabled,
      isTransitioning,
      isBuffering,
      handleSettingsPress,
      settingsVisible,
      handleSettingsClose,
      setCaptionsEnabled,
      speed,
      handleSpeedChange,
      selectedQuality,
      handleQualityChange,
      isShowLive,
      hasSubtitles,
      closedCaptionUrl,
      availableQualities
    ]
  );

  // 9. Conditional Returns
  if (!hasStarted) {
    const thumbnailContainerStyle = reelMode
      ? styles.reelPlayerContainer
      : [styles.playerContainer, { aspectRatio }];

    return (
      <View style={thumbnailContainerStyle}>
        <InitialPlayerView
          data={data}
          thumbnail={thumbnail}
          videos={videos}
          media={media}
          aspectRatio={aspectRatio}
          activeVideoIndex={activeVideoIndex}
          onStart={handleStart}
          reelMode={reelMode}
          analyticsConfig={analyticsConfig}
        />
      </View>
    );
  }

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

  const containerStyle = reelMode
    ? styles.reelPlayerContainer
    : [styles.playerContainer, { aspectRatio }];
  if (blocked) {
    return (
      <View style={containerStyle}>
        <GeoBlockingOverlay />
      </View>
    );
  }
  return (
    <>
      <View style={containerStyle}>
        <FullscreenPortal
          id={`video-player-${videoUrl}`}
          isActive={isFullScreen}
          has9_16={has9_16}
          onEnterFullscreen={onFullScreenPress}
          onExitFullscreen={handleExitFullscreen}
        >
          {videoContent}
        </FullscreenPortal>
      </View>

      {/* Non-fullscreen: render OUTSIDE the container View as a Fragment sibling
          so position:absolute covers the full page. We avoid Modal because
          Android's Modal Window renders BEHIND the native video Surface. */}
      {!isFullScreen && !onSettingsRequest && (
        <VODSettingsBottomSheet
          visible={settingsVisible}
          onClose={handleSettingsClose}
          captionsEnabled={captionsEnabled}
          onCaptionsChange={setCaptionsEnabled}
          currentSpeed={speed}
          onSpeedChange={handleSpeedChange}
          currentQuality={selectedQuality}
          onQualityChange={handleQualityChange}
          isLive={isShowLive}
          showQualityOption={true}
          showSubtitlesOption={hasSubtitles || !!closedCaptionUrl}
          availableQualities={availableQualities}
        />
      )}
    </>
  );
};

const transitionStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

/**
 * RNVideoPlayer - Main exported component with provider wrapper
 */
const RNVideoPlayer = (props: RNVideoPlayerProps) => {
  const {
    analyticsContentType,
    analyticsScreenName,
    analyticsOrganism,
    data,
    analyticsIdPage,
    analyticScreenPageWebUrl,
    analyticsPublication,
    analyticsDuration,
    analyticsTags,
    analyticVideoType,
    analyticsProduction
  } = props;

  const analyticsConfig = useMemo(
    () => ({
      contentType: analyticsContentType,
      screenName: analyticsScreenName,
      organisms: analyticsOrganism,
      videoTitle: data?.Video?.title,
      idPage: analyticsIdPage,
      screenPageWebUrl: analyticScreenPageWebUrl,
      publication: analyticsPublication,
      data: data,
      duration: analyticsDuration,
      tags: analyticsTags,
      videoType: analyticVideoType,
      production: analyticsProduction
    }),
    [
      analyticsContentType,
      analyticsScreenName,
      analyticsOrganism,
      data?.Video?.title,
      analyticsIdPage,
      analyticScreenPageWebUrl,
      analyticsPublication,
      analyticsDuration,
      analyticsTags,
      analyticVideoType,
      analyticsProduction
    ]
  );

  return (
    <VideoPlayerProvider analyticsConfig={analyticsConfig}>
      <FullscreenPortalProvider>
        <RNVideoPlayerContent {...props} />
        <FullscreenPortalHost />
      </FullscreenPortalProvider>
    </VideoPlayerProvider>
  );
};

export {
  FullscreenPortalProvider,
  FullscreenPortalHost
} from '@src/views/organisms/RNVideo/components';

export { default as RNSocialVideoPlayer } from './RNSocialVideoPlayer';

export default RNVideoPlayer;
