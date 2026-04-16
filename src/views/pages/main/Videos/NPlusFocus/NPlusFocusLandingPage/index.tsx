import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  View
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { BookMark, CheckedBookMark, PlayCircle, SearchIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import useNPlusFocusLandingViewModel from '@src/viewModels/main/Videos/NPlusFocus/NPlusFocusLanding/useNPlusFocusLandingViewModel';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import CustomButton from '@src/views/molecules/CustomButton';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { extractLexicalText } from '@src/utils/extractLexicalText';
import { FallbackImage, NPlusFocusImage } from '@src/assets/images';
import CustomToast from '@src/views/molecules/CustomToast';
import VideoOptionsModal from '@src/views/organisms/VideoOptionsModal';
import { type HorizontalInfoItem } from '@src/views/organisms/HorizontalInfoList';
import { ExclusiveItem } from '@src/models/main/Videos/Videos';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { NPlusShortReport, VideoItemCategoryTopics } from '@src/models/main/Videos/NPlusFocus';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/NPlusFocusLandingPage/styles';
import VideoListItem from '@src/views/pages/main/Videos/Videos/components/VideoListItem';
import NPlusFocusSkeletonLoader from '@src/views/pages/main/Videos/NPlusFocus/NPlusFocusLandingPage/components/NPlusFocusSkeletonLoader';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import CustomWebView from '@src/views/atoms/CustomWebView';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomImage from '@src/views/atoms/CustomImage';
import CustomLoader from '@src/views/molecules/CustomLoader';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';
import SnapCarousel from '@src/views/organisms/SnapCarousel';

const NPlusFocusLandingPage = () => {
  const {
    goBack,
    handleSearchPress,
    handleViewInteractivePress,
    theme,
    data,
    isToggleBookmark,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    continueVideoData,
    handleVideoPress,
    handleMenuPress,
    isModalVisible,
    selectedVideo,
    handleSharePress,
    handleRemovePress,
    handleCloseModal,
    nPlusFocusInvestigationsData,
    nPlusFocusShortReportsData,
    nplusFocusLandingPageLoading,
    continueVideoLoading,
    nPlusFocusInvestigationsLoading,
    nPlusFocusShortReportsLoading,
    nPlusFocusLoading,
    handleSeeAllPress,
    goToInvestigationDetailScreen,
    handleInvestigationCardPress,
    goToInteractiveListingScreen,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    seeAllShortInvestigationReports,
    isInternetConnection,
    refreshing,
    onRefresh,
    isHeroCardBookmarked,
    goToDetailScreen,
    goToShortReportsScreen,
    nPlusFocusDocs,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    loadMore,
    showBannerAds,
    handleContinueWatchingSwipe,
    handleInteractiveSwipe,
    handleInvestigationsSwipe
  } = useNPlusFocusLandingViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { t } = useTranslation();
  const docs = nPlusFocusShortReportsData?.NPlusFocusShortReports?.docs ?? [];
  const videoItems = useMemo(
    () => docs.filter((item: { type: string }) => item.type === 'video'),
    [docs]
  );
  const postItems = useMemo(
    () => docs.filter((item: { type: string }) => item.type === 'post'),
    [docs]
  );

  const descriptionText =
    extractLexicalText(data?.NPlusFocusLanding?.docs?.excerpt) ||
    extractLexicalText(data?.NPlusFocusLanding?.docs?.summary);

  const slideAnim = useMemo(() => new Animated.Value(1000), []);
  const loading =
    nPlusFocusLoading ||
    nplusFocusLandingPageLoading ||
    continueVideoLoading ||
    nPlusFocusInvestigationsLoading ||
    nPlusFocusShortReportsLoading;

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

  const renderFooter = () => {
    if (!continueVideoLoading) return null;
    return <CustomLoader />;
  };

  const renderContinueWatchingItem = useCallback(
    ({
      item,
      index
    }: {
      item: (typeof continueVideoData)['getUserContinueVideos']['videos'][number];
      index: number;
    }) => (
      <VideoListItem
        item={item}
        onPress={() => handleVideoPress(item, index)}
        onMenuPress={() => handleMenuPress(item)}
        titleColor={theme.newsTextDarkThemePages}
        menuIconColor={theme.carouselTextDarkTheme}
        categoryColor={theme.carouselTextDarkTheme}
        iconColor={theme.carouselTextDarkTheme}
      />
    ),
    [handleVideoPress, handleMenuPress, theme]
  );

  const continueWatchingKeyExtractor = useCallback(
    (item: { id?: string; videoId?: string; slug?: string }) =>
      `${item.id ?? item.videoId ?? item.slug}`,
    []
  );

  const ItemSeparator = () => <View style={styles.videoItemSeparator} />;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        additionalIcon={<SearchIcon stroke={theme.carouselTextDarkTheme} />}
        variant="dualVariant"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.carouselTextDarkTheme}
        buttonStyle={styles.buttonStyle}
        onAdditionalButtonPress={handleSearchPress}
        middleIcon={
          <NPlusFocusImage
            fill={theme.carouselTextDarkTheme}
            width={actuatedNormalize(190)}
            height={actuatedNormalize(20)}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!isInternetConnection ? (
          <ErrorScreen status="noInternet" onRetry={onRefresh} />
        ) : loading ? (
          <NPlusFocusSkeletonLoader />
        ) : (
          <>
            <View>
              <CustomImage
                source={
                  data?.NPlusFocusLanding?.docs?.specialImage?.sizes?.vintage?.url
                    ? { uri: data?.NPlusFocusLanding?.docs?.specialImage?.sizes?.vintage?.url }
                    : undefined
                }
                style={styles.programHeroImage}
                fallbackComponent={
                  <View style={styles.fallbackImageContainerStyle}>
                    <FallbackImage width={'100%'} height={'100%'} />
                  </View>
                }
              />
              <LinearGradient
                colors={[theme.gradientTransparentBlack, theme.mainBackgrunforproductionPage]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.9 }}
                style={styles.gradient}
              />
            </View>

            <View style={styles.programDetailContainer}>
              <CustomText
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.programTitle}
                weight="B"
                size={fontSize['xl']}
              >
                {data?.NPlusFocusLanding?.docs?.title ?? ''}
              </CustomText>

              <CustomButton
                buttonText={t('screens.nPlusFocus.text.startWatching')}
                buttonStyles={styles.lastEpisodeButton}
                onPress={() =>
                  goToInvestigationDetailScreen(
                    data?.NPlusFocusLanding?.docs?.slug,
                    data?.NPlusFocusLanding?.docs
                  )
                }
              />

              {!!descriptionText && (
                <CustomText textStyles={styles.description} size={fontSize.s}>
                  {descriptionText}
                </CustomText>
              )}

              <View style={styles.iconRow}>
                <View style={styles.durationContainer}>
                  <PlayCircle width={25} height={25} color={theme.carouselTextDarkTheme} />
                  <CustomText
                    weight={'Med'}
                    size={fontSize.xxs}
                    color={theme.carouselTextDarkTheme}
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={styles.durationText}
                  >
                    {formatDurationToMinutes(data?.NPlusFocusLanding?.docs?.videoDuration ?? 0)}
                  </CustomText>
                </View>

                <Pressable onPress={() => handleBookmarkPress(data?.NPlusFocusLanding?.docs?.id)}>
                  {isHeroCardBookmarked ? (
                    <CheckedBookMark color={theme.carouselTextDarkTheme} />
                  ) : (
                    <BookMark color={theme.carouselTextDarkTheme} />
                  )}
                </Pressable>
              </View>
            </View>

            {continueVideoData?.getUserContinueVideos?.videos?.length > 0 && (
              <View>
                <CustomText
                  size={fontSize['2xl']}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.videosListTitle}
                >
                  {t('screens.videos.text.continueWatching')}
                </CustomText>

                <FlatList
                  data={continueVideoData.getUserContinueVideos.videos}
                  renderItem={renderContinueWatchingItem}
                  keyExtractor={continueWatchingKeyExtractor}
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videosList}
                  ItemSeparatorComponent={ItemSeparator}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={renderFooter}
                  removeClippedSubviews
                  maxToRenderPerBatch={6}
                  initialNumToRender={4}
                  windowSize={5}
                  onMomentumScrollEnd={handleContinueWatchingSwipe}
                />
              </View>
            )}

            {showBannerAds && <AdBannerContainer containerStyle={styles.adBannerContainer} />}

            {nPlusFocusDocs.length > 0 && (
              <>
                <CustomText
                  textStyles={styles.headeringTextStyles}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  size={fontSize['2xl']}
                >
                  {t('screens.nPlusFocus.text.interactives')}
                </CustomText>

                <View style={styles.carouselContainerView}>
                  <Pressable onPress={() => handleInteractiveResearchPress(nPlusFocusDocs[0], 0)}>
                    <CustomImage
                      source={{
                        uri:
                          nPlusFocusDocs[0]?.hero?.media?.sizes?.portrait?.url ||
                          nPlusFocusDocs[0]?.hero?.media?.sizes?.vintage?.url ||
                          nPlusFocusDocs[0]?.hero?.media?.url
                      }}
                      style={styles.nPlusFocusImage}
                      fallbackComponent={
                        <View style={styles.fallbackImageContainerStyle}>
                          <FallbackImage
                            width="100%"
                            height="100%"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </View>
                      }
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={[theme.gradientTransparentBlack, theme.mainBackgrunforproductionPage]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 0.9 }}
                      style={styles.gradient}
                    />
                  </Pressable>

                  {(nPlusFocusDocs[0]?.hero?.links ||
                    nPlusFocusDocs[0]?.fullPath ||
                    (nPlusFocusDocs[0] as unknown as { interactiveUrl?: string })
                      ?.interactiveUrl) && (
                      <CustomButton
                        variant="outlined"
                        buttonText={t('screens.nPlusFocus.text.viewInteractive')}
                        buttonStyles={styles.viewInteractiveButton}
                        outlinedBorderColor={theme.carouselTextDarkTheme}
                        onPress={() => handleViewInteractivePress(nPlusFocusDocs[0])}
                      />
                    )}

                  <SnapHorizontalList
                    titleFontFamily={fonts.notoSerif}
                    titleFontSize={fontSize.s}
                    titleFontWeight="R"
                    data={nPlusFocusDocs.slice(1, 5) ?? []}
                    titleStyles={styles.planetTitle}
                    contentContainerStyle={styles.contentContainerStyle}
                    seeAllText={t('screens.nPlusFocus.text.verInteractivos')}
                    titleColor={theme.newsTextDarkThemePages}
                    seeAllColor={theme.newsTextDarkThemePages}
                    seeAllButtonStyles={styles.seeAllButton}
                    onSeeAllPress={goToInteractiveListingScreen}
                    onMomentumScrollEnd={handleInteractiveSwipe}
                    onPress={(item: HorizontalInfoItem, index?: number) => {
                      handleInteractiveResearchPress(item, index ?? 0);
                    }}
                    getImageUrl={(item: HorizontalInfoItem) => {
                      const exclusiveItem = item as unknown as ExclusiveItem;
                      return exclusiveItem?.hero?.media?.sizes?.portrait?.url ?? '';
                    }}
                    aspectRatio={9 / 16}
                    resizeMode="cover"
                  />
                </View>
              </>
            )}

            {(nPlusFocusInvestigationsData?.NPlusFocusInvestigations?.docs?.length ?? 0) > 0 && (
              <>
                <CustomText
                  textStyles={styles.viewInvestigationTextStyles}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  size={fontSize['2xl']}
                >
                  {t('screens.nPlusFocus.text.viewInvestigation')}
                </CustomText>

                <SnapHorizontalList
                  titleFontFamily={fonts.notoSerif}
                  titleFontWeight="R"
                  titleFontSize={fontSize.s}
                  data={
                    nPlusFocusInvestigationsData?.NPlusFocusInvestigations?.docs?.map(
                      (item: ExclusiveItem) => ({
                        ...item,
                        specialImage: { url: item.specialImage }
                      })
                    ) ?? []
                  }
                  titleStyles={styles.planetTitle}
                  contentContainerStyle={styles.contentContainerStyle}
                  seeAllText={t('screens.nPlusFocus.text.seeAllInvestigations')}
                  titleColor={theme.newsTextDarkThemePages}
                  seeAllColor={theme.newsTextDarkThemePages}
                  onSeeAllPress={handleSeeAllPress}
                  onMomentumScrollEnd={handleInvestigationsSwipe}
                  onPress={(item, index) => {
                    const exclusiveItem = item as unknown as ExclusiveItem;
                    if (exclusiveItem?.slug) {
                      handleInvestigationCardPress(exclusiveItem.slug, index ?? 0);
                    }
                  }}
                  getImageUrl={(item) => {
                    const exclusiveItem = item as unknown as ExclusiveItem;
                    return (
                      exclusiveItem?.specialImage?.url?.sizes?.portrait?.url ||
                      exclusiveItem?.heroImage?.sizes?.portrait?.url ||
                      ''
                    );
                  }}
                  aspectRatio={9 / 16}
                  resizeMode="cover"
                />
              </>
            )}

            {(videoItems.length > 0 || postItems.length > 0) && (
              <>
                <CustomText
                  textStyles={styles.viewInvestigationTextStyles}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  size={fontSize['2xl']}
                >
                  {t('screens.nPlusFocus.text.shortReports')}
                </CustomText>

                {videoItems.length > 0 && (
                  <SnapCarousel
                    data={videoItems.map((item: VideoItemCategoryTopics) => ({
                      ...item,
                      collection: 'videos',
                      topic: item.topics?.[0]?.title ?? item.category?.title
                    }))}
                    onBookmarkPress={(item) => handleBookmarkPress(item.id, false, true, item)}
                    headingStyles={styles.headingStyles}
                    subHeadingStyles={styles.subheadingStyles}
                    iconColor={theme.carouselTextDarkTheme}
                    bottomRowStyles={styles.bottomRowStyles}
                    onCardPress={(item, index) => goToDetailScreen(item?.slug ?? '', index)}
                    imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                    listContainerStyle={styles.listContainerStyle}
                  />
                )}

                {postItems.map((item: NPlusShortReport, index: number) => (
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
                    headingTextStyles={styles.bookmarkHeadingTextStyles}
                    subHeadingColor={theme.carouselTextDarkTheme}
                    isBookmarkChecked={item?.isBookmarked}
                    id={item?.id ?? ''}
                    onPressingBookmark={() => handleBookmarkPress(item?.id, false, true, item)}
                    primaryColor={theme.carouselTextDarkTheme}
                    containerStyle={styles.bookmarkCardContainer}
                    pressedBackgroundColor={theme.mainBackgrunforproductionPage}
                    onPress={() => goToShortReportsScreen(item?.slug ?? '', index, item)}
                  />
                ))}

                <SeeAllButton
                  text={t('screens.nPlusFocus.text.viewAll')}
                  onPress={seeAllShortInvestigationReports}
                  color={theme.newsTextDarkThemePages}
                  buttonStyle={styles.seeAllButtonStyles}
                  textStyle={styles.seeAllText}
                  hitSlop={10}
                />
              </>
            )}
          </>
        )}
      </ScrollView>

      <VideoOptionsModal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        videoTitle={selectedVideo?.title || ''}
        onSharePress={handleSharePress}
        onRemovePress={handleRemovePress}
        isBookmarked={isToggleBookmark}
        onBookmarkPress={() =>
          selectedVideo ? handleBookmarkPress(selectedVideo?.id, true, false, selectedVideo) : null
        }
        modalContainerStyle={styles.modalContainer}
        modalTitleStyle={styles.modalTitle}
        optionTextStyle={styles.modalTitle}
        iconColor={theme.carouselTextDarkTheme}
      />

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
      />
      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
        customTheme={'dark'}
      />

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="fade"
          transparent
          onRequestClose={() => setShowWebView(false)}
        >
          <Animated.View
            style={[
              styles.webViewContainer,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
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
      )}
    </SafeAreaView>
  );
};

export default NPlusFocusLandingPage;
