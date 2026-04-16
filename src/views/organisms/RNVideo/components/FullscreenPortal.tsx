import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
  useRef
} from 'react';
import { View, StyleSheet, StatusBar, Modal } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';

import { colors } from '@src/themes/colors';
import { useTheme } from '@src/hooks/useTheme';

/**
 * FullscreenPortal System
 *
 * A "Teleportation" Portal System that implements a robust fullscreen video architecture.
 * This system moves video content from its original container to a root-level Modal,
 * preserving playback state and ad continuity across UI transitions.
 *
 * Problem solved:
 * Traditional navigation-based fullscreen implementations often unmount the video component,
 * causing playback restart and ad session loss.
 *
 * Solution:
 * The Portal system "teleports" the VideoCore component to a root-level Modal while using
 * State Preservation via Zustand to instantly restore playback position and logical state,
 * simulating a seamless transition.
 *
 * Architecture:
 * ```
 * ┌─────────────────────────────────────────┐
 * │ Parent Screen                           │
 * │  ├── <FullscreenPortal id="video-1">    │
 * │  │     <VideoCore />                    │ ← Original Mount
 * │  │   </FullscreenPortal>                │
 * └─────────────────────────────────────────┘
 *               │
 *               ▼ (User Taps Fullscreen)
 * ┌─────────────────────────────────────────┐
 * │ FullscreenPortalHost (Root Modal)       │
 * │  └── <VideoCore />                      │ ← "Teleported" View
 * └─────────────────────────────────────────┘
 * ```
 *
 * Components:
 * - FullscreenPortalProvider: Context provider that manages portal state. Wrap at app root.
 * - FullscreenPortalHost: Renders active portals in a fullscreen Modal. Place after Provider.
 * - FullscreenPortal: Wrapper component that teleports children when isActive is true.
 *
 * Side effects & external dependencies:
 * - Uses react-native-orientation-locker to unlock orientations in fullscreen mode.
 * - Manages StatusBar visibility (hidden in fullscreen).
 * - Uses React Context for state management across component tree.
 *
 * @example
 * // App.tsx - Setup
 * <FullscreenPortalProvider>
 *   <NavigationContainer>
 *     <AppNavigator />
 *   </NavigationContainer>
 *   <FullscreenPortalHost />
 * </FullscreenPortalProvider>
 *
 * // VideoScreen.tsx - Usage
 * <FullscreenPortal isActive={isFullscreen} onExitFullscreen={handleExit}>
 *   <VideoCore videoUrl={url} />
 * </FullscreenPortal>
 */

interface PortalItem {
  content: ReactNode;
  onExit?: () => void;
}

interface PortalDispatchContextValue {
  registerPortal: (id: string, content: ReactNode, onExit?: () => void) => void;
  unregisterPortal: (id: string) => void;
}

interface PortalStateContextValue {
  portals: Map<string, PortalItem>;
}

interface FullscreenPortalProviderProps {
  children: ReactNode;
}

interface FullscreenPortalProps {
  id?: string;
  isActive: boolean;
  children: ReactNode;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  has9_16?: boolean;
}

const PortalDispatchContext = createContext<PortalDispatchContextValue | null>(null);
const PortalStateContext = createContext<PortalStateContextValue | null>(null);

export const FullscreenPortalProvider: React.FC<FullscreenPortalProviderProps> = ({ children }) => {
  const [portals, setPortals] = useState<Map<string, PortalItem>>(new Map());

  const registerPortal = useCallback((id: string, content: ReactNode, onExit?: () => void) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.set(id, { content, onExit });
      return next;
    });
  }, []);

  const unregisterPortal = useCallback((id: string) => {
    setPortals((prev) => {
      const next = new Map(prev);
      if (!next.has(id)) return prev;
      next.delete(id);
      return next;
    });
  }, []);

  const dispatchValue = useMemo(
    () => ({ registerPortal, unregisterPortal }),
    [registerPortal, unregisterPortal]
  );

  const stateValue = useMemo(() => ({ portals }), [portals]);

  return (
    <PortalDispatchContext.Provider value={dispatchValue}>
      <PortalStateContext.Provider value={stateValue}>{children}</PortalStateContext.Provider>
    </PortalDispatchContext.Provider>
  );
};

