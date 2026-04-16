import { useCallback, useEffect, useState } from 'react';

import { useQuery, ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { useTheme } from '@src/hooks/useTheme';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { MyAccountStackParamList } from '@src/navigation/types';
import useNetworkStore from '@src/zustand/networkStore';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { GET_RECOMMENDED_SECTIONS_QUERY } from '@src/graphql/main/MyAccount/queries';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

export type RecommendedContent = {
  id: string;
  title?: string;
  slug?: string;
  collection?: 'POSTS' | 'VIDEOS' | 'LIVE_BLOGS' | 'PROGRAMS' | string;
  description?: string;
  schedule?: string;
  readTime?: number;
  liveblogStatus?: boolean;
  openingType?: string;
  videoDuration?: number;
  publishedAt?: string;
  category?: { id?: string; title?: string; slug?: string } | null;
  topics?: Array<{ id?: string; title?: string; slug?: string }> | null;
  programs?: Array<{ id?: string; title?: string; slug?: string }> | null;
  heroImages?:
    | Array<{ id?: string; url?: string; thumbnailUrl?: string }>
    | { url?: string; thumbnailUrl?: string }
    | null;
  videoType?: string;
  interactiveUrl?: string;
  platform?: string;
  fullPath?: string;
  authors?: Array<{ name?: string }> | null;
};

const useRecommendedForYouViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  useEffect(() => {
    logContentViewEvent({
      screen_name: 'Recommended for you',
      Tipo_Contenido: 'My account_Recommended for you'
    });
  }, []);

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      screen_page_web_url: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      screen_name: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.RECOMENDADO_PARA_TI}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const goToPrograms = (slug?: string) => {
    (
      navigation as unknown as {
        navigate: (
          route: string,
          options: { screen: string; params?: Record<string, unknown> }
        ) => void;
      }
    ).navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.EPISODE_DETAIL_PAGE,
      params: { slug }
    });
  };

  const goToOpinion = (item: RecommendedContent) => {
    (
      navigation as unknown as {
        navigate: (
          route: string,
          options: { screen: string; params?: Record<string, unknown> }
        ) => void;
      }
    ).navigate(routeNames.OPINION_STACK, {
      screen: screenNames.OPINION_DETAIL_PAGE,
      params: { slug: item?.slug, collection: item?.collection }
    });
  };

  const {
    data: GetRecommendedSectionsData,
    error: GetRecommendedSectionsError,
    loading,
    refetch: GetRecommendedSectionsRefetch
  } = useQuery(GET_RECOMMENDED_SECTIONS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });
  const getBackendErrorMessage = (err?: unknown): string | undefined => {
    if (!err) return undefined;
    const e = err as ApolloError;

    const gqlMsg =
      e?.graphQLErrors && e.graphQLErrors.length > 0 ? e.graphQLErrors[0]?.message : undefined;

    let netMsg: string | undefined;
    const ne = e?.networkError;
    if (ne && typeof ne === 'object') {
      const withResult = ne as { result?: { errors?: Array<{ message?: string }> } };
      const withMessage = ne as { message?: string };
      netMsg = withResult?.result?.errors?.[0]?.message ?? withMessage?.message;
    }

    return gqlMsg ?? netMsg ?? e?.message;
  };
  useEffect(() => {
    if (GetRecommendedSectionsError) {
      setToastType('error');
      const msg =
        getBackendErrorMessage(GetRecommendedSectionsError) ??
        t('screens.login.text.somethingWentWrong');
      setToastMessage(msg);
    }
  }, [GetRecommendedSectionsError, t]);

  const getLatestContentList = GetRecommendedSectionsData?.GetRecommendedSections?.sections?.filter(
    (section: { sectionType?: string }) => section?.sectionType === 'primary'
  )?.[0]?.items;

  const filteredRecommendedSectionsData =
    GetRecommendedSectionsData?.GetRecommendedSections?.sections?.filter(
      (section: { sectionType?: string }) => section?.sectionType !== 'primary'
    ) ?? [];

  const onSettingsPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      screen_page_web_url: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      screen_name: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.RECOMENDADO_PARA_TI}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.SETTINGS,
      content_name: 'Settings',
      content_action: ANALYTICS_ATOMS.SETTINGS
    });
    (
      navigation as unknown as {
        navigate: (
          route: string,
          options: { screen: string; params?: Record<string, unknown> }
        ) => void;
      }
    ).navigate(routeNames.MY_ACCOUNT_STACK, {
      screen: screenNames.SET_RECOMMENDATIONS,
      params: { isOnboarding: false }
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([GetRecommendedSectionsRefetch()]);
    } finally {
      setRefreshing(false);
    }
  }, [GetRecommendedSectionsRefetch]);

  useFocusEffect(
    useCallback(() => {
      GetRecommendedSectionsRefetch();
      return () => {};
    }, [GetRecommendedSectionsRefetch])
  );

  const onPressRetry = useCallback(async () => {
    try {
      setInternetLoader(true);
      await Promise.all([GetRecommendedSectionsRefetch()]);
      setInternetLoader(false);
    } catch {
      setInternetLoader(false);
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  }, [GetRecommendedSectionsRefetch, t]);

  const uniqueSortedTopFour = (): RecommendedContent[] => {
    const seen = new Set<string>();
    const list = ((getLatestContentList as RecommendedContent[] | undefined) ?? [])
      .filter((it: RecommendedContent) => {
        const id = it?.id as string | undefined;
        if (!id || seen.has(id)) return false;
        const collection = it?.collection;
        const allowed =
          collection === 'posts' ||
          collection === 'videos' ||
          collection === 'live-blogs' ||
          collection === 'programs';
        if (!allowed) return false;
        seen.add(id);
        return true;
      })
      .sort((a: RecommendedContent, b: RecommendedContent) => {
        const da = new Date(a?.publishedAt ?? 0).getTime();
        const db = new Date(b?.publishedAt ?? 0).getTime();
        return db - da;
      })
      .slice(0, 4);
    return list;
  };

  const computed = uniqueSortedTopFour();
  const heroItem: RecommendedContent | undefined = computed?.[0];

  const handleContentCardPress = (item: RecommendedContent, index: number, sectionType: string) => {
    const cardMapping: Record<string, { type: string; name: string }> = {
      noticias: { type: ANALYTICS_ORGANISMS.MY_ACCOUNT.NOTICIAS, name: 'News' },
      'live-blogs': { type: ANALYTICS_ORGANISMS.MY_ACCOUNT.LIVEBLOG, name: 'Liveblog' },
      opinion: { type: ANALYTICS_ORGANISMS.MY_ACCOUNT.OPINION, name: 'Opinión' },
      videos: { type: ANALYTICS_ORGANISMS.MY_ACCOUNT.VIDEOS, name: 'Video' },
      programs: { type: ANALYTICS_ORGANISMS.MY_ACCOUNT.PROGRAMAS, name: 'Programs' }
    };

    const { type: cardType, name: cardName } = cardMapping[sectionType] || cardMapping['posts'];

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      screen_page_web_url: item?.slug,
      screen_name: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.RECOMENDADO_PARA_TI}`,
      organisms: cardType,
      content_type: `${ANALYTICS_MOLECULES.MY_ACCOUNT.NEWS_CARD} | ${index + 1}`,
      content_name: `${cardName} card`,
      content_title: item?.title,
      categories: item?.category?.title,
      content_action: ANALYTICS_ATOMS.TAP
    });
  };

  const handleSectionItemPress = (item: RecommendedContent, sectionType: string, index: number) => {
    handleContentCardPress(item, index, sectionType);
    if (sectionType === 'programs') {
      goToPrograms(item?.slug);
    } else if (sectionType === 'opinion') {
      goToOpinion(item);
    } else {
      onCardPress(item);
    }
  };
  const secondaryItems: RecommendedContent[] = computed?.slice(1) ?? [];

  const getMinutes = (item: RecommendedContent) => {
    if (!item) return 0;
    if (item?.collection === 'videos') {
      const mins = formatDurationToMinutes(Number(item?.videoDuration ?? 0));
      return mins;
    }
    const rt = formatDurationToMinutes(Number(item?.readTime ?? 0));
    return rt;
  };

  const getTopicLabel = (item: RecommendedContent, sectionType?: string): string =>
    item?.collection === 'live-blogs'
      ? '• ' + t('screens.liveBlog.title')
      : sectionType === 'opinion'
        ? (item?.authors?.[0]?.name ?? '')
        : (item?.topics?.[0]?.title ?? item?.category?.title ?? item?.programs?.[0]?.title ?? '');

  const getImageUrl = (item: RecommendedContent): string => {
    if (Array.isArray(item?.heroImages)) {
      return item.heroImages?.[0]?.url ?? item.heroImages?.[0]?.thumbnailUrl ?? '';
    }
    const single = item?.heroImages as { url?: string } | null | undefined;
    return single?.url ?? '';
  };

  const getSectionHeading = (sectionType?: string): string => {
    switch (sectionType) {
      case 'videos':
        return 'Videos';
      case 'noticias':
        return 'Noticias';
      case 'live-blogs':
        return 'Liveblog';
      case 'programs':
        return 'Programas';
      case 'opinion':
        return 'Opinión';
      default:
        return sectionType ?? '';
    }
  };

  const onCardPress = (item: RecommendedContent, index?: number): void => {
    if (item?.platform === 'website' && item?.fullPath) {
      setWebUrl((Config.WEBSITE_BASE_URL || '') + item.fullPath);
      setShowWebView(true);
      return;
    }

    if (index) {
      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
        screen_page_web_url: item?.slug,
        screen_name: ANALYTICS_PAGE.RECOMENDADO_PARA_TI,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.RECOMENDADO_PARA_TI}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HERO,
        content_type:
          index > 0
            ? `${ANALYTICS_MOLECULES.MY_ACCOUNT.NEWS_CARD} | ${index + 1}`
            : ANALYTICS_MOLECULES.MY_ACCOUNT.NEWS_CARD_PRINCIPAL,
        content_name: ANALYTICS_MOLECULES.MY_ACCOUNT.NEWS_CARD,
        content_title: item?.title,
        categories: item?.category?.title,
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    const collection = item?.collection;
    if (collection === 'posts') {
      (
        navigation as unknown as {
          navigate: (
            route: string,
            options: { screen: string; params: Record<string, unknown> }
          ) => void;
        }
      ).navigate(routeNames.HOME_STACK, {
        screen: screenNames.STORY_PAGE_RENDERER,
        params: { slug: item?.slug }
      });
      return;
    }
    if (collection === 'live-blogs') {
      (
        navigation as unknown as {
          navigate: (
            route: string,
            options: { screen: string; params: Record<string, unknown> }
          ) => void;
        }
      ).navigate(routeNames.HOME_STACK, {
        screen: screenNames.LIVE_BLOG,
        params: { slug: item?.slug }
      });
      return;
    }
    (
      navigation as unknown as {
        navigate: (
          route: string,
          options: { screen: string; params: Record<string, unknown> }
        ) => void;
      }
    ).navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.EPISODE_DETAIL_PAGE,
      params: { slug: item?.slug }
    });
  };

  return {
    t,
    theme,
    goBack,
    onSettingsPress,
    loading,
    refreshing,
    onRefresh,
    internetLoader,
    onPressRetry,
    toastType,
    setToastType,
    toastMessage,
    setToastMessage,
    isInternetConnection,
    heroItem,
    secondaryItems,
    getTopicLabel,
    getImageUrl,
    getMinutes,
    onCardPress,
    GetRecommendedSectionsData: filteredRecommendedSectionsData,
    GetRecommendedSectionsError,
    getSectionHeading,
    showWebView,
    setShowWebView,
    webUrl,
    handleSectionItemPress
  };
};

export default useRecommendedForYouViewModel;
