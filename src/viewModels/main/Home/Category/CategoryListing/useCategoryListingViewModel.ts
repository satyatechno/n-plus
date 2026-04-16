import { useEffect, useState, useMemo, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';

import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE,
  ANALYTICS_MOLECULES
} from '@src/utils/analyticsConstants';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import {
  CategoryItem,
  NavItem,
  ContentSourceSlug,
  LinkType,
  ContentSourceNavigation,
  NavigationMode,
  ProductionTypes,
  VideoScreenMapping,
  HomeStackScreens
} from '@src/models/main/Home/Category/CategoryListing';
import { SECONDARY_HEADER_QUERY } from '@src/graphql/main/home/queries';
import useNetworkStore from '@src/zustand/networkStore';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';

const WEB_BASE_URL = Config.WEBSITE_BASE_URL;

const transformNavItemToCategory = (item: NavItem): CategoryItem => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  return {
    id: item.id,
    title: item.label,
    hasSubcategories: hasSubItems,
    selectedItem: item.selectedItem || undefined,
    navigationConfig: {
      contentSource: (item.contentSource || null) as keyof typeof ContentSourceSlug | null,
      linkType: item.linkType as LinkType,
      customUrl: item.customUrl,
      slug: item.selectedItem?.value.slug || null,
      fullPath: item.fullPath || null
    },
    subcategories:
      hasSubItems && item.subItems
        ? item.subItems.map((subItem) => ({
            id: subItem.id,
            title: subItem.label,
            hasSubcategories: false,
            selectedItem: subItem.selectedItem || undefined,
            navigationConfig: {
              contentSource: (subItem.contentSource || null) as
                | keyof typeof ContentSourceSlug
                | null,
              linkType: subItem.linkType as LinkType,
              customUrl: subItem.customUrl,
              slug: subItem.selectedItem?.value.slug || null,
              fullPath: subItem.fullPath || null
            }
          }))
        : undefined
  };
};

const transformNavItemsToCategories = (navItems: NavItem[]): CategoryItem[] =>
  navItems.map(transformNavItemToCategory);

/**
 * Custom hook for managing the category listing view model
 */

/**
 * Custom hook for managing the category listing view model
 *
 * @returns An object containing:
 * @returns {Set<string>} expandedCategories - Set of expanded category IDs
 * @returns {(categoryId: string) => void} handleToggleCategory - Callback to toggle category expansions
 * @returns {CategoryItem[]} categoryData - Array of transformed category data objects
 * @returns {boolean} isLoading - Whether the category data is loading
 * @returns {ApolloError | null} error - The error that occurred while fetching the category data, or null if no error occurred
 * @returns {(screenName: string, params?: object) => void} handleNavigateToCategory - Callback to navigate to category detail screens
 * @returns {boolean} showWebView - Whether to show the webview
 * @returns {string} webUrl - The URL of the webview
 * @returns {() => void} handleWebViewClose - Callback to close the webview
 * @returns {boolean} isInternetConnection - Whether the device has an internet connection
 * @returns {() => Promise<void>} handleRetry - Callback to retry fetching the category data
 * @returns {string} toastMessage - The message to be displayed in the toast
 * @returns {'error' | 'success'} toastType - The type of the toast message
 * @returns {(message: string) => void} setToastMessage - Callback to set the toast message
 */

