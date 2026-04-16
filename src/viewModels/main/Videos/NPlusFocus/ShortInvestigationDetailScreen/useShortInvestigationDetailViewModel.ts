import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { debounce } from 'lodash';

import { HomeStackParamList, RootStackParamList } from '@src/navigation/types';
import { screenNames, routeNames } from '@src/navigation/screenNames';
import { MY_PROFILE_DATA_QUERY } from '@src/graphql/main/MyAccount/queries';
import { STORY_BY_SLUG_QUERY } from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { McpItem, VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { CarouselItem } from '@src/models/main/Home/StoryPage/StoryPage';
import useUserStore from '@src/zustand/main/userStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { useHeaderViewModel } from '@src/viewModels/main/Home/StoryPage/Header/useHeaderViewModel';
import { NPLUS_FOCUS_SHORT_LISTING_QUERY } from '@src/graphql/main/videos/queries';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import type { SelectViewParams } from '@src/services/analytics/analyticsTypes';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { BLOCK_TYPES } from '@src/views/organisms/Lexical/constants';
import { MAX_FIREBASE_PARAM_LENGTH } from '@src/config/constants';

export const useShortInvestigationDetailViewModel = () => {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [toastMessage, setToastMessage] = useState<string>('');
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [shimmer, setShimmer] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  // Use a ref to store playback times for each video to avoid re-renders on every update
  const playbackTimes = useRef<Record<string, number>>({});

  const route = useRoute<RouteProp<HomeStackParamList, 'StoryPage'>>();

  const { activeJWIndex, setActiveJWIndex, setAudioPlaying } = useVideoPlayerStore();
  const {
    navItems,
    loading: headerLoading,
    onCategoryPress,
    refetchHeader,
    showWebView,
    webUrl,
    handleWebViewClose
  } = useHeaderViewModel();
  const { isInternetConnection } = useNetworkStore();
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const { userId, guestToken } = useAuthStore.getState();

  const closeAudioPlayer = useCallback(() => {
    setActiveJWIndex(false);
  }, []);

  const toggleJWPlayer = useCallback(() => {
    if (isInternetConnection) {
      setActiveJWIndex(true);
      setAudioPlaying(true);
    } else {
      setToastType('error');
      setToastMessage(t('screens.splash.text.noInternetConnection'));
    }
  }, [isInternetConnection]);

  const { slug: initialSlug } = route.params || {};

  const [slugHistory, setSlugHistory] = useState<string[]>([initialSlug]);
  const previousFullPathRef = useRef<string | undefined>(undefined);
  const currentSlug = slugHistory[slugHistory.length - 1];
  const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

  const {
    data: storyData,
    loading: storyLoading,
    error: storyError,
    refetch: refetchStory
  } = useQuery(STORY_BY_SLUG_QUERY, {
    variables: { slug: currentSlug },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const { adConfig, refetchAdvertisement } = useAdvertisement();

  const storyId = storyData?.Post?.id ?? null;

  const { data: nPlusFocusShortListingData, refetch: refetchNPlusFocusShortListing } = useQuery(
    NPLUS_FOCUS_SHORT_LISTING_QUERY,
    {
      variables: {
        excludeId: storyId,
        mostViewed: true,
        limit: 6
      },
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network'
    }
  );

  const docs = nPlusFocusShortListingData?.NPlusFocusShortReportListing?.docs ?? [];
  const videoItems = docs.filter((item: { type: string }) => item.type === 'video');
  const postItems = docs.filter((item: { type: string }) => item.type === 'post');
  const latestPostItems = [...postItems]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError
  } = useQuery(MY_PROFILE_DATA_QUERY, {
    fetchPolicy: 'network-only',
    skip: !!userId
  });

  useEffect(() => {
    closeAudioPlayer();
    if (!userId && !profileLoading) {
      if (profileData?.myProfile?._id) {
        setUserData(profileData.myProfile);
      } else if (profileError) {
        setToastType('error');
        setToastMessage(
          (profileError?.graphQLErrors?.[0]?.extensions?.message as string) ||
            t('screens.login.text.somethingWentWrong')
        );
      }
    }
  }, [userId, profileData, profileLoading, profileError, setUserData, slugHistory]);

  const story = useMemo(() => storyData?.Post ?? null, [storyData]);

  const headercategories = navItems.map((item) => item?.label);

  const categoriesList = useMemo(
    () =>
      headercategories.includes(story?.category?.title)
        ? [
            story?.category?.title,
            ...headercategories.filter((item) => item !== story?.category?.title)
          ]
        : [story?.category?.title, ...headercategories],
    [story, headercategories]
  );

  const [toggleBookmark, { error: bookmarkToggleError }] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only',
    refetchQueries: [
      {
        query: NPLUS_FOCUS_SHORT_LISTING_QUERY,
        variables: {
          excludeId: storyId,
          mostViewed: true,
          limit: 6
        }
      }
    ],
    awaitRefetchQueries: true
  });

  useEffect(() => {
    setShimmer(false);
    const errors = storyError;
    if ((errors || !storyData?.Post) && !storyLoading) {
      setInternetLoader(false);
    } else {
      setInternetLoader(false);
    }
  }, [storyError, storyLoading, shimmer]);

  useEffect(() => {
    if (bookmarkToggleError) {
      setToastMessage(bookmarkToggleError.message);
    }
  }, [bookmarkToggleError]);

  const storyContent = useMemo(() => story?.content ?? null, [story]);

  const onToggleBookmark = useCallback(
    debounce(async (contentId: string) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }
      try {
        const result = await toggleBookmark({
          variables: { input: { contentId, type: 'Content' } }
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
      } catch (error) {
        const apolloError = error as ApolloError;
        const message =
          apolloError?.graphQLErrors?.[0]?.message ||
          apolloError?.message ||
          t('screens.login.text.somethingWentWrong');
        setToastType('error');
        setToastMessage(message);
      }
    }, 300),
    [userData?._id, toggleBookmark, t, guestToken]
  );

  const videos: VideoItem[] = useMemo(
    () =>
      story?.mcpId?.map((item: McpItem) => ({
        ...item.value,
        title: item.value?.title ?? ''
      })) || [],
    [story?.mcpId]
  );

  const persistPlaybackTime = useCallback(
    (value: number) => {
      // Save current time for the active video
      const currentVideo = videos[activeVideoIndex];
      if (currentVideo?.id) {
        playbackTimes.current[currentVideo.id] = value;
      }
    },
    [videos, activeVideoIndex]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (slugHistory.length > 1) {
        e.preventDefault();
        setSlugHistory((prev) => prev.slice(0, -1));
      }
    });

    return unsubscribe;
  }, [navigation, slugHistory]);

  const onPressingAuthor = useCallback(
    (id: string, slug: string) => {
      navigation.navigate(routeNames.HOME_STACK, {
        screen: screenNames.AUTHOR_DETAILS,
        params: { id, userId: story.id, slug }
      });
      setActiveJWIndex(false);
    },
    [navigation, story?.id]
  );

  const extractEmbedsFromContent = useCallback((content: unknown): string => {
    if (!content) return '';

    let contentObj: { root?: { children?: LexicalNode[] } } | null = null;

    // Parse content if it's a string
    if (typeof content === 'string') {
      try {
        contentObj = JSON.parse(content);
      } catch {
        return '';
      }
    } else if (typeof content === 'object' && content !== null) {
      contentObj = content as { root?: { children?: LexicalNode[] } };
    } else {
      return '';
    }

    if (!contentObj?.root?.children || !Array.isArray(contentObj.root.children)) {
      return '';
    }

    const embedProviders: string[] = [];

    const traverseNodes = (nodes: LexicalNode[]): void => {
      for (const node of nodes) {
        if (
          node.type === 'block' &&
          node.fields?.blockType === BLOCK_TYPES.O_EMBED &&
          node.fields?.provider &&
          typeof node.fields.provider === 'string'
        ) {
          embedProviders.push(node.fields.provider);
        }

        if (node.children && Array.isArray(node.children)) {
          traverseNodes(node.children);
        }
      }
    };

    traverseNodes(contentObj.root.children);

    return embedProviders.join(',');
  }, []);

  useEffect(() => {
    if (!story?.id || !story?.fullPath) return;

    try {
      const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

      const relatedContentIds = Array.isArray(story?.relatedPosts)
        ? story.relatedPosts.map((rp: { value?: { id?: string } }) => rp.value?.id).filter(Boolean)
        : [];
      const relatedContentString = relatedContentIds.join(',');

      const federativeEntity =
        Array.isArray(story?.provinces) && story.provinces
          ? story.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
          : [];
      const federativeEntityString = federativeEntity.join(',');

      // Extract topics as comma-separated string for etiquetas
      const etiquetas =
        Array.isArray(story?.topics) && story.topics
          ? story.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
          : [];
      const etiquetasString = etiquetas.join(',').slice(0, MAX_FIREBASE_PARAM_LENGTH);

      // Extract author names as comma-separated string
      const authorNames =
        Array.isArray(story?.authors) && story.authors
          ? story.authors.map((a: { name?: string }) => a?.name).filter(Boolean)
          : [];
      const authorNamesString = authorNames.join(',');

      // Extract editorial authors (populatedAuthors) as comma-separated string
      const autorEditorial =
        Array.isArray(story?.populatedAuthors) && story.populatedAuthors
          ? story.populatedAuthors.map((a: { name?: string }) => a?.name).filter(Boolean)
          : [];
      const autorEditorialString = autorEditorial.join(',');

      const productionValue = [story?.channel?.title, story?.production?.title]
        .filter(Boolean)
        .join('_');

      const embedsString = extractEmbedsFromContent(story?.content);

      const analyticsPayload = {
        idPage: story.id,
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        screen_class: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        screen_page_web_url: currentSlug || 'undefined',
        screen_page_web_url_previous: previousSlug || 'undefined',
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
        etiquetas: etiquetasString || 'undefined',
        author: authorNamesString || 'undefined',
        Autor_Editorial: autorEditorialString || 'undefined',
        news_wires: story?.wire || 'undefined',
        Embeds: embedsString || 'undefined',
        Fecha_Publicacion_Texto: story?.publishedAt || 'undefined',
        opening_display_type: `${story?.openingType || ''}_${story?.displayType || 'undefined'}`,
        categories: story?.category?.title || 'undefined',
        federative_entity: federativeEntityString || 'undefined',
        related_content: relatedContentString,
        production: productionValue || 'undefined',
        content_title: story?.title || 'undefined'
      };

      AnalyticsService.logEvent('content_view', analyticsPayload);
      AppEventsLogger.logEvent('page_view', analyticsPayload);

      previousFullPathRef.current = story.fullPath;
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, [
    story?.id,
    story?.fullPath,
    story?.title,
    story?.publishedAt,
    story?.openingType,
    story?.displayType,
    story?.wire,
    story?.authors,
    story?.populatedAuthors,
    story?.category,
    story?.provinces,
    story?.topics,
    story?.relatedPosts,
    story?.channel,
    story?.production,
    story?.content,
    currentSlug,
    slugHistory,
    extractEmbedsFromContent
  ]);

  const handleCardPress = useCallback(
    (item: CarouselItem, index?: number) => {
      // Add analytics for recommended reports tap in text
      if (story?.id && item.id) {
        const cardType = item.type === 'video' ? 'Card_Style_1' : 'News_Card';
        const analyticsParams: SelectViewParams = {
          idPage: story.id,
          screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
          organisms: ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS,
          content_type:
            cardType === 'Card_Style_1'
              ? `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS.CARD_STYLE_1}${index !== undefined ? `|${index + 1}` : ''}`
              : `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS.NEWS_CARD}${index !== undefined ? `|${index + 1}` : ''}`,
          content_name: ANALYTICS_ATOMS.TAP_IN_TEXT,
          content_title: item.title || 'undefined',
          content_action: ANALYTICS_ATOMS.TAP_IN_TEXT
        };

        logSelectContentEvent(analyticsParams);
      }

      if (item.slug) {
        if (item.type === 'video') {
          navigation.navigate(routeNames.VIDEOS_STACK, {
            screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
            params: { slug: item.slug }
          });
        } else if (item.slug !== currentSlug) {
          setSlugHistory((prev) => [...prev, item.slug as string]);
        }
      }
    },
    [currentSlug, navigation, story?.id]
  );

  const handleBookmarkPress = useCallback(
    async (id: string, cardType?: 'Card_Style_1' | 'News_Card', index?: number) => {
      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }

      // Add analytics for bookmark/unbookmark action
      if (cardType && story?.id) {
        // Find the item to determine if it's being bookmarked or unbookmarked
        const allItems = [...videoItems, ...latestPostItems];
        const item = allItems.find((item) => item?.id === id);
        const isBookmarking = !item?.isBookmarked;

        const analyticsParams: SelectViewParams = {
          idPage: story.id,
          screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
          organisms: ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS,
          content_type:
            cardType === 'Card_Style_1'
              ? `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS.CARD_STYLE_1}${index !== undefined ? `|${index + 1}` : ''}`
              : `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.RECOMMENDED_REPORTS.NEWS_CARD}${index !== undefined ? `|${index + 1}` : ''}`,
          content_name: isBookmarking ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK,
          content_title: item?.title || 'undefined',
          content_action: isBookmarking ? ANALYTICS_ATOMS.BOOKMARK : ANALYTICS_ATOMS.UNBOOKMARK
        };

        logSelectContentEvent(analyticsParams);
      }

      await onToggleBookmark(id);
    },
    [onToggleBookmark, guestToken, videoItems, latestPostItems, story?.id]
  );

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([
        refetchStory({ slug: currentSlug }),
        refetchNPlusFocusShortListing({
          excludeId: storyId,
          mostViewed: true,
          limit: 6
        }),
        refetchAdvertisement()
      ]);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshLoader(true);
      await Promise.all([
        refetchStory({ slug: currentSlug }),
        refetchNPlusFocusShortListing({
          excludeId: storyId,
          mostViewed: true,
          limit: 6
        }),
        refetchHeader(),
        refetchAdvertisement()
      ]);
      setRefreshLoader(false);
    } catch {
      setRefreshLoader(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    onCategoryPress(category);
  };

  const getPlaybackTime = useCallback((videoId?: string) => {
    if (!videoId) return 0;
    return playbackTimes.current[videoId] || 0;
  }, []);

  const categoryPress = (item?: {
    id?: string;
    slug?: string;
    title?: string;
    type?: 'category' | 'topic';
  }) => {
    try {
      if (!item?.title) return;

      // Find topic index for analytics
      const topics = Array.isArray(story?.topics) ? story.topics : [];
      const topicIndex =
        topics.findIndex(
          (topic: { title?: string; id?: string }) =>
            topic.title === item.title || topic.id === item.id
        ) ?? -1;

      // Send SELECT_CONTENT event when topic pill is clicked
      if (topicIndex >= 0 && story?.id) {
        const analyticsParams: SelectViewParams = {
          idPage: story.id,
          screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.STORYPAGE}`,
          organisms: ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.TOPIC_CHIPS,
          content_type: `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.TOPIC_CHIPS.BASE_NAME}| ${topicIndex + 1}`,
          content_name: item?.title || `Topic-${topicIndex + 1}`,
          content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
          categories: item?.title,
          screen_page_web_url: item?.slug
        };

        logSelectContentEvent(analyticsParams);
      }

      navigation.navigate(routeNames.HOME_STACK, {
        screen: screenNames.CATEGORY_DETAIL_SCREEN,
        params: {
          id: item?.id || '',
          slug: item?.slug || '',
          title: item?.title || '',
          type: 'topic'
        }
      });
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  };

  return {
    story,
    error: storyError,
    loading: storyLoading,
    profileError,
    profileLoading,
    storyContent,
    handleCardPress,
    handleBookmarkPress,
    onToggleBookmark,
    activeVideoIndex,
    persistPlaybackTime,
    setActiveVideoIndex,
    videos,
    toggleJWPlayer,
    activeJWIndex,
    closeAudioPlayer,
    onPressingAuthor,
    setActiveJWIndex,
    toastMessage,
    toastType,
    setToastMessage,
    setShimmer,
    shimmer,
    isInternetConnection,
    setToastType,
    handleRetry,
    internetLoader,
    internetFail,
    headerLoading,
    categoriesList,
    handleCategoryPress,
    refreshLoader,
    onRefresh,
    videoItems,
    latestPostItems,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    showWebView,
    webUrl,
    handleWebViewClose,
    adConfig,
    currentSlug,
    previousSlug,
    getPlaybackTime,
    categoryPress
  } as const;
};
