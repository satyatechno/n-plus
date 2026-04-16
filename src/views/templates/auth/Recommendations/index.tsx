import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomText from '@src/views/atoms/CustomText';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomLoader from '@src/views/atoms/CustomLoader';
import { AppTheme } from '@src/themes/theme';
import { themeStyles } from '@src/views/templates/auth/Recommendations/styles';
import RecommendationsSkeletons from '@src/views/templates/auth/Recommendations/components/RecommendationsSkeletons';
import { AddCircleIcon, ArrowUpIcon, BlackTickIcon, DropDownIcon } from '@src/assets/icons';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { PreferenceSection } from '@src/models/auth/SetRecommendations';
import { isIos } from '@src/utils/platformCheck';

export interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface RecommendationsProps {
  heading: string;
  subHeading: string;
  topics: PreferenceSection[];
  selectedRecommendations: Set<string>;
  toggleSelection: (id: string) => void;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
  theme: AppTheme;
  loading?: boolean;
  isOnboarding?: boolean;
  onBackButtonPress: () => void;
  t: (key: string) => string;
  onAlertDismissedPress: () => void;
  errorMessage: string;
  isInternetConnection?: boolean;
  internetLoader?: boolean;
  onPressRetry?: () => void;
  viewMoreInterests?: () => Promise<void>;
  viewLessInterests?: () => Promise<void>;
  canViewMore?: boolean;
  updatePreferencesLoading?: boolean;
}

/**
 * Recommendations
 *
 * Renders a selectable list of topic "recommendations" with support for onboarding mode,
 * loading / error states, pull-to-refresh, and a primary action button.
 *
 * Behavior:
 * - Uses themeStyles(theme) for styling and memoizes computed values.
 * - Maintains internal state:
 *   - showAll: whether the full list of topics is shown (controls "view more / view less").
 *   - seeAllLoading: indicates loading state when fetching more/less interests.
 * - Computes sortedTopics:
 *   - If isOnboarding is true, preserves incoming topics order.
 *   - Otherwise, moves selected topics to the front of the list.
 * - Computes displayTopics:
 *   - If isOnboarding: shows all topics.
 *   - Otherwise: shows either sortedTopics (when showAll) or the first 15 items.
 *
 * UI and interactions:
 * - If there is no internet and not loading, renders an ErrorScreen with "noInternet" and retry.
 * - If there are no topics and not loading, renders an ErrorScreen with "error".
 * - While loading, renders RecommendationsSkeletons for interests and/or buttons.
 * - Displays each topic as a Pressable "chip" with:
 *   - An icon indicating selected vs. not selected (tick vs. add).
 *   - The topic title text.
 *   - onPress toggles selection via toggleSelection(id).
 * - For non-onboarding flows:
 *   - Shows a "view more / view less" Pressable when not loading:
 *     - When expanding: sets seeAllLoading, awaits viewMoreInterests(), then sets showAll.
 *     - When collapsing: awaits viewLessInterests(), then clears showAll.
 *     - Always clears seeAllLoading in finally block.
 * - Wraps content in a SafeAreaView:
 *   - Uses a different safe area style when isOnboarding is true.
 * - For non-onboarding flows, renders a CustomHeader with back action.
 * - Uses a ScrollView with a RefreshControl:
 *   - Refreshing is controlled by internetLoader.
 *   - On refresh: resets showAll to false and calls onPressRetry.
 * - Renders a CustomHeading (logo visible if onboarding) followed by the recommendations content.
 * - Renders a primary CustomButton at the bottom:
 *   - While loading, shows button skeletons.
 *   - Otherwise uses primaryButton.onPress, primaryButton.text and respects primaryButton.disabled.
 * - Displays a CustomToast for errors:
 *   - Shows errorMessage and, when offline, a localized "check connection" submessage.
 *   - onDismiss calls onAlertDismissedPress.
 *
 * Props (RecommendationsProps) overview:
 * - heading: string | ReactNode — main heading text/content.
 * - subHeading: string | ReactNode — optional subheading text/content.
 * - topics: PreferenceSection[] — list of topic sections; each item is expected to include
 *   selectedItem.value.id and selectedItem.value.title.
 * - selectedRecommendations: Set<string> (or similar) — collection of selected topic ids.
 * - toggleSelection: (id: string) => void — toggles selection for a topic id.
 * - primaryButton: { text: string; onPress: () => void; disabled?: boolean } — primary CTA.
 * - theme: Theme — theme object used by themeStyles and icon/styling choices.
 * - isOnboarding: boolean — disables header and enables onboarding-specific UI/layout.
 * - loading: boolean — global loading state for initial content.
 * - onBackButtonPress: () => void — handler for header back action (non-onboarding).
 * - t: (key: string) => string — translation function for localized strings.
 * - onAlertDismissedPress: () => void — handler when error toast is dismissed.
 * - errorMessage: string | undefined — message shown in the error toast.
 * - isInternetConnection: boolean — online/offline indicator for error screens and toast submessage.
 * - internetLoader: boolean — controls the RefreshControl's refreshing indicator.
 * - onPressRetry: () => void — retry handler used by ErrorScreen and pull-to-refresh.
 * - viewMoreInterests?: () => Promise<void> — optional async fetch to show more interests.
 * - viewLessInterests?: () => Promise<void> — optional async fetch to collapse interests.
 *
 * Returns:
 * - A React element rendering the recommendations screen/content described above.
 *
 * Notes:
 * - The component expects each topic item to expose a stable id at item.selectedItem.value.id.
 * - Defensive checks are used to skip rendering items that lack an id.
 * - Side-effects for expanding/collapsing the list are awaited and wrapped in try/finally to ensure
 *   loading indicators are cleared.
 */

