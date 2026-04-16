import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import { AppEventsLogger } from 'react-native-fbsdk-next';

import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  getCategorySliderMolecule,
  getAuthorCardMolecule,
  getPillGroupMolecule,
  getRecommendedStoriesMolecule,
  getLatestNewsMolecule,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/utils/storyAnalyticsHelpers';
import { HomeStackParamList, RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { MY_PROFILE_DATA_QUERY } from '@src/graphql/main/MyAccount/queries';
import {
  LATEST_NEWS_QUERY,
  RECOMMENDED_STORIES_QUERY,
  STORY_BY_SLUG_QUERY
} from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { McpItem, VideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { CarouselItem, NewsItem } from '@src/models/main/Home/StoryPage/StoryPage';
import useUserStore from '@src/zustand/main/userStore';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { useHeaderViewModel } from '@src/viewModels/main/Home/StoryPage/Header/useHeaderViewModel';
import { BLOCK_TYPES } from '@src/views/organisms/Lexical/constants';
import { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';

export const useStoryViewModel = () => {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [toastMessage, setToastMessage] = useState<string>('');
  // Use a ref to store playback times for each video to avoid re-renders on every update
  const playbackTimes = useRef<Record<string, number>>({});
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [shimmer, setShimmer] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

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
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const { userId } = useAuthStore();
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);

  const closeAudioPlayer = useCallback(() => {
    setActiveJWIndex(false);
  }, [setActiveJWIndex]);

  const { slug: initialSlug } = route.params || {};

  const [slugHistory, setSlugHistory] = useState<string[]>([initialSlug]);
  const previousFullPathRef = useRef<string | undefined>(undefined);

  const currentSlug = slugHistory[slugHistory.length - 1];

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

  const storyId = storyData?.Post?.id ?? null;

  const {
    data: recommendedStoriesData,
    loading: recommendedStoriesLoading,
    error: recommendedStoriesError,
    refetch: refetchRecommended
  } = useQuery(RECOMMENDED_STORIES_QUERY, {
    variables: { limit: 2, isBookmarked: true, contentId: storyId },
    fetchPolicy: 'cache-and-network',
    skip: !storyId
  });

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError
  } = useQuery(MY_PROFILE_DATA_QUERY, {
    fetchPolicy: 'network-only',
    skip: !!userId
  });

  useEffect(() => {
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

  const {
    data: latestNewsData,
    loading: latestNewsLoading,
    error: latestNewsError,
    refetch: refetchLatestNews
  } = useQuery(LATEST_NEWS_QUERY, {
    variables: { limit: 10, contentId: storyId, isBookmarked: true, count: 2 },
    skip: !storyId,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  const { adConfig, refetchAdvertisement } = useAdvertisement();

  const story = useMemo(() => storyData?.Post ?? null, [storyData]);

  const toggleJWPlayer = useCallback(() => {
    try {
      if (isInternetConnection) {
        setActiveJWIndex(true);
        setAudioPlaying(true);
      } else {
        setToastType('error');
        setToastMessage(t('screens.splash.text.noInternetConnection'));
      }

      // Get content name from translation + readTime
      const listenText = t('screens.jwAudioPlayer.text.listenToThisArticle');
      const contentName = `${listenText}${story.readTime || ''} min`;
      const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.STORY_PAGE.INSIDE_NOTE,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.LISTEN_ARTICLE,
        contentName,
        currentSlug,
        previousSlug
      });
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }

    // Get content name from translation + readTime
    const listenText = t('screens.jwAudioPlayer.text.listenToThisArticle');
    const contentName = `${listenText}${story.readTime || ''} min`;
    const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

    logSelectContentEvent(story, {
      organism: ANALYTICS_ORGANISMS.STORY_PAGE.INSIDE_NOTE,
      molecule: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.LISTEN_ARTICLE,
      contentName,
      currentSlug,
      previousSlug
    });
  }, [
    isInternetConnection,
    setActiveJWIndex,
    setAudioPlaying,
    setToastType,
    setToastMessage,
    t,
    story,
    currentSlug,
    slugHistory
  ]);

  const headercategories = Array.isArray(navItems) ? navItems.map((item) => item?.label) : [];

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
        query: RECOMMENDED_STORIES_QUERY,
        variables: { limit: 2, isBookmarked: true, contentId: storyId }
      },
      {
        query: LATEST_NEWS_QUERY,
        variables: { input: { limit: 10, contentId: storyId } }
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

  /**
   * Extracts embed providers from story content
   * Recursively traverses the Lexical content structure to find all oEmbed blocks
   * @param content - The story content (can be string JSON or object)
   * @returns Comma-separated string of embed providers, or empty string if none found
   */
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

  const onToggleBookmark = useCallback(
    debounce(async (contentId: string) => {
      // Check if this is a recommended story bookmark and send analytics
      const recommendedStories = Array.isArray(recommendedStoriesData?.GetRecommendedStories?.data)
        ? recommendedStoriesData.GetRecommendedStories.data
        : [];
      const recommendedStoryIndex = recommendedStories.findIndex(
        (item: NewsItem) => item.id === contentId
      );
      const recommendedStory =
        recommendedStoryIndex >= 0 ? recommendedStories[recommendedStoryIndex] : null;

      // Send SELECT_CONTENT event when recommended story bookmark is clicked
      if (recommendedStory && recommendedStoryIndex >= 0) {
        const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';
        const isCurrentlyBookmarked = recommendedStory.isBookmarked ?? false;
        logSelectContentEvent(story, {
          organism: ANALYTICS_ORGANISMS.STORY_PAGE.RECOMMENDED_STORIES,
          molecule: getRecommendedStoriesMolecule(recommendedStoryIndex),
          contentName: recommendedStory.title || 'undefined',
          currentSlug,
          previousSlug,
          screenName: ANALYTICS_PAGE.STORYPAGE,
          tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
          contentAction: isCurrentlyBookmarked
            ? ANALYTICS_ATOMS.UNBOOKMARK
            : ANALYTICS_ATOMS.BOOKMARK
        });
      }

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
    [
      userData?._id,
      toggleBookmark,
      t,
      guestToken,
      story,
      recommendedStoriesData,
      currentSlug,
      slugHistory
    ]
  );

  const videos: VideoItem[] = useMemo(
    () =>
      Array.isArray(story?.mcpId)
        ? story.mcpId.map((item: McpItem) => ({
            ...item.value,
            title: item.value?.title ?? ''
          }))
        : [],
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

  const getPlaybackTime = useCallback((videoId?: string) => {
    if (!videoId) return 0;
    return playbackTimes.current[videoId] || 0;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const actionType = e.data?.action?.type;
      if (slugHistory.length > 1 && actionType === 'GO_BACK') {
        e.preventDefault();
        setSlugHistory((prev) => prev.slice(0, -1));
      }
    });

    return unsubscribe;
  }, [navigation, slugHistory]);

  useEffect(() => {
    if (!story?.id || !story?.fullPath) return;

    try {
      const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';

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
      const etiquetasString = etiquetas.join(',');

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
        screen_page_web_url: currentSlug || ANALYTICS_PAGE.STORYPAGE,
        screen_page_web_url_previous: previousSlug || 'undefined',
        screen_name: ANALYTICS_PAGE.STORYPAGE,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
        etiquetas: etiquetasString || 'undefined',
        author: authorNamesString || 'undefined',
        Autor_Editorial: autorEditorialString || 'undefined',
        news_wires: story?.wire || 'undefined',
        Embeds: embedsString || 'undefined',
        Fecha_Publicacion_Texto: story?.publishedAt || 'undefined',
        opening_display_type: `${story?.openingType || ''}_${story?.displayType || 'undefined'}`,
        categories: story?.category?.title || 'undefined',
        federative_entity: federativeEntityString || 'undefined',
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

  const onPressingAuthor = useCallback(
    (id: string, slug: string) => {
      try {
        // Find author index and name for analytics
        const authors = Array.isArray(story?.authors) ? story.authors : [];
        const authorIndex = authors.findIndex((author: { id?: string }) => author.id === id) ?? -1;
        const author = authors.find((author: { id?: string }) => author.id === id);
        const authorName = author?.name || 'undefined';

        // Send SELECT_CONTENT event when author is clicked
        if (authorIndex >= 0) {
          const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';
          logSelectContentEvent(story, {
            organism: ANALYTICS_ORGANISMS.STORY_PAGE.AUTHOR_CARD,
            molecule: getAuthorCardMolecule(authorIndex, authorName),
            contentName: authorName,
            currentSlug,
            previousSlug,
            screenName: ANALYTICS_PAGE.STORYPAGE,
            tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
            contentAction: ANALYTICS_ATOMS.TAP
          });
        }

        navigation.navigate(routeNames.HOME_STACK, {
          screen: screenNames.AUTHOR_DETAILS,
          params: { id, userId: story.id, slug }
        });
        setActiveJWIndex(false);
      } catch {
        setToastType('error');
        setToastMessage(t('screens.login.text.somethingWentWrong'));
      }
    },
    [
      navigation,
      story,
      currentSlug,
      slugHistory,
      setToastType,
      setToastMessage,
      t,
      setActiveJWIndex
    ]
  );

  const handleCardPress = useCallback(
    (item: CarouselItem) => {
      try {
        const latestNews = latestNewsData?.GetLatestNews?.data ?? [];
        // Find item index for analytics (if it's from latest news)
        const latestNewsIndex = latestNews.findIndex(
          (newsItem: NewsItem) => newsItem.id === item.id || newsItem.slug === item.slug
        );

        // Send SELECT_CONTENT event when latest news item is clicked
        if (latestNewsIndex >= 0) {
          const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';
          logSelectContentEvent(story, {
            organism: ANALYTICS_ORGANISMS.STORY_PAGE.LATEST_NEWS,
            molecule: getLatestNewsMolecule(latestNewsIndex),
            contentName: item.title || 'undefined',
            currentSlug,
            previousSlug,
            screenName: ANALYTICS_PAGE.STORYPAGE,
            tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
            contentAction: ANALYTICS_ATOMS.TAP_IN_TEXT
          });
        }

        if (item.slug && item.slug !== currentSlug) {
          if (item.type === 'videos') {
            navigation.navigate(routeNames.VIDEOS_STACK, {
              screen: screenNames.VIDEO_DETAIL_PAGE,
              params: { slug: item.slug }
            });
          } else {
            setSlugHistory((prev) => [...prev, item.slug!]);
          }
        }
      } catch {
        setToastType('error');
        setToastMessage(t('screens.login.text.somethingWentWrong'));
      }
    },
    [
      currentSlug,
      navigation,
      story,
      latestNewsData,
      slugHistory,
      setToastType,
      setToastMessage,
      t,
      setSlugHistory
    ]
  );

  const onHistoryRecommendationPress = useCallback(
    (item: NewsItem) => {
      try {
        // Find item index for analytics
        const recommendedStories = Array.isArray(
          recommendedStoriesData?.GetRecommendedStories?.data
        )
          ? recommendedStoriesData.GetRecommendedStories.data
          : [];
        const itemIndex = recommendedStories.findIndex(
          (story: NewsItem) => story.id === item.id || story.slug === item.slug
        );

        // Send SELECT_CONTENT event when recommended story is clicked
        if (itemIndex >= 0) {
          const previousSlug =
            slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
          logSelectContentEvent(story, {
            organism: ANALYTICS_ORGANISMS.STORY_PAGE.RECOMMENDED_STORIES,
            molecule: getRecommendedStoriesMolecule(itemIndex),
            contentName: item.title || '',
            currentSlug,
            previousSlug,
            screenName: ANALYTICS_PAGE.STORYPAGE,
            tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
            contentAction: ANALYTICS_ATOMS.TAP_IN_TEXT
          });
        }

        if (item?.slug && item.slug !== currentSlug) {
          if (item.collection === 'videos') {
            navigation.navigate(routeNames.VIDEOS_STACK, {
              screen: screenNames.VIDEO_DETAIL_PAGE,
              params: { slug: item.slug }
            });
          } else {
            setSlugHistory((prev) => [...prev, item.slug!]);
          }
        }
      } catch {
        setToastType('error');
        setToastMessage(t('screens.login.text.somethingWentWrong'));
      }
    },
    [
      currentSlug,
      navigation,
      story,
      recommendedStoriesData,
      slugHistory,
      setToastType,
      setToastMessage,
      t,
      setSlugHistory
    ]
  );

  const handleBookmarkPress = useCallback(
    async (item: CarouselItem) => {
      try {
        const latestNews = latestNewsData?.GetLatestNews?.data ?? [];
        const latestNewsIndex = latestNews.findIndex(
          (newsItem: NewsItem) => newsItem.id === item.id || newsItem.slug === item.slug
        );

        // Send SELECT_CONTENT event when latest news bookmark is clicked
        if (latestNewsIndex >= 0) {
          const previousSlug =
            slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
          const isCurrentlyBookmarked = item.isBookmarked ?? false;
          logSelectContentEvent(story, {
            organism: ANALYTICS_ORGANISMS.STORY_PAGE.LATEST_NEWS,
            molecule: getLatestNewsMolecule(latestNewsIndex),
            contentName: item.title || 'undefined',
            currentSlug,
            previousSlug,
            screenName: ANALYTICS_PAGE.STORYPAGE,
            tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
            contentAction: isCurrentlyBookmarked
              ? ANALYTICS_ATOMS.UNBOOKMARK
              : ANALYTICS_ATOMS.BOOKMARK
          });
        }

        if (guestToken) {
          setBookmarkModalVisible(true);
          return;
        }
        await onToggleBookmark(item.id);
      } catch {
        setToastType('error');
        setToastMessage(t('screens.login.text.somethingWentWrong'));
      }
    },
    [
      onToggleBookmark,
      guestToken,
      setToastType,
      setToastMessage,
      t,
      setBookmarkModalVisible,
      latestNewsData,
      slugHistory,
      story,
      currentSlug
    ]
  );

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await Promise.all([
        refetchStory({ slug: currentSlug }),
        refetchRecommended({ limit: 2, isBookmarked: true, contentId: story?.id }),
        story?.id
          ? refetchLatestNews({ input: { limit: 10, count: 2, contentId: story.id } })
          : Promise.resolve(),
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
        refetchRecommended({ limit: 2, isBookmarked: true, contentId: story?.id }),
        refetchHeader(),
        story?.id
          ? refetchLatestNews({ input: { limit: 10, count: 2, contentId: story.id } })
          : Promise.resolve(),
        refetchAdvertisement()
      ]);
      setRefreshLoader(false);
    } catch {
      setRefreshLoader(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    try {
      const currentCategory = story?.category?.title;
      if (category === currentCategory) {
        return;
      }
      // Send SELECT_CONTENT event when category is clicked
      const categoryIndex = categoriesList.findIndex((cat) => cat === category);
      if (categoryIndex >= 0) {
        const previousSlug =
          slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
        logSelectContentEvent(story, {
          organism: ANALYTICS_ORGANISMS.STORY_PAGE.CATEGORY_SLIDER,
          molecule: getCategorySliderMolecule(categoryIndex),
          contentName: category,
          currentSlug,
          previousSlug,
          tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
          contentAction: ANALYTICS_ATOMS.TAP,
          screenName: ANALYTICS_PAGE.STORYPAGE
        });
      }
      onCategoryPress(category);
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  };

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
      if (topicIndex >= 0) {
        const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : '';
        logSelectContentEvent(story, {
          organism: ANALYTICS_ORGANISMS.STORY_PAGE.PILL_GROUP,
          molecule: getPillGroupMolecule(topicIndex),
          contentName: item.title,
          currentSlug,
          previousSlug,
          screenName: ANALYTICS_PAGE.STORYPAGE,
          tipoContenido: `${ANALYTICS_COLLECTION.STORYPAGE}_${ANALYTICS_PAGE.STORYPAGE}`,
          contentAction: ANALYTICS_ATOMS.TAP
        });
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

  const previousSlug = slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';

  return {
    story,
    error: storyError,
    loading: storyLoading,
    latestNewsError,
    latestNewsLoading,
    profileError,
    profileLoading,
    storyContent,
    latestNews: latestNewsData?.GetLatestNews?.data ?? [],
    handleCardPress,
    handleBookmarkPress,
    onToggleBookmark,
    getPlaybackTime,
    activeVideoIndex,
    persistPlaybackTime,
    setActiveVideoIndex,
    videos,
    toggleJWPlayer,
    activeJWIndex,
    closeAudioPlayer,
    setActiveJWIndex,
    onPressingAuthor,
    recommendedStoriesData,
    recommendedStoriesError,
    recommendedStoriesLoading,
    toastMessage,
    toastType,
    setToastMessage,
    onHistoryRecommendationPress,
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
    showWebView,
    webUrl,
    handleWebViewClose,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    categoryPress,
    currentSlug,
    previousSlug,
    adConfig
  } as const;
};
