import { create } from 'zustand';

interface LiveTVState {
  shouldPause: boolean;
  setShouldPause: (pause: boolean) => void;
}

/**
 * Zustand store for managing live TV player state.
 *
 * @example
 * ```ts
 * const { shouldPause, setShouldPause } = useLiveTVStore();
 * setShouldPause(true);
 * ```
 */

export const useLiveTVStore = create<LiveTVState>((set) => ({
  shouldPause: false,
  setShouldPause: (pause) => set({ shouldPause: pause })
}));
