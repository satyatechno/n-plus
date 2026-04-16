import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Modal,
  FlatList,
  ListRenderItemInfo,
  InteractionManager
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { useStoryViewModel } from '@src/viewModels/main/Home/StoryPage/StoryPage/useStoryViewModel';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/styles';
import TopicChips, { type Topic } from '@src/views/organisms/TopicChips';
import CustomHeading from '@src/views/molecules/CustomHeading';
import AuthorInfoBlock from '@src/views/pages/main/Home/StoryPage/StoryPage/components/AuthorInfoBlock';
import CategoryHeader from '@src/views/molecules/CategoryHeader';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { VODSettingsBottomSheet } from '@src/views/organisms/RNVideo/components';
import { VODSettingsBottomSheetProps } from '@src/views/organisms/RNVideo/types';
import { generateVODAdTagUrl, extractMcpIdFromVideoUrl } from '@src/views/organisms/RNVideo/utils';
import { HeroImage, VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { NewsItem } from '@src/models/main/Home/StoryPage/StoryPage';
import AudioPlayerCard from '@src/views/organisms/AudioPlayerCard';
import StickyAudioPlayer from '@src/views/organisms/StickyAudioPlayer';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import CustomToast from '@src/views/molecules/CustomToast';
import ProgressBarCarousel from '@src/views/organisms/ProgressBarCarousel';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import StorySkeletonCard from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/StorySkeletonLoader';
import RecommendedSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/RecommendationSkeletonLoader';
import LatestNewsSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LatestNewsSkeleton';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import { useGestureNavigation } from '@src/hooks/useGestureNavigation';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import SummaryBlock from '@src/views/templates/SummaryBlock';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import BottomNavigationBar from '@src/views/organisms/BottomNavigationBar';
import CustomWebView from '@src/views/atoms/CustomWebView';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import { logSelectContentEvent } from '@src/utils/storyAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

export const StoryPage = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    story,
    storyContent,
    loading: storyLoading,
    error: storyError,
    latestNewsLoading,
    latestNewsError,
    getPlaybackTime,
    activeVideoIndex,
    persistPlaybackTime,
    setActiveVideoIndex,
    videos,
    toggleJWPlayer,
    activeJWIndex,
    closeAudioPlayer,
    onPressingAuthor,
    recommendedStoriesData,
    recommendedStoriesLoading,
    onToggleBookmark,
    latestNews,
    handleCardPress,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    onHistoryRecommendationPress,
    isInternetConnection,
    handleRetry,
    internetLoader,
    internetFail,
    headerLoading,
    categoriesList,
    handleCategoryPress,
    refreshLoader,
    onRefresh,
    showWebView,
    webUrl,
    handleWebViewClose,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    categoryPress,
    currentSlug,
    previousSlug,
    adConfig
  } = useStoryViewModel();

  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const { shouldAutoPlay } = useSettingsStore();
  const isGestureNavigation = useGestureNavigation();

  // Track orientation changes to re-align carousel after returning from landscape
  // This fixes the carousel offset issue when exiting PiP after orientation change
  const isFullScreen = useVideoPlayerStore((state) => state.isFullScreen);
  const isFullScreenRef = useRef(isFullScreen);
  const activeVideoIndexRef = useRef(activeVideoIndex);

  // Keep refs in sync
  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen]);

  useEffect(() => {
    activeVideoIndexRef.current = activeVideoIndex;
  }, [activeVideoIndex]);

  useEffect(() => {
    const handleOrientationChange = (orientation: OrientationType) => {
      // When orientation changes back to portrait and we're not in fullscreen,
      // re-align the carousel to fix any offset issues
      if (orientation === 'PORTRAIT' && !isFullScreenRef.current && videos.length > 0) {
        // Use InteractionManager + delay to ensure layout is stable
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            if (flatListRef.current) {
              const targetOffset = activeVideoIndexRef.current * SCREEN_WIDTH;
              flatListRef.current.scrollToOffset({
                offset: targetOffset,
                animated: false
              });
            }
          }, 300);
        });
      }
    };

    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, [videos.length]);

  const hasMixedAspectRatios = useMemo(() => {
    if (!videos || videos.length === 0) return false;

    const has9_16 = videos.some((video) => video?.aspectRatio === '9/16');
    const has16_9 = videos.some((video) => video?.aspectRatio !== '9/16' && video?.aspectRatio);

    return has9_16 && has16_9;
  }, [videos]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [story]);

  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  const [settingsProps, setSettingsProps] = React.useState<VODSettingsBottomSheetProps | null>(
    null
  );

  const hasVideos = useMemo(
    () => story?.openingType === 'video' && videos.length > 0 && videos.some(Boolean),
    [story?.openingType, videos]
  );

  // Generate ad tag URL for a video
  const getAdTagForVideo = useCallback((video: VideoItem) => {
    if (!video?.videoUrl) return undefined;
    const mcpId = extractMcpIdFromVideoUrl(video.videoUrl);
    if (!mcpId) return undefined;
    return generateVODAdTagUrl({
      mcpId,
      programName: video?.title || '',
      site: 'nmas',
      pageType: 'NA'
    });
  }, []);

  // Render video item - RNVideoPlayer is rendered INSIDE FlashList
  // FlashList recycles views instead of unmounting, so rotation won't cause reload
  const renderVideoItem = useCallback(
    ({ item, index }: ListRenderItemInfo<VideoItem>) => {
      const aspectRatio = hasMixedAspectRatios
        ? 16 / 9
        : item?.aspectRatio === '9/16'
          ? 4 / 5
          : 16 / 9;

      const isActive = index === activeVideoIndex;

      return (
        <View style={styles.screenWidthStyles}>
          <View style={[styles.videoContainer, { aspectRatio }]}>
            {isActive && (
              <RNVideoPlayer
                videoUrl={item.videoUrl}
                thumbnail={item.content?.heroImage?.url}
                aspectRatio={aspectRatio}
                adTagUrl={getAdTagForVideo(item)}
                adLanguage="es"
                initialSeekTime={getPlaybackTime(item.id)}
                autoStart={shouldAutoPlay()}
                videoType="storyPageVideoMedia"
                onTimeUpdate={persistPlaybackTime}
                has9_16={item.aspectRatio === '9/16'}
                analyticsContentType={`${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`}
                analyticsScreenName={ANALYTICS_COLLECTION.STORYPAGE}
                analyticsOrganism={ANALYTICS_ORGANISMS.STORY_PAGE.BODY}
                analyticsIdPage={story?.id}
                analyticScreenPageWebUrl={story?.slug}
                analyticsPublication={story?.publishedAt}
                analyticsDuration={videos[activeVideoIndex]?.videoDuration}
                analyticsTags={story?.topics
                  ?.map((topic: { title?: string }) => topic?.title)
                  ?.join(',')}
                onSettingsRequest={setSettingsProps}
                data={{ Video: { title: item.title } }}
                analyticVideoType={videos?.[activeVideoIndex]?.content?.videoType}
                activeVideoIndex={index}
                analyticsProduction={`${story.channel?.title}_${story?.production?.title}`}
              />
            )}
          </View>
        </View>
      );
    },
    [
      hasMixedAspectRatios,
      activeVideoIndex,
      styles.screenWidthStyles,
      styles.videoContainer,
      getAdTagForVideo,
      getPlaybackTime,
      shouldAutoPlay,
      persistPlaybackTime
    ]
  );

  // Handle scroll end - update active video index
  const handleScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (newIndex !== activeVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setActiveVideoIndex(newIndex);

        if (story && videos[newIndex]) {
          const videoTitle = videos[newIndex]?.title || `Video ${newIndex + 1}`;
          const contentName = videoTitle.substring(0, 100);

          logSelectContentEvent(story, {
            organism: ANALYTICS_ORGANISMS.STORY_PAGE.HERO,
            molecule: `${ANALYTICS_MOLECULES.STORY_PAGE.HERO_MEDIA_CAROUSEL.MEDIA_PLAYER}${newIndex + 1}`,
            contentName,
            currentSlug: currentSlug || 'undefined',
            previousSlug: previousSlug || 'undefined',
            contentAction: ANALYTICS_ATOMS.TAP_AND_SWIPE_RIGHT,
            screenName: ANALYTICS_COLLECTION.STORYPAGE,
            tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`
          });
        }
      }
    },
    [activeVideoIndex, videos.length, setActiveVideoIndex, story, currentSlug, previousSlug]
  );

  // Early returns AFTER all hooks
  if (storyLoading && !refreshLoader) {
    return <StorySkeletonCard />;
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (storyError instanceof ApolloError || !story) {
    return (
      <>
        {!isInternetConnection || !internetFail ? (
          <ErrorScreen status="noInternet" onRetry={handleRetry} />
        ) : (
          <ErrorScreen status="error" />
        )}
      </>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={isGestureNavigation ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoader}
            onRefresh={onRefresh}
            tintColor={theme.bodyTextOther}
          />
        }
      >
        <View style={styles.headerContainer}>
          {headerLoading && !refreshLoader ? (
            <CategoryHeaderSkeleton />
          ) : (
            <CategoryHeader
              useHeaderData={false}
              categories={categoriesList}
              onCategoryPress={handleCategoryPress}
            />
          )}
        </View>
        <View style={styles.contentContainer}>
          {story?.contentPrioritization?.isBreaking && (
            <CustomText
              size={fontSize.xs}
              weight="Dem"
              fontFamily={fonts.franklinGothicURW}
              color={theme.tagsTextBreakingNews}
              textStyles={styles.breakingNewsText}
            >
              {t('screens.breakingNews.text.breakingNews')}
            </CustomText>
          )}
          <CustomHeading
            headingText={story?.title}
            headingSize={fontSize['4xl']}
            headingWeight={story?.contentPrioritization?.isBreaking ? 'R' : 'B'}
            headingStyles={
              story?.contentPrioritization?.isBreaking ? styles.heading : styles.headingWithMargin
            }
            headingFont={fonts.notoSerifExtraCondensed}
            headingColor={theme.newsTextTitlePrincipal}
            subHeadingText={story?.excerpt}
            subHeadingSize={fontSize.s}
            subHeadingWeight="R"
            subHeadingFont={fonts.notoSerif}
            subHeadingColor={theme.bodyTextOther}
            subHeadingStyles={styles.subHeading}
          />

          {story?.textToSpeech && (
            <StickyAudioPlayer
              audioDuration={story?.readTime}
              miniPlayerWorking={activeJWIndex}
              onPress={toggleJWPlayer}
              screenName={ANALYTICS_COLLECTION.STORYPAGE}
              tipoContenido={`${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`}
            />
          )}
        </View>

        {hasVideos && (
          <FlatList
            ref={flatListRef}
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item, index) => item?.id || `video-${index}`}
            extraData={activeVideoIndex}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={SCREEN_WIDTH}
            decelerationRate={0.8}
            snapToEnd={false}
            disableIntervalMomentum={true}
            bounces={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleScrollEnd}
            removeClippedSubviews={false}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            style={styles.videoSection}
          />
        )}

        {hasVideos && videos[activeVideoIndex] && (
          <CustomText
            size={fontSize.xxs}
            fontFamily={fonts.franklinGothicURW}
            textStyles={StyleSheet.flatten([
              styles.caption,
              videos.length > 1 && styles.extraCaptionMargin,
              styles.contentContainer
            ])}
          >
            {videos[activeVideoIndex]?.title || `Video ${activeVideoIndex + 1}`}
          </CustomText>
        )}

        {story?.openingType === 'image' && (
          <ProgressBarCarousel
            images={(story?.heroImage ?? []).map((img: HeroImage) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
              caption: img.caption,
              height: img.height,
              width: img.width,
              sizes: img.sizes
            }))}
            defaultCaption={t('screens.storyPage.heroMediaCarousel.caption')}
            onSlideChange={(index) => {
              const heroImages = (story?.heroImage ?? []).map((img: HeroImage) => ({
                id: img.id,
                caption: img.caption
              }));
              const imageCaption = heroImages[index]?.caption || `Image ${index + 1}`;
              const contentName = imageCaption.substring(0, 100);

              logSelectContentEvent(story, {
                organism: ANALYTICS_ORGANISMS.STORY_PAGE.HERO,
                molecule: `${ANALYTICS_MOLECULES.STORY_PAGE.HERO_MEDIA_CAROUSEL.BASE_NAME}${index + 1}`,
                contentName,
                currentSlug: currentSlug || 'undefined',
                previousSlug: previousSlug || 'undefined',
                screenName: ANALYTICS_COLLECTION.STORYPAGE,
                tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
                contentAction: ANALYTICS_ATOMS.SWIPE_RIGHT
              });
            }}
          />
        )}

        <View style={styles.contentContainer}>
          <AuthorInfoBlock
            authors={story?.authors}
            publishedAt={story?.publishedAt}
            updatedAt={story?.updatedAt}
            onPressingAuthor={onPressingAuthor}
          />

          {story?.summary && <SummaryBlock summaryText={story?.summary} />}
        </View>

        <LexicalContentRenderer
          content={storyContent}
          excludeHeadingMarginBottom={true}
          adConfig={adConfig}
          story={story}
          currentSlug={currentSlug || ''}
          slugHistory={previousSlug ? [previousSlug, currentSlug || ''] : [currentSlug || '']}
          collection={ANALYTICS_COLLECTION.STORYPAGE}
          page={ANALYTICS_PAGE.STORYPAGE}
        />

        <TopicChips
          key={story?.id}
          topics={story?.topics?.slice(0, 5) || []}
          onPress={(value: string | Topic) => {
            if (typeof value === 'string') {
              categoryPress({ title: value });
            } else {
              categoryPress(value);
            }
          }}
          isCategory={true}
          heading={t('screens.topicChips.text.relatedTopics')}
          headingTextstyle={StyleSheet.flatten([styles.headingChipsstyle, styles.contentContainer])}
          mainContainerstyle={styles.mainContainerstyle}
          chipsContainerStyle={styles.chipsContainerStyle}
          chipFontWeight={'Med'}
          listContainerStyle={styles.chipsListContainerStyle}
        />

        <View style={styles.contentContainer}>
          {recommendedStoriesLoading && !refreshLoader ? (
            <RecommendedSkeleton />
          ) : recommendedStoriesData?.GetRecommendedStories?.data?.length > 0 ? (
            <>
              <CustomText
                size={fontSize['4xl']}
                color={theme.sectionTextTitleNormal}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.recommendedStoriesTitle}
              >
                {t('screens.storyPage.author.recommendedStories')}
              </CustomText>
              {(recommendedStoriesData?.GetRecommendedStories?.data ?? []).map(
                (item: NewsItem, index: number) => (
                  <BookmarkCard
                    key={index.toString()}
                    category={
                      item?.topics?.[0]?.title ??
                      item?.category?.title ??
                      t('screens.storyPage.relatedStoryBlock.general')
                    }
                    heading={item?.title}
                    subHeading={`${item?.readTime ?? '7'} min`}
                    isBookmarkChecked={item?.isBookmarked}
                    id={item?.id ?? ''}
                    categoryId={item?.category?.id}
                    slug={item?.slug}
                    collection={item?.collection}
                    onPressingBookmark={onToggleBookmark}
                    onPress={() => onHistoryRecommendationPress(item)}
                    containerStyle={{ paddingVertical: 8 }}
                  />
                )
              )}
            </>
          ) : null}
        </View>

        {latestNewsLoading && !refreshLoader ? (
          <LatestNewsSkeleton />
        ) : (
          <View>
            <CustomText
              size={fontSize['4xl']}
              fontFamily={fonts.notoSerifExtraCondensed}
              textStyles={styles.latestNewsTitle}
            >
              {t('screens.storyPage.latestNews.title')}
            </CustomText>

            {latestNewsError ? (
              <CustomText textStyles={styles.error}>
                {t('screens.login.text.somethingWentWrong')}
              </CustomText>
            ) : (
              <SnapCarousel
                data={latestNews.map((newsItem: NewsItem) => {
                  const topic =
                    newsItem.topics && newsItem.topics.length > 0
                      ? typeof newsItem.topics[0] === 'string'
                        ? newsItem.topics[0]
                        : newsItem.topics[0]?.title
                      : newsItem.category?.title ||
                        t('screens.storyPage.relatedStoryBlock.general');

                  const imageUrl =
                    newsItem.heroImages && newsItem.heroImages.length > 0
                      ? newsItem.heroImages[0].url
                      : undefined;

                  const heroImageUrl =
                    newsItem.heroImages && newsItem.heroImages.length > 0
                      ? newsItem.heroImages[0].url
                      : '';

                  return {
                    imageUrl,
                    topic,
                    title: newsItem.title,
                    minutesAgo: newsItem.readTime ? `${newsItem.readTime} min` : undefined,
                    isBookmarked: newsItem.isBookmarked ?? false,
                    type: newsItem.collection,
                    id: newsItem.id,
                    slug: newsItem.slug,
                    category: newsItem.category,
                    collection: newsItem.collection,
                    heroImage: { url: heroImageUrl }
                  };
                })}
                onCardPress={handleCardPress}
                onBookmarkPress={handleBookmarkPress}
                listContainerStyle={styles.latestNewslistContainer}
                imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                subHeadingStyles={{ marginBottom: 12 }}
              />
            )}
          </View>
        )}
      </ScrollView>

      {activeJWIndex && (
        <AudioPlayerCard
          audioUrl={story?.textToSpeech}
          audioCardTitle={story?.title}
          onPress={closeAudioPlayer}
          story={story}
          screen_page_web_url={ANALYTICS_PAGE.STORYPAGE}
          screenName={ANALYTICS_COLLECTION.STORYPAGE}
          tipoContenido={`${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`}
          currentSlug={currentSlug || ''}
          previousSlug={previousSlug || ''}
        />
      )}

      {/* Note: PiP and Fullscreen containers removed - RNVideoPlayer handles these internally via Portal system */}

      <BottomNavigationBar
        item={story}
        onToggleBookmark={onToggleBookmark}
        story={story}
        currentSlug={currentSlug}
        previousSlug={previousSlug}
        screenName={ANALYTICS_COLLECTION.STORYPAGE}
        tipoContenido={`${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`}
      />

      <CustomToast
        type={toastType}
        message={
          toastMessage === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : toastMessage
        }
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={handleWebViewClose}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={handleWebViewClose}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
      />

      {settingsProps && (
        <VODSettingsBottomSheet
          {...settingsProps}
          visible={settingsProps.visible}
          onClose={() => {
            if (settingsProps.onClose) settingsProps.onClose();
            setSettingsProps(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default StoryPage;
