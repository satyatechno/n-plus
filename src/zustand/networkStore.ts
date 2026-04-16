import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkState {
  isInternetConnection: boolean;
  hasNetworkAvailable: boolean;
}

interface NetworkActions {
  setIsInternetConnection: (status: boolean) => void;
  initializeNetworkListener: () => () => void;
}

const useNetworkStore = create<NetworkState & NetworkActions>()(
  immer((set) => ({
    isInternetConnection: true, // Optimistic initial state
    hasNetworkAvailable: false,

    setIsInternetConnection: (status: boolean) =>
      set((state) => {
        state.isInternetConnection = status;
        state.hasNetworkAvailable = status;
      }),

    initializeNetworkListener: () => {
      // Initial check
      NetInfo.fetch().then((state) => {
        set((draft) => {
          draft.isInternetConnection = state.isConnected ?? false;
          draft.hasNetworkAvailable = state.isConnected ?? false;
        });
      });

      // Subscribe to updates
      const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
        set((draft) => {
          draft.isInternetConnection = state.isConnected ?? false;
          draft.hasNetworkAvailable = state.isConnected ?? false;
        });
      });

      return unsubscribe;
    }
  }))
);

export default useNetworkStore;
