import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import DeviceInfo from 'react-native-device-info';

/**
 * RNVideoPlayer Zustand Store
 * Simplified store for native controls video player
 *
 * This store now focuses ONLY on global device capabilities and configuration.
 * Playback state (isPlaying, currentTime, etc.) has been moved to Context
 * to allow multiple independent player instances (e.g., in carousels).
 *
 * Responsibilities:
 * - Device memory detection (Low Memory Mode)
 * - Global performance configuration
 *
 * Note: Video instance state is managed by VideoPlayerContext
 */

const LOW_MEMORY_THRESHOLD_GB = 3;

export interface RNVideoPerformanceConfig {
  lowMemoryMode: boolean;
  progressUpdateInterval: number;
  disableBackgroundPlayback: boolean;
  cacheSizeMB: number;
}

// Solo estado global de dispositivo/app
interface RNVideoGlobalState {
  isDeviceCapabilitiesDetected: boolean;
  isLowMemoryDevice: boolean;
  deviceMemoryGB: number;
  performanceConfig: RNVideoPerformanceConfig;
}

interface RNVideoGlobalActions {
  setPerformanceConfig: (config: Partial<RNVideoPerformanceConfig>) => void;
  initDeviceCapabilities: () => Promise<void>;
}

const DEFAULT_PERFORMANCE_CONFIG: RNVideoPerformanceConfig = {
  lowMemoryMode: true,
  progressUpdateInterval: 500,
  disableBackgroundPlayback: false,
  cacheSizeMB: 50
};

const initialState: RNVideoGlobalState = {
  isDeviceCapabilitiesDetected: false,
  isLowMemoryDevice: true,
  deviceMemoryGB: 0,
  performanceConfig: DEFAULT_PERFORMANCE_CONFIG
};

const useRNVideoGlobalStore = create<RNVideoGlobalState & RNVideoGlobalActions>()(
  immer((set, get) => ({
    ...initialState,

    setPerformanceConfig: (config) =>
      set((state) => {
        state.performanceConfig = { ...state.performanceConfig, ...config };
      }),

    initDeviceCapabilities: async () => {
      if (get().isDeviceCapabilitiesDetected) return;

      try {
        const totalMemoryBytes = await DeviceInfo.getTotalMemory();
        const memoryGB = totalMemoryBytes / 1024 ** 3;
        const isLowMemory = memoryGB < LOW_MEMORY_THRESHOLD_GB;

        set((state) => {
          state.isDeviceCapabilitiesDetected = true;
          state.deviceMemoryGB = Math.round(memoryGB * 100) / 100;
          state.isLowMemoryDevice = isLowMemory;
          state.performanceConfig.lowMemoryMode = isLowMemory;
        });
      } catch {
        set((state) => {
          state.isDeviceCapabilitiesDetected = true;
        });
      }
    }
  }))
);

export default useRNVideoGlobalStore;
