import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, useColorScheme } from 'react-native';

import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import {
  GET_IS_LIVE_BLOG_FOLLOWED,
  GET_LIVE_BLOG_ALL_ENTRIES_QUERY,
  LIVE_BLOG_BY_SLUG_QUERY,
  LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION,
  LIVEBLOG_ENTRY_DELETE_SUBSCRIPTION,
  LIVEBLOG_ENTRY_UPDATED_SUBSCRIPTION,
  LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION,
  RECOMMENDED_STORIES_QUERY
} from '@src/graphql/main/home/queries';
import { screenNames, routeNames } from '@src/navigation/screenNames';
import { HomeStackParamList, RootStackParamList } from '@src/navigation/types';
import { formatMexicoDateTime, formatUpdatedTime } from '@src/utils/dateFormatter';
import { shareContent } from '@src/utils/shareContent';
import useUserStore from '@src/zustand/main/userStore';
import {
  TOGGLE_BOOKMARK_MUTATION,
  TOGGLE_FOLLOW_TOPIC_MUTATION
} from '@src/graphql/main/home/mutations';
import { useHeaderViewModel } from '@src/viewModels/main/Home/StoryPage/Header/useHeaderViewModel';
import { HeroImage, LiveBlogVideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import WebSocketManager from '@src/utils/webSocketManager';
import { LinkedEntry } from '@src/models/main/Home/LiveBlog';
import { NewsItem } from '@src/models/main/Home/StoryPage/StoryPage';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { isIos } from '@src/utils/platformCheck';
import constants from '@src/config/constants';
import { useTheme } from '@src/hooks/useTheme';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent as logSelectContentStoryPageEvent } from '@src/utils/storyAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  getRecommendedStoriesMolecule
} from '@src/utils/analyticsConstants';
import { useGeoblockCheck } from '@src/hooks/useGeoblockCheck';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';

/**
 * Custom hook for managing live blog functionality and state.
 *
 * This hook provides comprehensive state management for a live blog page, including:
 * - Live blog data fetching and real-time updates via WebSocket subscriptions
 * - Video player controls and Picture-in-Picture (PiP) mode management
 * - Caption handling for videos
 * - Bookmark functionality for recommended stories
 * - Navigation and modal management
 * - Toast notifications and error handling
 * - App state monitoring for background/foreground transitions
 *
 * The hook establishes WebSocket connections for real-time live blog updates:
 * - Status changes (live signal activation/deactivation)
 * - Entry updates (modifications to existing entries)
 * - New entry creation
 *
 * @returns An object containing all the state, handlers, and data needed for the live blog UI
 */

