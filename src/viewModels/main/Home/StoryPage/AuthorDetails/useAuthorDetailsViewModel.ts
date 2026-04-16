import { useCallback, useEffect, useState } from 'react';

import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  AuthorDetailsViewModel,
  MoreFromAuthorsResponse,
  ToggleBookmarkResponse,
  UserResponse,
  Article
} from '@src/models/main/Home/StoryPage/AuthorDetails';
import { useTheme } from '@src/hooks/useTheme';
import {
  AUTHOR_DETAIL_QUERY,
  IS_BOOKMARKED_BY_USER_QUERY,
  MORE_FROM_AUTHORS_QUERY
} from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { HomeStackParamList, RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import useNetworkStore from '@src/zustand/networkStore';
import { shareContent } from '@src/utils/shareContent';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  getAuthorBioNewsCardMolecule
} from '@src/utils/analyticsConstants';

const useAuthorDetailsViewModel = (): AuthorDetailsViewModel => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'AuthorDetails'>>();
  const { slug } = route.params || {};
  const { isInternetConnection } = useNetworkStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const { guestToken, clearAuth } = useAuthStore();
  const { setIsPipMode, setIsMediaPipMode } = useVideoPlayerStore();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string>('');
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [allAuthorArticles, setAllAuthorArticles] = useState<Article[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const [
    getAuthorDetails,
    {
      data: authorDetailsData,
      error: authorDetailsError,
      loading: authorDetailsLoading,
      refetch: authorDetailsRefetch
    }
  ] = useLazyQuery<UserResponse>(AUTHOR_DETAIL_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  const [
    getAuthorArticle,
    { data: authorArticleData, error: authorArticleError, loading: authorArticleLoading }
  ] = useLazyQuery<MoreFromAuthorsResponse>(MORE_FROM_AUTHORS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  const onRefresh = async () => {
    try {
      setRefreshLoader(true);
      setAllAuthorArticles([]);
      setIsInitialLoad(true);
      setIsInitialLoading(true);
      setLoadMoreLoading(false);
      const authorResult = await authorDetailsRefetch({ slug });
      const authorId = authorResult?.data?.User?.id;
      if (authorId) {
        await getAuthorArticle({
          variables: {
            userId: authorId,
            authorId: authorId,
            isBookmarked: true,
            limit: 10,
            nextCursor: nextCursor
          }
        });
      }
      setRefreshLoader(false);
    } catch {
      setRefreshLoader(false);
    }
  };

  const onLoadMore = async () => {
    if (!hasNext || loadMoreLoading) return;
    const authorId = authorDetails?.id;
    if (!authorId) return;
    try {
      setLoadMoreLoading(true);
      await getAuthorArticle({
        variables: {
          userId: authorId,
          authorId: authorId,
          isBookmarked: true,
          limit: 10,
          nextCursor: nextCursor
        }
      });
    } catch {
      setLoadMoreLoading(false);
    }
  };

  const authorDetails = authorDetailsData?.User;
  const currentPageData = authorArticleData?.MoreFromAuthors?.data ?? [];
  const pagination = authorArticleData?.MoreFromAuthors?.pagination;

  const [setToggleBookmark, { error: bookmarkToggleError }] = useMutation<ToggleBookmarkResponse>(
    TOGGLE_BOOKMARK_MUTATION,
    {
      fetchPolicy: 'network-only'
    }
  );

  const [toggleBookmarkByUser] = useLazyQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    toggleBookmark(authorDetailsData?.User?.id);
  }, [authorDetailsData]);

  useEffect(() => {
    if (pagination) {
      setHasNext(pagination.hasNext);
      setNextCursor(pagination.nextCursor);
    }
  }, [pagination]);

  useEffect(() => {
    if (currentPageData.length > 0) {
      if (isInitialLoad) {
        setAllAuthorArticles(currentPageData);
        setIsInitialLoad(false);
        setIsInitialLoading(false);
      } else if (loadMoreLoading) {
        setAllAuthorArticles((prev) => [...prev, ...currentPageData]);
        setLoadMoreLoading(false);
      }
    }
  }, [currentPageData, isInitialLoad, loadMoreLoading]);

  const toggleBookmark = async (contentId: string | undefined) => {
    if (!contentId) return;
    const res = await toggleBookmarkByUser({
      variables: { contentId: contentId, type: 'Author' }
    });
    setIsBookmark(res.data.isBookmarkedByUser);
  };

  useEffect(() => {
    setLoading(false);
    if (authorDetailsError) {
      setErrorMsg(authorDetailsError.message);
    } else if (authorArticleError) {
      setErrorMsg(authorArticleError.message);
    } else if (bookmarkToggleError) {
      setErrorMsg(bookmarkToggleError.message);
    }
  }, [authorDetailsError, authorArticleError, bookmarkToggleError, loading]);

  useEffect(() => {
    setIsPipMode(false);
    setIsMediaPipMode(false);
    const fetchData = async () => {
      const authorResult = await getAuthorDetails({ variables: { slug } });
      const authorId = authorResult?.data?.User?.id;
      if (authorId) {
        await getAuthorArticle({
          variables: {
            userId: authorId,
            authorId: authorId,
            isBookmarked: true,
            limit: 10,
            nextCursor: ''
          }
        });
      }
    };

    fetchData();
  }, [slug]);

  const onToggleBookmark = async (contentId: string, type: string) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    if (type === 'Author') {
      logSelectContentEvent({
        ...getAuthorAnalyticsBaseParams(),
        organisms: 'undefined',
        content_type: 'undefined',
        content_action: isBookmark ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK
      });
    }
    try {
      if (type === 'Author') {
        setIsBookmark(!isBookmark);
      }
      const result = await setToggleBookmark({
        variables: { input: { contentId: contentId, type } }
      });

      if (result.data?.toggleBookmark?.success) {
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

  const getAuthorAnalyticsBaseParams = () => ({
    idPage: authorDetails?.id ?? 'undefined',
    screen_page_web_url: authorDetails?.fullPath ?? slug ?? 'undefined',
    screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
    Tipo_Contenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
    content_name: authorDetails?.name ?? 'undefined',
    content_title: authorDetails?.name ?? 'undefined'
  });

  const onGoBack = () => {
    logSelectContentEvent({
      ...getAuthorAnalyticsBaseParams(),
      organisms: ANALYTICS_ORGANISMS.STORY_PAGE.CATEGORY_SLIDER,
      content_type: 'undefined',
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const getArticleCardAnalyticsBaseParams = useCallback(
    (item: Article, index: number) => ({
      idPage: authorDetails?.id ?? 'undefined',
      screen_page_web_url: authorDetails?.fullPath ?? slug ?? 'undefined',
      screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.AUTHOR_BIO}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
      organisms: ANALYTICS_ORGANISMS.AUTHOR_BIO.MAS_DEL_AUTOR,
      content_type: getAuthorBioNewsCardMolecule(index),
      content_name: item.title || 'undefined',
      content_title: authorDetails?.name ?? 'undefined',
      categories: item.category?.title ?? 'undefined'
    }),
    [authorDetails, slug]
  );

  const onArticleCardPress = useCallback(
    (item: Article, index: number) => {
      logSelectContentEvent({
        ...getArticleCardAnalyticsBaseParams(item, index),
        content_action: ANALYTICS_ATOMS.TAP
      });
      if (item.slug) {
        if (item.category?.id === Config.OPINION_CATEGORY_ID) {
          navigation.navigate(routeNames.OPINION_STACK, {
            screen: screenNames.OPINION_DETAIL_PAGE,
            params: { slug: item.slug, collection: item.collection }
          });
        } else if (item.collection === 'videos') {
          navigation.navigate(routeNames.VIDEOS_STACK, {
            screen: screenNames.VIDEO_DETAIL_PAGE,
            params: { slug: item.slug }
          });
        } else {
          navigation.push(routeNames.HOME_STACK, {
            screen: screenNames.STORY_PAGE_RENDERER,
            params: { slug: item.slug }
          });
        }
      }
    },
    [navigation, getArticleCardAnalyticsBaseParams]
  );

  const onArticleBookmarkPress = useCallback(
    (item: Article, index: number) =>
      (contentId: string, type: string, isAddingBookmark?: boolean) => {
        if (type === 'Content') {
          logSelectContentEvent({
            ...getArticleCardAnalyticsBaseParams(item, index),
            content_action: isAddingBookmark ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK
          });
        }
        void onToggleBookmark(contentId, type);
      },
    [getArticleCardAnalyticsBaseParams]
  );

  const onAuthorArticlePress = useCallback(
    (item: { slug: string; collection: string; category?: { id: string } }) => {
      if (item.slug) {
        if (item.category?.id === Config.OPINION_CATEGORY_ID) {
          navigation.navigate(routeNames.OPINION_STACK, {
            screen: screenNames.OPINION_DETAIL_PAGE,
            params: { slug: item.slug, collection: item.collection }
          });
        } else if (item.collection === 'videos') {
          navigation.navigate(routeNames.VIDEOS_STACK, {
            screen: screenNames.VIDEO_DETAIL_PAGE,
            params: { slug: item.slug }
          });
        } else {
          navigation.push(routeNames.HOME_STACK, {
            screen: screenNames.STORY_PAGE_RENDERER,
            params: { slug: item.slug }
          });
        }
      }
    },
    [navigation]
  );

  const onShare = async () => {
    if (!authorDetailsData?.User?.fullPath) return;
    logSelectContentEvent({
      ...getAuthorAnalyticsBaseParams(),
      organisms: 'undefined',
      content_type: 'undefined',
      content_action: ANALYTICS_ATOMS.SHARE
    });
    await shareContent({ fullPath: authorDetailsData.User.fullPath });
  };

  const onCancelPress = () => {
    setBookmarkModalVisible(false);
    clearAuth(true);
  };

  const onConfirmPress = () => {
    setBookmarkModalVisible(false);
    clearAuth();
  };

  return {
    theme,
    t,
    onGoBack,
    authorArticle: allAuthorArticles,
    authorDetails,
    authorDetailsLoading,
    errorMsg,
    setErrorMsg,
    authorArticleLoading,
    onToggleBookmark,
    onShare,
    onAuthorArticlePress,
    onArticleCardPress,
    onArticleBookmarkPress,
    isBookmark,
    setIsBookmark,
    setLoading,
    loading,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    navigation,
    onCancelPress,
    onConfirmPress,
    toastType,
    toastMessage,
    setToastMessage,
    onRefresh,
    refreshLoader,
    hasNext,
    onLoadMore,
    loadMoreLoading,
    isInitialLoading,
    isInternetConnection
  };
};

export default useAuthorDetailsViewModel;
