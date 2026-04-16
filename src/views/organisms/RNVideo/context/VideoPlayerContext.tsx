import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { VideoProgressTracker } from '@src/services/analytics/videoAnalyticsHelpers';
import { createVideoLiveTracker } from '@src/services/analytics/videoLiveAnalyticsHelpers';
import {
  logLiveVideoEvent,
  logVideoEvent
} from '@src/services/analytics/videoPlayerContentAnalyticsHelper';
import { getCurrentSignalTime } from '@src/utils/dateFormatter';

// Estado de instancia
interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  isBuffering: boolean;
  isPlayerReady: boolean;
  captionsEnabled: boolean;
  isAdPlaying: boolean;
  isAdPaused: boolean;
  pendingSeekResume: boolean;
  isTransitioning: boolean;
  wasPlayingBeforeTransition: boolean;
  hasEnded: boolean; // Track if video has ended (shared across all VideoCore instances)
  videoProgressTracker: VideoProgressTracker; // Track video progress milestones for analytics
}

// Action Types Constants
const ACTION_TYPES = {
  SET_IS_PLAYING: 'SET_IS_PLAYING',
  SET_IS_MUTED: 'SET_IS_MUTED',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_SPEED: 'SET_SPEED',
  SET_IS_BUFFERING: 'SET_IS_BUFFERING',
  SET_IS_PLAYER_READY: 'SET_IS_PLAYER_READY',
  SET_CAPTIONS_ENABLED: 'SET_CAPTIONS_ENABLED',
  SET_IS_AD_PLAYING: 'SET_IS_AD_PLAYING',
  SET_IS_AD_PAUSED: 'SET_IS_AD_PAUSED',
  SET_PENDING_SEEK_RESUME: 'SET_PENDING_SEEK_RESUME',
  SET_HAS_ENDED: 'SET_HAS_ENDED',
  SET_VIDEO_PROGRESS_TRACKER: 'SET_VIDEO_PROGRESS_TRACKER',
  START_TRANSITION: 'START_TRANSITION',
  END_TRANSITION: 'END_TRANSITION',
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  TOGGLE_CAPTIONS: 'TOGGLE_CAPTIONS',
  TOGGLE_AD_PAUSE: 'TOGGLE_AD_PAUSE',
  CYCLE_SPEED: 'CYCLE_SPEED',
  RESET: 'RESET'
} as const;

// Acciones
type VideoPlayerAction =
  | { type: typeof ACTION_TYPES.SET_IS_PLAYING; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_IS_MUTED; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_CURRENT_TIME; payload: number }
  | { type: typeof ACTION_TYPES.SET_DURATION; payload: number }
  | { type: typeof ACTION_TYPES.SET_SPEED; payload: number }
  | { type: typeof ACTION_TYPES.SET_IS_BUFFERING; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_IS_PLAYER_READY; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_CAPTIONS_ENABLED; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_IS_AD_PLAYING; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_IS_AD_PAUSED; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_PENDING_SEEK_RESUME; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_HAS_ENDED; payload: boolean }
  | { type: typeof ACTION_TYPES.SET_VIDEO_PROGRESS_TRACKER; payload: VideoProgressTracker }
  | { type: typeof ACTION_TYPES.START_TRANSITION }
  | { type: typeof ACTION_TYPES.END_TRANSITION }
  | { type: typeof ACTION_TYPES.TOGGLE_PLAY }
  | { type: typeof ACTION_TYPES.TOGGLE_MUTE }
  | { type: typeof ACTION_TYPES.TOGGLE_CAPTIONS }
  | { type: typeof ACTION_TYPES.TOGGLE_AD_PAUSE }
  | { type: typeof ACTION_TYPES.CYCLE_SPEED }
  | { type: typeof ACTION_TYPES.RESET };

const initialState: VideoPlayerState = {
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  isBuffering: true,
  isPlayerReady: false,
  captionsEnabled: false,
  isAdPlaying: false,
  isAdPaused: false,
  pendingSeekResume: false,
  isTransitioning: false,
  wasPlayingBeforeTransition: false,
  hasEnded: false,
  videoProgressTracker: {
    hasStarted: false,
    hasReached25Percent: false,
    hasReached50Percent: false,
    hasReached75Percent: false,
    hasCompleted: false
  }
};

const SPEED_OPTIONS = [1, 1.5, 2];

// Handlers Map
const handlers: Record<
  string,
  (state: VideoPlayerState, action: VideoPlayerAction) => VideoPlayerState
