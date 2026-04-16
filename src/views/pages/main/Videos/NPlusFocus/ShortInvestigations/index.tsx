import React from 'react';
import { FlatList, View, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomText from '@src/views/atoms/CustomText';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/ShortInvestigations/styles';
import { SearchIcon } from '@src/assets/icons';
import useShortInvestigationsViewModel from '@src/viewModels/main/Videos/NPlusFocus/ShortInvestigations/useShortInvestigationsViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import AllEpisodesSkeletonLoader from '@src/views/pages/main/Videos/AllEpisodes/components/AllEpisodesSkeletonLoader';
import { ShortInvestigationItem } from '@src/models/main/Videos/ShortInvestigation';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import CustomButton from '@src/views/molecules/CustomButton';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';

const ShortInvestigations = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const {
    shortInvestigationsData,
    onItemPress,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    refreshing,
    handleRefresh,
    shortInvestigationsLoading,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    goBack,
    shortInvestigationsError,
    loadMore,
    loadMoreLoading,
    hasNextPage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleSearchTap
  } = useShortInvestigationsViewModel();

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (shortInvestigationsError instanceof ApolloError || !shortInvestigationsData) {
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

  const renderFooter = () => {
    if (!loadMoreLoading && !hasNextPage)
      return <CustomDivider style={styles.verticalVideoItemSeparator} />;
    return (
      <View style={styles.loaderContainer}>
        {loadMoreLoading ? (
          <View style={styles.skeletonContainer}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(130)}
              width={actuatedNormalize(130)}
              style={styles.skeletonImage}
            />
            <View style={styles.skeletonTextContainer}>
              <SkeletonLoader
                height={actuatedNormalizeVertical(20)}
                width="80%"
                style={styles.skeletonTitle}
              />
              <SkeletonLoader
                height={actuatedNormalizeVertical(16)}
                width="40%"
                style={styles.skeletonDuration}
              />
            </View>
          </View>
        ) : (
          <CustomButton
            onPress={loadMore}
            buttonText={t('screens.common.seeMore')}
            variant="text"
            buttonTextColor={theme.newsTextDarkThemePages}
            buttonTextWeight="Dem"
            buttonTextFontFamily={fonts.franklinGothicURW}
            buttonTextStyles={styles.seeAllText}
            buttonStyles={styles.seeAllButton}
          />
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <CustomText
        color={theme.newsTextDarkThemePages}
        weight="R"
        fontFamily={fonts.notoSerifExtraCondensed}
        size={fontSize['2xl']}
        textStyles={styles.title}
      >
        {t('screens.shortInvestigations.title')}
      </CustomText>
      <View style={styles.shortsContainer} />
    </>
  );

  const renderItem = ({ item, index }: { item: ShortInvestigationItem; index: number }) => {
    const positionInGroup = index % 6;
    const hideImage = positionInGroup === 1 || positionInGroup === 5;
    return (
      <CarouselCard
        type={item.type === 'video' ? 'videos' : ''}
        topic={item?.topicTitle ?? undefined}
        title={item?.title}
        minutesAgo={
          item?.videoDuration
            ? formatDurationToMinutes(item?.videoDuration)
            : item?.readTime + ' min'
        }
        imageUrl={item.heroImage?.sizes?.square?.url ?? ''}
        isBookmarked={item.isBookmarked}
        headingStyles={styles.verticalHeading}
        subheadingStyles={hideImage ? styles.verticalSubHeadingNoImage : styles.verticalSubHeading}
        contentContainerStyle={styles.verticalVideoContainer}
        imageStyle={styles.verticalImageStyle}
        iconColor={theme.newsTextDarkThemePages}
        textColor={theme.newsTextDarkThemePages}
        onPress={() => onItemPress(item.slug, item.type, index, item)}
        onBookmarkPress={() => handleBookmarkPress(item.id, item.type, index, item)}
        hideImage={hideImage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        headerText={t('screens.shortInvestigations.title')}
        headerTextWeight="Dem"
        headerTextFontFamily={fonts.franklinGothicURW}
        backIconStrokeColor={theme.newsTextDarkThemePages}
        headerTextColor={theme.newsTextDarkThemePages}
        headerTextStyles={styles.headerTextStyles}
        additionalIcon={<SearchIcon stroke={theme.newsTextDarkThemePages} />}
        variant="dualVariant"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        onPress={goBack}
        buttonStyle={styles.buttonStyle}
        onAdditionalButtonPress={handleSearchTap}
      />

      {shortInvestigationsLoading && shortInvestigationsData.length == 0 ? (
        <AllEpisodesSkeletonLoader />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.newsTextDarkThemePages}
              colors={[theme.newsTextDarkThemePages]}
            />
          }
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          data={shortInvestigationsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <CustomDivider style={styles.verticalVideoItemSeparator} />}
          ListFooterComponent={renderFooter}
        />
      )}

      {toastMessage ? (
        <CustomToast
          type={toastType}
          message={
            toastMessage === 'Network request failed'
              ? t('screens.splash.text.noInternetConnection')
              : toastMessage
          }
          isVisible={!!toastMessage}
          onDismiss={() => setToastMessage('')}
          customTheme="dark"
        />
      ) : null}

      <GuestBookmarkModal
        visible={bookmarkModalVisible}
        onClose={() => setBookmarkModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ShortInvestigations;
