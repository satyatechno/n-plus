import { useRef, useCallback } from 'react';

import type { VideoRef } from 'react-native-video';

let globalVideoRef: VideoRef | null = null;

export const useVideoRef = () => {
  const localRef = useRef<VideoRef>(null!);

  const setRef = useCallback((ref: VideoRef | null) => {
    if (ref) {
      localRef.current = ref;
      globalVideoRef = ref;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    globalVideoRef?.seek(time);
  }, []);

  const enterPictureInPicture = useCallback(() => {
    try {
      if (globalVideoRef) {
        globalVideoRef.enterPictureInPicture();
      }
    } catch {
      // PiP may not be supported or available
    }
  }, []);

  const pause = useCallback(() => {
    globalVideoRef?.pause();
  }, []);

  const resume = useCallback(() => {
    globalVideoRef?.resume();
  }, []);

  return {
    ref: localRef,
    setRef,
    seekTo,
    enterPictureInPicture,
    pause,
    resume,
    getRef: () => globalVideoRef
  };
};

export const getGlobalVideoRef = () => globalVideoRef;

export const clearGlobalVideoRef = () => {
  globalVideoRef = null;
};
