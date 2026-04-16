import React from 'react';
import { FlatList, Modal, Pressable, View, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import { SearchIcon } from '@src/assets/icons';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import CustomImage from '@src/views/atoms/CustomImage';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { FormattedInteractiveVideo } from '@src/models/main/Videos/InteractiveListing';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomButton from '@src/views/molecules/CustomButton';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/InteractiveListing/styles';
import { useInteractiveListingViewModel } from '@src/viewModels/main/Videos/NPlusFocus/InteractiveListing/useInteractiveListingViewModel';
import InteractiveListingSkeleton from '@src/views/pages/main/Videos/NPlusFocus/InteractiveListing/components/InteractiveListingSkeleton';

const InteractiveListing = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const {
    data,
    error,
    refreshing,
    onRefresh,
    loading,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    goBack,
    loadMore,
    loadMoreLoading,
    flatListRef,
    hasNextPage,
    showWebView,
    webUrl,
    handleCardPress,
    handleCloseWebView,
    handleSearchTap
  } = useInteractiveListingViewModel();

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (error instanceof ApolloError || !data) {
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

  const renderItem = ({ item, index }: { item: FormattedInteractiveVideo; index: number }) => (
    <Pressable onPress={() => handleCardPress(item.externalURL, index)}>
      <View style={styles.itemContainer}>
        <CustomImage source={{ uri: item.url }} style={styles.itemImage} />
        <CustomText
          color={theme.newsTextDarkThemePages}
          weight="R"
          fontFamily={fonts.notoSerif}
          size={fontSize.s}
          textStyles={styles.interactiveTitle}
        >
          {item.title}
        </CustomText>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <CustomText
      color={theme.newsTextDarkThemePages}
      fontFamily={fonts.notoSerifExtraCondensed}
      size={fontSize['2xl']}
      textStyles={styles.title}
    >
      {t('screens.interactiveListing.title')}
    </CustomText>
  );

  const renderFooter = () => {
    if (!loadMoreLoading && !hasNextPage) return null;
    return (
      <View style={styles.loader}>
        {loadMoreLoading ? (
          <SkeletonLoader height={'90%'} width={'100%'} />
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

  return (
    <>
      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={handleCloseWebView}
      >
        <View style={styles.webViewWrapper}>
          <CustomWebView
            uri={webUrl}
            isVisible={showWebView}
            onClose={handleCloseWebView}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        <CustomHeader
          headerText={t('screens.interactiveListing.title')}
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
          onAdditionalButtonPress={handleSearchTap}
        />

        {loading && data.length === 0 ? (
          <InteractiveListingSkeleton backgroundColor={theme.mainBackgrunforproductionPage} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.newsTextDarkThemePages}
                colors={[theme.newsTextDarkThemePages]}
              />
            }
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default InteractiveListing;
