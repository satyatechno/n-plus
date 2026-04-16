import { Linking } from 'react-native';

import { getStateFromPath } from '@react-navigation/native';
import Config from 'react-native-config';

import { navigationRef } from '@src/navigation/AppNavigation';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { resolveDeepLinkState, resolveBackgroundDeepLink } from '@src/utils/deepLinkResolver';
import { ensureGuestLogin } from '@src/utils/guestLoginUtil';
import useDeeplinkWebViewStore from '@src/zustand/deeplinkWebViewStore';

const CANAL_TO_CHANNEL_INDEX: Record<string, number> = {
  forotv: 0,
  noticieros: 1,
  guadalajara: 2,
  monterrey: 3
};

const normalizePath = (path: string): string => {
  let cleanPath = path.replace(`${Config.WEBSITE_BASE_URL}/`, '');
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  if (!cleanPath.endsWith('/')) cleanPath = cleanPath + '/';
  return cleanPath;
};

const extractQueryParam = (path: string, param: string): string | null => {
  const match = path.match(new RegExp(`[?&]${param}=([^&]+)`));
  return match ? match[1] : null;
};

const handleLiveTvPath = (path: string, options: undefined) => {
  const canal = extractQueryParam(path, 'canal');
  const channelIndex = canal ? (CANAL_TO_CHANNEL_INDEX[canal] ?? 0) : 0;
  return getStateFromPath(`en-vivo/${channelIndex}`, options);
};

export const handleBackgroundDeepLink = async (url: string) => {
  await ensureGuestLogin();
  const path = url.replace(`${Config.WEBSITE_BASE_URL}/`, '');
  const cleanPath = normalizePath(path);

  await new Promise((resolve) => setTimeout(resolve, 100));

  if (path.includes('en-vivo/?')) {
    const canal = extractQueryParam(path, 'canal');
    const channelIndex = canal ? (CANAL_TO_CHANNEL_INDEX[canal] ?? 0) : 0;
    navigationRef.navigate(routeNames.HOME_STACK, {
      screen: screenNames.LIVE_TV,
      params: { channelIndex }
    });
    return;
  }

  const result = await resolveBackgroundDeepLink(cleanPath);
  if (result) {
    (navigationRef.navigate as (name: string, params: object) => void)(result.stack, {
      screen: result.screen,
      params: result.params
    });
  } else {
    useDeeplinkWebViewStore.getState().openUrl(url);
  }
};

export const linking = {
  prefixes: [Config.WEBSITE_BASE_URL || ''],

  subscribe(listener: (url: string) => void) {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (navigationRef.isReady()) {
        handleBackgroundDeepLink(url);
      } else {
        listener(url);
      }
    });
    return () => subscription.remove();
  },

  config: {
    initialRouteName: routeNames.HOME_STACK,

    screens: {
      [routeNames.HOME_STACK]: {
        initialRouteName: screenNames.MAIN_TAB_NAVIGATOR,
        screens: {
          [screenNames.HOME]: 'home',
          [screenNames.STORY_PAGE_RENDERER]: 'story/:slug',
          [screenNames.AUTHOR_DETAILS]: 'author/:slug',
          [screenNames.CATEGORY_DETAIL_SCREEN]: 'category/:slug',
          [screenNames.LIVE_BLOG]: {
            path: 'live-blog/:slug',
            parse: {
              slug: (slug: string) => slug,
              entryId: (entryId: string) => entryId
            }
          },
          [screenNames.LIVE_TV]: 'en-vivo/:channelIndex'
        }
      },

      [routeNames.VIDEOS_STACK]: {
        screens: {
          [screenNames.POR_EL_PLANETA_DETAIL_PAGE]: 'videos/por-el-planeta/:slug',
          [screenNames.POR_EL_PLANETA_LANDING_PAGE]: 'productions/por-el-planeta/:slug',
          [screenNames.PRODUCTION_PAGE]: 'productions/nmas-originales/:slug',
          [screenNames.EPISODE_DETAIL_PAGE]: 'episode/:slug',
          [screenNames.INVESTIGATION_DETAIL_SCREEN]: 'videos/nmas-focus/:slug',
          [screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN]: 'posts/nmas-focus/:slug',
          [screenNames.NPLUS_FOCUS_LANDING_PAGE]: 'productions/nmas-focus/:slug',
          [screenNames.PROGRAMS]: 'programs/:slug',
          [screenNames.AUTHOR_BIO]: 'talent/:slug'
        }
      },

      [routeNames.OPINION_STACK]: {
        screens: {
          [screenNames.OPINION_DETAIL_PAGE]: 'opinion/:slug'
        }
      }
    }
  },

  async getStateFromPath(path: string, options: undefined) {
    await ensureGuestLogin();

    if (path.includes('en-vivo/?')) {
      return handleLiveTvPath(path, options);
    }

    const cleanPath = normalizePath(path);
    const state = await resolveDeepLinkState(cleanPath, options);
    if (state) return state;
    const fullUrl = path.startsWith('http')
      ? path
      : `${Config.WEBSITE_BASE_URL || ''}${path.startsWith('/') ? path : `/${path}`}`;
    if (fullUrl) {
      useDeeplinkWebViewStore.getState().openUrl(fullUrl);
    }
    return getStateFromPath(path, options);
  }
};
