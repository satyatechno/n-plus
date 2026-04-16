import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  MORE_FROM_AUTHORS_OPINION_QUERY,
  MORE_OPINION_LIST_QUERY,
  POST_OPINION_DETAIL_QUERY,
  VIDEO_OPINION_DETAIL_QUERY
} from '@src/graphql/main/opinion/queries';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { useTheme } from '@src/hooks/useTheme';
import { ContentItem, CarouselData } from '@src/models/main/Opinion/Opinion';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook for managing the state and logic of the Opinion Detail view.
 *
 * This hook handles fetching opinion details (video or post), managing video playback,
 * handling bookmarks, fetching additional content from authors, and managing UI state
 * such as PiP mode, captions, and toast notifications.
 *
 * @returns An object containing:
 * - Data and loading/error states for opinion details (video and story)
 * - Data and loading/error states for more content from authors and more opinions
 * - UI state and handlers for video playback, PiP mode, captions, and bookmarks
 * - Utility functions for retrying fetches, updating playback time, and toggling PiP
 * - Various setters for controlling modal visibility, toast messages, and player state
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries and mutations.
 * - Integrates with custom stores for authentication, theme, and video player state.
 * - Handles deduplication of author content and manages multiple asynchronous fetches.
 *
 * @example
 * const {
 *   storyData,
 *   videoData,
 *   handleBookmarkPress,
 *   onTogglePiP,
 *   ...
 * } = useOpinionDetailViewModel();
 */

