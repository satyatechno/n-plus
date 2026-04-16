import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

import { PROGRAM_QUERY, PROGRAMS_QUERY, VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { ProgramasItem } from '@src/models/main/Videos/Videos';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { ToggleBookmarkResponse } from '@src/models/main/Home/StoryPage/StoryPage';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { Topic } from '@src/views/organisms/TopicChips';
import { shareContent } from '@src/utils/shareContent';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook that manages the view model logic for the "Programs" screen in the Videos section.
 *
 * Handles fetching and pagination of programs data, navigation between program details,
 * channel/topic switching, and error/retry logic. Integrates with translation, theming,
 * and authentication stores.
 *
 * @returns {object} An object containing:
 * - `t`: Translation function from i18n.
 * - `theme`: Current theme object.
 * - `goBack`: Function to handle back navigation or slug history pop.
 * - `chipsTopic`: Array of available program channels/topics.
 * - `programasNPlusData`: List of program items for the current channel/page.
 * - `onProgramsTogglePress`: Handler to switch between program channels/topics.
 * - `hasMore`: Boolean indicating if more programs can be loaded (pagination).
 * - `programsLoading`: Boolean indicating if programs data is loading.
 * - `handleLoadMore`: Handler to fetch the next page of programs.
 * - `programData`: Data for the currently selected program.
 * - `slug`: Current program slug.
 * - `handleCardPress`: Handler for selecting a program card (updates slug/history).
 * - `isInternetConnection`: Boolean indicating internet connectivity status.
 * - `onRetry`: Handler to retry fetching data on error.
 * - `flatListRef`: Ref to the FlatList component for scrolling.
 * - `programsError`: Error object from programs query.
 * - `refreshLoader`: Boolean indicating if a refresh is in progress.
 */

const useProgramsViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const route = useRoute<RouteProp<VideosStackParamList, 'Programs'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const flatListRef = useRef<FlatList>(null);
  const slug = route?.params?.slug ?? null;
  const id = route?.params?.id ?? null;
  const channel = route?.params?.channel ?? null;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(5);
  const [loadingMore, setLoadingMore] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('programs');

  const chipsTopic = [
    { slug: 'noticias', title: 'N+ Noticias', id: Config.NPLUS_CHANNEL_NOTICIEROS },
    { slug: 'foro-tv', title: 'Foro TV', id: Config.NPLUS_CHANNEL_FOROTV }
  ];

  const [programsChannel, setProgramsChannel] = useState<string | null>(
    chipsTopic?.[0]?.id ?? null
  );

  //PROGRAMS_API
  const {
    data: programsData,
    loading: programsLoading,
    error: programsError,
    refetch: refetchPrograms,
    fetchMore: fetchMorePrograms
  } = useQuery(PROGRAMS_QUERY, {
    variables: {
      channel: programsChannel,
      limit: limit,
      page: currentPage
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  //PROGRAM_API
  const {
    data: programResponse,
    loading: programLoading,
    refetch: refetchProgram
  } = useQuery(PROGRAM_QUERY, {
    variables: {
      slug: slug
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  //Related_VIDEOS_API
  const {
    data: relatedVideoData,
    loading: relatedVideoLoading,
    refetch: refetchRelatedVideos
  } = useQuery(VIDEOS_QUERY, {
    variables: {
      tvShow: id,
      videoType: 'episode'
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  //PROGRAMAS_NPLUS_API
  const {
    data: programasNPlusData,
    loading: programasNPlusLoading,
    refetch: refetchProgramas
  } = useQuery(PROGRAMS_QUERY, {
    variables: {
      channel: route?.params?.channel,
      limit: 10,
      excludeSlug: slug
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const getToggleBookmark = async (contentId: string | undefined) => {
    if (!contentId) return;
    const res = await toggleBookmarkByUser({
      variables: { contentId: contentId, type: 'Content' },
      fetchPolicy: 'network-only'
    });
    setIsBookmark(res.data.isBookmarkedByUser);
  };

  useEffect(() => {
    getToggleBookmark(programResponse?.Program?.id);
  }, [isInternetConnection]);

  useEffect(() => {
    if (isInternetConnection) {
      if (slug === null) {
        logContentViewEvent({
          idPage: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_page_web_url: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_name: ANALYTICS_PAGE.PROGRAMAS_HOME,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_HOME}`,
          production: programsChannel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
          content_title: t('screens.program.text.allPrograms')
        });
      } else if (programResponse?.Program) {
        const program = programResponse.Program;
        logContentViewEvent({
          idPage: program?.id,
          screen_page_web_url: program?.fullPath,
          screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
          Fecha_Publicacion_Texto: program?.publishedAt,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
          production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
          content_title: program.title,
          contentItem: {
            id: program.id,
            title: program.title,
            fullPath: program.fullPath,
            publishedAt: program.publishedAt,
            category: program.category,
            topics: program.topics
          }
        });
      }
    }
  }, [slug, programResponse?.Program]);

  const goBack = () => {
    logSelectContentEvent({
      screen_name: slug ? ANALYTICS_PAGE.PROGRAMAS_DETAIL : ANALYTICS_PAGE.PROGRAMAS_HOME,
      screen_page_web_url: slug ? ANALYTICS_PAGE.PROGRAMAS_DETAIL : ANALYTICS_PAGE.PROGRAMAS_HOME,
      Tipo_Contenido: slug
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`
        : `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_HOME}`,
      production: programsChannel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON,
      content_name: ANALYTICS_ATOMS.BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const handleSearchPress = () => {
    logSelectContentEvent({
      screen_name: slug ? ANALYTICS_PAGE.PROGRAMAS_DETAIL : ANALYTICS_PAGE.PROGRAMAS_HOME,
      Tipo_Contenido: slug
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`
        : `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_HOME}`,
      production: programsChannel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON,
      content_name: ANALYTICS_ATOMS.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const onProgramsTogglePress = useCallback(
    (value: string | Topic, categoryIndex?: number): void => {
      if (categoryIndex !== undefined) {
        const moleculeKey = categoryIndex === 0 ? 'N+' : 'N+ Foro';

        logSelectContentEvent({
          idPage: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_page_web_url: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_name: ANALYTICS_PAGE.PROGRAMAS_HOME,
          production: moleculeKey,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_HOME}`,
          organisms: ANALYTICS_ORGANISMS.VIDEO.CATEGORY_HEADER,
          content_type: `${ANALYTICS_MOLECULES.SEARCH.PILL} | ${moleculeKey}`,
          content_name: `${ANALYTICS_MOLECULES.SEARCH.PILL} | ${moleculeKey}`,
          content_action: ANALYTICS_ATOMS.TAP
        });
      }

      if (typeof value === 'string') {
        setProgramsChannel(value);
      } else {
        const channel = chipsTopic.find((c) => c.slug === value.slug);
        setProgramsChannel(channel?.id ?? null);
      }
      setCurrentPage(1);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    [chipsTopic]
  );

  const pagination = programsData?.GetPrograms;
  const handleLoadMore = async () => {
    if (!pagination?.hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      await fetchMorePrograms({
        variables: {
          page: pagination.nextPage,
          channel: programsChannel,
          limit: limit,
          cursor: pagination?.nextCursor
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            GetPrograms: {
              ...fetchMoreResult.GetPrograms,
              docs: [...prevResult.GetPrograms.docs, ...fetchMoreResult.GetPrograms.docs]
            }
          };
        }
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCardPress = useCallback(
    (data: ProgramasItem, index?: number) => {
      if (!data?.slug) return;
      if (index !== undefined && slug !== null) {
        const carouselIndex = Math.min(index, 6);

        logSelectContentEvent({
          idPage: data?.id != null ? String(data.id) : 'undefined',
          screen_page_web_url: data?.slug,
          screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
          production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
          organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS_NPLUS,
          content_type: `${ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD} | ${carouselIndex + 1}`,
          content_name: `${ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD} | ${carouselIndex + 1}`,
          content_title: data?.title,
          content_action: ANALYTICS_ATOMS.TAP
        });
      }

      if (index !== undefined && slug === null) {
        logSelectContentEvent({
          idPage: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_page_web_url: ANALYTICS_PAGE.PROGRAMAS_HOME,
          screen_name: ANALYTICS_PAGE.PROGRAMAS_HOME,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_HOME}`,
          production: programsChannel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
          organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAM_SELECCIONADO,
          content_type: `${ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD} | ${index + 1}`,
          content_name: `${ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD} | ${index + 1}`,
          content_title: data?.title,
          content_action: ANALYTICS_ATOMS.TAP
        });
      }

      navigation.push(routeNames.VIDEOS_STACK, {
        screen: screenNames.PROGRAMS,
        params: { slug: data.slug, id: data?.id, channel: programsChannel }
      });
    },
    [programsChannel, slug]
  );

  const combinedRelatedVideos = useMemo(() => {
    const programRelatedVideos: { value?: { id?: string } }[] =
      programResponse?.Program?.relatedVideos || [];
    const fallbackVideos: { id: string }[] = relatedVideoData?.Videos?.docs || [];
    if (programRelatedVideos.length < 3) {
      const neededCount = 3 - programRelatedVideos.length;
      const additionalVideos = fallbackVideos
        .filter(
          (video) =>
            !programRelatedVideos.some((programVideo) => programVideo.value?.id === video.id)
        )
        .slice(0, neededCount)
        .map((video) => ({ value: video }));

      return [...programRelatedVideos, ...additionalVideos];
    }

    return programRelatedVideos;
  }, [retryKey, programResponse?.Program?.relatedVideos, relatedVideoData?.Videos?.docs]);

  const filteredEpisodes = useMemo(() => {
    const fallbackVideos: { id: string }[] = relatedVideoData?.Videos?.docs || [];

    if (!fallbackVideos.length) return [];

    const relatedVideoIds = combinedRelatedVideos
      .map((item) => item.value?.id)
      .filter((id): id is string => Boolean(id));

    return fallbackVideos.filter((video) => !relatedVideoIds.includes(video.id));
  }, [retryKey, relatedVideoData?.Videos?.docs, combinedRelatedVideos]);

  const onRetry = async () => {
    try {
      setRefreshLoader(true);
      setRetryKey((prev) => prev + 1);
      setLimit(5);

      if (slug === null) {
        await refetchPrograms({
          channel: programsChannel,
          page: currentPage,
          limit: 5
        });
      } else {
        await Promise.all([
          refetchProgram({ slug }),
          refetchRelatedVideos({
            tvShow: id,
            videoType: 'episode'
          }),
          refetchProgramas({
            channel: route?.params?.channel
          }),
          refetchAdvertisement()
        ]);
      }
    } finally {
      setRefreshLoader(false);
    }
  };

  const onShare = async () => {
    if (!programResponse?.Program?.fullPath) return;

    logSelectContentEvent({
      idPage: programResponse?.Program?.id,
      screen_page_web_url: programResponse?.Program?.fullPath,
      screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
      production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.DETAIL_PROGRAM,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON,
      content_name: ANALYTICS_ATOMS.SHARE,
      content_action: ANALYTICS_ATOMS.SHARE
    });

    await shareContent({ fullPath: programResponse.Program.fullPath });
  };

  const [setToggleBookmark] = useMutation<ToggleBookmarkResponse>(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const [toggleBookmarkByUser] = useLazyQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const onToggleBookmark = async (contentId: string, type: string) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    try {
      setIsBookmark(!isBookmark);
      const result = await setToggleBookmark({
        variables: { input: { contentId: contentId, type } }
      });

      if (result.data?.toggleBookmark?.success) {
        setToastType('success');
        setToastMessage(
          result.data.toggleBookmark.message ||
            t('screens.storyPage.author.bookmarkUpdatedSuccessfully')
        );
      } else {
        setToastType('error');
        setToastMessage(
          result.data?.toggleBookmark?.message ||
            t('screens.storyPage.author.failedToUpdateBookmark')
        );
      }
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }

    logSelectContentEvent({
      idPage: programResponse?.Program?.id,
      screen_page_web_url: programResponse?.Program?.fullPath,
      screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
      production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON,
      content_name: !isBookmark ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
      content_action: !isBookmark ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK
    });
  };

  const handleRelatedCardPress = (slug: string, index: number) => {
    if (index >= 0) {
      logSelectContentEvent({
        idPage: programResponse?.Program?.id,
        screen_page_web_url: programResponse?.Program?.slug,
        screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
        production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
        organisms:
          index < 3
            ? ANALYTICS_ORGANISMS.VIDEOS.HERO
            : ANALYTICS_ORGANISMS.VIDEOS.EPISODES_CAROUSEL,
        content_type: `${ANALYTICS_MOLECULES.SEARCH.CARD_STYLE}_${index + 1}`,
        content_name: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE,
        content_action: ANALYTICS_ATOMS.TAP
      });
    } else {
      logSelectContentEvent({
        idPage: programResponse?.Program?.id,
        screen_page_web_url: programResponse?.Program?.slug,
        screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
        production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
        organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
        content_type: ANALYTICS_MOLECULES.VIDEOS.SEE_LAST_EPISODE,
        content_name: 'Ver el ultimo episodio',
        content_action: ANALYTICS_ATOMS.TAP
      });
    }

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.EPISODE_DETAIL_PAGE,
      params: { slug, isProgram: true }
    });
  };

  const handleGoToAllEpisodes = () => {
    logSelectContentEvent({
      idPage: programResponse?.Program?.id,
      screen_page_web_url: programResponse?.Program?.slug,
      screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
      production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.EPISODES_CAROUSEL,
      content_type: ANALYTICS_MOLECULES.VIDEOS.PROGRAM_CTA_ALL_EPISODES,
      content_name: 'Todos Ios episodios',
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.ALL_EPISODES,
      params: {
        id: route?.params?.id ?? null
      }
    });
  };

  const onSeeAllProgramsPress = () => {
    logSelectContentEvent({
      idPage: programResponse?.Program?.id,
      screen_page_web_url: programResponse?.Program?.slug,
      screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
      production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS_NPLUS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CTA_SECTION,
      content_name: 'Ver todos Ios programas',
      content_action: ANALYTICS_ATOMS.TAP
    });
    navigation.push(routeNames.VIDEOS_STACK, {
      screen: screenNames.PROGRAMS,
      params: { slug: null, channel: null }
    });
  };

  const onPresentersPress = (value: { slug: string }) => {
    logSelectContentEvent({
      idPage: programResponse?.Program?.id,
      screen_page_web_url: programResponse?.Program?.slug,
      screen_name: ANALYTICS_PAGE.PROGRAMAS_DETAIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.PROGRAMAS_DETAIL}`,
      production: channel === Config.NPLUS_CHANNEL_NOTICIEROS ? 'N+' : 'N+ Foro',
      organisms: ANALYTICS_ORGANISMS.VIDEO.ANCHORS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.HOST_PROFILE,
      content_name: 'Presentadores press',
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.AUTHOR_BIO,
      params: { slug: value?.slug }
    });
  };

  return {
    t,
    theme,
    goBack,
    handleSearchPress,
    chipsTopic,
    programasData: programsData?.GetPrograms?.docs,
    onProgramsTogglePress,
    hasMore: programsData?.GetPrograms?.hasNextPage || false,
    programsLoading,
    handleLoadMore,
    slug,
    handleCardPress,
    isInternetConnection,
    onRetry,
    flatListRef,
    programsError,
    refreshLoader,
    programData: programResponse?.Program,
    onShare,
    isBookmark,
    onToggleBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    toastType,
    toastMessage,
    setToastMessage,
    handleRelatedCardPress,
    relatedVideoLoading,
    relatedVideoData: relatedVideoData?.Videos?.docs,
    handleGoToAllEpisodes,
    hasNextPage: programsData?.GetPrograms?.hasNextPage,
    programasNPlusData: programasNPlusData?.GetPrograms?.docs,
    onSeeAllProgramsPress,
    onPresentersPress,
    programLoading,
    programasNPlusLoading,
    showBannerAds,
    combinedRelatedVideos,
    filteredEpisodes,
    loadingMore
  };
};

export default useProgramsViewModel;
