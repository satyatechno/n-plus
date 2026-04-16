import { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@src/hooks/useTheme';
import { HomeStackParamList } from '@src/navigation/types';
import {
  NPlusForoIcon,
  NPlusIcon,
  NPlusGuadalajaraIcon,
  NPlusMonterreyIcon
} from '@src/assets/icons';
import { ChannelItem, ProgramacionItem } from '@src/models/main/Home/LiveTV';
import {
  INACTIVE_LIVE_BLOGS_QUERY,
  LIVE_BLOGS_LISTING_QUERY,
  LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION,
  LIVEBLOG_ENTRY_DELETE_SUBSCRIPTION,
  LIVEBLOG_ENTRY_UPDATED_SUBSCRIPTION,
  LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION
} from '@src/graphql/main/home/queries';
import { screenNames } from '@src/navigation/screenNames';
import { getUpcomingOrLiveShows, mexicoCurrentTime } from '@src/utils/dateFormatter';
import { useInterval } from '@src/hooks/useInterval';
import { BlogEntries } from '@src/views/organisms/LiveBlogCard/interface';
import WebSocketManager from '@src/utils/webSocketManager';
import { LinkedEntry } from '@src/models/main/Home/LiveBlog';
import constants from '@src/config/constants';
import { shareContent } from '@src/utils/shareContent';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { useLocationStore } from '@src/zustand/locationStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { createVideoLiveTracker } from '@src/services/analytics/videoLiveAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_ID_PAGE,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import { useGeoblockCheck } from '@src/hooks/useGeoblockCheck';

/**
 * A custom hook that provides functionality for the Live TV feature.
 *
 * This hook manages the state and behavior of the Live TV player, including:
 * - Channel selection and management
 * - Picture-in-Picture (PiP) mode handling
 * - Playback time tracking
 * - Caption management
 * - App state monitoring for background/foreground transitions
 * - Sharing functionality
 *
 * @returns An object containing state variables and functions for the Live TV feature
 */
const useLiveTVViewModel = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { shouldShowBannerAds } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('live-tv');
  const colorScheme = useColorScheme();
  const [theme, selectedTheme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'LiveTv'>>();
  const { channelIndex } = route.params || {};
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem>();
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [isCaptionEnabled, setIsCaptionEnabled] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<Record<string, ProgramacionItem[]>>({});
  const [lastUpdateTime, setLastUpdateTime] = useState<moment.Moment>(mexicoCurrentTime.clone());
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [liveBlogEnteries, setLiveBlogEnteries] = useState<BlogEntries[]>([]);
  const [showLiveStreaming, setShowLiveStreaming] = useState<boolean>(true);
  const [signalUrlData, setSignalUrlData] = useState<Record<string, string>>({
    '4': '',
    '2': '',
    tvsagdl: '',
    tvsamty: ''
  });

  const currentTheme =
    selectedTheme == 'system'
      ? colorScheme == 'dark'
        ? constants.DARK
        : constants.LIGHT
      : selectedTheme;

  const { isLocationBlocked } = useLocationStore();
  const { checkAndSetGeoblock } = useGeoblockCheck();

  /**
   * Mock channel list data
   * @todo Will be replaced with API integration to fetch channel detials
   */

  const channelList: ChannelItem[] = useMemo(
    () => [
      {
        channelName: 'N+ FORO',
        channelKey: '4',
        channelId: '16462',
        channelLogo: NPlusForoIcon,
        assetKey: Config?.NPLUS_FORO_ASSET_KEY ?? '',
        uniqueChannelId: Config?.NPLUS_FORO_UID ?? '',
        params: 'forotv',
        blocked: isLocationBlocked,
        atom: 'channel with logo | N+ Foro'
      },
      {
        channelName: 'N+',
        channelKey: '2',
        channelId: '16461',
        channelLogo: NPlusIcon,
        assetKey: Config?.NPLUS_ASSET_KEY ?? '',
        uniqueChannelId: Config?.NPLUS_UID ?? '',
        params: 'noticieros',
        atom: 'channel with logo | N+'
      },
      {
        channelName: 'N+ Guadalajara',
        channelKey: 'tvsagdl',
        channelId: '19',
        channelLogo: NPlusGuadalajaraIcon,
        assetKey: Config?.NPLUS_GUADALAJARA_ASSET_KEY ?? '',
        uniqueChannelId: Config?.NPLUS_GUADALAJARA_UID ?? '',
        params: 'guadalajara',
        atom: 'channel with logo | N+ GDL'
      },
      {
        channelName: 'N+ Monterrey',
        channelKey: 'tvsamty',
        channelId: '14',
        channelLogo: NPlusMonterreyIcon,
        assetKey: Config?.NPLUS_MONTERREY_ASSET_KEY ?? '',
        uniqueChannelId: Config?.NPLUS_MONTERREY_UID ?? '',
        params: 'monterrey',
        atom: 'channel with logo | N+ MTY'
      }
    ],
    [isLocationBlocked]
  );

  /**
   * Fetches the channel schedule data from the API
   * @param channelKey - The key of the channel to fetch schedule for
   */
  const fetchChannelSchedule = useCallback(async (channelKey: string) => {
    setScheduleLoading(true);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `${year}${month}${day}`;

      const response = await fetch(Config.SCHEDULE_API_URL ?? '', {
        method: 'POST',
        headers: {
          Authorization: Config.SCHEDULE_API_AUTH ?? '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          canal: channelKey,
          fecha: dateString,
          rama: 'noticieros'
        })
      });

      if (!response.ok) {
        setScheduleLoading(false);
        return;
      }

      const data = await response.json();
      setScheduleData((prev) => ({
        ...prev,
        [channelKey]: data?.PROGRAMACION?.CANAL?.SHOWS ?? []
      }));
      setScheduleLoading(false);
    } catch {
      setScheduleLoading(false);
    }
  }, []);

  const fetchSignalUrl = useCallback(
    async (channelKey: string, uniqueChannelId: string) => {
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
        setSignalUrlData((prev) => ({
          ...prev,
          [channelKey]: `${Config.CUSTOM_LIVE_STREAM_URL}${signal}`
        }));
      }
    },
    [checkAndSetGeoblock]
  );

  useEffect(() => {
    if (isFocused) {
      setShowLiveStreaming(true);
    } else {
      setShowLiveStreaming(false);
    }
  }, [isFocused, navigation]);

  /**
   * Effect to set the default selected channel on component mount
   */
  useEffect(() => {
    const initialIndex = channelIndex !== undefined ? Number(channelIndex) : 0;
    const initialChannel = channelList[initialIndex] ?? channelList[0];
    setSelectedChannel(initialChannel);
    fetchChannelSchedule(initialChannel?.channelKey ?? '');
    fetchSignalUrl(initialChannel?.channelKey ?? '', initialChannel?.uniqueChannelId ?? '');
  }, [channelIndex]);

  const {
    data: activeBlogData,
    loading: activeBlogLoading,
    refetch: refetchActiveBlogs
  } = useQuery(LIVE_BLOGS_LISTING_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      isActive: true,
      sort: '-lastUpdated',
      limit: 3
    }
  });

  const hasMoreActiveBlog = useMemo(() => activeBlogData?.LiveBlogs?.hasNextPage, [activeBlogData]);
  const activeBlog = useMemo(() => activeBlogData?.LiveBlogs?.docs, [activeBlogData]);
  const liveBlogId = activeBlog?.[0]?.id ?? null;

  const { data: inactiveBlogData, loading: inactiveBlogLoading } = useQuery(
    INACTIVE_LIVE_BLOGS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      variables: { isActive: false, sort: '-lastUpdated' }
    }
  );

  const hasMoreInactiveBlog = useMemo(
    () => inactiveBlogData?.LiveBlogs?.hasNextPage,
    [inactiveBlogData]
  );
  const inactiveBlog = useMemo(() => inactiveBlogData?.LiveBlogs?.docs, [inactiveBlogData]);

  useEffect(() => {
    if (activeBlog?.[0]?.linkedEntries?.docs) {
      setLiveBlogEnteries(activeBlog?.[0]?.linkedEntries?.docs ?? []);
    }
  }, [activeBlog]);

  useEffect(() => {
    if (!liveBlogId) return;

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
        if (!typedData?.data?.liveBlogEvent?.liveblogStatus) {
          refetchActiveBlogs({
            isActive: true,
            sort: '-lastUpdated',
            limit: 3
          });
        }
      }
    );

    // This channel used for liveblog entry created
    const socketEntryCreated = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketEntryCreated.connect();
    const unsubEntryCreated = socketEntryCreated.subscribe(
      `liveblog-${liveBlogId}-entry-created`,
      LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'create') return;
        if (!typedData?.data?.liveBlogEvent) return;
        const updatedEntry = {
          id: typedData?.data?.liveBlogEvent?.id,
          title: typedData?.data?.liveBlogEvent?.title,
          content: typedData?.data?.liveBlogEvent?.content,
          updatedAt: typedData?.data?.liveBlogEvent?.updatedAt,
          createdAt: typedData?.data?.liveBlogEvent?.createdAt
        };
        setLiveBlogEnteries((prev) => {
          const updated = [updatedEntry, ...prev];
          return updated.slice(0, 4);
        });
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
        if (!typedData?.data?.liveBlogEvent) return;
        const updatedEntry: BlogEntries = {
          id: typedData?.data?.liveBlogEvent?.id,
          title: typedData?.data?.liveBlogEvent?.title,
          content: typedData?.data?.liveBlogEvent?.content,
          updatedAt: typedData?.data?.liveBlogEvent?.updatedAt ?? '',
          createdAt: typedData?.data?.liveBlogEvent?.createdAt ?? ''
        };
        setLiveBlogEnteries((prev) =>
          prev.map((item) => (item.id == updatedEntry?.id ? updatedEntry : item))
        );
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
        if (!typedData?.data?.liveBlogEvent) return;
        refetchActiveBlogs({
          isActive: true,
          sort: '-lastUpdated',
          limit: 3
        });
        setLiveBlogEnteries((prev) =>
          prev.filter((entry) => entry.id !== typedData?.data?.liveBlogEvent?.id)
        );
      }
    );

    return () => {
      unsubStatusChanged();
      unsubEntryCreated();
      unsubEntryUpdated();
      unsubEntryDelete();
      socketStatusChanged.close();
      socketEntryCreated.close();
      socketEntryUpdated.close();
      socketEntryDelete.close();
    };
  }, [liveBlogId]);

  /**
   * Handles sharing the current program information
   * Uses the native Share API to share the program title
   */
  const onSharePress = async () => {
    if (!channelMetaData.programTitle) return;
    await shareContent({ fullPath: '/en-vivo/?canal=' + selectedChannel?.params });
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_name: ANALYTICS_COLLECTION.LIVE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.CHANNEL_SCHEDULE,
      content_type: ANALYTICS_MOLECULES.LIVE.SHARE,
      content_action: ANALYTICS_ATOMS.SHARE,
      content_name: ANALYTICS_ATOMS.SHARE
    });
  };

  const onPressLiveBlogDetails = useCallback(
    (item: { title: string; slug: string }, isLive: boolean, index: number) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_name: ANALYTICS_COLLECTION.LIVE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
        organisms: isLive
          ? ANALYTICS_ORGANISMS.LIVE.LIVEBLOGS
          : ANALYTICS_ORGANISMS.LIVE.CLOSED_LIVEBLOGS,
        content_type: `Liveblog_card ${index}`,
        content_action: ANALYTICS_ATOMS.TAP,
        content_name: 'Liveblog Card',
        content_title: item?.title || 'undefined'
      });
      navigation.navigate(screenNames.LIVE_BLOG, { slug: item?.slug, isLive });
    },
    [navigation]
  );

  const onPressViewAllActiveLiveblogs = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_name: ANALYTICS_COLLECTION.LIVE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.LIVEBLOGS,
      content_type: ANALYTICS_MOLECULES.LIVE.ALL_LIVEBLOGS_ON,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: 'See more'
    });
    navigation.navigate(screenNames.ACTIVE_LIVE_BLOG_LISTING);
  };

  const onPressViewAllInactiveLiveblogs = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_name: ANALYTICS_COLLECTION.LIVE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.CLOSED_LIVEBLOGS,
      content_type: ANALYTICS_MOLECULES.LIVE.MORE_LIVEBLOGS_OFF,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: 'See more'
    });
    navigation.navigate(screenNames.INACTIVE_LIVE_BLOG_LISTING);
  };

  /**
   * Navigates back to the previous screen
   */
  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_name: ANALYTICS_COLLECTION.LIVE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.HEADER,
      content_type: ANALYTICS_MOLECULES.LIVE.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK,
      content_name: 'Button Back'
    });
    navigation.goBack();
  };

  /**
   * Handles channel selection and fetches the schedule for the selected channel
   * @param channel - The channel to select
   */
  const handleChannelSelection = useCallback(
    (channel: ChannelItem) => {
      setSelectedChannel(channel);
      if (!scheduleData?.[channel.channelKey]) {
        fetchChannelSchedule(channel.channelKey);
      }
      // Always fetch signal URL to check geoblock when switching channels
      fetchSignalUrl(channel.channelKey, channel.uniqueChannelId);
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_name: ANALYTICS_COLLECTION.LIVE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVE}_${ANALYTICS_PAGE.LIVE}`,
        organisms: ANALYTICS_ORGANISMS.LIVE.CHANNEL_LIST,
        content_type: ANALYTICS_MOLECULES.LIVE.CHANNEL_PRIMARY_HEADER,
        content_action: channel.atom,
        content_name: 'Channel'
      });
      // af_video_live: video_selec_operador — user selects a channel
      createVideoLiveTracker({
        channel: channel.channelName ?? channel.channelKey,
        videoTitle: channel.channelName
      }).liveVideoSelectChannel();
    },
    [scheduleData, signalUrlData]
  );

  const refreshCurrentSchedule = useCallback(() => {
    if (selectedChannel?.channelKey) {
      setLastUpdateTime(mexicoCurrentTime.clone());
    }
  }, [selectedChannel]);

  useInterval(() => {
    refreshCurrentSchedule();
  }, 30000); // Refresh schedule every 30 seconds

  const filterScheduleList = useMemo(
    () => getUpcomingOrLiveShows(scheduleData?.[selectedChannel?.channelKey ?? ''] ?? []),
    [scheduleData, selectedChannel, lastUpdateTime]
  );

  const channelMetaData = useMemo(
    () => ({
      channelName: selectedChannel?.channelName ?? '',
      programTitle: filterScheduleList?.[0]?.title ?? '',
      programDescription: filterScheduleList?.[0]?.description ?? ''
    }),
    [filterScheduleList, selectedChannel]
  );

  return {
    t,
    theme,
    goBack,
    channelList,
    channelMetaData,
    selectedChannel,
    setSelectedChannel: handleChannelSelection,
    filterScheduleList,
    scheduleLoading,
    showPlayer,
    setShowPlayer,
    currentCaption,
    setCurrentCaption,
    isCaptionEnabled,
    setIsCaptionEnabled,
    onSharePress,
    activeBlog,
    hasMoreActiveBlog,
    activeBlogLoading,
    onPressLiveBlogDetails,
    inactiveBlog,
    hasMoreInactiveBlog,
    inactiveBlogLoading,
    onPressViewAllActiveLiveblogs,
    onPressViewAllInactiveLiveblogs,
    signalUrlData,
    liveBlogEnteries,
    currentTheme,
    showLiveStreaming,
    showBannerAds
  };
};

export default useLiveTVViewModel;
