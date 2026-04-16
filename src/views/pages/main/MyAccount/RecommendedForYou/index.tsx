import React, { useEffect, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  Modal,
  Animated
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import CustomHeader from '@src/views/molecules/CustomHeader';
import SettingsIcon from '@src/assets/icons/SettingsIcon';
import { themeStyles } from '@src/views/pages/main/MyAccount/RecommendedForYou/styles';
import useRecommendedForYouViewModel from '@src/viewModels/main/MyAccount/RecommendedForYou/useRecommendedForYouViewModel';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { fontSize } from '@src/config/styleConsts';
import CustomDivider from '@src/views/atoms/CustomDivider';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomText from '@src/views/atoms/CustomText';
import RecommendedSkeleton from '@src/views/pages/main/MyAccount/RecommendedForYou/components/RecommendationSkeletonLoader.tsx/RecommendationSkeletonLoader';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { ProblemIcon } from '@src/assets/icons';

/**
 * RecommendedForYou
 *
 * Renders the "Recommended For You" screen which displays a prime (hero) item,
 * optional secondary items, and a list of recommended sections (each limited to
 * the first three items). The component is powered by the `useRecommendedForYouViewModel`
 * hook which supplies translations, theme, navigation handlers, loading/internet state,
 * toast state, content data and helper utilities (label, image, time).
 *
 * Main behaviors:
 * - Header with back/navigation and settings action.
 * - Handles loading state with a skeleton view.
 * - Handles no-internet and empty-data error states via `ErrorScreen`.
 * - Pull-to-refresh via `RefreshControl` that triggers `onPressRetry`.
 * - Renders:
 *   - A hero `CarouselCard` for `heroItem`.
 *   - A vertical list of `CarouselCard` items for `secondaryItems`.
 *   - A list of sections from `GetRecommendedSectionsData`, each rendering up to 3 items.
 * - Each card's press action calls `onCardPress` with the associated item.
 * - Dismissible toast via `CustomToast` driven by `toastMessage` / `toastType`.
 *
 * Implementation notes:
 * - Section lists and secondary items are rendered using non-scrollable `FlatList` since
 *   the outer `ScrollView` handles vertical scrolling.
 * - Key extractors currently use array indexes; if items expose stable unique IDs,
 *   prefer using those to avoid potential key collision issues.
 *
 * @returns {React.ReactElement} The rendered RecommendedForYou screen component.
 */

const RecommendedForYou = () => {
  const {
    t,
    theme,
    onSettingsPress,
    goBack,
    loading,
    internetLoader,
    onPressRetry,
    isInternetConnection,
    toastType,
    toastMessage,
    setToastMessage,
    heroItem,
    secondaryItems,
    getTopicLabel,
    getImageUrl,
    getMinutes,
    onCardPress,
    GetRecommendedSectionsData,
    GetRecommendedSectionsError,
    getSectionHeading,
    showWebView,
    setShowWebView,
    webUrl,
    handleSectionItemPress
  } = useRecommendedForYouViewModel();
  const styles = themeStyles(theme);
  const data = secondaryItems.length !== 0 && GetRecommendedSectionsData.length !== 0;

  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <CustomHeader
          onPress={goBack}
          headerText={t('screens.recommendedForYou.title')}
          headerTextWeight="Boo"
          headerTextStyles={styles.headerTextStyles}
          headerTextFontFamily={fonts.franklinGothicURW}
        />

        <Pressable onPress={onSettingsPress}>
          <SettingsIcon
            height={actuatedNormalizeVertical(24)}
            width={actuatedNormalize(24)}
            color={theme.iconIconographyGenericState}
          />
        </Pressable>
      </View>
      {loading ? (
        <RecommendedSkeleton />
      ) : !isInternetConnection ? (
        <ErrorScreen status="noInternet" onRetry={onPressRetry} />
      ) : GetRecommendedSectionsError ? (
        <ErrorScreen
          status="error"
          showErrorButton={true}
          OnPressRetry={onPressRetry}
          buttonText={t('screens.splash.text.tryAgain')}
        />
      ) : !heroItem && !loading && !data ? (
        <ErrorScreen
          status="error"
          showErrorButton={false}
          errorSubTitle={t('screens.recommendedForYou.text.noPreferencesSubtitle')}
          errorTitle={t('screens.recommendedForYou.text.noPreferencesTitle')}
          Icon={ProblemIcon}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={!!internetLoader}
              onRefresh={onPressRetry}
              tintColor={theme.menusTextDarkThemePagesActive}
            />
          }
        >
          {loading ? (
            <>
              <RecommendedSkeleton />
            </>
          ) : (
            <>
              {/* Prime section */}
              {heroItem && (
                <View style={styles.recommendedContainer}>
                  <CarouselCard
                    type={heroItem?.collection === 'videos' ? 'videos' : 'article'}
                    topic={getTopicLabel(heroItem)}
                    title={heroItem?.title}
                    minutesAgo={getMinutes(heroItem)}
                    imageUrl={getImageUrl(heroItem)}
                    titleFont={fonts.notoSerifExtraCondensed}
                    titleSize={fontSize.l}
                    onPress={() => onCardPress(heroItem, -1)}
                    showBookmark={false}
                    contentContainerStyle={styles.primeContentContainer}
                    imageStyle={styles.primeImageStyle}
                    subheadingStyles={styles.primeSubheadingStyles}
                  />

                  {secondaryItems?.length > 0 && (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={secondaryItems ?? []}
                      keyExtractor={(_, index) => index.toString()}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <CarouselCard
                          type={item?.collection === 'videos' ? 'videos' : 'article'}
                          topic={getTopicLabel(item)}
                          title={item?.title}
                          minutesAgo={getMinutes(item)}
                          imageUrl={getImageUrl(item)}
                          headingStyles={styles.verticalHeading}
                          contentContainerStyle={styles.verticalVideoContainer}
                          imageStyle={styles.verticalImageStyle}
                          showBookmark={false}
                          onPress={() => onCardPress(item, index)}
                          titleFont={fonts.notoSerifExtraCondensed}
                          titleSize={fontSize.l}
                        />
                      )}
                      ItemSeparatorComponent={() => (
                        <CustomDivider style={styles.verticalVideoItemSeparator} />
                      )}
                      ListFooterComponent={
                        <CustomDivider style={styles.verticalVideoItemSeparator} />
                      }
                    />
                  )}
                </View>
              )}

              {/* Sections FlatList (first 3 items per section) */}
              {!!GetRecommendedSectionsData?.length && (
                <FlatList
                  data={GetRecommendedSectionsData}
                  keyExtractor={(_, idx) => `sec-${idx}`}
                  scrollEnabled={false}
                  renderItem={({ item: sec }) => {
                    const title = getSectionHeading(sec?.sectionType);
                    const items = (sec?.items ?? []).slice(0, 3);
                    if (!items.length) return null;
                    return (
                      <View style={styles.recommendedContainer}>
                        <CustomText
                          fontFamily={fonts.franklinGothicURW}
                          weight="Dem"
                          size={fontSize.s}
                          textStyles={styles.sectionHeading}
                        >
                          {title}
                        </CustomText>
                        <FlatList
                          data={items}
                          keyExtractor={(_, index) => index.toString()}
                          scrollEnabled={false}
                          renderItem={({ item, index }) => (
                            <CarouselCard
                              type={
                                sec?.sectionType === 'videos' || sec?.sectionType === 'programs'
                                  ? 'videos'
                                  : sec?.sectionType === 'noticias'
                                    ? 'article'
                                    : 'publishedAt'
                              }
                              topic={getTopicLabel(item, sec?.sectionType)}
                              title={item?.title}
                              publishedAt={item?.publishedAt}
                              minutesAgo={getMinutes(item)}
                              imageUrl={getImageUrl(item)}
                              titleFont={
                                sec?.sectionType === 'live-blogs'
                                  ? fonts.franklinGothicURW
                                  : fonts.notoSerifExtraCondensed
                              }
                              titleSize={
                                sec?.sectionType === 'live-blogs' ? fontSize['2xl'] : fontSize.l
                              }
                              titleWeight={sec?.sectionType === 'live-blogs' ? 'Dem' : undefined}
                              onPress={() => handleSectionItemPress(item, sec?.sectionType, index)}
                              showBookmark={false}
                              contentContainerStyle={styles.primeContentContainer}
                              imageStyle={styles.primeImageStyle}
                              subheadingStyles={styles.primeSubheadingStyles}
                            />
                          )}
                          ListFooterComponent={
                            <CustomDivider style={styles.indevidualContentdivider} />
                          }
                        />
                      </View>
                    );
                  }}
                />
              )}
            </>
          )}
        </ScrollView>
      )}
      <CustomToast
        type={toastType}
        message={toastMessage}
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
      />

      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWebView(false)}
      >
        <Animated.View
          style={[styles.webViewContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => setShowWebView(false)}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecommendedForYou;