export const useCategoryListingViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setShouldPause } = useLiveTVStore();

  // Helper function for type-safe navigation
  const navigateToScreen = (screenName: string, params?: object) => {
    setShouldPause(true); // Pause Live TV when navigating
    (navigation.navigate as unknown as (name: keyof RootStackParamList, params?: unknown) => void)(
      screenName as keyof RootStackParamList,
      params
    );
  };

  const { isInternetConnection } = useNetworkStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const { t } = useTranslation();

  const { data, loading, error, refetch } = useQuery(SECONDARY_HEADER_QUERY, {
    fetchPolicy: 'network-only'
  });

  const categoryData = useMemo(() => {
    if (!data?.SecondaryHeader?.navItems) return [];
    const transformedData = transformNavItemsToCategories(data.SecondaryHeader.navItems);
    return transformedData.filter(
      (item) =>
        item.navigationConfig?.contentSource?.toLowerCase() !== 'videos' &&
        item.selectedItem?.value?.slug?.toLowerCase() !== 'opinion'
    );
  }, [data]);

  useEffect(() => {
    if (error) {
      setToastType('error');
      setToastMessage(
        (error?.graphQLErrors?.[0]?.extensions?.message as string) ||
          (error.message === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : t('screens.login.text.somethingWentWrong'))
      );
    }
  }, [error, t]);

  const handleToggleCategory = (item: CategoryItem) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_HEADER,
      screen_name: ANALYTICS_PAGE.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_HEADER_MENU.MENU,
      content_type: ANALYTICS_MOLECULES.HOME_HEADER_MENU.NEXT_ICON,
      content_title: item.title || 'undefined',
      content_name: item.title || 'undefined',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.clear();
        newSet.add(item.id);
      }
      return newSet;
    });
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

    // Navigate to HomeStack for home-related screens
    if (HomeStackScreens.includes(screenName as (typeof HomeStackScreens)[number])) {
      navigateToScreen(routeNames.HOME_STACK, {
        screen: screenName,
        params
      });
      return;
    }

    navigateToScreen(screenName, params);
  };

  const handleNavigateToCategory = (item: CategoryItem) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.HOMEPAGE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.HOME_HEADER,
      screen_name: ANALYTICS_PAGE.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_HEADER_MENU.MENU,
      content_type: ANALYTICS_MOLECULES.HOME_HEADER_MENU.CATEGORY_OR_TOPIC,
      content_title: item.title || 'undefined',
      content_name: item.title || 'undefined',
      content_action: ANALYTICS_ATOMS.TAP
    });
    const { contentSource, slug, customUrl, linkType, fullPath } = item.navigationConfig;

    if (linkType === 'custom' && customUrl) {
      handleWebViewOpen(customUrl);
      return;
    }

    if (!contentSource) return;

    const navConfig = ContentSourceNavigation[contentSource];

    // Handle productions (N+ Focus and Por el planeta)
    if (contentSource === 'productions' && item.selectedItem?.value.title) {
      const productionType = item.selectedItem.value.title;
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
      if (fullPath) {
        const fullUrl = `${WEB_BASE_URL}${fullPath}`;
        handleWebViewOpen(fullUrl);
      } else {
        handleNavigateToApp(screenNames.PRESS_ROOM_LANDING);
      }
      return;
    }

    if (navConfig.mode === NavigationMode.app) {
      const route =
        slug && 'detailRoute' in navConfig
          ? navConfig.detailRoute
          : 'route' in navConfig
            ? navConfig.route
            : 'defaultRoute' in navConfig
              ? typeof navConfig.defaultRoute === 'string'
                ? navConfig.defaultRoute
                : ''
              : '';

      if (route) {
        const params = slug
          ? {
              slug,
              id: item.selectedItem?.value.id,
              title: item.selectedItem?.value.title,
              type: contentSource === 'topics' ? 'topic' : 'category'
            }
          : undefined;
        handleNavigateToApp(route, params);
      }
      return;
    }

    if (navConfig.mode === NavigationMode.webview) {
      const { fullPath } = item.navigationConfig;

      if (fullPath) {
        const fullUrl = `${WEB_BASE_URL}${fullPath}`;
        handleWebViewOpen(fullUrl);
      } else if (slug) {
        const fullUrl = `${WEB_BASE_URL}/${slug}`;
        handleWebViewOpen(fullUrl);
      }
    }
  };

  const handleRetry = async () => {
    try {
      await refetch();
      setToastMessage('');
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  };

  return {
    expandedCategories,
    handleToggleCategory,
    categoryData,
    isLoading: loading,
    error,
    handleNavigateToCategory,
    showWebView,
    webUrl,
    handleWebViewClose,
    isInternetConnection,
    handleRetry,
    toastMessage,
    toastType,
    setToastMessage
  };
};
