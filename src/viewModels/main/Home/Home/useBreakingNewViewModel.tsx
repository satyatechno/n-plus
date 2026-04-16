import { useCallback, useEffect, useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { BREAKING_NEW_PRIME_SECTION_QUERY } from '@src/graphql/main/home/queries';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

const useBreakingNewViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data,
    refetch: refetchBreakingNews,
    loading
  } = useQuery(BREAKING_NEW_PRIME_SECTION_QUERY);
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepagePrime?.breakingNews;
    setSectionHasData('breakingNewsPrime', hasData);

    return () => {
      setSectionHasData('breakingNewsPrime', false);
    };
  }, [loading, data, setSectionHasData]);

  const heroData = useMemo(() => data?.HomepagePrime?.breakingNews?.hero, [data]);
  const secondaryData = useMemo(() => data?.HomepagePrime?.breakingNews?.secondary, [data]);

  const heroCardDuration = useMemo(
    () =>
      heroData?.type == 'video' || heroData?.type == 'videos'
        ? (heroData?.videoDuration ?? 0)
        : (heroData?.readTime ?? 0),
    [heroData]
  );

  const onPressNewsDetails = (
    heroData: {
      id: string;
      slug: string;
      title: string;
      type: string;
      category: { title: string };
      openingType: string;
      displayType: string;
    },
    isPrincipalSection: boolean,
    index?: number
  ) => {
    if (!heroData) return;
    logSelectContentEvent({
      idPage: heroData?.id,
      content_title: heroData.title,
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      categories: heroData.category?.title,
      screen_page_web_url: heroData.slug,
      opening_display_type: `${heroData?.openingType ?? ''}_${heroData?.displayType ?? ''}`,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      organisms: ANALYTICS_ORGANISMS.HOME_PRIME_SECTION.BREAKING_NEWS,
      content_type: isPrincipalSection
        ? ANALYTICS_MOLECULES.HOME_PRIME_SECTION.PRINCIPA_NEWS
        : `${ANALYTICS_MOLECULES.HOME_PRIME_SECTION.NEWS_CARD} ${index}`,
      content_name: 'Principal News Card'
    });
    if (heroData.type === 'video') {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.VIDEO_DETAIL_PAGE,
        params: { slug: heroData.slug }
      });
    }
    if (heroData.type === 'post') {
      navigation.navigate(routeNames.HOME_STACK, {
        screen: screenNames.STORY_PAGE_RENDERER,
        params: { slug: heroData.slug }
      });
    }
  };

  const handleBookmarkForAnalytics = useCallback(() => {
    if (!heroData) return;
    return {
      idPage: heroData?.id,
      content_title: heroData.title,
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      categories: heroData.category?.title,
      screen_page_web_url: heroData.slug,
      opening_display_type: `${heroData?.openingType ?? ''}_${heroData?.displayType ?? ''}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PRIME_SECTION.BREAKING_NEWS,
      content_type: ANALYTICS_MOLECULES.HOME_PRIME_SECTION.PRINCIPA_NEWS,
      content_name: 'Bookmark'
    };
  }, []);

  return {
    heroData,
    secondaryData,
    heroCardDuration,
    onPressNewsDetails,
    refetchBreakingNews,
    handleBookmarkForAnalytics
  };
};

export default useBreakingNewViewModel;
