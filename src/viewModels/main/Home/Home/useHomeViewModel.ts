import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  useColorScheme
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloQueryResult, useMutation } from '@apollo/client';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigation/types';
import useAuthStore from '@src/zustand/auth/authStore';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import {
  HOMEPAGE_OPINION_QUERY,
  HOMEPAGE_SPECIAL_CONTENT_QUERY
} from '@src/graphql/main/home/queries';
import useSpecialSectionTwoViewModel from '@src/viewModels/main/Home/Home/useSpecialSectionTwoViewModel';
import { ExclusiveItem } from '@src/models/main/Videos/Videos';
import { SCREEN_HEIGHT } from '@src/utils/pixelScaling';
import useNetworkStore from '@src/zustand/networkStore';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { useTheme } from '@src/hooks/useTheme';
import constants from '@src/config/constants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { indigitallService } from '@src/services/pushNotification/IndigitallService';

/**
 * useHomeViewModel
 *
 * This hook returns various state and functions related to home screen.
 *
 * It returns translation function, navigation, guestToken, bookmarkModalVisible, isToggleBookmark, toastType, toastMessage, setToastMessage,
 * onExclusivePress, isReelMode, setReelMode, selectedExclusiveIndex, setSelectedExclusiveIndex, activeExclusiveIndex, setActiveExclusiveIndex,
 * onMomentumScrollEnd, data, and screenHeight.
 *
 * @returns {Object} - An object containing various state and functions related to home screen.
 */

type ApolloRefetchFn<T = unknown> = () => Promise<ApolloQueryResult<T>>;

type NavigationWithSetOptions = NavigationProp<RootStackParamList> & {
  setOptions: (options: { tabBarStyle?: object }) => void;
};

// Types for cache query results
type ContentItem = {
  id?: string;
  isBookmarked?: boolean;
  [key: string]: unknown;
};

type HomepageOpinionData = {
  HomepageOpinion?: ContentItem[];
};

type HomepageSpecialContentData = {
  HomepageSpecialContent?: {
    principal?: ContentItem[];
    secondary?: ContentItem[];
    carousel?: ContentItem[];
    highlighted?: ContentItem;
    videos?: ContentItem[];
    [key: string]: unknown;
  };
};

const useHomeViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [theme, selectedTheme] = useTheme();
  const colorScheme = useColorScheme();
  const { guestToken } = useAuthStore();
  const { setShouldPause } = useLiveTVStore();
  const isFocused = useIsFocused();
  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('main-homepage');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const [toggleBookmarkMutation] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });
  const { data } = useSpecialSectionTwoViewModel();
  const [isReelMode, setReelMode] = useState<boolean>(false);
  const [selectedExclusiveIndex, setSelectedExclusiveIndex] = useState<number>(0);
  const [activeExclusiveIndex, setActiveExclusiveIndex] = useState<number>(
    selectedExclusiveIndex ?? 0
  );

  const { isInternetConnection } = useNetworkStore();

  const currentTheme =
    selectedTheme == 'system'
      ? colorScheme == 'dark'
        ? constants.DARK
        : constants.LIGHT
      : selectedTheme;

  useEffect(() => {
    setActiveExclusiveIndex(selectedExclusiveIndex ?? 0);
  }, [selectedExclusiveIndex]);

  const { height: physicalScreenHeight } = Dimensions.get('screen');
  const screenHeight = physicalScreenHeight || SCREEN_HEIGHT;

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / screenHeight);
      setActiveExclusiveIndex(idx);
    },
    [screenHeight]
  );

  useEffect(() => {
    (navigation as NavigationWithSetOptions).setOptions({
      tabBarStyle: isReelMode
        ? { display: 'none' }
        : {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            paddingBottom: 0,
            position: 'absolute'
          }
    });

    return () => {
      (navigation as NavigationWithSetOptions).setOptions({
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          position: 'absolute'
        }
      });
    };
  }, [isReelMode, navigation]);

  const onExclusivePress = useCallback(
    (item: ExclusiveItem) => {
      const list = data?.videos ?? [];
      const idx = list.findIndex((v: ExclusiveItem) => v?.id === item?.id);
      setSelectedExclusiveIndex(idx >= 0 ? idx : 0);
      setShouldPause(true); // Pause Live TV when entering reel mode
      setTimeout(() => setReelMode(true), 50);
    },
    [data, setShouldPause]
  );

  useEffect(() => {
    if (isReelMode) {
      StatusBar.setHidden(true, 'fade');
      StatusBar.setTranslucent?.(true);
      StatusBar.setBackgroundColor?.('transparent', true);
    } else {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setTranslucent?.(false);
      setShouldPause(false); // Resume Live TV when exiting reel mode
    }
    return () => {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setTranslucent?.(false);
    };
  }, [isReelMode, navigation, setShouldPause]);

  // Reset Live TV pause state when Home screen becomes focused
  useEffect(() => {
    if (isFocused) {
      setShouldPause(false); // Allow Live TV to resume when back on Home screen
    }
  }, [isFocused, setShouldPause]);

  const refetchers = useRef<ApolloRefetchFn[]>([]);

  /**
   * Registers a new ApolloRefetchFn in the list of refetchers.
   * @param {fn: ApolloRefetchFn} The new ApolloRefetchFn to register.
   */

  const registerRefetch = useCallback((fn: ApolloRefetchFn) => {
    refetchers.current.push(fn);
    refetchAdvertisement();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([...refetchers.current.map((fn) => fn()), refetchAdvertisement()]);
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    } finally {
      setRefreshing(false);
    }
  }, [t, refetchAdvertisement]);

  const handleBookmarkPress = useCallback(
    async (contentId?: string, eventPayload?: unknown) => {
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
          },
          update: (cache, { data: mutationData }) => {
            if (!mutationData?.toggleBookmark?.success) return;

            const newBookmarkState = mutationData.toggleBookmark.isBookmarked;

            // Helper function to update isBookmarked in an array
            const updateBookmarkInArray = (
              items: ContentItem[] | null | undefined
            ): ContentItem[] | null | undefined => {
              if (!items || !Array.isArray(items)) return items;
              return items.map((item) =>
                item?.id === contentId ? { ...item, isBookmarked: newBookmarkState } : item
              );
            };

            // Update HOMEPAGE_OPINION_QUERY
            try {
              const opinionData = cache.readQuery<HomepageOpinionData>({
                query: HOMEPAGE_OPINION_QUERY,
                variables: { isBookmarked: true }
              });
              if (opinionData?.HomepageOpinion && Array.isArray(opinionData.HomepageOpinion)) {
                const updatedOpinions = updateBookmarkInArray(opinionData.HomepageOpinion);
                if (updatedOpinions !== opinionData.HomepageOpinion) {
                  cache.writeQuery<HomepageOpinionData>({
                    query: HOMEPAGE_OPINION_QUERY,
                    variables: { isBookmarked: true },
                    data: {
                      HomepageOpinion: updatedOpinions as ContentItem[]
                    }
                  });
                }
              }
            } catch {
              // Query might not be in cache, skip
            }

            // Update HOMEPAGE_SPECIAL_CONTENT_QUERY for each section
            const sections = ['section_1', 'section_4', 'section_7', 'section_3'];
            sections.forEach((section) => {
              try {
                const specialContentData = cache.readQuery<HomepageSpecialContentData>({
                  query: HOMEPAGE_SPECIAL_CONTENT_QUERY,
                  variables: { section, isBookmarked: true }
                });
                if (specialContentData?.HomepageSpecialContent) {
                  const content = specialContentData.HomepageSpecialContent;
                  const updatedPrincipal = updateBookmarkInArray(content.principal);
                  const updatedSecondary = updateBookmarkInArray(content.secondary);
                  const updatedCarousel = updateBookmarkInArray(content.carousel);
                  const updatedVideos = updateBookmarkInArray(content.videos);
                  const updatedHighlighted =
                    content.highlighted?.id === contentId
                      ? { ...content.highlighted, isBookmarked: newBookmarkState }
                      : content.highlighted;

                  // Only write if something changed
                  if (
                    updatedPrincipal !== content.principal ||
                    updatedSecondary !== content.secondary ||
                    updatedCarousel !== content.carousel ||
                    updatedVideos !== content.videos ||
                    updatedHighlighted !== content.highlighted
                  ) {
                    cache.writeQuery<HomepageSpecialContentData>({
                      query: HOMEPAGE_SPECIAL_CONTENT_QUERY,
                      variables: { section, isBookmarked: true },
                      data: {
                        HomepageSpecialContent: {
                          ...content,
                          principal: updatedPrincipal as ContentItem[] | undefined,
                          secondary: updatedSecondary as ContentItem[] | undefined,
                          carousel: updatedCarousel as ContentItem[] | undefined,
                          highlighted: updatedHighlighted as ContentItem | undefined,
                          videos: updatedVideos as ContentItem[] | undefined
                        }
                      }
                    });
                  }
                }
              } catch {
                // Query might not be in cache, skip
              }
            });
          }
        });

        if (result.data?.toggleBookmark?.success) {
          setIsToggleBookmark(!isToggleBookmark);
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

        if (eventPayload) {
          if (result?.data?.toggleBookmark?.isBookmarked) {
            logSelectContentEvent({ ...eventPayload, content_action: ANALYTICS_ATOMS.BOOKMARK });
          } else {
            logSelectContentEvent({ ...eventPayload, content_action: ANALYTICS_ATOMS.UNBOOKMARK });
          }
        }
      } catch {
        setToastType('error');
        setToastMessage(t('screens.storyPage.author.failedToUpdateBookmark'));
      }
    },
    [guestToken, toggleBookmarkMutation, isToggleBookmark, t]
  );

  const onRetry = useCallback(async () => {
    if (!isInternetConnection) return;

    try {
      setRefreshing(true);
      await Promise.allSettled([...refetchers.current.map((fn) => fn()), refetchAdvertisement()]);
    } finally {
      setRefreshing(false);
    }
  }, [isInternetConnection, refetchAdvertisement]);

  const goToDummyHomePress = useCallback(() => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.DUMMY_HOME
    });
  }, [navigation]);

  useEffect(() => {
    logContentViewEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      idPage: ANALYTICS_PAGE.HOME_PAGE,
      screen_page_web_url: ANALYTICS_PAGE.HOME_PAGE
    });
  }, []);

  useEffect(() => {
    // Manually trigger notification permission when reaching Home
    const timer = indigitallService.requestPermission();

    // Cleanup timeout on unmount to prevent memory leaks and unexpected UI prompts if user navigates away quickly
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return {
    t,
    theme,
    currentTheme,
    goToDummyHomePress,
    handleBookmarkPress,
    toastMessage,
    toastType,
    setToastMessage,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    refreshing,
    onRefresh,
    registerRefetch,
    onExclusivePress,
    isReelMode,
    setReelMode,
    selectedExclusiveIndex,
    setSelectedExclusiveIndex,
    activeExclusiveIndex,
    setActiveExclusiveIndex,
    onMomentumScrollEnd,
    data,
    screenHeight,
    isInternetConnection,
    onRetry,
    showBannerAds,
    refetchAdvertisement
  };
};

export default useHomeViewModel;
