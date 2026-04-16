import { BackHandler } from 'react-native';

import Orientation from 'react-native-orientation-locker';

interface FullScreenBackHandlerOptions {
  isFullScreen: boolean;
  setFullScreen: (value: boolean) => void;
  setFullScreenPipMode?: (value: boolean) => void;
  onTogglePiP?: (value: boolean) => void;
  setIsMediaPipMode?: (value: boolean) => void;
  setShowPlayer?: (value: boolean) => void;
}

/**
 * Registers a hardware back button handler for fullscreen/PiP mode.
 * Returns a cleanup function to remove the handler.
 */

export const registerFullScreenBackHandler = ({
  isFullScreen,
  setFullScreen,
  setFullScreenPipMode,
  onTogglePiP,
  setIsMediaPipMode,
  setShowPlayer
}: FullScreenBackHandlerOptions): (() => void) => {
  const backAction = (): boolean => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
      setFullScreen(false);
      setFullScreenPipMode?.(false);
      onTogglePiP?.(false);
      setIsMediaPipMode?.(false);
      setShowPlayer?.(true);
      return true;
    }
    return false;
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  return () => backHandler.remove();
};
