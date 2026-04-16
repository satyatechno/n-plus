import { onError } from '@apollo/client/link/error';
import { ApolloClient, InMemoryCache, Observable, ServerError } from '@apollo/client';

import httpLink from '@src/services/apollo/httpLink';
import authLink from '@src/services/apollo/links/authLink';
import useAuthStore from '@src/zustand/auth/authStore';
import {
  REFRESH_APP_SESSION_MUTATION,
  REFRESH_GUEST_SESSION_MUTATION
} from '@src/graphql/auth/mutations';
import i18n from '@src/config/localization/i18n';
import { forceLogout } from '@src/utils/forceLogout';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RefreshState {
  isRefreshing: boolean;
  refreshPromise: Promise<string | null> | null;
  pendingQueue: Array<(token: string | null) => void>;
}

interface RefreshTokenResponse {
  authToken: string;
  refreshToken: string;
  xApiKey?: string;
}

interface ErrorWithExtensions {
  extensions?: {
    code?: string;
    statusCode?: number;
  };
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

// Separate state for guest and app sessions to prevent conflicts
const refreshState: RefreshState = {
  isRefreshing: false,
  refreshPromise: null,
  pendingQueue: []
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if an error indicates an authentication failure (401)
 */
const isUnauthorizedError = (
  graphQLErrors: readonly ErrorWithExtensions[] | undefined,
  networkError: Error | ServerError | null | undefined
): boolean => {
  const hasGraphQL401 = graphQLErrors?.some((e) => e?.extensions?.statusCode === 401) ?? false;
  const hasNetwork401 = !!networkError && (networkError as ServerError)?.statusCode === 401;
  return hasGraphQL401 || hasNetwork401;
};

/**
 * Checks if the error indicates the refresh token is invalid
 */
const isRefreshTokenInvalid = (err: unknown): boolean => {
  if (typeof err !== 'object' || err === null) return false;

  const graphQLErrors = (err as { graphQLErrors?: ErrorWithExtensions[] })?.graphQLErrors;
  const networkError = (err as { networkError?: ServerError })?.networkError;

  if (graphQLErrors) {
    return graphQLErrors.some(
      (e) =>
        e?.extensions?.code === 'UNAUTHENTICATED' ||
        e?.extensions?.code === 'INVALID_REFRESH_TOKEN' ||
        e?.extensions?.statusCode === 401 ||
        e?.extensions?.statusCode === 422
    );
  }

  return networkError?.statusCode === 401;
};

/**
 * Validates that the refresh response contains required tokens
 */
const validateRefreshResponse = (authToken: string | null | undefined): void => {
  if (!authToken || typeof authToken !== 'string') {
    throw new Error(i18n.t('screens.login.text.somethingWentWrong'));
  }
};

/**
 * Creates a new Apollo client instance for refresh operations
 * Uses a separate client to avoid circular dependencies and cache issues
 */
const createRefreshClient = (): ApolloClient<unknown> =>
  new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache'
      },
      query: {
        fetchPolicy: 'no-cache'
      }
    }
  });

/**
 * Resolves all pending requests with the new token or null on error
 */
const resolveQueue = (token: string | null): void => {
  refreshState.pendingQueue.forEach((callback) => callback(token));
  refreshState.pendingQueue = [];
};

/**
 * Sets the authorization header in the operation context
 */
const setAuthHeader = (
  operation: {
    setContext: (
      fn: (prev: { headers?: Record<string, string> }) => { headers: Record<string, string> }
    ) => void;
  },
  token: string
): void => {
  operation.setContext((prevContext: { headers?: Record<string, string> }) => {
    const prevHeaders = prevContext?.headers || {};
    return {
      headers: {
        ...prevHeaders,
        authorization: `Bearer ${token}`
      }
    };
  });
};

/**
 * Determines if the current session is a guest session
 */
const isGuestSession = (
  guestToken: string | null | undefined,
  guestRefreshToken: string | null | undefined
): boolean => !!(guestToken && guestRefreshToken);

// ============================================================================
// REFRESH LOGIC
// ============================================================================

/**
 * Refreshes the guest session token
 */
