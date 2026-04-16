import React, { useMemo } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, View, Modal } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { themeStyles } from '@src/views/pages/main/Home/Search/SearchLandingPage/styles';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomText from '@src/views/atoms/CustomText';
import CustomDivider from '@src/views/atoms/CustomDivider';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import LatestNewsSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LatestNewsSkeleton';
import useSearchLandingPageViewModel from '@src/viewModels/main/Home/Search/useSearchLandingPageViewModel';
import MicrophoneScreen from '@src/views/pages/main/Home/Search/SearchLandingPage/components/MicrophoneScreen';
import SearchBarHeader from '@src/views/pages/main/Home/Search/SearchLandingPage/components/SearchBarHeader';
import TopicChips, { type Topic } from '@src/views/organisms/TopicChips';
import { COLLECTION_TYPE } from '@src/config/enum';
import FilterOption from '@src/views/pages/main/Home/Search/SearchLandingPage/components/FilterOption';
import SearchSuggestions from '@src/views/pages/main/Home/Search/SearchLandingPage/components/SearchSuggestions';
import RenderCollection from '@src/views/organisms/RenderCollection';
import RenderCollectionSkeleton from '@src/views/organisms/RenderCollectionSkeleton';
import CustomToast from '@src/views/molecules/CustomToast';
import TopicChipSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/TopicChipSkeleton';
import CustomWebView from '@src/views/atoms/CustomWebView';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import ArticleSnapCarousel from '@src/views/organisms/ArticleSnapCarousel';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import { CarouselItem } from '@src/models/main/Home/StoryPage/StoryPage';

