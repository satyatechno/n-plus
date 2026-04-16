import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { StyleProp, ViewStyle, Platform } from 'react-native';

import Video, {
  ResizeMode,
  OnProgressData,
  OnLoadData,
  ISO639_1,
  TextTrackType,
  SelectedTrackType,
  BufferingStrategyType,
  ViewType,
  OnReceiveAdEventData,
  VideoRef,
  SelectedVideoTrack,
  SelectedVideoTrackType
} from 'react-native-video';

import useRNVideoGlobalStore from '@src/zustand/main/rnVideoPlayerStore';
import { useVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import { PerformanceConfig } from '@src/views/organisms/RNVideo/types';
import {
  shouldHidePiPForAdEvent,
  canShowPiPAfterAdEvent,
  IMAAdEvent,
  getHlsHeaders
} from '@src/views/organisms/RNVideo/utils';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import {
  logVideoLoadEvent,
  trackVideoProgress,
  resetVideoProgressTracker
} from '@src/services/analytics/videoAnalyticsHelpers';

interface VideoTrack {
  height?: number;
  width?: number;
  bitrate?: number;
}

export interface VideoCoreProps {
  /** The URL of the video to play */
  videoUrl: string;
  /** Style for the video component */
  style: StyleProp<ViewStyle>;
  /** URL for closed captions (VTT format) */
  closedCaptionUrl?: string;
  /** URL for the video thumbnail/poster */
  thumbnail?: string;
  /** Title of the video */
  title?: string;
  /** Whether the video is a live stream */
  isShowLive?: boolean;
  /** Whether the player is in reel/shorts mode */
  reelMode?: boolean;
  /** Whether Picture-in-Picture is always enabled */
  alwaysEnablePiP?: boolean;
  /** Initial seek time in seconds */
  initialSeekTime?: number;
  /** Callback when video playback ends */
  onEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: unknown) => void;
  /** Performance configuration for low-end devices */
  performanceConfig?: PerformanceConfig;
  /** Callback when PiP status changes */
  onPictureInPictureStatusChanged?: (isActive: boolean) => void;
  /** VMAP/VAST Ad Tag URL for Google IMA SDK ads */
  adTagUrl?: string;
  adLanguage?: ISO639_1;
  /** Callback when ad events are received from IMA SDK */
  onReceiveAdEvent?: (event: OnReceiveAdEventData) => void;
  /** Callback when ad status changes (playing/not playing) */
  onAdStatusChanged?: (isAdPlaying: boolean) => void;
  /** Callback when the video is ready for display */
  onReadyForDisplay?: () => void;
  /** Analytics configuration for tracking video events */
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    videoTitle?: string;
  };
  /** Selected video quality ('auto' | '1080' | '720' | '480' | '360' | '240' | '144') */
  selectedQuality?: string;
  /** Callback when video tracks (qualities) are detected */
  onVideoTracksChange?: (qualities: string[]) => void;
  /** Callback when text tracks (subtitles) are detected */
  onTextTracksChange?: (hasSubtitles: boolean) => void;
  resizeMode?: ResizeMode;
}

const LOW_MEMORY_BUFFER_CONFIG = {
  minBufferMs: 1500,
  maxBufferMs: 5000,
  bufferForPlaybackMs: 1000,
  bufferForPlaybackAfterRebufferMs: 2000,
  backBufferDurationMs: 0,
  maxHeapAllocationPercent: 0.3,
  minBackBufferMemoryReservePercent: 0.3,
  minBufferMemoryReservePercent: 0.2,
  cacheSizeMB: 50,
  live: {
    targetOffsetMs: 500,
    minOffsetMs: 200,
    maxOffsetMs: 2000,
    minPlaybackSpeed: 0.95,
    maxPlaybackSpeed: 1.05
  }
};

