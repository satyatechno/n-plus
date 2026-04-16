import { useCallback, useEffect, useState, useMemo, useRef } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useLazyQuery, useMutation, ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@src/navigation/types';
import { useTheme } from '@src/hooks/useTheme';
import {
  RECENT_CATEGORY_QUERY,
  MORE_FROM_CATEGORY_QUERY,
  RECENT_TOPIC_QUERY,
  MORE_FROM_TOPIC_QUERY,
  TOPIC_QUERY
} from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import {
  CategoryTopicDetailItem,
  TransformedCategoryItem,
  RecentResponse,
  MoreResponse,
  RecentData,
  MoreData,
  TopicResponse
} from '@src/models/main/Home/Category/CategoryTopicDetail';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { routeNames, screenNames } from '@src/navigation/screenNames';
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
import { Topic } from '@src/views/organisms/TopicChips';

/**
 * Custom hook for managing the category/topic detail view model
 *
 * This hook provides all the necessary state, data, and handlers for the category or topic detail screen.
 * It manages navigation, theme, translations, and fetches category/topic data from the API.
 *
 * @returns {Object} An object containing:
 * @returns {Theme} theme - The current theme object
 * @returns {Function} onGoBack - Callback for navigating back
 * @returns {Array<TransformedCategoryItem>} categoryData - Array of category/topic data objects
 * @returns {Array<TransformedCategoryItem>} transformedCategoryData - Array of transformed category/topic data objects with detailed properties
 * @returns {boolean} loading - Whether the category/topic data is loading
 * @returns {ApolloError | null} error - The error that occurred while fetching the data, or null if no error occurred
 * @returns {boolean} refreshing - Whether the data is being refreshed
 * @returns {Function} handleCardPress - Callback for handling card presses
 * @returns {Function} onToggleBookmark - Callback for toggling bookmarks
 * @returns {Function} onRefresh - Callback for refreshing the data
 * @returns {Array<TransformedCategoryItem>} moreFromCategoryData - Array of additional category/topic data objects
 * @returns {boolean} moreLoading - Whether additional category/topic data is loading
 * @returns {boolean} hasNextPage - Whether there are more pages of data to load
 * @returns {Function} loadMore - Callback for loading more data
 * @returns {string} toastMessage - The message to display in the toast
 * @returns {'success' | 'error'} toastType - The type of the toast message
 * @returns {Function} setToastMessage - Callback for setting the toast message
 * @returns {boolean} bookmarkModalVisible - Whether the bookmark modal is visible
 * @returns {Function} setBookmarkModalVisible - Callback for setting the bookmark modal visibility
 * @returns {Function} onCancelPress - Callback for handling cancel button presses in the bookmark modal
 * @returns {Function} onConfirmPress - Callback for handling confirm button presses in the bookmark modal
 * @returns {Array<Topic>} uniqueTopics - Array of unique related topics
 * @returns {string} slug - The slug of the current category/topic
 * @returns {string} id - The ID of the current category/topic
 * @returns {string} title - The title of the current category/topic
 * @returns {boolean} internetLoader - Whether the internet connection check is loading
 * @returns {boolean} isInternetConnection - Whether there is an active internet connection
 * @returns {boolean} internetFail - Whether the internet connection check failed
 * @returns {Function} handleRetry - Callback for retrying data fetch after connection failure
 */

const getResponseData = (
  data: RecentResponse | undefined,
  responseKey: string
): RecentData | undefined => {
  if (!data || !(responseKey in data)) return undefined;
  return (data as Record<string, RecentData>)[responseKey];
};

const getMoreResponseData = (
  data: MoreResponse | undefined,
  responseKey: string
): MoreData | undefined => {
  if (!data || !(responseKey in data)) return undefined;
  return (data as Record<string, MoreData>)[responseKey];
};

const useCategoryTopicDetailViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { guestToken, clearAuth } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [moreFromCategoryData, setMoreFromCategoryData] = useState<TransformedCategoryItem[]>([]);
  const [recentCategoryData, setRecentCategoryData] = useState<TransformedCategoryItem[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const widgetRefetch = useRef<null | (() => Promise<void>)>(null);
  const weatherWidgetRefetch = useRef<null | (() => Promise<void>)>(null);
  const timerRefetch = useRef<null | (() => Promise<void>)>(null);

  const routeParams = route.params as
    | { slug?: string; id?: string; title?: string; type?: 'category' | 'topic' }
    | undefined;
  const { slug, id, title, type = 'category' } = routeParams || {};

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    refetchQueries: [
      {
        query: type === 'topic' ? RECENT_TOPIC_QUERY : RECENT_CATEGORY_QUERY,
        variables: {
          [type === 'topic' ? 'topicId' : 'categoryId']: id,
          isBookmarked: true,
          limit: 7
        }
      },
      {
        query: type === 'topic' ? MORE_FROM_TOPIC_QUERY : MORE_FROM_CATEGORY_QUERY,
        variables: {
          [type === 'topic' ? 'topicId' : 'categoryId']: id,
          isBookmarked: true,
          count: 7,
          nextCursor: nextCursor,
          limit: 10
        }
      }
    ]
  });

  const { data, loading, error, refetch } = useQuery<RecentResponse>(
    type === 'topic' ? RECENT_TOPIC_QUERY : RECENT_CATEGORY_QUERY,
    {
      variables: {
        [type === 'topic' ? 'topicId' : 'categoryId']: id,
        isBookmarked: true,
        limit: 7
      },
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      skip: !id
    }
  );

  const { data: topicData } = useQuery<TopicResponse>(TOPIC_QUERY, {
    variables: { slug },
    fetchPolicy: 'network-only'
  });

  const [fetchMoreFromCategory, { data: moreData, loading: moreLoading }] =
    useLazyQuery<MoreResponse>(
      type === 'topic' ? MORE_FROM_TOPIC_QUERY : MORE_FROM_CATEGORY_QUERY,
      {
        fetchPolicy: 'network-only',

        onCompleted: (responseData: MoreResponse) => {
          const responseKey = type === 'topic' ? 'MoreFromTopics' : 'MoreFromCategory';
          const response = getMoreResponseData(responseData, responseKey);
          if (response) {
            const transformedData = response.data.map((item: CategoryTopicDetailItem) => ({
              imageUrl: item.heroImages?.[0]?.url || '',
              vintageUrl: item.heroImages?.[0]?.sizes?.vintage?.url,
              landscapeUrl: item.heroImages?.[0]?.sizes?.landscape?.url,
              topic:
                type === 'topic'
                  ? item.category?.title || item.topics?.[0]?.title || ''
                  : item.topics?.[0]?.title || item.category?.title || '',
              title: item.title,
              minutesAgo:
                item.collection === 'videos'
                  ? formatDurationToMinutes(item?.videoDuration ?? 0)
                  : `${item.readTime} min`,
              isBookmarked: item.isBookmarked,
              publishedAt: item.publishedAt,
              id: item.id,
              slug: item.slug,
              type: item.collection,
              collection: item.collection,
              caption: item.heroImages?.[0]?.caption || '',
              summary: item.summary,
              excerpt: item.excerpt,
              liveblogStatus: item.liveblogStatus,
              topics: item.topics || [],
              openingType: item?.openingType || 'none'
            }));

            if (isLoadingMore) {
              setMoreFromCategoryData((prev) => [...prev, ...transformedData]);
              setIsLoadingMore(false);
            } else {
              setMoreFromCategoryData(transformedData);
            }

            setNextCursor(response.pagination.nextCursor);
          }
        }
      }
    );

  useEffect(() => {
    const responseKey = type === 'topic' ? 'RecentTopics' : 'RecentCategory';
    const responseData = getResponseData(data, responseKey);
    if (responseData?.data && responseData.data.length > 0 && id) {
      setCategoryId(id);
      fetchMoreFromCategory({
        variables: {
          [type === 'topic' ? 'topicId' : 'categoryId']: id,
          isBookmarked: true,
          count: 7,
          nextCursor: null,
          limit: 10
        }
      });
    }
  }, [data, fetchMoreFromCategory, id, type]);

  const onGoBack = useCallback(() => {
    logSelectContentEvent(
      type == 'topic'
        ? {
            screen_name: ANALYTICS_COLLECTION.TOPIC,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.TOPIC}_${ANALYTICS_PAGE.TOPIC_HOME}`,
            organisms: ANALYTICS_ORGANISMS.TOPIC.HEADER,
            content_type: 'undefined',
            content_action: ANALYTICS_ATOMS.BACK,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.TOPIC
          }
        : {
            screen_name: ANALYTICS_COLLECTION.CATEGORY,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.CATEGORY}_${ANALYTICS_PAGE.CATEGORY_HOME}`,
            organisms: ANALYTICS_ORGANISMS.CATEGORY.HEADER,
            content_type: ANALYTICS_MOLECULES.CATEGORY.BACK,
            content_action: ANALYTICS_ATOMS.BACK,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.CATEGORY
          }
    );
    navigation.goBack();
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setNextCursor(null);
      setMoreFromCategoryData([]);
      await refetch();
      widgetRefetch.current?.();
      weatherWidgetRefetch.current?.();
      timerRefetch.current?.();
      if (categoryId) {
        await fetchMoreFromCategory({
          variables: {
            [type === 'topic' ? 'topicId' : 'categoryId']: categoryId,
            isBookmarked: true,
            count: 7,
            nextCursor: null,
            limit: 10
          }
        });
      }
    } catch (error: unknown) {
      setToastType('error');
      setToastMessage(
        ((error as ApolloError)?.graphQLErrors?.[0]?.extensions?.message as string) ||
          t('screens.login.text.somethingWentWrong')
      );
    } finally {
      setRefreshing(false);
    }
  }, [refetch, fetchMoreFromCategory, categoryId, t]);

  useEffect(() => {
    const responseKey = type === 'topic' ? 'RecentTopics' : 'RecentCategory';
    const responseData = getResponseData(data, responseKey);
    if (responseData?.data) {
      const transformedData = responseData.data.map((item: CategoryTopicDetailItem) => ({
        imageUrl: item.heroImages?.[0]?.url || '',
        vintageUrl: item.heroImages?.[0]?.sizes?.vintage?.url,
        landscapeUrl: item.heroImages?.[0]?.sizes?.landscape?.url,
        topic:
          type === 'topic'
            ? item.category?.title || item.topics?.[0]?.title || ''
            : item.topics?.[0]?.title || item.category?.title || '',
        title: item.title,
        minutesAgo:
          item.collection === 'videos'
            ? formatDurationToMinutes(item?.videoDuration ?? 0)
            : `${item.readTime} min`,
        isBookmarked: item.isBookmarked,
        publishedAt: item.publishedAt,
        id: item.id,
        slug: item.slug,
        type: item.collection,
        collection: item.collection,
        caption: item.heroImages?.[0]?.caption || '',
        summary: item.summary,
        excerpt: item.excerpt,
        liveblogStatus: item.liveblogStatus,
        topics: item.topics || [],
        openingType: item?.openingType || 'none'
      }));
      setRecentCategoryData(transformedData);
    }
  }, [data, type]);

  const handleCategoryCardAnalyticEvent = (
    item: TransformedCategoryItem | undefined,
    index: number,
    isMoreNews = false,
    action: string
  ) => {
    let analyticParams: SelectViewParams = {
      idPage: item?.id ?? '',
      screen_name: type == 'topic' ? ANALYTICS_COLLECTION.TOPIC : ANALYTICS_COLLECTION.CATEGORY,
      Tipo_Contenido:
        type == 'topic'
          ? `${ANALYTICS_COLLECTION.TOPIC}_${ANALYTICS_PAGE.TOPIC_HOME}`
          : `${ANALYTICS_COLLECTION.CATEGORY}_${ANALYTICS_PAGE.CATEGORY_HOME}`,
      screen_page_web_url:
        type == 'topic' ? SCREEN_PAGE_WEB_URL.TOPIC : SCREEN_PAGE_WEB_URL.CATEGORY,
      content_action: action,
      content_title: item?.title ?? ''
    };

    if (isMoreNews) {
      // more news event
      analyticParams = {
        ...analyticParams,
        organisms:
          type == 'topic'
            ? ANALYTICS_ORGANISMS.TOPIC.MORE_NEWS
            : ANALYTICS_ORGANISMS.CATEGORY.MORE_NEWS,
        content_type:
          type == 'topic'
            ? `${ANALYTICS_MOLECULES.TOPIC.MORE_NEWS} ${index + 1}`
            : `${ANALYTICS_MOLECULES.CATEGORY.MORE_NEWS} ${index + 1}`
      };
    } else if (index == 0) {
      //principal event
      analyticParams = {
        ...analyticParams,
        organisms:
          type == 'topic' ? ANALYTICS_ORGANISMS.TOPIC.HERO : ANALYTICS_ORGANISMS.CATEGORY.HERO,
        content_type:
          type == 'topic'
            ? `${ANALYTICS_MOLECULES.TOPIC.PRINCIPAL_NEWS}`
            : `${ANALYTICS_MOLECULES.CATEGORY.PRINCIPAL_NEWS}`
      };
    } else {
      // secondary events
      analyticParams = {
        ...analyticParams,
        organisms: 'undefined',
        content_type:
          type == 'topic'
            ? `${ANALYTICS_MOLECULES.TOPIC.SECONDARY_NEWS} ${index}`
            : `${ANALYTICS_MOLECULES.CATEGORY.SECONDARY_NEWS} ${index}`
      };
    }

    logSelectContentEvent(analyticParams);
  };

  const handleCardPress = useCallback(
    (item: TransformedCategoryItem, index: number, isMoreNews = false) => {
      const { collection, slug } = item;
      handleCategoryCardAnalyticEvent(item, index, isMoreNews, ANALYTICS_ATOMS.TAP_IN_TEXT);
      switch (collection) {
        case 'live-blogs':
          navigation.navigate(routeNames.HOME_STACK, {
            screen: screenNames.LIVE_BLOG,
            params: { slug, isLive: item.liveblogStatus === 'active' }
          });
          break;
        case 'posts':
          navigation.navigate(routeNames.HOME_STACK, {
            screen: screenNames.STORY_PAGE_RENDERER,
            params: { slug }
          });
          break;
        case 'videos':
          navigation.navigate(routeNames.VIDEOS_STACK, {
            screen: screenNames.VIDEO_DETAIL_PAGE,
            params: { slug }
          });
          break;
        default:
          navigation.navigate(routeNames.HOME_STACK, {
            screen: screenNames.STORY_PAGE_RENDERER,
            params: { slug }
          });
          break;
      }
    },
    [navigation]
  );

  const onToggleBookmark = useCallback(
    async (contentId: string, type: string, index: number, isMoreNews = false) => {
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

        if (result.data?.toggleBookmark?.success) {
          const isBookmarked = result.data.toggleBookmark.isBookmarked;
          handleCategoryCardAnalyticEvent(
            undefined,
            index,
            isMoreNews,
            isBookmarked ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK
          );
          setToastType('success');
          setToastMessage(
            isBookmarked ? result.data.toggleBookmark.message : result.data.toggleBookmark.message
          );
        } else {
          setToastType('error');
          setToastMessage(
            (result.errors?.[0]?.extensions?.message as string) ||
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

  const onConfirmPress = () => {
    setBookmarkModalVisible(false);
    clearAuth();
  };

  const onCancelPress = () => {
    setBookmarkModalVisible(false);
    clearAuth(true);
  };

  const loadMore = useCallback(async () => {
    if (!nextCursor || moreLoading || isLoadingMore || !categoryId) return;

    setIsLoadingMore(true);

    logSelectContentEvent(
      type == 'topic'
        ? {
            screen_name: ANALYTICS_COLLECTION.TOPIC,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.TOPIC}_${ANALYTICS_PAGE.TOPIC_HOME}`,
            organisms: 'undefined',
            content_type: ANALYTICS_MOLECULES.TOPIC.SEE_MORE,
            content_action: ANALYTICS_ATOMS.TAP,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.TOPIC
          }
        : {
            screen_name: ANALYTICS_COLLECTION.CATEGORY,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.CATEGORY}_${ANALYTICS_PAGE.CATEGORY_HOME}`,
            organisms: 'undefined',
            content_type: ANALYTICS_MOLECULES.CATEGORY.SEE_MORE,
            content_action: ANALYTICS_ATOMS.TAP,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.CATEGORY
          }
    );

    try {
      await fetchMoreFromCategory({
        variables: {
          [type === 'topic' ? 'topicId' : 'categoryId']: categoryId,
          isBookmarked: true,
          count: 7,
          nextCursor: nextCursor,
          limit: 10
        }
      });
    } catch {
      setIsLoadingMore(false);
    }
  }, [nextCursor, moreLoading, isLoadingMore, categoryId, fetchMoreFromCategory]);

  const uniqueTopics = useMemo(() => {
    const allTopics = recentCategoryData.flatMap((item) => item.topics || []);
    const uniqueTopicsMap = new Map();
    allTopics.forEach((topic) => {
      if (topic.title && !uniqueTopicsMap.has(topic.title) && topic.title !== title) {
        uniqueTopicsMap.set(topic.title, topic);
      }
    });
    return Array.from(uniqueTopicsMap.values()).slice(0, 5);
  }, [recentCategoryData, title]);

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

  const handleTopicChipsPress = (topicSlug: string | Topic, index: number) => {
    const slug = typeof topicSlug === 'string' ? topicSlug : (topicSlug.slug ?? '');
    const topic = uniqueTopics.find((t) => t.slug === slug);

    logSelectContentEvent(
      type == 'topic'
        ? {
            screen_name: ANALYTICS_COLLECTION.TOPIC,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.TOPIC}_${ANALYTICS_PAGE.TOPIC_HOME}`,
            organisms: ANALYTICS_ORGANISMS.TOPIC.RELATED_TOPIC,
            content_type: `${ANALYTICS_MOLECULES.TOPIC.PILL} ${index + 1}`,
            content_action: ANALYTICS_ATOMS.TAP,
            content_title: topic?.title,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.TOPIC
          }
        : {
            screen_name: ANALYTICS_COLLECTION.CATEGORY,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.CATEGORY}_${ANALYTICS_PAGE.CATEGORY_HOME}`,
            organisms: ANALYTICS_ORGANISMS.CATEGORY.RELATED_TOPIC,
            content_type: `${ANALYTICS_MOLECULES.CATEGORY.PILL} ${index + 1}`,
            content_action: ANALYTICS_ATOMS.TAP,
            content_title: topic?.title,
            screen_page_web_url: SCREEN_PAGE_WEB_URL.CATEGORY
          }
    );

    navigation.push(routeNames.HOME_STACK, {
      screen: screenNames.CATEGORY_DETAIL_SCREEN,
      params: {
        slug,
        id: topic?.id,
        title: topic?.title,
        type: 'topic'
      }
    });
  };

  return {
    theme,
    onGoBack,
    categoryData: getResponseData(data, type === 'topic' ? 'RecentTopics' : 'RecentCategory')?.data,
    transformedCategoryData: recentCategoryData,
    loading,
    error,
    refreshing,
    handleCardPress,
    onToggleBookmark,
    onRefresh,
    moreFromCategoryData,
    moreLoading,
    isLoadingMore,
    hasNextPage:
      getMoreResponseData(moreData, type === 'topic' ? 'MoreFromTopics' : 'MoreFromCategory')
        ?.pagination?.hasNext || false,
    loadMore,
    toastMessage,
    toastType,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onCancelPress,
    onConfirmPress,
    uniqueTopics,
    slug,
    id,
    title,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    widgetRefetch,
    routeParams,
    weatherWidgetRefetch,
    timerRefetch,
    activateAds: topicData?.Topic?.activateAds || false,
    handleTopicChipsPress
  };
};

export default useCategoryTopicDetailViewModel;
