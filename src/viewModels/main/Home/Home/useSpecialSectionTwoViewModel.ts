import { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { HOMEPAGE_SPECIAL_CONTENT_QUERY } from '@src/graphql/main/home/queries';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { SpecialSectionTwoItem } from '@src/models/main/Videos/Videos';

/**
 * Hook to get the data for the special section 2 of the homepage.
 *
 * @returns {{data: HomepageSpecialContent, loading: boolean, error: ApolloError}}
 */

const useSpecialSectionTwoViewModel = () => {
  const {
    data: specialSectionTwoData,
    loading,
    error,
    refetch: refetchSpecialSectionTwo
  } = useQuery(HOMEPAGE_SPECIAL_CONTENT_QUERY, {
    variables: {
      section: 'section_2',
      isBookmarked: true
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (loading) return;

    const hasData = !!specialSectionTwoData?.HomepageSpecialContent;
    setSectionHasData('specialSectionTwo', hasData);

    return () => {
      setSectionHasData('specialSectionTwo', false);
    };
  }, [loading, specialSectionTwoData, setSectionHasData]);

  const handleAnalyticsPress = (item: SpecialSectionTwoItem, index: number) => {
    if (!item) return;

    const etiquetasString =
      item?.topics
        ?.map((t) => t?.title)
        .filter(Boolean)
        .join(',') ?? '';

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.EXCLUSIVE,
      content_type: `${ANALYTICS_MOLECULES.HOME_PAGE.CARD} | ${index + 1}`,
      content_title: item?.title,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.CARD,
      categories: item?.category?.title,
      opening_display_type: item?.relationTo,
      Fecha_Publicacion_Texto: item?.publishedAt,
      etiquetas: etiquetasString || 'undefined'
    });
  };
  return {
    data: specialSectionTwoData?.HomepageSpecialContent,
    loading,
    error,
    refetchSpecialSectionTwo,
    handleAnalyticsPress
  };
};

export default useSpecialSectionTwoViewModel;
