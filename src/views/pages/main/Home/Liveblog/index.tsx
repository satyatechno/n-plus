import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import Animated from 'react-native-reanimated';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { fonts } from '@src/config/fonts';
import { fontSize, spacing } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/main/Home/Liveblog/styles';
import { useLiveBlogViewModel } from '@src/viewModels/main/Home/LiveBlog/useLiveBlogViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomText from '@src/views/atoms/CustomText';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import CategoryHeader from '@src/views/molecules/CategoryHeader';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import RecommendedSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/RecommendationSkeletonLoader';
import { ArrowCircleUpIcon, ArrowIcon, NoNotificationIcon } from '@src/assets/icons';
import { useGestureNavigation } from '@src/hooks/useGestureNavigation';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import SummaryBlock from '@src/views/templates/SummaryBlock';
import { VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import ProgressBarCarousel from '@src/views/organisms/ProgressBarCarousel';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import LiveBlogSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LiveBlogSkeletonLoader';
import BellIcon from '@src/assets/icons/BellIcon';
import CustomModal from '@src/views/organisms/CustomModal';
import NotificationIcon from '@src/assets/icons/Notification';
import LiveBlogEntryRenderer from '@src/views/organisms/LiveBlogEntriesRenderer';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { NewsItem } from '@src/models/main/Home/StoryPage/StoryPage';
import LiveBlogEnteriesSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LiveBlogEnteriesSkeleton';
import BottomNavigationBar from '@src/views/organisms/BottomNavigationBar';
import constants from '@src/config/constants';
import EmbedBlock from '@src/views/organisms/Lexical/blocks/EmbedBlock';
import LiveTVChannelVideoSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelVideoSkeleton';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomLottieView from '@src/views/atoms/CustomLottieView';
import { Lottie } from '@src/assets/lottie';
import LiveblogEntryDetailModal from '@src/views/templates/main/LiveblogEntryDetailModal';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { VODSettingsBottomSheet } from '@src/views/organisms/RNVideo/components';
import { VODSettingsBottomSheetProps } from '@src/views/organisms/RNVideo/types';
import RNLiveStreamPlayer from '@src/views/organisms/RNVideo/RNLiveStreamPlayer';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Liveblog = () => {
  const {
    theme,
    slug,
    liveBlog,
    liveBlogUpdatedAt,
    liveBlogLoading,
    liveBlogError,
    headerVisible,
    headerLoading,
    handleCategoryPress,
    recommendedStoriesData,
    recommendedStoriesLoading,
    onToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    onHistoryRecommendationPress,
    videos,
    persistPlaybackTime,
    activeVideoIndex,
    setActiveVideoIndex,
    modalVisible,
    onClosePress,
    onCancelPress,
    onConfirmPress,
    onPressViewAll,
    liveBlogEnteries,
    liveBlogStatus,
    liveBlogPublishDate,
    activeLiveBlogStatus,
    activeLiveVideoUrl,
    scrollViewRef,
    setEntriesY,
    bluePillVisible,
    bluePillUpdateCount,
    onBluePillPress,
    setLiveTvY,
    redPillVisible,
    onRedPillPress,
    handleScroll,
    handleRetry,
    internetLoader,
    internetFail,
    isInternetConnection,
    categoriesList,
    liveBlogTimeDiff,
    filteredLiveBlogFeatureImageData,
    onEnteryShareButtonPress,
    bluePillAnimatedStyle,
    redPillAnimatedStyle,
    refreshing,
    onRefresh,
    bluePillTopSpace,
    entryMoreLoader,
    entryHasNextpage,
    onSeeMorePress,
    liveBlogAllEntriesLoading,
    isNotificationEnable,
    youtubeLiveVideoUrl,
    isLiveBlogReady,
    signalUrl,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleBookmarkPress,
    currentTheme,
    entryId,
    isShowLiveBlogEntryDetailModal,
    setIsShowLiveBlogEntryDetailModal,
    showWebView,
    handleWebViewClose,
    webUrl,
    getPlaybackTime,
    showNotificationModal
  } = useLiveBlogViewModel();

  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const [settingsProps, setSettingsProps] = React.useState<VODSettingsBottomSheetProps | null>(
    null
  );
  const flatListRef = useRef<FlatList<VideoItem>>(null);
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

  const { shouldAutoPlay } = useSettingsStore();

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

  const hasVideos = useMemo(
    () =>
      liveBlog?.openingType === 'video' &&
      Array.isArray(videos) &&
      videos.length > 0 &&
      videos.some(Boolean),
    [liveBlog?.openingType, videos]
  );

  const hasMixedAspectRatios = useMemo(() => {
    if (!videos || videos.length === 0) return false;

    const has9_16 = videos.some((video: VideoItem) => video?.aspectRatio === '9/16');
    const has16_9 = videos.some(
      (video: VideoItem) => video?.aspectRatio !== '9/16' && video?.aspectRatio
    );

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
                has9_16={item?.aspectRatio === '9/16'}
                initialSeekTime={getPlaybackTime(item.id)}
                autoStart={shouldAutoPlay()}
                videoType="storyPageVideoMedia"
                onTimeUpdate={persistPlaybackTime}
                onSettingsRequest={setSettingsProps}
                analyticsContentType={`${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`}
                analyticsScreenName={ANALYTICS_COLLECTION.LIVEBLOGS}
                analyticsOrganism={ANALYTICS_ORGANISMS.STORY_PAGE.BODY}
                data={{ Video: { title: item.title } }}
                analyticsIdPage={liveBlog?.id}
                analyticScreenPageWebUrl={liveBlog?.slug}
                analyticsPublication={liveBlog?.publishedAt}
                analyticsDuration={videos[activeVideoIndex]?.videoDuration}
                analyticsTags={liveBlog?.topics}
                analyticVideoType={videos?.[activeVideoIndex]?.videoType}
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
      }
    },
    [activeVideoIndex, videos.length, setActiveVideoIndex]
  );

  if (liveBlogLoading && !refreshing) {
    return <LiveBlogSkeleton />;
  }

  const bluePill = () => (
    <AnimatedPressable
      style={[
        styles.bluePillContainer,
        {
          top: actuatedNormalizeVertical(bluePillTopSpace)
        },
        bluePillAnimatedStyle
      ]}
      onPress={() => onBluePillPress()}
    >
      <ArrowCircleUpIcon color={theme.iconIconographyActiveState} />
      <CustomText
        weight={'M'}
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.xxs}
        color={theme.primaryCTATextDefault}
        textStyles={styles.pillText}
      >
        {`${bluePillUpdateCount} `}
        {bluePillUpdateCount === 1
          ? t('screens.liveBlog.text.newUpdate')
          : t('screens.liveBlog.text.newUpdates')}
      </CustomText>
    </AnimatedPressable>
  );

  const redPill = () => (
    <AnimatedPressable
      style={[
        styles.redPillContainer,
        {
          top: actuatedNormalizeVertical(bluePillTopSpace)
        },
        redPillAnimatedStyle
      ]}
      onPress={() => onRedPillPress()}
    >
      <CustomText
        weight={'M'}
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.xxs}
        color={theme.primaryCTATextDefault}
        textStyles={styles.pillText}
      >
        {t('screens.liveBlog.text.liveSignal')}
      </CustomText>
    </AnimatedPressable>
  );

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (liveBlogError instanceof ApolloError || !liveBlog) {
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
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.bodyTextOther}
          />
        }
      >
        {headerVisible && (
          <View style={styles.headerContainer}>
            {headerLoading && !refreshing ? (
              <CategoryHeaderSkeleton />
            ) : (
              <CategoryHeader
                useHeaderData={false}
                categories={categoriesList}
                onCategoryPress={handleCategoryPress}
              />
            )}
          </View>
        )}
        {liveBlogStatus ? (
          <View style={styles.liveBlogStatusContainer}>
            <View style={styles.flexBlock}>
              <View style={styles.liveBlogTextBlock}>
                <CustomLottieView
                  source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
                />
                <CustomText
                  weight="Dem"
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xl}
                  color={theme.tagsTextLive}
                  textStyles={styles.liveText}
                >
                  {t('screens.liveBlog.title')}
                </CustomText>
              </View>

              <CustomText
                fontFamily={fonts.superclarendon}
                size={fontSize.xxs}
                color={theme.tagsTextLive}
                textStyles={styles.liveBlogStatusText}
              >
                {liveBlogTimeDiff}
              </CustomText>
            </View>
          </View>
        ) : (
          <View style={styles.blogStatusContainer}>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
              size={fontSize.xxs}
              color={theme.bodyTextOther}
              textStyles={styles.endOfCoverageText}
            >
              {t('screens.liveBlog.text.endOfCoverage')}
            </CustomText>

            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
              size={fontSize.xxs}
              color={theme.bodyTextOther}
              textStyles={styles.endOfCoverageText}
            >
              {typeof liveBlogUpdatedAt === 'string' ? liveBlogUpdatedAt : ''}
            </CustomText>
          </View>
        )}

        <CustomHeading
          headingText={typeof liveBlog?.title === 'string' ? liveBlog.title : ''}
          headingFont={fonts.notoSerifExtraCondensed}
          headingWeight="B"
          headingSize={fontSize['xl']}
          headingStyles={StyleSheet.flatten([styles.heading, styles.contentContainer])}
          headingColor={theme.newsTextTitlePrincipal}
          subHeadingText={typeof liveBlog?.extract === 'string' ? liveBlog.extract : ''}
          subHeadingSize={fontSize.s}
          subHeadingFont={fonts.notoSerif}
          subHeadingWeight="R"
          subHeadingColor={theme.carouselTextOther}
          subHeadingStyles={StyleSheet.flatten([styles.subHeading, styles.contentContainer])}
        />

        <CustomText
          weight={'Med'}
          fontFamily={fonts.franklinGothicURW}
          size={fontSize.xxs}
          color={theme.labelsTextLabelPlay}
          textStyles={StyleSheet.flatten([styles.timeStampLabel, styles.contentContainer])}
        >
          {typeof liveBlogPublishDate === 'string' ? liveBlogPublishDate : ''}
        </CustomText>

        <View
          onLayout={(event) => setLiveTvY(event.nativeEvent.layout.y)}
          style={{
            marginTop: spacing.xxs
          }}
        >
          {activeLiveBlogStatus && activeLiveVideoUrl ? (
            youtubeLiveVideoUrl ? (
              <EmbedBlock url={youtubeLiveVideoUrl as string} provider={'youtube'} />
            ) : !signalUrl ? (
              <LiveTVChannelVideoSkeleton />
            ) : (
              <RNLiveStreamPlayer
                videoUrl={signalUrl ?? ''}
                autoStart={shouldAutoPlay()}
                analyticsConfig={{
                  screenName: ANALYTICS_COLLECTION.LIVE_BLOGS,
                  contentType: `${ANALYTICS_COLLECTION.LIVE_BLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`,
                  organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.BODY
                }}
              />
            )
          ) : (
            <>
              {hasVideos && (
                <FlatList
                  ref={flatListRef}
                  data={videos}
                  renderItem={renderVideoItem}
                  keyExtractor={(item, index) => `${item?.id}-${index}`}
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

              {liveBlog?.openingType === 'image' && Array.isArray(liveBlog?.featuredImage) && (
                <ProgressBarCarousel
                  images={filteredLiveBlogFeatureImageData}
                  contentContainerStyle={styles.mediaImageView}
                  captionTextStyle={StyleSheet.flatten([styles.contentContainer])}
                />
              )}
            </>
          )}
        </View>

        {liveBlog?.showContext && typeof liveBlog?.context === 'string' && liveBlog?.context && (
          <SummaryBlock
            title={t('screens.liveBlog.text.context')}
            summaryText={liveBlog.context}
            contentContainerStyle={styles.contentContainer}
          />
        )}

        <View
          style={styles.entryEmptyContainer}
          onLayout={(event) => setEntriesY(event.nativeEvent.layout.y)}
        >
          {liveBlogAllEntriesLoading && (liveBlogEnteries ?? [])?.length === 0 && !refreshing ? (
            <LiveBlogEnteriesSkeleton />
          ) : (liveBlogEnteries ?? []).length > 0 ? (
            <View style={StyleSheet.flatten([styles.entriesContainer])}>
              <FlatList
                data={liveBlogEnteries ?? []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item: entry, index }) => (
                  <LiveBlogEntryRenderer
                    timestamp={entry.createdAt}
                    content={entry.content}
                    title={entry.title}
                    isFirst={index === 0}
                    isLast={index === (liveBlogEnteries?.length ?? 0) - 1}
                    liveBlogStatus={liveBlogStatus}
                    onShareButtonPress={() => onEnteryShareButtonPress(entry, index + 1)}
                    contentContainerStyle={styles.contentContainer}
                  />
                )}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() =>
                  entryHasNextpage ? (
                    <Pressable
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={onSeeMorePress}
                    >
                      {entryMoreLoader ? (
                        <LiveBlogEnteriesSkeleton />
                      ) : (
                        <CustomText
                          weight={'Dem'}
                          fontFamily={fonts.franklinGothicURW}
                          size={fontSize.xs}
                          color={theme.bodyTextOther}
                          textStyles={styles.seeMoreText}
                        >
                          {t('screens.liveBlog.text.seeMore')}
                        </CustomText>
                      )}
                    </Pressable>
                  ) : null
                }
              />
            </View>
          ) : null}
        </View>

        {recommendedStoriesLoading && !refreshing ? (
          <RecommendedSkeleton contentContainerStyle={styles.contentContainer} />
        ) : recommendedStoriesData?.GetRecommendedStories?.data?.length > 0 ? (
          <>
            <CustomText
              size={fontSize['2xl']}
              fontFamily={fonts.notoSerifExtraCondensed}
              textStyles={StyleSheet.flatten([
                styles.recommendedStoriesTitle,
                styles.contentContainer
              ])}
            >
              {t('screens.storyPage.author.recommendedStories')}
            </CustomText>
            <View style={styles.contentContainer}>
              {(recommendedStoriesData?.GetRecommendedStories?.data || []).map(
                (item: NewsItem, index: number) => (
                  <BookmarkCard
                    key={index.toString()}
                    category={
                      item?.topics?.[0]?.title ??
                      item?.category?.title ??
                      t('screens.storyPage.relatedStoryBlock.general')
                    }
                    heading={typeof item?.title === 'string' ? item?.title : ''}
                    categoryTextStyles={{ marginBottom: spacing.xxxs }}
                    subHeading={`${typeof item?.readTime === 'string' ? item?.readTime : '7'} min`}
                    isBookmarkChecked={item.isBookmarked}
                    id={item?.id ?? ''}
                    onPressingBookmark={() => handleBookmarkPress(item, index)}
                    onPress={() => onHistoryRecommendationPress(item, index)}
                  />
                )
              )}
            </View>
          </>
        ) : null}

        <Pressable
          style={StyleSheet.flatten([styles.seeAllLiveNewsButton, styles.contentContainer])}
          onPress={onPressViewAll}
        >
          <CustomText
            weight={'Dem'}
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.xs}
            textStyles={styles.seeAllLiveNewsText}
          >
            {t('screens.liveBlog.text.seeAllLiveNews')}
          </CustomText>

          <ArrowIcon stroke={theme.greyButtonSecondaryOutline} strokeWidth={0.5} />
        </Pressable>
      </ScrollView>

      <BottomNavigationBar
        item={liveBlog}
        onToggleBookmark={onToggleBookmark}
        story={liveBlog}
        currentSlug={slug}
        screenName={ANALYTICS_COLLECTION.LIVEBLOGS}
        tipoContenido={`${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`}
      />

      <CustomModal
        visible={modalVisible}
        modalTitle={
          isNotificationEnable
            ? t('screens.liveBlog.text.notificationsStoppedMessage')
            : t('screens.liveBlog.text.notificationsMessage')
        }
        cancelButtonText={
          isNotificationEnable
            ? t('screens.liveBlog.text.notifyMe')
            : t('screens.liveBlog.text.noThanks')
        }
        confirmButtonText={
          isNotificationEnable
            ? t('screens.liveBlog.text.deactivate')
            : t('screens.liveBlog.text.notifyMe')
        }
        onCancelPress={onCancelPress}
        onConfirmPress={onConfirmPress}
        onOutsidePress={onClosePress}
        onRequestClose={onClosePress}
        iconContainerStyle={styles.notificationIconContainer}
        icon={
          isNotificationEnable ? (
            <NoNotificationIcon
              height={actuatedNormalizeVertical(spacing['2xl'])}
              width={actuatedNormalize(spacing['2xl'])}
              color={theme.dividerBlack}
              backgrounColor={theme.mainBackgroundDefault}
            />
          ) : (
            <NotificationIcon
              height={actuatedNormalizeVertical(spacing.l)}
              width={actuatedNormalize(spacing.l)}
              color={theme.dividerBlack}
            />
          )
        }
      />

      {redPillVisible ? redPill() : bluePillVisible ? bluePill() : null}

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

      {isLiveBlogReady && (
        <SafeAreaView style={styles.notificationStickyContainer}>
          <Pressable
            style={[
              styles.notificationContainer,
              {
                backgroundColor: isNotificationEnable
                  ? theme.bodyTextMain
                  : theme.brandColorSecondaryLogo
              }
            ]}
            onPress={showNotificationModal}
          >
            <BellIcon
              color={isNotificationEnable ? theme.brandColorSecondaryLogo : theme.bodyTextMain}
            />
          </Pressable>
        </SafeAreaView>
      )}

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

      <LiveblogEntryDetailModal
        entryId={entryId}
        visible={isShowLiveBlogEntryDetailModal}
        onClose={() => setIsShowLiveBlogEntryDetailModal(false)}
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

export default Liveblog;
