import React, { useMemo } from 'react';
import { View, FlatList, ScrollView, RefreshControl, Modal, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CarouselCard from '@src/views/molecules/CarouselCard';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomButton from '@src/views/molecules/CustomButton';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';

import { themeStyles } from '@src/views/pages/main/Home/Pressroom/styles';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { usePressroomViewModel } from '@src/viewModels/main/Home/Pressroom/usePressroomViewModel';
import PressroomSkeletonLoader from '@src/views/pages/main/Home/Pressroom/components/PressroomSkeletonLoader';
import LoadMoreSkeletonLoader from '@src/views/pages/main/Home/Pressroom/components/LoadMoreSkeletonLoader';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { PressroomItem } from '@src/models/main/Home/Pressroom';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import PressroomHeroImage from '@src/views/pages/main/Home/Pressroom/components/PressroomHeroImage';

const Pressroom = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { t } = useTranslation();
  const {
    loading,
    error,
    refreshing,
    isLoadingMore,
    firstItem,
    remainingItems,
    hasData,
    hasNextPage,
    toastType,
    toastMessage,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onToggleBookmark,
    onRefresh,
    onLoadMore,
    getBookmarkStatus,
    onGoBack,
    showWebView,
    webUrl,
    openWebView,
    closeWebView,
    showLoadMoreSkeleton,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry
  } = usePressroomViewModel();

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={onGoBack}
          additionalIcon={<View />}
          variant="dualVariant"
          headerText={t('screens.pressroom.title')}
          headerTextWeight="Dem"
          additionalButtonStyle={styles.searchButton}
          headerStyle={styles.headerStyle}
          backIconStrokeColor={theme.iconIconographyGenericState}
          buttonStyle={styles.backButtonStyle}
        />
        <PressroomSkeletonLoader />
      </SafeAreaView>
    );
  }

  if (error instanceof ApolloError) {
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

  const renderFirstItem = (item: PressroomItem | null | undefined) => {
    if (!item) {
      return null;
    }

    const isBookmarked = getBookmarkStatus(item);

    return (
      <PressroomHeroImage
        item={item}
        onPress={() => openWebView(item?.fullPath || item?.slug, 0)}
        onBookmarkPress={(id) => onToggleBookmark(id, 'Content', 0)}
        isBookmarked={isBookmarked}
        theme={theme}
      />
    );
  };

  const renderRemainingItems = ({ item, index }: { item: PressroomItem; index: number }) => {
    const imageUrl = item?.featuredImage?.sizes?.square?.url || item?.featuredImage?.url;
    return (
      <View>
        <CarouselCard
          item={{ ...item, imageUrl }}
          headingStyles={styles.verticalHeading}
          titleFont={fonts.notoSerif}
          titleWeight="R"
          titleSize={fontSize.s}
          contentContainerStyle={styles.verticalCategoryContainer}
          imageStyle={styles.verticalImageStyle}
          subheadingStyles={styles.verticalSubheading}
          imagePosition="right"
          showBookmark
          publishedAt={item.publishedAt}
          showOnlyDate
          type="publishedAt"
          subText=""
          publishedTextStyle={styles.publishedTextStyle}
          onPress={() => openWebView(item?.fullPath || item?.slug, index + 1)}
          onBookmarkPress={() => onToggleBookmark(item.id, 'Content', index + 1)}
          isBookmarked={getBookmarkStatus(item)}
          contentStyles={{ marginRight: actuatedNormalize(spacing.xs) }}
        />
      </View>
    );
  };

  if (!hasData) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={onGoBack}
          additionalIcon={<View />}
          variant="dualVariant"
          headerText={t('screens.pressroom.title')}
          headerTextWeight="Dem"
          additionalButtonStyle={styles.searchButton}
          headerStyle={styles.headerStyle}
          backIconStrokeColor={theme.iconIconographyGenericState}
          buttonStyle={styles.backButtonStyle}
          headerTextStyles={styles.headerTextStyles}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={onGoBack}
        additionalIcon={<View />}
        variant="dualVariant"
        headerText={t('screens.pressroom.title')}
        headerTextWeight="Dem"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.iconIconographyGenericState}
        buttonStyle={styles.backButtonStyle}
        headerTextStyles={styles.headerTextStyles}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.iconIconographyGenericState}
            colors={[theme.iconIconographyGenericState]}
          />
        }
      >
        {firstItem && renderFirstItem(firstItem)}
        <View style={styles.contentContainer}>
          {remainingItems.length > 0 && (
            <>
              <FlatList
                scrollEnabled={false}
                data={remainingItems}
                renderItem={renderRemainingItems}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.remainingItemsContainer}
                ItemSeparatorComponent={() => <View style={styles.cardBottomBorder} />}
                ListFooterComponent={() => <View style={styles.cardBottomBorder} />}
              />
            </>
          )}

          {showLoadMoreSkeleton && <LoadMoreSkeletonLoader />}

          {hasNextPage && onLoadMore && (
            <CustomButton
              onPress={onLoadMore}
              buttonText={t('screens.common.seeMore')}
              variant="text"
              buttonTextColor={theme.newsTextTitlePrincipal}
              buttonTextWeight="Dem"
              buttonTextFontFamily={fonts.franklinGothicURW}
              buttonTextStyles={StyleSheet.flatten(styles.seeMoreButtonTextStyle)}
              buttonStyles={StyleSheet.flatten(styles.seeMoreButtonStyle)}
              hitSlop={styles.seeMoreButtonHitSlop}
              disabled={isLoadingMore}
              isLoading={isLoadingMore}
            />
          )}
        </View>
      </ScrollView>

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

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={() => closeWebView()}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => closeWebView()}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Pressroom;
