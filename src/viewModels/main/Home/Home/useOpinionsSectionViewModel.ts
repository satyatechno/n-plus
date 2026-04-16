import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HOMEPAGE_OPINION_QUERY } from '@src/graphql/main/home/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { OpinionItem } from '@src/models/main/Opinion/Opinion';

const useOpinionsSectionViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    data,
    loading,
    error,
    refetch: refetchOpinions
  } = useQuery(HOMEPAGE_OPINION_QUERY, {
    variables: { isBookmarked: true },
    fetchPolicy: 'network-only'
  });
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepageOpinions;
    setSectionHasData('opinions', hasData);

    return () => {
      setSectionHasData('opinions', false);
    };
  }, [loading, data, setSectionHasData]);

  const handleNavigationToDetailPage = (item: OpinionItem, isHero?: boolean, index?: number) => {
    if (!item?.slug || !item?.type) return;

    const etiquetasString =
      item?.topics
        ?.map((t) => t?.title)
        .filter(Boolean)
        .join(',') ?? '';

    const moleculeName = isHero
      ? ANALYTICS_MOLECULES.HOME_PAGE.NEWS_PRINICPAL_CARD
      : ANALYTICS_MOLECULES.HOME_PAGE.OPINION_CAROUSEL_CARD;

    const displayIndex = isHero ? 1 : (index ?? 0) + 1;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.OPINION_SECTION,
      content_type: `${moleculeName} | ${displayIndex}`,
      content_title: item?.title || item?.slug,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_name: moleculeName,
      categories: item?.category?.title,
      Fecha_Publicacion_Texto: item?.publishedAt,
      etiquetas: etiquetasString || 'undefined'
    });

    navigation.navigate(routeNames.OPINION_STACK, {
      screen: screenNames.OPINION_DETAIL_PAGE,
      params: { slug: item.slug, collection: item.type }
    });
  };

  const handleSeeAllPress = () => {
    // Add analytics for "See All" button press
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.OPINION_SECTION,
      content_type: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_OPINION,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_OPINION
    });

    navigation.replace(routeNames.HOME_STACK, {
      screen: screenNames.MAIN_TAB_NAVIGATOR,
      params: { initialTab: screenNames.OPINION }
    });
  };

  return {
    data,
    loading,
    error,
    handleNavigationToDetailPage,
    handleSeeAllPress,
    refetchOpinions
  };
};

export default useOpinionsSectionViewModel;
