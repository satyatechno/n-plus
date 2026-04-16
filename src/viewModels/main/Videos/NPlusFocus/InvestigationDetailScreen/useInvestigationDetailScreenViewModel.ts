import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, FlatList, Platform } from 'react-native';

import Config from 'react-native-config';
import { useMutation, useQuery } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CONTINUE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import {
  NPLUS_FOCUS_SHORT_LISTING_QUERY,
  VIDEO_QUERY,
  VIDEOS_QUERY
} from '@src/graphql/main/videos/queries';
import { useTheme } from '@src/hooks/useTheme';
import { CaptionMap, EnabledMap } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { registerFullScreenBackHandler } from '@src/hooks/useBackHandlerForFullScreen';
import { shareContent } from '@src/utils/shareContent';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { AppEventsLogger } from 'react-native-fbsdk-next';

const useInvestigationDetailScreenViewModel = () => {
  const [theme] = useTheme();
  const route = useRoute<RouteProp<VideosStackParamList, 'InvestigationDetailScreen'>>();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isVideoPlaying, setIsVideoPlaying, isPipMode, setIsPipMode, setActiveJWIndex } =
    useVideoPlayerStore();
  const [times, setTime] = useState<number>(0);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [videoCaptions, setVideoCaptions] = useState<CaptionMap>({});
  const [captionsEnabled, setCaptionsEnabled] = useState<EnabledMap>({});
  const [isBackgroundPipMode, setIsBackgrundPipMode] = useState<boolean>(false);
  const currentCaption = videoCaptions[0] || '';
  const isCaptionsEnabled = captionsEnabled[0] || false;
  const { guestToken, userId } = useAuthStore.getState();
  const { isInternetConnection } = useNetworkStore.getState();
  const lastApiCallRef = useRef<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const currentPageTheme: 'light' | 'dark' = 'dark';
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isHeroCardBookmarked, setIsHeroCardBookmarked] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [slugHistory, setSlugHistory] = useState<string[]>([]);
  const [currentSlug, setCurrentSlug] = useState(route?.params?.slug);
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchVideo(), refetchRecentlyAdded(), refetchNPlusFocusShortListing()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInteractiveResearchPress = () => {
    // Log interactive investigation button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.INVESTIGATION_DESCRIPTION.HERO,
      content_type: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.INTERACTIVE_INVESTIGATION,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.INTERACTIVE_INVESTIGATION,
      idPage: data?.Video?.id,
      screen_page_web_url: data?.Video?.slug,
      content_title: data?.Video?.title
    });

    const url = data?.Video?.productions?.externalURL;
    if (url) {
      setWebUrl(url);
      setShowWebView(true);
    }
  };

  const persistPlaybackTime = useCallback((value: number | undefined) => {
    if (value !== undefined) {
      setTime(value);
    }
  }, []);

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

  const {
    data: recentlyAddedData,
    loading: recentlyAddedLoading,
    refetch: refetchRecentlyAdded
  } = useQuery(VIDEOS_QUERY, {
    variables: {
      videoType: 'episode',
      production: Config.NPLUS_PRODUCTION_FOCUS,
      excludedSlug: currentSlug,
      limit: 4
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const crewData = data?.Video?.productions?.crews || [];
  const [visibleCount, setVisibleCount] = useState<number>(4);

  const displayData = crewData.slice(0, visibleCount);
  const hasMore = visibleCount < crewData.length;
  const hasLess = visibleCount >= crewData.length && crewData.length > 4;

  const handleViewMore = () => {
    // Log see more button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.INVESTIGATION_DESCRIPTION.SEE_ALL,
      content_type: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setVisibleCount((prev) => prev + 4);
  };

  const handleViewLess = () => {
    // Log see less button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.INVESTIGATION_DESCRIPTION.SEE_ALL,
      content_type: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setVisibleCount(4);
  };

  const publishedAt = formatMexicoDateTime(data?.Videos?.docs?.[0]?.publishedAt);
  const [continueVideo] = useMutation(CONTINUE_VIDEO_MUTATION);

  const handleTimeUpdate = (position: number) => {
    if (!data?.Video?.id) return;
    if (position - lastApiCallRef.current >= 60) {
      lastApiCallRef.current = position;
      continueVideo({
        variables: {
          videoId: data?.Video?.id,
          timeWatched: Math.floor(position),
          userId: userId,
          totalDuration: data?.Video?.videoDuration
        }
      });
    }
  };

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

  const onTogglePiP = useCallback(
    (pip: boolean) => {
      setIsPipMode(pip);
    },
    [setIsPipMode]
  );

  const bookmarkedContent = data?.Video?.id;

  const { data: bookmarkData } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: { contentId: bookmarkedContent, type: 'Content' },
    fetchPolicy: 'cache-and-network'
  });

  const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser ?? false;

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const handleBookmarkPress = async (contentId?: string) => {
    if (!contentId) return;
    setIsModalVisible(false);

    // Determine if this is bookmark or unbookmark action
    const isCurrentlyBookmarked =
      contentId === data?.Video?.id ? isHeroCardBookmarked : isToggleBookmark;

    // Determine if this is hero card or other items
    const isHeroCard = contentId === data?.Video?.id;

    // Check if contentId belongs to videoItems or postItems
    const isVideoItem = videoItems.some((item: { id?: string }) => item?.id === contentId);

    // Log bookmark press event with different data for hero vs other items
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: isHeroCard
        ? ANALYTICS_ORGANISMS.INVESTIGATION_DESCRIPTION.HERO
        : ANALYTICS_ORGANISMS.SHORT_REPORTS,
      content_type: isHeroCard
        ? ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.BOOKMARK
        : isVideoItem
          ? ANALYTICS_MOLECULES.SHORT_REPORTS.SHORT_NOTES
          : ANALYTICS_MOLECULES.SHORT_REPORTS.RELATED_NOTES,
      content_name: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
      content_action: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
      content_title: data?.Video?.title,
      idPage: String(data?.Video?.id),
      screen_page_web_url: data?.Video?.slug
    });

    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

    let bookmarkResponse;

    try {
      const response = await toggleBookmarkMutation({
        variables: {
          input: {
            contentId,
            type: 'Content'
          }
        }
      });

      bookmarkResponse = response.data;

      if (contentId === data?.Video?.id) {
        setIsHeroCardBookmarked((prev) => !prev);
      } else {
        setIsToggleBookmark((prev) => !prev);
      }

      setToastType('success');
      setToastMessage(bookmarkResponse?.toggleBookmark?.message);
    } catch {
      setToastType('error');
      setToastMessage(bookmarkResponse?.toggleBookmark?.message || 'Something went wrong');
    } finally {
      setIsModalVisible(false);
      setBookmarkModalVisible(false);
    }
  };

  useEffect(() => {
    setTime(timeWatched ?? 0);
    if (bookmarkData) {
      setIsHeroCardBookmarked(isBookmarkedByUser);
    }
  }, [isBookmarkedByUser, bookmarkData]);

  const onSharePress = async () => {
    if (!data?.Video?.fullPath) return;

    // Log share press event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.INVESTIGATION_DESCRIPTION.HERO,
      content_type: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.SHARE,
      content_action: ANALYTICS_ATOMS.SHARE,
      content_name: ANALYTICS_MOLECULES.INVESTIGATION_DESCRIPTION.SHARE,
      idPage: data?.Video?.id,
      screen_page_web_url: data?.Video?.slug,
      content_title: data?.Video?.title
    });

    await shareContent({ fullPath: data.Video.fullPath });
  };

  const goBack = () => {
    // Log back button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.INVESTIGATION_DETAIL.HEADER,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });

    if (slugHistory.length > 0) {
      const prevSlug = slugHistory[slugHistory.length - 1];
      setSlugHistory((prev) => prev.slice(0, -1));
      setCurrentSlug(prevSlug);
    } else {
      navigation.goBack();
    }
  };

  const {
    data: nPlusFocusShortListingData,
    loading: nPlusFocusShortListingLoading,
    refetch: refetchNPlusFocusShortListing
  } = useQuery(NPLUS_FOCUS_SHORT_LISTING_QUERY, {
    fetchPolicy: 'network-only'
  });

  const docs = nPlusFocusShortListingData?.NPlusFocusShortReportListing?.docs ?? [];
  const videoItems = docs.filter((item: { type: string }) => item.type === 'video');
  const postItems = docs.filter((item: { type: string }) => item.type === 'post');

  const latestPostItems = [...postItems]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

  const seeAllShortInvestigationReports = () => {
    // Log see all button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.SHORT_REPORTS,
      content_type: ANALYTICS_MOLECULES.SHORT_REPORTS.BUTTON_SEE_ALL,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.SHORT_INVESTIGATIONS
    });
  };

  const goToDetailScreen = (
    slug: string,
    source?: 'shortReports' | 'recentlyAdded',
    index?: number
  ) => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms:
        source === 'recentlyAdded'
          ? ANALYTICS_ORGANISMS.RECENTLY_ADDED
          : ANALYTICS_ORGANISMS.SHORT_REPORTS,
      content_type:
        source === 'recentlyAdded'
          ? `${ANALYTICS_MOLECULES.RECENTLY_ADDED}${index !== undefined ? `| ${index + 1}` : ''}`
          : `${ANALYTICS_MOLECULES.SHORT_REPORTS.SHORT_NOTES}${index !== undefined ? `|${index + 1}` : ''}`,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_title: data?.Video?.title,
      idPage: String(data?.Video?.id),
      screen_page_web_url: data?.Video?.slug
    });

    if (typeof currentSlug === 'string') {
      setSlugHistory((prev) => [...prev, currentSlug]);
    }
    setCurrentSlug(slug);
  };
  const goToShortReportsScreen = (slug: string) => {
    // Log related notes tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_DETAIL}`,
      organisms: ANALYTICS_ORGANISMS.SHORT_REPORTS,
      content_type: ANALYTICS_MOLECULES.SHORT_REPORTS.RELATED_NOTES,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_title: data?.Video?.title,
      idPage: String(data?.Video?.id)
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN,
      params: { slug }
    });
  };

  const etiquetas =
    Array.isArray(data?.Video?.topics) && data?.Video?.topics?.topics
      ? data?.Video?.topics.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
      : Array.isArray(data?.Video?.topics) && data?.Video?.topics
        ? data?.Video?.topics.map((topic: { title?: string }) => topic?.title || '').filter(Boolean)
        : [];

  const etiquetasString = etiquetas.join(',');

  const productionValue = data?.Video?.production?.title || '';

  const federativeEntity =
    Array.isArray(data?.Video?.provinces) && data?.Video?.provinces
      ? data?.Video?.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
      : [];
  const federativeEntityString = federativeEntity.join(',');

  // Analytics useEffect for content_view event
  useEffect(() => {
    if (!data?.Video?.id || !currentSlug) return;

    try {
      const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

      const analyticsPayload = {
        idPage: data.Video.id,
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        screen_class: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        screen_page_web_url: currentSlug || '',
        screen_page_web_url_previous: previousSlug || '',
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
        Fecha_Publicacion_Texto: data?.Video?.publishedAt || 'undefined',
        opening_display_type: `${data?.Video?.openingType || 'undefined'}_${data?.Video?.displayType || 'undefined'}`,
        categories: data?.Video?.category?.title || 'undefined',
        content_title: data?.Video?.title || '',
        etiquetas: etiquetasString || 'undefined',
        production: productionValue || 'undefined',
        federative_entity: federativeEntityString || 'undefined'
      };

      AnalyticsService.logEvent('content_view', analyticsPayload);
      AppEventsLogger.logEvent('page_view', analyticsPayload);
    } catch {
      // Prevent analytics crash
    }
  }, [
    data?.Video?.id,
    data?.Video?.publishedAt,
    data?.Video?.openingType,
    data?.Video?.displayType,
    data?.Video?.category?.title,
    data?.Video?.title,
    currentSlug,
    slugHistory
  ]);

  return {
    theme,
    goBack,
    isVideoPlaying,
    setIsVideoPlaying,
    isPipMode,
    setIsPipMode,
    setActiveJWIndex,
    times,
    setTime,
    showPlayer,
    setShowPlayer,
    videoCaptions,
    setVideoCaptions,
    captionsEnabled,
    setCaptionsEnabled,
    isBackgroundPipMode,
    currentCaption,
    isCaptionsEnabled,
    handleCaptionUpdate,
    handleCaptionToggle,
    data,
    handleTimeUpdate,
    persistPlaybackTime,
    publishedAt,
    onSharePress,
    handleBookmarkPress,
    isModalVisible,
    setIsModalVisible,
    isToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    displayData,
    hasMore,
    handleViewMore,
    handleViewLess,
    hasLess,
    onTogglePiP,
    nPlusFocusShortListingData,
    videoItems,
    postItems,
    latestPostItems,
    flatListRef,
    recentlyAddedData,
    seeAllShortInvestigationReports,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    currentPageTheme,
    nPlusFocusShortListingLoading,
    videoLoading,
    recentlyAddedLoading,
    onRefresh,
    isRefreshing,
    isInternetConnection,
    isHeroCardBookmarked,
    goToDetailScreen,
    goToShortReportsScreen,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    timeWatched
  };
};

export default useInvestigationDetailScreenViewModel;