const refreshGuestSession = async (guestRefreshToken: string): Promise<RefreshTokenResponse> => {
  const client = createRefreshClient();

  const { data } = await client.mutate<{
    refreshGuestSession: RefreshTokenResponse;
  }>({
    mutation: REFRESH_GUEST_SESSION_MUTATION,
    fetchPolicy: 'no-cache'
  });

  const newGuestAuth = data?.refreshGuestSession?.authToken;
  const newGuestRefresh = data?.refreshGuestSession?.refreshToken;
  const xApiKey = data?.refreshGuestSession?.xApiKey;

  validateRefreshResponse(newGuestAuth);

  return {
    authToken: newGuestAuth!,
    refreshToken: newGuestRefresh || guestRefreshToken,
    xApiKey
  };
};

/**
 * Refreshes the app session token
 */
const refreshAppSession = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const client = createRefreshClient();

  const { data } = await client.mutate<{
    refreshAppSession: RefreshTokenResponse;
  }>({
    mutation: REFRESH_APP_SESSION_MUTATION,
    fetchPolicy: 'no-cache'
  });

  const newAuth = data?.refreshAppSession?.authToken;
  const newRefresh = data?.refreshAppSession?.refreshToken;
  const xApiKey = data?.refreshAppSession?.xApiKey;

  validateRefreshResponse(newAuth);

  return {
    authToken: newAuth!,
    refreshToken: newRefresh || refreshToken,
    xApiKey
  };
};

/**
 * Handles the token refresh process for both guest and app sessions
 */
const handleTokenRefresh = async (): Promise<string | null> => {
  const store = useAuthStore.getState();
  const { authToken, refreshToken, guestToken, guestRefreshToken } = store;

  try {
    if (isGuestSession(guestToken, guestRefreshToken)) {
      // Guest session refresh
      if (!guestRefreshToken) {
        throw new Error('No guest refresh token available');
      }

      const {
        authToken: newGuestAuth,
        refreshToken: updatedGuestRefresh,
        xApiKey
      } = await refreshGuestSession(guestRefreshToken);

      store.setGuestTokens(newGuestAuth, updatedGuestRefresh, xApiKey);

      return newGuestAuth;
    } else {
      // App session refresh
      if (!authToken || !refreshToken) {
        throw new Error('No tokens available for refresh');
      }

      const {
        authToken: newAuth,
        refreshToken: updatedRefresh,
        xApiKey
      } = await refreshAppSession(refreshToken);

      store.setTokens(newAuth, updatedRefresh, xApiKey);

      return newAuth;
    }
  } catch (err) {
    // Check if refresh token is invalid and force logout
    if (isRefreshTokenInvalid(err)) {
      await forceLogout();
    }
    throw err;
  }
};

// ============================================================================
// MAIN REFRESH LINK
// ============================================================================

/**
 * Apollo error link that handles token refresh on 401 errors
 * Supports both guest and registered user sessions
 */
const refreshLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Skip refresh operations to prevent infinite loops
  const isRefreshOperation =
    operation.operationName === 'RefreshAppSession' ||
    operation.operationName === 'RefreshGuestSession';

  if (isRefreshOperation) {
    return;
  }

  // Only handle 401 unauthorized errors
  if (!isUnauthorizedError(graphQLErrors, networkError)) {
    return;
  }

  // If already refreshing, queue this request
  if (refreshState.isRefreshing && refreshState.refreshPromise) {
    return new Observable((observer) => {
      refreshState
        .refreshPromise!.then((newToken) => {
          if (newToken) {
            setAuthHeader(operation, newToken);
          }
          return forward(operation).subscribe(observer);
        })
        .catch(() => {
          observer.error(new Error(i18n.t('screens.login.text.somethingWentWrong')));
        });
    });
  }

  // Start refresh process
  refreshState.isRefreshing = true;
  refreshState.refreshPromise = handleTokenRefresh();

  return new Observable((observer) => {
    refreshState
      .refreshPromise!.then((newToken) => {
        if (!newToken) {
          observer.error(new Error('Token refresh failed'));
          return;
        }

        // Update operation context with new token
        setAuthHeader(operation, newToken);

        // Resolve pending requests
        resolveQueue(newToken);

        // Retry the original operation with new token
        return forward(operation).subscribe(observer);
      })
      .catch(async (err) => {
        // Resolve pending requests with null (error state)
        resolveQueue(null);

        observer.error(err);
      })
      .finally(() => {
        refreshState.isRefreshing = false;
        refreshState.refreshPromise = null;
      });
  });
});

export default refreshLink;
