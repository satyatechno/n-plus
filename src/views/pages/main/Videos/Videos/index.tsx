import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Modal,
  Animated,
  StyleSheet
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '@src/hooks/useTheme';
import { SearchIcon } from '@src/assets/icons';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/main/Videos/Videos/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';
import useVideosViewModel from '@src/viewModels/main/Videos/Videos/useVideosViewModel';
import TopicChips from '@src/views/organisms/TopicChips';

import { fonts } from '@src/config/fonts';
import {
  ExclusiveItem,
  PorElPlanetaItem,
  ContinueWatchingVideo,
  ProgramasItem
} from '@src/models/main/Videos/Videos';
import { type HorizontalInfoItem } from '@src/views/organisms/HorizontalInfoList';
import CustomText from '@src/views/atoms/CustomText';
import CarouselCard from '@src/views/molecules/CarouselCard';
import CustomDivider from '@src/views/atoms/CustomDivider';
import VideoOptionsModal from '@src/views/organisms/VideoOptionsModal';
import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import LatestNewsSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LatestNewsSkeleton';
import CustomToast from '@src/views/molecules/CustomToast';
import VideosSkeleton from '@src/views/pages/main/Videos/Videos/components/VideosSkeleton';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import ReelModeScreen from '@src/views/organisms/ReelModeModal';
import { FallbackImage, NPlusFocusImage } from '@src/assets/images';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CustomLoader from '@src/views/molecules/CustomLoader';
import CountdownTimerWidget from '@src/views/organisms/Widgets/CountdownTimerWidget';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import WeatherWidget from '@src/views/organisms/Widgets/WeatherWidget';
import ExchangeWidget from '@src/views/organisms/Widgets/ExchangeWidget';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import { ProgramItem } from '@src/models/main/Videos/Programs';
import LandingPageCarouselSection from '@src/views/pages/main/Videos/Videos/components/LandingPageCarouselSection';
import VideoListItem from '@src/views/pages/main/Videos/Videos/components/VideoListItem';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import CustomImage from '@src/views/atoms/CustomImage';

