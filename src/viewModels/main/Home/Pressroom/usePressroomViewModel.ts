import { useState, useCallback } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ApolloError } from '@apollo/client';
import Config from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { GET_PRESS_ROOM_CONTENT_QUERY } from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { formatMexicoDateOnly } from '@src/utils/dateFormatter';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { PressroomItem } from '@src/models/main/Home/Pressroom';
import { HomeStackParamList } from '@src/navigation/types';
import {
  logSelectContentEvent,
  SelectViewParams
} from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

const WEB_BASE_URL = Config.WEBSITE_BASE_URL;

/**
 * View model hook for the Pressroom section of the Home page.
 *
 * Provides state, data and handlers for pressroom content, including:
 * - Loading and error state from Apollo query
 * - Data refetch and fetchMore for pagination
 * - Bookmark toggling with server-side mutation
 * - WebView visibility and URL handling for pressrooms
 * - Toast notifications and their state
 * - Connectivity and loading indicators
 *
 * @returns {object} The Pressroom view model state and handlers.
 */

export const usePressroomViewModel = () => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRESS_ROOM_CONTENT_QUERY, {
    variables: {
      isBookmarked: true,
      limit: 6
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [showLoadMoreSkeleton, setShowLoadMoreSkeleton] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);

  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    refetchQueries: [
      {
        query: GET_PRESS_ROOM_CONTENT_QUERY,
        variables: {
          isBookmarked: true,
          limit: 6
        },
        fetchPolicy: 'network-only'
      }
    ]
  });

  const pressRoomsData = data?.GetPressRooms;

  const onToggleBookmark = useCallback(
    async (contentId: string, type: string, index: number) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }
      try {
        const result = await toggleBookmarkMutation({
          variables: {
            input: {
              contentId,
              type
            }
          }
        });

        if (result?.data?.toggleBookmark?.success) {
          const isBookmarked = result.data.toggleBookmark.isBookmarked;
          handleCategoryCardAnalyticEvent(
            index,
            isBookmarked ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK
          );
          setToastType('success');
          setToastMessage(
            isBookmarked ? result.data.toggleBookmark.message : result.data.toggleBookmark.message
          );
        } else {
          setToastType('error');
          setToastMessage(
            (result.data.errors?.[0]?.extensions?.message as string) ||
              t('screens.login.text.somethingWentWrong')
          );
        }
      } catch (error: unknown) {
        setToastType('error');
        setToastMessage(
          ((error as ApolloError)?.graphQLErrors?.[0]?.extensions?.message as string) ||
            t('screens.login.text.somethingWentWrong')
        );
      }
    },
    [guestToken, toggleBookmarkMutation, t]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const formatPublishedDate = (publishedAt: string) =>
    publishedAt ? formatMexicoDateOnly(publishedAt) : '';

  const getBookmarkStatus = (item: PressroomItem) => item.isBookmarked;

  const getFirstItem = () => pressRoomsData?.docs?.[0];

  const getRemainingItems = () => pressRoomsData?.docs?.slice(1) || [];

  const onLoadMore = useCallback(async () => {
    if (!pressRoomsData?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    setShowLoadMoreSkeleton(true);
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.PRESSROOM,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRESSROOM}_${ANALYTICS_PAGE.PRESSROOM_HOME}`,
      organisms: 'undefined',
      content_type: ANALYTICS_MOLECULES.PRESS_ROOM.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SALA_DE_PRENSA
    });
    try {
      await fetchMore({
        variables: {
          isBookmarked: true,
          limit: 5,
          cursor: pressRoomsData?.nextCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            GetPressRooms: {
              ...fetchMoreResult.GetPressRooms,
              docs: [
                ...(prev.GetPressRooms?.docs || []),
                ...(fetchMoreResult.GetPressRooms?.docs || [])
              ]
            }
          };
        }
      });
    } catch (error: unknown) {
      setToastType('error');
      setToastMessage(
        ((error as ApolloError)?.graphQLErrors?.[0]?.extensions?.message as string) ||
          t('screens.login.text.somethingWentWrong')
      );
    } finally {
      setIsLoadingMore(false);
      setShowLoadMoreSkeleton(false);
    }
  }, [pressRoomsData?.hasNextPage, pressRoomsData?.nextCursor, isLoadingMore, fetchMore, t]);

  const onGoBack = () => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.PRESSROOM,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRESSROOM}_${ANALYTICS_PAGE.PRESSROOM_HOME}`,
      organisms: ANALYTICS_ORGANISMS.PRESS_ROOM.HEADER,
      content_type: 'undefined',
      content_action: ANALYTICS_ATOMS.BACK,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SALA_DE_PRENSA
    });
    navigation.goBack();
  };

  const buildWebViewUrl = useCallback((slug: string) => `${WEB_BASE_URL}${slug}`, []);

  const openWebView = useCallback(
    (slug: string, index: number) => {
      const url = buildWebViewUrl(slug);
      setWebUrl(url);
      handleCategoryCardAnalyticEvent(index, ANALYTICS_ATOMS.TAP_IN_TEXT);
      setShowWebView(true);
    },
    [buildWebViewUrl]
  );

  const closeWebView = useCallback(() => {
    setShowWebView(false);
    setWebUrl('');
  }, []);

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await refetch();
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const handleCategoryCardAnalyticEvent = (index: number, action: string) => {
    let analyticParams: SelectViewParams = {
      screen_name: ANALYTICS_COLLECTION.PRESSROOM,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRESSROOM}_${ANALYTICS_PAGE.PRESSROOM_HOME}`,
      content_action: action,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SALA_DE_PRENSA
    };

    if (index == 0) {
      //principal event
      analyticParams = {
        ...analyticParams,
        organisms: ANALYTICS_ORGANISMS.PRESS_ROOM.HERO,
        content_type: ANALYTICS_MOLECULES.PRESS_ROOM.PRINCIPAL_NEWS
      };
    } else {
      // secondary events
      analyticParams = {
        ...analyticParams,
        organisms: 'undefined',
        content_type: `${ANALYTICS_MOLECULES.PRESS_ROOM.SECONDARY_NEWS} ${index}`
      };
    }

    logSelectContentEvent(analyticParams);
  };

  return {
    onGoBack,
    pressRoomsData,
    loading,
    error,
    refreshing,
    isLoadingMore,
    toastType,
    toastMessage,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onToggleBookmark,
    onRefresh,
    onLoadMore,
    firstItem: getFirstItem(),
    remainingItems: getRemainingItems(),
    hasData: !!pressRoomsData?.docs?.length,
    hasNextPage: pressRoomsData?.hasNextPage || false,
    formatPublishedDate,
    getBookmarkStatus,
    showWebView,
    webUrl,
    openWebView,
    closeWebView,
    showLoadMoreSkeleton,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry
  };
};
