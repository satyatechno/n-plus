import { useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Share } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';
import {
  GET_USER_CONTINUE_VIDEOS,
  N_PLUS_FOCUS_INTERACTIVES_QUERY,
  NPLUS_FOCUS_INVESTIGATIONS_QUERY,
  NPLUS_FOCUS_LANDING_PAGE,
  NPLUS_FOCUS_SHORT_REPORTS_QUERY
} from '@src/graphql/main/videos/queries';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import useAdvertisement from '@src/hooks/useAdvertisement';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { VideoItem, ContinueWatchingVideo } from '@src/models/main/Videos/Videos';
import { InvestigationItem } from '@src/models/main/Videos/NPlusFocus';
import { DELETE_VIDEO_MUTATION } from '@src/graphql/main/videos/mutations';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE
} from '@src/utils/analyticsConstants';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import { HorizontalInfoItem } from '@src/views/organisms/HorizontalInfoList';

/**
 * useNPlusFocusLandingViewModel
 *
 * This hook provides a view model for the NPlus Focus landing page.
 * It exposes the following properties:
 * - goBack: a function to go back to the previous screen
 * - theme: the current theme
 * - flatListRef: a reference to the FlatList component
 * - data: the data retrieved from the GraphQL query
 * - isInternetConnection: a boolean indicating whether the device has an internet connection
 * - toastType: the type of the toast message to display
 * - setToastType: a function to set the type of the toast message to display
 * - toastMessage: the message to display in the toast
 * - setToastMessage: a function to set the message to display in the toast
 * - isToggleBookmark: a boolean indicating whether the article is bookmarked
 * - setIsToggleBookmark: a function to set whether the article is bookmarked
 * - toggleBookmarkMutation: a mutation to toggle the bookmark of an article
 * - handleBookmarkPress: a function to handle the bookmark press event
 */