const STANDARD_BUFFER_CONFIG = {
  minBufferMs: 5000,
  maxBufferMs: 10000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
  backBufferDurationMs: 30000,
  maxHeapAllocationPercent: 0.5,
  minBackBufferMemoryReservePercent: 0.2,
  minBufferMemoryReservePercent: 0.1,
  cacheSizeMB: 100,
  live: {
    targetOffsetMs: 500,
    minOffsetMs: 200,
    maxOffsetMs: 5000,
    minPlaybackSpeed: 0.9,
    maxPlaybackSpeed: 1.1
  }
};

/**
 * VideoCore - Core Video Player Component
 *
 * The foundational video playback component built on react-native-video that handles
 * all direct video interactions including playback, buffering, ads, captions, and PiP mode.
 *
 * Architecture overview:
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ VideoCore                                                       │
 * │  ├── react-native-video <Video />                               │
 * │  │     ├── HLS Streaming with custom headers                    │
 * │  │     ├── Google IMA SDK (VMAP/VAST ads)                       │
 * │  │     ├── Closed captions (VTT format)                         │
 * │  │     └── Picture-in-Picture support                           │
 * │  └── Zustand Store (rnVideoPlayerStore)                         │
 * │        ├── Playback state (isPlaying, currentTime, duration)    │
 * │        ├── UI state (isMuted, speed, captionsEnabled)           │
 * │        └── Ad state (isAdPlaying, isAdPaused)                   │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * Behavior & responsibilities:
 * - Renders the native video player with configurable buffer strategies
 * - Manages bidirectional state sync between native player and Zustand store
 * - Handles Google IMA SDK ad events (VMAP/VAST) with PiP restrictions during ads
 * - Provides adaptive buffering based on device memory capabilities
 * - Supports closed captions with VTT format
 * - Manages seek operations with buffering state coordination
 *
 * Device adaptation:
 * - LOW_MEMORY_BUFFER_CONFIG: Smaller buffers (2.5s-5s) for memory-constrained devices
 * - STANDARD_BUFFER_CONFIG: Larger buffers (15s-50s) for capable devices
 * - Automatic selection based on isLowMemoryDevice flag from store
 *
 * Side effects & external dependencies:
 * - Reads/writes to rnVideoPlayerStore for state management
 * - Interacts with native video player via VideoRef
 * - Google IMA SDK handles ad playback natively when adTagUrl is provided
 * - HLS headers are automatically injected for authenticated streams
 *
 * @example
 * // Basic usage
 * <VideoCore
 *   videoUrl="https://example.com/video.m3u8"
 *   style={styles.video}
 *   thumbnail="https://example.com/thumb.jpg"
 *   title="My Video"
 * />
 *
 * @example
 * // With ads and captions
 * <VideoCore
 *   videoUrl={videoUrl}
 *   style={styles.video}
 *   adTagUrl="https://pubads.g.doubleclick.net/..."
 *   closedCaptionUrl="https://example.com/captions.vtt"
 *   onAdStatusChanged={(isPlaying) => console.log('Ad playing:', isPlaying)}
 * />
 */
