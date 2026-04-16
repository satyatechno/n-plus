import { useCallback, useEffect, useState, useMemo, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { useTheme } from '@src/hooks/useTheme';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { RootStackParamList } from '@src/navigation/types';
import {
  ExclusiveItem,
  PorElPlanetaItem,
  ProgramasItem,
  ContinueWatchingVideo
} from '@src/models/main/Videos/Videos';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import {
  EXCLUSIVE_NPLUS_QUERY,
  GET_POR_EL_PLANETE_QUERY,
  PROGRAMAS_NPLUS_QUERY,
  GET_NPLUS_VIDEO_QUERY,
  VIDEO_HERO_CAROUSEL_QUERY,
  ULTIMANOTIAS_QUERY,
  GET_USER_CONTINUE_VIDEOS,
  N_PLUS_FOCUS_QUERY,
  CHANNELS_QUERY
} from '@src/graphql/main/videos/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { shareContent } from '@src/utils/shareContent';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { useScrollAnalytics } from '@src/hooks/useScrollAnalytics';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_COLLECTION,
  getNPlusFocusCarouselMolecule,
  getPorElPlanetaCarouselMolecule,
  getLatestNewsCarouselMolecule,
  getNPlusVideosMolecule,
  getNPlusCarouselVideosMolecule,
  ANALYTICS_PAGE,
  ANALYTICS_ID_PAGE
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook that encapsulates the view model logic for the Videos screen in the N+ React Native app.
 *
 * This hook manages state and handlers for video playback, bookmarking, modal visibility, and navigation.
 * It also provides static and API-driven data for videos, carousels, programs, and topics.
 *
 * @returns {object} An object containing:
 * - `t`: Translation function from i18n.
 * - `theme`: Current theme object.
 * - `onExclusivePress`: Handler for exclusive video press.
 * - `isFullScreen`: Boolean indicating if the video player is in fullscreen mode.
 * - `setFullScreen`: Setter for fullscreen mode.
 * - `setIsPipMode`: Setter for Picture-in-Picture mode.
 * - `isPipMode`: Boolean indicating if PiP mode is active.
 * - `persistPlaybackTime`: Callback to persist playback time.
 * - `time`: Current playback time.
 * - `setTime`: Setter for playback time.
 * - `videosData`: Static array of video items for testing.
 * - `handleVideoPress`: Handler for video item press.
 * - `handleMenuPress`: Handler for menu press on a video item.
 * - `PlanetData`: Static array of planet-related data for testing.
 * - `ProgramasData`: Static array of program data for testing.
 * - `carouselData`: Static array of carousel items for testing.
 * - `nPlusVideoData`: Object containing vertical and horizontal video data arrays.
 * - `isModalVisible`: Boolean indicating if the modal is visible.
 * - `selectedVideo`: Currently selected video item.
 * - `handleCloseModal`: Handler to close the modal.
 * - `handleSharePress`: Handler for share press in the modal.
 * - `handleRemovePress`: Handler for remove-from-list press in the modal.
 * - `isBookmarked`: Boolean indicating if the current video is bookmarked.
 * - `handleBookmarkPress`: Handler to toggle bookmark state.
 * - `chipsTopic`: Array of topic chips for filtering.
 * - `onSeeAllProgramsPress`: Handler to navigate to all programs.
 * - `exclusiveNplusData`: Data from the exclusive N+ API query.
 * - `programasNPlusData`: Data from the programs N+ API query.
 * - `onProgramsTogglePress`: Handler to toggle program channels.
 * - `onProgramsCardPress`: Handler for pressing a program card.
 *
 * @remarks
 * - Static data is used for testing and will be replaced with API data in the future.
 * - Integrates with navigation, theming, and global stores for video player and authentication.
 */

const useVideosViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    try {
      logContentViewEvent({
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        content_title: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: ANALYTICS_ID_PAGE.VIDEOS_LANDING
      });
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, []);

  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<ContinueWatchingVideo | null>(null);
  const [time, setTime] = useState<number>(0);
  const [isPipMode, setIsPipMode] = useState<boolean>(false);
  const [isReelMode, setReelMode] = useState<boolean>(false);
  const [selectedExclusiveIndex, setSelectedExclusiveIndex] = useState<number>(0);
  const [programasChannel, setProgramasChannel] = useState<string | null>();
  const { cleanup: cleanupScrollAnalytics } = useScrollAnalytics();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const widgetRefetch = useRef<null | (() => Promise<void>)>(null);
  const weatherWidgetRefetch = useRef<null | (() => Promise<void>)>(null);
  const timerRefetch = useRef<null | (() => Promise<void>)>(null);
  const {
    data: exclusiveNplusData,
    loading: exclusiveNplusLoading,
    refetch: refetchExclusive
  } = useQuery(EXCLUSIVE_NPLUS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: programasNPlusData,
    loading: programasNPlusLoading,
    refetch: refetchProgramas
  } = useQuery(PROGRAMAS_NPLUS_QUERY, {
    variables: {
      channel: programasChannel
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: nPlusFocusData,
    refetch: refetchNPlus,
    loading: nPlusFocusLoading
  } = useQuery(N_PLUS_FOCUS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const {
    data: nPlusVideoSectionData,
    loading: nPlusVideoSectionLoading,
    refetch: refetchNPlusVideos
  } = useQuery(GET_NPLUS_VIDEO_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: porElPlaneteDocumentariesData,
    refetch: refetchPorElPlanete,
    loading: porElPlaneteDocumentariesLoading
  } = useQuery(GET_POR_EL_PLANETE_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const {
    data: videoHeroCarouselData,
    loading: videoHeroCarouselLoading,
    refetch: refetchVideoHero
  } = useQuery(VIDEO_HERO_CAROUSEL_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: ultimaNoticiasData,
    loading: ultimaNoticiasLoading,
    refetch: ultimaNoticiasDataRefetch
  } = useQuery(ULTIMANOTIAS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  const { data: channelsTopicData, refetch: refetchChannelsTopic } = useQuery(CHANNELS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('video');

  const chipsTopic = channelsTopicData?.ChannelNPlus;

  useEffect(() => {
    if (channelsTopicData) {
      setProgramasChannel(chipsTopic?.[0]?.id);
    }
  }, [channelsTopicData]);

  useFocusEffect(
    useCallback(() => {
      refetchContinueVideos({ isBookmarked: true });
    }, [])
  );

  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION);

  const nPlusFocusDocs = nPlusFocusData?.NPlusFocus ?? [];

  const nPlusVideoData = useMemo(() => nPlusVideoSectionData?.NPlusVideos, [nPlusVideoSectionData]);

  const porElPlaneteData = useMemo(
    () => porElPlaneteDocumentariesData?.PorElPlanetaDocumentaries,
    [porElPlaneteDocumentariesData]
  );

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const {
    data: continueVideoData,
    refetch: refetchContinueVideos,
    fetchMore,
    loading: continueVideoDataLoading
  } = useQuery(GET_USER_CONTINUE_VIDEOS, {
    fetchPolicy: 'network-only',
    variables: { limit: 10, nextCursor: null, isBookmarked: true }
  });

  const loadMore = useCallback(() => {
    const pagination = continueVideoData?.getUserContinueVideos?.pagination;

    if (continueVideoDataLoading || !pagination?.hasNext) return;

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
  }, [continueVideoData, continueVideoDataLoading, fetchMore]);

  // Continue watching analytics functions - defined early to be used in handleBookmarkPress and handleCloseModal
  const handleContinueWatchingBookmarkAnalytics = useCallback(
    (item: ContinueWatchingVideo, action: 'save' | 'unsave' = 'save') => {
      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
        content_type:
          action === 'save'
            ? ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_BOOKMARK
            : ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_UNBOOKMARK,
        content_title: String(item?.title ?? ''),
        content_action: ANALYTICS_ATOMS.TAP
      });
    },
    []
  );

  const handleContinueWatchingCloseAnalytics = useCallback((item: ContinueWatchingVideo) => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_CLOSED,
      content_title: String(item?.title ?? ''),
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const handleBookmarkPress = useCallback(
    async (contentId?: string) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }

      if (!contentId) return;

      // Analytics for continue watching is handled in VideoOptionsModal
      // No need to call it here to avoid duplicate events

      const result = await toggleBookmarkMutation({
        variables: {
          input: {
            contentId,
            type: 'Content'
          }
        }
      });

      if (result.data?.toggleBookmark?.success) {
        setIsToggleBookmark(!isToggleBookmark);
        setToastType('success');
        setToastMessage(
          result.data?.toggleBookmark?.message ||
            t('screens.storyPage.author.bookmarkUpdatedSuccessfully')
        );
      } else {
        setToastType('error');
        setToastMessage(
          result.data?.toggleBookmark?.message ||
            t('screens.storyPage.author.failedToUpdateBookmark')
        );
      }
      refetchContinueVideos({ isBookmarked: true });
      refetchNPlusVideos(); // Refetch N+ Videos to update bookmark states
    },
    [
      guestToken,
      toggleBookmarkMutation,
      isToggleBookmark,
      t,
      refetchContinueVideos,
      continueVideoData,
      refetchNPlusVideos
    ]
  );

  const onExclusivePress = useCallback(
    (data: ExclusiveItem) => {
      if (isInternetConnection) {
        setTime(0);
        const list = exclusiveNplusData?.ExclusiveNPlusVideos?.videos ?? [];
        const idx = list.findIndex((v: ExclusiveItem) => v?.id === data?.id);
        setSelectedExclusiveIndex(idx >= 0 ? idx : 0);
        setIsPipMode(false);
        setTimeout(() => setReelMode(true), 100);
      } else {
        return;
      }
    },
    [isInternetConnection, exclusiveNplusData]
  );

  const onProgramsTogglePress = useCallback(
    (channel: { id?: string | null } | null) => {
      const channelId = channel?.id ?? null;
      setProgramasChannel(channelId);
      refetchProgramas({
        channel: channelId
      });
    },
    [refetchProgramas]
  );

  const onSeeAllProgramsPress = useCallback(() => {
    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.PROGRAMS,
      params: { slug: null, channel: null }
    });
  }, [navigation]);

  const onProgramsCardPress = useCallback(
    (data: ProgramasItem) => {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.PROGRAMS,
        params: { slug: data?.slug, id: data?.id, channel: programasChannel }
      });
    },
    [navigation, programasChannel]
  );

  const persistPlaybackTime = useCallback((value: number) => {
    setTime(value);
  }, []);

  const onRetry = useCallback(async () => {
    try {
      setRefreshLoader(true);
      await Promise.allSettled([
        refetchVideoHero(),
        refetchExclusive(),
        refetchContinueVideos({ isBookmarked: true }),
        ultimaNoticiasDataRefetch(),
        refetchNPlusVideos(),
        refetchProgramas({
          channel: programasChannel
        }),
        refetchNPlus(),
        refetchPorElPlanete(),
        refetchChannelsTopic(),
        refetchAdvertisement(),
        widgetRefetch.current?.(),
        weatherWidgetRefetch.current?.(),
        timerRefetch.current?.()
      ]);
    } finally {
      setRefreshLoader(false);
    }
  }, [
    programasChannel,
    refetchVideoHero,
    refetchExclusive,
    refetchContinueVideos,
    ultimaNoticiasDataRefetch,
    refetchNPlusVideos,
    refetchProgramas,
    refetchNPlus,
    refetchPorElPlanete,
    refetchChannelsTopic,
    refetchAdvertisement
  ]);

  const handleVideoPress = useCallback(
    (item: { slug: string; platform: string; fullPath: string }) => {
      if (item?.platform === 'website') {
        setWebUrl(Config.WEBSITE_BASE_URL + item?.fullPath);
        setShowWebView(true);
      } else {
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
      }
    },
    [continueVideoData, navigation]
  );

  const handleMenuPress = useCallback(
    (data: { id: string; isBookmarked: boolean }) => {
      setIsToggleBookmark(data?.isBookmarked);
      const video = continueVideoData?.getUserContinueVideos?.videos?.find(
        (item: { id: string }) => item?.id === data?.id
      );

      if (video) {
        setSelectedVideo(video);
        setIsModalVisible(true);
      }
    },
    [continueVideoData]
  );

  const handleCloseModal = useCallback(() => {
    // Check if this is a continue watching video
    const isContinueWatchingVideo = continueVideoData?.getUserContinueVideos?.videos?.some(
      (video: ContinueWatchingVideo) => video?.id === selectedVideo?.id
    );

    if (isContinueWatchingVideo && selectedVideo) {
      handleContinueWatchingCloseAnalytics(selectedVideo as ContinueWatchingVideo);
    }

    setIsModalVisible(false);
  }, [continueVideoData, selectedVideo]);

  const handleSharePress = useCallback(async () => {
    if (!selectedVideo?.id) return;
    const fullPath = selectedVideo?.fullPath ?? '';

    // Check if this is a continue watching video
    const isContinueWatchingVideo = continueVideoData?.getUserContinueVideos?.videos?.some(
      (video: ContinueWatchingVideo) => video?.id === selectedVideo?.id
    );

    if (isContinueWatchingVideo) {
      handleContinueWatchingShareAnalytics(selectedVideo as ContinueWatchingVideo);
    }

    await shareContent({ fullPath: fullPath });
    setIsModalVisible(false);
  }, [selectedVideo]);

  const handleRemovePress = useCallback(async () => {
    if (!selectedVideo?.id) return;

    // Check if this is a continue watching video
    const isContinueWatchingVideo = continueVideoData?.getUserContinueVideos?.videos?.some(
      (video: ContinueWatchingVideo) => video?.id === selectedVideo?.id
    );

    if (isContinueWatchingVideo) {
      handleContinueWatchingRemoveAnalytics(selectedVideo as ContinueWatchingVideo);
    }

    setIsModalVisible(false);
    await deleteVideo({
      variables: { videoId: selectedVideo.id }
    });

    setToastType('success');
    setToastMessage(t('screens.videos.text.videoHasBeenRemoved'));
    refetchContinueVideos();
  }, [selectedVideo, deleteVideo, t, refetchContinueVideos]);

  const onPorElPlanetaCardPress = useCallback(
    (item: { slug: string }) => {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
        params: {
          slug: item?.slug
        }
      });
    },
    [navigation]
  );

  const onSeeAllPlaneteDocumenteriesPress = useCallback(() => {
    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_LANDING_PAGE
    });
  }, [navigation]);

  const handleLatestNewsPress = useCallback(
    (item: { slug: string }) => {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.VIDEO_DETAIL_PAGE,
        params: {
          slug: item?.slug
        }
      });
    },
    [navigation]
  );

  const onNPlusVideoCardPress = useCallback(
    (slug: string) => {
      if (!slug) return;
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.EPISODE_DETAIL_PAGE,
        params: { slug }
      });
    },
    [navigation]
  );

  const onSeeAllNPlusFocusDocumenteriesPress = useCallback(() => {
    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.NPLUS_FOCUS_LANDING_PAGE
    });
  }, [navigation]);

  const onNPlusFocusCardPress = useCallback(
    (slug: string) => {
      navigation.navigate(routeNames.VIDEOS_STACK, {
        screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
        params: { slug }
      });
    },
    [navigation]
  );

  const handleExclusivePressAnalytics = useCallback((item: ExclusiveItem, index: number) => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.EXCLUSIVO,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.CARD} | ${index}`,
      content_title: item.title,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const handleLatestNewsPressAnalytics = useCallback(
    (item: (typeof ultimaNoticiasData.UltimasNoticias)[0], index: number) => {
      const latestNewsMolecule = getLatestNewsCarouselMolecule(index);

      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.LATEST_NEWS,
        content_type: latestNewsMolecule,
        content_title: item.title,
        content_action: ANALYTICS_ATOMS.TAP,
        categories: item?.category?.title
      });
    },
    []
  );

  const handlePrincipalVideoAnalytics = useCallback(
    (
      action:
        | typeof ANALYTICS_ATOMS.TAP_IN_TEXT
        | typeof ANALYTICS_ATOMS.BOOKMARK
        | typeof ANALYTICS_ATOMS.UNBOOKMARK
    ) => {
      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: nPlusVideoData?.hero?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.N_PLUS_VIDEOS,
        content_type: ANALYTICS_MOLECULES.VIDEOS.PRINCIPAL_VIDEO,
        content_title: nPlusVideoData?.hero?.title,
        content_action: action
      });
    },
    [nPlusVideoData]
  );

  const handleSecondaryVideoAnalytics = useCallback(
    (
      item: (typeof nPlusVideoData.secondary)[0],
      index: number,
      action:
        | typeof ANALYTICS_ATOMS.TAP_IN_TEXT
        | typeof ANALYTICS_ATOMS.BOOKMARK
        | typeof ANALYTICS_ATOMS.UNBOOKMARK
    ) => {
      const secondaryVideoMolecule = getNPlusVideosMolecule(index);

      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.N_PLUS_VIDEOS,
        content_type: secondaryVideoMolecule,
        content_title: item.title,
        content_action: action
      });
    },
    []
  );

  const handleNPlusCarouselPressAnalytics = useCallback(
    (
      item: (typeof nPlusVideoData.carousel)[0],
      index: number,
      action:
        | typeof ANALYTICS_ATOMS.TAP_IN_TEXT
        | typeof ANALYTICS_ATOMS.BOOKMARK
        | typeof ANALYTICS_ATOMS.UNBOOKMARK
    ) => {
      const carouselMolecule = getNPlusCarouselVideosMolecule(index);

      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.N_PLUS_VIDEOS,
        content_type: carouselMolecule,
        content_title: item.title,
        content_action: action
      });
    },
    []
  );

  const handleNPlusCarouselBookmarkAnalytics = useCallback(
    (
      item: (typeof nPlusVideoData.carousel)[0],
      index: number,
      action: typeof ANALYTICS_ATOMS.BOOKMARK | typeof ANALYTICS_ATOMS.UNBOOKMARK
    ) => {
      const carouselMolecule = getNPlusCarouselVideosMolecule(index);

      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.N_PLUS_VIDEOS,
        content_type: carouselMolecule,
        content_title: item.title,
        content_action: action
      });
    },
    []
  );

  // Programs analytics handler functions
  const handleProgramsChannelPillAnalytics = useCallback((item: ProgramasItem, action: 'tap') => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id?.toString() || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.CATEGORY} | ${item.title}`,
      content_title: item.title,
      content_action: action
    });
  }, []);

  const handleProgramsCarouselAnalytics = useCallback(
    (item: ProgramasItem, action: 'tap' | 'swipe_right') => {
      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id?.toString() || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS,
        content_type: ANALYTICS_MOLECULES.VIDEOS.VIDEO_CARD,
        content_title: item.title,
        content_action: action
      });
    },
    []
  );

  const handleProgramsCtaAnalytics = useCallback(() => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CTA_ALL_EPISODES,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  // Continue watching analytics handler functions
  const handleContinueWatchingCardAnalytics = useCallback((item: ContinueWatchingVideo) => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.CONTINUE_WATCHING,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD,
      content_title: item?.title || '',
      content_action: ANALYTICS_ATOMS.MENU
    });
  }, []);

  const handleContinueWatchingShareAnalytics = useCallback((item: ContinueWatchingVideo) => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_SHARE,
      content_title: item?.title || '',
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const handleContinueWatchingRemoveAnalytics = useCallback((item: ContinueWatchingVideo) => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_REMOVE_FROM_LIST,
      content_title: item?.title || '',
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  // N+ Focus analytics handler functions
  const handleNPlusFocusHeroAnalytics = useCallback((item: ExclusiveItem, action: 'tap') => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id?.toString() || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.NPLUS_FOCUS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_HERO,
      content_title: item?.title,
      content_action: action
    });
  }, []);

  const handleNPlusFocusCarouselAnalytics = useCallback(
    (item: ExclusiveItem, index: number, action: 'tap' | 'swipe_right') => {
      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id?.toString() || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.NPLUS_FOCUS,
        content_type: getNPlusFocusCarouselMolecule(index),
        content_title: item?.title,
        content_action: action
      });
    },
    []
  );

  const handleNPlusFocusCtaAnalytics = useCallback(() => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.NPLUS_FOCUS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON_SEE_ALL_INVESTIGATION,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  // Por el Planeta analytics handler functions
  const handlePorElPlanetaCarouselAnalytics = useCallback(
    (item: PorElPlanetaItem, index: number, action: 'tap' | 'swipe_right') => {
      logSelectContentEvent({
        screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
        idPage: item?.id?.toString() || '',
        screen_name: ANALYTICS_COLLECTION.VIDEOS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.POR_EL_PLANETA,
        content_type: getPorElPlanetaCarouselMolecule(index),
        content_title: item.title,
        content_action: action
      });
    },
    []
  );

  const handlePorElPlanetaCtaAnalytics = useCallback(() => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.POR_EL_PLANETA,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON_SEE_ALL_SHORT_REPORTS,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  // Search analytics handler function
  const handleSearchAnalytics = useCallback(() => {
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: ANALYTICS_ATOMS.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  }, []);

  // Cleanup scroll analytics on unmount
  useEffect(() => cleanupScrollAnalytics, [cleanupScrollAnalytics]);

  return {
    t,
    theme,
    onExclusivePress,
    isReelMode,
    setReelMode,
    selectedExclusiveIndex,
    setIsPipMode,
    isPipMode,
    persistPlaybackTime,
    time,
    setTime,
    handleVideoPress,
    handleMenuPress,
    nPlusVideoData,
    isModalVisible,
    selectedVideo,
    handleCloseModal,
    handleSharePress,
    handleRemovePress,
    handleBookmarkPress,
    onPorElPlanetaCardPress,
    onSeeAllPlaneteDocumenteriesPress,
    chipsTopic,
    nPlusFocusData,
    onSeeAllProgramsPress,
    exclusiveNplusData,
    programasNPlusData,
    onProgramsTogglePress,
    onProgramsCardPress,
    porElPlaneteData,
    exclusiveNplusLoading,
    programasNPlusLoading,
    onRetry,
    refreshLoader,
    isInternetConnection,
    videoHeroCarouselData,
    videoHeroCarouselLoading,
    ultimaNoticiasData,
    ultimaNoticiasLoading,
    continueVideoData,
    toastMessage,
    toastType,
    setToastMessage,
    handleLatestNewsPress,
    onNPlusVideoCardPress,
    nPlusFocusLoading,
    porElPlaneteDocumentariesLoading,
    nPlusVideoSectionLoading,
    onSeeAllNPlusFocusDocumenteriesPress,
    onNPlusFocusCardPress,
    nPlusFocusDocs,
    isToggleBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showWebView,
    setShowWebView,
    webUrl,
    loadMore,
    continueVideoDataLoading,
    widgetRefetch,
    showBannerAds,
    weatherWidgetRefetch,
    timerRefetch,
    handleExclusivePressAnalytics,
    handleLatestNewsPressAnalytics,
    handlePrincipalVideoAnalytics,
    handleSecondaryVideoAnalytics,
    handleNPlusCarouselPressAnalytics,
    handleNPlusCarouselBookmarkAnalytics,
    handleProgramsChannelPillAnalytics,
    handleProgramsCarouselAnalytics,
    handleProgramsCtaAnalytics,
    handleContinueWatchingCardAnalytics,
    handleNPlusFocusHeroAnalytics,
    handleNPlusFocusCarouselAnalytics,
    handleNPlusFocusCtaAnalytics,
    handlePorElPlanetaCarouselAnalytics,
    handlePorElPlanetaCtaAnalytics,
    handleSearchAnalytics,
    handleContinueWatchingBookmarkAnalytics,
    handleContinueWatchingShareAnalytics,
    handleContinueWatchingRemoveAnalytics,
    handleContinueWatchingCloseAnalytics
  };
};

export default useVideosViewModel;
