import { useEffect, useRef, useState, useCallback } from 'react';

import { useVideoPlayerContext } from '../context/VideoPlayerContext';

interface UseVideoTransitionConfig {
  hasStarted: boolean;
}

interface UseVideoTransitionReturn {
  isTransitioning: boolean;
  isTransitioningRef: React.MutableRefObject<boolean>;
  handleTransitionComplete: () => void;
}

/**
 * Hook that manages fullscreen transition state and animations.
 * Handles the loading overlay shown during fullscreen transitions.
 *
 * @param isFullScreen - Current fullscreen state
 * @param config - Configuration object containing hasStarted state
 * @returns Transition state and handlers
 */
export const useVideoTransition = (
  isFullScreen: boolean,
  config: UseVideoTransitionConfig
): UseVideoTransitionReturn => {
  const { hasStarted } = config;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevFullScreenRef = useRef<boolean | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef(isTransitioning);

  // Context actions for managing transition state
  const { startTransition, endTransition } = useVideoPlayerContext();

  // Keep ref in sync with state
  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Handle fullscreen transition
  useEffect(() => {
    if (prevFullScreenRef.current === null) {
      prevFullScreenRef.current = isFullScreen;
      return;
    }

    if (prevFullScreenRef.current !== isFullScreen && hasStarted) {
      setIsTransitioning(true);
      // Save playing state before transition
      startTransition();

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        // Restore playing state after transition timeout
        endTransition();
        transitionTimeoutRef.current = null;
      }, 3000);
    }

    prevFullScreenRef.current = isFullScreen;

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [isFullScreen, hasStarted, startTransition, endTransition]);

  // Callback to complete transition early (e.g., when video is ready)
  const handleTransitionComplete = useCallback(() => {
    if (isTransitioningRef.current) {
      setIsTransitioning(false);
      // Restore playing state when transition completes early
      endTransition();
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    }
  }, [endTransition]);

  return {
    isTransitioning,
    isTransitioningRef,
    handleTransitionComplete
  };
};
