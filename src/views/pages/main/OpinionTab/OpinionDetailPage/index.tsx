import React, { useMemo, useCallback, useEffect, useRef, memo } from 'react';
import {
  FlatList,
  ScrollView,
  View,
  RefreshControl,
  ListRenderItemInfo,
  StyleSheet,
  InteractionManager
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { themeStyles } from '@src/views/pages/main/OpinionTab/OpinionDetailPage/styles';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { useGestureNavigation } from '@src/hooks/useGestureNavigation';
import useOpinionDetailViewModel from '@src/viewModels/main/OpinionTab/useOpinionDetailViewModel';
import HeaderOpinionDetail from '@src/views/pages/main/OpinionTab/OpinionDetailPage/components/HeaderAuthorDetails';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import OpinionRecentSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionRecentSkeleton';
import OpinionOtherSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionOtherSkeleton';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { formatMexicoDateTime, formatMexicoDateOnly } from '@src/utils/dateFormatter';
import { Author, CarouselData } from '@src/models/main/Opinion/Opinion';
import CustomToast from '@src/views/molecules/CustomToast';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import { useTheme } from '@src/hooks/useTheme';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { HeroImage, McpItem, VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import BottomNavigationBar from '@src/views/organisms/BottomNavigationBar';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import HeroMediaCarousel from '@src/views/pages/main/Home/StoryPage/StoryPage/components/HeroMediaCarousel';
import OpinionDetailSkeleton from '@src/views/pages/main/OpinionTab/OpinionDetailPage/components/OpinionDetailSkeleton';
import SummaryBlock from '@src/views/templates/SummaryBlock';
import CustomDivider from '@src/views/atoms/CustomDivider';
import InfoSnapCarousel from '@src/views/organisms/InfoSnapCarousel';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { VODSettingsBottomSheet } from '@src/views/organisms/RNVideo/components';
import { VODSettingsBottomSheetProps } from '@src/views/organisms/RNVideo/types';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import AudioPlayerCard from '@src/views/organisms/AudioPlayerCard';
import StickyAudioPlayer from '@src/views/organisms/StickyAudioPlayer';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * OpinionDetailPage is a React functional component that displays the details of an opinion article or video.
 *
 * It handles rendering of video players (including Picture-in-Picture mode), article content, author information,
 * related opinions, and error states (such as no internet connection or missing data).
 *
 * The component supports:
 * - Safe area insets for proper layout on devices with notches.
 * - Dynamic footer height adjustment.
 * - Video playback with JWVideoPlayer, including PiP and background modes.
 * - Pagination dots for multiple videos.
 * - Bookmarking functionality and guest bookmark modal.
 * - Error handling for network and data issues.
 * - Displaying more opinions and more content from the same authors.
 * - Custom toasts for feedback messages.
 *
 * Hooks used:
 * - useNavigation: for navigation and tab bar control.
 * - useSafeAreaInsets: for safe area padding.
 * - useOpinionDetailViewModel: for fetching and managing opinion detail data and actions.
 * - useTheme: for theming and styling.
 * - useTranslation: for i18n support.
 * - useFocusEffect: for lifecycle management.
 * - useVideoPlayerStore: for video player state management.
 *
 * @returns {JSX.Element} The rendered opinion detail page.
 */

interface OpinionDetailBookmarkItemProps {
  item: CarouselData;
  index: number;
  styles: ReturnType<typeof themeStyles>;
  theme: ReturnType<typeof useOpinionDetailViewModel>['theme'];
  onBookmarkPress: (id: string) => void;
  onPress: (slug: string, collection: string) => void;
}

const OpinionDetailBookmarkItem = memo(
  ({ item, index, styles, theme, onBookmarkPress, onPress }: OpinionDetailBookmarkItemProps) => {
    const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');
    const subHeadingText =
      typeof publishedAt === 'string'
        ? (publishedAt.split('|')[0] || '').trim()
        : (publishedAt?.date ?? '');

    return (
      <BookmarkCard
        index={index}
        category={item?.authors?.[0]?.name ?? ''}
        categoryFont={fonts.franklinGothicURW}
        categoryTextSize={fontSize.xs}
        categoryTextStyles={styles.categoryTextStyles}
        heading={item?.title}
        headingFont={fonts.franklinGothicURW}
        headingTextSize={fontSize.xs}
        headingTextStyles={styles.headerStyle}
        subHeadingFont={fonts.franklinGothicURW}
        subHeadingWeightText="Boo"
        subHeadingTextStyles={styles.subHeadingStyles}
        subHeading={subHeadingText}
        isBookmarkChecked={item?.isBookmarked}
        id={`${item?.id ?? index}`}
        subHeadingColor={theme.labelsTextLabelPlay}
        onPressingBookmark={() => onBookmarkPress(item.id ?? '')}
        imageUrl={item?.heroImages?.[0]?.url ?? ''}
        onPress={() => onPress(item?.slug ?? '', item?.collection ?? '')}
        isVideo={item?.collection === 'videos'}
      />
    );
  }
);

OpinionDetailBookmarkItem.displayName = 'OpinionDetailBookmarkItem';

const OpinionDetailPage: React.FC = () => {
  const navigation = useNavigation();

  const {
    slug,
    storyData,
    storyLoading,
    videoData,
    videoLoading,
    moreFromAuthorsData,
    moreFromAuthorsLoading,
    theme: vmTheme,
    authors,
    moreOpinionList,
    moreOpinionListLoading,
    isInternetConnection,
    refreshLoader,
    onRetry,
    handleBookmarkPress,
    toastType,
    toastMessage,
    bookmarkModalVisible,
    setToastMessage,
    setBookmarkModalVisible,
    isPipMode,
    activeVideoIndex,
    persistPlaybackTime,
    setActiveVideoIndex,
    collection,
    handleNavigationToDetailPage,
    handleAuthorPress,
    getPlaybackTime,
    handleMasOpinionesCardAnalytics,
    toggleJWPlayer,
    activeJWIndex,
    closeAudioPlayer
  } = useOpinionDetailViewModel();

  const [theme] = useTheme();
  const resolvedTheme = theme ?? vmTheme;
  const styles = useMemo(() => themeStyles(resolvedTheme), [resolvedTheme]);
  const { t } = useTranslation();

  const [settingsProps, setSettingsProps] = React.useState<VODSettingsBottomSheetProps | null>(
    null
  );

  // Track orientation changes to re-align carousel after returning from landscape
  // This fixes the carousel offset issue when exiting PiP after orientation change
  const isFullScreen = useVideoPlayerStore((state) => state.isFullScreen);
  const isFullScreenRef = useRef(isFullScreen);
  const activeVideoIndexRef = useRef(activeVideoIndex);
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  // Keep refs in sync
  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen]);

  useEffect(() => {
    activeVideoIndexRef.current = activeVideoIndex;
  }, [activeVideoIndex]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  const { shouldAutoPlay } = useSettingsStore();
  const hasNoData = !videoData?.Video && !storyData?.Post;

  const videos: VideoItem[] = useMemo(() => {
    const mcpVideos =
      storyData?.Post?.mcpId?.map((item: McpItem) => ({
        ...item.value,
        title: item.value?.title ?? ''
      })) ?? [];

    if (mcpVideos.length > 0) return mcpVideos;

    if (Array.isArray(videoData?.Videos)) return videoData.Videos;
    if (videoData?.Video) return [videoData.Video];
    return [];
  }, [storyData?.Post?.mcpId, videoData]);

  // Handle scroll end with analytics
  const handleScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (newIndex !== activeVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        // Log swipe event for video carousel
        logSelectContentEvent({
          screen_name: ANALYTICS_COLLECTION.OPINION,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`,
          organisms: ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.HERO_MEDIA_CAROUSEL,
          content_type: `${ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER} | ${newIndex + 1}`,
          content_action: ANALYTICS_ATOMS.TAP_AND_SWIPE_RIGHT,
          idPage: storyData?.Post?.id || videoData?.Video?.id,
          content_title: videos[newIndex]?.title || `Video ${newIndex + 1}`
        });

        setActiveVideoIndex(newIndex);
      }
    },
    [activeVideoIndex, videos, setActiveVideoIndex, storyData, videoData]
  );

  const hasVideos = Array.isArray(videos) && videos.length > 0;
  const isGestureNavigation = useGestureNavigation();

  const isLoading =
    videoLoading || storyLoading || moreOpinionListLoading || moreFromAuthorsLoading;

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

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
    waitForInteraction: false
  };

  const hasMixedAspectRatios = useMemo(() => {
    if (!videos || videos.length === 0) return false;

    const has9_16 = videos.some((video) => video?.aspectRatio === '9/16');
    const has16_9 = videos.some((video) => video?.aspectRatio !== '9/16' && video?.aspectRatio);

    return has9_16 && has16_9;
  }, [videos]);

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
                onSettingsRequest={setSettingsProps}
                analyticsContentType={`${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`}
                analyticsScreenName={ANALYTICS_COLLECTION.VIDEOS}
                analyticsOrganism={ANALYTICS_ORGANISMS.STORY_PAGE.BODY}
                analyticsIdPage={storyData?.Post?.id}
                analyticScreenPageWebUrl={storyData?.Post?.slug}
                analyticsPublication={storyData?.Post?.publishedAt}
                analyticsDuration={videos[activeVideoIndex]?.videoDuration}
                analyticsTags={storyData?.Post?.category?.title}
                data={videoData}
                activeVideoIndex={index}
                analyticVideoType={videos?.[activeVideoIndex]?.content?.videoType}
                analyticsProduction={`${storyData?.Post?.channel?.title}_${storyData?.Post?.production?.title}`}
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

  const renderMoreOpinionItem = useCallback(
    ({ item, index }: ListRenderItemInfo<CarouselData>) => (
      <OpinionDetailBookmarkItem
        item={item}
        index={index}
        styles={styles}
        theme={resolvedTheme}
        onBookmarkPress={handleBookmarkPress}
        onPress={() => {
          handleMasOpinionesCardAnalytics(item, index, false);
          handleNavigationToDetailPage(item?.slug ?? '', item?.collection ?? '');
        }}
      />
    ),
    [
      styles,
      resolvedTheme,
      handleBookmarkPress,
      handleMasOpinionesCardAnalytics,
      handleNavigationToDetailPage
    ]
  );

  const moreOpinionKeyExtractor = useCallback(
    (item: CarouselData, index: number) => `${item?.id ?? index}`,
    []
  );

  const renderPaginationDots = () => {
    if (
      !Array.isArray(videos) ||
      videos.length <= 1 ||
      isPipMode ||
      videos.every((v) => v === null)
    ) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        {videos.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={StyleSheet.flatten([
              styles.paginationDot,
              index === activeVideoIndex && styles.paginationDotActive
            ])}
          />
        ))}
      </View>
    );
  };

  if (isInternetConnection === false && !isLoading) {
    return <ErrorScreen status="noInternet" onRetry={onRetry} />;
  }

  if (isInternetConnection && hasNoData && !isLoading) {
    return (
      <ErrorScreen
        status="error"
        showErrorButton
        OnPressRetry={onRetry}
        buttonText={t('screens.splash.text.tryAgain')}
      />
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={isGestureNavigation ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
      >
        {isLoading ? (
          <OpinionDetailSkeleton />
        ) : (
          <>
            <HeaderOpinionDetail
              video={videoData?.Video}
              story={storyData?.Post}
              handleAuthorPress={handleAuthorPress}
            />
            <CustomText
              fontFamily={fonts.notoSerif}
              size={fontSize['2xl']}
              textStyles={styles.titleText}
            >
              {storyData?.Post?.title ?? videoData?.Video?.title}
            </CustomText>

            {storyData?.Post?.excerpt ? (
              <CustomText
                fontFamily={fonts.superclarendon}
                size={fontSize.s}
                weight="L"
                textStyles={styles.excerpt}
              >
                {storyData.Post.excerpt}
              </CustomText>
            ) : null}

            <LexicalContentRenderer
              content={videoData?.Video?.content?.summary}
              story={storyData}
              currentSlug={slug}
              collection={ANALYTICS_COLLECTION.OPINION}
              page={ANALYTICS_PAGE.STORYPAGE_OPINION}
            />

            <CustomText
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              textStyles={styles.date}
            >
              {collection === 'posts'
                ? formatMexicoDateOnly(storyData?.Post?.publishedAt)
                : formatMexicoDateOnly(videoData?.Video?.publishedAt)}
              ?
            </CustomText>

            {storyData?.Post?.textToSpeech && (
              <View style={styles.excerpt}>
                <StickyAudioPlayer
                  audioDuration={storyData?.Post?.readTime}
                  miniPlayerWorking={activeJWIndex}
                  onPress={toggleJWPlayer}
                  screenName={ANALYTICS_COLLECTION.OPINION}
                  tipoContenido={`${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`}
                />
              </View>
            )}
            {storyData?.Post?.openingType === 'image' ? (
              <View style={styles.imageContainer}>
                <HeroMediaCarousel
                  story={storyData?.Post}
                  captionTextStyle={styles.captionTextStyle}
                  screenName={ANALYTICS_COLLECTION.OPINION}
                  tipoContenido={`${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`}
                  currentSlug={slug}
                  pageType="opinion"
                  contentAction={ANALYTICS_ATOMS.SWIPE_RIGHT}
                  imageStyle={styles.videoContainerPortrait}
                  images={storyData?.Post?.heroImage?.map((img: HeroImage) => ({
                    id: img?.id,
                    url: img?.sizes?.vintage?.url,
                    alt: img?.alt,
                    caption: img?.caption,
                    height: img?.height,
                    width: img?.width
                  }))}
                />
              </View>
            ) : hasVideos ? (
              <>
                <FlatList
                  data={videos}
                  renderItem={renderVideoItem}
                  keyExtractor={(item, index) => `${item?.id ?? index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="start"
                  snapToInterval={SCREEN_WIDTH}
                  decelerationRate={0.8}
                  snapToEnd={false}
                  viewabilityConfig={viewabilityConfig}
                  removeClippedSubviews
                  initialNumToRender={3}
                  maxToRenderPerBatch={3}
                  windowSize={5}
                  style={styles.videoSection}
                  bounces={false}
                  scrollEventThrottle={16}
                  disableIntervalMomentum
                  contentContainerStyle={styles.contentContainer}
                  onMomentumScrollEnd={(event) => {
                    const contentOffset = event.nativeEvent.contentOffset.x;
                    const newIndex = Math.round(contentOffset / SCREEN_WIDTH);
                    setActiveVideoIndex(newIndex);
                    handleScrollEnd(event);
                  }}
                />

                {hasVideos && renderPaginationDots()}

                {hasVideos && videos[activeVideoIndex] && (
                  <CustomText
                    size={fontSize.xxs}
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={StyleSheet.flatten([
                      styles.caption,
                      videos.length > 1 && !isPipMode && styles.extraCaptionMargin
                    ])}
                  >
                    {videos[activeVideoIndex]?.title || `Video ${activeVideoIndex + 1}`}
                  </CustomText>
                )}
              </>
            ) : (
              <CustomDivider style={styles.divider} />
            )}

            {storyData?.Post?.summary && (
              <SummaryBlock
                summaryText={storyData?.Post?.summary}
                contentContainerStyle={styles.summaryContainer}
              />
            )}

            <LexicalContentRenderer
              content={storyData?.Post?.content ?? videoData?.Video?.excerpt}
              story={storyData?.Post ?? videoData?.Video}
              currentSlug={storyData?.Post?.slug ?? videoData?.Video?.slug}
              collection={ANALYTICS_COLLECTION.OPINION}
              page={ANALYTICS_PAGE.STORYPAGE_OPINION}
              slugHistory={[storyData?.Post?.slug ?? videoData?.Video?.slug]}
            />

            {/* === More Opinions Section === */}
            {(moreOpinionList?.length > 0 || moreOpinionListLoading) && (
              <>
                <CustomText
                  size={fontSize['2xl']}
                  fontFamily={fonts.notoSerif}
                  textStyles={styles.opinionRecentTitle}
                >
                  {t('screens.opinion.screen.moreOpinions')}
                </CustomText>

                {moreOpinionListLoading ? (
                  <OpinionOtherSkeleton count={2} />
                ) : (
                  <FlatList
                    data={moreOpinionList}
                    renderItem={renderMoreOpinionItem}
                    keyExtractor={moreOpinionKeyExtractor}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.opinionsListContent}
                    scrollEnabled={false}
                    removeClippedSubviews
                    maxToRenderPerBatch={8}
                    initialNumToRender={6}
                    windowSize={5}
                  />
                )}
              </>
            )}

            {/* === Más Opiniones de (Authors) Section === */}
            {Array.isArray(authors) &&
              authors.map((author: Author) => {
                const items = (moreFromAuthorsData as CarouselData[]) ?? [];
                const authorItems = items.filter((it) =>
                  it?.authors?.some((a) => a?.id === author?.id)
                );

                if (moreFromAuthorsLoading && authorItems.length === 0) {
                  return (
                    <View key={author?.id ?? Math.random().toString()}>
                      <CustomText
                        size={fontSize['4xl']}
                        fontFamily={fonts.notoSerif}
                        textStyles={styles.opinionRecentTitle}
                      >
                        {t('screens.opinion.screen.moreOptionsOff', { name: author?.name ?? '' })}
                      </CustomText>
                      <OpinionRecentSkeleton
                        itemWidth={actuatedNormalize(190)}
                        imageSize={actuatedNormalize(80)}
                        separatorWidth={actuatedNormalize(2)}
                      />
                    </View>
                  );
                }

                if (authorItems.length === 0) return null;

                return (
                  <View key={author?.id ?? Math.random().toString()}>
                    <CustomText
                      size={fontSize['4xl']}
                      fontFamily={fonts.notoSerif}
                      textStyles={styles.opinionRecentTitle}
                    >
                      {t('screens.opinion.screen.moreOptionsOff', { name: author?.name ?? '' })}
                    </CustomText>
                    <InfoSnapCarousel
                      data={authorItems.slice(0, 6)}
                      onItemPress={(item) => {
                        const index = authorItems.findIndex(
                          (authorItem) => authorItem.id === item.id
                        );
                        handleMasOpinionesCardAnalytics(item, index, true);
                        handleNavigationToDetailPage(item?.slug ?? '', item?.collection ?? '');
                      }}
                      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                      renderItemProps={(item: CarouselData) => ({
                        id: item?.id,
                        imageUrl: item?.authors?.[0]?.profilePicture?.url ?? '',
                        subTitle: item?.title || '',
                        imageStyle: styles.imageStyle,
                        subTitleColor: resolvedTheme.carouselTextDarkTheme,
                        subTitleFontFamily: fonts.notoSerif,
                        subTitleFontWeight: 'R',
                        subTitleFontSize: fontSize.xs,
                        subTitleStyles: styles.subTitleStyles,
                        contentContainerStyle: styles.contentContainerStyle
                      })}
                    />
                  </View>
                );
              })}
          </>
        )}
      </ScrollView>

      {!isInternetConnection ? (
        <ErrorScreen
          status="noInternet"
          showRetryButton={false}
          fontSizeHeading={fontSize.xxs}
          fontSizeSubheading={fontSize.xxxs}
          containerStyles={styles.noInternetContainer}
          iconHeight={actuatedNormalizeVertical(20)}
          iconWidth={actuatedNormalize(20)}
        />
      ) : null}

      {activeJWIndex && (
        <AudioPlayerCard
          audioUrl={storyData?.Post?.textToSpeech}
          audioCardTitle={storyData?.Post?.title}
          onPress={closeAudioPlayer}
          story={storyData?.Post}
          screen_page_web_url={ANALYTICS_PAGE.STORYPAGE_OPINION}
          screenName={ANALYTICS_COLLECTION.OPINION}
          tipoContenido={`${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`}
          currentSlug={slug}
          previousSlug={storyData?.Post?.previous?.slug || videoData?.Video?.previous?.slug}
        />
      )}

      <BottomNavigationBar
        item={videoData?.Video || storyData?.Post}
        onToggleBookmark={handleBookmarkPress}
        story={storyData?.Post || videoData?.Video}
        currentSlug={storyData?.Post?.slug || videoData?.Video?.slug}
        previousSlug={storyData?.Post?.previous?.slug || videoData?.Video?.previous?.slug}
        screenName={ANALYTICS_PAGE.STORYPAGE_OPINION}
        tipoContenido={`${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`}
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

export default OpinionDetailPage;
