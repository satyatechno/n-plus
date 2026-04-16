import { useCallback, useEffect, useMemo, useState } from 'react';

import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  MORE_OPINION_LIST_QUERY,
  RECENT_OPINION_LIST_QUERY
} from '@src/graphql/main/opinion/queries';
import { useTheme } from '@src/hooks/useTheme';
import { RecentOpinionListResponse, Opinion, CarouselData } from '@src/models/main/Opinion/Opinion';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { shareContent } from '@src/utils/shareContent';
import client from '@src/services/apollo/apolloClient';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE
} from '@src/utils/analyticsConstants';

const MIN_ITEMS = 4;
const MAX_ITEMS = 8;

const useOpinionViewModel = () => {
  const [theme] = useTheme();
  const { t } = useTranslation();
  const { userId, guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(18);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [displayMoreOpinionList, setDisplayMoreOpinionList] = useState<CarouselData[] | undefined>(
    undefined
  );
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    logContentViewEvent({
      idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
      screen_name: ANALYTICS_PAGE.OPINION_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
      content_title: ANALYTICS_PAGE.OPINION_HOME
    });
  }, []);

  useEffect(() => {
    // Clear the specific query cache
    client.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'RecentCategory'
    });
    // Force garbage collection
    client.cache.gc();
  }, [client]);

  const {
    data: moreOpinionListData,
    loading: moreOpinionListLoading,
    refetch: refetchMoreOpinionList
  } = useQuery(MORE_OPINION_LIST_QUERY, {
    variables: {
      categoryId: Config.OPINION_CATEGORY_ID,
      isBookmarked: true,
      count: MAX_ITEMS,
      nextCursor: null,
      limit: limit
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: recentOpinionsData,
    loading: recentOpinionsLoading,
    refetch: refetchRecentOpinions
  } = useQuery<RecentOpinionListResponse>(RECENT_OPINION_LIST_QUERY, {
    variables: {
      categoryId: Config.OPINION_CATEGORY_ID,
      limit: MAX_ITEMS,
      isBookmarked: true
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  });

  const moreOpinionList = moreOpinionListData?.MoreFromCategory.data;
  const hasNext = moreOpinionListData?.MoreFromCategory.pagination?.hasNext ?? false;

  // Keep displayed list stable during pagination; update on initial/normal loads
  useEffect(() => {
    if (!isLoadMore && moreOpinionList) {
      setDisplayMoreOpinionList(moreOpinionList);
    }
  }, [isLoadMore, moreOpinionList]);

  const onRetry = useCallback(async () => {
    setRefreshLoader(true);
    try {
      await Promise.all([
        refetchRecentOpinions({
          categoryId: Config.OPINION_CATEGORY_ID,
          limit: MAX_ITEMS,
          isBookmarked: true
        }),
        refetchMoreOpinionList({
          categoryId: Config.OPINION_CATEGORY_ID,
          userId: userId,
          limit: 18,
          isBookmarked: true,
          nextCursor: null
        })
      ]);
    } finally {
      setRefreshLoader(false);
    }
  }, [refetchRecentOpinions, refetchMoreOpinionList, userId]);

  const onIncreaseLimitByTen = useCallback(async () => {
    const newLimit = limit + 10;
    setIsLoadMore(true);
    setLimit(newLimit);
    try {
      const result = await refetchMoreOpinionList({
        categoryId: Config.OPINION_CATEGORY_ID,
        userId: userId,
        limit: newLimit,
        isBookmarked: true,
        nextCursor: null
      });
      const nextData = result?.data?.MoreFromCategory?.data as CarouselData[] | undefined;
      if (nextData && nextData.length) {
        setDisplayMoreOpinionList(nextData);
      }
    } finally {
      setIsLoadMore(false);
    }
  }, [limit, refetchMoreOpinionList, userId]);

  const handleBookmarkPress = useCallback(
    async (contentId?: string) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }

      if (!contentId) return;
      try {
        const result = await toggleBookmarkMutation({
          variables: {
            input: {
              contentId,
              type: 'Content'
            }
          }
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
      } catch {
        setToastType('error');
        setToastMessage(t('screens.login.text.somethingWentWrong'));
      }
    },
    [guestToken, toggleBookmarkMutation, t]
  );

  const opinions: Opinion[] = useMemo(
    () => recentOpinionsData?.RecentCategory?.data ?? [],
    [recentOpinionsData?.RecentCategory?.data]
  );

  const hasEnoughOpinions = opinions.length >= MIN_ITEMS;

  const validOpinions = useMemo(() => opinions.slice(0, MAX_ITEMS), [opinions]);

  const primaryOpinions = useMemo(
    () => validOpinions.slice(0, Math.min(5, validOpinions.length - 3)),
    [validOpinions]
  );

  const secondaryOpinions = useMemo(
    () => validOpinions.slice(primaryOpinions.length, primaryOpinions.length + 3),
    [validOpinions, primaryOpinions.length]
  );

  const handleNavigationToDetailPage = useCallback(
    (slug: string, collection: string) => {
      navigation.navigate(routeNames.OPINION_STACK, {
        screen: screenNames.OPINION_DETAIL_PAGE,
        params: { slug, collection }
      });
    },
    [navigation]
  );

  const handleSharePress = useCallback(async (item?: { fullPath?: string }) => {
    if (!item?.fullPath) return;
    await shareContent({ fullPath: item.fullPath });
  }, []);

  const handleSearchPress = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
      screen_name: ANALYTICS_PAGE.OPINION_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.OPINION.HEADER,
      content_type: ANALYTICS_MOLECULES.OPINION.SEARCH,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
      content_action: ANALYTICS_ATOMS.SEARCH
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  }, []);

  const handleBookmarkAnalytics = useCallback(
    (isBookmarked: boolean, contentTitle: string, category: string) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
        screen_name: ANALYTICS_PAGE.OPINION_HOME,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
        organisms: ANALYTICS_ORGANISMS.OPINION.HERO,
        content_type: ANALYTICS_MOLECULES.OPINION.FULL_NEWS,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
        content_action: isBookmarked ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
        content_title: contentTitle,
        categories: category
      });
    },
    []
  );

  const handleTapInTextAnalytics = useCallback((contentTitle: string, category: string) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
      screen_name: ANALYTICS_PAGE.OPINION_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.OPINION.HERO,
      content_type: ANALYTICS_MOLECULES.OPINION.FULL_NEWS,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_title: contentTitle,
      categories: category
    });
  }, []);

  const handleSecondaryBookmarkAnalytics = useCallback(
    (isBookmarked: boolean, contentTitle: string, category: string) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
        screen_name: ANALYTICS_PAGE.OPINION_HOME,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
        organisms: ANALYTICS_ORGANISMS.OPINION.HERO,
        content_type: ANALYTICS_MOLECULES.OPINION.OPINION_NEWS_CARD,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
        content_action: isBookmarked ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
        content_title: contentTitle,
        categories: category
      });
    },
    []
  );

  const handleSecondaryTapInTextAnalytics = useCallback((item: Opinion, cardIndex: number) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
      screen_name: ANALYTICS_PAGE.OPINION_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.OPINION.HERO,
      content_type: `${ANALYTICS_MOLECULES.OPINION.OPINION_NEWS_CARD} | ${cardIndex + 1}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_title: item?.title,
      categories: item?.collection
    });
  }, []);

  const handleRecentOpinionsAnalytics = useCallback((item: CarouselData, index: number) => {
    logSelectContentEvent({
      idPage: item?.id || ANALYTICS_ID_PAGE.OPINION_HOME,
      screen_name: ANALYTICS_PAGE.OPINION_HOME,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.OPINION.RECIENTES,
      content_type: `${ANALYTICS_MOLECULES.OPINION.RECENT_OPINIONS}_${index + 1}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
      content_action: ANALYTICS_ATOMS.TAP,
      content_title: item?.title,
      categories: item?.category?.title
    });
  }, []);

  const handleDisplayMoreBookmarkAnalytics = useCallback(
    (item: CarouselData, isBookmarked: boolean) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
        screen_name: ANALYTICS_PAGE.OPINION_HOME,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
        organisms: ANALYTICS_ORGANISMS.OPINION.OTRAS_OPINIONES,
        content_type: ANALYTICS_MOLECULES.OPINION.OPINION_NEWS_CARD_NO_LIMIT,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
        content_action: isBookmarked ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
        content_title: item?.title,
        categories: item?.category?.title
      });
    },
    []
  );

  const handleDisplayMoreTapInTextAnalytics = useCallback(
    (item: CarouselData, cardIndex: number) => {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.OPINION_HOME,
        screen_name: ANALYTICS_PAGE.OPINION_HOME,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.OPINION}_${ANALYTICS_PAGE.OPINION_HOME}`,
        organisms: ANALYTICS_ORGANISMS.OPINION.OTRAS_OPINIONES,
        content_type: `${ANALYTICS_MOLECULES.OPINION.OPINION_NEWS_CARD_NO_LIMIT} | ${cardIndex + 1}`,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.OPINION_HOME,
        content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
        content_title: item?.title,
        categories: item?.category?.title
      });
    },
    []
  );

  return {
    theme,
    hasEnoughOpinions,
    primaryOpinions,
    secondaryOpinions,
    t,
    moreOpinionList,
    displayMoreOpinionList,
    moreOpinionListLoading,
    recentOpinionsLoading,
    onRetry,
    refreshLoader,
    isInternetConnection,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    hasNext,
    onIncreaseLimitByTen,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    handleNavigationToDetailPage,
    handleSharePress,
    handleSearchPress,
    handleBookmarkAnalytics,
    handleTapInTextAnalytics,
    handleSecondaryBookmarkAnalytics,
    handleSecondaryTapInTextAnalytics,
    handleRecentOpinionsAnalytics,
    handleDisplayMoreBookmarkAnalytics,
    handleDisplayMoreTapInTextAnalytics,
    isLoadMore
  };
};

export default useOpinionViewModel;