const SearchLandingPage = () => {
  const {
    theme,
    t,
    goBack,
    isInternetConnection,
    onRetry,
    refreshLoader,
    mostPopularSearchContentData,
    mostPopularSearchContentLoading,
    methods,
    _startRecognizing,
    isVoiceModalVisible,
    closeVoiceModal,
    spokenText,
    volume,
    setIsSearchBar,
    isSearchBar,
    searchPayloadData,
    handleSearchResultPress,
    onSearchResultPress,
    contentChipTopics,
    showSearchResult,
    onChipPress,
    sorting,
    isFilterVisible,
    setIsFilterVisible,
    onSelectSorting,
    searchPayloadContentData,
    searchItems,
    hasNext,
    loadingMore,
    onLoadMore,
    onRefreshResults,
    searchPayloadContentLoading,
    collection,
    toastType,
    toastMessage,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    getMostViewedTopicsData,
    handleSearchNavigation,
    getMostViewedTopicsLoading,
    mostInterestedContentData,
    mostInterestedContentLoading,
    recentSearches,
    showWebView,
    setShowWebView,
    webUrl,
    handleInteractiveResearchPress,
    voiceError,
    widthAnim,
    slideAnim,
    handleMostPopularSearchPress,
    handleTopicChipPress,
    handleInterestedContentPress,
    handleSearchResultBookmarkPress,
    handleTopicChipPressAnalytics,
    handleSearchBarTapAnalytics,
    handleSearchBarCloseAnalytics
  } = useSearchLandingPageViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const input = (methods.watch('searchText') ?? '').trim();
  const showHistory = isSearchBar && input.length === 0 && (recentSearches?.length ?? 0) > 0;
  const showSuggestions = isSearchBar && input.length > 2 && (searchPayloadData?.length ?? 0) > 0;

  const hasPopular = (mostPopularSearchContentData?.length ?? 0) > 0;
  const hasTopics = (getMostViewedTopicsData?.length ?? 0) > 0;
  const hasInterested = (mostInterestedContentData?.GetMostInterestedContent?.length ?? 0) > 0;
  const hasAnyData = hasPopular || hasTopics || hasInterested;
  const anyLoading =
    getMostViewedTopicsLoading ||
    searchPayloadContentLoading ||
    mostPopularSearchContentLoading ||
    getMostViewedTopicsLoading ||
    mostInterestedContentLoading ||
    loadingMore;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBarHeader
        theme={theme}
        styles={styles}
        t={t}
        methods={methods}
        isSearchBar={isSearchBar}
        setIsSearchBar={setIsSearchBar}
        goBack={goBack}
        _startRecognizing={_startRecognizing}
        widthAnim={widthAnim}
        onSubmitSearch={(query) => handleSearchResultPress({ title: query })}
        isSearchDropdownVisible={showHistory || showSuggestions}
        hideMic={anyLoading}
        onSearchBarTap={handleSearchBarTapAnalytics}
        onCloseSearchBar={handleSearchBarCloseAnalytics}
      >
        <SearchSuggestions
          visible={showHistory || showSuggestions}
          suggestions={showSuggestions ? (searchPayloadData ?? []) : []}
          onItemPress={handleSearchResultPress}
          styles={styles}
          history={(recentSearches ?? [])
            .slice(0, 5)
            .map((item) => ({ ...item, [Symbol()]: undefined }))}
          showHistory={showHistory}
        />
      </SearchBarHeader>

      {!showSearchResult ? (
        <>
          {!anyLoading && !hasAnyData ? (
            !isInternetConnection ? (
              <ErrorScreen
                status="noInternet"
                onRetry={onRetry}
                contentContainerStyle={styles.errorContainer}
              />
            ) : (
              <ErrorScreen
                status="error"
                onRetry={onRetry}
                contentContainerStyle={styles.errorContainer}
              />
            )
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              style={isSearchBar ? styles.searchOverlayBg : undefined}
              onTouchStart={() => {
                if (isSearchBar) setIsSearchBar(false);
                handleSearchBarCloseAnalytics();
              }}
              onScrollBeginDrag={() => {
                if (isSearchBar) setIsSearchBar(false);
              }}
              refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
            >
              {mostPopularSearchContentLoading ? (
                <LatestNewsSkeleton />
              ) : mostPopularSearchContentData?.length > 0 ? (
                <View style={styles.popularContainer}>
                  <CustomText
                    size={fontSize['4xl']}
                    fontFamily={fonts.notoSerifExtraCondensed}
                    textStyles={styles.latestNewsTitle}
                  >
                    {t('screens.search.text.popularSearches')}
                  </CustomText>

                  <SnapCarousel
                    elementType={'publishedAt'}
                    data={mostPopularSearchContentData.slice(0, 3)}
                    onCardPress={handleMostPopularSearchPress}
                    getVideoDuration={(item: CarouselItem) =>
                      formatDurationToMinutes(item?.readTime ?? 0)
                    }
                    showBookmark={false}
                    listContainerStyle={styles.mostPopularSearchStyle}
                    getImageUrl={(item: CarouselItem) => item?.heroImages[0]?.url ?? ''}
                    imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                  />
                  <CustomDivider style={styles.divider} />
                </View>
              ) : null}

              {getMostViewedTopicsLoading ? (
                <TopicChipSkeleton />
              ) : (
                getMostViewedTopicsData?.length > 0 && (
                  <>
                    <TopicChips
                      topics={getMostViewedTopicsData}
                      heading={t('screens.search.text.interests')}
                      headingTextstyle={styles.mostViewedTopicsHeadingText}
                      listContainerStyle={styles.getMostViewedchipsContainer}
                      onPress={handleTopicChipPress}
                      isCategory={true}
                    />
                    <CustomDivider style={styles.divider} />
                  </>
                )
              )}

              {mostInterestedContentLoading ? (
                <LatestNewsSkeleton />
              ) : (
                mostInterestedContentData?.GetMostInterestedContent?.length > 0 && (
                  <View style={styles.interestedInContainer}>
                    <CustomText
                      size={fontSize['4xl']}
                      fontFamily={fonts.notoSerifExtraCondensed}
                      textStyles={styles.interestedInTitle}
                    >
                      {t('screens.search.text.mightBeInterestedIn')}
                    </CustomText>

                    <ArticleSnapCarousel
                      data={mostInterestedContentData?.GetMostInterestedContent.slice(0, 4) || []}
                      onCardPress={handleInterestedContentPress}
                      contentContainerStyle={styles.containerStyle}
                      cardStyle={styles.contentStyle}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      dateTextStyle={{ color: theme.labelsTextLabelPlay }}
                    />
                  </View>
                )
              )}
            </ScrollView>
          )}
        </>
      ) : (
        <View style={[styles.resultsContainer, isSearchBar ? styles.dimmedScroll : undefined]}>
          <View style={styles.resultsHeaderRow}>
            <CustomText
              size={fontSize.s}
              weight="Dem"
              fontFamily={fonts.franklinGothicURW}
              textStyles={styles.resultsTitle}
            >
              {t('screens.search.text.resultsTitle')}
            </CustomText>
            {/* Commenting it out for now; this code may be useful in the future. */}
            {/* <Pressable
              style={styles.filterButton}
              onPress={() => {
                handleFilterIconAnalytics();
                setIsFilterVisible(!isFilterVisible);
              }}
            >
              <FilterIcon />
            </Pressable> */}
          </View>

          <View style={styles.resultsDivider} />

          <TopicChips
            topics={contentChipTopics}
            heading=""
            headingTextstyle={styles.chipsHeadingText}
            preselect
            listContainerStyle={styles.chipsListContainer}
            onPress={(value: string | Topic) => {
              const index = contentChipTopics.findIndex((topic: Topic) =>
                typeof value === 'string'
                  ? topic.title === value
                  : topic.title === (value as Topic).title
              );
              if (isSearchBar) setIsSearchBar(false);
              handleTopicChipPressAnalytics(value, index);

              if (typeof value === 'string') {
                onChipPress(value as COLLECTION_TYPE);
              }
            }}
          />

          <FilterOption
            visible={isFilterVisible}
            sorting={sorting}
            onSelect={onSelectSorting}
            onRequestClose={() => setIsFilterVisible(false)}
            styles={styles}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onTouchStart={() => {
              if (isSearchBar) setIsSearchBar(false);
            }}
            onScrollBeginDrag={() => {
              if (isSearchBar) setIsSearchBar(false);
            }}
            refreshControl={
              <RefreshControl refreshing={refreshLoader} onRefresh={onRefreshResults} />
            }
          >
            {searchPayloadContentLoading && !loadingMore ? (
              <RenderCollectionSkeleton
                key={`skeleton-${collection}`}
                styles={styles}
                collection={collection}
              />
            ) : (
              <RenderCollection
                key={`${collection}-${methods.watch('searchText') ?? ''}`}
                data={searchItems?.length ? searchItems : searchPayloadContentData}
                styles={styles}
                collection={collection}
                onToggleBookmark={(
                  contentId: string,
                  type: string,
                  title?: string,
                  index?: number
                ) => handleSearchResultBookmarkPress(contentId, type, title, index)}
                theme={theme}
                onPress={(params: {
                  routeName?: string;
                  screenName?: string;
                  slug?: string;
                  id?: string;
                  interactiveUrl?: string;
                  index?: number;
                }) => {
                  const pressedItem =
                    searchItems?.find(
                      (item) => item.id === params.id || item.slug === params.slug
                    ) ||
                    searchPayloadContentData?.find(
                      (item) => item.id === params.id || item.slug === params.slug
                    );

                  if (pressedItem) {
                    onSearchResultPress(pressedItem, collection, params.index);
                  }

                  if (
                    collection === COLLECTION_TYPE.PRESS_ROOM ||
                    collection === COLLECTION_TYPE.INTERACTIVOS
                  ) {
                    handleInteractiveResearchPress(params);
                  } else if (params.routeName && params.screenName) {
                    handleSearchNavigation(
                      params as {
                        routeName: string;
                        screenName: string;
                        slug?: string;
                        id?: string;
                      }
                    );
                  }
                }}
                hasNext={hasNext}
                loadingMore={loadingMore}
                onLoadMore={onLoadMore}
              />
            )}
          </ScrollView>
          {isFilterVisible ? (
            <Pressable style={styles.filterBackdrop} onPress={() => setIsFilterVisible(false)} />
          ) : null}
        </View>
      )}

      <MicrophoneScreen
        visible={isVoiceModalVisible}
        onClose={closeVoiceModal}
        onStartRecognizing={_startRecognizing}
        spokenText={spokenText}
        voiceError={voiceError}
        volume={volume}
        theme={theme}
        styles={styles}
      />

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
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

export default SearchLandingPage;