const Videos = ({ navigation }: { navigation: unknown }) => {
  const {
    onExclusivePress,
    isReelMode,
    setReelMode,
    selectedExclusiveIndex,
    handleVideoPress,
    handleMenuPress,
    nPlusVideoData,
    isModalVisible,
    selectedVideo,
    handleCloseModal,
    handleSharePress,
    handleRemovePress,
    handleBookmarkPress,
    chipsTopic,
    onPorElPlanetaCardPress,
    onSeeAllPlaneteDocumenteriesPress,
    onSeeAllProgramsPress,
    exclusiveNplusData,
    programasNPlusData,
    onProgramsTogglePress,
    onProgramsCardPress,
    porElPlaneteData,
    exclusiveNplusLoading,
    programasNPlusLoading,
    onRetry,
    refreshLoader,
    isInternetConnection,
    videoHeroCarouselData,
    videoHeroCarouselLoading,
    ultimaNoticiasData,
    ultimaNoticiasLoading,
    continueVideoData,
    toastMessage,
    toastType,
    setToastMessage,
    handleLatestNewsPress,
    onNPlusVideoCardPress,
    nPlusFocusLoading,
    porElPlaneteDocumentariesLoading,
    nPlusVideoSectionLoading,
    onNPlusFocusCardPress,
    onSeeAllNPlusFocusDocumenteriesPress,
    nPlusFocusDocs,
    isToggleBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showWebView,
    setShowWebView,
    webUrl,
    loadMore,
    continueVideoDataLoading,
    widgetRefetch,
    showBannerAds,
    weatherWidgetRefetch,
    timerRefetch,
    handleExclusivePressAnalytics,
    handleLatestNewsPressAnalytics,
    handlePrincipalVideoAnalytics,
    handleSecondaryVideoAnalytics,
    handleNPlusCarouselPressAnalytics,
    handleNPlusCarouselBookmarkAnalytics,
    handleProgramsChannelPillAnalytics,
    handleProgramsCarouselAnalytics,
    handleProgramsCtaAnalytics,
    handleContinueWatchingCardAnalytics,
    handleContinueWatchingBookmarkAnalytics,
    handleNPlusFocusHeroAnalytics,
    handleNPlusFocusCarouselAnalytics,
    handleNPlusFocusCtaAnalytics,
    handlePorElPlanetaCarouselAnalytics,
    handlePorElPlanetaCtaAnalytics,
    handleSearchAnalytics
  } = useVideosViewModel();

  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { height: windowHeight } = Dimensions.get('window');
  const { height: physicalScreenHeight } = Dimensions.get('screen');
  const screenHeight = physicalScreenHeight || windowHeight;
  const programasListRef = useRef<FlatList>(null);

  // Delay rendering of below-the-fold sections for smoother first ui layout
  const [showBelowFoldSections, setShowBelowFoldSections] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBelowFoldSections(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  type SectionItem = {
    key: string;
    component: React.ReactElement;
  };

  const hasData =
    exclusiveNplusData?.ExclusiveNPlusVideos?.videos?.length > 0 ||
    programasNPlusData?.ProgramasNPlus?.length > 0 ||
    porElPlaneteData?.length > 0 ||
    videoHeroCarouselData?.length > 0 ||
    ultimaNoticiasData?.UltimasNoticias?.length > 0 ||
    nPlusVideoData?.hero ||
    continueVideoData?.getUserContinueVideos?.videos?.length > 0;

  const loading =
    exclusiveNplusLoading ||
    programasNPlusLoading ||
    videoHeroCarouselLoading ||
    ultimaNoticiasLoading ||
    nPlusVideoSectionLoading ||
    porElPlaneteDocumentariesLoading ||
    nPlusFocusLoading ||
    continueVideoDataLoading;

  const [activeExclusiveIndex, setActiveExclusiveIndex] = useState<number>(
    selectedExclusiveIndex ?? 0
  );

  useEffect(() => {
    setActiveExclusiveIndex(selectedExclusiveIndex ?? 0);
  }, [selectedExclusiveIndex]);

  useEffect(() => {
    if (isReelMode) {
      StatusBar.setHidden(true, 'fade');
      StatusBar.setTranslucent?.(true);
      StatusBar.setBackgroundColor?.('transparent', true);
    } else {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setTranslucent?.(false);
    }
    return () => {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setTranslucent?.(false);
    };
  }, [isReelMode]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / screenHeight);
      setActiveExclusiveIndex(idx);
    },
    [screenHeight]
  );

  const exclusiveList = exclusiveNplusData?.ExclusiveNPlusVideos?.videos ?? [];

  const slideAnim = useRef(new Animated.Value(1000)).current;

  const renderFooter = useCallback(() => {
    if (!continueVideoDataLoading) return null;
    return <CustomLoader />;
  }, [continueVideoDataLoading]);

  const sectionsData = useMemo<SectionItem[]>(() => {
    if (!isInternetConnection && !hasData) {
      return [
        {
          key: 'error-no-internet',
          component: (
            <ErrorScreen
              status="noInternet"
              onRetry={onRetry}
              containerStyles={styles.errorContainer}
            />
          )
        }
      ];
    }

    if (!loading && !hasData) {
      return [
        {
          key: 'error-no-data',
          component: (
            <ErrorScreen
              status="error"
              showErrorButton={true}
              OnPressRetry={onRetry}
              buttonText={t('screens.splash.text.tryAgain')}
              containerStyles={styles.errorContainer}
            />
          )
        }
      ];
    }

    // Above-the-fold sections - render immediately
    const items: SectionItem[] = [
      {
        key: 'exchange-widget',
        component: (
          <ExchangeWidget
            page="videos"
            registerRefetch={(fn) => {
              widgetRefetch.current = async () => {
                await fn();
              };
            }}
            sectionGapStyle={styles.sectionGap}
          />
        )
      },
      {
        key: 'countdown-widget',
        component: (
          <CountdownTimerWidget
            page="videos"
            registerRefetch={(fn) => {
              timerRefetch.current = async () => {
                await fn();
              };
            }}
            sectionGapStyle={styles.sectionGap}
          />
        )
      },
      {
        key: 'weather-widget',
        component: (
          <WeatherWidget
            page="videos"
            registerRefetch={(fn) => {
              weatherWidgetRefetch.current = async () => {
                await fn();
              };
            }}
            sectionGapStyle={styles.sectionGap}
          />
        )
      },
      {
        key: 'hero-carousel',
        component: (
          <LandingPageCarouselSection
            data={videoHeroCarouselData}
            loading={videoHeroCarouselLoading}
          />
        )
      }
    ];

    // Below-the-fold sections - delay rendering for smoother first ui layout
    if (showBelowFoldSections) {
      if (exclusiveNplusLoading) {
        items.push({
          key: 'exclusive-skeleton',
          component: (
            <View style={styles.sectionGap}>
              <HorizontalInfoListSkeleton itemCount={5} showSeeAll={false} />
            </View>
          )
        });
      } else if (exclusiveNplusData?.ExclusiveNPlusVideos?.videos?.length > 0) {
        items.push({
          key: 'exclusive-list',
          component: (
            <View style={styles.sectionGap}>
              <SnapHorizontalList
                headingUpperCase={false}
                heading={exclusiveNplusData?.ExclusiveNPlusVideos?.title}
                headingFontFamily={fonts.notoSerifExtraCondensed}
                headingFontSize={fontSize['2xl']}
                headingFontWeight="R"
                titleFontSize={fontSize.s}
                titleFontFamily={fonts.notoSerif}
                titleFontWeight="R"
                titleStyles={{ ...styles.titleStyles }}
                data={
                  exclusiveNplusData?.ExclusiveNPlusVideos?.videos?.map((item: ExclusiveItem) => ({
                    ...item,
                    specialImage: { url: item.specialImage }
                  })) || []
                }
                onPress={(item, index) => {
                  const exclusiveItem = item as unknown as ExclusiveItem;
                  handleExclusivePressAnalytics(exclusiveItem, index ?? 0);
                  onExclusivePress(exclusiveItem);
                }}
                headingStyles={styles.exclusiveHeadingStyles}
                getImageUrl={(item: HorizontalInfoItem) => {
                  const exclusiveItem = item as unknown as ExclusiveItem;
                  return exclusiveItem?.heroImage?.sizes?.portrait?.url ?? '';
                }}
                aspectRatio={9 / 16}
              />
            </View>
          )
        });
      }

      if (ultimaNoticiasLoading) {
        items.push({
          key: 'latest-news-skeleton',
          component: (
            <View style={styles.sectionGap}>
              <LatestNewsSkeleton />
            </View>
          )
        });
      } else if (ultimaNoticiasData?.UltimasNoticias?.length > 0) {
        items.push({
          key: 'latest-news',
          component: (
            <View style={styles.sectionGap}>
              <CustomText
                size={fontSize['2xl']}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.latestNewsTitle}
              >
                {t('screens.storyPage.latestNews.title')}
              </CustomText>
              <SnapCarousel
                data={ultimaNoticiasData.UltimasNoticias}
                onCardPress={(item, index) => {
                  handleLatestNewsPressAnalytics(item, index);
                  handleLatestNewsPress({ slug: item?.slug ?? '' });
                }}
                onBookmarkPress={(item) => handleBookmarkPress(item?.id)}
                elementType={'videos'}
                imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                headingStyles={styles.carouselTagStyle}
                subHeadingStyles={styles.carouselTitleStyle}
              />
            </View>
          )
        });
      }

      if (nPlusVideoSectionLoading) {
        items.push({
          key: 'nplus-video-skeleton',
          component: (
            <View style={styles.sectionGap}>
              <VideosSkeleton />
            </View>
          )
        });
      } else if (nPlusVideoData?.hero) {
        items.push({
          key: 'nplus-video',
          component: (
            <View style={styles.sectionGap}>
              <CustomText
                size={fontSize['2xl']}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.nPlusVideoTitle}
              >
                {nPlusVideoData?.title}
              </CustomText>
              <CarouselCard
                type="videos"
                topic={nPlusVideoData?.hero?.category?.title}
                title={nPlusVideoData?.hero?.title}
                minutesAgo={formatDurationToMinutes(nPlusVideoData?.hero?.videoDuration)}
                imageUrl={nPlusVideoData?.hero?.heroImage?.url ?? ''}
                isBookmarked={nPlusVideoData?.hero?.isBookmarked}
                contentContainerStyle={styles.fullImageContainer}
                imageStyle={styles.fullNplusPrimaryImageContainer}
                titleFont={fonts.notoSerif}
                titleSize={fontSize.s}
                titleWeight="R"
                titleColor={theme.sectionTextTitleNormal}
                subheadingStyles={styles.nplusVideoHeroTitle}
                onPress={() => {
                  handlePrincipalVideoAnalytics(ANALYTICS_ATOMS.TAP_IN_TEXT);
                  onNPlusVideoCardPress(nPlusVideoData?.hero?.slug);
                }}
                onBookmarkPress={() => {
                  const action = nPlusVideoData?.hero?.isBookmarked
                    ? ANALYTICS_ATOMS.UNBOOKMARK
                    : ANALYTICS_ATOMS.BOOKMARK;
                  handlePrincipalVideoAnalytics(action);
                  handleBookmarkPress(nPlusVideoData?.hero?.id);
                }}
              />
              {nPlusVideoData?.secondary?.length > 0 && (
                <View style={styles.carouselContainerVideo}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={nPlusVideoData?.secondary ?? []}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => (
                      <CarouselCard
                        type="videos"
                        topic={item?.category?.title}
                        title={item?.title}
                        minutesAgo={formatDurationToMinutes(item?.videoDuration)}
                        imageUrl={item?.heroImage?.sizes?.square?.url ?? ''}
                        isBookmarked={item?.isBookmarked}
                        headingStyles={styles.verticalHeading}
                        contentContainerStyle={styles.verticalVideoContainer}
                        imageStyle={styles.verticalImageStyle}
                        onPress={() => {
                          handleSecondaryVideoAnalytics(item, index, ANALYTICS_ATOMS.TAP_IN_TEXT);
                          onNPlusVideoCardPress(item?.slug);
                        }}
                        onBookmarkPress={() => {
                          const action = item?.isBookmarked
                            ? ANALYTICS_ATOMS.UNBOOKMARK
                            : ANALYTICS_ATOMS.BOOKMARK;
                          handleSecondaryVideoAnalytics(item, index, action);
                          handleBookmarkPress(item.id);
                        }}
                      />
                    )}
                    ItemSeparatorComponent={() => (
                      <CustomDivider style={styles.verticalVideoItemSeparator} />
                    )}
                    ListFooterComponent={
                      <CustomDivider style={styles.verticalVideoItemSeparator} />
                    }
                  />
                </View>
              )}
              {nPlusVideoData?.carousel?.length > 0 && (
                <SnapCarousel
                  data={nPlusVideoData?.carousel ?? []}
                  onCardPress={(item, index) => {
                    handleNPlusCarouselPressAnalytics(item, index, ANALYTICS_ATOMS.TAP_IN_TEXT);
                    onNPlusVideoCardPress(item?.slug as string);
                  }}
                  onBookmarkPress={(item) => {
                    const index =
                      nPlusVideoData?.carousel?.findIndex(
                        (carouselItem: (typeof nPlusVideoData.carousel)[0]) =>
                          carouselItem?.id === item?.id
                      ) ?? 0;
                    const action = item?.isBookmarked
                      ? ANALYTICS_ATOMS.UNBOOKMARK
                      : ANALYTICS_ATOMS.BOOKMARK;
                    handleNPlusCarouselBookmarkAnalytics(item, index, action);
                    handleBookmarkPress(item?.id);
                  }}
                  elementType={'videos'}
                  imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                />
              )}
            </View>
          )
        });
      }

      items.push({
        key: 'programs-section',
        component: (
          <View style={styles.sectionGap}>
            <TopicChips
              topics={chipsTopic}
              key={chipsTopic?.length ?? 0}
              headingTextstyle={{ ...styles.topicChipsTitle }}
              headingFontSize={fontSize['2xl']}
              headingFontWeight="R"
              headingFontFamily={fonts.notoSerifExtraCondensed}
              preselect={true}
              isCategory={true}
              heading={t('screens.videos.text.programNplus')}
              mainContainerstyle={{ ...styles.mainContainerStyle }}
              onPress={(value) => {
                const payload =
                  typeof value === 'string'
                    ? { id: value }
                    : (value as { id?: string | null } | null);
                handleProgramsChannelPillAnalytics(payload as ProgramasItem, 'tap');
                onProgramsTogglePress(payload);
                programasListRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            />
            {programasNPlusLoading ? (
              <View>
                <HorizontalInfoListSkeleton
                  itemCount={5}
                  showHeadingSkeleton={false}
                  imageHeight={222}
                  imageWidth={178}
                  containerStyle={styles.programasSkeletonContainer}
                />
              </View>
            ) : (
              <View>
                <SnapHorizontalList
                  headingUpperCase={false}
                  listRef={programasListRef}
                  imageWidth={164}
                  aspectRatio={4 / 5}
                  onPress={(item: ProgramasItem) => {
                    handleProgramsCarouselAnalytics(item, 'tap');
                    onProgramsCardPress(item);
                  }}
                  data={programasNPlusData?.ProgramasNPlus}
                  titleColor={theme.iconIconographyGenericState}
                  titleFontFamily={fonts.notoSerif}
                  titleFontWeight="R"
                  titleFontSize={fontSize.s}
                  titleStyles={{ ...styles.programTitleStyle }}
                  subTitleColor={theme.labelsTextLabelPlay}
                  subTitleFontFamily={fonts.franklinGothicURW}
                  subTitleFontWeight="Boo"
                  subTitleFontSize={fontSize.xxs}
                  subTitleStyles={{ ...styles.programSubtitleStyle }}
                  seeAllButtonStyles={styles.seeAllButtonStyles}
                  seeAllText={t('screens.videos.text.seeAllPrograms')}
                  listContentContainerStyle={{ marginBottom: 0 }}
                  onSeeAllPress={() => {
                    handleProgramsCtaAnalytics();
                    onSeeAllProgramsPress();
                  }}
                  getImageUrl={(item: ProgramItem) => item?.heroImage?.sizes?.vintage?.url ?? ''}
                  resizeMode={'cover'}
                />
              </View>
            )}
          </View>
        )
      });

      if (continueVideoData?.getUserContinueVideos?.videos?.length > 0) {
        items.push({
          key: 'continue-watching',
          component: (
            <View style={styles.sectionGap}>
              <CustomText
                size={fontSize['2xl']}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={{ ...styles.videosListTitle }}
              >
                {t('screens.videos.text.continueWatching')}
              </CustomText>
              <FlatList
                data={continueVideoData.getUserContinueVideos.videos}
                renderItem={({ item }) => (
                  <VideoListItem
                    item={item}
                    onPress={(item: ContinueWatchingVideo) => {
                      handleContinueWatchingCardAnalytics(item);
                      if (item.slug && item.fullPath) {
                        handleVideoPress({
                          slug: item.slug,
                          platform: item?.platform,
                          fullPath: item.fullPath
                        });
                      }
                    }}
                    onMenuPress={() => {
                      handleMenuPress(item);
                    }}
                    menuIconColor={theme.iconIconographyGenericState}
                    category={item?.category?.title ?? item?.topic?.[0]?.title}
                    iconColor={theme.carouselTextDarkTheme}
                  />
                )}
                keyExtractor={(item, index) => item.id || item.videoId || `continue-video-${index}`}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.videosList}
                ItemSeparatorComponent={() => <View style={styles.videoItemSeparator} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
              />
            </View>
          )
        });
      }

      if (showBannerAds) {
        items.push({
          key: 'ad-banner',
          component: (
            <AdBannerContainer
              containerStyle={styles.adBannerContainer}
              sectionGapStyle={styles.sectionGap}
            />
          )
        });
      }
      if (
        nPlusFocusDocs?.length > 0 ||
        porElPlaneteData?.length > 0 ||
        nPlusFocusLoading ||
        porElPlaneteDocumentariesLoading
      ) {
        items.push({
          key: 'nplus-focus-por-planeta',
          component: (
            <View style={[styles.carouselContainerView]}>
              {nPlusFocusDocs[0]?.heroImage?.url ? (
                <Pressable
                  onPress={() => {
                    handleNPlusFocusHeroAnalytics(nPlusFocusDocs[0], 'tap');
                    onNPlusFocusCardPress(nPlusFocusDocs[0]?.slug);
                  }}
                >
                  <CustomImage
                    source={{ uri: nPlusFocusDocs[0]?.heroImage?.url }}
                    style={styles.nPlusFocusImage}
                    fallbackComponent={
                      <FallbackImage
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    }
                  />
                  <LinearGradient
                    colors={[theme.gradientTransparentBlack, theme.mainBackgrunforproductionPage]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                  />
                  <View style={{ position: 'absolute', top: 16, alignSelf: 'center' }}>
                    <NPlusFocusImage width={110} height={26} />
                  </View>
                </Pressable>
              ) : null}
              {nPlusFocusLoading ? (
                <HorizontalInfoListSkeleton
                  itemCount={5}
                  showHeadingSkeleton={false}
                  imageHeight={222}
                  imageWidth={178}
                  containerStyle={styles.programasSkeletonContainer}
                />
              ) : (
                nPlusFocusDocs.length > 0 && (
                  <SnapHorizontalList
                    headingUpperCase={false}
                    titleFontFamily={fonts.notoSerif}
                    titleFontSize={fontSize.s}
                    titleFontWeight="R"
                    data={nPlusFocusDocs.slice(1).map((item: ExclusiveItem) => ({
                      ...item,
                      specialImage: { url: item.specialImage }
                    }))}
                    titleStyles={{ ...styles.planetTitle }}
                    contentContainerStyle={styles.contentContainerStyle}
                    seeAllText={t('screens.videos.text.watchInvestigations')}
                    titleColor={theme.newsTextDarkThemePages}
                    seeAllColor={theme.newsTextDarkThemePages}
                    onSeeAllPress={() => {
                      handleNPlusFocusCtaAnalytics();
                      onSeeAllNPlusFocusDocumenteriesPress();
                    }}
                    onPress={(item: HorizontalInfoItem) => {
                      const exclusiveItem = item as unknown as ExclusiveItem;
                      if (exclusiveItem?.slug) {
                        const index = nPlusFocusDocs
                          .slice(1)
                          .findIndex((doc: ExclusiveItem) => doc.id === exclusiveItem.id);
                        handleNPlusFocusCarouselAnalytics(exclusiveItem, index, 'tap');
                        onNPlusFocusCardPress(exclusiveItem.slug);
                      }
                    }}
                    getImageUrl={(item: HorizontalInfoItem) => {
                      const exclusiveItem = item as unknown as ExclusiveItem;
                      return exclusiveItem?.heroImage?.sizes?.portrait?.url ?? '';
                    }}
                    aspectRatio={9 / 16}
                  />
                )
              )}
              {porElPlaneteDocumentariesLoading ? (
                <HorizontalInfoListSkeleton
                  itemCount={5}
                  showHeadingSkeleton={false}
                  imageHeight={222}
                  imageWidth={178}
                  containerStyle={styles.programasSkeletonContainer}
                />
              ) : (
                porElPlaneteData?.length > 0 && (
                  <SnapHorizontalList<PorElPlanetaItem>
                    headingUpperCase={false}
                    heading={t('screens.videos.text.forPlanet')}
                    titleFontFamily={fonts.notoSerif}
                    titleFontSize={fontSize.s}
                    titleFontWeight="R"
                    data={porElPlaneteData}
                    titleStyles={{ ...styles.planetTitle }}
                    seeAllText={t('screens.videos.text.watchDocumentaries')}
                    titleColor={theme.newsTextDarkThemePages}
                    contentContainerStyle={styles.contentContainerStyle}
                    headingFontFamily={fonts.notoSerifExtraCondensed}
                    headingFontSize={fontSize['2xl']}
                    headingFontWeight="R"
                    headingStyles={{ ...styles.planetHeading }}
                    seeAllColor={theme.newsTextDarkThemePages}
                    containerStyle={styles.containerStyle}
                    onPress={(item: PorElPlanetaItem) => {
                      const index = porElPlaneteData.findIndex(
                        (doc: PorElPlanetaItem) => doc.id === item.id
                      );
                      handlePorElPlanetaCarouselAnalytics(item, index, 'tap');
                      onPorElPlanetaCardPress(item);
                    }}
                    onSeeAllPress={() => {
                      handlePorElPlanetaCtaAnalytics();
                      onSeeAllPlaneteDocumenteriesPress();
                    }}
                    seeAllButtonStyles={{ ...styles.seeAllButtonStyle }}
                    getImageUrl={(item: HorizontalInfoItem) => {
                      const exclusiveItem = item as unknown as ExclusiveItem;
                      return exclusiveItem?.heroImage?.sizes?.portrait?.url ?? '';
                    }}
                    aspectRatio={9 / 16}
                  />
                )
              )}
            </View>
          )
        });
      }
    }

    return items;
  }, [
    isInternetConnection,
    hasData,
    loading,
    onRetry,
    t,
    videoHeroCarouselData,
    videoHeroCarouselLoading,
    exclusiveNplusLoading,
    exclusiveNplusData,
    onExclusivePress,
    styles.titleStyles,
    styles.exclusiveHeadingStyles,
    ultimaNoticiasLoading,
    ultimaNoticiasData,
    handleLatestNewsPress,
    handleBookmarkPress,
    styles.latestNewsTitle,
    nPlusVideoSectionLoading,
    nPlusVideoData,
    theme.sectionTextTitleNormal,
    onNPlusVideoCardPress,
    styles.nPlusVideoTitle,
    styles.fullImageContainer,
    styles.fullNplusPrimaryImageContainer,
    styles.nplusVideoHeroTitle,
    styles.carouselContainerVideo,
    styles.verticalHeading,
    styles.verticalVideoContainer,
    styles.verticalImageStyle,
    styles.verticalVideoItemSeparator,
    chipsTopic,
    onProgramsTogglePress,
    programasNPlusLoading,
    programasNPlusData,
    onProgramsCardPress,
    onSeeAllProgramsPress,
    styles.topicChipsTitle,
    styles.mainContainerStyle,
    styles.programasSkeletonContainer,
    styles.programTitleStyle,
    styles.programSubtitleStyle,
    continueVideoData,
    styles.videosListTitle,
    handleVideoPress,
    handleMenuPress,
    theme.iconIconographyGenericState,
    theme.carouselTextDarkTheme,
    styles.videosList,
    styles.videoItemSeparator,
    loadMore,
    renderFooter,
    showBannerAds,
    styles.adBannerContainer,
    nPlusFocusDocs,
    porElPlaneteData,
    nPlusFocusLoading,
    porElPlaneteDocumentariesLoading,
    onNPlusFocusCardPress,
    styles.carouselContainerView,
    styles.nPlusFocusImage,
    theme.gradientTransparentBlack,
    theme.mainBackgrunforproductionPage,
    styles.gradient,
    styles.planetTitle,
    styles.contentContainerStyle,
    theme.newsTextDarkThemePages,
    onSeeAllNPlusFocusDocumenteriesPress,
    onPorElPlanetaCardPress,
    styles.planetHeading,
    styles.containerStyle,
    styles.seeAllButtonStyle,
    onSeeAllPlaneteDocumenteriesPress,
    showBelowFoldSections,
    styles.sectionGap
  ]);

  const renderSectionItem = useCallback(
    ({ item }: { item: SectionItem }) => <View key={`${item.key}-${theme}`}>{item.component}</View>,
    [theme]
  );

  const keyExtractor = useCallback((item: SectionItem) => item.key, []);

  // This useEffect hides the tab bar when reel mode is active and restores the original tab bar style when leaving the screen
  useEffect(() => {
    (navigation as { setOptions: (options: { tabBarStyle?: unknown }) => void }).setOptions({
      tabBarStyle: isReelMode
        ? { display: 'none' }
        : {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            paddingBottom: 0,
            position: 'absolute'
          }
    });

    return () => {
      (navigation as { setOptions: (options: { tabBarStyle?: unknown }) => void }).setOptions({
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          position: 'absolute'
        }
      });
    };
  }, [isReelMode, navigation]);

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

  if (showWebView) {
    return (
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
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <CustomHeader
        variant="secondary"
        headerText={t('screens.videos.title')}
        headerTextSize={fontSize.s}
        iconComponent={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        headerStyle={styles.headerContainer}
        buttonStyle={styles.searchButton}
        onPress={handleSearchAnalytics}
      />

      <FlatList
        data={sectionsData}
        renderItem={renderSectionItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={StyleSheet.flatten([
          styles.scrollView,
          styles.scrollViewWithWidgets
        ])}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        updateCellsBatchingPeriod={50}
      />

      <VideoOptionsModal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        videoTitle={selectedVideo?.title || ''}
        onSharePress={handleSharePress}
        onRemovePress={handleRemovePress}
        isBookmarked={isToggleBookmark}
        onBookmarkPress={() => {
          if (selectedVideo) {
            const action = selectedVideo.isBookmarked ? 'unsave' : 'save';
            handleContinueWatchingBookmarkAnalytics(selectedVideo, action);
            handleBookmarkPress(selectedVideo?.id);
          }
        }}
        iconColor={theme.iconIconographyGenericState}
      />

      {isReelMode && (
        <ReelModeScreen
          data={exclusiveList}
          selectedIndex={selectedExclusiveIndex}
          screenHeight={screenHeight}
          activeIndex={activeExclusiveIndex}
          onMomentumScrollEnd={onMomentumScrollEnd}
          setReelMode={setReelMode}
          analyticsContentType={`${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`}
          analyticsScreenName={ANALYTICS_COLLECTION.VIDEOS}
          analyticsOrganism={ANALYTICS_ORGANISMS.HOME_PAGE.EXCLUSIVE_CARD}
        />
      )}

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

export default Videos;
