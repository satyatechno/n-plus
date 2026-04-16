import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import CustomToast from '@src/views/molecules/CustomToast';
import { themeStyles } from '@src/views/pages/main/Videos/ProductionPage/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { FallbackImage } from '@src/assets/images';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import { BookMark, CheckedBookMark, PlayCircle, SearchIcon } from '@src/assets/icons';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomImage from '@src/views/atoms/CustomImage';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import useProductionPageViewModel from '@src/viewModels/main/Videos/ProductionPage/useProductionPageViewModel';
import ProductionSkeletonLoader from './components/ProductionSkeletonLoader';
import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';
import CustomLoader from '@src/views/molecules/CustomLoader';
import VideoListItem from '../Videos/components/VideoListItem';
import VideoOptionsModal from '@src/views/organisms/VideoOptionsModal';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { ProductionPagePost } from '@src/models/main/Videos/ProductionPage';
import InfoCard from '@src/views/molecules/InfoCard';

const ProductionPage: React.FC = () => {
  const {
    theme,
    t,
    title,
    goBack,
    handleSearchPress,
    heroDocumentariesData,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    refreshLoader,
    onRetry,
    goToDetailPage,
    isInternetConnection,
    isProgramBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    heroDocumentariesLoading,
    showBannerAds,
    mostViewedDocumentariesData,
    mostViewedDocumentariesLoading,
    onMoreDocumentariesCardPress,
    continueVideoData,
    continueVideoLoading,
    handleVideoPress,
    handleMenuPress,
    loadMore,
    isModalVisible,
    handleCloseModal,
    handleSharePress,
    handleRemovePress,
    isToggleBookmark,
    handleThreeDotsBookmarkPress,
    selectedVideo,
    productionVideos,
    productionVideosLoading,
    productionPost,
    productionPostLoading,
    goToDetailScreen,
    loadMoreProductionPost,
    loadMoreProductionVideos
  } = useProductionPageViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);
  const loading =
    heroDocumentariesLoading ||
    mostViewedDocumentariesLoading ||
    productionPostLoading ||
    productionVideosLoading;
  const mostViewedList = useMemo(
    () => mostViewedDocumentariesData?.slice(0, 4) ?? [],
    [mostViewedDocumentariesData]
  );

  const data =
    heroDocumentariesData ||
    mostViewedDocumentariesData ||
    productionPost?.docs?.length ||
    productionVideos?.docs?.length;

  const { videoItems, postItems } = useMemo(
    () => ({
      videoItems: productionPost?.docs?.slice(0, 4) ?? [],
      postItems: productionPost?.docs?.slice(4) ?? []
    }),
    [productionPost]
  );

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
        titleColor={theme.carouselTextDescription}
        menuIconColor={theme.carouselTextDarkTheme}
        categoryColor={theme.carouselTextDarkTheme}
        category={item?.category?.title ?? ''}
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
        headerText={title}
        headerTextColor="white"
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
        <ProductionSkeletonLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          <View>
            <CustomImage
              source={
                heroDocumentariesData?.bannerImage?.sizes?.vintage?.url
                  ? { uri: heroDocumentariesData.bannerImage.sizes.vintage.url }
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
              size={fontSize['6xl']}
            >
              {heroDocumentariesData?.title ?? ''}
            </CustomText>

            <CustomButton
              buttonText={t('screens.nPlusFocus.text.startWatching')}
              buttonStyles={styles.lastEpisodeButton}
              onPress={() => goToDetailPage(heroDocumentariesData?.slug)}
            />

            {heroDocumentariesData?.summary ? (
              <CustomText textStyles={styles.description} size={fontSize.xs}>
                {heroDocumentariesData?.summary ?? ''}
              </CustomText>
            ) : null}
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
          {showBannerAds && <AdBannerContainer containerStyle={styles.adBannerContainer} />}

          {continueVideoData?.getUserContinueVideos?.videos?.length > 0 && (
            <View>
              <CustomText
                size={fontSize['4xl']}
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
              <>
                <CustomText
                  size={fontSize['4xl']}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.videosListTitle}
                >
                  {t('screens.videos.text.mostViewed')}
                </CustomText>
                <SnapHorizontalList
                  titleFontFamily={fonts.notoSerifExtraCondensed}
                  titleFontSize={fontSize.l}
                  data={mostViewedList}
                  titleStyles={styles.planetTitle}
                  titleColor={theme.newsTextDarkThemePages}
                  headingStyles={styles.planetHeading}
                  containerStyle={styles.containerStyle}
                  onPress={onMoreDocumentariesCardPress}
                  getImageUrl={(item) => {
                    const imageDetails = item as unknown as {
                      bannerImage: {
                        sizes: {
                          portrait: {
                            url: string;
                          };
                        };
                      };
                    };
                    return imageDetails?.bannerImage?.sizes?.portrait?.url;
                  }}
                  aspectRatio={9 / 16}
                />
              </>
            )
          )}

          {productionVideosLoading ? (
            <HorizontalInfoListSkeleton
              itemCount={5}
              showHeadingSkeleton={false}
              imageHeight={actuatedNormalizeVertical(270)}
              imageWidth={actuatedNormalize(188)}
              containerStyle={styles.programasSkeletonContainer}
            />
          ) : (
            productionVideos?.docs?.length > 0 && (
              <>
                <CustomText
                  size={fontSize['4xl']}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.videosListTitle}
                >
                  {t('screens.videos.text.ourOriginalVideos')}
                </CustomText>
                <FlatList
                  data={productionVideos?.docs ?? []}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View>
                      <InfoCard
                        item={item}
                        id={item?.id}
                        imageUrl={item?.content?.heroImage?.sizes?.portrait?.url}
                        title={item.title}
                        onPress={onMoreDocumentariesCardPress}
                        titleFontFamily={fonts.notoSerifExtraCondensed}
                        titleFontSize={fontSize.l}
                        titleStyles={styles.planetTitle}
                        titleColor={theme.newsTextDarkThemePages}
                        contentContainerStyle={styles.infoCardStyle}
                        aspectRatio={9 / 16}
                      />
                    </View>
                  )}
                  columnWrapperStyle={styles.columnStyle}
                />

                {productionVideos?.hasNextPage && (
                  <Pressable onPress={loadMoreProductionVideos} style={styles.seeAllButtonStyles}>
                    <CustomText
                      weight={'Dem'}
                      fontFamily={fonts.franklinGothicURW}
                      size={fontSize.xs}
                      color={theme.newsTextDarkThemePages}
                      textStyles={styles.seeAllText}
                    >
                      {t('screens.videos.text.viewMore')}
                    </CustomText>
                  </Pressable>
                )}
              </>
            )
          )}

          {(videoItems.length > 0 || postItems.length > 0) && (
            <>
              <CustomText
                fontFamily={fonts.notoSerifExtraCondensed}
                size={fontSize['4xl']}
                textStyles={styles.videosListTitle}
              >
                {t('screens.videos.text.ourOriginalNotes')}
              </CustomText>
              {videoItems.length > 0 && (
                <SnapCarousel
                  data={videoItems?.map((item: ProductionPagePost) => ({
                    ...item,
                    type: 'videos'
                  }))}
                  onBookmarkPress={(item) => handleBookmarkPress(false, item.id)}
                  headingStyles={styles.headingStyles}
                  getImageUrl={(item) => {
                    const temp = item as unknown as ProductionPagePost;
                    return temp.heroImage?.[0]?.sizes?.landscape?.url;
                  }}
                  getVideoDuration={(item) => (item?.readTime ? `${item?.readTime} min` : '')}
                  subHeadingStyles={styles.subheadingStyles}
                  iconColor={theme.carouselTextDarkTheme}
                  bottomRowStyles={styles.bottomRowStyles}
                  onCardPress={(item) => goToDetailScreen(item?.slug ?? '')}
                  imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                  hidePlayIconOnly={true}
                />
              )}

              {postItems.map((item: ProductionPagePost, index: number) => (
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
                  onPressingBookmark={() => handleBookmarkPress(false, item?.id)}
                  primaryColor={theme.carouselTextDarkTheme}
                  containerStyle={styles.bookmarkCardContainer}
                  pressedBackgroundColor={theme.mainBackgrunforproductionPage}
                  onPress={() => goToDetailScreen(item?.slug ?? '')}
                />
              ))}
              {productionPost?.hasNextPage && (
                <Pressable onPress={loadMoreProductionPost} style={styles.seeAllButtonStyles}>
                  <CustomText
                    weight={'Dem'}
                    fontFamily={fonts.franklinGothicURW}
                    size={fontSize.xs}
                    color={theme.newsTextDarkThemePages}
                    textStyles={styles.seeAllText}
                  >
                    {t('screens.videos.text.viewMore')}
                  </CustomText>
                </Pressable>
              )}
            </>
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

export default ProductionPage;
