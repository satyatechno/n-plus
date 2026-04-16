import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { useTheme } from '@src/hooks/useTheme';
import { VIDEO_QUERY, VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { CONTINUE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { shareContent } from '@src/utils/shareContent';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook that encapsulates the view model logic for the Episode Detail Page in the N+ React Native app.
 *
 * This hook manages state and handlers for video playback, bookmarking, modal visibility, and navigation.
 * It also provides API-driven data for videos and captions.
 *
 * @returns {object} An object containing:
 * - isVideoPlaying: Boolean indicating if the video is playing.
 * - setIsVideoPlaying: Setter for video playing state.
 * - isPipMode: Boolean indicating if the video is in picture-in-picture mode.
 * - setIsPipMode: Setter for picture-in-picture mode.
 * - setActiveJWIndex: Setter for active JW index.
 * - times: Current playback time.
 * - setTime: Setter for playback time.
 * - showPlayer: Boolean indicating if the video player is visible.
 * - setShowPlayer: Setter for video player visibility.
 * - route: Route object from react-navigation.
 * - persistPlaybackTime: Callback to persist playback time.
 * - onTogglePiP: Callback to toggle picture-in-picture mode.
 * - goBack: Callback to navigate back.
 * - theme: Current theme object from react-native.
 * - data: Object containing video data from the API query.
 * - currentCaption: Current caption text for the video.
 * - isCaptionsEnabled: Boolean indicating if captions are enabled for the video.
 * - handleCaptionUpdate: Callback to update caption text.
 * - handleCaptionToggle: Callback to toggle caption enabled state.
 * - captionsEnabled: Object containing caption enabled states for each video.
 * - videoCaptions: Object containing caption text for each video.
 */

const useEpisodeDetailPageViewModel = () => {
  const route = useRoute<RouteProp<VideosStackParamList, 'EpisodeDetailPage'>>();
  const { isInternetConnection } = useNetworkStore();
  const { guestToken, userId } = useAuthStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const lastApiCallRef = useRef<number>(0);
  const { t } = useTranslation();
  const [slugHistory, setSlugHistory] = useState<string[]>([]);
  const [currentSlug, setCurrentSlug] = useState(route.params?.slug);

  const timeWatched = route?.params?.timeWatched;
  const isProgram = route?.params?.isProgram;

  const {
    data,
    loading: videoLoading,
    refetch: refetchVideo
  } = useQuery(VIDEO_QUERY, {
    variables: {
      slug: currentSlug
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const uniqueById = useCallback(<T extends { id?: string }>(arr: T[]) => {
    const map = new Map<string, T>();
    arr.forEach((item) => {
      if (item?.id) map.set(item.id, item);
    });
    return Array.from(map.values()) as T[];
  }, []);

  const relatedVideosFromVideoQuery = useMemo(() => {
    const relatedPosts: Array<{ relationTo?: string; value?: { id?: string } } | null> =
      data?.Video?.relatedPosts ?? [];
    const onlyVideos = relatedPosts
      ?.filter(
        (item): item is { relationTo?: string; value: { id?: string } } =>
          item?.relationTo === 'videos' && !!item?.value?.id
      )
      ?.map((item) => item.value);

    return onlyVideos ?? [];
  }, [data?.Video?.relatedPosts]);

  const tvShowId = data?.Video?.content?.tvShow?.id;
  const { data: tvShowVideosData, loading: tvShowVideosLoading } = useQuery(VIDEOS_QUERY, {
    variables: {
      limit: 7,
      excludeSlug: currentSlug,
      tvShow: tvShowId,
      videoType: 'episode'
    },
    skip: !tvShowId || relatedVideosFromVideoQuery.length >= 7,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const tvShowVideos = useMemo(() => tvShowVideosData?.Videos?.docs ?? [], [tvShowVideosData]);

  const moreOptionsVideos = useMemo(() => {
    const combined = uniqueById([...relatedVideosFromVideoQuery, ...tvShowVideos]);

    const filtered = combined.filter((v) => v?.slug !== currentSlug);

    return filtered.slice(0, 7);
  }, [relatedVideosFromVideoQuery, tvShowVideos, uniqueById, currentSlug]);

  const moreOptionsLoading = tvShowVideosLoading;

  const {
    data: relatedVideoData,
    loading: relatedVideoLoading,
    refetch: refetchRelatedVideos
  } = useQuery(VIDEOS_QUERY, {
    variables: {
      excludeSlug: currentSlug
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const [continueVideo] = useMutation(CONTINUE_VIDEO_MUTATION);

  const handleTimeUpdate = useCallback(
    (position: number) => {
      if (!data?.Video?.id) return;
      if (position - lastApiCallRef.current >= 60) {
        lastApiCallRef.current = position;
        continueVideo({
          variables: {
            videoId: data.Video.id,
            timeWatched: Math.floor(position),
            userId: userId,
            totalDuration: data.Video.videoDuration
          }
        });
      }
    },
    [data?.Video?.id, data?.Video?.videoDuration, userId, continueVideo]
  );

  const publishedAt = formatMexicoDateTime(data?.Video?.publishedAt);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goBack = useCallback(() => {
    // Analytics event for Button back
    logSelectContentEvent({
      idPage: isProgram ? ANALYTICS_COLLECTION.PROGRAMAS : ANALYTICS_COLLECTION.VIDEOS,
      screen_page_web_url: isProgram
        ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO
        : ANALYTICS_COLLECTION.VIDEOS,
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.HEADER,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.BUTTON_BACK,
      content_name: 'Button back',
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (slugHistory.length > 0) {
      const prevSlug = slugHistory[slugHistory.length - 1];
      setSlugHistory((prev) => prev.slice(0, -1));
      setCurrentSlug(prevSlug);
    } else {
      navigation.goBack();
    }
  }, [slugHistory, navigation]);

  const handleSearchPress = useCallback(() => {
    // Analytics event for Search
    logSelectContentEvent({
      idPage: isProgram ? ANALYTICS_COLLECTION.PROGRAMAS : ANALYTICS_COLLECTION.VIDEOS,
      screen_page_web_url: isProgram
        ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO
        : ANALYTICS_COLLECTION.VIDEOS,
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.HEADER,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.SEARCH,
      content_name: 'Search',
      content_action: ANALYTICS_ATOMS.TAP
    });

    // Navigate to search screen
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  }, []);

  const handleGoToAllEpisodes = () => {
    // Analytics event for CTA more of the program
    logSelectContentEvent({
      idPage: isProgram ? ANALYTICS_COLLECTION.PROGRAMAS : ANALYTICS_COLLECTION.VIDEOS,
      screen_page_web_url: isProgram
        ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO
        : ANALYTICS_COLLECTION.VIDEOS,
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.RELATED_CONTENT,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.RELATED_CONTENT.CTA_MORE_OF_THE_PROGRAM,
      content_name: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.RELATED_CONTENT.CTA_MORE_OF_THE_PROGRAM,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.ALL_EPISODES,
      params: {
        id: data?.Video?.content?.tvShow?.id
      }
    });
  };

  const handleCardPress = (slug: string, index: number) => {
    // Get index from item data or default to 0

    // Analytics event for Episode card
    logSelectContentEvent({
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.RELATED_CONTENT,
      content_type: `${ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.RELATED_CONTENT.EPISODE_CARD} |${index + 1}`,
      content_name: data?.Video?.title,
      content_action: ANALYTICS_ATOMS.TAP,
      content_title: data?.Video?.title,
      idPage: data?.Video?.id,
      screen_page_web_url: data?.Video?.slug
    });

    if (typeof currentSlug === 'string') {
      setSlugHistory((prev) => [...prev, currentSlug]);
    }
    setCurrentSlug(slug);
  };

  const refreshList = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetchVideo(), refetchRelatedVideos()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchVideo, refetchRelatedVideos]);

  const { data: bookmarkData, loading: bookmarkLoading } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: { contentId: data?.Video?.id, type: 'Content' },
    skip: !data?.Video?.id,
    fetchPolicy: 'cache-and-network'
  });

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser ?? false;

  const handleBookmarkPress = async () => {
    // Determine if bookmarking or unbookmarking
    const isBookmarking = !isToggleBookmark;

    // Analytics event for Bookmark/Unbookmark
    logSelectContentEvent({
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.HERO,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.DETAIL_VIDEO.BOOKMARK,
      content_name: isBookmarking ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
      content_action: isBookmarking ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
      content_title: data?.Video?.title,
      idPage: data?.Video?.id,
      screen_page_web_url: data?.Video?.slug
    });

    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

    try {
      await toggleBookmarkMutation({
        variables: {
          input: {
            contentId: data?.Video?.id,
            type: 'Content'
          }
        }
      });
      setIsToggleBookmark(!isToggleBookmark);
      setToastType('success');
      setToastMessage(
        !isToggleBookmark
          ? t('screens.videos.text.articleSavedSuccessfully')
          : t('screens.videos.text.articleRemovedSuccessfully')
      );
    } catch {
      setToastType('error');
      setToastMessage(t('screens.storyPage.author.failedToUpdateBookmark'));
    }
  };

  useEffect(() => {
    if (bookmarkData) {
      setIsToggleBookmark(isBookmarkedByUser);
    }
  }, [isBookmarkedByUser, bookmarkData]);

  const onSharePress = async () => {
    // Analytics event for Share
    logSelectContentEvent({
      screen_name: isProgram ? ANALYTICS_PAGE.DETALLE_DE_EPISODIO : ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: isProgram
        ? `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.DETALLE_DE_EPISODIO}`
        : `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.HERO,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.DETAIL_VIDEO.SHARE,
      content_name: ANALYTICS_ATOMS.SHARE,
      content_action: ANALYTICS_ATOMS.SHARE,
      content_title: data?.Video?.title,
      idPage: data?.Video?.id,
      screen_page_web_url: data?.Video?.slug
    });

    if (!data?.Video?.fullPath) return;
    await shareContent({ fullPath: data.Video.fullPath });
  };

  const [theme] = useTheme();

  const etiquetas =
    Array.isArray(data?.Video?.topics) && data?.Video?.topics
      ? data?.Video?.topics.map((topic: { title?: string }) => topic?.title).filter(Boolean)
      : [];

  const etiquetasString = etiquetas.join(',');

  const productionValue = data?.Video?.content?.tvShow?.title || '';

  const federativeEntityString = data?.Video?.provinces?.title || '';

  // Analytics useEffect for content_view event
  useEffect(() => {
    if (!data?.Video?.id || !data?.Video?.slug) return;

    try {
      const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

      const analyticsPayload = {
        idPage: data.Video.id,
        screen_name: ANALYTICS_COLLECTION.DETAIL_PAGE,
        screen_class: ANALYTICS_COLLECTION.DETAIL_PAGE,
        screen_page_web_url: currentSlug || '',
        screen_page_web_url_previous: previousSlug || '',
        Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
        Fecha_Publicacion_Texto: data?.Video?.publishedAt || '',
        opening_display_type: `${data?.Video?.openingType || ''}_${data?.Video?.displayType || ''}`,
        categories: data?.Video?.category?.title || 'undefined',
        content_title: data?.Video?.title || '',
        etiquetas: etiquetasString || 'undefined',
        production: productionValue || 'undefined',
        federative_entity: federativeEntityString || 'undefined'
      };

      AnalyticsService.logEvent('content_view', analyticsPayload);
      AppEventsLogger.logEvent('page_view', analyticsPayload);
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, [
    data?.Video?.id,
    data?.Video?.slug,
    data?.Video?.title,
    data?.Video?.publishedAt,
    data?.Video?.openingType,
    data?.Video?.displayType,
    data?.Video?.category,
    currentSlug,
    slugHistory
  ]);

  return {
    route,
    goBack,
    handleSearchPress,
    theme,
    data,
    publishedAt,
    relatedVideoData,
    handleGoToAllEpisodes,
    handleCardPress,
    videoLoading,
    relatedVideoLoading,
    isInternetConnection,
    refreshList,
    refreshing,
    isBookmarkedByUser,
    bookmarkLoading,
    handleBookmarkPress,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    isToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    onSharePress,
    handleTimeUpdate,
    timeWatched,
    moreOptionsVideos,
    moreOptionsLoading
  };
};

export default useEpisodeDetailPageViewModel;
