import { AppTheme } from '@src/themes/theme';

export interface CMSSelectedItemValue {
  id: string;
  title: string;
}

export interface CMSSelectedItem {
  relationTo: string;
  value: CMSSelectedItemValue | null;
  isSelected?: boolean;
}

export interface PreferenceSection {
  id: string;
  preferenceType: string;
  displayInOnboarding?: boolean;
  onboardingSortOrder?: number | null;
  selectedItem?: CMSSelectedItem | null;
}

export interface PreferencesResult {
  Preferences: {
    id: string;
    preferenceSections: PreferenceSection[];
  };
}

export interface OnboardingTopicItem {
  id: string;
  title: string;
}

export interface OnboardingTopicsDataWrapper {
  data: OnboardingTopicItem[];
}

export interface OnboardingSelectedTopic {
  topicTitle: string;
  topicsdata: OnboardingTopicsDataWrapper;
  isSelected: boolean;
  userSelected: boolean;
}

export interface GetOnboardingSelectedTopicsResult {
  GetOnboardingSelectedTopics: {
    hasMore: boolean;
    topics: OnboardingSelectedTopic[];
  };
}

export interface SetRecommendationsModel {
  selectedRecommendations: Set<string>;
  t: (key: string) => string;
  toggleSelection: (id: string) => void;
  topics: PreferenceSection[];
  theme: AppTheme;
  onSubmit: () => void;
  loading: boolean;
  isOnboarding: boolean;
  goBack: () => void;
  errorMessage: string;
  onSkip?: () => void;
  isTutorialShow: boolean;
  guestToken: string | null;
  setErrorMessage: (value: string) => void;
  isInternetConnection: boolean;
  internetLoader: boolean;
  onPressRetry: () => Promise<void>;
  updatePreferencesLoading: boolean;
  onboardingSelectedTopics: OnboardingSelectedTopic[] | undefined;
  isUnsavedModalVisible?: boolean;
  onStayOnPage?: () => void;
  onDiscardAndContinue?: () => void;
  viewMoreInterests?: () => Promise<void>;
  viewLessInterests?: () => Promise<void>;
  GetOnboardingSelectedTopicsLoading: boolean;
  canViewMore?: boolean;
  isDirty: boolean;
}

export interface UpdateRecommendedTopicsResult {
  updateRecommendedTopics: {
    topics: string[];
  };
}
