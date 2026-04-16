import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { CaptionMap, EnabledMap } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { isIos } from '@src/utils/platformCheck';
import {
  GET_RECENTLY_ADDED_DOCUMENTARIES_QUERY,
  POR_EL_PLANETA_DETAIL_QUERY
} from '@src/graphql/main/videos/queries';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import { registerFullScreenBackHandler } from '@src/hooks/useBackHandlerForFullScreen';
import { CONTINUE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { shareContent } from '@src/utils/shareContent';
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

const usePorElPlanetaDetailPageViewModel = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isVideoPlaying, setIsVideoPlaying, isPipMode, setIsPipMode, setActiveJWIndex } =
    useVideoPlayerStore();
  const { isInternetConnection } = useNetworkStore();

  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [times, setTime] = useState<number>(0);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [videoCaptions, setVideoCaptions] = useState<CaptionMap>({});
  const [captionsEnabled, setCaptionsEnabled] = useState<EnabledMap>({});
  const [isBackgroundPipMode, setIsBackgrundPipMode] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const currentCaption = videoCaptions[0] || '';
  const isCaptionsEnabled = captionsEnabled[0] || false;
  const currentPageTheme: 'light' | 'dark' = 'dark';
  const lastApiCallRef = useRef<number>(0);
  const { userId, guestToken } = useAuthStore();
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);

  const route = useRoute<RouteProp<VideosStackParamList, 'PorElPlanetaDetailPage'>>();
  const { slug, productionId } = route.params || {};
  const timeWatched = route?.params?.timeWatched;

  const onTogglePiP = useCallback(
    (pip: boolean) => {
      setIsPipMode(pip);
    },
    [setIsPipMode]
  );

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

  const {
    data: porElPlanetaDetailData,
    loading: porElPlanetaLoading,
    error: porElPlanetaError,
    refetch: refetchPorElPlaneta
  } = useQuery(POR_EL_PLANETA_DETAIL_QUERY, {
    variables: {
      slug: slug
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: !slug
  });

  const {
    data: recentlyAddedList,
    loading: recentlyAddedLoading,
    refetch: refetchRecentlyAddedList
  } = useQuery(GET_RECENTLY_ADDED_DOCUMENTARIES_QUERY, {
    variables: {
      production: productionId ?? Config.NPLUS_PRODUCTION_PORELPLANATA,
      limit: 4,
      sort: '-publishedAt',
      excludeSlug: slug
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });
  const [continueVideo] = useMutation(CONTINUE_VIDEO_MUTATION);
  const handleTimeUpdate = (position: number) => {
    if (!porElPlanetaDetailData?.Video?.id) return;
    if (position - lastApiCallRef.current >= 60) {
      lastApiCallRef.current = position;
      continueVideo({
        variables: {
          videoId: porElPlanetaDetailData.Video.id,
          timeWatched: Math.floor(position),
          userId: userId,
          totalDuration: porElPlanetaDetailData.Video.videoDuration
        }
      });
    }
  };

  const recentlyAddedListData = useMemo(() => recentlyAddedList?.Videos?.docs, [recentlyAddedList]);

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        setActiveJWIndex(false);
        if (!isIos) {
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

  const persistPlaybackTime = useCallback((value: number) => {
    setTime(value);
  }, []);

  const publishedAt: string = useMemo(
    () =>
      formatMexicoDateTime(porElPlanetaDetailData?.Video?.publishedAt ?? '', 'datetime') as string,
    [porElPlanetaDetailData]
  );

  const onSharePress = async () => {
    if (!porElPlanetaDetailData?.Video?.fullPath) return;
    logSelectContentEvent({
      idPage: porElPlanetaDetailData?.Video?.id,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      opening_display_type: 'video',
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_DETAILS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HERO,
      content_type: 'undefined',
      content_name: 'Share',
      content_action: ANALYTICS_ATOMS.SHARE,
      content_title: porElPlanetaDetailData?.Video?.title,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DETAILS
    });

    await shareContent({ fullPath: porElPlanetaDetailData.Video.fullPath });
  };

  const { data: bookmarkData } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: { contentId: porElPlanetaDetailData?.Video?.id, type: 'Content' },
    skip: !porElPlanetaDetailData?.Video?.id,
    fetchPolicy: 'network-only'
  });

  const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser ?? false;

  useEffect(() => {
    if (bookmarkData) {
      setIsToggleBookmark(isBookmarkedByUser);
    }
  }, [isBookmarkedByUser, bookmarkData]);

  const onCardPress = ({ item, index }: { item: { slug: string }; index: number }) => {
    logSelectContentEvent({
      idPage: porElPlanetaDetailData?.Video?.id,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      opening_display_type: 'video',
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_DETAILS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.RECENTLY_ADDED,
      content_type: `${ANALYTICS_MOLECULES.PRODUCTION.INVESTIGATION_CARD} ${index + 1}`,
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DETAILS
    });

    navigation.push(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: { slug: item.slug }
    });
  };

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([refetchPorElPlaneta(), refetchRecentlyAddedList()]);
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const handleBookmarkPress = async (contentId?: string) => {
    if (!contentId) return;

    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

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
      logSelectContentEvent({
        idPage: porElPlanetaDetailData?.Video?.id,
        production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
        opening_display_type: 'video',
        screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_DETAILS}`,
        organisms: ANALYTICS_ORGANISMS.PRODUCERS.HERO,
        content_type: 'undefined',
        content_action: isToggleBookmark ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
        content_title: porElPlanetaDetailData?.Video?.title,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DETAILS
      });
    } else {
      setToastType('error');
      setToastMessage(
        result.data?.toggleBookmark?.message || t('screens.storyPage.author.failedToUpdateBookmark')
      );
    }
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: porElPlanetaDetailData?.Video?.id,
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      opening_display_type: 'video',
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_DETAILS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HEADER,
      content_type: 'undefined',
      content_action: ANALYTICS_ATOMS.BACK,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DETAILS
    });

    navigation.goBack();
  };

  return {
    goBack,
    publishedAt,
    porElPlanetaLoading,
    porElPlanetaError,
    porElPlanetaDetailData,
    recentlyAddedLoading,
    recentlyAddedListData,
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
    persistPlaybackTime,
    onSharePress,
    onCardPress,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    onTogglePiP,
    currentPageTheme,
    isToggleBookmark,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    handleTimeUpdate,
    timeWatched,
    bookmarkModalVisible,
    setBookmarkModalVisible
  };
};

export default usePorElPlanetaDetailPageViewModel;
