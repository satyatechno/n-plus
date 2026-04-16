import React, { useMemo, useEffect, useCallback, Suspense } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import themeStyles from '@src/views/pages/main/Home/LiveTV/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import { ArrowIcon, SearchIcon, ShareIcon } from '@src/assets/icons';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { ChannelItem, ProgramacionItem } from '@src/models/main/Home/LiveTV';
import useLiveTVViewModel from '@src/viewModels/main/Home/LiveTV/useLiveTVViewModel';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import LiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LiveBlogListingSkeleton';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import InactiveLiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/InactiveLiveBlogListingSkeleton';
import { BlogMedia } from '@src/views/organisms/LiveBlogCard/interface';
import { getShowsTimeRange } from '@src/utils/dateFormatter';
import LiveTVProgramListSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVProgramListSkeleton';
import { isIos } from '@src/utils/platformCheck';
import LiveTVChannelDetailSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelDetailSkeleton';
import LiveTVChannelVideoSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelVideoSkeleton';
import RNLiveStreamPlayer from '@src/views/organisms/RNVideo/RNLiveStreamPlayer';
import CustomLottieView from '@src/views/atoms/CustomLottieView';
import { Lottie } from '@src/assets/lottie';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import constants from '@src/config/constants';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

type SectionItem = {
  key: string;
  component: React.ReactElement;
};