export const useLiveBlogViewModel = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [theme, selectedTheme] = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const userData = useUserStore((state) => state.userData);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  // Use a ref to store playback times for each video to avoid re-renders on every update
  const playbackTimes = useRef<Record<string, number>>({});
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [liveBlogEnteries, setLiveBlogEnteries] = useState<LinkedEntry[]>([]);
  const [liveBlogStatus, setLiveBlogStatus] = useState<boolean>(false);
  const [activeLiveBlogStatus, setActiveLiveBlogStatus] = useState<boolean>(false);
  const [activeLiveVideoUrl, setActiveLiveVideoUrl] = useState<string>('');
  const [bluePillVisible, setBluePillVisible] = useState<boolean>(false);
  const [bluePillUpdateCount, setBluePillUpdateCount] = useState<number>(1);
  const [entriesY, setEntriesY] = useState<number>(0);
  const [liveTvY, setLiveTvY] = useState<number>(0);
  const [redPillVisible, setRedPillVisible] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [liveBlogTimeDiff, setLiveBlogTimeDiff] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isAtTopRef = useRef<boolean>(true);
  const isAtEnteryStartingBlockRef = useRef<boolean>(false);
  const [socketEnteryData, setSocketEntryData] = useState<LinkedEntry[]>([]);
  const [isNotificationEnable, setIsNotificationEnable] = useState<boolean>(false);
  const [youtubeLiveVideoUrl, setYoutubeLiveVideoUrl] = useState<string>('');
  const [signalUrl, setSignalUrl] = useState<string>('');
  const { checkAndSetGeoblock } = useGeoblockCheck();
  const [isShowLiveBlogEntryDetailModal, setIsShowLiveBlogEntryDetailModal] =
    useState<boolean>(false);

  const route = useRoute<RouteProp<HomeStackParamList, 'LiveBlog'>>();
  const { slug, isLive } = route.params || {};
  const entryId = route.params?.entryId ?? '';
  const entryLimit = 10;
  const entrySortingKey = '-createdAt';

  const {
    navItems,
    loading: headerLoading,
    onCategoryPress,
    refetchHeader,
    showWebView,
    handleWebViewClose,
    webUrl
  } = useHeaderViewModel();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [entryMoreLoader, setEntryMoreLoader] = useState<boolean>(false);
  const bluePilltranslateY = useSharedValue(-100);
  const redPilltranslateY = useSharedValue(-100);

  const currentTheme =
    selectedTheme == 'system'
      ? colorScheme == 'dark'
        ? constants.DARK
        : constants.LIGHT
      : selectedTheme;

  const channelAssetKeys: Record<string, string> = {
    'foro-tv': Config.NPLUS_FORO_ASSET_KEY ?? '',
    noticieros: Config.NPLUS_ASSET_KEY ?? '',
    'nplus-guadalajara': Config.NPLUS_GUADALAJARA_ASSET_KEY ?? '',
    'nplus-monterrey': Config.NPLUS_MONTERREY_ASSET_KEY ?? '',
    youtube: 'youtube'
  };

  const channelUIDKeys: Record<string, string> = {
    'foro-tv': Config.NPLUS_FORO_UID ?? '',
    noticieros: Config.NPLUS_UID ?? '',
    'nplus-guadalajara': Config.NPLUS_GUADALAJARA_UID ?? '',
    'nplus-monterrey': Config.NPLUS_MONTERREY_UID ?? '',
    youtube: 'youtube'
  };

  useEffect(() => {
    if (entryId) {
      setIsShowLiveBlogEntryDetailModal(true);
    }
  }, [route, entryId]);

  const {
    data: liveBlogData,
    loading: liveBlogLoading,
    error: liveBlogError,
    refetch: refetchLiveBlog
  } = useQuery(LIVE_BLOG_BY_SLUG_QUERY, {
    variables: { slug: slug },
    fetchPolicy: isLive ? 'network-only' : 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const liveBlog = useMemo(() => liveBlogData?.LiveBlog ?? null, [liveBlogData]);
  const liveBlogId = useMemo(() => liveBlog?.id ?? null, [liveBlog]);

  const basicLiveBlogDetails = useMemo(
    () =>
      liveBlog
        ? {
            idPage: liveBlogId,
            content_title: liveBlog.title,
            screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`,
            categories: liveBlog.category?.title,
            screen_page_web_url: slug,
            opening_display_type: liveBlog.openingType,
            content_action: ANALYTICS_ATOMS.TAP
          }
        : null,
    [liveBlog, liveBlogId, slug]
  );

  const {
    data: liveBlogAllEntriesData,
    loading: liveBlogAllEntriesLoading,
    refetch: refetchLiveBlogAllEntries,
    fetchMore: fetchMoreLiveBlogEntries
  } = useQuery(GET_LIVE_BLOG_ALL_ENTRIES_QUERY, {
    variables: {
      liveBlog: liveBlogId,
      limit: entryLimit,
      cursor: null
    },
    fetchPolicy: 'network-only',
    skip: !liveBlogId
  });

  const entryHasNextpage = useMemo(
    () => liveBlogAllEntriesData?.LiveBlogEntries?.hasNextPage ?? false,
    [liveBlogAllEntriesData]
  );

  const nextCursor = useMemo(
    () => liveBlogAllEntriesData?.LiveBlogEntries?.nextCursor ?? null,
    [liveBlogAllEntriesData]
  );

  const liveBlogPublishDate = useMemo(
    () => formatMexicoDateTime(liveBlog?.publishedAt ?? ''),
    [liveBlog]
  );
  const liveBlogUpdatedAt = useMemo(
    () => formatMexicoDateTime(liveBlog?.lastUpdated ?? ''),
    [liveBlog]
  );

  const filteredLiveBlogFeatureImageData = useMemo(() => {
    if (!liveBlog?.featuredImage) return [];
    return liveBlog.featuredImage.map((img: HeroImage) => ({
      id: img?.id,
      url: img?.url,
      caption: img?.caption,
      height: img?.height,
      width: img?.width
    }));
  }, [liveBlog]);

  useEffect(() => {
    setLiveBlogTimeDiff(formatUpdatedTime(liveBlog?.lastUpdated ?? ''));
  }, [liveBlog, refreshing]);

  const headercategories = navItems.map((item) => item?.label);

  const categoriesList = useMemo(
    () =>
      headercategories.includes(liveBlog?.category?.title)
        ? [
            liveBlog?.category?.title,
            ...headercategories.filter((item) => item !== liveBlog?.category?.title)
          ]
        : [liveBlog?.category?.title, ...headercategories],
    [liveBlog, headercategories]
  );

  const fetchSignalUrl = useCallback(
    async (uniqueChannelId: string) => {
      const response = await fetch(`${Config.SIGNAL_BASE_URL}${uniqueChannelId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const { tvssDomain, signal } = data?.data?.tansmissionEvent ?? {};

      // Verify geoblock by IP — same as Broadcast SDK web checkGeoblockLivestream()
      if (tvssDomain) {
        checkAndSetGeoblock(tvssDomain).catch(() => {});
      }

      if (signal) {
        setSignalUrl(`${Config.CUSTOM_LIVE_STREAM_URL}${signal}`);
      }
    },
    [checkAndSetGeoblock]
  );

  useEffect(() => {
    setLiveBlogStatus(liveBlog?.contentPrioritization?.isActive ?? false);
    if (
      liveBlog?.activateLiveSignal &&
      liveBlog?.liveStreamingOrigin &&
      liveBlog?.contentPrioritization?.isActive
    ) {
      setActiveLiveBlogStatus(liveBlog?.activateLiveSignal);
      setActiveLiveVideoUrl(channelAssetKeys[liveBlog?.liveStreamingOrigin ?? '']);
      fetchSignalUrl(channelUIDKeys[liveBlog?.liveStreamingOrigin ?? '']);
      if (liveBlog?.liveStreamingOrigin === 'youtube' && liveBlog?.youtubeCode) {
        setYoutubeLiveVideoUrl(liveBlog?.youtubeCode ?? '');
      }
    }
  }, [liveBlog]);

  useEffect(() => {
    if (liveBlogAllEntriesData) {
      setLiveBlogEnteries(liveBlogAllEntriesData?.LiveBlogEntries?.docs);
      setEntryMoreLoader(false);
    } else {
      setEntryMoreLoader(false);
    }
  }, [liveBlogAllEntriesData]);

  const videos = useMemo(
    () =>
      (liveBlog?.mcpId ?? []).map((item: LiveBlogVideoItem) => ({
        title: item?.value?.title,
        id: item?.value?.id,
        videoUrl: item?.value?.videoUrl,
        closedCaptionUrl: item?.value?.closedCaptionUrl,
        thumbnailImageUrl: item?.value?.content?.heroImage?.url,
        videoType: item?.value?.content?.videoType,
        aspectRatio: item?.value?.aspectRatio
      })),
    [liveBlog]
  );

  const persistPlaybackTime = useCallback(
    (value: number) => {
      // Save current time for the active video
      const currentVideo = videos[activeVideoIndex];
      if (currentVideo?.id) {
        playbackTimes.current[currentVideo.id] = value;
      }
    },
    [videos, activeVideoIndex]
  );

  const getPlaybackTime = useCallback((videoId?: string) => {
    if (!videoId) return 0;
    return playbackTimes.current[videoId] || 0;
  }, []);

  const handleCategoryPress = (category: string) => {
    onCategoryPress(category);
  };

  const {
    data: recommendedStoriesData,
    loading: recommendedStoriesLoading,
    error: recommendedStoriesError,
    refetch: refetchRecommended
  } = useQuery(RECOMMENDED_STORIES_QUERY, {
    variables: { limit: 2, isBookmarked: true },
    fetchPolicy: 'network-only'
  });

  const [toggleBookmark, { error: bookmarkToggleError }] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only',
    refetchQueries: [
      {
        query: RECOMMENDED_STORIES_QUERY,
        variables: { limit: 2, isBookmarked: true }
      }
    ],
    awaitRefetchQueries: true
  });

  const [toggleFollowTopic, { error: followTopicError }] = useMutation(
    TOGGLE_FOLLOW_TOPIC_MUTATION,
    {
      fetchPolicy: 'network-only',
      awaitRefetchQueries: true
    }
  );

  useEffect(() => {
    if (bookmarkToggleError) {
      setToastType('error');
      setToastMessage(bookmarkToggleError.message);
    }
    if (recommendedStoriesError) {
      setToastType('error');
      setToastMessage(recommendedStoriesError.message);
    }
    if (followTopicError) {
      setToastType('error');
      setToastMessage(followTopicError.message);
    }
  }, [bookmarkToggleError, recommendedStoriesError, followTopicError]);

  const onToggleBookmark = useCallback(
    debounce(async (contentId: string, itemIndex?: number) => {
      try {
        const recommendedStories = Array.isArray(
          recommendedStoriesData?.GetRecommendedStories?.data
        )
          ? recommendedStoriesData.GetRecommendedStories.data
          : [];
        const recommendedStory = recommendedStories.find(
          (story: NewsItem) => story.id === contentId
        );

        if (recommendedStory) {
          logSelectContentStoryPageEvent(liveBlog, {
            organism: ANALYTICS_ORGANISMS.LIVE_BLOG.RECOMMENDED_STORIES,
            molecule: getRecommendedStoriesMolecule(itemIndex ?? 0),
            contentName: recommendedStory.title || 'undefined',
            currentSlug: slug,
            contentAction: ANALYTICS_ATOMS.BOOKMARK
          });
        }
        const result = await toggleBookmark({
          variables: { input: { contentId, type: 'Content' } }
        });

        if (result.data?.toggleBookmark?.success) {
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
      } catch (error) {
        const apolloError = error as ApolloError;
        const message =
          apolloError?.graphQLErrors?.[0]?.message ||
          apolloError?.message ||
          t('screens.login.text.somethingWentWrong');
        setToastType('error');
        setToastMessage(message);
      }
    }, 300),
    [userData?._id, toggleBookmark, t]
  );

  const onHistoryRecommendationPress = useCallback(
    (item: NewsItem, itemIndex: number) => {
      if (itemIndex >= 0) {
        logSelectContentStoryPageEvent(liveBlog, {
          organism: ANALYTICS_ORGANISMS.LIVE_BLOG.RECOMMENDED_STORIES,
          molecule: getRecommendedStoriesMolecule(itemIndex),
          contentName: item.title || 'undefined',
          currentSlug: slug
        });
      }

      if (item?.slug) {
        if (item.collection === 'videos') {
          navigation.navigate(routeNames.VIDEOS_STACK, {
            screen: screenNames.VIDEO_DETAIL_PAGE,
            params: { slug: item.slug }
          });
        } else {
          navigation.navigate(routeNames.HOME_STACK, {
            screen: screenNames.STORY_PAGE_RENDERER,
            params: { slug: item.slug }
          });
        }
      }
    },
    [navigation]
  );

  const handleBookmarkPress = useCallback(
    async (item: NewsItem, itemIndex: number) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }
      await onToggleBookmark(item.id, itemIndex);
    },
    [onToggleBookmark, guestToken]
  );

  const { data: followedByUserData, error: followedByUserError } = useQuery(
    GET_IS_LIVE_BLOG_FOLLOWED,
    {
      variables: { id: liveBlogId },
      fetchPolicy: 'network-only',
      skip: !liveBlogId
    }
  );

  useEffect(() => {
    if (followedByUserData) {
      setIsNotificationEnable(followedByUserData?.isFollowedByUser || false);
    }
    if (followedByUserError) {
      setToastType('error');
      setToastMessage(followedByUserError.message);
    }
  }, [followedByUserData, followedByUserError]);

  const showNotificationModal = () => {
    setModalVisible(true);
    logSelectContentEvent({
      ...(basicLiveBlogDetails ?? {}),
      organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.HERO_BODY,
      content_name: 'Show Notification Modal',
      content_action: isNotificationEnable
        ? ANALYTICS_ATOMS.NOTIFICATION_STATE_SELECT
        : ANALYTICS_ATOMS.NOTIFICATION_STATE_UNSELECT
    });
  };

  const onCancelPress = () => {
    setModalVisible(false);
    if (!basicLiveBlogDetails) return;
    if (isNotificationEnable) {
      logSelectContentEvent({
        ...(basicLiveBlogDetails ?? {}),
        organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.MODAL_NOTIFICATION_ON,
        content_type: ANALYTICS_MOLECULES.LIVE_BLOG.BUTTON_KEEP_ME_NOTIFIED,
        content_name: 'Notíficame'
      });
    } else {
      logSelectContentEvent({
        ...(basicLiveBlogDetails ?? {}),
        organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.MODAL_NOTIFICATION_OFF,
        content_type: ANALYTICS_MOLECULES.LIVE_BLOG.BUTTON_REJECT_NOTIFICATION,
        content_name: 'No, gracias'
      });
    }
  };

  const onClosePress = () => {
    setModalVisible(false);
  };

  const onConfirmPress = async () => {
    try {
      const result = await toggleFollowTopic({
        variables: { input: { topicId: liveBlogId, collectionType: 'live-blogs' } }
      });

      if (result.data?.toggleFollowTopic?.success) {
        setToastType('success');
        setToastMessage(
          result.data?.toggleFollowTopic?.message || t('screens.liveBlog.text.notificationUpdated')
        );
        if (result.data?.toggleFollowTopic?.isFollowed) {
          logSelectContentEvent({
            ...(basicLiveBlogDetails ?? {}),
            organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.MODAL_NOTIFICATION_ON,
            content_type: ANALYTICS_MOLECULES.LIVE_BLOG.BUTTON_ACCEPT_NOTIFICATION,
            content_name: 'Notíficame'
          });
        } else {
          logSelectContentEvent({
            ...(basicLiveBlogDetails ?? {}),
            organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.MODAL_NOTIFICATION_OFF,
            content_type: ANALYTICS_MOLECULES.LIVE_BLOG.BUTTON_UNSUBSCRIBE_NOTIFICATION,
            content_name: 'Desactivar'
          });
        }
      } else {
        setToastType('error');
        setToastMessage(
          result.data?.toggleFollowTopic?.message ||
            t('screens.liveBlog.text.notificationUpdateFailed')
        );
      }

      setIsNotificationEnable((prev) => !prev);
      setModalVisible(false);
    } catch (error) {
      const apolloError = error as ApolloError;
      const message =
        apolloError?.graphQLErrors?.[0]?.message ||
        apolloError?.message ||
        t('screens.login.text.somethingWentWrong');
      setToastType('error');
      setToastMessage(message);
      setModalVisible(false);
    }
  };

  const onPressViewAll = useCallback(() => {
    logSelectContentEvent({
      ...(basicLiveBlogDetails ?? {}),
      organisms: ANALYTICS_ORGANISMS.LIVE_BLOG.BUTTON,
      content_type: ANALYTICS_MOLECULES.LIVE_BLOG.BUTTON_SEE_ALL_LIVE_NEWS,
      content_name: 'Ver todas'
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.ACTIVE_LIVE_BLOG_LISTING
    });
  }, [navigation]);

  const refetchAllLiveBlogEnteries = () => {
    refetchLiveBlogAllEntries();
  };

  const bluePillTranslateY = () => {
    bluePilltranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    });
  };

  const redPillTranslateY = () => {
    redPilltranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    });
  };

  useEffect(() => {
    if (!liveBlogId || !liveBlogStatus) return;

    // This channel used for liveblog status changed
    const socketStatusChanged = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketStatusChanged.connect();
    const unsubStatusChanged = socketStatusChanged.subscribe(
      `liveblog-${liveBlogId}-status-changed`,
      LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'status_change') return;
        const channelKey: string = typedData?.data?.liveBlogEvent?.videoUrl ?? '';
        const channelAssetData =
          channelKey && channelAssetKeys[channelKey] ? channelAssetKeys[channelKey] : '';
        const channelUID =
          channelKey && channelUIDKeys[channelKey] ? channelUIDKeys[channelKey] : '';
        setLiveBlogStatus(!!typedData?.data?.liveBlogEvent?.contentPrioritization?.isActive);
        setActiveLiveBlogStatus(!!typedData?.data?.liveBlogEvent?.activateLiveSignal);
        setActiveLiveVideoUrl(channelAssetData);
        if (typedData?.data?.liveBlogEvent?.activateLiveSignal) {
          fetchSignalUrl(channelUID);
        } else {
          setSignalUrl('');
        }
        setLiveBlogTimeDiff(formatUpdatedTime(typedData?.data?.liveBlogEvent?.updatedAt ?? ''));
        if (!!typedData?.data?.liveBlogEvent?.activateLiveSignal && channelAssetData) {
          if (channelAssetData == 'youtube') {
            setYoutubeLiveVideoUrl(typedData?.data?.liveBlogEvent?.youtubeCode ?? '');
          }
          setRedPillVisible(true);
          setTimeout(() => {
            redPillTranslateY();
          }, 100);
        }
      }
    );

    // This channel used for liveblog entry updated
    const socketEntryUpdated = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketEntryUpdated.connect();
    const unsubEntryUpdated = socketEntryUpdated.subscribe(
      `liveblog-${liveBlogId}-entry-modified`,
      LIVEBLOG_ENTRY_UPDATED_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'update') return;
        const updatedEntry = {
          id: typedData?.data?.liveBlogEvent?.id,
          title: typedData?.data?.liveBlogEvent?.title,
          content: typedData?.data?.liveBlogEvent?.content,
          publishedAt: typedData?.data?.liveBlogEvent?.publishedAt,
          updatedAt: typedData?.data?.liveBlogEvent?.updatedAt,
          createdAt: typedData?.data?.liveBlogEvent?.createdAt
        };
        setLiveBlogEnteries((prev) =>
          prev.map((item) => (item.id == updatedEntry?.id ? updatedEntry : item))
        );
      }
    );

    // This channel used for liveblog entry created
    const socketEntryCreated = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketEntryCreated.setOnReconnectCallback(() => {
      refetchAllLiveBlogEnteries();
    });
    socketEntryCreated.connect();
    const unsubEntryCreated = socketEntryCreated.subscribe(
      `liveblog-${liveBlogId}-entry-created`,
      LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'create') return;
        const updatedEntry = {
          id: typedData?.data?.liveBlogEvent?.id,
          title: typedData?.data?.liveBlogEvent?.title,
          content: typedData?.data?.liveBlogEvent?.content,
          publishedAt: typedData?.data?.liveBlogEvent?.publishedAt,
          updatedAt: typedData?.data?.liveBlogEvent?.updatedAt,
          createdAt: typedData?.data?.liveBlogEvent?.createdAt
        };
        setLiveBlogTimeDiff(formatUpdatedTime(updatedEntry?.updatedAt ?? ''));
        if (isAtEnteryStartingBlockRef.current) {
          setLiveBlogEnteries((prev) => [updatedEntry, ...prev]);
        } else {
          setBluePillVisible((prevVisible) => {
            if (prevVisible) {
              setBluePillUpdateCount((prev) => prev + 1);
            }
            return true;
          });
          bluePillTranslateY();
          setSocketEntryData((prev) => [updatedEntry, ...prev]);
        }
      }
    );

    // This channel used for liveblog entry delete
    const socketEntryDelete = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketEntryDelete.connect();
    const unsubEntryDelete = socketEntryDelete.subscribe(
      `liveblog-${liveBlogId}-entry-deleted`,
      LIVEBLOG_ENTRY_DELETE_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'delete') return;
        setLiveBlogEnteries((prev) =>
          prev.filter((entry) => entry.id !== typedData?.data?.liveBlogEvent?.id)
        );
        setLiveBlogTimeDiff(formatUpdatedTime(typedData?.data?.liveBlogEvent?.deletedAt ?? ''));
      }
    );

    return () => {
      unsubStatusChanged();
      unsubEntryUpdated();
      unsubEntryCreated();
      unsubEntryDelete();
      socketStatusChanged.close();
      socketEntryUpdated.close();
      socketEntryCreated.close();
      socketEntryDelete.close();
    };
  }, [liveBlogId, liveBlog, isInternetConnection, liveBlogStatus]);

  const bluePillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bluePilltranslateY.value }]
  }));

  const redPillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: redPilltranslateY.value }]
  }));

  const onBluePillPress = (noScroll?: boolean) => {
    if (!noScroll) {
      scrollViewRef.current?.scrollTo({ y: entriesY, animated: true });
    }
    setLiveBlogEnteries((prev) => {
      const socketEntryIds = new Set(socketEnteryData.map((entry) => entry.id));
      const filteredPrev = prev.filter((entry) => !socketEntryIds.has(entry.id));
      return [...socketEnteryData, ...filteredPrev];
    });
    setSocketEntryData([]);
    setBluePillVisible(false);
    setBluePillUpdateCount(1);
    bluePilltranslateY.value = -100;
  };

  const onRedPillPress = () => {
    scrollViewRef.current?.scrollTo({ y: liveTvY, animated: true });
    setRedPillVisible(false);
    redPilltranslateY.value = -100;
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    if (scrollY < 80) {
      isAtTopRef.current = true;
    } else {
      isAtTopRef.current = false;
    }
    if (scrollY < entriesY + 70 && scrollY > entriesY - 250) {
      isAtEnteryStartingBlockRef.current = true;
      onBluePillPress(true);
    } else {
      isAtEnteryStartingBlockRef.current = false;
    }
  };

  const onEnteryShareButtonPress = async (item: LinkedEntry, index: number) => {
    const liveBlogFullPath = liveBlog?.fullPath;
    if (!liveBlogFullPath || !item?.id) {
      return;
    }

    const etiquetas =
      Array.isArray(liveBlog?.topics) && liveBlog.topics
        ? liveBlog.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
        : [];
    const etiquetasString = etiquetas.join(',');

    const federativeEntity =
      Array.isArray(liveBlog?.provinces) && liveBlog?.provinces
        ? liveBlog?.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
        : [];
    const federativeEntityString = federativeEntity.join(',');

    const productionValue = [liveBlog?.channel?.title, liveBlog?.production?.title]
      .filter(Boolean)
      .join('_');

    const entriesItems = {
      item_id: item?.id,
      item_name: item?.title || 'undefined',
      index: index,
      item_category: liveBlog?.title || 'undefined',
      item_category2: liveBlog?.category?.title || 'undefined',
      item_category3: 'undefined',
      item_category4: item?.updatedAt || 'undefined',
      item_category5: 'undefined',
      item_list_id: liveBlog?.id,
      item_list_name: 'LiveBlog',
      item_variant: `Live blog full section card | ${index}`,
      quantity: 1
    };

    const analyticsEntryPayload = {
      idPage: liveBlog?.id,
      screen_page_web_url: slug || 'undefined',
      screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`,
      opening_display_type: `${liveBlog?.openingType || ''}_${liveBlog?.displayType || ''}`,
      etiquetas: etiquetasString,
      categories: liveBlog?.category?.title || '',
      federative_entity: federativeEntityString,
      production: productionValue,
      item_list_id: liveBlog?.id,
      item_list_name: 'LiveBlog',
      items: entriesItems
    };

    AnalyticsService.logEvent('select_item', analyticsEntryPayload);
    AppEventsLogger.logEvent(
      'select_content',
      analyticsEntryPayload as unknown as Record<string, number>
    );

    const fullPath = `${liveBlogFullPath}?entryId=${item.id}`;
    await shareContent({ fullPath });
  };

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([
        refetchLiveBlog({ slug }),
        refetchRecommended({ limit: 2, isBookmarked: true })
      ]);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setSignalUrl('');
      await refetchLiveBlog({ slug });
      await refetchLiveBlogAllEntries({
        slug: slug,
        limit: entryLimit,
        cursor: null
      });
      await refetchRecommended({ limit: 2, isBookmarked: true });
      await refetchHeader();
    } finally {
      setRefreshing(false);
    }
  }, [
    refetchLiveBlog,
    refetchRecommended,
    refetchLiveBlogAllEntries,
    refetchHeader,
    entryLimit,
    entrySortingKey
  ]);

  const bluePillTopSpace = useMemo(
    () => (isIos ? (isAtTopRef.current ? 110 : 70) : isAtTopRef.current ? 70 : 40),
    [isAtTopRef.current, isIos]
  );

  const onSeeMorePress = () => {
    if (!entryHasNextpage || !nextCursor) {
      return;
    }

    setEntryMoreLoader(true);

    fetchMoreLiveBlogEntries({
      variables: {
        slug: slug,
        limit: entryLimit,
        cursor: nextCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.LiveBlogEntries) {
          return previousResult;
        }

        const previousDocs = liveBlogEnteries ?? [];
        const nextDocs = fetchMoreResult?.LiveBlogEntries?.docs ?? [];

        return {
          ...previousResult,
          LiveBlogEntries: {
            ...fetchMoreResult.LiveBlogEntries,
            docs: [...previousDocs, ...nextDocs]
          }
        };
      }
    });
  };

  useEffect(() => {
    if (!liveBlog?.id && !liveBlog?.fullPath) return;

    const relatedContentIds = Array.isArray(liveBlog?.relatedPosts)
      ? liveBlog.relatedPosts.map((rp: { value?: { id?: string } }) => rp.value?.id).filter(Boolean)
      : [];
    const relatedContentString = relatedContentIds.join(',');

    const federativeEntity =
      Array.isArray(liveBlog?.provinces) && liveBlog?.provinces
        ? liveBlog?.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
        : [];
    const federativeEntityString = federativeEntity.join(',');

    const etiquetas =
      Array.isArray(liveBlog?.topics) && liveBlog.topics
        ? liveBlog.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
        : [];
    const etiquetasString = etiquetas.join(',');

    const authorNames =
      Array.isArray(liveBlog?.authors) && liveBlog.authors
        ? liveBlog.authors.map((a: { name?: string }) => a?.name).filter(Boolean)
        : [];
    const authorNamesString = authorNames.join(',');

    const autorEditorial =
      Array.isArray(liveBlog?.populatedAuthors) && liveBlog.populatedAuthors
        ? liveBlog.populatedAuthors.map((a: { name?: string }) => a?.name).filter(Boolean)
        : [];
    const autorEditorialString = autorEditorial.join(',');

    const productionValue = [liveBlog?.channel?.title, liveBlog?.production?.title]
      .filter(Boolean)
      .join('_');

    const analyticsPayload = {
      idPage: liveBlog?.id,
      screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
      screen_class: 'LiveBlog',
      screen_page_web_url: slug || 'undefined',
      screen_page_web_url_previous: 'undefined',
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`,
      etiquetas: etiquetasString,
      author: authorNamesString,
      Autor_Editorial: autorEditorialString,
      news_wires: liveBlog?.wire || 'undefined',
      Embeds: 'undefined',
      Fecha_Publicacion_Texto: liveBlog?.publishedAt || 'undefined',
      opening_display_type: `${liveBlog?.openingType || ''}_${liveBlog?.displayType || ''}`,
      categories: liveBlog?.category?.title || '',
      federative_entity: federativeEntityString ?? 'undefined',
      related_content: relatedContentString ?? 'undefined',
      production: productionValue ?? 'undefined',
      content_title: liveBlog?.title || 'undefined'
    };
    logContentViewEvent(analyticsPayload);
  }, [
    liveBlog?.id,
    liveBlog?.fullPath,
    liveBlog?.title,
    liveBlog?.publishedAt,
    liveBlog?.openingType,
    liveBlog?.displayType,
    liveBlog?.wire,
    liveBlog?.authors,
    liveBlog?.populatedAuthors,
    liveBlog?.category,
    liveBlog?.provinces,
    liveBlog?.topics,
    liveBlog?.relatedPosts,
    liveBlog?.channel,
    liveBlog?.production,
    liveBlog?.content,
    slug
  ]);

  useEffect(() => {
    if (!liveBlogEnteries || !liveBlogEnteries.length) return;
    try {
      const etiquetas =
        Array.isArray(liveBlog?.topics) && liveBlog.topics
          ? liveBlog.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
          : [];
      const etiquetasString = etiquetas.join(',');

      const federativeEntity =
        Array.isArray(liveBlog?.provinces) && liveBlog?.provinces
          ? liveBlog?.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
          : [];
      const federativeEntityString = federativeEntity.join(',');

      const productionValue = [liveBlog?.channel?.title, liveBlog?.production?.title]
        .filter(Boolean)
        .join('_');

      const entriesItems = liveBlogEnteries.slice(-10).map((entry, index) => ({
        item_id: entry?.id,
        item_name: entry?.title || 'undefined',
        index: index,
        item_category: liveBlog?.title || 'undefined',
        item_category2: liveBlog?.category?.title || 'undefined',
        item_category3: 'undefined',
        item_category4: entry?.updatedAt || 'undefined',
        item_category5: 'undefined',
        item_list_id: liveBlog?.id,
        item_list_name: 'LiveBlog',
        item_variant: 'seccion liveblog',
        quantity: 1
      }));

      const analyticsEntryPayload = {
        idPage: liveBlog?.id,
        screen_page_web_url: slug || 'undefined',
        screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOG_NOTA}`,
        opening_display_type: `${liveBlog?.openingType || ''}_${liveBlog?.displayType || ''}`,
        etiquetas: etiquetasString ?? 'undefined',
        categories: liveBlog?.category?.title || 'undefined',
        federative_entity: federativeEntityString ?? 'undefined',
        production: productionValue ?? 'undefined',
        item_list_id: liveBlog?.id,
        item_list_name: 'LiveBlog',
        items: entriesItems
      };

      AnalyticsService.logEvent('view_item_list', analyticsEntryPayload);
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, [liveBlogEnteries]);

  const hasEntries = (liveBlogEnteries ?? []).length > 0;
  const isFirstLoad = liveBlogAllEntriesLoading && !hasEntries;
  const isLiveBlogReady = !isFirstLoad;

  return {
    theme,
    slug,
    liveBlog,
    liveBlogUpdatedAt,
    liveBlogEnteries,
    liveBlogLoading,
    liveBlogError,
    headerVisible,
    setHeaderVisible,
    headerLoading,
    handleCategoryPress,
    videos,
    persistPlaybackTime,
    activeVideoIndex,
    setActiveVideoIndex,
    recommendedStoriesData,
    recommendedStoriesLoading,
    onToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    onHistoryRecommendationPress,
    modalVisible,
    onClosePress,
    onCancelPress,
    onConfirmPress,
    onPressViewAll,
    liveBlogStatus,
    liveBlogPublishDate,
    activeLiveBlogStatus,
    activeLiveVideoUrl,
    scrollViewRef,
    setEntriesY,
    bluePillVisible,
    bluePillUpdateCount,
    onBluePillPress,
    setLiveTvY,
    redPillVisible,
    onRedPillPress,
    handleScroll,
    handleRetry,
    internetLoader,
    internetFail,
    isInternetConnection,
    categoriesList,
    liveBlogTimeDiff,
    filteredLiveBlogFeatureImageData,
    onEnteryShareButtonPress,
    bluePillAnimatedStyle,
    redPillAnimatedStyle,
    refreshing,
    onRefresh,
    bluePillTopSpace,
    onSeeMorePress,
    entryMoreLoader,
    entryHasNextpage,
    liveBlogAllEntriesLoading,
    isNotificationEnable,
    youtubeLiveVideoUrl,
    isLiveBlogReady,
    signalUrl,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleBookmarkPress,
    currentTheme,
    entryId,
    isShowLiveBlogEntryDetailModal,
    setIsShowLiveBlogEntryDetailModal,
    showWebView,
    handleWebViewClose,
    webUrl,
    getPlaybackTime,
    showNotificationModal
  } as const;
};
