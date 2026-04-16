import React, { useMemo, useCallback, Suspense, useState, useEffect } from 'react';
import { Pressable, RefreshControl, FlatList, ListRenderItem, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { themeStyles } from '@src/views/pages/main/Home/Home/styles';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import useHomeViewModel from '@src/viewModels/main/Home/Home/useHomeViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import GuestBookmarkModal from '@src/views/templates/main/GuestBookmark';
import HomeHeader from '@src/views/pages/main/Home/Home/components/HomeHeader';
import ReelModeScreen from '@src/views/organisms/ReelModeModal';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import CountdownTimerWidget from '@src/views/organisms/Widgets/CountdownTimerWidget';
import AdBannerContainer from '@src/views/molecules/AdBannerContainer';
import WeatherWidget from '@src/views/organisms/Widgets/WeatherWidget';
import ExchangeWidget from '@src/views/organisms/Widgets/ExchangeWidget';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

// Lazy load heavy sections for code splitting
const SpecialSectionTwo = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/SpecialSectionTwo')
);
const SpecialSectionThree = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/SpecialSectionThree')
);
const SpecialSectionFour = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/SpecialSectionFour')
);
const SpecialSectionSix = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/SpecialSectionSix')
);
const SpecialSectionSeven = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/SpecialSectionSeven')
);
const LiveBlogPrimeSection = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/LiveBlogPrimeSection')
);
const BreakingNewPrimeSection = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/BreakingNewPrimeSection')
);
const OpinionsSection = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/OpinionsSection')
);
const NPlusFocus = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/NPlusFocus')
);
const LiveStreamingPrimeSection = React.lazy(
  () => import('@src/views/pages/main/Home/Home/components/LiveStreamingPrimeSection')
);

type SectionItem = {
  key: string;
  component: React.ReactElement;
};

// Generic skeleton fallback for lazy-loaded sections
const SectionSkeleton = () => (
  <View style={{ paddingVertical: 20 }}>
    <SkeletonLoader height={200} width="100%" />
  </View>
);