const LiveTV = () => {
  const {
    t,
    theme,
    goBack,
    channelList,
    channelMetaData,
    selectedChannel,
    setSelectedChannel,
    onSharePress,
    activeBlog,
    hasMoreActiveBlog,
    activeBlogLoading,
    onPressLiveBlogDetails,
    inactiveBlog,
    hasMoreInactiveBlog,
    inactiveBlogLoading,
    onPressViewAllActiveLiveblogs,
    onPressViewAllInactiveLiveblogs,
    scheduleLoading,
    filterScheduleList,
    signalUrlData,
    liveBlogEnteries,
    showLiveStreaming,
    showBannerAds,
    currentTheme
  } = useLiveTVViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { shouldAutoPlay } = useSettingsStore();
  const { setShouldPause } = useLiveTVStore();

  // This useEffect resets shouldPause to false when LiveTV component mounts,
  // ensuring the RNLiveStreamPlayer can autoplay according to user settings.
  useEffect(() => {
    setShouldPause(false);
  }, [setShouldPause]);

  const renderPrograms = ({ item, index }: { item: ProgramacionItem; index: number }) => {
    const isLive = index === 0;

    return (
      <View key={index} style={{ width: isLive ? actuatedNormalize(162) : actuatedNormalize(140) }}>
        {isLive && (
          <View style={styles.transmissionView}>
            <CustomLottieView
              source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
            />
            <CustomText
              weight="Dem"
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xs}
              color={theme.tagsTextLive}
              textStyles={styles.liveText}
            >
              {t('screens.liveBlog.text.transmissionInProgress')}
            </CustomText>
          </View>
        )}

        {/* El Título siempre va estructuralmente posicionado en medio */}
        <CustomText
          weight="Dem"
          fontFamily={fonts.franklinGothicURW}
          size={fontSize.xs}
          color={theme.newsTextTitlePrincipal}
          textStyles={styles.programName}
        >
          {item?.title}
        </CustomText>

        {!isLive && (
          <>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xxxs}
              color={theme.labelsTextLabelTime}
              textStyles={styles.programTimeSlot}
            >
              {getShowsTimeRange(item?.airtime, Number(item?.duration))}
            </CustomText>

            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xxxs}
              color={theme.subtitleTextSubtitle}
              textStyles={styles.programItemDescription}
              numberOfLines={2}
              ellipsizeMode={'tail'}
              lineBreakMode={'middle'}
            >
              {item?.description}
            </CustomText>
          </>
        )}
      </View>
    );
  };

  const sectionsData = useMemo<SectionItem[]>(() => {
    const items: SectionItem[] = [
      {
        key: 'header',
        component: (
          <CustomHeader
            variant="dualVariant"
            onPress={goBack}
            headerStyle={styles.header}
            additionalIcon={<SearchIcon stroke={theme.mainBackgroundDefault} />}
            additionalButtonStyle={styles.additionalButton}
            middleIcon={
              <View style={styles.headerMiddleView}>
                <CustomLottieView
                  source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
                />
                <CustomText
                  weight="Dem"
                  size={fontSize.xs}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={styles.liveHeader}
                  color={theme.tagsTextAuthor}
                >
                  {t('screens.liveBlog.text.live')}
                </CustomText>
              </View>
            }
            middleIconStyle={styles.middleIconStyle}
          />
        )
      },
      {
        key: 'live-channels',
        component: (
          <View style={styles.subContainer}>
            <View style={styles.channelListView}>
              {channelList.map((item: ChannelItem) => (
                <Pressable
                  key={item?.channelKey}
                  style={[
                    styles.channelItem,
                    {
                      backgroundColor:
                        selectedChannel?.channelKey === item?.channelKey
                          ? theme.chipTextActive
                          : theme.mainBackgroundforIcons
                    }
                  ]}
                  onPress={() => setSelectedChannel(item)}
                >
                  <View style={styles.channelLogo}>
                    {item?.channelLogo && (
                      <item.channelLogo
                        color={
                          selectedChannel?.channelKey === item?.channelKey
                            ? theme.brandColorSecondaryLogo
                            : theme.colorSecondary600
                        }
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )
      },
      {
        key: 'live-video-player',
        component: (
          <View style={styles.videoContainer}>
            {!signalUrlData?.[selectedChannel?.channelKey ?? ''] || !showLiveStreaming ? (
              <LiveTVChannelVideoSkeleton />
            ) : (
              channelList.map((channel, index) =>
                selectedChannel?.assetKey &&
                channel.assetKey == selectedChannel?.assetKey &&
                signalUrlData?.[selectedChannel?.channelKey] ? (
                  <RNLiveStreamPlayer
                    key={index}
                    videoUrl={signalUrlData?.[selectedChannel?.channelKey ?? '']}
                    autoStart={shouldAutoPlay()}
                    blocked={channel?.blocked} // blocked player for US location only for FORO N+
                    analyticsConfig={{
                      screenName: ANALYTICS_COLLECTION.LIVE,
                      contentType: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
                      organisms: ANALYTICS_ORGANISMS.LIVE.LIVE_PRINCIPAL,
                      channel: selectedChannel?.channelName ?? selectedChannel?.channelKey,
                      videoTitle: channelMetaData.programTitle || selectedChannel?.channelName
                    }}
                  />
                ) : null
              )
            )}
          </View>
        )
      },
      {
        key: 'live-program-details',
        component: (
          <View>
            {!channelMetaData?.programTitle ? (
              <LiveTVChannelDetailSkeleton />
            ) : (
              <View style={styles.chanelDataContainer}>
                <CustomText
                  fontFamily={fonts.superclarendon}
                  size={fontSize.xxs}
                  color={theme.tagsTextCategory}
                  textStyles={styles.channelName}
                >
                  {channelMetaData.channelName}
                </CustomText>

                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize['2xl']}
                  color={theme.sectionTextTitleNormal}
                  textStyles={styles.programTitle}
                  weight="Dem"
                >
                  {channelMetaData.programTitle}
                </CustomText>

                <CustomText
                  fontFamily={fonts.notoSerif}
                  size={fontSize.s}
                  color={theme.newsTextPictureCarouselTitle}
                  textStyles={styles.programDescription}
                >
                  {(channelMetaData?.programDescription ?? '').trim()}
                </CustomText>

                <Pressable hitSlop={10} style={styles.shareButton} onPress={onSharePress}>
                  <ShareIcon color={theme.iconIconographyGenericState} />
                </Pressable>
              </View>
            )}
          </View>
        )
      },
      {
        key: 'live-program-shows',
        component: (
          <View>
            {scheduleLoading ? (
              <LiveTVProgramListSkeleton />
            ) : (
              <View style={styles.programsView}>
                <CustomText
                  weight={'Dem'}
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.s}
                  color={theme.sectionTextTitleSpecial}
                  textStyles={styles.programsText}
                >
                  {t('screens.liveBlog.text.programming')}
                </CustomText>
                <View>
                  <View style={styles.programDivider} />

                  <FlatList
                    data={filterScheduleList ?? []}
                    horizontal
                    contentContainerStyle={styles.programContainer}
                    renderItem={renderPrograms}
                    ItemSeparatorComponent={() => <View style={styles.programVerticalDivider} />}
                    showsHorizontalScrollIndicator={false}
                  />
                  <View style={styles.programBottomDivider} />
                </View>
              </View>
            )}
          </View>
        )
      },
      {
        key: 'ad-banner',
        component: <AdBannerContainer containerStyle={styles.adBannerContainer} />
      },
      {
        key: 'live-blogs',
        component: (
          <View>
            {activeBlogLoading ? (
              <LiveBlogListingSkeleton
                liveBlogCount={3}
                isShowLiveBlogHeader={true}
                blogStatus={true}
                isShowInactiveBlog={false}
                isShowLiveBlogEnteries={true}
              />
            ) : (
              (activeBlog ?? [])?.length > 0 && (
                <View>
                  <CustomText
                    size={fontSize['2xl']}
                    fontFamily={fonts.notoSerifExtraCondensed}
                    textStyles={styles.activeTitle}
                  >
                    {t('screens.liveBlog.text.liveBlogs')}
                  </CustomText>
                  <FlatList
                    data={activeBlog ?? []}
                    renderItem={({ item, index }) => (
                      <LiveBlogCard
                        key={item?.id}
                        t={t}
                        title={item?.title}
                        isLive={item?.contentPrioritization?.isActive}
                        blogEntries={index == 0 ? liveBlogEnteries || [] : []}
                        blogMediaContainerStyle={styles.blogMediaContainerStyle}
                        mediaUrl={
                          item?.featuredImage?.[0]?.url ??
                          item?.mcpId?.[0]?.value?.content?.heroImage?.url ??
                          ''
                        }
                        handleMedia={true}
                        onPress={() => onPressLiveBlogDetails(item, true, index + 1)}
                      />
                    )}
                    keyExtractor={(item) => item?.id}
                    removeClippedSubviews={true}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )
            )}

            {!activeBlogLoading && (activeBlog ?? []).length > 0 && hasMoreActiveBlog && (
              <Pressable
                style={styles.seeAllLiveNewsButton}
                onPress={onPressViewAllActiveLiveblogs}
              >
                <CustomText
                  weight={'Dem'}
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xs}
                  textStyles={styles.seeAllLiveNewsText}
                >
                  {t('screens.liveBlog.text.seeAllLiveNews')}
                </CustomText>
                <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
              </Pressable>
            )}
          </View>
        )
      },
      {
        key: 'inactive-live-blogs',
        component: (
          <View>
            {inactiveBlogLoading ? (
              <InactiveLiveBlogListingSkeleton />
            ) : (
              (inactiveBlog ?? [])?.length > 0 && (
                <View>
                  <CustomText
                    size={fontSize['2xl']}
                    fontFamily={fonts.notoSerifExtraCondensed}
                    textStyles={styles.inactiveTitle}
                  >
                    {t('screens.liveBlog.text.thisIsHowWeTellYou')}
                  </CustomText>
                  {(inactiveBlog ?? [])?.map(
                    (
                      item: {
                        id: React.Key | null | undefined;
                        title: string;
                        featuredImage: BlogMedia[];
                        mcpId: { value: { content: { heroImage: { url: string } } } }[];
                        slug: string;
                        openingType: string;
                      },
                      index: number
                    ) => (
                      <React.Fragment key={item?.id}>
                        <LiveBlogCard
                          t={t}
                          title={item?.title}
                          mediaUrl={
                            item?.featuredImage?.[0]?.url ??
                            item?.mcpId?.[0]?.value?.content?.heroImage?.url ??
                            ''
                          }
                          onPress={() => onPressLiveBlogDetails(item, false, index + 1)}
                          headingStyle={styles.inactiveBlogTitle}
                          blogMediaContainerStyle={styles.blogMediaContainerStyle}
                          inactiveBlog={inactiveBlog}
                        />
                        {index < (inactiveBlog ?? []).length - 1 && (
                          <View style={styles.inactiveDivider} />
                        )}
                      </React.Fragment>
                    )
                  )}
                </View>
              )
            )}

            {!inactiveBlogLoading && (inactiveBlog ?? []).length > 0 && hasMoreInactiveBlog && (
              <Pressable
                style={styles.seeAllInactiveBlogsButton}
                onPress={onPressViewAllInactiveLiveblogs}
              >
                <CustomText
                  weight={'Dem'}
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xs}
                  textStyles={styles.seeAllLiveNewsText}
                >
                  {t('screens.liveBlog.text.seeMoreLiveblogs')}
                </CustomText>
                <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
              </Pressable>
            )}
          </View>
        )
      }
    ];

    return items;
  }, [
    t,
    theme,
    currentTheme,
    styles,
    isIos,
    channelList,
    selectedChannel,
    signalUrlData,
    showLiveStreaming,
    channelMetaData,
    scheduleLoading,
    filterScheduleList,
    showBannerAds,
    activeBlogLoading,
    activeBlog,
    liveBlogEnteries,
    hasMoreActiveBlog,
    inactiveBlogLoading,
    inactiveBlog,
    hasMoreInactiveBlog
  ]);

  const renderSectionItem = useCallback(
    ({ item }: { item: SectionItem }) => (
      <Suspense>
        <View key={`${item.key}-${theme}`}>{item.component}</View>
      </Suspense>
    ),
    [theme]
  );

  const keyExtractor = useCallback((item: SectionItem) => item.key, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sectionsData}
        renderItem={renderSectionItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        stickyHeaderIndices={[2]}
      />
    </SafeAreaView>
  );
};

export default LiveTV;
