import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

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
import { RootStackParamList } from '@src/navigation/types';

const WEB_BASE_URL = Config.WEBSITE_BASE_URL;

export const useHeaderViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();

  const {
    data: headerData,
    loading: headerLoading,
    error: headerError,
    refetch: refetchHeader,
    networkStatus
  } = useQuery<HeaderResponse>(HEADER_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Helper function for type-safe navigation
  const navigateToScreen = (screenName: string, params?: object) => {
    (navigation.navigate as unknown as (name: keyof RootStackParamList, params?: unknown) => void)(
      screenName as keyof RootStackParamList,
      params
    );
  };

  const navItems = useMemo(
    () =>
      (headerData?.Header?.navItems || []).filter(
        (item) =>
          item.contentSource?.toLowerCase() !== 'videos' &&
          item.selectedItem?.value?.slug?.toLowerCase() !== 'opinion'
      ),
    [headerData?.Header?.navItems]
  );
  const [categories, setCategories] = useState<string[]>(
    useMemo(() => navItems.map((item) => item.label), [navItems])
  );
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const isRefetching = useMemo(() => networkStatus === 3, [networkStatus]);

  const handleWebViewOpen = useCallback((url: string) => {
    setWebUrl(url);
    setShowWebView(true);
  }, []);

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
        handleNavigateToCategory(navItem);
      }
      setCategories((prevCategories) => [
        category,
        ...prevCategories.filter((item) => item !== category)
      ]);
    },
    [navItems, handleNavigateToCategory]
  );

  const onRefresh = useCallback(() => {
    refetchHeader();
  }, [refetchHeader]);

  return {
    navItems,
    categories,
    loading: headerLoading,
    error: headerError,
    isRefetching,
    onCategoryPress,
    onRefresh,
    refetchHeader,
    handleNavigateToCategory,
    showWebView,
    webUrl,
    handleWebViewClose,
    isInternetConnection
  } as const;
};
