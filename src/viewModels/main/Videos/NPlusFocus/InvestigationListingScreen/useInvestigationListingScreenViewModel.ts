import { useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';
import useNetworkStore from '@src/zustand/networkStore';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

/**
 * Custom React hook that encapsulates the view model logic for the Investigation Listing screen in the NPlus Focus section.
 *
 * Manages state and handlers for video playback, bookmarking, modal visibility, and navigation.
 * It also provides API-driven data for videos and captions.
 *
 * @returns {object} An object containing:
 * - `goBack`: Function to handle back navigation or slug history pop.
 * - `theme`: Current theme object.
 * - `flatListRef`: Reference to the FlatList component.
 * - `data`: List of video items for the current program slug.
 * - `videosLoading`: Boolean indicating if video data is loading.
 * - `loadMore`: Handler to fetch the next page of videos.
 * - `loadMoreLoading`: Boolean indicating if the next page of videos is loading.
 * - `onRefresh`: Handler to refresh the video list.
 * - `isRefreshing`: Boolean indicating if the list is currently refreshing.
 */

const useInvestigationListingScreenViewModel = () => {
  const [theme] = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { isInternetConnection } = useNetworkStore();

  const {
    data,
    loading: videosLoading,
    fetchMore,
    refetch
  } = useQuery(VIDEOS_QUERY, {
    variables: {
      videoType: 'episode',
      production: Config.NPLUS_PRODUCTION_FOCUS,
      limit: 8
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const hasMore = Boolean(data?.Videos?.nextCursor);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch({
        videoType: 'episode',
        production: 'nmas-focus',
        cursor: null,
        limit: 8
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMore = async () => {
    const nextCursor = data?.Videos?.nextCursor;
    if (!nextCursor || loadMoreLoading) return;

    // Log see more tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.BUTTON,
      content_type: ANALYTICS_MOLECULES.HOME_INVESTIGATION.BUTTON.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setLoadMoreLoading(true);
    try {
      await fetchMore({
        variables: {
          videoType: 'episode',
          production: Config.NPLUS_PRODUCTION_FOCUS,
          cursor: nextCursor,
          limit: 8
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            Videos: {
              ...fetchMoreResult.Videos,
              docs: [...prevResult.Videos.docs, ...fetchMoreResult.Videos.docs]
            }
          };
        }
      });
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const goToInvestigationDetailScreen = (slug: string, index: number) => {
    if (!slug) return;

    // Log investigation card tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.INVESTIGATION,
      content_type: `${ANALYTICS_MOLECULES.HOME_INVESTIGATION.INVESTIGATION.INVESTIGATION_CARD} |${index + 1}`,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(data?.Videos?.docs[index]?.id),
      screen_page_web_url: slug,
      content_title: data?.Videos?.docs[index]?.title,
      content_name: ANALYTICS_MOLECULES.HOME_INVESTIGATION.INVESTIGATION.INVESTIGATION_CARD
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
      params: {
        slug
      }
    });
  };

  const goBack = () => {
    // Log back button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.HEADER,
      content_type: ANALYTICS_MOLECULES.HOME_INVESTIGATION.HEADER.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });

    navigation.goBack();
  };

  const handleSearchTap = () => {
    // Log search tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.HEADER,
      content_type: ANALYTICS_MOLECULES.HOME_INVESTIGATION.HEADER.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  return {
    goBack,
    theme,
    flatListRef,
    data,
    videosLoading,
    loadMore,
    loadMoreLoading,
    onRefresh,
    isRefreshing,
    isInternetConnection,
    goToInvestigationDetailScreen,
    handleSearchTap,
    hasMore
  };
};

export default useInvestigationListingScreenViewModel;