/**
 * Host component that renders active fullscreen portals.
 * Should be placed at the root level of the app, after FullscreenPortalProvider.
 */
export const FullscreenPortalHost: React.FC = () => {
  const state = useContext(PortalStateContext);
  const dispatch = useContext(PortalDispatchContext);
  const [theme] = useTheme();

  if (!state) {
    return null;
  }

  const { portals } = state;

  if (portals.size === 0) {
    return null;
  }

  const handleRequestClose = () => {
    const keys = Array.from(portals.keys());
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const item = portals.get(lastKey);
      item?.onExit?.();
      dispatch?.unregisterPortal(lastKey);
    }
  };

  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="fade"
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={handleRequestClose}
      statusBarTranslucent={true}
      presentationStyle="fullScreen"
    >
      <StatusBar hidden translucent backgroundColor="transparent" />
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: theme.reelBackground }]}>
        {Array.from(portals.entries()).map(([id, item]) => (
          <View key={id} style={styles.fullscreenContainer}>
            {item.content}
          </View>
        ))}
      </SafeAreaView>
    </Modal>
  );
};

let portalIdCounter = 0;

/**
 * Component that teleports its children to fullscreen mode.
 * Manages orientation locking and provides enter/exit callbacks.
 *
 * @example
 * <FullscreenPortal isActive={isFullscreen} onExitFullscreen={handleExit}>
 *   <VideoPlayer />
 * </FullscreenPortal>
 */
export const FullscreenPortal: React.FC<FullscreenPortalProps> = ({
  id: providedId,
  isActive,
  children,
  onEnterFullscreen,
  onExitFullscreen,
  has9_16
}) => {
  const dispatch = useContext(PortalDispatchContext);
  const [portalId] = useState(() => providedId || `portal-${++portalIdCounter}`);

  const onEnterRef = useRef(onEnterFullscreen);
  const onExitRef = useRef(onExitFullscreen);

  // Store children in a ref to avoid re-registering portal on every content change
  // This is the key fix: children changes should NOT cause portal re-registration
  const childrenRef = useRef(children);
  childrenRef.current = children;

  useEffect(() => {
    onEnterRef.current = onEnterFullscreen;
    onExitRef.current = onExitFullscreen;
  }, [onEnterFullscreen, onExitFullscreen]);

  useEffect(() => {
    if (isActive) {
      onEnterRef.current?.();
      if (!has9_16) {
        Orientation.unlockAllOrientations();
      }
    } else {
      onExitRef.current?.();
      Orientation.lockToPortrait();
    }

    return () => {
      if (isActive) {
        Orientation.lockToPortrait();
      }
    };
  }, [isActive]);

  // Track if we're currently registered to avoid unnecessary updates
  const isRegisteredRef = useRef(false);

  // Register portal when isActive becomes true, unregister when false
  useEffect(() => {
    if (!dispatch) {
      return;
    }

    if (isActive && !isRegisteredRef.current) {
      // First time becoming active - register
      isRegisteredRef.current = true;
      dispatch.registerPortal(portalId, childrenRef.current, () => onExitRef.current?.());
    } else if (!isActive && isRegisteredRef.current) {
      // Becoming inactive - unregister
      isRegisteredRef.current = false;
      dispatch.unregisterPortal(portalId);
    }

    return () => {
      if (isRegisteredRef.current) {
        dispatch.unregisterPortal(portalId);
        isRegisteredRef.current = false;
      }
    };
  }, [dispatch, portalId, isActive]);

  // Update portal content when children change, but ONLY if already active
  // This prevents the cleanup/re-register cycle that causes remounts
  useEffect(() => {
    if (isActive && isRegisteredRef.current && dispatch) {
      dispatch.registerPortal(portalId, children, () => onExitRef.current?.());
    }
  }, [children, isActive, dispatch, portalId]);

  if (isActive) {
    return <View style={styles.placeholder} />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: colors.black
  },
  placeholder: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default FullscreenPortal;
