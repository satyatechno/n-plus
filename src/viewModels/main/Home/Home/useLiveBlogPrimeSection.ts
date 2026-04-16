import { useEffect, useMemo, useState } from 'react';

import Config from 'react-native-config';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@src/navigation/types';
import {
  LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION,
  LIVEBLOG_ENTRY_DELETE_SUBSCRIPTION,
  LIVEBLOG_ENTRY_UPDATED_SUBSCRIPTION,
  LIVEBLOG_PRIME_SECTION_QUERY,
  LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION
} from '@src/graphql/main/home/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import WebSocketManager from '@src/utils/webSocketManager';
import { LinkedEntry } from '@src/models/main/Home/LiveBlog';
import { BlogEntries } from '@src/views/organisms/LiveBlogCard/interface';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

export const useLiveBlogPrimeSectionViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [liveBlogEnteries, setLiveBlogEnteries] = useState<BlogEntries[]>([]);

  const {
    data,
    loading,
    refetch: refetchLiveBlog
  } = useQuery(LIVEBLOG_PRIME_SECTION_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const liveBlogData = useMemo(() => data?.HomepagePrime?.liveBlog, [data]);
  const liveBlogId = useMemo(() => data?.HomepagePrime?.liveBlog?.id, [data]);

  useEffect(() => {
    setLiveBlogEnteries(liveBlogData?.linkedEntries?.docs || []);
  }, [liveBlogData]);

  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepagePrime?.liveBlog;
    setSectionHasData('liveBlogPrime', hasData);

    return () => {
      setSectionHasData('liveBlogPrime', false);
    };
  }, [loading, data, setSectionHasData]);

  useEffect(() => {
    if (!liveBlogId || !Config?.WEBSOCKET_URI) return;

    // This channel used for liveblog status changed
    const socketStatusChanged = new WebSocketManager(Config.WEBSOCKET_URI ?? '');
    socketStatusChanged.connect();
    const unsubStatusChanged = socketStatusChanged.subscribe(
      `liveblog-${liveBlogId}-status-changed`,
      LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION,
      { liveBlogId: liveBlogId },
      async (data: unknown) => {
        const typedData = data as { data: { liveBlogEvent: LinkedEntry } };
        if (typedData?.data?.liveBlogEvent?.operation !== 'status_change') return;
        if (!typedData?.data?.liveBlogEvent?.liveblogStatus) {
          setTimeout(() => {
            refetchLiveBlog();
          }, 2500);
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
        refetchLiveBlog();
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
  }, [liveBlogId, refetchLiveBlog]);

  const onPressLiveBlogDetails = (
    data: {
      id: string;
      slug: string;
      title: string;
      category: { title: string };
      openingType: string;
      displayType: string;
    },
    isActive: boolean
  ) => {
    if (!data?.slug) return;

    logSelectContentEvent({
      idPage: data?.id,
      content_title: data.title,
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      categories: data.category?.title,
      screen_page_web_url: data.slug,
      opening_display_type: `${data?.openingType ?? ''}_${data?.displayType ?? ''}`,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      organisms: ANALYTICS_ORGANISMS.HOME_PRIME_SECTION.LIVE_BLOG,
      content_type: ANALYTICS_MOLECULES.HOME_PRIME_SECTION.MASTER_LIVEBLOG
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.LIVE_BLOG,
      params: { slug: data?.slug, isLive: isActive }
    });
  };

  const onPressViewAll = () => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.ACTIVE_LIVE_BLOG_LISTING
    });
  };

  return {
    liveBlogData,
    liveBlogEnteries,
    onPressLiveBlogDetails,
    onPressViewAll,
    refetchLiveBlog
  };
};
