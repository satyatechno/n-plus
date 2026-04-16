import React, { useEffect, useMemo } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  View
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInvestigationDetailScreenViewModel from '@src/viewModels/main/Videos/NPlusFocus/InvestigationDetailScreen/useInvestigationDetailScreenViewModel';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { BookMark, BulletIcon, CheckedBookMark, ShareIcon } from '@src/assets/icons';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomDivider from '@src/views/atoms/CustomDivider';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { FallbackImage } from '@src/assets/images';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { InvestigationItem, VideoItemCategoryTopics } from '@src/models/main/Videos/NPlusFocus';
import InfoCard from '@src/views/molecules/InfoCard';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/InvestigationDetailScreen/styles';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { useTheme } from '@src/hooks/useTheme';
import InvestigationDetailSkeleton from '@src/views/pages/main/Videos/NPlusFocus/InvestigationDetailScreen/components/InvestigationDetailSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

const InvestigationDetailScreen = () => {
  const {
    goBack,
    handleBookmarkPress,
    data,
    publishedAt,
    onSharePress,
    toastMessage,
    toastType,
    setToastMessage,
    displayData,
    hasMore,
    handleViewMore,
    handleViewLess,
    hasLess,
    videoItems,
    latestPostItems,
    flatListRef,
    recentlyAddedData,
    seeAllShortInvestigationReports,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    currentPageTheme,
    recentlyAddedLoading,
    nPlusFocusShortListingLoading,
    videoLoading,
    isRefreshing,
    onRefresh,
    isInternetConnection,
    isHeroCardBookmarked,
    goToDetailScreen,
    goToShortReportsScreen,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleTimeUpdate,
    timeWatched
  } = useInvestigationDetailScreenViewModel();
  const [theme] = useTheme(currentPageTheme);
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const crewData = data?.Video?.productions?.crews || [];
  const loading = videoLoading || recentlyAddedLoading || nPlusFocusShortListingLoading;
  const { shouldAutoPlay } = useSettingsStore();
  const slideAnim = useMemo(() => new Animated.Value(1000), []);

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

  const renderItem = ({ item, index }: { item: InvestigationItem; index: number }) => (
    <InfoCard
      title={item?.title}
      titleFontFamily={fonts.notoSerif}
      titleFontSize={fontSize.s}
      subTitleColor={theme.labelsTextLabelPlace}
      imageUrl={
        item?.productions?.specialImage?.sizes?.portrait?.url ||
        item?.content?.heroImage?.sizes?.portrait?.url ||
        ''
      }
      item={item}
      imageWidth={actuatedNormalize(178)}
      contentContainerStyle={styles.flatlistContainerStyle}
      titleStyles={styles.titleStyles}
      onPress={() => goToDetailScreen(item?.slug ?? '', 'recentlyAdded', index)}
      aspectRatio={9 / 16}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.carouselTextDarkTheme}
        buttonStyle={styles.buttonStyle}
      />
      {!isInternetConnection ? (
        <ErrorScreen status="noInternet" onRetry={onRefresh} />
      ) : loading ? (
        <InvestigationDetailSkeleton />
      ) : (
        <>
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
            analyticsContentType={`${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`}
            analyticsScreenName={ANALYTICS_COLLECTION.NPLUS_FOCUS}
            analyticsOrganism={ANALYTICS_ORGANISMS.VIDEOS.HERO}
            data={data}
            analyticsIdPage={data?.Video?.id}
            analyticScreenPageWebUrl={data?.Video?.slug}
            analyticsPublication={data?.Video?.publishedAt}
            analyticsDuration={data?.Video?.videoDuration}
            analyticsTags={data?.Video?.topics
              ?.map((topic: { title?: string }) => topic?.title)
              ?.join(',')}
            analyticVideoType={data?.Video?.content?.videoType}
            analyticsProduction={`${data?.Video?.channel?.title}_${data?.Video?.production?.title}`}
          />

          <ScrollView
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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
              <LexicalContentRenderer
                content={data?.Video?.excerpt || data?.Video?.content?.summary || ''}
                customTheme={currentPageTheme}
                contentTextStyle={styles.summaryText}
                excludeHeadingMarginBottom={true}
              />
            </View>

            {data?.Video?.productions?.interactivePage && (
              <CustomButton
                variant="outlined"
                outlinedBorderColor={theme.carouselTextDarkTheme}
                buttonText={t('screens.nPlusFocus.text.viewInteractiveResearch')}
                buttonStyles={styles.lastEpisodeButton}
                onPress={handleInteractiveResearchPress}
                buttonTextStyles={styles.lastEpisodeButtonText}
                getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
              />
            )}

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
                  <ShareIcon color={theme.carouselTextDarkTheme} />
                </Pressable>

                <Pressable
                  style={styles.headerButton}
                  onPress={() => handleBookmarkPress(data?.Video?.id)}
                >
                  {isHeroCardBookmarked ? (
                    <CheckedBookMark color={theme.carouselTextDarkTheme} />
                  ) : (
                    <BookMark color={theme.carouselTextDarkTheme} />
                  )}
                </Pressable>
              </View>
            </View>
            <View style={styles.separator} />

            {crewData.length > 0 && (
              <>
                <CustomText
                  size={fontSize['2xl']}
                  textStyles={styles.researchBy}
                  fontFamily={fonts.notoSerifExtraCondensed}
                >
                  {t('screens.nPlusFocus.text.researchBy')}
                </CustomText>

                <FlatList
                  scrollEnabled={false}
                  data={displayData}
                  keyExtractor={(item, index) => `${item?.id || index}`}
                  contentContainerStyle={styles.mainContainerStyle}
                  renderItem={({ item }) => (
                    <View style={styles.crewContainer}>
                      <View style={[styles.imageContainerStyle]}>
                        {!item?.crewMemberPhoto ? (
                          <FallbackImage />
                        ) : (
                          <Image
                            source={{ uri: item?.crewMemberPhoto?.url }}
                            style={styles.image}
                            resizeMode="cover"
                          />
                        )}
                      </View>

                      <View style={styles.researchContainer}>
                        <CustomText
                          textStyles={styles.titleStyles}
                          fontFamily={fonts.notoSerifExtraCondensed}
                          size={fontSize.s}
                        >
                          {item?.crewMemberName}
                        </CustomText>

                        <CustomText
                          fontFamily={fonts.franklinGothicURW}
                          weight="Boo"
                          textStyles={styles.crewSubTitleStyles}
                          size={fontSize.xs}
                        >
                          {item?.crewMemberJob}
                        </CustomText>
                      </View>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <CustomDivider style={styles.divider} />}
                />

                {hasMore && (
                  <CustomButton
                    variant="text"
                    buttonText={t('screens.nPlusFocus.text.seeMore')}
                    onPress={handleViewMore}
                    buttonTextFontFamily={fonts.franklinGothicURW}
                    buttonTextWeight="Dem"
                    buttonStyles={styles.seeAllStyles}
                  />
                )}

                {hasLess && (
                  <CustomButton
                    variant="text"
                    buttonText={t('screens.nPlusFocus.text.seeMore')}
                    onPress={handleViewLess}
                    buttonTextFontFamily={fonts.franklinGothicURW}
                    buttonTextWeight="Dem"
                    buttonStyles={styles.seeAllStyles}
                  />
                )}
              </>
            )}

            {data?.Video?.productions?.awards?.length > 0 && (
              <View>
                <CustomText
                  size={fontSize['2xl']}
                  textStyles={styles.awardsSectionTitle}
                  fontFamily={fonts.notoSerifExtraCondensed}
                >
                  {t('screens.nPlusFocus.text.awards')}
                </CustomText>

                <FlatList
                  scrollEnabled={false}
                  data={data?.Video?.productions?.awards}
                  keyExtractor={(item, index) => `${item?.id || index}`}
                  contentContainerStyle={styles.mainContainerStyle}
                  renderItem={({ item }) => (
                    <View style={styles.awardsContainer}>
                      <View style={styles.researchContainer}>
                        {item?.awardName && (
                          <CustomText
                            textStyles={styles.awardTitleStyles}
                            fontFamily={fonts.franklinGothicURW}
                            weight="Dem"
                            size={fontSize.s}
                          >
                            {item?.awardName}
                          </CustomText>
                        )}

                        {item?.awardDescription && (
                          <CustomText
                            fontFamily={fonts.franklinGothicURW}
                            weight="Boo"
                            textStyles={styles.subTitleStyles}
                            size={fontSize.xs}
                          >
                            {item?.awardDescription}
                          </CustomText>
                        )}

                        {item?.awardWon && (
                          <View style={styles.awardsSection}>
                            <BulletIcon
                              width={actuatedNormalize(7)}
                              height={actuatedNormalize(7)}
                              style={styles.icon}
                            />
                            <CustomText
                              textStyles={styles.awardsStyles}
                              size={fontSize.xs}
                              fontFamily={fonts.franklinGothicURW}
                              weight="Boo"
                            >
                              {item?.awardWon}
                            </CustomText>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <CustomDivider style={styles.divider} />}
                  ListFooterComponent={() => <CustomDivider style={styles.divider} />}
                />
              </View>
            )}

            {(videoItems ?? []).length > 0 && (
              <View>
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
                    onBookmarkPress={(item) => handleBookmarkPress(item.id)}
                    headingStyles={styles.headingStyles}
                    subHeadingStyles={styles.subheadingStyles}
                    iconColor={theme.carouselTextDarkTheme}
                    bottomRowStyles={styles.bottomRowStyles}
                    onCardPress={(item, index) =>
                      goToDetailScreen(item?.slug ?? '', 'shortReports', index)
                    }
                    imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
                    listContainerStyle={styles.listContainerStyle}
                  />
                )}

                {latestPostItems.map((item, index: number) => (
                  <BookmarkCard
                    key={index.toString()}
                    category={
                      item?.topics?.[0]?.title ??
                      item?.category?.title ??
                      t('screens.storyPage.relatedStoryBlock.general')
                    }
                    headingTextStyles={styles.headingTextStyles}
                    heading={item?.title}
                    headingColor={theme.carouselTextDarkTheme}
                    subHeading={`${item?.readTime ?? ''} min`}
                    isBookmarkChecked={item?.isBookmarked}
                    subHeadingColor={theme.carouselTextDarkTheme}
                    id={item?.id ?? ''}
                    onPressingBookmark={() => handleBookmarkPress(item?.id)}
                    primaryColor={theme.carouselTextDarkTheme}
                    containerStyle={styles.bookmarkCardContainer}
                    pressedBackgroundColor={theme.mainBackgrunforproductionPage}
                    onPress={() => goToShortReportsScreen(item?.slug ?? '')}
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
              </View>
            )}

            {recentlyAddedData?.Videos?.docs?.length > 0 && (
              <>
                <CustomText
                  textStyles={styles.viewInvestigationTextStyles}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  size={fontSize['2xl']}
                >
                  {t('screens.nPlusFocus.text.recentlyAdded')}
                </CustomText>
                <FlatList
                  scrollEnabled={false}
                  ref={flatListRef}
                  data={recentlyAddedData?.Videos?.docs}
                  renderItem={renderItem}
                  numColumns={2}
                  keyExtractor={(_, i) => `item-${i}`}
                  onEndReachedThreshold={0.5}
                  style={styles.flatList}
                  columnWrapperStyle={styles.columnWrapper}
                  initialNumToRender={6}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.recentlyAddedContainer}
                />
              </>
            )}
          </ScrollView>

          <CustomToast
            type={toastType}
            message={toastMessage}
            isVisible={!!toastMessage}
            onDismiss={() => setToastMessage('')}
            toastContainerStyle={styles.toastContainer}
          />
        </>
      )}
      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default InvestigationDetailScreen;