const VideoCore: React.FC<VideoCoreProps> = ({
  videoUrl,
  style,
  closedCaptionUrl,
  thumbnail,
  title = 'N+ Video',
  initialSeekTime = 0,
  onEnd,
  onError,
  performanceConfig = { lowMemoryMode: true },
  onPictureInPictureStatusChanged,
  adTagUrl,
  adLanguage = 'es' as ISO639_1,
  onReceiveAdEvent,
  onAdStatusChanged,
  onReadyForDisplay: onReadyForDisplayProp,
  analyticsConfig,
  selectedQuality = 'auto',
  onVideoTracksChange,
  onTextTracksChange,
  resizeMode
}) => {
  // Global Store (Device Config)
  const isLowMemoryDevice = useRNVideoGlobalStore((state) => state.isLowMemoryDevice);

  // Instance Context
  const {
    state,
    setIsPlaying,
    setDuration,
    setCurrentTime,
    setIsBuffering,
    setIsPlayerReady,
    setIsAdPlaying,
    toggleAdPause,
    setPendingSeekResume,
    setHasEnded,
    setVideoProgressTracker
  } = useVideoPlayerContext();

  const {
    isPlaying,
    isMuted,
    speed,
    isAdPlaying,
    isAdPaused,
    captionsEnabled,
    videoProgressTracker
  } = state;

  // Convert selectedQuality to selectedVideoTrack format
  const selectedVideoTrack: SelectedVideoTrack = useMemo(() => {
    // Handle resolution selection
    if (selectedQuality === 'auto') {
      return { type: SelectedVideoTrackType.AUTO };
    }

    const resolution = parseInt(selectedQuality, 10);
    if (!isNaN(resolution)) {
      return { type: SelectedVideoTrackType.RESOLUTION, value: resolution };
    }
    return { type: SelectedVideoTrackType.AUTO };
  }, [selectedQuality]);

  // Ref to access state inside callbacks without dependencies
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const { ref: videoRef, setRef } = useVideoRef();

  const currentTimeRef = useRef<number>(0);
  const lastProgressUpdate = useRef<number>(0);
  const isReadyToSyncProgress = useRef<boolean>(false);
  const progressSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Initialize local hasEndedRef from shared context state
  const hasEndedRef = useRef<boolean>(state.hasEnded);
  const prevIsPlayingRef = useRef<boolean>(isPlaying);

  // Handle replay after video ended - seek to beginning when user presses play
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    prevIsPlayingRef.current = isPlaying;

    // User pressed play after video ended
    if (!wasPlaying && isPlaying && hasEndedRef.current) {
      hasEndedRef.current = false;
      setHasEnded(false); // Clear ended flag in shared context
      videoRef.current?.seek(0);
      setCurrentTime(0);
      currentTimeRef.current = 0;
    }
  }, [isPlaying, videoRef, setCurrentTime, setHasEnded]);

  const {
    progressUpdateInterval = 500,
    disableBackgroundPlayback = false,
    cacheSizeMB = 50
  } = performanceConfig;

  const bufferConfig = isLowMemoryDevice
    ? { ...LOW_MEMORY_BUFFER_CONFIG, cacheSizeMB }
    : { ...STANDARD_BUFFER_CONFIG, cacheSizeMB };

  const textTracks = closedCaptionUrl
    ? [
        {
          title: 'Subtitles',
          language: 'es' as ISO639_1,
          type: TextTrackType.VTT,
          uri: closedCaptionUrl
        }
      ]
    : undefined;

  const handleLoad = useCallback(
    (data: OnLoadData) => {
      setDuration(data.duration);
      setIsBuffering(false);
      setIsPlayerReady(true);

      // Log video load event
      if (analyticsConfig) {
        logVideoLoadEvent(analyticsConfig);
      }

      const storeState = stateRef.current;
      const storeCurrentTime = storeState.currentTime;

      // If video has ended (shared context flag), ignore stored currentTime and start from 0
      // This prevents seeking to old position when transitioning to fullscreen after replay
      const shouldIgnoreStoredTime = storeState.hasEnded;
      const seekToTime = shouldIgnoreStoredTime
        ? 0
        : initialSeekTime > 0
          ? initialSeekTime
          : storeCurrentTime > 0
            ? storeCurrentTime
            : 0;

      if (seekToTime > 0) {
        videoRef.current?.seek(seekToTime);
      }

      if (storeState.isPlaying) {
        videoRef.current?.resume();
      }

      if (progressSyncTimeoutRef.current) {
        clearTimeout(progressSyncTimeoutRef.current);
      }
      progressSyncTimeoutRef.current = setTimeout(() => {
        isReadyToSyncProgress.current = true;
        progressSyncTimeoutRef.current = null;
      }, 1000);
    },
    [initialSeekTime, setDuration, setIsBuffering, setIsPlayerReady, videoRef, analyticsConfig]
  );

  useEffect(
    () => () => {
      if (progressSyncTimeoutRef.current) {
        clearTimeout(progressSyncTimeoutRef.current);
      }
    },
    []
  );

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      // Don't update progress if video has ended (prevents race condition with handleEnd)
      if (hasEndedRef.current) {
        return;
      }

      if (!isReadyToSyncProgress.current && data.currentTime < 1) {
        return;
      }

      currentTimeRef.current = data.currentTime;
      const now = Date.now();
      if (now - lastProgressUpdate.current >= progressUpdateInterval) {
        lastProgressUpdate.current = now;
        setCurrentTime(data.currentTime);

        // Track video progress for analytics
        if (analyticsConfig && state.duration > 0) {
          const updatedTracker = trackVideoProgress(
            data.currentTime,
            state.duration,
            videoProgressTracker,
            analyticsConfig
          );
          setVideoProgressTracker(updatedTracker);
        }
      }
    },
    [
      progressUpdateInterval,
      setCurrentTime,
      analyticsConfig,
      state.duration,
      videoProgressTracker,
      setVideoProgressTracker
    ]
  );

  const handlePlaybackStateChanged = useCallback(
    ({ isPlaying: playing }: { isPlaying: boolean }) => {
      if (isReadyToSyncProgress.current) {
        // Don't update isPlaying to false during fullscreen transition
        const { isTransitioning, wasPlayingBeforeTransition } = stateRef.current;
        if (!playing && isTransitioning && wasPlayingBeforeTransition) {
          return;
        }
        setIsPlaying(playing);
      }

      if (playing) {
        // Clear ended flags when video starts playing (both local and shared context)
        hasEndedRef.current = false;
        setHasEnded(false);
        setIsBuffering(false);
        setIsPlayerReady(true);
      }
    },
    [setIsPlaying, setIsBuffering, setIsPlayerReady, setHasEnded]
  );

  const handleBuffer = useCallback(
    ({ isBuffering: buffering }: { isBuffering: boolean }) => {
      setIsBuffering(buffering);
    },
    [setIsBuffering]
  );

  const handleLoadStart = useCallback(() => {}, []);

  const handleEnd = useCallback(() => {
    hasEndedRef.current = true;
    setHasEnded(true); // Mark as ended in shared context
    setIsPlaying(false);
    setIsBuffering(false);
    setCurrentTime(0);
    currentTimeRef.current = 0;

    // Reset progress tracker for next playback
    if (analyticsConfig) {
      const resetTracker = resetVideoProgressTracker();
      setVideoProgressTracker(resetTracker);
    }

    onEnd?.();
  }, [
    setIsPlaying,
    setIsBuffering,
    setCurrentTime,
    setHasEnded,
    setVideoProgressTracker,
    analyticsConfig,
    onEnd
  ]);

  const handleError = useCallback(
    (error: unknown) => {
      setIsBuffering(false);
      onError?.(error);
    },
    [setIsBuffering, onError]
  );

  const handleAudioBecomingNoisy = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleReadyForDisplay = useCallback(() => {
    setIsBuffering(false);
    setIsPlayerReady(true);
    onReadyForDisplayProp?.();
  }, [setIsBuffering, setIsPlayerReady, onReadyForDisplayProp]);

  const handleSeek = useCallback(() => {
    const { pendingSeekResume } = stateRef.current;
    if (pendingSeekResume) {
      setPendingSeekResume(false);
      videoRef.current?.resume();
      setIsPlaying(true);
    }
  }, [setIsPlaying, videoRef, setPendingSeekResume]);

  const handlePictureInPictureStatusChanged = useCallback(
    ({ isActive }: { isActive: boolean }) => {
      onPictureInPictureStatusChanged?.(isActive);
    },
    [onPictureInPictureStatusChanged]
  );

  const handleReceiveAdEvent = useCallback(
    (event: OnReceiveAdEventData) => {
      const adEvent: IMAAdEvent = {
        event: event.event as IMAAdEvent['event'],
        data: event.data as Record<string, unknown>
      };

      const shouldHide = shouldHidePiPForAdEvent(adEvent);
      const canShow = canShowPiPAfterAdEvent(adEvent);

      if (shouldHide) {
        setIsAdPlaying(true);
        onAdStatusChanged?.(true);
      }

      if (canShow) {
        setIsAdPlaying(false);
        onAdStatusChanged?.(false);
      }

      if (event.event === 'TAPPED') {
        toggleAdPause();
      }

      onReceiveAdEvent?.(event);
    },
    [onReceiveAdEvent, onAdStatusChanged, setIsAdPlaying, toggleAdPause]
  );

  const handleRef = useCallback(
    (ref: VideoRef | null) => {
      if (ref) {
        setRef(ref);
      }
    },
    [setRef]
  );

  const hlsHeaders = getHlsHeaders();

  const sourceConfig = {
    uri: videoUrl,
    headers: hlsHeaders,
    metadata: {
      title,
      artist: 'N+'
    },
    bufferConfig,
    textTracks,
    ...(adTagUrl && {
      ad: {
        type: 'csai' as const,
        adTagUrl,
        adLanguage
      }
    })
  };

  return (
    <Video
      ref={handleRef}
      source={sourceConfig}
      style={style}
      resizeMode={resizeMode || ResizeMode.CONTAIN}
      paused={isAdPlaying ? isAdPaused : !isPlaying}
      muted={isMuted}
      rate={speed}
      repeat={false}
      viewType={Platform.OS === 'android' ? ViewType.TEXTURE : ViewType.SURFACE}
      controls={false}
      bufferingStrategy={
        isLowMemoryDevice
          ? BufferingStrategyType.DEPENDING_ON_MEMORY
          : BufferingStrategyType.DEFAULT
      }
      progressUpdateInterval={progressUpdateInterval}
      playInBackground={!disableBackgroundPlayback}
      playWhenInactive={!disableBackgroundPlayback}
      enterPictureInPictureOnLeave={false}
      showNotificationControls={!disableBackgroundPlayback}
      ignoreSilentSwitch="ignore"
      selectedTextTrack={
        captionsEnabled
          ? { type: SelectedTrackType.INDEX, value: 0 }
          : { type: SelectedTrackType.DISABLED }
      }
      fullscreen={false}
      poster={
        thumbnail
          ? {
              source: { uri: thumbnail },
              resizeMode: 'cover'
            }
          : undefined
      }
      filterEnabled={false}
      onLoadStart={handleLoadStart}
      onLoad={handleLoad}
      onProgress={handleProgress}
      onPlaybackStateChanged={handlePlaybackStateChanged}
      onEnd={handleEnd}
      onBuffer={handleBuffer}
      onError={handleError}
      onReadyForDisplay={handleReadyForDisplay}
      onAudioBecomingNoisy={handleAudioBecomingNoisy}
      onSeek={handleSeek}
      onPictureInPictureStatusChanged={handlePictureInPictureStatusChanged}
      onReceiveAdEvent={adTagUrl ? handleReceiveAdEvent : undefined}
      selectedVideoTrack={selectedVideoTrack}
      onVideoTracks={(data) => {
        if (data.videoTracks && data.videoTracks.length > 0) {
          // Extract unique resolutions (heights)
          const resolutions = data.videoTracks
            .filter((track: VideoTrack) => track && typeof track.height === 'number')
            .map((track: VideoTrack) => track.height?.toString() || '');

          // Remove duplicates and sort descending (highest quality first)
          const uniqueResolutions = Array.from(new Set(resolutions)).sort(
            (a, b) => parseInt(b) - parseInt(a)
          );

          onVideoTracksChange?.(uniqueResolutions);
        }
      }}
      onTextTracks={(data) => {
        if (data.textTracks && data.textTracks.length > 0) {
          const hasValid = data.textTracks.some(
            (t) => (t.title && t.title !== '') || (t.language && t.language !== '')
          );
          onTextTracksChange?.(hasValid);
        }
      }}
    />
  );
};

export default React.memo(VideoCore);
