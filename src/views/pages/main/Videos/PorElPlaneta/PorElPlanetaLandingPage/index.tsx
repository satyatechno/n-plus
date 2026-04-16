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

import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import CustomToast from '@src/views/molecules/CustomToast';
import { themeStyles } from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaLandingPage/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import usePorELPlanetaLandingPageViewModel from '@src/viewModels/main/Videos/PorElPlaneta/usePorELPlanetaLandingPageViewModel';
import { FallbackImage, PorElPlanetaImage } from '@src/assets/images';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import { BookMark, CheckedBookMark, PlayCircle, SearchIcon } from '@src/assets/icons';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import PorElPlanetaLandingPageSkeletonLoader from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaLandingPage/components/PorElPlanetaLandingPageSkeletonLoader';
import VideoListItem from '@src/views/pages/main/Videos/Videos/components/VideoListItem';
import VideoOptionsModal from '@src/views/organisms/VideoOptionsModal';
import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CustomImage from '@src/views/atoms/CustomImage';
import CustomLoader from '@src/views/molecules/CustomLoader';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';
import { extractLexicalText } from '@src/utils/extractLexicalText';

const PorElPlanetaLandingPage: React.FC = () => {
  const {
    theme,
    t,
    goBack,
    handleSearchPress,
    heroDocumentariesData,
    handleBookmarkPress,
    handleThreeDotsBookmarkPress,
    isToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    refreshLoader,
    onRetry,
    heroDocumentariesLoading,
    continueVideoData,
    handleVideoPress,
    handleMenuPress,
    isModalVisible,
    handleCloseModal,
    selectedVideo,
    handleSharePress,
    handleRemovePress,
    porELPlanetaRecentDocumentariesLoading,
    onSeeAllPlaneteDocumenteriesPress,
    porELPlanetaRecentDocumentariesData,
    mostViewedDocumentariesData,
    mostViewedDocumentariesLoading,
    goToDetailPage,
    onPorElPlanetaCardPress,
    onInvestigationCardPress,
    isInternetConnection,
    isProgramBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showWebView,
    setShowWebView,
    webUrl,
    loadMore,
    continueVideoLoading,
    showBannerAds
  } = usePorELPlanetaLandingPageViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);
  const loading = heroDocumentariesLoading && porELPlanetaRecentDocumentariesLoading;

  const mostViewedList = useMemo(
    () => mostViewedDocumentariesData?.slice(0, 4) ?? [],
    [mostViewedDocumentariesData]
  );
  const data =
    heroDocumentariesData || porELPlanetaRecentDocumentariesData || mostViewedDocumentariesData;

  const descriptionText =
    extractLexicalText(heroDocumentariesData?.excerpt) ||
    extractLexicalText(heroDocumentariesData?.summary);

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

  const renderFooter = () => {
    if (!continueVideoLoading) return null;
    return <CustomLoader />;
  };

  const renderContinueWatchingItem = useCallback(
    ({ item }: { item: (typeof continueVideoData)['getUserContinueVideos']['videos'][number] }) => (
      <VideoListItem
        item={item}
        onPress={handleVideoPress}
        onMenuPress={() => handleMenuPress(item)}
        titleColor={theme.newsTextDarkThemePages}
        menuIconColor={theme.carouselTextDarkTheme}
        categoryColor={theme.carouselTextDarkTheme}
        category={item?.programs?.[0]?.title || undefined}
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
        onAdditionalButtonPress={handleSearchPress}
        variant="dualVariant"
        middleIcon={
          <PorElPlanetaImage
            fill={theme.carouselTextDarkTheme}
            width={actuatedNormalize(190)}
            height={actuatedNormalize(20)}
          />
        }
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.carouselTextDarkTheme}
        buttonStyle={styles.buttonStyle}
      />

      {!isInternetConnection && !loading && !data ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          <ErrorScreen status="noInternet" onRetry={onRetry} />
        </ScrollView>
      ) : !loading && !data ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          <ErrorScreen status="error" onRetry={onRetry} showErrorButton={false} />
        </ScrollView>
      ) : heroDocumentariesLoading ? (
        <PorElPlanetaLandingPageSkeletonLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          <View>
            <CustomImage
              source={
                heroDocumentariesData?.specialImage?.sizes?.vintage?.url
                  ? { uri: heroDocumentariesData.specialImage.sizes.vintage.url }
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
              weight="B"
              textStyles={styles.programTitle}
              size={fontSize['xl']}
            >
              {heroDocumentariesData?.title ?? ''}
            </CustomText>

            <CustomButton
              buttonText={t('screens.nPlusFocus.text.startWatching')}
              buttonStyles={styles.lastEpisodeButton}
              onPress={() => goToDetailPage(heroDocumentariesData?.slug)}
            />

            {!!descriptionText && (
              <CustomText textStyles={styles.description} size={fontSize.s}>
                {descriptionText}
              </CustomText>
            )}

            <View style={styles.iconRow}>
              <View style={styles.durationContainer}>
                <PlayCircle
                  width={actuatedNormalize(34)}
                  height={actuatedNormalizeVertical(34)}
                  color={theme.carouselTextDarkTheme}
                />
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xs}
                  weight="Med"
                  color={theme.carouselTextDarkTheme}
                  textStyles={styles.durationText}
                >
                  {formatDurationToMinutes(heroDocumentariesData?.videoDuration ?? 0)}
                </CustomText>
              </View>

              <Pressable onPress={() => handleBookmarkPress(true, heroDocumentariesData?.id)}>
                {isProgramBookmark ? (
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
                horizontal
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
              />
            </View>
          )}

          {showBannerAds && <AdBannerContainer containerStyle={styles.adBannerContainer} />}

          {mostViewedDocumentariesLoading ? (
            <HorizontalInfoListSkeleton
              itemCount={5}
              showHeadingSkeleton={false}
              imageHeight={actuatedNormalizeVertical(270)}
              imageWidth={actuatedNormalize(188)}
              containerStyle={styles.programasSkeletonContainer}
            />
          ) : (
            mostViewedDocumentariesData?.length > 0 && (
              <SnapHorizontalList
                heading={t('screens.videos.text.mostViewed')}
                headingFontFamily={fonts.notoSerifExtraCondensed}
                headingFontSize={fontSize['2xl']}
                headingFontWeight="R"
                headingUpperCase={false}
                titleFontFamily={fonts.notoSerif}
                titleFontSize={fontSize.s}
                titleFontWeight="R"
                data={mostViewedList}
                titleStyles={styles.planetTitle}
                titleColor={theme.newsTextDarkThemePages}
                headingStyles={styles.planetHeading}
                containerStyle={styles.containerStyle}
                onPress={onPorElPlanetaCardPress}
                getImageUrl={(item) => item?.specialImage?.sizes?.portrait?.url}
                aspectRatio={9 / 16}
              />
            )
          )}

          {porELPlanetaRecentDocumentariesLoading ? (
            <HorizontalInfoListSkeleton
              itemCount={5}
              showHeadingSkeleton={false}
              imageHeight={actuatedNormalizeVertical(270)}
              imageWidth={actuatedNormalize(188)}
              containerStyle={styles.programasSkeletonContainer}
            />
          ) : (
            porELPlanetaRecentDocumentariesData?.length > 0 && (
              <SnapHorizontalList
                heading={t('screens.videos.text.allDocumentaries')}
                headingFontFamily={fonts.notoSerifExtraCondensed}
                headingFontSize={fontSize['2xl']}
                headingFontWeight="R"
                headingUpperCase={false}
                titleFontFamily={fonts.notoSerif}
                titleFontSize={fontSize.s}
                titleFontWeight="R"
                data={porELPlanetaRecentDocumentariesData}
                titleStyles={styles.planetTitle}
                seeAllText={t('screens.videos.text.watchDocumentaries')}
                titleColor={theme.newsTextDarkThemePages}
                headingStyles={styles.planetHeading}
                seeAllColor={theme.newsTextDarkThemePages}
                containerStyle={styles.containerStyle}
                onSeeAllPress={onSeeAllPlaneteDocumenteriesPress}
                seeAllButtonStyles={styles.seeAllButtonStyle}
                onPress={onInvestigationCardPress}
                getImageUrl={(item) => item?.specialImage?.sizes?.portrait?.url}
                aspectRatio={9 / 16}
              />
            )
          )}
        </ScrollView>
      )}

      <VideoOptionsModal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        videoTitle={selectedVideo?.title || ''}
        onSharePress={handleSharePress}
        onRemovePress={handleRemovePress}
        isBookmarked={isToggleBookmark}
        onBookmarkPress={handleThreeDotsBookmarkPress}
        modalContainerStyle={styles.modalContainer}
        modalTitleStyle={styles.modalTitle}
        optionTextStyle={styles.modalTitle}
        iconColor={theme.carouselTextDarkTheme}
      />

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
        customTheme={'dark'}
      />

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PorElPlanetaLandingPage;
