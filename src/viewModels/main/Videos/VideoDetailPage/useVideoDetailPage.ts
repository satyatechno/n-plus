import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { useTheme } from '@src/hooks/useTheme';
import { VIDEO_QUERY, VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import { CaptionMap, EnabledMap } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { CONTINUE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { registerFullScreenBackHandler } from '@src/hooks/useBackHandlerForFullScreen';
import { shareContent } from '@src/utils/shareContent';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { AppEventsLogger } from 'react-native-fbsdk-next';

/**
 * Custom React hook that encapsulates the view model logic for the Video Detail Page in the Videos section.
 *
 * Manages state and handlers for video playback, bookmarking, modal visibility, and navigation.
 * It also provides API-driven data for videos and captions.
 *
 * @returns {object} An object containing:
 * - `isVideoPlaying`: Boolean indicating if the video is playing.
 * - `setIsVideoPlaying`: Setter for video playing state.
 * - `isPipMode`: Boolean indicating if the video is in picture-in-picture mode.
 * - `setIsPipMode`: Setter for picture-in-picture mode.
 * - `showPlayer`: Boolean indicating if the video player is visible.
 * - `setShowPlayer`: Setter for video player visibility.
 * - `route`: Route object from react-navigation.
 * - `persistPlaybackTime`: Callback to persist playback time.
 * - `onTogglePiP`: Callback to toggle picture-in-picture mode.
 * - `goBack`: Callback to navigate back.
 * - `theme`: Current theme object from react-native.
 * - `data`: Object containing video data from the API query.
 * - `currentCaption`: Current caption text for the video.
 * - `isCaptionsEnabled`: Boolean indicating if captions are enabled for the video.
 * - `captionsEnabled`: Object containing caption enabled states for each video.
 * - `videoCaptions`: Object containing caption text for each video.
 * - `publishedAt`: Date string representing when the video was published.
 * - `relatedVideoData`: Object containing related video data from the API query.
 * - `handleCaptionUpdate`: Callback to update caption text.
 * - `handleCaptionToggle`: Callback to toggle caption enabled state.
 * - `handleCardPress`: Callback to handle card press (navigate to Episode Detail Page).
 * - `refreshList`: Handler to refresh the video list.
 * - `refreshing`: Boolean indicating if the list is currently refreshing.
 * - `isBookmarkedByUser`: Boolean indicating if the user has bookmarked the video.
 * - `bookmarkLoading`: Boolean indicating if the bookmark data is loading.
 * - `handleBookmarkPress`: Callback to handle bookmark press.
 * - `bookmarkModalVisible`: Boolean indicating if the bookmark modal is visible.
 * - `isToggleBookmark`: Boolean indicating if the bookmark toggle button should be enabled or disabled.
 * - `toastType`: String indicating if the toast message should be success or error.
 * - `toastMessage`: String containing the toast message to be displayed.
 * - `onSharePress`: Callback to handle share press.
 */

const useVideoDetailPageViewModel = () => {
  const { isVideoPlaying, setIsVideoPlaying, isPipMode, setIsPipMode, setActiveJWIndex } =
    useVideoPlayerStore();
  const [times, setTime] = useState<number>(0);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [videoCaptions, setVideoCaptions] = useState<CaptionMap>({});
  const [captionsEnabled, setCaptionsEnabled] = useState<EnabledMap>({});
  const route = useRoute<RouteProp<VideosStackParamList, 'EpisodeDetailPage'>>();
  const { guestToken, userId } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>({});

  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const { t } = useTranslation();
  const relatedVideoLimit = 10;
  const [slugHistory, setSlugHistory] = useState<string[]>([]);
  const [currentSlug, setCurrentSlug] = useState(route.params?.slug);
  const [isBackgroundPipMode, setIsBackgrundPipMode] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loadingMoreVideos, setLoadingMoreVideos] = useState<boolean>(false);
  const lastApiCallRef = useRef<number>(0);
  const timeWatched = route?.params?.timeWatched;
  const { isFullScreen, setFullScreen, setFullScreenPipMode, setIsMediaPipMode } =
    useVideoPlayerStore();

  useEffect(() => {
    const removeBackHandler = registerFullScreenBackHandler({
      isFullScreen,
      setFullScreen,
      setFullScreenPipMode,
      onTogglePiP,
      setIsMediaPipMode,
      setShowPlayer
    });

    return removeBackHandler;
  }, [isFullScreen]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        setActiveJWIndex(false);
        if (Platform.OS === 'android') {
          setIsBackgrundPipMode(true);
        }
      } else if (nextAppState === 'active') {
        setIsBackgrundPipMode(false);
      }
    });

    return () => subscription.remove();
  }, [setIsVideoPlaying]);

  const handleCaptionUpdate = useCallback((videoIndex: number, captionText: string) => {
    setVideoCaptions((prev) => {
      if (prev[videoIndex] === captionText) return prev;
      return {
        ...prev,
        [videoIndex]: captionText
      };
    });
  }, []);

  const handleCaptionToggle = useCallback((videoIndex: number, enabled: boolean) => {
    setCaptionsEnabled((prev) => {
      if (prev[videoIndex] === enabled) return prev;
      return {
        ...prev,
        [videoIndex]: enabled
      };
    });
  }, []);

  const {
    data,
    loading: videoLoading,
    refetch: refetchVideo
  } = useQuery(VIDEO_QUERY, {
    variables: { slug: currentSlug },
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

  const topicId = data?.Video?.topics?.[0]?.id;
  const categoryId = data?.Video?.category?.id;
  const { data: topicVideosData, loading: topicVideosLoading } = useQuery(VIDEOS_QUERY, {
    variables: {
      limit: 7,
      excludeSlug: currentSlug,
      topic: topicId
    },
    skip: !topicId || relatedVideosFromVideoQuery.length >= 7,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const topicVideos = useMemo(() => topicVideosData?.Videos?.docs ?? [], [topicVideosData]);

  const totalAfterTopic = useMemo(
    () => uniqueById([...relatedVideosFromVideoQuery, ...topicVideos]).length,
    [relatedVideosFromVideoQuery, topicVideos, uniqueById]
  );

  const { data: categoryVideosData, loading: categoryVideosLoading } = useQuery(VIDEOS_QUERY, {
    variables: {
      limit: 7,
      excludeSlug: currentSlug,
      category: categoryId
    },
    skip: !categoryId || totalAfterTopic >= 7,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const categoryVideos = useMemo(
    () => categoryVideosData?.Videos?.docs ?? [],
    [categoryVideosData]
  );

  const moreOptionsVideos = useMemo(() => {
    const combined = uniqueById([
      ...relatedVideosFromVideoQuery,
      ...topicVideos,
      ...categoryVideos
    ]);

    const filtered = combined.filter((v) => v?.slug !== currentSlug);

    return filtered.slice(0, 7);
  }, [relatedVideosFromVideoQuery, topicVideos, categoryVideos, uniqueById, currentSlug]);

  const moreOptionsLoading = topicVideosLoading || categoryVideosLoading;

  const {
    data: relatedVideoData,
    loading: relatedVideoLoading,
    refetch: refetchRelatedVideos,
    fetchMore
  } = useQuery(VIDEOS_QUERY, {
    variables: {
      excludeSlug: currentSlug,
      limit: relatedVideoLimit
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

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

  const loadMoreVideos = async () => {
    if (relatedVideoData?.Videos?.hasNextPage && !loadingMoreVideos) {
      setLoadingMoreVideos(true);
      try {
        await fetchMore({
          variables: {
            page: relatedVideoData.Videos.nextPage,
            relatedVideoLimit
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              Videos: {
                ...prev.Videos,
                docs: [...prev.Videos.docs, ...fetchMoreResult.Videos.docs],
                nextPage: fetchMoreResult.Videos.nextPage,
                hasNextPage: fetchMoreResult.Videos.hasNextPage
              }
            };
          }
        });
      } finally {
        setLoadingMoreVideos(false);
      }
    }
  };

  const publishedAt = formatMexicoDateTime(data?.Video?.publishedAt);

  const persistPlaybackTime = useCallback((value: number) => {
    setTime(value);
  }, []);

  const onTogglePiP = useCallback(
    (pip: boolean) => {
      setIsPipMode(pip);
    },
    [setIsPipMode]
  );

  const goBack = useCallback(() => {
    // Analytics event for Button back
    logSelectContentEvent({
      screen_name: 'Video detail page',
      Tipo_Contenido: 'Video detail page',
      organisms: ANALYTICS_ORGANISMS.EPISODE_DETAIL_PAGE.HEADER,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.BUTTON_BACK,
      content_name: 'Button back',
      content_action: 'tap'
    });

    if (slugHistory.length > 0) {
      const prevSlug = slugHistory[slugHistory.length - 1];
      setSlugHistory((prev) => prev.slice(0, -1));
      setCurrentSlug(prevSlug);
    } else {
      navigation.goBack();
    }
  }, [slugHistory, navigation]);

  const handleCardPress = (slug: string, index: number) => {
    // Analytics event for Episode card
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
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

  const handleBookmarkPress = async (contentId?: string) => {
    // Determine if bookmarking or unbookmarking
    const currentState = bookmarkState[contentId ?? ''] ?? false;
    const isBookmarking = !currentState;

    // Analytics event for Bookmark/Unbookmark
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
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
    if (!contentId) return;
    try {
      await toggleBookmarkMutation({
        variables: {
          input: {
            contentId: contentId,
            type: 'Content'
          }
        }
      });
      setBookmarkState((prev) => ({
        ...prev,
        [contentId]: !currentState
      }));

      setToastType('success');
      setToastMessage(
        !currentState
          ? t('screens.videos.text.articleSavedSuccessfully')
          : t('screens.videos.text.articleRemovedSuccessfully')
      );
    } catch {
      setToastType('error');
      setToastMessage(t('screens.storyPage.author.failedToUpdateBookmark'));
    }
  };

  useEffect(() => {
    if (data?.Video?.id && bookmarkData) {
      setBookmarkState((prev) => ({
        ...prev,
        [data.Video.id]: isBookmarkedByUser
      }));
    }
  }, [bookmarkData, isBookmarkedByUser, data?.Video?.id]);

  const onSharePress = async () => {
    // Analytics event for Share
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.DETAIL_PAGE}`,
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

  const [continueVideo] = useMutation(CONTINUE_VIDEO_MUTATION);

  const handleTimeUpdate = (position: number) => {
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
  };

  const [theme] = useTheme();
  const currentCaption = videoCaptions[0] || '';
  const isCaptionsEnabled = captionsEnabled[0] || false;

  return {
    isVideoPlaying,
    setIsVideoPlaying,
    isPipMode,
    setIsPipMode,
    setActiveJWIndex,
    times,
    setTime,
    showPlayer,
    setShowPlayer,
    route,
    persistPlaybackTime,
    onTogglePiP,
    goBack,
    theme,
    data,
    currentCaption,
    isCaptionsEnabled,
    handleCaptionUpdate,
    handleCaptionToggle,
    captionsEnabled,
    videoCaptions,
    publishedAt,
    relatedVideoData,
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
    bookmarkState,
    toastType,
    toastMessage,
    setToastMessage,
    onSharePress,
    loadMoreVideos,
    isBackgroundPipMode,
    loadingMoreVideos,
    handleTimeUpdate,
    timeWatched,
    moreOptionsVideos,
    moreOptionsLoading
  };
};

export default useVideoDetailPageViewModel;
