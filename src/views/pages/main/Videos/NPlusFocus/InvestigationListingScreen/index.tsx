import React from 'react';
import { FlatList } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@src/views/molecules/CustomHeader';
import useInvestigationListingScreenViewModel from '@src/viewModels/main/Videos/NPlusFocus/InvestigationListingScreen/useInvestigationListingScreenViewModel';
import { fonts } from '@src/config/fonts';
import { SearchIcon } from '@src/assets/icons';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import InfoCard from '@src/views/molecules/InfoCard';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { InvestigationItem } from '@src/models/main/Videos/NPlusFocus';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { themeStyles } from '@src/views/pages/main/Videos/NPlusFocus/InvestigationListingScreen/styles';
import FlatListSkeleton from '@src/views/pages/main/Videos/NPlusFocus/InvestigationListingScreen/components/InvestigationScreenSkeletonLoader';
import CustomButton from '@src/views/molecules/CustomButton';

const InvestigationListingScreen = () => {
  const {
    goBack,
    theme,
    flatListRef,
    data,
    videosLoading,
    loadMore,
    loadMoreLoading,
    isRefreshing,
    onRefresh,
    isInternetConnection,
    goToInvestigationDetailScreen,
    handleSearchTap,
    hasMore
  } = useInvestigationListingScreenViewModel();

  const styles = themeStyles(theme);
  const { t } = useTranslation();

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
      aspectRatio={9 / 16}
      resizeMode="cover"
      imageWidth={actuatedNormalize(178)}
      contentContainerStyle={styles.contentContainerStyle}
      titleStyles={styles.titleStyles}
      onPress={() => goToInvestigationDetailScreen(item?.slug, index)}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <CustomButton
        onPress={loadMore}
        buttonText={t('screens.common.seeMore')}
        variant="text"
        buttonTextColor={theme.newsTextDarkThemePages}
        buttonTextWeight="Dem"
        buttonTextFontFamily={fonts.franklinGothicURW}
        buttonTextStyles={styles.seeAllText}
        buttonStyles={styles.seeAllButton}
        isLoading={loadMoreLoading}
      />
    );
  };

  const renderHeader = () => (
    <CustomText
      size={fontSize['2xl']}
      fontFamily={fonts.notoSerifExtraCondensed}
      textStyles={styles.title}
    >
      {t('screens.nPlusFocus.text.investigations')}
    </CustomText>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.nPlusFocus.text.investigations')}
        headerTextWeight="Dem"
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextStyles={styles.headerTextStyles}
        additionalIcon={<SearchIcon stroke={theme.carouselTextDarkTheme} />}
        variant="dualVariant"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.carouselTextDarkTheme}
        headerTextColor={theme.carouselTextDarkTheme}
        buttonStyle={styles.buttonStyle}
        onAdditionalButtonPress={handleSearchTap}
      />

      {!isInternetConnection && !videosLoading ? (
        <ErrorScreen
          status="noInternet"
          onRetry={onRefresh}
          contentContainerStyle={styles.errorContainer}
        />
      ) : videosLoading ? (
        <FlatListSkeleton theme={theme} numColumns={2} itemCount={6} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={data?.Videos?.docs}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(_, i) => `item-${i}`}
          onEndReachedThreshold={0.5}
          style={styles.flatList}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={renderFooter}
          initialNumToRender={6}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
};

export default InvestigationListingScreen;
