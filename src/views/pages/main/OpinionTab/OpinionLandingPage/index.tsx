import { FlatList, ListRenderItem, RefreshControl, View } from 'react-native';
import React, { useCallback, useMemo, memo } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { fontSize } from '@src/config/styleConsts';
import { SearchIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { themeStyles } from '@src/views/pages/main/OpinionTab/OpinionLandingPage/styles';
import useOpinionViewModel from '@src/viewModels/main/OpinionTab/useOpinionViewModel';
import OpinionCarouselCard, {
  type OpinionItem
} from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionCaraouselCard';
import CarouselCard from '@src/views/molecules/CarouselCard';
import CustomToast from '@src/views/molecules/CustomToast';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import CustomText from '@src/views/atoms/CustomText';
import OpinionRecentSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionRecentSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import OpinionOtherSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionOtherSkeleton';
import OpinionSecondarySkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionSecondarySkeleton';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import CustomButton from '@src/views/molecules/CustomButton';
import InfoSnapCarousel from '@src/views/organisms/InfoSnapCarousel';
import { CarouselData } from '@src/models/main/Opinion/Opinion';
import LoadMoreSkeletonLoader from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen/components/LoadMoreSkeletonLoader';

const SEE_MORE_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/* -------------------------------------------------------------------------- */
/*                      Memoized Opinion Bookmark Item                        */
/* -------------------------------------------------------------------------- */

interface OpinionBookmarkItemProps {
  item: CarouselData;
  index: number;
  styles: ReturnType<typeof themeStyles>;
  theme: ReturnType<typeof useOpinionViewModel>['theme'];
  onBookmarkPress: (id: string, isBookmark?: boolean) => void;
  onPress: (slug: string, collection: string) => void;
}

const OpinionBookmarkItem = memo(
  ({ item, index, styles, theme, onBookmarkPress, onPress }: OpinionBookmarkItemProps) => {
    const publishedAt = useMemo(
      () => formatMexicoDateTime(item?.publishedAt ?? ''),
      [item?.publishedAt]
    );
    const subHeadingText = useMemo(() => {
      if (typeof publishedAt === 'string') {
        return (publishedAt.split('|')[0] || '').trim();
      }
      return (publishedAt as { date?: string })?.date ?? '';
    }, [publishedAt]);

    const handleBookmarkPress = useCallback(
      (id: string, _type?: string, isBookmark?: boolean) =>
        onBookmarkPress(id ?? item.id ?? '', isBookmark),
      [onBookmarkPress, item.id]
    );

    const handlePress = useCallback(
      () => onPress(item?.slug ?? '', item?.collection ?? ''),
      [onPress, item?.slug, item?.collection]
    );

    return (
      <BookmarkCard
        isVideo={item?.collection === 'videos'}
        category={item?.authors?.[0]?.name ?? ''}
        categoryFont={fonts.franklinGothicURW}
        categoryTextSize={fontSize.xs}
        categoryTextStyles={styles.categoryTextStyles}
        categoryWeight="Boo"
        primaryColor={theme.labelsTextLabelPlay}
        heading={item?.title ?? ''}
        headingFont={fonts.notoSerifExtraCondensed}
        headingTextSize={fontSize.s}
        headingTextStyles={styles.headerStyle}
        subHeadingWeightText="Boo"
        subHeadingTextStyles={styles.subHeadingTextStyles}
        subHeading={subHeadingText}
        isBookmarkChecked={item?.isBookmarked}
        id={item.id ?? ''}
        subHeadingColor={theme.labelsTextLabelPlay}
        imageUrl={item?.heroImages?.[0]?.url ?? ''}
        onPressingBookmark={handleBookmarkPress}
        onPress={handlePress}
        containerStyle={styles.bookmarkCardContainer}
        index={index}
      />
    );
  }
);

OpinionBookmarkItem.displayName = 'OpinionBookmarkItem';

/* -------------------------------------------------------------------------- */
/**
 * OpinionLandingPage
 *
 * This component renders the main landing page for the "Opinions" section.
 * It displays a list of featured and recent opinions, and provides the ability to bookmark and share opinions.
 * The page handles data loading, pagination for additional opinions, bookmark modal interactions, and shows toast notifications for user actions.
 */
/* -------------------------------------------------------------------------- */

const OpinionLandingPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    theme,
    hasEnoughOpinions,
    primaryOpinions,
    secondaryOpinions,
    handleBookmarkPress,
    toastType,
    toastMessage,
    bookmarkModalVisible,
    setToastMessage,
    setBookmarkModalVisible,
    moreOpinionList,
    displayMoreOpinionList,
    moreOpinionListLoading,
    onRetry,
    refreshLoader,
    isInternetConnection,
    hasNext,
    onIncreaseLimitByTen,
    handleNavigationToDetailPage,
    recentOpinionsLoading,
    handleSharePress,
    isLoadMore,
    handleSearchPress,
    handleBookmarkAnalytics,
    handleTapInTextAnalytics,
    handleSecondaryBookmarkAnalytics,
    handleSecondaryTapInTextAnalytics,
    handleRecentOpinionsAnalytics,
    handleDisplayMoreBookmarkAnalytics,
    handleDisplayMoreTapInTextAnalytics
  } = useOpinionViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);
  const loading = recentOpinionsLoading || moreOpinionListLoading;
  const fetchData = !moreOpinionList || moreOpinionList.length === 0 || !hasEnoughOpinions;

  const otherOpinionsList = useMemo(
    () => displayMoreOpinionList?.slice(8) ?? [],
    [displayMoreOpinionList]
  );

  const recentOpinionsList = useMemo(
    () => displayMoreOpinionList?.slice(0, 8) ?? [],
    [displayMoreOpinionList]
  );

  const onSharePressCarousel = useCallback(
    (item: OpinionItem) => {
      if (item.fullPath) handleSharePress({ fullPath: item.fullPath });
    },
    [handleSharePress]
  );

  const onRecentItemPress = useCallback(
    (item: CarouselData) => {
      const index = recentOpinionsList.findIndex((i) => i.id === item.id);
      handleRecentOpinionsAnalytics?.(item, index);
      handleNavigationToDetailPage(item?.slug ?? '', item?.collection ?? '');
    },
    [handleNavigationToDetailPage, recentOpinionsList, handleRecentOpinionsAnalytics]
  );

  const renderOtherOpinionItem = useCallback<ListRenderItem<CarouselData>>(
    ({ item, index }) => (
      <OpinionBookmarkItem
        item={item}
        index={index}
        styles={styles}
        theme={theme}
        onBookmarkPress={(id: string, isBookmark?: boolean) => {
          handleDisplayMoreBookmarkAnalytics?.(item, Boolean(isBookmark));
          handleBookmarkPress(id);
        }}
        onPress={() => {
          handleDisplayMoreTapInTextAnalytics?.(item, index);
          handleNavigationToDetailPage(item?.slug ?? '', item?.collection ?? '');
        }}
      />
    ),
    [styles, theme, handleBookmarkPress, handleNavigationToDetailPage]
  );

  const keyExtractor = useCallback((item: CarouselData) => item?.id ?? '', []);

  const ItemSeparator = useCallback(() => <View style={styles.itemSeparator} />, [styles]);

  const recentCarouselRenderItemProps = useCallback(
    (item: CarouselData) => ({
      id: item?.id,
      imageUrl: item?.authors?.[0]?.profilePicture?.sizes?.square?.url ?? '',
      title: item?.authors?.[0]?.name ?? '',
      subTitle: item?.title ?? '',
      imageStyle: styles.imageStyle,
      titleFontFamily: fonts.franklinGothicURW,
      titleFontSize: fontSize.xs,
      titleFontWeight: 'Boo' as const,
      titleStyles: styles.titleStyles,
      subTitleColor: theme.carouselTextDarkTheme,
      subTitleFontFamily: fonts.notoSerif,
      subTitleFontWeight: 'R' as const,
      subTitleFontSize: fontSize.xs,
      subTitleStyles: styles.subTitleStyles,
      contentContainerStyle: styles.contentContainerStyle
    }),
    [styles, theme.carouselTextDarkTheme]
  );

  const listHeaderComponent = useMemo(() => {
    if (!isInternetConnection && fetchData) {
      return (
        <ErrorScreen
          status="noInternet"
          onRetry={onRetry}
          containerStyles={styles.errorContainer}
        />
      );
    }

    if (!loading && fetchData) {
      return (
        <ErrorScreen
          status="error"
          showErrorButton={true}
          OnPressRetry={onRetry}
          buttonText={t('screens.splash.text.tryAgain')}
          containerStyles={styles.errorContainer}
        />
      );
    }

    if (recentOpinionsLoading) {
      return <OpinionSecondarySkeleton />;
    }

    return (
      <View>
        <OpinionCarouselCard
          data={primaryOpinions}
          loading={recentOpinionsLoading}
          handleBookmarkPress={handleBookmarkPress}
          onSharePress={onSharePressCarousel}
          handleBookmarkAnalytics={handleBookmarkAnalytics}
          handleTapInTextAnalytics={handleTapInTextAnalytics}
        />
        <View style={styles.carouselCardContainer}>
          {secondaryOpinions.map((item) => (
            <View key={item.id} style={styles.cardBottomBorder}>
              <CarouselCard
                item={{ ...item, imageUrl: item.heroImages?.[0]?.url }}
                headingStyles={styles.verticalHeading}
                titleFont={fonts.notoSerifExtraCondensed}
                titleSize={fontSize.s}
                contentContainerStyle={styles.verticalCategoryContainer}
                imageStyle={styles.verticalImageStyle}
                subheadingStyles={styles.verticalSubheading}
                imagePosition="right"
                showBookmark
                publishedAt={item.publishedAt}
                showOnlyDate
                type="publishedAt"
                subText={item.authors?.[0]?.name ?? ''}
                publishedTextStyle={styles.publishedTextStyle}
                onBookmarkPress={(isBookmark) => {
                  handleSecondaryBookmarkAnalytics?.(
                    Boolean(isBookmark),
                    item.title || '',
                    item.collection || ''
                  );
                  handleBookmarkPress(item.id);
                }}
                onPress={() => {
                  const cardIndex = secondaryOpinions.findIndex(
                    (opinion) => opinion.id === item.id
                  );
                  handleSecondaryTapInTextAnalytics?.(item, cardIndex);
                  handleNavigationToDetailPage(item?.slug ?? '', item?.collection ?? '');
                }}
                showPlayIcon={item?.collection === 'videos'}
                bottomRowStyles={styles.bottomRowStyles}
              />
            </View>
          ))}
        </View>

        {((displayMoreOpinionList?.length ?? 0) > 0 || moreOpinionListLoading) && (
          <>
            <CustomText
              size={fontSize['2xl']}
              fontFamily={fonts.notoSerifExtraCondensed}
              textStyles={styles.opinionRecentTitle}
            >
              {t('screens.opinion.screen.recentOpinions')}
            </CustomText>
            {moreOpinionListLoading && !isLoadMore ? (
              <OpinionRecentSkeleton
                itemWidth={actuatedNormalize(190)}
                imageSize={actuatedNormalize(80)}
                separatorWidth={actuatedNormalize(2)}
              />
            ) : (
              <InfoSnapCarousel
                data={recentOpinionsList}
                onItemPress={onRecentItemPress}
                ItemSeparatorComponent={ItemSeparator}
                renderItemProps={recentCarouselRenderItemProps}
              />
            )}
            {(displayMoreOpinionList?.length ?? 0) > 8 && (
              <CustomText
                size={fontSize['2xl']}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.otherOpinions}
              >
                {t('screens.opinion.screen.otherOpinions')}
              </CustomText>
            )}
            {moreOpinionListLoading && !isLoadMore && <OpinionOtherSkeleton />}
          </>
        )}
      </View>
    );
  }, [
    isInternetConnection,
    fetchData,
    onRetry,
    styles,
    loading,
    t,
    recentOpinionsLoading,
    primaryOpinions,
    handleBookmarkPress,
    onSharePressCarousel,
    secondaryOpinions,
    handleNavigationToDetailPage,
    displayMoreOpinionList,
    moreOpinionListLoading,
    isLoadMore,
    recentOpinionsList,
    onRecentItemPress
  ]);

  const listFooterComponent = useMemo(() => {
    if (!((displayMoreOpinionList?.length ?? 0) > 0 || moreOpinionListLoading)) return null;
    if (moreOpinionListLoading && !isLoadMore) return null;

    if (isLoadMore) {
      return (
        <View style={styles.seeMoreView}>
          <LoadMoreSkeletonLoader />
        </View>
      );
    }

    if (hasNext) {
      return (
        <View style={styles.seeMoreView}>
          <CustomButton
            onPress={onIncreaseLimitByTen}
            variant="text"
            buttonText={t('screens.liveBlog.text.seeMore')}
            buttonTextSize={fontSize.xs}
            buttonTextFontFamily={fonts.franklinGothicURW}
            buttonTextWeight="Dem"
            buttonTextColor={theme.colorSecondary600}
            buttonTextStyles={styles.seeMoreText}
            hitSlop={SEE_MORE_HIT_SLOP}
          />
        </View>
      );
    }

    return null;
  }, [
    displayMoreOpinionList,
    moreOpinionListLoading,
    isLoadMore,
    styles,
    theme,
    hasNext,
    onIncreaseLimitByTen,
    t
  ]);

  const showFlatList =
    !(!isInternetConnection && fetchData) &&
    !(!loading && fetchData) &&
    !recentOpinionsLoading &&
    ((displayMoreOpinionList?.length ?? 0) > 0 || moreOpinionListLoading);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <CustomHeader
        variant="secondary"
        headerText={t('screens.opinion.screen.title')}
        headerTextSize={fontSize.s}
        iconComponent={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        headerStyle={styles.headerContainer}
        buttonStyle={styles.searchButton}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Med"
        headerTextStyles={styles.headerTextStyles}
        onPress={handleSearchPress}
      />

      <FlatList
        data={showFlatList ? otherOpinionsList : []}
        renderItem={renderOtherOpinionItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        initialNumToRender={6}
        windowSize={5}
        contentContainerStyle={styles.containerStyle}
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
    </SafeAreaView>
  );
};

export default OpinionLandingPage;
