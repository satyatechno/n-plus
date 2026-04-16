import React from 'react';
import { FlatList } from 'react-native';

import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { PorElPlanetaImage } from '@src/assets/images';
import usePorElPlanetaDocumentariesViewModel from '@src/viewModels/main/Videos/PorElPlaneta/usePorElPlanetaDocumentariesViewModel';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { SearchIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaDocumentaries/styles';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import InfoCard from '@src/views/molecules/InfoCard';
import CustomButton from '@src/views/molecules/CustomButton';
import FlatListSkeleton from '@src/views/pages/main/Videos/NPlusFocus/InvestigationListingScreen/components/InvestigationScreenSkeletonLoader';
import { PorElPlanetaDocumentaries as PorElPlanetaDocumentariesModel } from '@src/models/main/Videos/PorElPlaneta';

const PorElPlanetaDocumentaries = () => {
  const {
    goBack,
    porElPlanetaLoading,
    porElPlanetaError,
    porElPlanetaListData,
    onCardPress,
    onSearchPress,
    refreshing,
    onRefresh,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    dataHasNextpage,
    dataMoreLoader,
    onSeeMorePress
  } = usePorElPlanetaDocumentariesViewModel();
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const renderItem = ({ item, index }: { item: PorElPlanetaDocumentariesModel; index: number }) => (
    <InfoCard
      title={item?.title}
      titleFontFamily={fonts.notoSerif}
      titleFontSize={fontSize.s}
      subTitleColor={theme.labelsTextLabelPlace}
      imageUrl={
        item?.productions?.specialImage?.sizes?.portrait?.url ||
        item?.content?.heroImage?.sizes?.portrait?.url ||
        item?.content?.heroImage?.url ||
        ''
      }
      item={item}
      aspectRatio={9 / 16}
      resizeMode="cover"
      imageWidth={actuatedNormalize(178)}
      contentContainerStyle={styles.contentContainerStyle}
      titleStyles={styles.titleStyles}
      onPress={() => onCardPress({ item, index })}
    />
  );

  const renderHeader = () => (
    <CustomText
      size={fontSize['2xl']}
      fontFamily={fonts.notoSerifExtraCondensed}
      textStyles={styles.title}
    >
      {t('screens.forThePlanet.title')}
    </CustomText>
  );

  const renderFooter = () => {
    if (!dataHasNextpage) return null;

    return (
      <CustomButton
        onPress={onSeeMorePress}
        buttonText={t('screens.liveBlog.text.seeMore')}
        variant="text"
        buttonTextColor={theme.carouselTextDarkTheme}
        buttonTextWeight="Dem"
        buttonTextFontFamily={fonts.franklinGothicURW}
        buttonTextStyles={styles.seeMoreText}
        buttonStyles={styles.seeMoreButton}
        isLoading={dataMoreLoader}
      />
    );
  };

  if (porElPlanetaLoading && (porElPlanetaListData ?? []).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={goBack}
          additionalIcon={<SearchIcon stroke={theme.carouselTextDarkTheme} />}
          onAdditionalButtonPress={onSearchPress}
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
          buttonStyle={styles.backButtonStyle}
        />
        <FlatListSkeleton theme={theme} numColumns={2} itemCount={6} />
      </SafeAreaView>
    );
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (porElPlanetaError instanceof ApolloError || !porElPlanetaListData) {
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

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        additionalIcon={<SearchIcon stroke={theme.carouselTextDarkTheme} />}
        onAdditionalButtonPress={onSearchPress}
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
        buttonStyle={styles.backButtonStyle}
      />
      <FlatList
        data={porElPlanetaListData ?? []}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item, index) => `${item?.id || index}`}
        onEndReachedThreshold={0.5}
        style={styles.flatList}
        columnWrapperStyle={styles.columnWrapper}
        ListFooterComponent={renderFooter}
        initialNumToRender={6}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default PorElPlanetaDocumentaries;
