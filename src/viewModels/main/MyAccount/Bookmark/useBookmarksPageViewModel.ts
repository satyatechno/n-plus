import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import Config from 'react-native-config';

import { useTranslation } from 'react-i18next';
import { NetworkStatus, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@src/hooks/useTheme';
import { COLLECTION_TYPE } from '@src/config/enum';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { RootStackParamList } from '@src/navigation/types';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { GET_USER_BOOKMARKS_QUERY } from '@src/graphql/main/MyAccount/queries';
import { ToggleBookmarkResponse } from '@src/models/main/Home/StoryPage/StoryPage';
import { BookmarkListItem, GetUserBookmarksResponse } from '@src/models/main/MyAccount/Bookmarks';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * Custom hook for managing the state and logic of the Bookmarks page.
 *
 * Handles fetching, pagination, and mutation of user bookmarks across multiple content types.
 * Provides UI state management for loaders, modals, toast messages, and navigation.
 *
 * @returns An object containing:
 * - `t`: Translation function.
 * - `theme`: Current theme object.
 * - `goBack`: Function to navigate back.
 * - `isInternetConnection`: Boolean indicating internet connectivity.
 * - `onRetry`: Function to retry fetching bookmarks.
 * - `flatListRef`: Ref to the FlatList component.
 * - `refreshLoader`: Boolean indicating refresh loader state.
 * - `bookmarkModalVisible`: Boolean for bookmark modal visibility.
 * - `setBookmarkModalVisible`: Setter for bookmark modal visibility.
 * - `toastMessage`: Current toast message.
 * - `setToastMessage`: Setter for toast message.
 * - `contentChip`: Array of content type chips for filtering.
 * - `contentChipTopics`: Array of content chip topics for filtering.
 * - `onChipPress`: Handler for chip selection.
 * - `searchItems`: Array of bookmark items for display.
 * - `hasNext`: Boolean indicating if more items can be loaded.
 * - `loadingMore`: Boolean indicating loading more state.
 * - `onLoadMore`: Handler for loading more items.
 * - `collection`: Current selected collection type.
 * - `onToggleBookmark`: Handler for toggling bookmark status.
 * - `toastType`: Type of toast message ('success' | 'error').
 * - `onCancelPress`: Handler for cancel action in modal.
 * - `onConfirmPress`: Handler for confirm action in modal.
 * - `handleSearchNavigation`: Handler for navigating to search results.
 * - `getUserBookmarkData`: Array of fetched bookmark data.
 * - `getUserBookmarkLoading`: Boolean indicating loading state for bookmarks.
 *
 * @example
 * const {
 *   searchItems,
 *   onChipPress,
 *   onLoadMore,
 *   onToggleBookmark,
 *   toastMessage,
 *   ...
 * } = useBookmarksPageViewModel();
 */

const useBookmarksPageViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const flatListRef = useRef<FlatList>(null);
  const { guestToken, clearAuth } = useAuthStore();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [collection, setCollection] = useState<COLLECTION_TYPE>(COLLECTION_TYPE.VIDEOS);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [searchItems, setSearchItems] = useState<BookmarkListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const client = useApolloClient();

  const contentChip = [
    { title: 'Videos', collection: COLLECTION_TYPE.VIDEOS },
    { title: 'Noticias', collection: COLLECTION_TYPE.POSTS },
    { title: 'Liveblogs', collection: COLLECTION_TYPE.LIVE_BLOGS },
    { title: 'Interactivos', collection: COLLECTION_TYPE.INTERACTIVOS },
    { title: 'Programas', collection: COLLECTION_TYPE.PROGRAMS },
    // { title: 'Nuestro Equipo', collection: COLLECTION_TYPE.TALENTS },   --> Commenting it out for now; this code may be useful in the future.
    { title: 'Autores', collection: COLLECTION_TYPE.AUTHORS },
    { title: 'Sala de Prensa', collection: COLLECTION_TYPE.PRESS_ROOM }
  ];

  const contentChipTopics = (contentChip ?? []).map(
    (c: { title: string; collection: COLLECTION_TYPE }) => ({
      title: c.title,
      slug: c.collection
    })
  );

  const {
    data: getUserBookmarkData,
    loading: getUserBookmarkLoading,
    refetch: refetchGetUserBookmark,
    fetchMore,
    networkStatus
  } = useQuery<GetUserBookmarksResponse>(GET_USER_BOOKMARKS_QUERY, {
    variables: {
      input: {
        collection: collection,
        limit: 10
      }
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    refetchGetUserBookmark({
      variables: {
        input: {
          collection: collection,
          limit: 10
        }
      }
    });
  }, []);

  useEffect(() => {
    const list: BookmarkListItem[] = getUserBookmarkData?.getUserBookmarks?.data ?? [];
    const pagination = getUserBookmarkData?.getUserBookmarks?.pagination;
    setSearchItems(list);
    setNextCursor(pagination?.nextCursor ?? null);
    setHasNext(Boolean(pagination?.hasNext));
    setLoadingMore(false);
  }, [getUserBookmarkData]);

  const [setToggleBookmark] = useMutation<ToggleBookmarkResponse>(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const onChipPress = (collectionKey: COLLECTION_TYPE): void => {
    const contentName =
      {
        [COLLECTION_TYPE.VIDEOS]: 'Video',
        [COLLECTION_TYPE.POSTS]: 'Noticias',
        [COLLECTION_TYPE.LIVE_BLOGS]: 'Liveblog',
        [COLLECTION_TYPE.TALENTS]: 'Nuestro equipo',
        [COLLECTION_TYPE.INTERACTIVOS]: 'Interactivos',
        [COLLECTION_TYPE.PROGRAMS]: 'Programas',
        [COLLECTION_TYPE.PODCASTS]: 'Podcast',
        [COLLECTION_TYPE.AUTHORS]: 'Autores',
        [COLLECTION_TYPE.PRESS_ROOM]: 'Sala de Prensa'
      }[collectionKey] || collectionKey;

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.GUARDADOS,
      screen_page_web_url: ANALYTICS_PAGE.GUARDADOS,
      screen_name: ANALYTICS_PAGE.GUARDADOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.GUARDADOS}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.CHIP_LIST,
      content_type: `Pill | ${contentName}`,
      content_name: contentName,
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (collectionKey === collection) return;
    setCollection(collectionKey);
    setSearchItems([]);
    setNextCursor(null);
    setHasNext(false);
    refetchGetUserBookmark({
      variables: {
        input: {
          collection: collectionKey,
          limit: 10
        }
      }
    });
  };

  const onLoadMore = async () => {
    if (!hasNext || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          input: {
            collection,
            limit: 10,
            nextCursor
          }
        },
        updateQuery: (
          prev: GetUserBookmarksResponse,
          { fetchMoreResult }: { fetchMoreResult?: GetUserBookmarksResponse }
        ): GetUserBookmarksResponse => {
          if (!fetchMoreResult?.getUserBookmarks) return prev;
          const prevData: BookmarkListItem[] = prev.getUserBookmarks?.data ?? [];
          const nextData: BookmarkListItem[] = fetchMoreResult.getUserBookmarks?.data ?? [];

          const seen = new Set<string>();
          prevData.forEach((it: BookmarkListItem) => {
            const key = (it?.id ?? it?.slug) as string | undefined;
            if (key) seen.add(key);
          });
          const merged: BookmarkListItem[] = [...prevData];
          nextData.forEach((it: BookmarkListItem) => {
            const key = (it?.id ?? it?.slug) as string | undefined;
            if (!key || !seen.has(key)) {
              merged.push(it);
              if (key) seen.add(key);
            }
          });
          return {
            getUserBookmarks: {
              ...fetchMoreResult.getUserBookmarks,
              data: merged
            }
          };
        }
      });
    } catch {
      setLoadingMore(false);
    }
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.GUARDADOS,
      screen_page_web_url: ANALYTICS_PAGE.GUARDADOS,
      screen_name: ANALYTICS_PAGE.GUARDADOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.GUARDADOS}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.BACK
    });
    client.cache.evict({ fieldName: 'getUserBookmarks' });
    client.cache.gc();
    navigation.goBack();
  };

  const onRetry = async () => {
    setRefreshLoader(true);
    try {
      await Promise.all([
        refetchGetUserBookmark({
          variables: {
            input: {
              collection: collection,
              limit: 10
            }
          }
        })
      ]);
    } finally {
      setRefreshLoader(false);
    }
  };

  const onToggleBookmark = async (
    contentId: string,
    type: string,
    title?: string,
    index?: number
  ) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

    try {
      const result = await setToggleBookmark({
        variables: { input: { contentId, type } }
      });

      if (result.data?.toggleBookmark?.success) {
        const contentTypeMap: Record<COLLECTION_TYPE, string> = {
          [COLLECTION_TYPE.VIDEOS]: `${ANALYTICS_MOLECULES.SEARCH.CARD_STYLE}/1`,
          [COLLECTION_TYPE.POSTS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_NEWS,
          [COLLECTION_TYPE.LIVE_BLOGS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_LIVEBLOG,
          [COLLECTION_TYPE.TALENTS]: `${ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_TALENT}/1`,
          [COLLECTION_TYPE.PROGRAMS]: ANALYTICS_MOLECULES.MY_ACCOUNT.VIDEO_CARD,
          [COLLECTION_TYPE.PRESS_ROOM]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_PRESS_ROOM,
          [COLLECTION_TYPE.INTERACTIVOS]: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE,
          [COLLECTION_TYPE.AUTHORS]: `${ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_TALENT}/1`,
          [COLLECTION_TYPE.PODCASTS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_PODCAST
        };
        logSelectContentEvent({
          idPage: ANALYTICS_PAGE.GUARDADOS,
          screen_page_web_url: ANALYTICS_PAGE.GUARDADOS,
          screen_name: ANALYTICS_PAGE.GUARDADOS,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.GUARDADOS}`,
          content_type: `${contentTypeMap[collection]} | ${index}`,
          content_name: title?.substring(0, 100),
          content_title: title?.substring(0, 100),
          content_action: result?.data?.toggleBookmark?.isBookmarked
            ? ANALYTICS_ATOMS.BOOKMARK
            : ANALYTICS_ATOMS.UNBOOKMARK
        });

        setToastType('success');
        setToastMessage(
          result.data.toggleBookmark.message ||
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

  const onCancelPress = () => {
    setBookmarkModalVisible(false);
    clearAuth(true);
  };

  const onConfirmPress = () => {
    setBookmarkModalVisible(false);
    clearAuth();
  };

  const handleSearchNavigation = ({
    routeName,
    screenName,
    slug,
    id,
    interactiveUrl,
    index
  }: {
    routeName?: string;
    screenName?: string;
    slug?: string;
    id?: string;
    interactiveUrl?: string;
    index?: string;
  }) => {
    const contentName =
      {
        [COLLECTION_TYPE.VIDEOS]: `${ANALYTICS_MOLECULES.SEARCH.CARD_STYLE}/1`,
        [COLLECTION_TYPE.POSTS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_NEWS,
        [COLLECTION_TYPE.LIVE_BLOGS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_LIVEBLOG,
        [COLLECTION_TYPE.TALENTS]: `${ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_TALENT}/1`,
        [COLLECTION_TYPE.INTERACTIVOS]: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE,
        [COLLECTION_TYPE.PROGRAMS]: ANALYTICS_MOLECULES.MY_ACCOUNT.VIDEO_CARD,
        [COLLECTION_TYPE.PODCASTS]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_PODCAST,
        [COLLECTION_TYPE.AUTHORS]: `${ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_TALENT}/1`,
        [COLLECTION_TYPE.PRESS_ROOM]: ANALYTICS_MOLECULES.MY_ACCOUNT.BOOKMARK_PRESS_ROOM
      }[collection] || collection;

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.GUARDADOS,
      screen_page_web_url: ANALYTICS_PAGE.GUARDADOS,
      screen_name: ANALYTICS_PAGE.GUARDADOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.GUARDADOS}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.CONTENT_CARD,
      content_type: `${contentName} | ${index}`,
      content_name: contentName,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT
    });

    if (interactiveUrl && (!routeName || !screenName)) {
      if (interactiveUrl) {
        setWebUrl(Config.WEBSITE_BASE_URL + interactiveUrl);
        setShowWebView(true);
      }
    }

    if (routeName && screenName) {
      const params: Record<string, unknown> = {};
      if (slug) params.slug = slug;
      if (id) params.id = id;

      (
        navigation as unknown as {
          navigate: (
            route: string,
            options: { screen: string; params: Record<string, unknown> }
          ) => void;
        }
      ).navigate(routeName, {
        screen: screenName,
        params
      });
    }
  };

  return {
    t,
    theme,
    goBack,
    isInternetConnection,
    onRetry,
    flatListRef,
    refreshLoader,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    toastMessage,
    setToastMessage,
    contentChip,
    contentChipTopics,
    onChipPress,
    searchItems,
    hasNext,
    loadingMore,
    onLoadMore,
    collection,
    onToggleBookmark,
    toastType,
    onCancelPress,
    onConfirmPress,
    handleSearchNavigation,
    getUserBookmarkData: getUserBookmarkData?.getUserBookmarks?.data,
    getUserBookmarkLoading: getUserBookmarkLoading && networkStatus !== NetworkStatus.fetchMore,
    showWebView,
    setShowWebView,
    webUrl
  };
};

export default useBookmarksPageViewModel;