const Home = () => {
  const {
    t,
    theme,
    currentTheme,
    goToDummyHomePress,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    refreshing,
    onRefresh,
    registerRefetch,
    onExclusivePress,
    isReelMode,
    setReelMode,
    selectedExclusiveIndex,
    activeExclusiveIndex,
    onMomentumScrollEnd,
    data,
    screenHeight,
    isInternetConnection,
    onRetry,
    showBannerAds
  } = useHomeViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const sections = useHomeSectionStatusStore((s) => s.sections);

  const hasAnySectionData = useMemo(() => Object.values(sections).some(Boolean), [sections]);

  // Delay rendering of below-the-fold sections for smoother first ui layout
  const [showBelowFoldSections, setShowBelowFoldSections] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBelowFoldSections(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const goToDummyHomeFloatingButton = () => (
    <Pressable style={styles.floatingView} onPress={goToDummyHomePress}>
      <CustomText color={theme.bodyTextDarkTheme} size={fontSize.xs}>
        {t('screens.home.text.goToDummyHome')}
      </CustomText>
    </Pressable>
  );

  const sectionsData = useMemo<SectionItem[]>(() => {
    if (!isInternetConnection && !hasAnySectionData) {
      return [
        {
          key: 'error',
          component: (
            <ErrorScreen
              status="noInternet"
              onRetry={onRetry}
              containerStyles={styles.containerStyles}
            />
          )
        }
      ];
    }

    // Above-the-fold sections - render immediately
    // Prime order: Live → (LiveBlog & BreakingNews load below the fold)
    const items: SectionItem[] = [
      {
        key: 'countdown',
        component: (
          <CountdownTimerWidget
            page="homepage"
            registerRefetch={registerRefetch}
            sectionGapStyle={styles.sectionGap}
          />
        )
      },
      {
        key: 'weather',
        component: (
          <WeatherWidget
            page="homepage"
            registerRefetch={registerRefetch}
            sectionGapStyle={styles.sectionGap}
          />
        )
      },
      {
        key: 'liveStreaming',
        component: (
          <LiveStreamingPrimeSection
            t={t}
            theme={theme}
            registerRefetch={registerRefetch}
            sectionGapStyle={styles.sectionGap}
          />
        )
      }
    ];

    // Below-the-fold sections - delay rendering for smoother first paint
    // New order: Prime (LiveBlog → BreakingNews) → 1 → 2 → 3 → 4 → 5 → 6 → 7
    if (showBelowFoldSections) {
      items.push(
        // Prime: LiveBlog → Notas (BreakingNews)
        {
          key: 'liveBlog',
          component: (
            <LiveBlogPrimeSection
              t={t}
              theme={theme}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        },
        {
          key: 'breakingNews',
          component: (
            <BreakingNewPrimeSection
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        },
        // Section 1: Videos Verticales
        {
          key: 'specialSectionTwo',
          component: (
            <SpecialSectionTwo
              onExclusivePress={onExclusivePress}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        },
        // Section 2: Contenido especial
        {
          key: 'specialSectionThree',
          component: (
            <SpecialSectionThree
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        },
        // Section 3: Passion products (Estilo de vida)
        {
          key: 'specialSectionSix',
          component: (
            <SpecialSectionSix
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
            />
          )
        },
        // Section 4: Opinión
        {
          key: 'opinions',
          component: (
            <OpinionsSection
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
            />
          )
        },
        // Section 5: N+ Focus
        {
          key: 'nPlusFocus',
          component: (
            <NPlusFocus
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        },
        // Section 6: N+ Local
        {
          key: 'specialSectionFour',
          component: (
            <SpecialSectionFour
              t={t}
              theme={theme}
              handleBookmarkPress={handleBookmarkPress}
              registerRefetch={registerRefetch}
              sectionGapStyle={styles.sectionGap}
            />
          )
        }
      );

      if (showBannerAds) {
        items.push({
          key: 'adBanner',
          component: <AdBannerContainer sectionGapStyle={styles.sectionGap} />
        });
      }

      // Section 7: Remaining
      items.push({
        key: 'specialSectionSeven',
        component: (
          <SpecialSectionSeven
            t={t}
            theme={theme}
            handleBookmarkPress={handleBookmarkPress}
            registerRefetch={registerRefetch}
            sectionGapStyle={styles.sectionGap}
          />
        )
      });
    }

    return items;
  }, [
    isInternetConnection,
    hasAnySectionData,
    onRetry,
    styles.containerStyles,
    styles.sectionGap,
    registerRefetch,
    t,
    theme,
    handleBookmarkPress,
    onExclusivePress,
    showBannerAds,
    showBelowFoldSections
  ]);

  const renderItem = useCallback<ListRenderItem<SectionItem>>(
    ({ item }) => (
      <Suspense fallback={<SectionSkeleton />}>
        <View>{item.component}</View>
      </Suspense>
    ),
    []
  );

  const keyExtractor = useCallback((item: SectionItem) => item.key, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ExchangeWidget page="homepage" registerRefetch={registerRefetch} />
      <HomeHeader
        t={t}
        theme={theme}
        currentTheme={currentTheme}
        registerRefetch={registerRefetch}
      />

      <FlatList
        data={sectionsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
      />

      {__DEV__ && goToDummyHomeFloatingButton()}

      {isReelMode && (
        <ReelModeScreen
          data={data?.videos || []}
          selectedIndex={selectedExclusiveIndex}
          screenHeight={screenHeight}
          activeIndex={activeExclusiveIndex}
          onMomentumScrollEnd={onMomentumScrollEnd}
          setReelMode={setReelMode}
          analyticsContentType={`${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`}
          analyticsScreenName={ANALYTICS_COLLECTION.HOME_PAGE}
          analyticsOrganism={ANALYTICS_ORGANISMS.HOME_PAGE.EXCLUSIVE_CARD}
        />
      )}

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

export default Home;
