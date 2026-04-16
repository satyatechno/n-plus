import React from 'react';
import { View } from 'react-native';

import useSetRecommendationsViewModel from '@src/viewModels/auth/SetRecommendations/useSetRecommendationsViewModel';
import Recommendations from '@src/views/templates/auth/Recommendations';
import IntroScreens from '@src/views/organisms/IntroScreen';
import CustomModal from '@src/views/organisms/CustomModal';
import { themeStyles } from '@src/views/templates/auth/Recommendations/styles';
import { styles as pageStyles } from '@src/views/pages/auth/SetRecommendations/styles';
import { OnboardingSelectedTopic, PreferenceSection } from '@src/models/auth/SetRecommendations';

/**
 * SetRecommendations
 *
 * React functional component that renders the recommendations selection screen used in two modes:
 * - Onboarding flow (isOnboarding = true)
 * - Edit preferences flow (isOnboarding = false)
 *
 * The component relies on the custom hook `useSetRecommendationsViewModel()` to obtain all data,
 * localized strings, theme, loading states, handlers and other flags required to drive the UI.
 *
 * Behavior summary:
 * - If `isTutorialShow` and `guestToken` are truthy, the component short-circuits and renders an
 *   `IntroScreens` view.
 * - Computes localized heading, subheading and primary button text depending on `isOnboarding`.
 * - Disables the primary action button until at least 3 recommendations are selected
 *   (determined by `selectedRecommendations.size < 3`).
 * - Memoizes styles via `themeStyles(theme)` and a `topicsForUI` array:
 *   - When `isOnboarding` is true, `topicsForUI` is the `topics` value returned by the view model.
 *   - When editing preferences, `topicsForUI` is constructed from `onboardingSelectedTopics` by
 *     flattening `topicsdata.data` entries into `PreferenceSection` items. Only entries with both
 *     `id` and `title` are included. Each item has `preferenceType: 'topic'` and a `selectedItem`
 *     describing the relation/value pair.
 * - Renders the `Recommendations` component with a combined `loading` flag (logical OR of
 *   `loading`, `GetOnboardingSelectedTopicsLoading`, and `updatePreferencesLoading`) and forwards
 *   handlers such as `toggleSelection`, `onSubmit`, `goBack` (or a no-op when onboarding),
 *   connectivity props, and view controls (`viewMoreInterests`, `viewLessInterests`).
 * - When not in onboarding mode, displays a `CustomModal` to confirm discarding unsaved changes.
 *   The modal visibility, texts and confirm/cancel handlers are provided by the view model.
 *
 * Notes:
 * - The component assumes `selectedRecommendations` exposes a numeric `size` property (e.g. Set).
 * - Memoization dependencies are chosen to re-compute only when relevant inputs change:
 *   `theme` for styles and `[isOnboarding, topics, onboardingSelectedTopics]` for topic transformation.
 * - No external side effects are performed here; all side effects (data fetching, mutation, navigation)
 *   are performed by the `useSetRecommendationsViewModel` hook and handlers it exposes.
 *
 * @public
 * @returns JSX.Element - The recommendations selection screen (or intro screens) for onboarding/edit flows.
 *
 * @example
 * // Render the component in a screen
 * <SetRecommendations />
 */

const SetRecommendations: React.FC = () => {
  const {
    t,
    theme,
    topics,
    loading,
    GetOnboardingSelectedTopicsLoading,
    updatePreferencesLoading,
    selectedRecommendations,
    isOnboarding,
    onSubmit,
    toggleSelection,
    goBack,
    setErrorMessage,
    errorMessage,
    isTutorialShow,
    guestToken,
    isInternetConnection,
    internetLoader,
    onPressRetry,
    isUnsavedModalVisible,
    onStayOnPage,
    onDiscardAndContinue,
    onboardingSelectedTopics,
    viewMoreInterests,
    viewLessInterests,
    canViewMore,
    isDirty
  } = useSetRecommendationsViewModel();

  const styles = React.useMemo(() => themeStyles(theme), [theme]);

  const heading = isOnboarding
    ? t('screens.recommendations.text.onboardingHeading')
    : t('screens.recommendations.text.editHeading');
  const subHeading = isOnboarding
    ? t('screens.recommendations.text.onboardingSubheading')
    : t('screens.recommendations.text.editSubheading');
  const primaryButtonText = isOnboarding
    ? t('screens.recommendedForYou.text.continue')
    : t('screens.common.text.save');
  const onBackButtonPress = !isOnboarding ? goBack : () => {};
  const primaryButtonDisabled = isOnboarding
    ? selectedRecommendations.size < 3
    : selectedRecommendations.size < 3 || !isDirty;

  const topicsForUI = React.useMemo<PreferenceSection[]>(() => {
    if (isOnboarding) return topics as PreferenceSection[];
    const groups = (onboardingSelectedTopics ?? []) as OnboardingSelectedTopic[];
    const items: PreferenceSection[] = [];
    (groups || []).forEach((g) => {
      const dataArr = g?.topicsdata?.data ?? [];
      (dataArr || []).forEach((d) => {
        if (d?.id && d?.title) {
          items.push({
            id: d.id,
            preferenceType: 'topic',
            selectedItem: {
              relationTo: 'topic',
              value: { id: d.id, title: d.title },
              isSelected: g?.isSelected || g?.userSelected
            }
          });
        }
      });
    });
    return items;
  }, [isOnboarding, topics, onboardingSelectedTopics]);

  return (
    <>
      {isTutorialShow && guestToken ? (
        <View style={styles.introScreenView}>
          <IntroScreens />
        </View>
      ) : (
        <Recommendations
          t={t}
          theme={theme}
          topics={topicsForUI}
          heading={heading}
          loading={loading || GetOnboardingSelectedTopicsLoading}
          updatePreferencesLoading={updatePreferencesLoading}
          subHeading={subHeading}
          errorMessage={errorMessage}
          isOnboarding={isOnboarding}
          toggleSelection={toggleSelection}
          onBackButtonPress={onBackButtonPress}
          isInternetConnection={isInternetConnection}
          primaryButton={{
            text: primaryButtonText,
            onPress: onSubmit,
            disabled: primaryButtonDisabled
          }}
          selectedRecommendations={selectedRecommendations}
          onAlertDismissedPress={() => setErrorMessage('')}
          internetLoader={internetLoader}
          onPressRetry={isInternetConnection ? onPressRetry : undefined}
          viewMoreInterests={viewMoreInterests}
          viewLessInterests={viewLessInterests}
          canViewMore={canViewMore}
        />
      )}

      {!isOnboarding && (
        <CustomModal
          visible={!!isUnsavedModalVisible}
          onRequestClose={onStayOnPage ?? (() => {})}
          onOutsidePress={onStayOnPage ?? (() => {})}
          modalTitle={t('screens.recommendations.modal.unsavedTitle')}
          modalMessage={t('screens.recommendations.modal.unsavedMessage')}
          modalSubtitle={t('screens.recommendations.modal.unsavedSubtitle')}
          cancelButtonText={t('screens.common.text.exit')}
          confirmButtonText={t('screens.common.text.continue')}
          modalSubtitleStyle={pageStyles.modalSubtitle}
          modalTitleStyle={pageStyles.modalTitleStyle}
          onCancelPress={onStayOnPage ?? (() => {})}
          onConfirmPress={onDiscardAndContinue ?? (() => {})}
        />
      )}
    </>
  );
};

export default SetRecommendations;
