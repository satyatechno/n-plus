import { useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import {
  PreferencesResult,
  SetRecommendationsModel,
  UpdateRecommendedTopicsResult,
  GetOnboardingSelectedTopicsResult,
  OnboardingSelectedTopic,
  PreferenceSection
} from '@src/models/auth/SetRecommendations';
import { useTheme } from '@src/hooks/useTheme';
import { AuthStackParamList, RootStackParamList } from '@src/navigation/types';
import {
  GET_ONBORDING_SELECTED_TOPICS_QUERY,
  GET_RECOMMENDED_TOPICS_QUERY
} from '@src/graphql/auth/queries';
import { UPDATE_USER_PREFERENCES_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

/**
 * useSetRecommendationsViewModel
 *
 * Custom React hook that encapsulates the state and behaviors required by the
 * "Set Recommendations" screen. It coordinates fetching recommendation topics,
 * managing the user's selected recommendations, handling onboarding-specific
 * flows, and performing updates to the backend via GraphQL mutation.
 *
 * Behavior & responsibilities:
 * - Fetches recommended topics (preferences) and onboarding-selected topics using GraphQL queries.
 * - Pre-populates selection from onboarding-selected topics on first render (when applicable).
 * - Exposes selection state and a toggleSelection handler to add/remove topic ids.
 * - Tracks whether the current selection differs from the initial selection (isDirty).
 * - Provides viewMoreInterests / viewLessInterests to adjust onboarding topics pagination.
 * - Handles submission via updatePreferences mutation; on success resets navigation to the home stack
 *   and applies a guest auth token from the auth store if present.
 * - Provides retry behavior to refetch both recommendation lists and sets an internetLoader flag.
 * - Exposes error and loading states for UI to display network / mutation progress and errors.
 * - Manages an "unsaved changes" modal flow: goBack either prompts the modal (if dirty) or navigates back.
 * - Supports an onboarding "skip" flow that resets navigation to the home stack and sets auth token.
 *
 * Side effects & external dependencies:
 * - Uses React Navigation to navigate / reset stacks and to read route params (isOnboarding).
 * - Uses useQuery/useMutation (Apollo) for GET_RECOMMENDED_TOPICS_QUERY, GET_ONBORDING_SELECTED_TOPICS_QUERY,
 *   and UPDATE_USER_PREFERENCES_MUTATION.
 * - Uses an authentication store (useAuthStore) to read guestToken, isTutorialShow, and to setAuthToken
 *   after submission/skip.
 * - Uses a network store (useNetworkStore) to read isInternetConnection.
 * - Uses useTranslation and useTheme for localization and theming.
 *
 * Notes & guarantees:
 * - When isOnboarding is true, some behaviors (like viewMoreInterests/viewLessInterests) are no-ops or specific.
 * - initialSelectedRef captures the initial selection once and is used to determine dirty state.
 * - toggleSelection updates selections immutably and preserves reference safety via a Set clone.
 * - onSubmit attempts the mutation and, irrespective of onboarding, will navigate back after applying results;
 *   on successful update it resets to the home stack and sets the auth token.
 * - onPressRetry will show internetLoader while refetching and will set a localized error message on failure.
 *
 * Returns (object shape):
 * - selectedRecommendations: Set<string> - current set of selected topic ids.
 * - toggleSelection: (id: string) => void - add/remove a topic id from the selection.
 * - onSubmit: () => Promise<void> - submit selected topics to backend and navigate accordingly.
 * - topics: PreferenceSection[] - fetched recommendation sections (may be empty).
 * - loading: boolean - loading state for the recommendations query.
 * - updatePreferencesLoading: boolean - loading state for the update mutation.
 * - onSettingsPress: () => void - navigates to the settings route for recommendations (non-onboarding flow).
 * - goBack: () => void - navigates back, prompting an unsaved modal if selection is dirty.
 * - isOnboarding: boolean - whether the view is running inside the onboarding flow (from route params).
 * - theme: Theme - current theme (from useTheme).
 * - t: TFunction - translation function for localized strings.
 * - setErrorMessage: (msg: string) => void - setter for error message.
 * - errorMessage: string - latest error message suitable for display.
 * - internetLoader: boolean - flag showing whether a network retry or similar is in progress.
 * - onPressRetry: () => Promise<void> - refetches queries and sets error/message on failure.
 * - onSkip: () => void - skip onboarding and reset navigation to home with guest auth token.
 * - isTutorialShow: boolean - whether tutorial is currently shown (from auth store).
 * - isInternetConnection: boolean - network connection flag (from auth store).
 * - guestToken: string | null - guest authentication token (if available).
 * - onboardingSelectedTopics: OnboardingSelectedTopic[] | undefined - topics returned for onboarding selection.
 * - isUnsavedModalVisible: boolean - whether the unsaved-changes modal is visible.
 * - onStayOnPage: () => void - dismisses the unsaved-changes modal and stays on the page.
 * - onDiscardAndContinue: () => void - discards changes and continues (navigates back).
 * - viewMoreInterests: () => Promise<void> - increases the onboarding topics fetch limit (no-op when onboarding).
 * - viewLessInterests: () => Promise<void> - decreases the onboarding topics fetch limit (no-op when onboarding).
 * - GetOnboardingSelectedTopicsLoading: boolean - loading state for onboarding topics query.
 *
 * Example usage:
 * const vm = useSetRecommendationsViewModel();
 * // vm.selectedRecommendations, vm.toggleSelection, vm.onSubmit, etc. can be used in the component.
 *
 * @returns {SetRecommendationsModel} view model containing state, handlers, and flags for the Set Recommendations screen.
 */

const useSetRecommendationsViewModel = (): SetRecommendationsModel => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());
  const route = useRoute<RouteProp<AuthStackParamList, 'SetRecommendations'>>();
  const isOnboarding = route.params?.isOnboarding ?? true;
  const authTokenParam = route.params?.authToken;
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    isTutorialShow,
    guestToken,
    setAuthToken,
    authToken,
    isOnboardingRegistration,
    setIsOnboardingRegistration,
    isLogin,
    clearGuestToken
  } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [isUnsavedModalVisible, setIsUnsavedModalVisible] = useState<boolean>(false);
  const initialSelectedRef = useRef<Set<string>>(new Set());

  const {
    data,
    error: getRecommendationTopicsError,
    loading,
    refetch
  } = useQuery<PreferencesResult>(GET_RECOMMENDED_TOPICS_QUERY, {
    fetchPolicy: 'network-only'
  });

  const [updatePreferences, { loading: updatePreferencesLoading, error: updatePreferencesError }] =
    useMutation<UpdateRecommendedTopicsResult>(UPDATE_USER_PREFERENCES_MUTATION);

  const {
    data: GetOnboardingSelectedTopicsData,
    loading: GetOnboardingSelectedTopicsLoading,
    refetch: refetchOnboardingTopics
  } = useQuery<GetOnboardingSelectedTopicsResult>(GET_ONBORDING_SELECTED_TOPICS_QUERY, {
    fetchPolicy: 'network-only',
    variables: { input: { cursor: null, limit: 500 } }
  });

  const topics = data?.Preferences?.preferenceSections ?? [];
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);

  const allTopics = GetOnboardingSelectedTopicsData?.GetOnboardingSelectedTopics?.topics ?? [];
  const onboardingSelectedTopics = showAllTopics ? allTopics : allTopics.slice(0, 15);
  const canViewMore = allTopics.length > 15;

  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOnboarding) {
      if (topics.length > 0 && hasInitializedRef.current === false) {
        const preSelectedIds: string[] = [];
        topics.forEach((section: PreferenceSection) => {
          const id = section?.selectedItem?.value?.id as string | undefined;
          const isSelected = Boolean(section?.selectedItem?.isSelected);
          if (id && isSelected) {
            preSelectedIds.push(id);
          }
        });
        if (preSelectedIds.length > 0) {
          const initial = new Set(preSelectedIds);
          setSelectedRecommendations(initial);
          initialSelectedRef.current = new Set(preSelectedIds);
          hasInitializedRef.current = true;
        }
      }
      return;
    }
    if (hasInitializedRef.current) return;
    if (allTopics.length === 0) return;
    const serverSelectedIds: string[] = [];
    allTopics.forEach((section: OnboardingSelectedTopic) => {
      const id = section?.topicsdata?.data?.[0]?.id as string | undefined;
      const isSelected = Boolean(section?.isSelected);
      const userSelected = Boolean(section?.userSelected);
      if (id && (isSelected || userSelected)) serverSelectedIds.push(id);
    });
    const initial = new Set(serverSelectedIds);
    setSelectedRecommendations(initial);
    initialSelectedRef.current = new Set(serverSelectedIds);
    hasInitializedRef.current = true;
  }, [isOnboarding, allTopics, topics]);
  useEffect(() => {
    if (getRecommendationTopicsError || updatePreferencesError) {
      setInternetLoader(false);
      const e = getRecommendationTopicsError ?? updatePreferencesError;
      const msg = (e?.graphQLErrors?.[0]?.extensions?.message as string) ?? '';
      setErrorMessage(msg);
    }
  }, [getRecommendationTopicsError, updatePreferencesError]);

  const toggleSelection = (id: string) => {
    setSelectedRecommendations((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const viewMoreInterests = async () => {
    if (isOnboarding) return;

    if (!isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.EDIT_INTEREST,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.VIEW_MORE_INTEREST,
        content_name: 'View more interest',
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    setShowAllTopics(true);
  };

  const viewLessInterests = async () => {
    if (isOnboarding) return;

    if (!isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.EDIT_INTEREST,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.VIEW_LESS_INTEREST,
        content_name: 'View less interest',
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    setShowAllTopics(false);
  };

  const isDirty = useMemo(() => {
    const a = initialSelectedRef.current;
    const b = selectedRecommendations;
    if (a.size !== b.size) return true;
    for (const v of b) if (!a.has(v)) return true;
    return false;
  }, [selectedRecommendations]);

  const goBack = () => {
    if (!isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
        content_name: 'Back',
        content_action: ANALYTICS_ATOMS.BACK
      });
    }

    if (isDirty) {
      setIsUnsavedModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const onStayOnPage = () => {
    if (!isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SKIP,
        content_name: 'Continue',
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    setIsUnsavedModalVisible(false);
  };

  const onDiscardAndContinue = () => {
    if (!isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_CONTINUE,
        content_name: 'Continue',
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    setIsUnsavedModalVisible(false);
    navigation.goBack();
  };

  const onSkip = () => {
    if (authToken && isOnboardingRegistration) {
      setIsOnboardingRegistration(false);
    }
  };

  const onPressRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([
        refetch(),
        refetchOnboardingTopics({ input: { cursor: null, limit: 15 } })
      ]);
      setInternetLoader(false);
    } catch {
      setInternetLoader(false);
      setErrorMessage(
        updatePreferencesError?.message ?? t('screens.login.text.somethingWentWrong')
      );
    }
  };

  const onSubmit = async () => {
    if (isOnboarding) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.RECOMMENDATIONS,
        screen_page_web_url: ANALYTICS_PAGE.RECOMMENDATIONS,
        screen_name: ANALYTICS_PAGE.RECOMMENDATIONS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.RECOMMENDATIONS}`,
        organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
        content_type: ANALYTICS_MOLECULES.ONBOARDING.CONTINUAR_INTEREES,
        content_name: 'Continuar intereses',
        content_action: ANALYTICS_ATOMS.TAP
      });
    } else {
      logSelectContentEvent(
        {
          idPage: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
          screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
          screen_name: ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION_DE_INTERESES}`,
          organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
          content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SAVED,
          content_name: 'Saved',
          content_action: ANALYTICS_ATOMS.TAP,
          meta_content_action: ANALYTICS_META_EVENTS.INTERESTS_MODIFY
        },
        ANALYTICS_META_EVENTS.INTERESTS_MODIFY
      );
    }

    try {
      const initial = initialSelectedRef.current;
      const current = selectedRecommendations;
      const added = Array.from(current).filter((id) => !initial.has(id));
      const removed = Array.from(initial).filter((id) => !current.has(id));
      const changedIds = [...added, ...removed];

      await updatePreferences({ variables: { selectedInterests: changedIds } });
      setInternetLoader(false);

      if (!isOnboarding) {
        logSelectContentEvent({
          screen_name: 'Interest configuration',
          Tipo_Contenido: 'My account_Interest configuration',
          organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
          content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SAVED,
          content_name: 'Guardar',
          content_action: 'send_interests'
        });
        AnalyticsService.logAppsFlyerEvent('interests_modify');
      }

      if (authToken && isOnboardingRegistration) {
        setIsOnboardingRegistration(false);
      } else {
        const token = authTokenParam || guestToken;
        if (token) {
          if (isLogin) clearGuestToken();
          setAuthToken(token);
        }
      }
    } catch {
      setErrorMessage(t('screens.login.text.somethingWentWrong'));
    }
    if (!isOnboarding) {
      navigation.goBack();
    }
  };

  return {
    selectedRecommendations,
    toggleSelection,
    onSubmit,
    topics,
    loading,
    updatePreferencesLoading,
    goBack,
    isOnboarding,
    theme,
    t,
    setErrorMessage,
    errorMessage,
    internetLoader,
    onPressRetry,
    onSkip,
    isTutorialShow,
    isInternetConnection,
    guestToken: guestToken ?? null,
    onboardingSelectedTopics,
    isUnsavedModalVisible,
    onStayOnPage,
    onDiscardAndContinue,
    viewMoreInterests,
    viewLessInterests,
    GetOnboardingSelectedTopicsLoading,
    canViewMore,
    isDirty
  };
};

export default useSetRecommendationsViewModel;
