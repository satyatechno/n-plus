import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import Video, {
  ResizeMode,
  OnProgressData,
  OnLoadData,
  BufferingStrategyType,
  ViewType,
  VideoRef,
  SelectedVideoTrack,
  SelectedVideoTrackType,
  SelectedTrack,
  SelectedTrackType
} from 'react-native-video';
import { useCastState, CastState } from 'react-native-google-cast';

import { useVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import { getHlsHeaders } from '@src/views/organisms/RNVideo/utils';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import {
  LIVE_BUFFER_CONFIG,
  LIVE_MIN_LOAD_RETRY_COUNT,
  LIVE_IOS_CONFIG
} from '@src/views/organisms/RNVideo/configs/liveBufferConfig';
import { logVideoLoadEvent } from '@src/services/analytics/videoAnalyticsHelpers';
import { createVideoLiveTracker } from '@src/services/analytics/videoLiveAnalyticsHelpers';

interface VideoTrack {
  height?: number;
  width?: number;
  bitrate?: number;
}

export interface LiveVideoCoreProps {
  /** The URL of the live stream to play */
  videoUrl: string;
  /** Style for the video component */
  style: StyleProp<ViewStyle>;
  /** Title of the stream */
  title?: string;
  /** Callback when an error occurs */
  onError?: (error: unknown) => void;
  /** Callback when the video is ready for display */
  onReadyForDisplay?: () => void;
  /** Callback when PiP status changes */
  onPictureInPictureStatusChanged?: (isActive: boolean) => void;
  /** Selected video quality ('auto' | '1080' | '720' | '480' | '360' | '240' | '144') */
  selectedQuality?: string;
  /** Callback when text tracks (subtitles) are detected */
  onTextTracksChange?: (hasSubtitles: boolean) => void;
  /** Whether captions/subtitles should be enabled */
  captionsEnabled?: boolean;
  /** Callback when video tracks (qualities) are detected */
  onVideoTracksChange?: (qualities: string[]) => void;
  /** Maximum bitrate for iOS quality limiting (in bps) */
  maxBitRate?: number;
}

/**
 * LiveVideoCore - Specialized Video Core for Live Streaming
 *
 * A simplified video player component optimized for live streaming content.
 * Unlike VideoCore (VOD), this component:
 * - Uses live-optimized buffer configuration
 * - Does not seek on load (always plays from live edge)
 * - Ignores end events (live streams don't end)
 * - Shows buffering state on errors (for auto-retry)
 * - Does not pause on audio becoming noisy
 * - Hides shutter view for faster initial display
 *
 * @example
 * <LiveVideoCore
 *   videoUrl="https://example.com/live.m3u8"
 *   style={styles.video}
 *   title="Live News"
 * />
 */
const LiveVideoCore: React.FC<LiveVideoCoreProps> = ({
  videoUrl,
  style,
  title = 'N+ Live',
  onError,
  onReadyForDisplay: onReadyForDisplayProp,
  onPictureInPictureStatusChanged,
  selectedQuality = 'auto',
  onTextTracksChange,
  captionsEnabled = false,
  onVideoTracksChange,
  maxBitRate = 0
}) => {
  // Instance Context
  const {
    state,
    setIsPlaying,
    setDuration,
    setCurrentTime,
    setIsBuffering,
    setIsPlayerReady,
    analyticsConfig
  } = useVideoPlayerContext();

  const { isPlaying, isMuted } = state;

  // Selected Text Track Logic
  const selectedTextTrack: SelectedTrack | undefined = useMemo(() => {
    if (captionsEnabled) {
      // Select the first available track or specific language if needed
      // For now, index 0 is usually the default/embedded track
      return { type: SelectedTrackType.INDEX, value: 0 };
    }
    return { type: SelectedTrackType.DISABLED };
  }, [captionsEnabled]);

  // Ref to access state inside callbacks without dependencies
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ─── af_video_live tracker ─────────────────────────────────────────────────
  const liveTracker = useMemo(
    () =>
      analyticsConfig?.channel
        ? createVideoLiveTracker({
            channel: analyticsConfig.channel,
            videoTitle: analyticsConfig.videoTitle
          })
        : null,
    [analyticsConfig?.channel, analyticsConfig?.videoTitle]
  );
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Google Cast tracking ─────────────────────────────────────────────────
  const castState = useCastState();
  const prevCastStateRef = useRef<CastState | null | undefined>(castState);

  useEffect(() => {
    const prev = prevCastStateRef.current;
    prevCastStateRef.current = castState;
    if (castState === CastState.CONNECTED && prev !== CastState.CONNECTED) {
      liveTracker?.liveVideoCastStart();
    }
    if (prev === CastState.CONNECTED && castState !== CastState.CONNECTED) {
      liveTracker?.liveVideoCastStop();
    }
  }, [castState, liveTracker]);
  // ─────────────────────────────────────────────────────────────────────────

  const { ref: videoRef, setRef } = useVideoRef();

  const currentTimeRef = useRef<number>(0);
  const lastProgressUpdate = useRef<number>(0);
  const isReadyToSyncProgress = useRef<boolean>(false);
  const progressSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to validate text tracks
  const hasValidTextTracks = useCallback((tracks: { title?: string; language?: string }[]) => {
    if (!tracks || tracks.length === 0) return false;
    // Filter out tracks that have NO information (common phantom tracks)
    const validTracks = tracks.filter(
      (t) => (t.title && t.title !== '') || (t.language && t.language !== '')
    );
    return validTracks.length > 0;
  }, []);

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

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (progressSyncTimeoutRef.current) {
        clearTimeout(progressSyncTimeoutRef.current);
      }
    },
    []
  );

  const handleLoad = useCallback(
    (data: OnLoadData) => {
      // Check for subtitles in onLoad data (Critical for Android compatibility)
      if (hasValidTextTracks(data.textTracks)) {
        onTextTracksChange?.(true);
      }

      setDuration(data.duration);
      setIsBuffering(false);
      setIsPlayerReady(true);

      // Log video load event (select_content)
      if (analyticsConfig) {
        logVideoLoadEvent(analyticsConfig);
      }

      // af_video_live: video_vivo_start
      liveTracker?.liveVideoStart();

      // For live streams, don't seek - always play from current live position
      // Just resume if we should be playing
      if (stateRef.current.isPlaying) {
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
    [setDuration, setIsBuffering, setIsPlayerReady, videoRef, analyticsConfig]
  );

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      if (!isReadyToSyncProgress.current && data.currentTime < 1) {
        return;
      }

      currentTimeRef.current = data.currentTime;
      const now = Date.now();
      // Update less frequently for live streams (every 1 second)
      if (now - lastProgressUpdate.current >= 1000) {
        lastProgressUpdate.current = now;
        setCurrentTime(data.currentTime);
      }
    },
    [setCurrentTime]
  );

  const handlePlaybackStateChanged = useCallback(
    ({ isPlaying: playing }: { isPlaying: boolean }) => {
      if (isReadyToSyncProgress.current) {
        const { isBuffering: currentlyBuffering, isPlaying: intendedPlaying } = stateRef.current;

        // Case 1: Buffering (already handled by onBuffer)
        if (!playing && currentlyBuffering) {
          return;
        }

        // Case 2: Unintended pause (Stall/Network drop)
        // Show buffering and let react-native-video's minLoadRetryCount handle reconnection
        if (!playing && intendedPlaying) {
          setIsBuffering(true);
          // Don't update isPlaying state - trust native retry mechanism
          return;
        }

        setIsPlaying(playing);
      }

      if (playing) {
        setIsBuffering(false);
        setIsPlayerReady(true);
      }
    },
    [setIsPlaying, setIsBuffering, setIsPlayerReady]
  );

  const handleBuffer = useCallback(
    ({ isBuffering: buffering }: { isBuffering: boolean }) => {
      setIsBuffering(buffering);
    },
    [setIsBuffering]
  );

  const handleLoadStart = useCallback(() => {
    setIsBuffering(true);
  }, [setIsBuffering]);

  // Live streams don't have an "end" - ignore this event
  const handleEnd = useCallback(() => {
    // No-op for live streams
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      // For live streams, show buffering instead of stopping
      // The retry mechanism (minLoadRetryCount) will attempt to reconnect
      setIsBuffering(true);

      // af_video_live: video_vivo_error_setup / video_vivo_error_playback
      if (currentTimeRef.current === 0) {
        liveTracker?.liveVideoErrorSetup();
      } else {
        liveTracker?.liveVideoErrorPlayback();
      }

      // Still notify parent of error for logging purposes
      onError?.(error);
    },
    [setIsBuffering, onError, analyticsConfig]
  );

  const handlePictureInPictureStatusChanged = useCallback(
    ({ isActive }: { isActive: boolean }) => {
      // af_video_live: video_vivo_pip_open / video_vivo_pip_close
      if (isActive) {
        liveTracker?.liveVideoPipOpen();
      } else {
        liveTracker?.liveVideoPipClose();
      }
      onPictureInPictureStatusChanged?.(isActive);
    },
    [onPictureInPictureStatusChanged, liveTracker]
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
    // Explicitly set type for HLS streams
    ...(videoUrl?.includes('.m3u8') && { type: 'm3u8' as const }),
    metadata: {
      title,
      artist: 'N+ Live'
    },
    bufferConfig: LIVE_BUFFER_CONFIG,
    // Higher retry count for live streams
    minLoadRetryCount: LIVE_MIN_LOAD_RETRY_COUNT
  };

  return (
    <Video
      ref={handleRef}
      source={sourceConfig}
      style={style}
      resizeMode={ResizeMode.CONTAIN}
      paused={!isPlaying}
      muted={isMuted}
      rate={1} // Live streams always play at normal speed
      selectedVideoTrack={selectedVideoTrack}
      selectedTextTrack={selectedTextTrack}
      maxBitRate={maxBitRate}
      repeat={false}
      viewType={ViewType.SURFACE}
      controls={false}
      bufferingStrategy={BufferingStrategyType.DEFAULT}
      progressUpdateInterval={1000} // Less frequent updates for live
      playInBackground={true}
      playWhenInactive={true}
      enterPictureInPictureOnLeave={false}
      showNotificationControls={true}
      ignoreSilentSwitch="ignore"
      fullscreen={false}
      // iOS specific settings for live streaming
      // preferredForwardBufferDuration={LIVE_IOS_CONFIG.preferredForwardBufferDuration}
      automaticallyWaitsToMinimizeStalling={LIVE_IOS_CONFIG.automaticallyWaitsToMinimizeStalling}
      // Hide black shutter view for live streams
      hideShutterView={true}
      // Don't throw error on network loss - keep trying to buffer (Android)
      disableDisconnectError={true}
      // No poster for live - show live feed immediately
      filterEnabled={false}
      onLoadStart={handleLoadStart}
      onLoad={handleLoad}
      onProgress={handleProgress}
      onPlaybackStateChanged={handlePlaybackStateChanged}
      onEnd={handleEnd}
      onBuffer={handleBuffer}
      onError={handleError}
      onReadyForDisplay={() => onReadyForDisplayProp?.()}
      onPictureInPictureStatusChanged={handlePictureInPictureStatusChanged}
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
        const hasSubtitles = hasValidTextTracks(data.textTracks);
        onTextTracksChange?.(hasSubtitles);
      }}
      onAudioTracks={() => {}}
    />
  );
};

export default React.memo(LiveVideoCore);