const Recommendations = ({
  heading,
  subHeading,
  topics,
  selectedRecommendations,
  toggleSelection,
  primaryButton,
  theme,
  isOnboarding,
  loading,
  onBackButtonPress,
  t,
  onAlertDismissedPress,
  errorMessage,
  isInternetConnection,
  internetLoader,
  onPressRetry,
  viewMoreInterests,
  viewLessInterests,
  canViewMore,
  updatePreferencesLoading
}: RecommendationsProps) => {
  const styles = React.useMemo(() => themeStyles(theme), [theme]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [seeAllLoading, setSeeAllLoading] = useState<boolean>(false);
  const sortedTopics = useMemo(() => {
    const sel: PreferenceSection[] = [];
    const rest: PreferenceSection[] = [];
    (topics ?? []).forEach((item) => {
      const id = item?.selectedItem?.value?.id as string | undefined;
      if (id && selectedRecommendations.has(id)) sel.push(item);
      else rest.push(item);
    });
    return isOnboarding ? (topics ?? []) : [...sel, ...rest];
  }, [topics, selectedRecommendations, isOnboarding]);
  const displayTopics = isOnboarding
    ? (topics ?? [])
    : showAll
      ? sortedTopics
      : sortedTopics.slice(0, 15);

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <View>
        <View style={styles.topicsContainer}>
          {loading ? (
            <RecommendationsSkeletons type="interests" />
          ) : (
            displayTopics.map((item) => {
              const id = item?.selectedItem?.value?.id as string | undefined;
              if (!id) return null;
              const selected = selectedRecommendations.has(id);
              return (
                <Pressable
                  key={id}
                  onPress={() => {
                    toggleSelection(id);
                  }}
                  style={StyleSheet.flatten([
                    selected ? styles.selectedInterestButton : styles.notSelectedInterestButton,
                    styles.interestButton,
                    styles.interestChip
                  ])}
                >
                  <View style={styles.iconWrapper}>
                    {selected ? (
                      <View style={styles.plusCircle}>
                        <BlackTickIcon
                          height={actuatedNormalize(8)}
                          width={actuatedNormalize(8)}
                          fill={theme.interestButtonBackground}
                        />
                      </View>
                    ) : (
                      <View style={isIos && styles.addCircle}>
                        <AddCircleIcon />
                      </View>
                    )}
                  </View>
                  <CustomText
                    size={fontSize.xxs}
                    fontFamily={fonts.franklinGothicURW}
                    weight="Med"
                    color={selected ? theme.toastAndAlertsTextBackground : theme.chipTextInactive}
                    textStyles={styles.buttonTextStyle}
                  >
                    {item?.selectedItem?.value?.title}
                  </CustomText>
                </Pressable>
              );
            })
          )}
        </View>

        {seeAllLoading && <RecommendationsSkeletons type="interests" />}

        {!isOnboarding && !loading && (canViewMore || showAll) && (
          <Pressable
            style={styles.viewMorePressable}
            onPress={async () => {
              try {
                if (showAll) {
                  await (viewLessInterests?.() ?? Promise.resolve());
                  setShowAll(false);
                } else {
                  setSeeAllLoading(true);
                  await (viewMoreInterests?.() ?? Promise.resolve());
                  setShowAll(true);
                }
              } finally {
                setSeeAllLoading(false);
              }
            }}
          >
            <CustomText
              weight="Med"
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xs}
              textStyles={styles.viewMoreText}
            >
              {showAll
                ? t('screens.recommendations.text.viewLess')
                : t('screens.recommendations.text.viewMore')}
            </CustomText>
            {showAll ? (
              <ArrowUpIcon
                color={theme.tagsTextCategory}
                style={styles.arrowUpIcon}
                strokeWidth={1}
              />
            ) : (
              <DropDownIcon stroke={theme.tagsTextCategory} strokeWidth={1.5} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );

  const isOffline = !isInternetConnection && !loading;
  const hasDataError = !topics.length && !loading;

  if (isOffline) {
    return (
      <SafeAreaView
        style={isOnboarding ? styles.safeAreaViewOnboarding : styles.safeAreaViewStyles}
      >
        <ErrorScreen status="noInternet" onRetry={onPressRetry} />
      </SafeAreaView>
    );
  }

  if (hasDataError) {
    return (
      <SafeAreaView
        style={isOnboarding ? styles.safeAreaViewOnboarding : styles.safeAreaViewStyles}
      >
        <ErrorScreen status="error" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={isOnboarding ? styles.safeAreaViewOnboarding : styles.safeAreaViewStyles}>
      {!isOnboarding && (
        <CustomHeader
          onPress={onBackButtonPress}
          headerText={t('screens.recommendations.text.header')}
          headerTextWeight="Boo"
          headerTextStyles={styles.headerTextStyles}
          headerTextFontFamily={fonts.franklinGothicURW}
        />
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={!!internetLoader}
            onRefresh={() => {
              setShowAll(false);
              onPressRetry?.();
            }}
            tintColor={theme.menusTextDarkThemePagesActive}
          />
        }
      >
        <CustomHeading
          isLogoVisible={isOnboarding}
          logoHeight={actuatedNormalizeVertical(29)}
          logoWidth={actuatedNormalize(52)}
          headingText={heading}
          subHeadingText={subHeading}
          subHeadingWeight="Boo"
          subHeadingFont={fonts.franklinGothicURW}
        />

        {renderContent()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {loading && !updatePreferencesLoading ? (
          <RecommendationsSkeletons type="buttons" />
        ) : (
          <CustomButton
            onPress={primaryButton.onPress}
            buttonText={primaryButton.text}
            disabled={!!primaryButton.disabled}
            buttonStyles={styles.continueButtonStyle}
            buttonTextStyles={styles.continueButtonTextStyle}
          />
        )}
      </View>

      <CustomToast
        type="error"
        message={errorMessage}
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={!!errorMessage}
        onDismiss={onAlertDismissedPress}
      />

      {updatePreferencesLoading ? <CustomLoader /> : null}
    </SafeAreaView>
  );
};

export default Recommendations;
