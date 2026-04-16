import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  InteractionManager
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/ShortInvestigationDetailScreen/styles';
import TopicChips, { Topic } from '@src/views/organisms/TopicChips';
import CustomHeading from '@src/views/molecules/CustomHeading';
import AuthorInfoBlock from '@src/views/pages/main/Home/StoryPage/StoryPage/components/AuthorInfoBlock';
import CategoryHeader from '@src/views/molecules/CategoryHeader';
import { HeroImage, VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import AudioPlayerCard from '@src/views/organisms/AudioPlayerCard';
import StickyAudioPlayer from '@src/views/organisms/StickyAudioPlayer';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import CustomToast from '@src/views/molecules/CustomToast';
import HeroMediaCarousel from '@src/views/pages/main/Home/StoryPage/StoryPage/components/HeroMediaCarousel';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import StorySkeletonCard from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/StorySkeletonLoader';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import { useGestureNavigation } from '@src/hooks/useGestureNavigation';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import SummaryBlock from '@src/views/templates/SummaryBlock';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { useShortInvestigationDetailViewModel } from '@src/viewModels/main/Videos/NPlusFocus/ShortInvestigationDetailScreen/useShortInvestigationDetailViewModel';
import BottomNavigationBar from '@src/views/organisms/BottomNavigationBar';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import { VideoItemCategoryTopics } from '@src/models/main/Videos/NPlusFocus';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { VODSettingsBottomSheetProps } from '@src/views/organisms/RNVideo/types';
import { VODSettingsBottomSheet } from '@src/views/organisms/RNVideo/components';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

export const ShortInvestigationDetail = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    story,
    storyContent,
    loading: storyLoading,
    error: storyError,
    activeVideoIndex,
    persistPlaybackTime,
    setActiveVideoIndex,
    videos,
    toggleJWPlayer,
    activeJWIndex,
    closeAudioPlayer,
    onPressingAuthor,
    onToggleBookmark,
    handleCardPress,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    isInternetConnection,
    handleRetry,
    internetLoader,
    internetFail,
    headerLoading,
    categoriesList,
    handleCategoryPress,
    refreshLoader,
    onRefresh,
    videoItems,
    latestPostItems,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    adConfig,
    currentSlug,
    previousSlug,
    getPlaybackTime,
    categoryPress
  } = useShortInvestigationDetailViewModel();

  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const isGestureNavigation = useGestureNavigation();
  const [settingsProps, setSettingsProps] = React.useState<VODSettingsBottomSheetProps | null>(
    null
  );
  const [theme] = useTheme('dark');
  const { shouldAutoPlay } = useSettingsStore();
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  const isFullScreen = useVideoPlayerStore((state) => state.isFullScreen);
  const isFullScreenRef = useRef(isFullScreen);
  const activeVideoIndexRef = useRef(activeVideoIndex);

  const hasVideos = Array.isArray(videos) && videos.length > 0;

  // Create data object for RNVideoPlayer
  const data = {
    Videos: {
      docs: videos.map((video) => ({
        productions: {
          specialImage: {
            url: video.content?.heroImage?.url
          }
        },
        title: video.title,
        id: video.id,
        videoUrl: video.videoUrl,
        closedCaptionUrl: video.closedCaptionUrl,
        aspectRatio: video.aspectRatio,
        content: video.content
      }))
    }
  };

  const hasMixedAspectRatios = useMemo(() => {
    if (!videos || videos.length === 0) return false;
    const has9_16 = videos.some((video) => video?.aspectRatio === '9/16');
    const has16_9 = videos.some((video) => video?.aspectRatio !== '9/16' && video?.aspectRatio);
    return has9_16 && has16_9;
  }, [videos]);

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
                analyticsContentType={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`}
                analyticsScreenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
                analyticsOrganism={ANALYTICS_ORGANISMS.STORY_PAGE.BODY}
                analyticsIdPage={story?.id}
                analyticScreenPageWebUrl={story?.slug}
                analyticsPublication={story?.publishedAt}
                analyticsDuration={videos[activeVideoIndex]?.videoDuration}
                analyticsTags={story?.topics}
                data={data}
                onSettingsRequest={setSettingsProps}
                activeVideoIndex={index}
                analyticVideoType={videos?.[activeVideoIndex]?.content?.videoType}
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

  const handleScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (newIndex !== activeVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        // Log swipe event for video carousel
        logSelectContentEvent({
          screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
          organisms: ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.HERO_MEDIA_CAROUSEL,
          content_type: `${ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER} | ${newIndex + 1}`,
          content_action: ANALYTICS_ATOMS.TAP_AND_SWIPE_RIGHT,
          idPage: story?.id,
          content_title: videos[newIndex]?.title || `Video ${newIndex + 1}`,
          screen_page_web_url: currentSlug
        });

        setActiveVideoIndex(newIndex);
      }
    },
    [activeVideoIndex, videos.length, setActiveVideoIndex, story]
  );

  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen]);

  useEffect(() => {
    activeVideoIndexRef.current = activeVideoIndex;
  }, [activeVideoIndex]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [story]);

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

  if (storyLoading) {
    return <StorySkeletonCard customTheme={'dark'} />;
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" customTheme={'dark'} />;
  }

  if (storyError instanceof ApolloError || !story) {
    return (
      <>
        {!isInternetConnection || !internetFail ? (
          <ErrorScreen status="noInternet" onRetry={handleRetry} customTheme={'dark'} />
        ) : (
          <ErrorScreen status="error" customTheme={'dark'} />
        )}
      </>
    );
  }

  const renderPaginationDots = () => {
    if (!Array.isArray(videos) || videos.length <= 1 || videos.every((v) => v === null)) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        {videos.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, index === activeVideoIndex && styles.paginationDotActive]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={isGestureNavigation ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.headerContainer}>
          {headerLoading ? (
            <CategoryHeaderSkeleton customTheme={'dark'} />
          ) : (
            <CategoryHeader
              customTheme={'dark'}
              useHeaderData={false}
              categories={categoriesList}
              onCategoryPress={handleCategoryPress}
            />
          )}
        </View>
        <View style={styles.contentContainer}>
          {story.contentPrioritization?.isBreaking && (
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
            customTheme={'dark'}
            headingText={story.title}
            headingSize={fontSize['6xl']}
            headingStyles={
              story.contentPrioritization?.isBreaking ? styles.heading : styles.headingWithMargin
            }
            headingColor={theme.newsTextTitlePrincipal}
            subHeadingText={story.excerpt}
            subHeadingSize={fontSize.s}
            subHeadingWeight="R"
            subHeadingFont={fonts.notoSerif}
            subHeadingColor={theme.carouselTextOther}
            subHeadingStyles={styles.subHeading}
          />

          {story.textToSpeech && (
            <StickyAudioPlayer
              audioDuration={story.readTime}
              miniPlayerWorking={activeJWIndex}
              onPress={toggleJWPlayer}
              customTheme={'dark'}
              screenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
              tipoContenido={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`}
            />
          )}
        </View>

        {hasVideos && (
          <FlatList
            ref={flatListRef}
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item, index) => item?.id || `video-${index}`}
            horizontal
            extraData={activeVideoIndex}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="start"
            snapToInterval={SCREEN_WIDTH}
            decelerationRate={0.8}
            snapToEnd={false}
            disableIntervalMomentum={true}
            removeClippedSubviews={false}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            style={styles.videoSection}
            bounces={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleScrollEnd}
          />
        )}

        {hasVideos && renderPaginationDots()}

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

        {story.openingType === 'image' && (
          <HeroMediaCarousel
            customTheme={'dark'}
            images={story?.heroImage?.map((img: HeroImage) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
              caption: img.caption,
              height: img.height,
              width: img.width
            }))}
            story={story}
            currentSlug={currentSlug}
            previousSlug={previousSlug}
            screenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
            tipoContenido={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`}
            pageType="shortInvestigation"
            contentAction={ANALYTICS_ATOMS.SWIPE_RIGHT}
          />
        )}

        <View style={styles.contentContainer}>
          <AuthorInfoBlock
            authors={story.authors}
            publishedAt={story.publishedAt}
            updatedAt={story.updatedAt}
            onPressingAuthor={onPressingAuthor}
            customTheme={'dark'}
            story={story}
            currentSlug={currentSlug}
            previousSlug={previousSlug}
            screenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
            tipoContenido={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`}
            pageType="shortInvestigation"
          />

          {story.summary && <SummaryBlock summaryText={story.summary} customTheme={'dark'} />}
        </View>

        <LexicalContentRenderer
          content={storyContent}
          customTheme={'dark'}
          adConfig={adConfig}
          story={story}
          currentSlug={currentSlug || ''}
          slugHistory={previousSlug ? [previousSlug, currentSlug || ''] : [currentSlug || '']}
          collection={ANALYTICS_COLLECTION.NPLUS_FOCUS}
          page={ANALYTICS_PAGE.STORYPAGE}
        />

        <TopicChips
          customTheme={'dark'}
          key={story.id}
          topics={story?.topics?.slice(0, 5) || []}
          //TODO -> will be removed once the Topic page is ready
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
        {/* Videos */}

        {((videoItems?.length ?? 0) > 0 || (latestPostItems?.length ?? 0) > 0) && (
          <View>
            <CustomText
              textStyles={styles.viewInvestigationTextStyles}
              fontFamily={fonts.notoSerifExtraCondensed}
              size={fontSize['4xl']}
            >
              {t('screens.shortInvestigations.text.shortReportsRecommended')}
            </CustomText>

            {videoItems?.length > 0 && (
              <SnapCarousel
                data={videoItems.map((item: VideoItemCategoryTopics) => ({
                  ...item,
                  collection: 'videos',
                  topic: item.topics?.[0]?.title ?? item.category?.title
                }))}
                onCardPress={handleCardPress}
                onBookmarkPress={(item) => handleBookmarkPress(item.id, 'Card_Style_1')}
                headingStyles={styles.headingStyles}
                subHeadingStyles={styles.subheadingStyles}
                iconColor={theme.carouselTextDarkTheme}
                bottomRowStyles={styles.bottomRowStyles}
                imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
              />
            )}

            {(latestPostItems ?? []).map((item, index: number) => (
              <BookmarkCard
                key={index.toString()}
                category={
                  item?.topics?.[0]?.title ??
                  item?.category?.title ??
                  t('screens.storyPage.relatedStoryBlock.general')
                }
                heading={item?.title}
                headingColor={theme.carouselTextDarkTheme}
                subHeading={`${item?.readTime ?? ''} min`}
                subHeadingColor={theme.carouselTextDarkTheme}
                isBookmarkChecked={item?.isBookmarked}
                id={item?.id ?? ''}
                onPress={() => handleCardPress(item)}
                onPressingBookmark={() => handleBookmarkPress(item?.id, 'News_Card')}
                primaryColor={theme.carouselTextDarkTheme}
                containerStyle={styles.bookmarkCardContainer}
                pressedBackgroundColor={theme.mainBackgrunforproductionPage}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {activeJWIndex && (
        <AudioPlayerCard
          audioUrl={story.textToSpeech}
          audioCardTitle={story.title}
          onPress={closeAudioPlayer}
          story={story}
          tipoContenido={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`}
          screen_page_web_url={ANALYTICS_PAGE.STORYPAGE}
          screenName={ANALYTICS_PAGE.STORYPAGE}
          currentSlug={currentSlug || ''}
          previousSlug={previousSlug || ''}
        />
      )}

      <BottomNavigationBar
        item={story}
        onToggleBookmark={onToggleBookmark}
        customTheme={'dark'}
        story={story}
        currentSlug={currentSlug}
        previousSlug={previousSlug}
        screenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
        tipoContenido={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`}
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
        customTheme={'dark'}
      />

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

export default ShortInvestigationDetail;
