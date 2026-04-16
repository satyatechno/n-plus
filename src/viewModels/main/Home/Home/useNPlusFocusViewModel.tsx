import { useEffect, useState } from 'react';

import Config from 'react-native-config';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HOMEPAGE_NFOCUS_SECTION_QUERY } from '@src/graphql/main/home/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

const useNPlusFocusViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  const {
    data,
    loading,
    error,
    refetch: refetchNPlusFocus
  } = useQuery(HOMEPAGE_NFOCUS_SECTION_QUERY, {
    variables: { isBookmarked: true },
    fetchPolicy: 'network-only'
  });

  const handleSeeAllPress = () => {
    // Log analytics event for 'Explora N+ Focus' button tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.NPLUS_FOCUS,
      content_type: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_DARK_THEME_EXPLORA_NPLUS,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_DARK_THEME_EXPLORA_NPLUS,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.NPLUS_FOCUS_LANDING_PAGE
    });
  };

  const goToInvestigationDetailScreen = (slug: string) => {
    if (!slug) return;

    const investigation = data?.HomepageNfocus?.[0];

    const etiquetasString =
      investigation?.topics
        ?.map((t: { title: string }) => t?.title)
        .filter(Boolean)
        .join(',') ?? '';

    // Log analytics event for 'Ver Investigación' button tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.NPLUS_FOCUS,
      content_type: ANALYTICS_MOLECULES.HOME_PAGE.BUTTON_DARK_THEME_VER_INVESTIGACION,
      content_name: data?.HomepageNfocus?.[0]?.title || 'undefined',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: slug,
      idPage: data?.HomepageNfocus?.[0]?.id || 'undefined',
      content_title: data?.HomepageNfocus?.[0]?.title,
      categories: data?.HomepageNfocus?.[0]?.category?.title,
      etiquetas: etiquetasString,
      Fecha_Publicacion_Texto: data?.HomepageNfocus?.[0]?.publishedAt
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug
      }
    });
  };

  const handleInteractiveResearchPress = () => {
    const firstLink = data?.HomepageNfocus?.[0]?.fullPath;
    const url = Config.WEBSITE_BASE_URL + firstLink;

    if (url) {
      // Log analytics event for 'Ver Interactivo' button tap
      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
        organisms: ANALYTICS_ORGANISMS.HOME_PAGE.NPLUS_FOCUS,
        content_type: ANALYTICS_MOLECULES.HOME_PAGE.BUTTON_DARK_THEME_VER_INTERACTIVO,
        content_name: data?.HomepageNfocus?.[0]?.title || 'undefined',
        content_action: ANALYTICS_ATOMS.TAP,
        screen_page_web_url: data?.HomepageNfocus?.[0]?.slug,
        idPage: data?.HomepageNfocus?.[0]?.id || 'undefined',
        content_title: data?.HomepageNfocus?.[0]?.title,
        Fecha_Publicacion_Texto: data?.HomepageNfocus?.[0]?.publishedAt,
        categories: data?.HomepageNfocus?.[0]?.category?.title
      });

      setWebUrl(url);
      setShowWebView(true);
    }
  };

  const onNPlusVideoCardPress = (
    item: {
      slug?: string;
      relationTo?: string;
      title?: string;
      id?: string;
      topics?: { title?: string }[];
      publishedAt?: string;
      category?: { title?: string };
    },
    cardIndex: number
  ) => {
    if (!item?.slug) return;

    // Determine molecule type based on card index
    const moleculeType =
      cardIndex === 1
        ? `${ANALYTICS_MOLECULES.HOME_PAGE.CARD_STYLE_1_X1} | ${cardIndex}`
        : `${ANALYTICS_MOLECULES.HOME_PAGE.NEWS_SECTION_X1} | ${cardIndex}`;

    const etiquetasString =
      item?.topics
        ?.map((t) => t?.title)
        .filter(Boolean)
        .join(',') ?? '';
    // Log analytics event for video card tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.NPLUS_FOCUS,
      content_type: moleculeType,
      content_name: item?.title || 'undefined',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id,
      content_title: item?.title,
      etiquetas: etiquetasString,
      Fecha_Publicacion_Texto: item?.publishedAt,
      categories: item?.category?.title
    });

    if (item?.relationTo === 'posts') {
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

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepageNfocus;
    setSectionHasData('nplusFocus', hasData);

    return () => {
      setSectionHasData('nplusFocus', false);
    };
  }, [loading, data, setSectionHasData]);

  return {
    data,
    loading,
    error,
    handleSeeAllPress,
    goToInvestigationDetailScreen,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    onNPlusVideoCardPress,
    refetchNPlusFocus
  };
};

export default useNPlusFocusViewModel;
