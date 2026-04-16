import React, { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApolloError } from '@apollo/client';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { useTheme } from '@src/hooks/useTheme';
import usePorElPlanetaDetailPageViewModel from '@src/viewModels/main/Videos/PorElPlaneta/usePorElPlanetaDetailPageViewModel';
import { themeStyles } from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaDetailPage/styles';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { BookMark, CheckedBookMark, ShareIcon } from '@src/assets/icons';
import PorElPlanetaDetailPageSkeleton from '@src/views/pages/main/Videos/components/PorElPlanetaDetailPageSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import PorElPlanetaDocumentariesSkeleton from '@src/views/pages/main/Videos/components/PorElPlanetaDocumentariesSkeleton';
import CustomToast from '@src/views/molecules/CustomToast';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { extractMcpIdFromVideoUrl, generateVODAdTagUrl } from '@src/views/organisms/RNVideo/utils';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import InfoCard from '@src/views/molecules/InfoCard';
import { actuatedNormalize } from '@src/utils/pixelScaling';

const PorElPlanetaDetailPage = () => {
  const {
    goBack,
    publishedAt,
    porElPlanetaLoading,
    porElPlanetaError,
    porElPlanetaDetailData,
    recentlyAddedLoading,
    recentlyAddedListData,
    onSharePress,
    onCardPress,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    currentPageTheme,
    isToggleBookmark,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    handleTimeUpdate,
    timeWatched,
    bookmarkModalVisible,
    setBookmarkModalVisible
  } = usePorElPlanetaDetailPageViewModel();
  const { t } = useTranslation();
  const [theme] = useTheme(currentPageTheme);
  const styles = themeStyles(theme);
  const { shouldAutoPlay } = useSettingsStore();

  const adTagUrl = useMemo(() => {
    const mcpId = extractMcpIdFromVideoUrl(porElPlanetaDetailData?.Video?.videoUrl ?? '');

    if (!mcpId) {
      return undefined;
    }

    return generateVODAdTagUrl({
      mcpId,
      programName: porElPlanetaDetailData?.Video?.title ?? '',
      site: 'nmas',
      pageType: 'EpisodePage'
    });
  }, [porElPlanetaDetailData?.Video?.videoUrl, porElPlanetaDetailData?.Video?.title]);

  const detailView = () => (
    <View>
      <CustomText
        fontFamily={fonts.notoSerifExtraCondensed}
        textStyles={styles.detailTitle}
        size={fontSize['xl']}
        weight="B"
      >
        {porElPlanetaDetailData?.Video?.title ?? ''}
      </CustomText>

      <LexicalContentRenderer
        content={
          porElPlanetaDetailData?.Video?.excerpt ||
          porElPlanetaDetailData?.Video?.content?.summary ||
          ''
        }
        customTheme={currentPageTheme}
        contentTextStyle={styles.summaryText}
        excludeHeadingMarginBottom={true}
      />

      <View style={styles.detailPublishedAtContainer}>
        <CustomText
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.detailPublishedAt}
          weight={'Med'}
          size={fontSize.xxs}
        >
          {publishedAt ?? ''}
        </CustomText>

        <View style={styles.detailPublishedAtSubContainer}>
          <Pressable hitSlop={5} onPress={onSharePress}>
            <ShareIcon color={theme.carouselTextDarkTheme} />
          </Pressable>

          <Pressable
            hitSlop={5}
            onPress={() => handleBookmarkPress(porElPlanetaDetailData?.Video?.id)}
          >
            {isToggleBookmark ? (
              <CheckedBookMark color={theme.carouselTextDarkTheme} />
            ) : (
              <BookMark color={theme.carouselTextDarkTheme} />
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );

  const recentlyAddedList = () => (
    <View style={styles.recentlyAddedContainer}>
      <CustomText
        size={fontSize['2xl']}
        fontFamily={fonts.notoSerifExtraCondensed}
        textStyles={styles.recentlyAddedTitle}
      >
        {t('screens.forThePlanet.text.recentlyAdded')}
      </CustomText>

      <FlatList
        keyExtractor={(item) => item?.id}
        data={recentlyAddedListData ?? []}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        style={styles.flatList}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item, index }) => (
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
            imageWidth={actuatedNormalize(178)}
            contentContainerStyle={styles.recentlyAddedItem}
            titleStyles={styles.recentlyAddedItemTitle}
            onPress={() => onCardPress({ item, index })}
            aspectRatio={9 / 16}
          />
        )}
      />
    </View>
  );

  if (porElPlanetaLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onPress={goBack}
          headerStyle={styles.headerStyle}
          backIconStrokeColor={theme.carouselTextDarkTheme}
          buttonStyle={styles.backButtonStyle}
        />

        <PorElPlanetaDetailPageSkeleton />
      </SafeAreaView>
    );
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (porElPlanetaError instanceof ApolloError || !porElPlanetaDetailData) {
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
        headerStyle={styles.headerStyle}
        backIconStrokeColor={theme.carouselTextDarkTheme}
        buttonStyle={styles.backButtonStyle}
      />

      {!isInternetConnection ? (
        <ErrorScreen status="noInternet" onRetry={handleRetry} />
      ) : porElPlanetaLoading ? (
        <PorElPlanetaDetailPageSkeleton />
      ) : (
        <>
          <RNVideoPlayer
            videoUrl={porElPlanetaDetailData?.Video?.videoUrl ?? ''}
            thumbnail={porElPlanetaDetailData?.Video?.content?.heroImage?.url ?? ''}
            onTimeUpdate={handleTimeUpdate}
            initialSeekTime={timeWatched ?? 0}
            autoStart={shouldAutoPlay()}
            videoType="vod"
            adTagUrl={adTagUrl}
            adLanguage="es"
            has9_16={porElPlanetaDetailData?.Video?.aspectRatio === '9/16'}
            analyticsContentType={`${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_DETAILS}`}
            analyticsScreenName={ANALYTICS_COLLECTION.PRODUCTORAS}
            analyticsOrganism={ANALYTICS_ORGANISMS.VIDEOS.HERO}
            data={porElPlanetaDetailData?.Video}
            analyticsIdPage={porElPlanetaDetailData?.Video?.id}
            analyticScreenPageWebUrl={porElPlanetaDetailData?.Video?.slug}
            analyticsPublication={porElPlanetaDetailData?.Video?.publishedAt}
            analyticsDuration={porElPlanetaDetailData?.Video?.videoDuration}
            analyticsTags={porElPlanetaDetailData?.Video?.topics
              ?.map((topic: { title?: string }) => topic?.title)
              ?.join(',')}
            analyticVideoType={porElPlanetaDetailData?.Video?.content?.videoType}
            analyticsProduction={`${porElPlanetaDetailData?.Video?.channel?.title}_${porElPlanetaDetailData?.Video?.production?.title}`}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {detailView()}
            {recentlyAddedLoading ? (
              <PorElPlanetaDocumentariesSkeleton isShowHeader elementCount={4} />
            ) : (
              recentlyAddedList()
            )}
          </ScrollView>

          <CustomToast
            type={toastType}
            message={toastMessage}
            isVisible={!!toastMessage}
            onDismiss={() => setToastMessage('')}
            toastContainerStyle={styles.toastContainer}
            customTheme={currentPageTheme}
          />

          <GuestBookmarkModal
            visible={bookmarkModalVisible}
            onClose={() => setBookmarkModalVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default PorElPlanetaDetailPage;
