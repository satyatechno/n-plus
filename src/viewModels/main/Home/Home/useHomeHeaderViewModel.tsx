import { useCallback, useMemo, useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HEADER_QUERY } from '@src/graphql/main/home/queries';
import { HeaderResponse, HeaderNavItem } from '@src/models/main/Home/StoryPage/Header';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import {
  ContentSourceSlug,
  ContentSourceNavigation,
  NavigationMode,
  ProductionTypes,
  VideoScreenMapping,
  HomeStackScreens
} from '@src/models/main/Home/Category/CategoryListing';
import useNetworkStore from '@src/zustand/networkStore';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';
import { RootStackParamList } from '@src/navigation/types';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL,
  getCategorySliderMolecule,
  ANALYTICS_ID_PAGE
} from '@src/utils/analyticsConstants';

const WEB_BASE_URL = Config.WEBSITE_BASE_URL;

export const useHomeHeaderViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const { setShouldPause } = useLiveTVStore();

  const {
    data: headerData,
    loading: headerLoading,
    error: headerError,
    refetch: refetchHeader,
    networkStatus
  } = useQuery<HeaderResponse>(HEADER_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const navItems = useMemo(
    () =>
      (headerData?.Header?.navItems || []).filter(
        (item) =>
          item.contentSource?.toLowerCase() !== 'videos' &&
          item.selectedItem?.value?.slug?.toLowerCase() !== 'opinion'
      ),
    [headerData?.Header?.navItems]
  );

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const newCategories = navItems.map((item) => item.label);
    setCategories(newCategories);
  }, [navItems]);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const isRefetching = useMemo(() => networkStatus === 3, [networkStatus]);

  // Helper function for type-safe navigation
  const navigateToScreen = (screenName: string, params?: object) => {
    setShouldPause(true); // Pause Live TV when navigating to other screens
    (navigation.navigate as unknown as (name: keyof RootStackParamList, params?: unknown) => void)(
      screenName as keyof RootStackParamList,
      params
    );
  };

  const handleWebViewOpen = useCallback(
    (url: string) => {
      setShouldPause(true); // Pause Live TV when WebView opens
      setWebUrl(url);
      setShowWebView(true);
    },
    [setShouldPause]
  );

  const handleWebViewClose = useCallback(() => {
    setShowWebView(false);
    setWebUrl('');
  }, []);

  const handleNavigateToApp = (screenName: string, params?: object) => {
    const videoScreen = VideoScreenMapping[screenName];
    if (videoScreen) {
      if (screenName === screenNames.VIDEOS) {
        navigation.replace(routeNames.HOME_STACK, {
          screen: screenNames.MAIN_TAB_NAVIGATOR,
          params: { initialTab: screenNames.VIDEOS }
        });
      } else {
        navigateToScreen(routeNames.VIDEOS_STACK, {
          screen: videoScreen,
          params
        });
      }
      return;
    }

    if (HomeStackScreens.includes(screenName as (typeof HomeStackScreens)[number])) {
      navigateToScreen(routeNames.HOME_STACK, {
        screen: screenName,
        params
      });
      return;
    }

    navigateToScreen(screenName as keyof Record<string, object | undefined>, params);
  };

  const handleNavigateToCategory = (item: HeaderNavItem) => {
    const { contentSource, selectedItem, customUrl, linkType } = item;
    if (linkType === 'custom' && customUrl) {
      handleWebViewOpen(customUrl);
      return;
    }

    if (!contentSource) return;

    const navConfig = ContentSourceNavigation[contentSource as keyof typeof ContentSourceSlug];

    if (contentSource === 'productions' && selectedItem?.value.title) {
      const productionType = selectedItem.value.title;
      if (productionType === ProductionTypes.nPlusFocus) {
        handleNavigateToApp(screenNames.NPLUS_FOCUS_LANDING_PAGE);
      } else if (productionType === ProductionTypes.porElPlaneta) {
        handleNavigateToApp(screenNames.POR_EL_PLANETA_LANDING_PAGE);
      } else {
        handleNavigateToApp(screenNames.PRODUCTION_PAGE, item);
      }
      return;
    }

    if (contentSource === 'press-room') {
      if (item.fullPath) {
        const fullUrl = `${WEB_BASE_URL}${item.fullPath}`;
        handleWebViewOpen(fullUrl);
      } else {
        handleNavigateToApp(screenNames.PRESS_ROOM_LANDING);
      }
      return;
    }

    if (navConfig.mode === NavigationMode.app) {
      const route =
        selectedItem?.value.slug && 'detailRoute' in navConfig
          ? navConfig.detailRoute
          : 'route' in navConfig
            ? navConfig.route
            : 'defaultRoute' in navConfig
              ? typeof navConfig.defaultRoute === 'string'
                ? navConfig.defaultRoute
                : ''
              : '';

      if (route) {
        const params = selectedItem?.value.slug
          ? {
              slug: selectedItem.value.slug,
              id: selectedItem.value.id,
              title: selectedItem.value.title,
              type: contentSource === 'topics' ? 'topic' : 'category'
            }
          : undefined;
        handleNavigateToApp(route, params);
      }
      return;
    }

    if (navConfig.mode === NavigationMode.webview) {
      if (item.fullPath) {
        const fullUrl = `${WEB_BASE_URL}${item.fullPath}`;
        handleWebViewOpen(fullUrl);
      } else if (selectedItem?.value.slug) {
        const fullUrl = `${WEB_BASE_URL}/${selectedItem.value.slug}`;
        handleWebViewOpen(fullUrl);
      }
    }
  };

  const onCategoryPress = useCallback(
    (category: string) => {
      const navItem = navItems.find((item) => item.label === category);
      if (navItem) {
        const index = categories.indexOf(category);
        logSelectContentEvent({
          idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
          screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_HEADER,
          screen_name: ANALYTICS_PAGE.HOME_PAGE,
          Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
          organisms: ANALYTICS_ORGANISMS.STORY_PAGE.CATEGORY_SLIDER,
          content_type: getCategorySliderMolecule(index >= 0 ? index : 0),
          content_title: category || 'undefined',
          content_name: category || 'undefined',
          content_action: ANALYTICS_ATOMS.TAP
        });
        handleNavigateToCategory(navItem);
      }
    },
    [navItems, categories, handleNavigateToCategory]
  );

  const handleRefresh = useCallback(() => {
    refetchHeader();
  }, [refetchHeader]);

  useEffect(() => {
    if (!isInternetConnection) return;

    refetchHeader();
  }, [isInternetConnection, refetchHeader]);

  const onLiveTVPress = useCallback(() => {
    navigateToScreen(routeNames.HOME_STACK, {
      screen: screenNames.LIVE_TV
    });
  }, [navigation]);

  const onPressingSearch = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_HEADER,
      screen_name: ANALYTICS_PAGE.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      content_type: ANALYTICS_ATOMS.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setShouldPause(true); // Pause Live TV when navigating to search
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  }, [navigation, setShouldPause]);
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);

  useEffect(() => {
    if (headerLoading) return;

    const hasData = !!navItems?.length;
    setSectionHasData('homeHeader', hasData);

    return () => {
      setSectionHasData('homeHeader', false);
    };
  }, [headerLoading, navItems, setSectionHasData]);

  return {
    categories,
    loading: headerLoading,
    error: headerError,
    isRefetching,
    onCategoryPress,
    onRefresh: handleRefresh,
    refetchHeader,
    handleNavigateToCategory,
    showWebView,
    webUrl,
    handleWebViewClose,
    isInternetConnection,
    onPressingSearch,
    onLiveTVPress
  } as const;
};
