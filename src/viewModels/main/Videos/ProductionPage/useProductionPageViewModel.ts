import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  GET_PRODUCTION_HERO_DOCUMENTARIES,
  GET_PRODUCTION_MOST_VIEWED_DOCUMENTARIES,
  GET_PRODUCTION_POST,
  GET_PRODUCTION_VIDEOS,
  GET_USER_CONTINUE_VIDEOS
} from '@src/graphql/main/videos/queries';
import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { VideoItem } from '@src/models/main/Videos/Videos';
import Config from 'react-native-config';
import { DELETE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { shareContent } from '@src/utils/shareContent';
import { ProductionPagePost } from '@src/models/main/Videos/ProductionPage';

const useProductionPageViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [isProgramBookmark, setIsProgramBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const route = useRoute();
  const routeParams = route.params as
    | { title?: string; label?: string; selectedItem: { value: { id: string } } }
    | undefined;
  const { title, selectedItem, label } = routeParams || {};
  const productionId = selectedItem?.value?.id || (route?.params as { id: string })?.id;
  const {
    data: heroDocumentariesData,
    loading: heroDocumentariesLoading,
    refetch: refetchheroDocumentaries
  } = useQuery(GET_PRODUCTION_HERO_DOCUMENTARIES, {
    variables: {
      production: productionId
      // isBookmarked:false
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: mostViewedDocumentariesData,
    loading: mostViewedDocumentariesLoading,
    refetch: refetchMostViewedDocumentaries
  } = useQuery(GET_PRODUCTION_MOST_VIEWED_DOCUMENTARIES, {
    variables: {
      production: productionId,
      isBookmarked: false
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const excludeSlug = useMemo(() => {
    const heroSlug = heroDocumentariesData?.GetProductionHeroDocumentaries?.slug;
    const mostViewedSlug =
      mostViewedDocumentariesData?.GetProductionMostViewedDocumentaries?.map(
        (item: ProductionPagePost) => item?.slug
      ) ?? [];
    return [heroSlug, ...mostViewedSlug].join(',');
  }, [heroDocumentariesData, mostViewedDocumentariesData]);

  const {
    data: productionVideos,
    loading: productionVideosLoading,
    refetch: refetchProductionVideos,
    fetchMore: fetchMoreVideos
  } = useQuery(GET_PRODUCTION_VIDEOS, {
    variables: {
      production: productionId,
      isBookmarked: true,
      limit: 4,
      cursor: null,
      excludeSlug: excludeSlug,
      videoType: 'episode',
      sort: '-publishedAt'
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const loadMoreProductionVideos = () => {
    if (productionVideosLoading || !productionVideos?.GetVideos?.hasNextPage) return;

    fetchMoreVideos({
      variables: {
        production: productionId,
        limit: 4,
        cursor: productionVideos?.GetVideos?.nextCursor,
        isBookmarked: true,
        excludeSlug: excludeSlug,
        videoType: 'episode',
        sort: '-publishedAt'
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          GetVideos: {
            ...fetchMoreResult.GetVideos,
            docs: [...prev.GetVideos.docs, ...fetchMoreResult.GetVideos.docs]
          }
        };
      }
    });
  };

  const {
    data: productionPost,
    loading: productionPostLoading,
    refetch: refetchProductionPost,
    fetchMore: fetchMorePost
  } = useQuery(GET_PRODUCTION_POST, {
    variables: {
      production: productionId,
      isBookmarked: true,
      limit: 7,
      cursor: null,
      sort: '-publishedAt'
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const loadMoreProductionPost = () => {
    if (productionPostLoading || !productionPost?.GetPosts?.hasNextPage) return;

    fetchMorePost({
      variables: {
        production: productionId,
        limit: 3,
        cursor: productionPost?.GetPosts?.nextCursor,
        isBookmarked: true,
        sort: '-publishedAt'
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          GetPosts: {
            ...fetchMoreResult.GetPosts,
            docs: [...prev.GetPosts.docs, ...fetchMoreResult.GetPosts.docs]
          }
        };
      }
    });
  };

  //GET_USER_CONTINUE_VIDEOS
  const {
    data: continueVideoData,
    refetch: refetchContinueVideos,
    loading: continueVideoLoading,
    fetchMore
  } = useQuery(GET_USER_CONTINUE_VIDEOS, {
    fetchPolicy: 'network-only',
    variables: { limit: 10, isBookmarked: true, nextCursor: null }
  });

  const loadMore = () => {
    const pagination = continueVideoData?.getUserContinueVideos?.pagination;

    if (continueVideoLoading || !pagination?.hasNext) return;

    fetchMore({
      variables: {
        limit: 10,
        nextCursor: pagination.nextCursor,
        isBookmarked: true
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getUserContinueVideos: {
            ...fetchMoreResult.getUserContinueVideos,
            videos: [
              ...prev.getUserContinueVideos.videos,
              ...fetchMoreResult.getUserContinueVideos.videos
            ]
          }
        };
      }
    });
  };

  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION);

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const { data: bookmarkData, refetch: refetchBookmark } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: {
      contentId: heroDocumentariesData?.GetProductionHeroDocumentaries?.id,
      type: 'Content'
    },
    fetchPolicy: 'cache-and-network'
  });

  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('por-el-planeta');

  useEffect(() => {
    refetchBookmark({
      contentId: heroDocumentariesData?.GetProductionHeroDocumentaries?.id,
      type: 'Content'
    });
    const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser;
    if (bookmarkData) {
      setIsProgramBookmark(isBookmarkedByUser);
    }
  }, [bookmarkData]);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const handleBookmarkPress = async (programBookmark?: boolean, contentId?: string) => {
    if (!contentId) return;
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    const data = await toggleBookmarkMutation({
      variables: {
        input: {
          contentId,
          type: 'Content'
        }
      }
    });
    {
      if (programBookmark) {
        setIsProgramBookmark(!isProgramBookmark);
      } else {
        setIsToggleBookmark(!isToggleBookmark);
      }
    }
    setToastType('success');
    setToastMessage(data?.data?.toggleBookmark?.message);
    refetchContinueVideos({ isBookmarked: true });
  };

  const onRetry = async () => {
    try {
      setRefreshLoader(true);
      await Promise.allSettled([
        refetchheroDocumentaries(),
        refetchContinueVideos({
          isBookmarked: true
        }),
        refetchMostViewedDocumentaries({
          input: { limit: 10 }
        }),
        refetchProductionVideos({
          input: { limit: 10 }
        }),
        refetchProductionPost(),
        refetchAdvertisement()
      ]);
    } finally {
      setRefreshLoader(false);
    }
  };

  const goToDetailPage = (slug?: string) => {
    if (!slug) return;

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: { slug, productionId }
    });
  };

  const onMoreDocumentariesCardPress = (item: { slug?: string }) => {
    if (!item?.slug) return;

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: {
        slug: item.slug,
        productionId
      }
    });
  };

  const handleVideoPress = (item: { slug: string; platform?: string; fullPath?: string }) => {
    if (item?.platform === 'website' && item?.fullPath) {
      setWebUrl(Config.WEBSITE_BASE_URL + item.fullPath);
      setShowWebView(true);
      return;
    }

    const matchedVideo = continueVideoData?.getUserContinueVideos?.videos?.find(
      (video: { slug: string }) => video?.slug === item?.slug
    );

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: {
        slug: item?.slug,
        productionId,
        timeWatched: matchedVideo?.timeWatched ?? 0
      }
    });
  };

  const handleMenuPress = (data: { id: string; isBookmarked: boolean }) => {
    setIsToggleBookmark(data?.isBookmarked);
    const video = continueVideoData?.getUserContinueVideos?.videos?.find(
      (item: { id: string }) => item?.id === data?.id
    );

    if (video) {
      setSelectedVideo(video);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSharePress = async () => {
    await shareContent({ fullPath: selectedVideo?.fullPath ?? '' });
    setIsModalVisible(false);
  };

  const handleRemovePress = async () => {
    if (!selectedVideo?.id) return;

    setIsModalVisible(false);
    await deleteVideo({
      variables: { videoId: selectedVideo.id }
    });

    setToastType('success');
    setToastMessage(t('screens.videos.text.videoHasBeenRemoved'));
    refetchContinueVideos();
  };

  const handleThreeDotsBookmarkPress = async () => {
    await handleBookmarkPress(false, selectedVideo?.id);
    setIsModalVisible(false);
  };

  const goToDetailScreen = (slug: string) => {
    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug: slug
      }
    });
  };

  return {
    t,
    productionId,
    title: title ?? label,
    theme,
    goBack,
    handleSearchPress,
    heroDocumentariesData: heroDocumentariesData?.GetProductionHeroDocumentaries,
    handleBookmarkPress,
    toastType,
    toastMessage,
    setToastMessage,
    onRetry,
    heroDocumentariesLoading,
    refreshLoader,
    goToDetailPage,
    isInternetConnection,
    isProgramBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showBannerAds,
    mostViewedDocumentariesData: mostViewedDocumentariesData?.GetProductionMostViewedDocumentaries,
    mostViewedDocumentariesLoading,
    onMoreDocumentariesCardPress,
    continueVideoData,
    continueVideoLoading,
    handleVideoPress,
    handleMenuPress,
    isModalVisible,
    showWebView,
    webUrl,
    handleCloseModal,
    selectedVideo,
    handleSharePress,
    handleRemovePress,
    loadMore,
    isToggleBookmark,
    handleThreeDotsBookmarkPress,
    productionVideos: productionVideos?.GetVideos,
    productionVideosLoading,
    productionPost: productionPost?.GetPosts,
    productionPostLoading,
    goToDetailScreen,
    loadMoreProductionPost,
    loadMoreProductionVideos
  };
};

export default useProductionPageViewModel;
