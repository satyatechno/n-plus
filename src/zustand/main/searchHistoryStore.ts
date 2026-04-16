import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvSettingsStorage } from '@src/utils/mmkv';

interface SearchHistoryItem {
  title: string;
  slug?: string;
  collection?: string;
}

interface SearchHistoryState {
  recentSearches: SearchHistoryItem[];
}

interface SearchHistoryActions {
  addSearchTerm: (item: SearchHistoryItem) => void;
  clearHistory: () => void;
}

const useSearchHistoryStore = create<SearchHistoryState & SearchHistoryActions>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearchTerm: (item: SearchHistoryItem) => {
        const title = (item?.title || '').trim();
        if (!title) return;
        const current = get().recentSearches;
        const deduped = current.filter((t) => {
          const sameTitle = (t.title || '').toLowerCase() === title.toLowerCase();
          if (item.slug && t.slug) {
            return !(sameTitle && t.slug === item.slug);
          }
          return !sameTitle;
        });
        const next = [{ title, slug: item.slug, collection: item.collection }, ...deduped].slice(
          0,
          10
        );
        set({ recentSearches: next });
      },
      clearHistory: () => set({ recentSearches: [] })
    }),
    {
      name: 'search-history-storage',
      storage: createJSONStorage(() => mmkvSettingsStorage)
    }
  )
);

export default useSearchHistoryStore;
