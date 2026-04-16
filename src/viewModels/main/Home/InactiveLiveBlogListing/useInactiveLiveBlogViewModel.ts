import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LIVE_BLOGS_LISTING_QUERY } from '@src/graphql/main/home/queries';
import { HomeStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import useNetworkStore from '@src/zustand/networkStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_ID_PAGE,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

export const useInactiveLiveBlogViewModel = () => {
  const { t } = useTranslation();
  const { isInternetConnection } = useNetworkStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);

  const {
    data: inactiveBlogData,
    loading: inactiveBlogLoading,
    error: inactiveBlogError,
    refetch: refetchInactiveBlog
  } = useQuery(LIVE_BLOGS_LISTING_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      isActive: false,
      sort: '-lastUpdated',
      limit: 15
    }
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
    (item: { title: string; slug: string }, index: number) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.CLOSED_LIVEBLOGS,
        screen_name: ANALYTICS_COLLECTION.CLOSED_LIVEBLOGS,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.CLOSED_LIVEBLOGS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.CLOSED_LIVEBLOGS}`,
        content_type: `Liveblog_card ${index}`,
        content_action: ANALYTICS_ATOMS.TAP,
        content_name: 'Liveblog Card',
        content_title: item?.title || 'undefined'
      });
      navigation.navigate(screenNames.LIVE_BLOG, { slug: item?.slug, isLive: false });
    },
    [navigation]
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetchInactiveBlog();
    } finally {
      setRefreshing(false);
    }
  }, [refetchInactiveBlog]);

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.CLOSED_LIVEBLOGS,
      screen_name: ANALYTICS_COLLECTION.CLOSED_LIVEBLOGS,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.CLOSED_LIVEBLOGS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.LIVEBLOGS}_${ANALYTICS_PAGE.CLOSED_LIVEBLOGS}`,
      organisms: ANALYTICS_ORGANISMS.LIVE.HEADER,
      content_type: ANALYTICS_MOLECULES.LIVE.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK,
      content_name: 'Button Back'
    });
    navigation.goBack();
  };

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await refetchInactiveBlog();
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  return {
    inactiveBlog,
    goBack,
    onPressLiveBlogDetails,
    refreshing,
    onRefresh,
    toastMessage,
    setToastMessage,
    inactiveBlogLoading,
    inactiveBlogError,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry
  } as const;
};
