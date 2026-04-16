import React from 'react';
import { FlatList, View, RefreshControl, ScrollView, Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { themeStyles } from '@src/views/pages/main/Videos/Programs/styles';
import { fonts } from '@src/config/fonts';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { ArrowIcon, BookMark, CheckedBookMark, SearchIcon, ShareIcon } from '@src/assets/icons';
import { fontSize } from '@src/config/styleConsts';
import InfoCard from '@src/views/molecules/InfoCard';
import TopicChips from '@src/views/organisms/TopicChips';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useProgramsViewModel from '@src/viewModels/main/Videos/Programs/useProgramsViewModel';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import {
  CombinedRelatedVideos,
  filteredEpisodes,
  ProgramItem
} from '@src/models/main/Videos/Programs';
import { FallbackImage } from '@src/assets/images';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomToast from '@src/views/molecules/CustomToast';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { type HorizontalInfoItem } from '@src/views/organisms/HorizontalInfoList';
import ProgramasSkeletonLoader from '@src/views/pages/main/Videos/Programs/components/ProgramasSkeletonLoader';
import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import RelatedVideoSkeletonLoader from '@src/views/pages/main/Videos/Programs/components/RelatedVideoSkeletonLoader';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomImage from '@src/views/atoms/CustomImage';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import SnapHorizontalList, {
  type SnapHorizontalListItem
} from '@src/views/organisms/SnapHorizontalList';

const Programs = () => {
  const {
    theme,
    t,
    goBack,
    handleSearchPress,
    chipsTopic,
    programasData,
    onProgramsTogglePress,
    handleLoadMore,
    programsLoading,
    slug,
    handleCardPress,
    isInternetConnection,
    onRetry,
    flatListRef,
    refreshLoader,
    programData,
    onShare,
    isBookmark,
    onToggleBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    toastType,
    toastMessage,
    setToastMessage,
    handleRelatedCardPress,
    handleGoToAllEpisodes,
    relatedVideoData,
    hasNextPage,
    programasNPlusData,
    onSeeAllProgramsPress,
    onPresentersPress,
    programLoading,
    relatedVideoLoading,
    programasNPlusLoading,
    showBannerAds,
    combinedRelatedVideos,
    filteredEpisodes,
    loadingMore
  } = useProgramsViewModel();

  const styles = themeStyles(theme);

  const isInitialLoading =
    refreshLoader || programsLoading || !programasData || programasData?.length === 0;

  const renderSkeleton = (i: number) => (
    <View style={styles.skeletonWrapper} key={`skeleton-${i}`}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(222)}
        width="100%"
        style={styles.skeletonSpacing}
      />
      <SkeletonLoader
        height={actuatedNormalizeVertical(20)}
        width="70%"
        style={styles.skeletonSpacing}
      />
      <SkeletonLoader height={actuatedNormalizeVertical(10)} width="90%" />
    </View>
  );

  const renderItem = ({ item, index }: { item: ProgramItem; index: number }) =>
    isInitialLoading ? (
      renderSkeleton(index)
    ) : (
      <InfoCard
        onPress={() => handleCardPress(item, index)}
        title={item?.title}
        titleFontFamily={fonts.notoSerif}
        titleFontWeight="R"
        titleFontSize={fontSize.s}
        subTitleColor={theme.labelsTextLabelPlay}
        subTitleFontSize={fontSize.xxs}
        subTitleFontFamily={fonts.franklinGothicURW}
        subTitle={item?.schedule}
        subTitleFontWeight="Boo"
        subTitleStyles={styles.subTitleStyles}
        imageUrl={item?.heroImage?.sizes?.vintage?.url ?? ''}
        item={item}
        aspectRatio={4 / 5}
        imageWidth={178}
        contentContainerStyle={styles.contentContainerStyle}
        titleStyles={styles.titleStyles}
      />
    );

  const data = isInitialLoading ? Array.from({ length: 6 }) : programasData || [];

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerTextWeight="Dem"
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextStyles={styles.headerTextStyles}
        additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        variant="dualVariant"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        onAdditionalButtonPress={handleSearchPress}
      />

      {slug === null ? (
        <>
          <TopicChips
            topics={chipsTopic}
            headingFontSize={fontSize['4xl']}
            headingFontWeight="R"
            headingFontFamily={fonts.notoSerifExtraCondensed}
            preselect
            isCategory={true}
            headingTextstyle={styles.topicChipsTitle}
            heading={t('screens.program.text.allPrograms')}
            mainContainerstyle={styles.topicChipsContainerStyle}
            onPress={(value) => {
              const categoryIndex = chipsTopic.findIndex((topic) =>
                typeof value === 'string' ? topic.title === value : topic.slug === value.slug
              );
              onProgramsTogglePress(value, categoryIndex);
            }}
          />

          {!isInternetConnection && (programasData?.length === 0 || !programasData) ? (
            <ErrorScreen
              status="noInternet"
              onRetry={onRetry}
              contentContainerStyle={styles.errorContainer}
            />
          ) : (programasData?.length === 0 || !programasData) && !programsLoading ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              scrollEventThrottle={16}
              refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
            >
              <ErrorScreen
                status="error"
                showErrorButton={true}
                OnPressRetry={onRetry}
                buttonText={t('screens.splash.text.tryAgain')}
                contentContainerStyle={styles.errorContainer}
              />
            </ScrollView>
          ) : (
            <FlatList
              ref={flatListRef}
              data={data}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={(_, i) => `item-${i}`}
              onEndReachedThreshold={0.5}
              style={styles.flatList}
              columnWrapperStyle={styles.columnWrapper}
              ListFooterComponent={() =>
                hasNextPage ? (
                  <Pressable
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={handleLoadMore}
                  >
                    {loadingMore ? (
                      <FlatList
                        data={[1, 2, 3, 4, 5]}
                        keyExtractor={(_, index) => `skeleton-${index}`}
                        numColumns={2}
                        renderItem={({ index }) => renderSkeleton(index)}
                        columnWrapperStyle={styles.columnWrapper}
                      />
                    ) : (
                      <CustomText
                        weight={'Dem'}
                        fontFamily={fonts.franklinGothicURW}
                        size={fontSize.xs}
                        color={theme.actionCTATextDefault}
                        textStyles={styles.seeMoreText}
                      >
                        {t('screens.liveBlog.text.seeMore')}
                      </CustomText>
                    )}
                  </Pressable>
                ) : null
              }
              refreshing={refreshLoader}
              onRefresh={onRetry}
              initialNumToRender={6}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : !programData && !programLoading ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          {!isInternetConnection && !programData ? (
            <ErrorScreen
              status="noInternet"
              onRetry={onRetry}
              contentContainerStyle={styles.errorContainer}
            />
          ) : (
            <ErrorScreen
              status="error"
              showErrorButton={true}
              OnPressRetry={onRetry}
              buttonText={t('screens.splash.text.tryAgain')}
              contentContainerStyle={styles.errorContainer}
            />
          )}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        >
          {programLoading ? (
            <ProgramasSkeletonLoader />
          ) : (
            <>
              <CustomImage
                source={
                  programData?.heroImage?.sizes?.vintage?.url
                    ? { uri: programData.heroImage.sizes.vintage.url }
                    : undefined
                }
                style={styles.programHeroImage}
                fallbackComponent={
                  <View style={styles.fallbackImageContainerStyle}>
                    <FallbackImage width={'100%'} height={'100%'} />
                  </View>
                }
              />

              <View style={styles.programDetailContainer}>
                <CustomText
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.programTitle}
                  size={fontSize['2xl']}
                >
                  {programData?.title}
                </CustomText>
                <CustomText
                  textStyles={styles.scheduleText}
                  fontFamily={fonts.franklinGothicURW}
                  weight="Med"
                  size={fontSize.xs}
                  color={theme.labelsTextLabelPlace}
                >
                  {programData?.schedule}
                </CustomText>
                <CustomButton
                  onPress={() => handleRelatedCardPress(programData?.lastSlug, -1)}
                  buttonText={t('screens.program.text.watchLatestEpisode')}
                  buttonStyles={styles.lastEpisodeButton}
                />

                <LexicalContentRenderer content={programData?.description} spacingHorizontal={0} />

                <View style={styles.bookMarkContainer}>
                  <Pressable onPress={onShare}>
                    <ShareIcon color={theme.iconIconographyGenericState} />
                  </Pressable>
                  <Pressable
                    onPress={() => programData?.id && onToggleBookmark(programData?.id, 'Content')}
                  >
                    {isBookmark ? (
                      <CheckedBookMark color={theme.iconIconographyGenericState} />
                    ) : (
                      <BookMark color={theme.iconIconographyGenericState} />
                    )}
                  </Pressable>
                </View>
              </View>
            </>
          )}
          {combinedRelatedVideos.length > 0 &&
            (!programLoading ? (
              <FlatList
                data={combinedRelatedVideos}
                keyExtractor={(item) => item?.value?.id || `video-${Math.random()}`}
                renderItem={({ item, index }: { item: CombinedRelatedVideos; index: number }) => (
                  <CarouselCard
                    type={'videos'}
                    onPress={() => handleRelatedCardPress(item?.value?.slug || '', index)}
                    title={item?.value?.title || ''}
                    minutesAgo={formatDurationToMinutes(item?.value?.videoDuration || 0)}
                    imageUrl={item?.value?.content?.heroImage?.url || ''}
                    isBookmarked={false}
                    headingStyles={styles.verticalHeading}
                    contentContainerStyle={styles.verticalVideoContainer}
                    imageStyle={styles.verticalImageStyle}
                    showBookmark={false}
                    subheadingStyles={styles.verticalSubheading}
                  />
                )}
                contentContainerStyle={styles.relatedVideosContainer}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                ListFooterComponent={() => <View style={styles.divider} />}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : null)}

          {showBannerAds && <AdBannerContainer containerStyle={styles.adBannerContainer} />}

          {programData?.talents?.length > 0 && (
            <View style={styles.talentsContainer}>
              {programLoading ? (
                <HorizontalInfoListSkeleton
                  imageHeight={actuatedNormalizeVertical(80)}
                  imageWidth={actuatedNormalizeVertical(85)}
                  imageStyle={styles.programSkeletonImage}
                  showSeeAll={false}
                />
              ) : (
                <SnapHorizontalList
                  heading={'Presentadores'}
                  onPress={(item: HorizontalInfoItem) => {
                    // Talents have slug property, extract it from the item
                    const slug = item?.slug;
                    if (slug) {
                      onPresentersPress({ slug });
                    }
                  }}
                  data={programData?.talents as HorizontalInfoItem[]}
                  contentContainerStyle={styles.programContainer}
                  titleFontFamily={fonts.franklinGothicURW}
                  titleFontSize={fontSize.xs}
                  titleFontWeight={'R'}
                  titleStyles={styles.talentsTitle}
                  titleColor={theme.newsTextDarkThemePages}
                  headingStyles={styles.planetHeading}
                  imageStyle={styles.programImage}
                  seeAllText={''}
                  getImageUrl={(item: HorizontalInfoItem) => {
                    // Talents have heroImage property
                    const talent = item;
                    return talent?.heroImage?.url ?? '';
                  }}
                  aspectRatio={1}
                />
              )}
            </View>
          )}

          {relatedVideoData?.length > 3 &&
            (relatedVideoLoading ? (
              <RelatedVideoSkeletonLoader arrayList={[1, 2, 3, 4, 5, 6]} showHeading={true} />
            ) : (
              <>
                <View style={styles.relatedContainer}>
                  <CustomText
                    fontFamily={fonts.notoSerifExtraCondensed}
                    size={fontSize['4xl']}
                    weight="R"
                    textStyles={styles.relatedHeading}
                  >
                    {t('screens.program.text.episodes')}
                  </CustomText>

                  <FlatList
                    data={filteredEpisodes.slice(0, 6)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }: { item: filteredEpisodes; index: number }) => (
                      <CarouselCard
                        type="videos"
                        onPress={() => handleRelatedCardPress(item?.slug || '', index + 3)}
                        title={item?.title || ''}
                        minutesAgo={formatDurationToMinutes(item?.videoDuration || 0)}
                        imageUrl={item?.content?.heroImage?.url || ''}
                        isBookmarked={false}
                        headingStyles={styles.verticalHeading}
                        contentContainerStyle={styles.verticalVideoContainer}
                        imageStyle={styles.verticalImageStyle}
                        showBookmark={false}
                        subheadingStyles={styles.verticalSubheading}
                      />
                    )}
                    contentContainerStyle={styles.relatedVideosContainer}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    ListFooterComponent={() => <View style={styles.divider} />}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />

                  <Pressable
                    style={styles.seeAllButton}
                    onPress={handleGoToAllEpisodes}
                    hitSlop={10}
                  >
                    <CustomText
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      size={fontSize.xs}
                      textStyles={styles.seeAllText}
                    >
                      {t('screens.videos.text.allEpisodes')}
                    </CustomText>
                    <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
                  </Pressable>
                </View>
              </>
            ))}

          {programasNPlusData?.length > 0 ? (
            programasNPlusLoading ? (
              <HorizontalInfoListSkeleton
                imageHeight={actuatedNormalizeVertical(220)}
                imageWidth={actuatedNormalizeVertical(178)}
              />
            ) : (
              <View style={styles.lastRelatedContainer}>
                <CustomText
                  fontFamily={fonts.notoSerifExtraCondensed}
                  size={fontSize['4xl']}
                  textStyles={styles.relatedHeading}
                >
                  {t('screens.program.text.programasNplus')}
                </CustomText>
                <SnapHorizontalList
                  imageWidth={164}
                  aspectRatio={4 / 5}
                  onPress={(item) => {
                    const index = programasNPlusData?.findIndex(
                      (data: SnapHorizontalListItem) =>
                        data.id === item.id || data.slug === item.slug
                    );
                    handleCardPress(item, index !== undefined ? index : undefined);
                  }}
                  data={programasNPlusData as SnapHorizontalListItem[]}
                  imageStyle={styles.imageStyle}
                  titleColor={theme.iconIconographyGenericState}
                  titleFontFamily={fonts.notoSerifExtraCondensed}
                  titleFontWeight={'R'}
                  titleFontSize={fontSize.m}
                  titleStyles={styles.programTitleStyle}
                  subTitleColor={theme.labelsTextLabelPlay}
                  subTitleStyles={styles.programSubtitleStyle}
                  seeAllText={t('screens.videos.text.seeAllPrograms')}
                  onSeeAllPress={onSeeAllProgramsPress}
                  getImageUrl={(item: ProgramItem) => item?.heroImage?.sizes?.vintage?.url ?? ''}
                />
              </View>
            )
          ) : null}
        </ScrollView>
      )}

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
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
      />
    </SafeAreaView>
  );
};

export default Programs;