const useOpinionDetailViewModel = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const { userId, guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { slug, collection } = route.params as { slug: string; collection?: string };
  const isPost = collection === 'posts';

  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [moreFromAuthorsData, setMoreFromAuthorsData] = useState<ContentItem[]>([]);
  const [moreFromAuthorsLoading, setMoreFromAuthorsLoading] = useState<boolean>(false);
  const [moreFromAuthorsError, setMoreFromAuthorsError] = useState<string>('');
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  // Use a ref to store playback times for each video to avoid re-renders on every update
  const playbackTimes = useRef<Record<string, number>>({});
  const {
    isVideoPlaying,
    setIsVideoPlaying,
    isPipMode,
    setIsMediaPipMode,
    activeJWIndex,
    setActiveJWIndex,
    setIsMediaVideoPlaying,
    setShowMediaPlayer,
    setAudioPlaying
  } = useVideoPlayerStore();

  const {
    data: videoData,
    loading: videoLoading,
    error: videoError,
    refetch: refetchVideo
  } = useQuery(VIDEO_OPINION_DETAIL_QUERY, {
    variables: { slug },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: storyData,
    loading: storyLoading,
    error: storyError,
    refetch: refetchStory
  } = useQuery(POST_OPINION_DETAIL_QUERY, {
    variables: { slug },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const [fetchMoreFromAuthors] = useLazyQuery<{
    MoreFromAuthors: { data: ContentItem[] };
  }>(MORE_FROM_AUTHORS_OPINION_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: moreOpinionListData,
    loading: moreOpinionListLoading,
    refetch: refetchMoreOpinionList
  } = useQuery(MORE_OPINION_LIST_QUERY, {
    variables: {
      categoryId: Config.OPINION_CATEGORY_ID,
      isBookmarked: true,
      count: 2,
      nextCursor: null,
      limit: 2
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const authors = isPost ? storyData?.Post?.authors : videoData?.Video?.authors;
  const moreOpinionList = moreOpinionListData?.MoreFromCategory.data;

  const authorIds: string[] = useMemo(
    () =>
      (authors ?? [])
        .map((a: { id?: string } | undefined) => a?.id)
        .filter((id: string | undefined): id is string => !!id),
    [JSON.stringify((authors ?? []).map((a: { id?: string } | undefined) => a?.id ?? ''))]
  );
  const authorIdsKey = authorIds.join(',');

  const fetchAllAuthors = useCallback(async () => {
    if (!authorIds || authorIds.length === 0) return;
    setMoreFromAuthorsLoading(true);
    setMoreFromAuthorsError('');
    try {
      const results = await Promise.all(
        authorIds.map((id: string) =>
          fetchMoreFromAuthors({
            variables: {
              categoryId: storyData?.Post?.category?.id ?? videoData?.Video?.category?.id,
              contentId: storyData?.Post?.id ?? videoData?.Video?.id,
              authorId: id,
              limit: 6
            }
          })
        )
      );

      const merged: ContentItem[] = results
        .map((res) => res?.data?.MoreFromAuthors?.data ?? [])
        .flat();
      const dedupedMap = new Map<string, ContentItem>();
      merged.forEach((item: ContentItem) => {
        if (item?.id && !dedupedMap.has(item.id)) dedupedMap.set(item.id, item);
      });
      setMoreFromAuthorsData(Array.from(dedupedMap.values()));
    } catch (e: unknown) {
      setMoreFromAuthorsError(e instanceof Error ? e.message : '');
    } finally {
      setMoreFromAuthorsLoading(false);
    }
  }, [authorIdsKey, userId, fetchMoreFromAuthors]);

  useEffect(() => {
    fetchAllAuthors();
  }, [fetchAllAuthors]);

  const handleBookmarkPress = async (contentId?: string) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

    if (!contentId) return;
    try {
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
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  };

  const persistPlaybackTime = useCallback(
    (value: number) => {
      // Save current time for the active video
      const currentVideoId = isPost ? storyData?.Post?.id : videoData?.Video?.id;

      if (currentVideoId) {
        playbackTimes.current[currentVideoId] = value;
      }
    },
    [isPost, storyData?.Post?.id, videoData?.Video?.id]
  );

  const handleNavigationToDetailPage = (slug?: string, collection?: string) => {
    if (!slug || !collection) return;
    navigation.push(routeNames.OPINION_STACK, {
      screen: screenNames.OPINION_DETAIL_PAGE,
      params: { slug, collection }
    });
  };

  const handleAuthorPress = (authorId: string) => {
    const contentId = isPost ? storyData?.Post?.id : videoData?.Video?.id;

    const authors = isPost ? storyData?.Post?.authors : videoData?.Video?.authors;

    const author = authors?.find((a: { id?: string; slug?: string }) => a?.id === authorId);

    const slug = author?.slug;

    if (!authorId || !contentId || !slug) return;

    const authorIndex = authors?.findIndex(
      (a: { id?: string; slug?: string }) => a?.id === authorId
    );

    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.OPINION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`,
      organisms: ANALYTICS_ORGANISMS.OPINION.AUTHOR_CARD,
      content_type: `${ANALYTICS_MOLECULES.OPINION.AUTHOR_NAME} | ${authorIndex + 1}`,
      content_name: ANALYTICS_MOLECULES.OPINION.AUTHOR_NAME,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(contentId),
      screen_page_web_url: slug,
      content_title: author?.name
    });

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.AUTHOR_DETAILS,
      params: {
        id: authorId,
        userId: contentId,
        slug
      }
    });
  };

  const getPlaybackTime = useCallback((videoId?: string) => {
    if (!videoId) return 0;
    return playbackTimes.current[videoId] || 0;
  }, []);

  const handleMasOpinionesCardAnalytics = useCallback(
    (item: CarouselData, cardIndex: number, recentCard?: boolean) => {
      logSelectContentEvent({
        idPage: item?.id,
        screen_name: ANALYTICS_PAGE.STORYPAGE_OPINION,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`,
        organisms: recentCard
          ? ANALYTICS_ORGANISMS.OPINION.MÁS_OPINIONES_DE
          : ANALYTICS_ORGANISMS.OPINION.MÁS_OPINIONES,
        content_type: recentCard
          ? `${ANALYTICS_MOLECULES.OPINION.RECENT_OPINIONS}_${cardIndex + 1}`
          : `${ANALYTICS_MOLECULES.OPINION.OPINION_NEWS_CARD}_${cardIndex + 1}`,
        screen_page_web_url: item?.slug,
        content_action: ANALYTICS_ATOMS.TAP,
        content_title: item?.title,
        opening_display_type: item?.collection
      });
    },
    [moreOpinionList]
  );

  useEffect(() => {
    if (storyData || videoData) {
      logContentViewEvent({
        idPage: storyData?.Post?.id || videoData?.Video?.id,
        screen_name: ANALYTICS_PAGE.STORYPAGE_OPINION,
        author: storyData?.Post?.authors?.[0]?.name || videoData?.Video?.authors?.[0]?.name,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.STORYPAGE_OPINION}`,
        screen_page_web_url: storyData?.Post?.slug || videoData?.Video?.slug,
        Fecha_Publicacion_Texto: storyData?.Post?.publishedAt || videoData?.Video?.publishedAt,
        opening_display_type: storyData?.Post?.openingType || videoData?.Video?.openingType,
        categories: storyData?.Post?.category?.title || videoData?.Video?.category?.title
      });
    }
  }, [storyData, videoData]);

  const toggleJWPlayer = useCallback(() => {
    try {
      if (isInternetConnection) {
        setActiveJWIndex(true);
        setAudioPlaying(true);
      } else {
        setToastType('error');
        setToastMessage(t('screens.splash.text.noInternetConnection'));
      }
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  }, [isInternetConnection, setActiveJWIndex, setAudioPlaying, setToastType, setToastMessage, t]);

  const closeAudioPlayer = useCallback(() => {
    setActiveJWIndex(false);
  }, [setActiveJWIndex]);

  const onRetry = async () => {
    try {
      setRefreshLoader(true);
      await Promise.all([refetchVideo({ slug }), refetchStory({ slug }), refetchMoreOpinionList()]);
      await fetchAllAuthors();
    } finally {
      setRefreshLoader(false);
    }
  };

  return {
    slug,
    storyData,
    storyLoading,
    storyError,
    videoData,
    videoLoading,
    videoError,
    t,
    theme,
    moreFromAuthorsData,
    moreFromAuthorsLoading,
    moreOpinionList,
    moreOpinionListLoading,
    moreFromAuthorsError,
    authors,
    isInternetConnection,
    refreshLoader,
    onRetry,
    handleBookmarkPress,
    toastType,
    toastMessage,
    bookmarkModalVisible,
    setToastMessage,
    setBookmarkModalVisible,
    persistPlaybackTime,
    isPipMode,
    activeVideoIndex,
    setShowPlayer,
    showPlayer,
    isVideoPlaying,
    setIsVideoPlaying,
    activeJWIndex,
    setActiveJWIndex,
    setIsMediaPipMode,
    setIsMediaVideoPlaying,
    setShowMediaPlayer,
    setAudioPlaying,
    setActiveVideoIndex,
    collection,
    handleNavigationToDetailPage,
    handleAuthorPress,
    getPlaybackTime,
    handleMasOpinionesCardAnalytics,
    toggleJWPlayer,
    closeAudioPlayer
  };
};

export default useOpinionDetailViewModel;