const useNPlusFocusLandingViewModel = () => {
  const [theme] = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToggleBookmark, setIsToggleBookmark] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isHeroCardBookmarked, setIsHeroCardBookmarked] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchAllData();
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    } finally {
      setRefreshing(false);
    }
  };

  const {
    data,
    loading: nplusFocusLandingPageLoading,
    refetch: refetchNplusFocusLandingPage
  } = useQuery(NPLUS_FOCUS_LANDING_PAGE, {
    fetchPolicy: 'network-only'
  });

  const {
    data: continueVideoData,
    refetch: refetchContinueVideos,
    loading: continueVideoLoading,
    fetchMore
  } = useQuery(GET_USER_CONTINUE_VIDEOS, {
    fetchPolicy: 'network-only',
    variables: { limit: 10, isBookmarked: true, nextCursor: null }
  });

  const {
    data: nPlusFocusData,
    loading: nPlusFocusLoading,
    refetch: refetchNPlusFocus
  } = useQuery(N_PLUS_FOCUS_INTERACTIVES_QUERY, {
    fetchPolicy: 'network-only'
  });
  const {
    data: nPlusFocusInvestigationsData,
    loading: nPlusFocusInvestigationsLoading,
    refetch: refetchNPlusFocusInvestigations
  } = useQuery(NPLUS_FOCUS_INVESTIGATIONS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: nPlusFocusShortReportsData,
    loading: nPlusFocusShortReportsLoading,
    refetch: refetchNPlusFocusShortReports
  } = useQuery(NPLUS_FOCUS_SHORT_REPORTS_QUERY, {
    fetchPolicy: 'network-only'
  });

  const { shouldShowBannerAds, refetchAdvertisement } = useAdvertisement();
  const showBannerAds = shouldShowBannerAds('nplus-focus');

  const refetchAllData = async () => {
    await Promise.allSettled([
      refetchNplusFocusLandingPage(),
      refetchContinueVideos({ isBookmarked: true }),
      refetchNPlusFocus(),
      refetchNPlusFocusInvestigations(),
      refetchNPlusFocusShortReports(),
      refetchAdvertisement()
    ]);
  };

  const nPlusFocusDocs = nPlusFocusData?.NPlusFocusInteractives?.docs ?? [];

  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION);

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

  useEffect(() => {
    try {
      logContentViewEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
        content_title: SCREEN_PAGE_WEB_URL.NPLUS_FOCUS_LANDING_PAGE,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.NPLUS_FOCUS_LANDING_PAGE,
        idPage: ANALYTICS_ID_PAGE.NPLUS_FOCUS_LANDING
      });
    } catch {
      // Silently handle analytics error to prevent app crashes
    }
  }, []);

  const handleVideoPress = (
    item: { slug: string; platform?: string; fullPath?: string; title?: string; id?: string },
    index: number
  ) => {
    // Analytics event for continue watching card tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.CONTINUE_WATCHING,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD} |${index + 1}`,
      content_name: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      content_title: item?.title,
      idPage: String(item?.id),
      screen_page_web_url: item?.slug
    });

    if (item?.platform === 'website' && item?.fullPath) {
      setWebUrl(Config.WEBSITE_BASE_URL + item.fullPath);
      setShowWebView(true);
      return;
    }

    const matchedVideo = continueVideoData?.getUserContinueVideos?.videos?.find(
      (video: { slug: string }) => video?.slug === item?.slug
    );

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug: item?.slug,
        timeWatched: matchedVideo?.timeWatched ?? 0
      }
    });
  };

  const handleMenuPress = (data: { id: string; isBookmarked: boolean; title: string }) => {
    // Analytics event for continue watching 3 dots tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS,
      content_name: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS,
      content_action: ANALYTICS_ATOMS.MENU_DOTS,
      idPage: String(data?.id),
      content_title: data?.title
    });

    setIsToggleBookmark(data?.isBookmarked);
    const video = continueVideoData?.getUserContinueVideos?.videos?.find(
      (item: { id: string }) => item?.id === data?.id
    );

    if (video) {
      setSelectedVideo(video);
      setIsModalVisible(true);
    }
  };

  const bookmarkedContent = data?.NPlusFocusLanding?.docs?.id;

  const { data: bookmarkData } = useQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    variables: { contentId: bookmarkedContent, type: 'Content' },
    fetchPolicy: 'cache-and-network'
  });
  const isBookmarkedByUser = bookmarkData?.isBookmarkedByUser ?? false;

  const [toggleBookmarkMutation, { data: bookmarkedData }] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (bookmarkData) {
      setIsToggleBookmark(isBookmarkedByUser);
      setIsHeroCardBookmarked(isBookmarkedByUser);
    }
  }, [isBookmarkedByUser, bookmarkData]);

  const handleBookmarkPress = async (
    contentId?: string,
    isContinueWatching: boolean = false,
    isShortReport: boolean = false,
    itemData?:
      | { id: string; isBookmarked: boolean; title?: string; slug?: string }
      | VideoItem
      | ContinueWatchingVideo
      | { id: string; title?: string; slug?: string } // CarouselItem type
  ) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    if (!contentId) return;

    // Get current bookmark state based on context
    const isCurrentlyBookmarked = isContinueWatching
      ? ((itemData as ContinueWatchingVideo)?.isBookmarked ?? false)
      : isShortReport
        ? ((itemData as { id: string; title?: string; slug?: string; isBookmarked?: boolean })
            ?.isBookmarked ?? false)
        : (data?.NPlusFocusLanding?.docs?.isBookmarked ?? false);

    // Analytics event based on context
    if (isContinueWatching) {
      // Continue watching bookmark/unbookmark analytics
      const continueVideo = itemData as ContinueWatchingVideo;

      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.CONTINUE_WATCHING,
        content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_BOOKMARK,
        content_name: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
        content_action: isCurrentlyBookmarked
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK,
        content_title: continueVideo?.title || '',
        idPage: String(continueVideo?.id),
        screen_page_web_url: continueVideo?.slug
      });
    } else if (isShortReport) {
      // Short reports bookmark/unbookmark analytics
      const shortReport = itemData as {
        id: string;
        title?: string;
        slug?: string;
        collection?: string;
      };

      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.SHORT_REPORTS_VIDEOS,
        content_type:
          shortReport?.collection === 'videos'
            ? ANALYTICS_MOLECULES.VIDEOS.SHORT_NOTES_X3
            : ANALYTICS_MOLECULES.VIDEOS.POST_SHORTS_NOTES_X3,
        content_name: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
        content_action: isCurrentlyBookmarked
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK,
        content_title: shortReport?.title || '',
        idPage: String(shortReport?.id),
        screen_page_web_url: shortReport?.slug
      });
    } else {
      // Hero card bookmark/unbookmark analytics
      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
        organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
        content_type: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_HERO_BOOKMARK,
        content_name: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
        content_action: isCurrentlyBookmarked
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK,
        content_title: data?.NPlusFocusLanding?.docs?.title,
        idPage: String(data?.NPlusFocusLanding?.docs?.id),
        screen_page_web_url: data?.NPlusFocusLanding?.docs?.slug
      });
    }

    try {
      const response = await toggleBookmarkMutation({
        variables: {
          input: {
            contentId,
            type: 'Content'
          }
        }
      });
      setIsToggleBookmark(!isToggleBookmark);
      setIsHeroCardBookmarked(!isHeroCardBookmarked);
      setToastType('success');
      setToastMessage(response?.data?.toggleBookmark?.message);
    } catch {
      setToastType('error');
      setToastMessage(bookmarkedData?.toggleBookmark?.message);
    }
    refetchContinueVideos({ isBookmarked: true });
  };

  const handleCloseModal = () => {
    // Analytics event for continue watching 3 dots closed tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_CLOSED,
      content_name: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_CLOSED,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setIsModalVisible(false);
  };

  const handleSharePress = async () => {
    // Analytics event for continue watching 3 dots share tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.LIVE_BLOGS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_SHARE,
      content_name: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_SHARE,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });

    await Share.share({
      message: selectedVideo?.title ?? ''
    });
    setIsModalVisible(false);
  };

  const handleRemovePress = async () => {
    if (!selectedVideo?.id) return;

    // Analytics event for continue watching 3 dots remove from list tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_REMOVE_FROM_LIST,
      content_name: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_3_DOTS_REMOVE_FROM_LIST,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });

    setIsModalVisible(false);
    await deleteVideo({
      variables: { videoId: selectedVideo.id }
    });

    setToastType('success');
    setToastMessage(t('screens.videos.text.videoHasBeenRemoved'));
    refetchContinueVideos();
  };

  const goBack = () => {
    // Analytics event for back button tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.HEADER_DARK_THEME,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.BUTTON_BACK,
      content_name: ANALYTICS_ATOMS.BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const handleSeeAllPress = () => {
    // Analytics event for "Button see all investigation" tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ALL_THE_INVESTIGATION,
      content_type: ANALYTICS_MOLECULES.VIDEOS.SEE_ALL_INVESTIGATION,
      content_name: ANALYTICS_MOLECULES.VIDEOS.SEE_ALL_INVESTIGATION,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_LISTING_SCREEN
    });
  };

  const goToInvestigationDetailScreen = (slug: string, data: InvestigationItem) => {
    if (!slug) return;
    // Analytics event for hero card "Start to see" tap
    logSelectContentEvent({
      idPage: String(data?.id),
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
      content_type: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_HERO_START_TO_SEE,
      content_name: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_HERO_START_TO_SEE,
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: slug,
      content_title: data?.title
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug
      }
    });
  };

  const handleInvestigationCardPress = (slug: string, index: number) => {
    if (!slug) return;

    // Analytics event for "Investigation card x5" tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ALL_THE_INVESTIGATION,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.VIDEO_CARD} |${index}`,
      content_name: ANALYTICS_MOLECULES.VIDEOS.VIDEO_CARD,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug
      }
    });
  };

  const goToInteractiveListingScreen = () => {
    // Analytics event for "See all" button tap in interactives section
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INTERACTIVOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.INTERACTIVES,
      content_type: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_CTA_SECTION,
      content_name: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_CTA_SECTION,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INTERACTIVE_LISTING
    });
  };

  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const handleInteractiveResearchPress = (item: HorizontalInfoItem, index: number) => {
    const firstLink = item?.fullPath || item?.interactiveUrl;

    if (!firstLink) return;

    // Analytics event for interactive card tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INTERACTIVOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.INTERACTIVES,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.PRINCIPAL_INTERACTIVE_CARD} | ${index + 1}`,
      content_name: ANALYTICS_MOLECULES.VIDEOS.PRINCIPAL_INTERACTIVE_CARD,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(item?.id),
      screen_page_web_url: item?.slug,
      content_title: item?.title
    });

    const url = Config.WEBSITE_BASE_URL + firstLink;

    if (url) {
      setWebUrl(url);
      setShowWebView(true);
    }
  };

  const handleViewInteractivePress = (item: { fullPath?: string }) => {
    const firstLink = item?.fullPath;

    if (!firstLink) return;

    // Analytics event for "View Interactive" button tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INTERACTIVOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.INTERACTIVES,
      content_type: ANALYTICS_MOLECULES.VIDEOS.INTERACTIVE_CONTENT_CARD,
      content_name: ANALYTICS_MOLECULES.VIDEOS.INTERACTIVE_CONTENT_CARD,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });

    const url = Config.WEBSITE_BASE_URL + firstLink;

    if (url) {
      setWebUrl(url);
      setShowWebView(true);
    }
  };

  const seeAllShortInvestigationReports = () => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.SHORT_REPORTS_VIDEOS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.SEE_ALL_SHORT_REPORTS,
      content_name: ANALYTICS_MOLECULES.VIDEOS.SEE_ALL_SHORT_REPORTS,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });
    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.SHORT_INVESTIGATIONS
    });
  };

  const goToDetailScreen = (slug: string, index: number) => {
    // Analytics event for "Short notes x3" tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.SHORT_REPORTS_VIDEOS,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.SHORT_NOTES_X3} |${index + 1}`,
      content_name: ANALYTICS_MOLECULES.VIDEOS.SHORT_NOTES_X3,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      idPage: String(selectedVideo?.id),
      screen_page_web_url: selectedVideo?.slug,
      content_title: selectedVideo?.title
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: { slug }
    });
  };

  const goToShortReportsScreen = (
    slug: string,
    index: number,
    item: { id?: string; slug?: string; title?: string }
  ) => {
    // Analytics event for "Related notes x3" tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.SHORT_REPORTS_VIDEOS,
      content_type: `${ANALYTICS_MOLECULES.VIDEOS.RELATED_NOTES_X3} |${index + 1}`,
      content_name: ANALYTICS_MOLECULES.VIDEOS.RELATED_NOTES_X3,
      content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
      idPage: String(item?.id),
      screen_page_web_url: item?.slug,
      content_title: item?.title
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN,
      params: { slug }
    });
  };

  const handleSearchPress = () => {
    // Analytics event for search button tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.HOME}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.HEADER_DARK_THEME,
      content_type: ANALYTICS_MOLECULES.EPISODE_DETAIL_PAGE.HEADER.SEARCH,
      content_name: ANALYTICS_ATOMS.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const handleContinueWatchingSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    // Avoid firing on small accidental scrolls
    if (offsetX <= 0) return;

    logSelectContentEvent({
      screen_name: 'Home N+ Focus',
      Tipo_Contenido: 'Producers_Home N+ Focus',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.CONTINUE_WATCHING,
      content_type: ANALYTICS_MOLECULES.VIDEOS.CONTINUE_WATCHING_CARD_1,
      content_name: 'Swipe',
      content_action: 'swipe'
    });
  };

  const handleInteractiveSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    if (offsetX <= 0) return;

    logSelectContentEvent({
      screen_name: 'Home N+ Focus',
      Tipo_Contenido: 'Producers_Home N+ Focus',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.INTERACTIVES,
      content_type: ANALYTICS_MOLECULES.VIDEOS.INTERACTIVE_CONTENT_CARD,
      content_name: 'Swipe',
      content_action: 'swipe'
    });
  };

  const handleInvestigationsSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    if (offsetX <= 0) return;

    logSelectContentEvent({
      screen_name: 'Home N+ Focus',
      Tipo_Contenido: 'Producers_Home N+ Focus',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.ALL_THE_INVESTIGATION,
      content_type: ANALYTICS_MOLECULES.VIDEOS.INVESTIGATION_CARD_X5,
      content_name: 'Swipe',
      content_action: 'swipe'
    });
  };

  return {
    goBack,
    handleSearchPress,
    handleViewInteractivePress,
    theme,
    flatListRef,
    data,
    isInternetConnection,
    toastType,
    setToastType,
    toastMessage,
    setToastMessage,
    isToggleBookmark,
    setIsToggleBookmark,
    toggleBookmarkMutation,
    handleBookmarkPress,
    handleVideoPress,
    handleMenuPress,
    isModalVisible,
    selectedVideo,
    handleSharePress,
    handleRemovePress,
    handleCloseModal,
    nPlusFocusInvestigationsData,
    nPlusFocusShortReportsData,
    nplusFocusLandingPageLoading,
    continueVideoLoading,
    nPlusFocusInvestigationsLoading,
    nPlusFocusShortReportsLoading,
    nPlusFocusLoading,
    continueVideoData,
    nPlusFocusData,
    handleSeeAllPress,
    goToInvestigationDetailScreen,
    handleInvestigationCardPress,
    goToInteractiveListingScreen,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    seeAllShortInvestigationReports,
    refetchAllData,
    onRefresh,
    refreshing,
    isHeroCardBookmarked,
    goToDetailScreen,
    goToShortReportsScreen,
    nPlusFocusDocs,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    loadMore,
    showBannerAds,
    handleContinueWatchingSwipe,
    handleInteractiveSwipe,
    handleInvestigationsSwipe
  };
};

export default useNPlusFocusLandingViewModel;
