import { create } from 'zustand';

type HomeSectionStatusState = {
  sections: Record<string, boolean>;
  setSectionHasData: (key: string, hasData: boolean) => void;
};

export const useHomeSectionStatusStore = create<HomeSectionStatusState>((set) => ({
  sections: {},
  setSectionHasData: (key, hasData) =>
    set((state) => ({
      sections: {
        ...state.sections,
        [key]: hasData
      }
    }))
}));
