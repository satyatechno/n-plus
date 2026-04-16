import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { HOMEPAGE_SPECIAL_CONTENT_QUERY } from '@src/graphql/main/home/queries';
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

/**
 * Hook to get the data for the special section 1 of the homepage.
 *
 * @returns {data: HomepageSpecialContent, loading: boolean, error: ApolloError, onCategoryPress: (item: {id?: string, slug?: string, title?: string}) => void, onCardPress: (item: HomepageSpecialContentItem) => void}
 */

const useSpecialSectionOneViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data,
    loading,
    error,
    refetch: refetchSpecialSectionOne
  } = useQuery(HOMEPAGE_SPECIAL_CONTENT_QUERY, {
    variables: {
      section: 'section_1',
      isBookmarked: true
    }
  });
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  /**
   * Tracks whether SpecialSectionOne has valid data and updates
   * the Home section visibility state accordingly.
   *
   * - When loading is complete, it checks if HomepageSpecialContent exists
   *   and marks the section as having data.
   * - On cleanup (component unmount or dependency change),
   *   it resets the section state to false to avoid stale visibility.
   */

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepageSpecialContent;
    setSectionHasData('specialSectionOne', hasData);

    return () => {
      setSectionHasData('specialSectionOne', false);
    };
  }, [loading, data]);

  const onCategoryPress = (item?: {
    id?: string;
    slug?: string;
    title?: string;
    type?: 'category' | 'topic';
  }) => {
    if (!item?.title) return;

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.CATEGORY_DETAIL_SCREEN,
      params: {
        id: item?.id || '',
        slug: item?.slug || '',
        title: item?.title || '',
        type: item?.type
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
    index?: number,
    itemType?: 'principal' | 'secondary' | 'carousel'
  ) => {
    if (!item?.slug) return;

    // Determine molecule name based on item type
    let moleculeName: string;
    let displayIndex: number;

    if (itemType === 'principal' || index === 0) {
      moleculeName = ANALYTICS_MOLECULES.HOME_PAGE.NEWS_PRINICPAL_CARD;
      displayIndex = (index ?? 0) + 1;
    } else if (itemType === 'carousel') {
      moleculeName = ANALYTICS_MOLECULES.HOME_PAGE.CAROUSEL;
      // Carousel items come after secondary items, so add offset
      displayIndex = (index ?? 0) + 1; // Will be adjusted based on actual secondary count
    } else {
      moleculeName = ANALYTICS_MOLECULES.HOME_PAGE.NEWS_CARD;
      displayIndex = (index ?? 0) + 1;
    }

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
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_ONE,
      content_type: `${moleculeName} | ${displayIndex}`,
      content_title: item?.title,
      content_action: itemType === 'carousel' ? ANALYTICS_ATOMS.TAP : ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_name: moleculeName,
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
    data: data?.HomepageSpecialContent,
    loading,
    error,
    onCategoryPress,
    onCardPress,
    refetchSpecialSectionOne
  };
};

export default useSpecialSectionOneViewModel;
