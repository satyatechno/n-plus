import { getStateFromPath } from '@react-navigation/native';

import client from '@src/services/apollo/apolloClient';
import { CHECK_PATH_QUERY } from '@src/graphql/auth/queries';
import { SCREEN_MAPPINGS } from '@src/config/constants';

const extractQueryParam = (path: string, param: string): string | null => {
  const match = path.match(new RegExp(`[?&]${param}=([^&/]+)`));
  return match ? match[1] : null;
};

type RouteCondition = {
  collection: string;
  production?: string | null;
  category?: string | null;
  slug?: string | null;
  path: string;
};

const ROUTE_MAPPINGS: RouteCondition[] = SCREEN_MAPPINGS;

const findMatchingRoute = (
  collection: string,
  production: string | null,
  category: string | null,
  slug: string | null = null
): string | null => {
  const match = ROUTE_MAPPINGS.find((route) => {
    if (route.collection !== collection) return false;

    if (route.production !== undefined && route.production !== production) return false;

    if (route.category !== undefined && route.category !== category) return false;

    if (route.slug !== undefined && route.slug !== slug) return false;

    return true;
  });

  return match?.path ?? null;
};

export const resolveDeepLinkState = async (path: string, options: undefined) => {
  try {
    const entryId = extractQueryParam(path, 'entryId');
    const pathWithoutQuery = path.split('?')[0];

    const { data } = await client.query({
      query: CHECK_PATH_QUERY,
      variables: { path: pathWithoutQuery }
    });

    const res = data?.CheckPath;
    if (!res?.isValid) return;

    const { collection, production, slug, category } = res;
    if (!slug) return;

    const routePath = findMatchingRoute(collection, production ?? null, category ?? null, slug);
    if (!routePath) return;

    if (collection === 'live-blogs' && entryId) {
      return getStateFromPath(`${routePath}/${slug}?entryId=${entryId}`, options);
    }

    const match = SCREEN_MAPPINGS.find((route) => {
      if (route.collection !== collection) return false;
      if (route.production !== undefined && route.production !== production) return false;
      if (route.category !== undefined && route.category !== category) return false;
      if (route.slug !== undefined && route.slug !== slug) return false;
      return true;
    });

    if (
      match &&
      (collection === 'categories' || match.screen === 'ProductionPage' || collection === 'topics')
    ) {
      const queryParams = new URLSearchParams();
      if (res.id) queryParams.append('id', res.id);
      if (res.title) queryParams.append('title', res.title);
      if (collection === 'topics') {
        queryParams.append('type', 'topic');
      }
      const queryString = queryParams.toString();
      const fullPath = queryString ? `${routePath}/${slug}?${queryString}` : `${routePath}/${slug}`;
      return getStateFromPath(fullPath, options);
    }

    return getStateFromPath(`${routePath}/${slug}`, options);
  } catch {
    return undefined;
  }
};

export const resolveBackgroundDeepLink = async (
  path: string
): Promise<{ stack: string; screen: string; params: object } | null> => {
  try {
    const entryId = extractQueryParam(path, 'entryId');
    const pathWithoutQuery = path.split('?')[0];

    const { data } = await client.query({
      query: CHECK_PATH_QUERY,
      variables: { path: pathWithoutQuery }
    });

    const res = data?.CheckPath;
    if (!res?.isValid) return null;

    const { collection, production, slug, category } = res;
    if (!slug) return null;

    const match = SCREEN_MAPPINGS.find((route) => {
      if (route.collection !== collection) return false;
      if (route.production !== undefined && route.production !== production) return false;
      if (route.category !== undefined && route.category !== category) return false;
      if (route.slug !== undefined && route.slug !== slug) return false;
      return true;
    });

    if (!match) return null;

    const params: { slug: string; entryId?: string; id?: string; title?: string; type?: string } = {
      slug
    };
    if (collection === 'live-blogs' && entryId) {
      params.entryId = entryId;
    }

    if (
      collection === 'categories' ||
      match.screen === 'ProductionPage' ||
      collection === 'topics'
    ) {
      if (res.id) params.id = res.id;
      if (res.title) params.title = res.title;
      if (collection === 'topics') {
        params.type = 'topic';
      }
    }

    return {
      stack: match.stack,
      screen: match.screen,
      params: params
    };
  } catch {
    return null;
  }
};
