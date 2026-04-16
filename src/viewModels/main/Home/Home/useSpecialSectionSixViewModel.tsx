import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@src/navigation/types';
import { HOMEPAGE_SPECIAL_CONTENT_QUERY } from '@src/graphql/main/home/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

const useSpecialSectionSixViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    data,
    loading,
    error,
    refetch: refetchSpecialSectionSix
  } = useQuery(HOMEPAGE_SPECIAL_CONTENT_QUERY, {
    variables: {
      section: 'section_6',
      isBookmarked: true
    }
  });
  const redirectTo = data?.HomepageSpecialContent?.redirectTo;

  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepageSpecialContent;
    setSectionHasData('specialSectionSix', hasData);

    return () => {
      setSectionHasData('specialSectionSix', false);
    };
  }, [loading, data, setSectionHasData]);

  const handleSeeAllPress = (title?: string) => {
    if (!title) return;

    // Add analytics for "See All" button press
    logSelectContentEvent({
      idPage: title,
      screen_page_web_url: title,
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_SIX,
      content_type: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON,
      content_title: title,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON
    });

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.CATEGORY_DETAIL_SCREEN,
      params: {
        title: redirectTo?.title,
        id: redirectTo?.id,
        slug: redirectTo?.slug,
        type: 'category'
      }
    });
  };

  const onCardPress = (
    item: {
      relationTo: string;
      slug?: string;
      title: string;
      id: string;
      category?: { title: string };
      publishedAt?: string;
      topics?: { title: string }[];
    },
    index?: number
  ) => {
    if (!item?.slug) return;
    const etiquetasString =
      item?.topics
        ?.map((t) => t?.title)
        .filter(Boolean)
        .join(',') ?? '';

    // Add analytics for card tap
    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_SIX,
      content_type: `${ANALYTICS_MOLECULES.HOME_PAGE.PASSION_PRODUCTS} | ${(index ?? 0) + 1}`,
      content_title: item?.title,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.PASSION_PRODUCTS,
      categories: item?.category?.title,
      opening_display_type: item?.relationTo,
      Fecha_Publicacion_Texto: item?.publishedAt,
      etiquetas: etiquetasString || 'undefined'
    });

    if (item.relationTo === 'posts') {
      navigation.navigate(routeNames.HOME_STACK, {
        screen: screenNames.STORY_PAGE_RENDERER,
        params: { slug: item.slug }
      });
    } else {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.EPISODE_DETAIL_PAGE,
        params: { slug: item.slug }
      });
    }
  };

  return {
    data,
    loading,
    error,
    handleSeeAllPress,
    onCardPress,
    refetchSpecialSectionSix
  };
};

export default useSpecialSectionSixViewModel;
