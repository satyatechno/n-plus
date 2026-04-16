import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { BookMark, CheckedBookMark, SearchIcon, ShareIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages/main/Videos/VideoDetailPage/styles';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import CarouselCard from '@src/views/molecules/CarouselCard';
import EpisodeDetailSkeleton from '@src/views/pages/main/Videos/EpisodeDetailPage/components/EpisodeDetailSkeleton';
import RelatedVideoSkeletonLoader from '@src/views/pages/main/Videos/Programs/components/RelatedVideoSkeletonLoader';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomToast from '@src/views/molecules/CustomToast';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import useVideoDetailPageViewModel from '@src/viewModels/main/Videos/VideoDetailPage/useVideoDetailPage';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import LiveTVChannelVideoSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelVideoSkeleton';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

const VideoDetailPage = () => {
  const {
    goBack,
    theme,
    data,
    publishedAt,
    handleCardPress,
    isInternetConnection,
    videoLoading,
    refreshList,
    refreshing,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    onSharePress,
    relatedVideoLoading,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleTimeUpdate,
    timeWatched,
    bookmarkState,
    moreOptionsVideos,
    moreOptionsLoading
  } = useVideoDetailPageViewModel();

  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const { shouldAutoPlay } = useSettingsStore();
  const isLoading = videoLoading && relatedVideoLoading;
  const isMainBookmarked = bookmarkState[data?.Video?.id ?? ''] ?? false;

  // Generate Ad Tag URL for IMA SDK - uses mcpid from API or extracts from videoUrl
  const adTagUrl = useMemo(() => {
    const mcpId = extractMcpIdFromVideoUrl(data?.Video?.videoUrl ?? '');

    if (!mcpId) {
      return undefined;
    }

    return generateVODAdTagUrl({
      mcpId,
      programName: data?.Video?.title ?? '',
      site: 'nmas',
      pageType: 'EpisodePage'
    });
  }, [data?.Video?.videoUrl, data?.Video?.title]);

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={goBack}
          additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
          variant="dualVariant"
          headerStyle={styles.headerStyle}
          additionalButtonStyle={styles.searchButton}
        />
        {videoLoading || relatedVideoLoading ? (
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <EpisodeDetailSkeleton />
          </ScrollView>
        ) : !isInternetConnection && !isLoading ? (
          <ErrorScreen
            status="noInternet"
            onRetry={refreshList}
            contentContainerStyle={styles.errorContainer}
          />
        ) : (
          <ErrorScreen
            status="error"
            showErrorButton={true}
            OnPressRetry={refreshList}
            buttonText={t('screens.splash.text.tryAgain')}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        variant="dualVariant"
        headerStyle={styles.headerStyle}
        additionalButtonStyle={styles.searchButton}
      />
      <>
        {videoLoading ? (
          <LiveTVChannelVideoSkeleton />
        ) : (
          <RNVideoPlayer
            videoUrl={data?.Video?.videoUrl ?? ''}
            thumbnail={data?.Video?.content?.heroImage?.url ?? ''}
            onTimeUpdate={handleTimeUpdate}
            initialSeekTime={timeWatched ?? 0}
            autoStart={shouldAutoPlay()}
            videoType="vod"
            adTagUrl={adTagUrl}
            adLanguage="es"
            has9_16={data?.Video?.aspectRatio === '9/16'}
            analyticsContentType={`${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`}
            analyticsScreenName={ANALYTICS_COLLECTION.VIDEOS}
            analyticsOrganism={ANALYTICS_ORGANISMS.VIDEOS.HERO}
            analyticsIdPage={data?.Video?.id}
            analyticScreenPageWebUrl={data?.Video?.slug}
            analyticsPublication={data?.Video?.publishedAt}
            analyticsDuration={data?.Video?.videoDuration}
            analyticsTags={data?.Video?.topics
              ?.map((topic: { title?: string }) => topic?.title)
              ?.join(',')}
            analyticVideoType={data?.Video?.content?.videoType}
            analyticsProduction={`${data?.Video?.channel?.title}_${data?.Video?.production?.title}`}
            data={data}
          />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshList} />}
        >
          <CustomText
            fontFamily={fonts.notoSerifExtraCondensed}
            size={fontSize['xl']}
            weight="B"
            textStyles={styles.title}
          >
            {data?.Video?.title}
          </CustomText>

          <View style={styles.summaryContainer}>
            <LexicalContentRenderer content={data?.Video?.content?.summary} />
          </View>

          <View style={styles.headerContainer}>
            <CustomText
              weight="Med"
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              textStyles={styles.date}
            >
              {typeof publishedAt === 'string'
                ? publishedAt
                : publishedAt
                  ? `${publishedAt.date} ${publishedAt.time}`
                  : ''}
            </CustomText>

            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={onSharePress}>
                <ShareIcon color={theme.iconIconographyGenericState} />
              </Pressable>

              <Pressable
                style={styles.headerButton}
                onPress={() => handleBookmarkPress(data?.Video?.id)}
              >
                {isMainBookmarked ? (
                  <CheckedBookMark color={theme.iconIconographyGenericState} />
                ) : (
                  <BookMark color={theme.iconIconographyGenericState} />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.separator} />

          {moreOptionsLoading ? (
            <RelatedVideoSkeletonLoader arrayList={[1, 2, 3, 4, 5, 6, 7]} showHeading={true} />
          ) : (
            moreOptionsVideos?.length > 0 && (
              <>
                <CustomText
                  size={fontSize['4xl']}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.relatedVideoTitle}
                >
                  {t('screens.videos.text.moreVideos')}
                </CustomText>

                <FlatList
                  data={moreOptionsVideos ?? []}
                  keyExtractor={(item, index) => `${item?.id}-${index}`}
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                    <CarouselCard
                      type="videos"
                      onPress={() => handleCardPress(item?.slug, index)}
                      title={item?.title}
                      topic={item?.category?.title ?? item?.topics?.[0]?.title ?? ''}
                      minutesAgo={formatDurationToMinutes(item?.videoDuration)}
                      imageUrl={item?.content?.heroImage?.sizes?.square?.url ?? ''}
                      headingStyles={styles.verticalHeading}
                      contentContainerStyle={styles.verticalVideoContainer}
                      imageStyle={styles.verticalImageStyle}
                      showBookmark={true}
                      subheadingStyles={styles.verticalSubheading}
                      onBookmarkPress={() => handleBookmarkPress(item?.id)}
                      isBookmarked={bookmarkState[item?.id] ?? false}
                    />
                  )}
                  contentContainerStyle={styles.relatedVideosContainer}
                  ItemSeparatorComponent={() => <View style={styles.divider} />}
                />
              </>
            )
          )}
        </ScrollView>
      </>

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
    </SafeAreaView>
  );
};

export default VideoDetailPage;
