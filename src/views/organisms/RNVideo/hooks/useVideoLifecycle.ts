import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useVideoPlayerContext } from '../context/VideoPlayerContext';

interface UseVideoLifecycleConfig {
  isFocused: boolean;
  currentVideoType: string;
  videoType?: string;
  keys?: number;
  activeVideoIndex?: number;
  persistPlaybackTime?: (time: number) => void;
  setIsVideoPlayingProp?: (isPlaying: boolean) => void;
  setHasStarted: (hasStarted: boolean) => void;
}

/**
 * Hook that manages video player lifecycle events.
 * Handles app state changes, screen focus, and video type switching.
 *
 * @param config - Configuration object with lifecycle dependencies
 */
export const useVideoLifecycle = (config: UseVideoLifecycleConfig): void => {
  const {
    isFocused,
    currentVideoType,
    videoType,
    keys,
    activeVideoIndex,
    persistPlaybackTime,
    setIsVideoPlayingProp,
    setHasStarted
  } = config;

  // Use Context instead of Store
  const { state, setIsPlaying, setIsBuffering, setCurrentTime } = useVideoPlayerContext();

  // Keep a ref of currentTime to access it in event listeners without re-binding
  const currentTimeRef = useRef(state.currentTime);

  useEffect(() => {
    currentTimeRef.current = state.currentTime;
  }, [state.currentTime]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (appState: AppStateStatus) => {
      if (appState === 'background' || appState === 'active') {
        const currentTime = currentTimeRef.current;
        persistPlaybackTime?.(currentTime);
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [persistPlaybackTime]);

  // Handle screen focus changes
  useEffect(() => {
    if (!isFocused) {
      const currentTime = currentTimeRef.current;
      persistPlaybackTime?.(currentTime);
      setIsPlaying(false);
      setIsBuffering(false);
      setHasStarted(false);
      setIsVideoPlayingProp?.(false);
    }
  }, [
    isFocused,
    persistPlaybackTime,
    setIsVideoPlayingProp,
    setIsPlaying,
    setIsBuffering,
    setHasStarted
  ]);

  // Handle video type changes (switching between different video sections)
  useEffect(() => {
    if (currentVideoType !== videoType) {
      setIsPlaying(false);
      setIsBuffering(false);
      setHasStarted(false);
      setIsVideoPlayingProp?.(false);
    }
  }, [
    currentVideoType,
    videoType,
    setIsVideoPlayingProp,
    setIsPlaying,
    setIsBuffering,
    setHasStarted
  ]);

  // Handle active video index changes (for playlists/carousels)
  useEffect(() => {
    if (keys !== activeVideoIndex) {
      setCurrentTime(0);
      setHasStarted(false);
      setIsPlaying(false);
    }
  }, [activeVideoIndex, keys, setCurrentTime, setIsPlaying, setHasStarted]);
};
