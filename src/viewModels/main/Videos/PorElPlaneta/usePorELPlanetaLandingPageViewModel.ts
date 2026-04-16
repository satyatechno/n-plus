import { useEffect, useState } from 'react';
import { Share } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import {
  GET_USER_CONTINUE_VIDEOS,
  POR_EL_PLANETA_MOST_VIEWED_QUERY,
  POR_EL_PLANETA_RECENT_DOCUMENTARIES_QUERY,
  PRO_EL_PLANETA_HERO_DOCUMENTARIES_QUERY
} from '@src/graphql/main/videos/queries';
import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { VideoItem } from '@src/models/main/Videos/Videos';
import { DELETE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_PRODUCTION
} from '@src/utils/analyticsConstants';

const usePorELPlanetaLandingPageViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [isProgramBookmark, setIsProgramBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  /**
   * Executes the `PRO_EL_PLANETA_HERO_DOCUMENTARIES_QUERY` GraphQL query to fetch hero documentaries data
   * for the "Por El Planeta" landing page. The query uses the current user's type and the mobile platform as variables.
   *
   * @returns
   * - `heroDocumentariesData`: The fetched documentaries data.
   * - `heroDocumentariesLoading`: Boolean indicating if the query is currently loading.
   * - `refetchheroDocumentaries`: Function to manually refetch the documentaries data.
   *
   * @remarks
   * - Uses `cache-first` as the initial fetch policy and `cache-and-network` for subsequent fetches.
   */
  const {
    data: heroDocumentariesData,
    loading: heroDocumentariesLoading,
    refetch: refetchheroDocumentaries
  } = useQuery(PRO_EL_PLANETA_HERO_DOCUMENTARIES_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: mostViewedDocumentariesData,
    loading: mostViewedDocumentariesLoading,
    refetch: refetchMostViewedDocumentaries
  } = useQuery(POR_EL_PLANETA_MOST_VIEWED_QUERY, {
    variables: {
      isBookmarked: true
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: porELPlanetaRecentDocumentariesData,
    loading: porELPlanetaRecentDocumentariesLoading,
    refetch: refetchPorELPlanetaRecentDocumentaries
  } = useQuery(POR_EL_PLANETA_RECENT_DOCUMENTARIES_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION);
  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const { data: bookmarkData, refetch: refetchBookmark } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: {
      contentId: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      type: 'Content'
    },
    fetchPolicy: 'cache-and-network'
  });

  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('por-el-planeta');

  //GET_USER_CONTINUE_VIDEOS
  const {
    data: continueVideoData,
    refetch: refetchContinueVideos,
    loading: continueVideoLoading,
    fetchMore
  } = useQuery(GET_USER_CONTINUE_VIDEOS, {
    fetchPolicy: 'network-only',
    variables: { limit: 10, isBookmarked: true, nextCursor: null }
  });

  const loadMore = () => {
    const pagination = continueVideoData?.getUserContinueVideos?.pagination;

    if (continueVideoLoading || !pagination?.hasNext) return;

    fetchMore({
      variables: {
        limit: 10,
        nextCursor: pagination.nextCursor,
        isBookmarked: true
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getUserContinueVideos: {
            ...fetchMoreResult.getUserContinueVideos,
            videos: [
              ...prev.getUserContinueVideos.videos,
              ...fetchMoreResult.getUserContinueVideos.videos
            ]
          }
        };
      }
    });
  };

  useEffect(() => {
    refetchBookmark({
      contentId: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      type: 'Content'
    });
    const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser;
    if (bookmarkData) {
      setIsProgramBookmark(isBookmarkedByUser);
    }
  }, [bookmarkData]);

  const goBack = () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HEADER,
      content_action: ANALYTICS_ATOMS.BACK,
      content_type: 'undefined',
      content_name: 'Button back',
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });
    navigation.goBack();
  };

  const handleSearchPress = () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HEADER,
      content_action: ANALYTICS_ATOMS.BACK,
      content_type: 'undefined',
      content_name: 'Search',
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const handleBookmarkPress = async (programBookmark?: boolean, contentId?: string) => {
    if (!contentId) return;
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    const data = await toggleBookmarkMutation({
      variables: {
        input: {
          contentId,
          type: 'Content'
        }
      }
    });
    {
      if (programBookmark) {
        setIsProgramBookmark(!isProgramBookmark);
      } else {
        setIsToggleBookmark(!isToggleBookmark);
      }
    }
    setToastType('success');
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HERO,
      content_type: 'undefined',
      content_action: programBookmark
        ? isProgramBookmark
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK
        : isToggleBookmark
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    setToastMessage(data?.data?.toggleBookmark?.message);
    refetchContinueVideos({ isBookmarked: true });
  };

  const handleThreeDotsBookmarkPress = async () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ACTION_SHEET,
      content_type: isToggleBookmark
        ? ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS_UNBOOKMARK
        : ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS_BOOKMARK,
      content_name: '3 dots | Bookmark',
      content_action: ANALYTICS_ATOMS.TAP,
      content_title: selectedVideo?.title,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    await handleBookmarkPress(false, selectedVideo?.id);
    setIsModalVisible(false);
  };

  const onRetry = async () => {
    try {
      setRefreshLoader(true);

      await Promise.allSettled([
        refetchheroDocumentaries(),
        refetchContinueVideos({
          isBookmarked: true
        }),
        refetchMostViewedDocumentaries({
          input: { limit: 10 }
        }),
        refetchPorELPlanetaRecentDocumentaries(),
        refetchAdvertisement()
      ]);
    } finally {
      setRefreshLoader(false);
    }
  };

  const handleVideoPress = (item: { slug: string; platform?: string; fullPath?: string }) => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.CONTINUE_WATCHING,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.CARD_OF_VIDEO,
      content_name: 'Card of video',
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    if (item?.platform === 'website' && item?.fullPath) {
      setWebUrl(Config.WEBSITE_BASE_URL + item.fullPath);
      setShowWebView(true);
      return;
    }

    const matchedVideo = continueVideoData?.getUserContinueVideos?.videos?.find(
      (video: { slug: string }) => video?.slug === item?.slug
    );

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.EPISODE_DETAIL_PAGE,
      params: {
        slug: item?.slug,
        timeWatched: matchedVideo?.timeWatched ?? 0
      }
    });
  };

  const handleMenuPress = (data: { id: string; isBookmarked: boolean }) => {
    setIsToggleBookmark(data?.isBookmarked);
    const video = continueVideoData?.getUserContinueVideos?.videos?.find(
      (item: { id: string }) => item?.id === data?.id
    );

    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS,
      content_name: '3 dots',
      content_action: ANALYTICS_ATOMS.MENU,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    if (video) {
      setSelectedVideo(video);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS_CLOSED,
      content_name: '3 dots | closed',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    setIsModalVisible(false);
  };

  const handleSharePress = async () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS_SHARE,
      content_name: '3 dots | share',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    await Share.share({
      message: selectedVideo?.title ?? ''
    });
    setIsModalVisible(false);
  };

  const handleRemovePress = async () => {
    if (!selectedVideo?.id) return;
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.THREE_DOTS_REMOVED,
      content_name: '3 dots | Removed of the list',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    setIsModalVisible(false);
    await deleteVideo({
      variables: { videoId: selectedVideo.id }
    });

    setToastType('success');
    setToastMessage(t('screens.videos.text.videoHasBeenRemoved'));
    refetchContinueVideos();
  };

  const onSeeAllPlaneteDocumenteriesPress = () => {
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ALL_DOCUMENTALES,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.BUTTON_SEE_ALL,
      content_name: 'Button see all',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DOCUMENTARIES
    });
  };

  const goToDetailPage = (slug?: string) => {
    if (!slug) return;
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HERO,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.START_TO_SEE,
      content_name: 'Comenzar a ver',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: { slug }
    });
  };

  const onPorElPlanetaCardPress = (
    item: {
      specialImage: {
        sizes: { portrait: { url: string } };
        url: string;
      };
      slug?: string;
    },
    index: number | undefined
  ) => {
    if (!item?.slug) return;
    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.THE_MOST_SEEN_OF_THE_MONTH,
      content_type: `${ANALYTICS_MOLECULES.PRODUCTION.INTERACTIVE_CONTENT_CARD} ${index !== undefined ? index + 1 : ''}`,
      content_name: 'Interactive content card',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: {
        slug: item.slug
      }
    });
  };

  const onInvestigationCardPress = (
    item: {
      specialImage: {
        sizes: { portrait: { url: string } };
        url: string;
      };
      slug?: string;
    },
    index: number | undefined
  ) => {
    if (!item?.slug) return;

    logSelectContentEvent({
      idPage: heroDocumentariesData?.PorElPlanetaHeroDocumentaries?.id,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ALL_THE_INVESTIGATION,
      content_type: `${ANALYTICS_MOLECULES.PRODUCTION.INVESTIGATION_CARD} ${index !== undefined ? index + 1 : ''}`,
      content_name: 'Investigation card',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_HOME,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: {
        slug: item.slug
      }
    });
  };

  return {
    t,
    theme,
    goBack,
    handleSearchPress,
    heroDocumentariesData: heroDocumentariesData?.PorElPlanetaHeroDocumentaries,
    handleBookmarkPress,
    handleThreeDotsBookmarkPress,
    isToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    onRetry,
    heroDocumentariesLoading,
    refreshLoader,
    continueVideoData,
    continueVideoLoading,
    handleVideoPress,
    handleMenuPress,
    isModalVisible,
    handleCloseModal,
    selectedVideo,
    handleSharePress,
    handleRemovePress,
    porELPlanetaRecentDocumentariesLoading,
    onSeeAllPlaneteDocumenteriesPress,
    porELPlanetaRecentDocumentariesData:
      porELPlanetaRecentDocumentariesData?.PorElPlanetaRecentDocumentaries,
    mostViewedDocumentariesData: mostViewedDocumentariesData?.PorElPlanetaMostViewedDocumentaries,
    mostViewedDocumentariesLoading,
    goToDetailPage,
    onPorElPlanetaCardPress,
    onInvestigationCardPress,
    isInternetConnection,
    isProgramBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showWebView,
    setShowWebView,
    webUrl,
    loadMore,
    showBannerAds
  };
};

export default usePorELPlanetaLandingPageViewModel;
