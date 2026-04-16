import { useCallback, useState } from 'react';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useTheme } from '@src/hooks/useTheme';
import { VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import { useQuery } from '@apollo/client';
import { VideosStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useNetworkStore from '@src/zustand/networkStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook that encapsulates the view model logic for the All Episodes screen in the Videos section.
 *
 * Manages state and handlers for video playback, bookmarking, modal visibility, and navigation.
 * It also provides API-driven data for videos and captions.
 *
 * @returns {object} An object containing:
 * - `goBack`: Function to handle back navigation or slug history pop.
 * - `theme`: Current theme object.
 * - `allEpisodes`: List of video items for the current program slug.
 * - `loading`: Boolean indicating if video data is loading.
 * - `hasNextPage`: Boolean indicating if more videos can be loaded (pagination).
 * - `loadNextPage`: Handler to fetch the next page of videos.
 * - `refreshList`: Handler to refresh the video list.
 * - `refreshing`: Boolean indicating if the list is currently refreshing.
 */

const useAllEpisodesViewModel = () => {
  const [theme] = useTheme();
  const route = useRoute<RouteProp<VideosStackParamList, 'AllEpisodes'>>();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<VideosStackParamList>>();
  const { isInternetConnection } = useNetworkStore();

  const { data, loading, fetchMore, refetch } = useQuery(VIDEOS_QUERY, {
    variables: {
      limit: 10,
      tvShow: route?.params?.id,
      videoType: 'episode'
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const goBack = useCallback(() => {
    navigation.goBack();
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      screen_name: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      screen_page_web_url: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.TODOS_IOS_EPISODIOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: ANALYTICS_MOLECULES.VIDEOS.BUTTON,
      content_name: ANALYTICS_ATOMS.BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
  }, [navigation]);

  const handleCardPress = (slug: string, index: number) => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      screen_name: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      screen_page_web_url: ANALYTICS_PAGE.TODOS_IOS_EPISODIOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.TODOS_IOS_EPISODIOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: `${ANALYTICS_MOLECULES.SEARCH.CARD_STYLE}_${index + 1}`,
      content_name: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE,
      content_action: ANALYTICS_ATOMS.TAP
    });
    navigation.navigate(screenNames.EPISODE_DETAIL_PAGE, { slug });
  };

  const allEpisodes = data?.Videos?.docs || [];
  const hasNextPage = data?.Videos?.hasNextPage || false;

  const loadNextPage = useCallback(() => {
    if (!hasNextPage) return;

    fetchMore({
      variables: {
        excludedSlug: route?.params?.slug,
        limit: 10,
        cursor: data?.Videos?.nextCursor,
        page: data?.Videos?.nextPage,
        videoType: 'episode'
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          Videos: {
            ...fetchMoreResult.Videos,
            docs: [...prev.Videos.docs, ...fetchMoreResult.Videos.docs]
          }
        };
      }
    });
  }, [data, fetchMore, hasNextPage, route?.params?.slug]);

  const refreshList = useCallback(() => {
    setRefreshing(true);
    refetch({ excludedSlug: route?.params?.slug, limit: 10 }).finally(() => {
      setRefreshing(false);
    });
  }, [refetch, route?.params?.slug]);

  return {
    goBack,
    theme,
    allEpisodes,
    loading,
    hasNextPage,
    loadNextPage,
    refreshList,
    refreshing,
    handleCardPress,
    isInternetConnection
  };
};

export default useAllEpisodesViewModel;
