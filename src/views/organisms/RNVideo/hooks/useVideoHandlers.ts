import { useCallback, useRef, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { OnReceiveAdEventData } from 'react-native-video';

import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { useVideoRef } from '@src/views/organisms/RNVideo/hooks/useVideoRef';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import { ANALYTICS_MOLECULES, ANALYTICS_ATOMS } from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logVideoEvent } from '@src/services/analytics/videoPlayerContentAnalyticsHelper';

interface UseVideoHandlersConfig {
  videoUrl: string;
  videoType?: string;
  initialSeekTime: number;
  isInternetConnection: boolean;
  runOnPlay: boolean;
  persistPlaybackTime?: (time: number) => void;
  setIsVideoPlayingProp?: (isPlaying: boolean) => void;
  setToastType?: (type: 'success' | 'error') => void;
  setToastMessage?: (message: string) => void;
  setHasStarted: (hasStarted: boolean) => void;
  onExitPiP?: () => void;
  onEnterPiP?: () => void;
  onFullScreenPress?: () => void;
  onReceiveAdEvent?: (event: OnReceiveAdEventData) => void;
  onAdStatusChanged?: (isAdPlaying: boolean) => void;
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

interface UseVideoHandlersReturn {
  handleStart: () => void;
  handleFullScreenPress: () => void;
  handleExitFullscreen: () => void;
  handleEnterPiP: () => void;
  handleVideoEnd: () => void;
  stableHandleVideoEnd: () => void;
  stableOnReceiveAdEvent: (event: OnReceiveAdEventData) => void;
  stableOnAdStatusChanged: (isAdPlaying: boolean) => void;
}

/**
 * Hook that provides all video player event handlers.
 * Centralizes handler logic and provides stable callback references.
 *
 * @param config - Configuration object with handler dependencies
 * @returns Object containing all event handlers
 */
export const useVideoHandlers = (config: UseVideoHandlersConfig): UseVideoHandlersReturn => {
  const {
    videoUrl,
    videoType,
    initialSeekTime,
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
  } = config;

  const { t } = useTranslation();
  const { seekTo, enterPictureInPicture } = useVideoRef();

  // Use individual selectors to avoid creating new objects on each render
  const setCurrentVideoType = useVideoPlayerStore((state) => state.setCurrentVideoType);
  const setActiveVideoUrl = useVideoPlayerStore((state) => state.setActiveVideoUrl);
  const setFullScreen = useVideoPlayerStore((state) => state.setFullScreen);
  const setMediaFullScreen = useVideoPlayerStore((state) => state.setMediaFullScreen);

  // Context Actions
  const { state, setIsPlaying } = useVideoPlayerContext();

  // Refs for stable callbacks
  const isFullScreenRef = useRef(false);
  const handleVideoEndRef = useRef<(() => void) | null>(null);
  const onReceiveAdEventRef = useRef(onReceiveAdEvent);
  const onAdStatusChangedRef = useRef(onAdStatusChanged);
  const currentTimeRef = useRef(state.currentTime);

  // Keep refs in sync
  useEffect(() => {
    currentTimeRef.current = state.currentTime;
  }, [state.currentTime]);

  useEffect(() => {
    const unsubscribe = useVideoPlayerStore.subscribe((state) => {
      isFullScreenRef.current = state.isFullScreen;
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    onReceiveAdEventRef.current = onReceiveAdEvent;
  }, [onReceiveAdEvent]);

  useEffect(() => {
    onAdStatusChangedRef.current = onAdStatusChanged;
  }, [onAdStatusChanged]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    persistPlaybackTime?.(0);
  }, [persistPlaybackTime]);

  useEffect(() => {
    handleVideoEndRef.current = handleVideoEnd;
  }, [handleVideoEnd]);

  const stableHandleVideoEnd = useCallback(() => {
    handleVideoEndRef.current?.();
  }, []);

  // Stable ad event handlers
  const stableOnReceiveAdEvent = useCallback((event: OnReceiveAdEventData) => {
    onReceiveAdEventRef.current?.(event);
  }, []);

  const stableOnAdStatusChanged = useCallback((isAdPlaying: boolean) => {
    onAdStatusChangedRef.current?.(isAdPlaying);
  }, []);

  // Handle start playback
  const handleStart = useCallback(() => {
    if (isInternetConnection) {
      setHasStarted(true);
      onExitPiP?.();
      if (runOnPlay) {
        setIsPlaying(true);
        setIsVideoPlayingProp?.(true);
      } else {
        seekTo(initialSeekTime);
      }
      setCurrentVideoType(videoType ?? '');
      setActiveVideoUrl(videoUrl);
    } else {
      setToastType?.('error');
      setToastMessage?.(t('screens.splash.text.noInternetConnection'));
    }
  }, [
    isInternetConnection,
    onExitPiP,
    runOnPlay,
    setIsPlaying,
    setIsVideoPlayingProp,
    seekTo,
    initialSeekTime,
    setCurrentVideoType,
    videoType,
    setActiveVideoUrl,
    videoUrl,
    setToastType,
    setToastMessage,
    setHasStarted,
    t
  ]);

  // Handle fullscreen toggle
  const handleFullScreenPress = useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.FULLSCREEN,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });
    logVideoEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.FULLSCREEN,
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

    if (isFullScreenRef.current) {
      setFullScreen(false);
      setMediaFullScreen(false);
      onExitPiP?.();
    } else {
      const currentTime = currentTimeRef.current;
      persistPlaybackTime?.(currentTime);
      setFullScreen(true);
      setMediaFullScreen(true);
      onFullScreenPress?.();
    }
  }, [
    setFullScreen,
    setMediaFullScreen,
    onExitPiP,
    persistPlaybackTime,
    onFullScreenPress,
    analyticsConfig
  ]);

  // Handle exit fullscreen
  const handleExitFullscreen = useCallback(() => {
    setFullScreen(false);
    setMediaFullScreen(false);
    onExitPiP?.();
  }, [setFullScreen, setMediaFullScreen, onExitPiP]);

  // Handle enter PiP
  const handleEnterPiP = useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.PIP,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });
    logVideoEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.PIP,
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

    const currentTime = currentTimeRef.current;
    const wasPlaying = state.isPlaying;

    persistPlaybackTime?.(currentTime);

    // If in fullscreen, exit first then enter PiP
    // PiP doesn't work properly when video is inside Modal
    if (isFullScreenRef.current) {
      setFullScreen(false);
      setMediaFullScreen(false);
      // Small delay to let the Modal close before activating PiP
      setTimeout(() => {
        enterPictureInPicture();
        // Resume playback if it was playing before transition
        if (wasPlaying) {
          setIsPlaying(true);
        }
        onEnterPiP?.();
      }, 150); // Increased delay slightly for stability
    } else {
      enterPictureInPicture();
      onEnterPiP?.();
    }
  }, [
    persistPlaybackTime,
    enterPictureInPicture,
    onEnterPiP,
    setFullScreen,
    setMediaFullScreen,
    state.isPlaying,
    setIsPlaying,
    analyticsConfig
  ]);

  return {
    handleStart,
    handleFullScreenPress,
    handleExitFullscreen,
    handleEnterPiP,
    handleVideoEnd,
    stableHandleVideoEnd,
    stableOnReceiveAdEvent,
    stableOnAdStatusChanged
  };
};
