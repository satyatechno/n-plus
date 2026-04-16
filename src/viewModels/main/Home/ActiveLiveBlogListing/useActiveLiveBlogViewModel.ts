import { useCallback, useMemo, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import {
  INACTIVE_LIVE_BLOGS_QUERY,
  LIVE_BLOGS_LISTING_QUERY
} from '@src/graphql/main/home/queries';
import { HomeStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import useNetworkStore from '@src/zustand/networkStore';
import { BlogMedia } from '@src/views/organisms/LiveBlogCard/interface';
import { LiveBlogVideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_ID_PAGE,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

type LiveBlogItem = {
  featuredImage: BlogMedia[];
  mcpId: LiveBlogVideoItem[];
  openingType: string;
};

export const useActiveLiveBlogViewModel = () => {
  const { t } = useTranslation();
  const { isInternetConnection } = useNetworkStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);

  const {
    data: activeBlogData,
    loading: activeBlogLoading,
    error: activeBlogError,
    refetch: refetchActiveBlog
  } = useQuery(LIVE_BLOGS_LISTING_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      isActive: true,
      sort: '-lastUpdated',
      limit: 15
    }
  });

  const activeBlog = useMemo(() => activeBlogData?.LiveBlogs?.docs, [activeBlogData]);

  useEffect(() => {
    if (activeBlogError && !internetLoader) {
      setToastMessage(
        (activeBlogError?.graphQLErrors?.[0]?.extensions?.message as string) ||
          t('screens.liveBlog.text.errorMessage')
      );
    } else {
      setToastMessage('');
    }
  }, [activeBlogError, t]);

  const {
    data: inactiveBlogData,
    loading: inactiveBlogLoading,
    error: inactiveBlogError,
    refetch: refetchInactiveBlog
  } = useQuery(INACTIVE_LIVE_BLOGS_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: { isActive: false, sort: '-lastUpdated' }
  });

  const inactiveBlog = useMemo(() => inactiveBlogData?.LiveBlogs?.docs, [inactiveBlogData]);

  useEffect(() => {
    if (inactiveBlogError && !internetLoader) {
      setToastMessage(
        (inactiveBlogError?.graphQLErrors?.[0]?.extensions?.message as string) ||
          t('screens.liveBlog.text.errorMessage')
      );
    } else {
      setToastMessage('');
    }
  }, [inactiveBlogError, t]);

  const onPressLiveBlogDetails = useCallback(
    (item: { title: string; slug: string }, isLive: boolean, index: number) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.LIVEBLOGS,
        screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVEBLOG,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${isLive ? ANALYTICS_PAGE.LIVEBLOGS : ANALYTICS_PAGE.LIVE_LIVEBLOGS}`,
        organisms: isLive
          ? ANALYTICS_ORGANISMS.LIVE_BLOG.HERO
          : ANALYTICS_ORGANISMS.LIVE_BLOG.CLOSED_LIVEBLOGS,
        content_type: `Liveblog_card ${index}`,
        content_action: ANALYTICS_ATOMS.TAP,
        content_name: 'Liveblog Card',
        content_title: item?.title || 'undefined'
      });
      navigation.navigate(screenNames.LIVE_BLOG, { slug: item?.slug, isLive });
    },
    [navigation]
  );

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVEBLOGS,
      screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVEBLOG,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOGS}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.HEADER,
      content_type: ANALYTICS_MOLECULES.LIVE.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK,
      content_name: 'Button Back'
    });
    navigation.goBack();
  };

  const onPressViewAll = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.LIVEBLOGS,
      screen_name: ANALYTICS_COLLECTION.LIVEBLOGS,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVEBLOG,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.LIVEBLOGS}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.CLOSED_LIVEBLOGS,
      content_type: ANALYTICS_MOLECULES.LIVE.MORE_LIVEBLOGS_OFF,
      content_action: 'See More',
      content_name: 'See More'
    });
    navigation.navigate(screenNames.INACTIVE_LIVE_BLOG_LISTING);
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetchActiveBlog(), refetchInactiveBlog()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchActiveBlog, refetchInactiveBlog]);

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([refetchActiveBlog(), refetchInactiveBlog()]);
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const getMediaUrl = (item: LiveBlogItem | null | undefined): string => {
    if (item?.openingType === 'none') return '';

    return item?.featuredImage?.[0]?.url ?? item?.mcpId?.[0]?.value?.content?.heroImage?.url ?? '';
  };

  return {
    activeBlog,
    inactiveBlog,
    goBack,
    onPressViewAll,
    onPressLiveBlogDetails,
    refreshing,
    onRefresh,
    toastMessage,
    setToastMessage,
    activeBlogLoading,
    inactiveBlogLoading,
    activeBlogError,
    inactiveBlogError,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    getMediaUrl
  } as const;
};
