import { create } from 'zustand';

interface DeeplinkWebViewState {
  url: string | null;
  openUrl: (url: string) => void;
  close: () => void;
}

const useDeeplinkWebViewStore = create<DeeplinkWebViewState>((set) => ({
  url: null,
  openUrl: (url: string) => set({ url }),
  close: () => set({ url: null })
}));

export default useDeeplinkWebViewStore;
