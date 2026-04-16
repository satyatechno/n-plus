import { useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { RootStackParamList } from '@src/navigation/types';
import {
  FormattedInteractiveVideo,
  InteractiveVideo
} from '@src/models/main/Videos/InteractiveListing';
import useNetworkStore from '@src/zustand/networkStore';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { INTERACTIVE_VIDEOS_QUERY } from '@src/graphql/main/videos/queries';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

const formatInvestigationData = (docs: InteractiveVideo[]): FormattedInteractiveVideo[] =>
  docs.map(({ id, title, fullPath, hero }) => ({
    id,
    title,
    url: hero?.media?.sizes?.landscape?.url ?? '',
    width: 0,
    height: 0,
    externalURL: fullPath ?? ''
  }));

export const useInteractiveListingViewModel = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);

  const { data, loading, refetch, error, fetchMore } = useQuery(INTERACTIVE_VIDEOS_QUERY, {
    variables: {
      production: Config.NPLUS_PRODUCTION_FOCUS,
      cursor: null,
      limit: 10
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const videos = data?.GetPages?.docs ? formatInvestigationData(data.GetPages.docs) : [];

  const loadMore = async () => {
    const hasNextPage = data?.GetPages?.hasNextPage;
    const nextCursor = data?.GetPages?.nextCursor;

    // Log see more tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.BUTTON,
      content_type: ANALYTICS_MOLECULES.HOME_INVESTIGATION.BUTTON.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (!hasNextPage || !nextCursor || loadMoreLoading) return;

    setLoadMoreLoading(true);
    try {
      await fetchMore({
        variables: {
          production: Config.NPLUS_PRODUCTION_FOCUS,
          cursor: nextCursor,
          limit: 10
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            GetPages: {
              ...fetchMoreResult.GetPages,
              docs: [...prevResult.GetPages.docs, ...fetchMoreResult.GetPages.docs],
              hasNextPage: fetchMoreResult.GetPages.hasNextPage,
              nextCursor: fetchMoreResult.GetPages.nextCursor
            }
          };
        }
      });
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch({
      production: 'nmas-focus',
      cursor: null,
      limit: 10
    });
    setRefreshing(false);
  };

  const handleRetry = async () => {
    try {
      await refetch();
      setInternetLoader(true);
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const handleCardPress = (fullPath: string, index: number) => {
    // Log interactive content card tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.INTERACTIVE_INVESTIGATION.INTERACTIVES,
      content_type: `${ANALYTICS_MOLECULES.INTERACTIVE_INVESTIGATION.INTERACTIVES.INTERACTIVE_CONTENT_CARD} | ${index + 1}`,
      content_name:
        ANALYTICS_MOLECULES.INTERACTIVE_INVESTIGATION.INTERACTIVES.INTERACTIVE_CONTENT_CARD,
      content_action: ANALYTICS_ATOMS.TAP,
      idPage: String(videos[index].id),
      screen_page_web_url: videos[index].externalURL,
      content_title: videos[index].title
    });

    if (!fullPath) {
      return;
    }
    const url = Config.WEBSITE_BASE_URL + fullPath;
    setWebUrl(url);
    setShowWebView(true);
  };

  const handleCloseWebView = () => {
    setShowWebView(false);
  };

  const goBack = () => {
    // Log back button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.INTERACTIVE_INVESTIGATION.HEADER,
      content_type: ANALYTICS_MOLECULES.INTERACTIVE_INVESTIGATION.HEADER.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });

    navigation.goBack();
  };

  const handleSearchTap = () => {
    // Log search tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.INVESTIGATION_HOME}`,
      organisms: ANALYTICS_ORGANISMS.INTERACTIVE_INVESTIGATION.HEADER,
      content_type: ANALYTICS_MOLECULES.INTERACTIVE_INVESTIGATION.HEADER.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  return {
    data: videos,
    loading,
    error,
    refreshing,
    onRefresh: handleRefresh,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    goBack,
    loadMore,
    loadMoreLoading,
    flatListRef,
    hasNextPage: data?.GetPages?.hasNextPage ?? false,
    showWebView,
    webUrl,
    handleCardPress,
    handleCloseWebView,
    handleSearchTap
  };
};
