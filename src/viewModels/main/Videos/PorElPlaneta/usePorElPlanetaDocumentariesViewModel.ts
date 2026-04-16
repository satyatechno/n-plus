import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { GET_RECENTLY_ADDED_DOCUMENTARIES_QUERY } from '@src/graphql/main/videos/queries';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import useNetworkStore from '@src/zustand/networkStore';
import { PorElPlanetaDocumentaries } from '@src/models/main/Videos/PorElPlaneta';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_PRODUCTION
} from '@src/utils/analyticsConstants';

const usePorElPlanetaDocumentariesViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [dataPage, setDataPage] = useState<number>(1);
  const [dataMoreLoader, setDataMoreLoader] = useState<boolean>(false);
  const [dataHasNextpage, setDataHasNextpage] = useState<boolean>(false);
  const [porElPlanetaListData, setPorElPlanetaListData] = useState<PorElPlanetaDocumentaries[]>([]);
  const porElPlanetaDataLimit = 10;
  const porElPlanetaDataSortingKey = '-publishedAt';

  const {
    data: porElPlanetaData,
    loading: porElPlanetaLoading,
    error: porElPlanetaError,
    refetch: refetchPorElPlanetaListData,
    fetchMore: fetchMorePorElPlanetaListData
  } = useQuery(GET_RECENTLY_ADDED_DOCUMENTARIES_QUERY, {
    variables: {
      production: Config.NPLUS_PRODUCTION_PORELPLANATA,
      limit: porElPlanetaDataLimit,
      sort: porElPlanetaDataSortingKey
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (porElPlanetaData) {
      setDataHasNextpage(porElPlanetaData?.Videos?.hasNextPage);
      if (dataPage === 1) {
        setPorElPlanetaListData(porElPlanetaData?.Videos?.docs);
        setDataMoreLoader(false);
      } else {
        setDataMoreLoader(false);
        setPorElPlanetaListData((prevEntries: PorElPlanetaDocumentaries[]) => [
          ...prevEntries,
          ...porElPlanetaData.Videos.docs
        ]);
      }
    }
  }, [porElPlanetaData]);

  const onSeeMorePress = async () => {
    logSelectContentEvent({
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_TODOS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.ALL_THE_INVESTIGATION,
      content_type: ANALYTICS_MOLECULES.PRODUCTION.BUTTON_SEE_ALL,
      content_name: 'See more',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DOCUMENTARIES
    });

    const nextCursor = porElPlanetaData?.Videos?.nextCursor;
    if (porElPlanetaData?.Videos?.hasNextPage && nextCursor) {
      setDataMoreLoader(true);
      try {
        await fetchMorePorElPlanetaListData({
          variables: {
            production: 'por-el-planeta',
            limit: porElPlanetaDataLimit,
            sort: porElPlanetaDataSortingKey,
            cursor: nextCursor
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
        setDataMoreLoader(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setDataPage(1);
      await refetchPorElPlanetaListData();
    } finally {
      setRefreshing(false);
    }
  }, [refetchPorElPlanetaListData]);

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await refetchPorElPlanetaListData();
      setInternetLoader(false);
      setinternetFail(true);
    } catch {
      setInternetLoader(false);
      setinternetFail(false);
    }
  };

  const onCardPress = ({ item, index }: { item: { slug: string }; index: number }) => {
    logSelectContentEvent({
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_TODOS}`,
      organisms: 'undefined',
      content_type: `${ANALYTICS_MOLECULES.PRODUCTION.CARD_OF_VIDEO} ${index + 1}`,
      content_name: 'Documental content card',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DOCUMENTARIES
    });

    navigation.push(routeNames.VIDEOS_STACK, {
      screen: screenNames.POR_EL_PLANETA_DETAIL_PAGE,
      params: { slug: item.slug }
    });
  };

  const goBack = () => {
    logSelectContentEvent({
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_TODOS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HEADER,
      content_type: 'undefined',
      content_name: 'Button back',
      content_action: ANALYTICS_ATOMS.BACK,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DOCUMENTARIES
    });

    navigation.goBack();
  };

  const onSearchPress = () => {
    logSelectContentEvent({
      production: ANALYTICS_PRODUCTION.POR_EL_PLANETA,
      screen_name: ANALYTICS_COLLECTION.PRODUCTORAS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PRODUCTORAS}_${ANALYTICS_PAGE.POR_EL_PLANETA_TODOS}`,
      organisms: ANALYTICS_ORGANISMS.PRODUCERS.HEADER,
      content_type: 'undefined',
      content_name: 'Search',
      content_action: ANALYTICS_ATOMS.SEARCH,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.POR_EL_PLANETA_DOCUMENTARIES
    });

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  return {
    goBack,
    porElPlanetaLoading,
    porElPlanetaError,
    porElPlanetaListData,
    onCardPress,
    onSearchPress,
    refreshing,
    onRefresh,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    dataHasNextpage,
    dataMoreLoader,
    onSeeMorePress
  };
};

export default usePorElPlanetaDocumentariesViewModel;
