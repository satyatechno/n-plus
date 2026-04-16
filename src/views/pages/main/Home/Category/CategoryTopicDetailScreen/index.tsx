import React, { useMemo, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import CustomHeader from '@src/views/molecules/CustomHeader';
import CarouselCard from '@src/views/molecules/CarouselCard';
import CustomText from '@src/views/atoms/CustomText';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomImage from '@src/views/atoms/CustomImage';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import TopicChips from '@src/views/organisms/TopicChips';
import CustomModal from '@src/views/organisms/CustomModal';
import CategoryContentList from '@src/views/templates/main/CategoryContentList';
import RecentCategorySkeletonLoader from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen/components/RecentCategorySkeletonLoader';
import MoreFromCategorySkeletonLoader from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen/components/MoreFromCategorySkeletonLoader';
import LoadMoreSkeletonLoader from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen/components/LoadMoreSkeletonLoader';
import { BookMark, CheckedBookMark, PlayCircle } from '@src/assets/icons';
import { FallbackImage } from '@src/assets/images';
import { themeStyles } from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen/styles';
import useCategoryTopicDetailViewModel from '@src/viewModels/main/Home/Category/CategoryTopicDetail/useCategoryTopicDetailViewModel';
import { TransformedCategoryItem } from '@src/models/main/Home/Category/CategoryTopicDetail';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CountdownTimerWidget from '@src/views/organisms/Widgets/CountdownTimerWidget';
import WeatherWidget from '@src/views/organisms/Widgets/WeatherWidget';
import ExchangeWidget from '@src/views/organisms/Widgets/ExchangeWidget';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';

const CategoryTopicDetailScreen = () => {
  const {
    theme,
    onGoBack,
    transformedCategoryData,
    loading,
    refreshing,
    error,
    handleCardPress,
    onToggleBookmark,
    onRefresh,
    moreFromCategoryData,
    moreLoading,
    isLoadingMore,
    hasNextPage,
    loadMore,
    toastMessage,
    toastType,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onCancelPress,
    onConfirmPress,
    uniqueTopics,
    title,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    widgetRefetch,
    routeParams,
    weatherWidgetRefetch,
    timerRefetch,
    activateAds,
    handleTopicChipsPress
  } = useCategoryTopicDetailViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { t } = useTranslation();
  const [isExchangeWidgetVisible, setIsExchangeWidgetVisible] = useState(false);
  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (error instanceof ApolloError || !transformedCategoryData) {
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

  const renderCardItem = ({ item, index }: { item: TransformedCategoryItem; index: number }) => {
    if (item.collection === 'live-blogs') {
      const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');

      const isLive = Boolean(item?.liveblogStatus);
      const hasEmptyMediaUrl = !item?.imageUrl || item?.imageUrl === '';
      return (
        <View style={styles.liveBlogContainer}>
          <LiveBlogCard
            t={t}
            title={item?.title ?? ''}
            subTitle={
              typeof publishedAt === 'string'
                ? publishedAt
                : publishedAt
                  ? `${publishedAt.date} ${publishedAt.time}`
                  : ''
            }
            subHeadingFont={fonts.franklinGothicURW}
            subHeadingSize={fontSize.xxs}
            subHeadingWeight="Med"
            subHeadingColor={theme.labelsTextLabelPlace}
            isLive={isLive}
            mediaUrl={item?.imageUrl ?? ''}
            vintageUrl={index === 0 ? item?.vintageUrl : undefined}
            landscapeUrl={index !== 0 ? item?.landscapeUrl : undefined}
            handleMedia={true}
            hasEmptyMediaUrl={hasEmptyMediaUrl}
            showBookmark
            isBookmarked={item?.isBookmarked}
            onBookmarkPress={() => onToggleBookmark(item?.id ?? '', 'Content', index)}
            bookmarkIconContainerStyle={StyleSheet.flatten([
              styles.bookmarkIconContainerStyle,
              styles.bookmarkIconContainerStyleRight
            ])}
            liveBlogTextBlockStyle={hasEmptyMediaUrl ? styles.liveBlogTextBlock : undefined}
            headingStyle={
              hasEmptyMediaUrl && !isLive ? styles.liveBlogHeadingWithoutImage : undefined
            }
            onPress={() => handleCardPress(item, index)}
            blogMediaContainerStyle={index === 0 ? styles.firstItemImage : styles.landscapeImage}
            imageStyle={{ backgroundColor: theme.toggleIcongraphyDisabledState }}
            bottomTitleContainerStyle={index !== 0 ? styles.bottomTitleContainer : undefined}
          />
        </View>
      );
    }

    if (index === 0) {
      return (
        <Pressable
          onPress={() => handleCardPress(item, index)}
          style={StyleSheet.flatten([
            styles.firstItemContainer,
            { backgroundColor: theme.mainBackgroundDefault }
          ])}
        >
          <View style={styles.firstItemImageContainer}>
            <CustomImage
              source={item?.vintageUrl ? { uri: item.vintageUrl } : undefined}
              style={styles.firstItemImage}
              fallbackComponent={
                <View style={styles.fallbackImageContainerStyle}>
                  <FallbackImage
                    height={'100%'}
                    width={'100%'}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </View>
              }
            />
          </View>

          <View style={styles.firstItemMetadataContainer}>
            <CustomText
              fontFamily={fonts.superclarendon}
              size={fontSize.xxs}
              color={theme.tagsTextCategory}
              textStyles={styles.firstItemCategory}
            >
              {item.topic}
            </CustomText>

            <CustomHeading
              headingText={item.title}
              subHeadingText={item.summary}
              headingColor={theme.sectionTextTitleSpecial}
              headingSize={fontSize['xl']}
              headingFont={fonts.notoSerifExtraCondensed}
              headingWeight="B"
              subHeadingFont={fonts.notoSerif}
              subHeadingWeight="R"
              subHeadingSize={fontSize.xs}
              subHeadingColor={theme.sectionTextSubtitleSpecial}
              subHeadingStyles={styles.firstItemHeading}
              headingStyles={styles.firstItemHeadingContainer}
            />

            <CustomText
              fontFamily={fonts.notoSerif}
              size={fontSize.s}
              textStyles={styles.firstItemExcerpt}
            >
              {item.excerpt}
            </CustomText>

            <View style={styles.firstItemBottomRow}>
              <View style={styles.firstItemTimeContainer}>
                {item.collection === 'videos' && (
                  <PlayCircle width={24} height={24} color={theme.iconIconographyGenericState} />
                )}
                <CustomText
                  weight="Med"
                  fontFamily={fonts.franklinGothicURW}
                  size={fontSize.xxs}
                  color={theme.labelsTextLabelPlay}
                  textStyles={styles.firstItemTime}
                >
                  {`${item.minutesAgo}`}
                </CustomText>
              </View>

              <Pressable
                style={styles.firstItemBookmarkContainer}
                onPress={() => onToggleBookmark(item?.id ?? '', 'Content', index)}
              >
                {item.isBookmarked ? (
                  <CheckedBookMark color={theme.iconIconographyGenericState} />
                ) : (
                  <BookMark color={theme.iconIconographyGenericState} />
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <View style={styles.carouselCardContainer}>
        <CarouselCard
          item={item}
          onPress={() => handleCardPress(item, index)}
          headingStyles={styles.verticalHeading}
          contentContainerStyle={styles.verticalCategoryContainer}
          imageStyle={styles.verticalImageStyle}
          subheadingStyles={styles.verticalSubheading}
          imagePosition="right"
          showBookmark
          onBookmarkPress={() => onToggleBookmark(item?.id ?? '', 'Content', index)}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={onGoBack}
          additionalIcon={<View />}
          variant="dualVariant"
          headerText={title}
          headerTextWeight="Dem"
          additionalButtonStyle={styles.searchButton}
          headerStyle={styles.headerStyle}
          backIconStrokeColor={theme.iconIconographyGenericState}
          buttonStyle={styles.backButtonStyle}
          headerTextStyles={styles.headerTextStyles}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.iconIconographyGenericState}
              colors={[theme.iconIconographyGenericState]}
            />
          }
        >
          <RecentCategorySkeletonLoader />
          <MoreFromCategorySkeletonLoader />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={onGoBack}
        additionalIcon={<View />}
        variant="dualVariant"
        headerText={title}
        headerTextWeight="Dem"
        additionalButtonStyle={styles.searchButton}
        headerTextStyles={styles.headerTextStyles}
        headerStyle={
          isExchangeWidgetVisible ? styles.headerStyleWithExchangeWidget : styles.headerStyle
        }
        backIconStrokeColor={theme.iconIconographyGenericState}
        buttonStyle={styles.backButtonStyle}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.iconIconographyGenericState}
            colors={[theme.iconIconographyGenericState]}
          />
        }
      >
        <ExchangeWidget
          page={routeParams?.type === 'topic' ? 'topics' : 'category'}
          slug={routeParams?.slug}
          onVisibilityChange={setIsExchangeWidgetVisible}
          registerRefetch={(fn) => {
            widgetRefetch.current = async () => {
              await fn();
            };
          }}
        />

        <CountdownTimerWidget
          page={routeParams?.type === 'topic' ? 'topics' : 'category'}
          slug={routeParams?.slug}
          registerRefetch={(fn) => {
            timerRefetch.current = async () => {
              await fn();
            };
          }}
          containerStyle={styles.countdownTimerContainer}
        />

        <WeatherWidget
          page={routeParams?.type === 'topic' ? 'topics' : 'category'}
          slug={routeParams?.slug}
          containerStyle={styles.countdownTimerContainer}
          registerRefetch={(fn) => {
            weatherWidgetRefetch.current = async () => {
              await fn();
            };
          }}
        />

        <FlatList
          scrollEnabled={false}
          data={transformedCategoryData}
          renderItem={renderCardItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.relatedCategoryContainer}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListFooterComponent={() => (
            <>
              {uniqueTopics && uniqueTopics.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <TopicChips
                    key="unique-topics"
                    topics={uniqueTopics}
                    onPress={handleTopicChipsPress}
                    heading={t('screens.topicChips.text.relatedTopics')}
                    headingTextstyle={StyleSheet.flatten([
                      styles.headingChipsstyle,
                      styles.contentContainer
                    ])}
                    chipFontWeight={'Med'}
                    listContainerStyle={styles.chipsListContainerStyle}
                  />
                </>
              )}
              {activateAds && <AdBannerContainer containerStyle={styles.adBannerContainer} />}
            </>
          )}
        />
        {moreLoading && moreFromCategoryData.length === 0 ? (
          <MoreFromCategorySkeletonLoader />
        ) : moreFromCategoryData.length > 0 ? (
          <>
            <CategoryContentList
              t={t}
              data={moreFromCategoryData}
              heading={t('screens.categoryTopicDetail.moreNews')}
              hasNextPage={hasNextPage}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
              onItemPress={(item, index) => handleCardPress(item, index, true)}
              onBookmarkPress={(item, index) =>
                onToggleBookmark(item?.id ?? '', 'Content', index, true)
              }
              headingStyle={styles.moreNewsText}
              listContainerStyle={styles.moreCategoryContainer}
              dividerStyle={styles.divider}
              seeMoreButtonStyle={styles.seeAllButton}
              seeMoreButtonTextStyle={styles.seeAllText}
              seeMoreButtonHitSlop={styles.seeAllButtonHitSlop}
              carouselCardContainerStyle={styles.carouselCardContainer}
              carouselHeadingStyle={styles.verticalHeading}
              carouselContentContainerStyle={styles.verticalCategoryContainer}
              carouselImageStyle={styles.verticalImageStyle}
              carouselSubheadingStyle={styles.verticalSubheading}
              liveBlogBookmarkContainerStyle={styles.bookmarkIconContainerStyle}
            />
            {isLoadingMore && <LoadMoreSkeletonLoader />}
          </>
        ) : null}
      </ScrollView>

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />

      <CustomModal
        visible={bookmarkModalVisible}
        modalTitle={t('screens.guestMyAccount.restricted.acessBookmarks')}
        modalMessage={t('screens.guestMyAccount.restricted.simplyLogIn')}
        cancelButtonText={t('screens.splash.text.login')}
        confirmButtonText={t('screens.splash.text.signUp')}
        onCancelPress={onCancelPress}
        onConfirmPress={onConfirmPress}
        onOutsidePress={() => setBookmarkModalVisible(false)}
        onRequestClose={() => setBookmarkModalVisible(false)}
        buttonContainerStyle={styles.modalButtonContainer}
      />
    </SafeAreaView>
  );
};

export default CategoryTopicDetailScreen;