> = {
  [ACTION_TYPES.SET_IS_PLAYING]: (state, action) => ({
    ...state,
    isPlaying: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_IS_MUTED]: (state, action) => ({
    ...state,
    isMuted: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_CURRENT_TIME]: (state, action) => ({
    ...state,
    currentTime: (action as { payload: number }).payload
  }),
  [ACTION_TYPES.SET_DURATION]: (state, action) => ({
    ...state,
    duration: (action as { payload: number }).payload
  }),
  [ACTION_TYPES.SET_SPEED]: (state, action) => ({
    ...state,
    speed: (action as { payload: number }).payload
  }),
  [ACTION_TYPES.SET_IS_BUFFERING]: (state, action) => ({
    ...state,
    isBuffering: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_IS_PLAYER_READY]: (state, action) => ({
    ...state,
    isPlayerReady: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_CAPTIONS_ENABLED]: (state, action) => ({
    ...state,
    captionsEnabled: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_IS_AD_PLAYING]: (state, action) => {
    const isPlaying = (action as { payload: boolean }).payload;
    return {
      ...state,
      isAdPlaying: isPlaying,
      isAdPaused: isPlaying ? state.isAdPaused : false
    };
  },
  [ACTION_TYPES.SET_IS_AD_PAUSED]: (state, action) => ({
    ...state,
    isAdPaused: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_PENDING_SEEK_RESUME]: (state, action) => ({
    ...state,
    pendingSeekResume: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_HAS_ENDED]: (state, action) => ({
    ...state,
    hasEnded: (action as { payload: boolean }).payload
  }),
  [ACTION_TYPES.SET_VIDEO_PROGRESS_TRACKER]: (state, action) => ({
    ...state,
    videoProgressTracker: (action as { payload: VideoProgressTracker }).payload
  }),
  [ACTION_TYPES.START_TRANSITION]: (state) => ({
    ...state,
    isTransitioning: true,
    wasPlayingBeforeTransition: state.isPlaying
  }),
  [ACTION_TYPES.END_TRANSITION]: (state) => ({
    ...state,
    isTransitioning: false,
    wasPlayingBeforeTransition: false,
    isPlaying: state.wasPlayingBeforeTransition ? true : state.isPlaying
  }),
  [ACTION_TYPES.TOGGLE_PLAY]: (state) => ({ ...state, isPlaying: !state.isPlaying }),
  [ACTION_TYPES.TOGGLE_MUTE]: (state) => ({ ...state, isMuted: !state.isMuted }),
  [ACTION_TYPES.TOGGLE_CAPTIONS]: (state) => ({
    ...state,
    captionsEnabled: !state.captionsEnabled
  }),
  [ACTION_TYPES.TOGGLE_AD_PAUSE]: (state) => ({
    ...state,
    isAdPaused: !state.isAdPaused
  }),
  [ACTION_TYPES.CYCLE_SPEED]: (state) => {
    const currentIndex = SPEED_OPTIONS.indexOf(state.speed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    return { ...state, speed: SPEED_OPTIONS[nextIndex] };
  },
  [ACTION_TYPES.RESET]: () => ({ ...initialState })
};

function videoPlayerReducer(state: VideoPlayerState, action: VideoPlayerAction): VideoPlayerState {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}

// Context value interface
interface VideoPlayerContextValue {
  state: VideoPlayerState;
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
    channel?: string;
    idPage?: string;
    screenPageWebUrl?: string;
    publication?: string;
    duration?: string;
    tags?: string;
    videoType?: string;
    production?: string;
  };
  // Actions
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setSpeed: (speed: number) => void;
  setIsBuffering: (buffering: boolean) => void;
  setIsPlayerReady: (ready: boolean) => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setIsAdPlaying: (playing: boolean) => void;
  setIsAdPaused: (paused: boolean) => void;
  setPendingSeekResume: (pending: boolean) => void;
  setHasEnded: (ended: boolean) => void;
  setVideoProgressTracker: (tracker: VideoProgressTracker) => void;
  startTransition: () => void;
  endTransition: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleCaptions: () => void;
  toggleAdPause: () => void;
  cycleSpeed: () => void;
  reset: () => void;
  // Utilities
  formatTime: (secs: number) => string;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

export const VideoPlayerProvider: React.FC<{
  children: React.ReactNode;
  initialState?: Partial<VideoPlayerState>;
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
    channel?: string;
    idPage?: string;
    screenPageWebUrl?: string;
    publication?: string;
    duration?: string;
    tags?: string;
    videoType?: string;
    production?: string;
  };
}> = ({ children, initialState: customInitialState, analyticsConfig }) => {
  const [state, dispatch] = useReducer(videoPlayerReducer, {
    ...initialState,
    ...customInitialState
  });

  const setIsPlaying = useCallback((playing: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_PLAYING, payload: playing });
  }, []);

  const setIsMuted = useCallback((muted: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_MUTED, payload: muted });
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: ACTION_TYPES.SET_CURRENT_TIME, payload: time });
  }, []);

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: ACTION_TYPES.SET_DURATION, payload: duration });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: ACTION_TYPES.SET_SPEED, payload: speed });
  }, []);

  const setIsBuffering = useCallback((buffering: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_BUFFERING, payload: buffering });
  }, []);

  const setIsPlayerReady = useCallback((ready: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_PLAYER_READY, payload: ready });
  }, []);

  // ─── af_video_live tracker ────────────────────────────────────────────────
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

  const setCaptionsEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_CAPTIONS_ENABLED, payload: enabled });
  }, []);

  const setIsAdPlaying = useCallback((playing: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_AD_PLAYING, payload: playing });
  }, []);

  const setIsAdPaused = useCallback((paused: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_IS_AD_PAUSED, payload: paused });
  }, []);

  const setPendingSeekResume = useCallback((pending: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_PENDING_SEEK_RESUME, payload: pending });
  }, []);

  const setHasEnded = useCallback((ended: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_HAS_ENDED, payload: ended });
  }, []);

  const setVideoProgressTracker = useCallback((tracker: VideoProgressTracker) => {
    dispatch({ type: ACTION_TYPES.SET_VIDEO_PROGRESS_TRACKER, payload: tracker });
  }, []);

  const startTransition = useCallback(() => {
    dispatch({ type: ACTION_TYPES.START_TRANSITION });
  }, []);

  const endTransition = useCallback(() => {
    dispatch({ type: ACTION_TYPES.END_TRANSITION });
  }, []);

  const togglePlay = useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: state.isPlaying ? ANALYTICS_ATOMS.PAUSE : ANALYTICS_ATOMS.PLAY,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });

    // Only send logVideoEvent for non-live videos
    if (!analyticsConfig?.channel) {
      logVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: state.isPlaying ? ANALYTICS_ATOMS.PAUSE : ANALYTICS_ATOMS.PLAY,
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
    } else {
      logLiveVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: state.isPlaying ? ANALYTICS_ATOMS.PAUSE : ANALYTICS_ATOMS.PLAY,
        event_label: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType,
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        production: analyticsConfig?.channel,
        signal_time: getCurrentSignalTime()
      });
    }

    // af_video_live: video_vivo_pause / video_vivo_resume
    if (state.isPlaying) {
      liveTracker?.liveVideoPause();
    } else {
      liveTracker?.liveVideoResume();
    }

    dispatch({ type: ACTION_TYPES.TOGGLE_PLAY });
  }, [state.isPlaying, analyticsConfig, liveTracker]);

  const toggleMute = useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.NO_SOUND,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });

    // Only send logVideoEvent for non-live videos
    if (!analyticsConfig?.channel) {
      logVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: ANALYTICS_ATOMS.NO_SOUND,
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
    } else {
      logLiveVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: ANALYTICS_ATOMS.NO_SOUND,
        event_label: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType,
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        production: analyticsConfig?.channel,
        signal_time: getCurrentSignalTime()
      });
    }

    // af_video_live: video_vivo_mute / video_vivo_unmute
    if (state.isMuted) {
      liveTracker?.liveVideoUnmute();
    } else {
      liveTracker?.liveVideoMute();
    }

    dispatch({ type: ACTION_TYPES.TOGGLE_MUTE });
  }, [state.isMuted, analyticsConfig, liveTracker]);

  const toggleCaptions = useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.CLOSED_CAPTION,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });

    // Only send logVideoEvent for non-live videos
    if (!analyticsConfig?.channel) {
      logVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: ANALYTICS_ATOMS.CLOSED_CAPTION,
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
    }

    dispatch({ type: ACTION_TYPES.TOGGLE_CAPTIONS });
  }, [analyticsConfig]);

  const toggleAdPause = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_AD_PAUSE });
  }, []);

  const cycleSpeed = useCallback(() => {
    let speedAction;
    switch (state.speed) {
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

    // Only send logVideoEvent for non-live videos
    if (!analyticsConfig?.channel) {
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
    } else {
      logLiveVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: speedAction,
        event_label: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType,
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        production: analyticsConfig?.channel,
        signal_time: getCurrentSignalTime()
      });
    }

    dispatch({ type: ACTION_TYPES.CYCLE_SPEED });
  }, [state.speed, analyticsConfig]);

  const reset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
  }, []);

  const formatTime = useCallback((secs: number): string => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
    const seconds = String(Math.floor(secs % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  const value = useMemo<VideoPlayerContextValue>(
    () => ({
      state,
      analyticsConfig,
      setIsPlaying,
      setIsMuted,
      setCurrentTime,
      setDuration,
      setSpeed,
      setIsBuffering,
      setIsPlayerReady,
      setCaptionsEnabled,
      setIsAdPlaying,
      setIsAdPaused,
      setPendingSeekResume,
      setHasEnded,
      setVideoProgressTracker,
      startTransition,
      endTransition,
      togglePlay,
      toggleMute,
      toggleCaptions,
      toggleAdPause,
      cycleSpeed,
      reset,
      formatTime
    }),
    [
      state,
      analyticsConfig,
      setIsPlaying,
      setIsMuted,
      setCurrentTime,
      setDuration,
      setSpeed,
      setIsBuffering,
      setIsPlayerReady,
      setCaptionsEnabled,
      setIsAdPlaying,
      setIsAdPaused,
      setPendingSeekResume,
      setHasEnded,
      setVideoProgressTracker,
      startTransition,
      endTransition,
      togglePlay,
      toggleMute,
      toggleCaptions,
      toggleAdPause,
      cycleSpeed,
      reset,
      formatTime
    ]
  );

  return <VideoPlayerContext.Provider value={value}>{children}</VideoPlayerContext.Provider>;
};

export const useVideoPlayerContext = (): VideoPlayerContextValue => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayerContext must be used within a VideoPlayerProvider');
  }
  return context;
};

export default VideoPlayerContext;
