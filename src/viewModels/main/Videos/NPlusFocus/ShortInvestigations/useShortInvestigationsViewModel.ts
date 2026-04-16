import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { ApolloError, ApolloCache, Reference } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { N_PLUS_FOCUS_SHORT_REPORT_LISTING_QUERY } from '@src/graphql/main/videos/queries';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import {
  NPlusFocusShortReportListingDoc,
  ShortInvestigationItem
} from '@src/models/main/Videos/ShortInvestigation';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { RootStackParamList } from '@src/navigation/types';

/**
 * Custom hook for managing Short Investigations view model logic.
 * This hook handles data fetching, pagination, bookmark toggling, and navigation
 * for the Short Investigations video content.
 *
 * @returns {Object} An object containing the state and functions related to Short Investigations.
 */

const useShortInvestigationsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { t } = useTranslation();
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [internetFail, setInternetFail] = useState<boolean>(isInternetConnection);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(
    N_PLUS_FOCUS_SHORT_REPORT_LISTING_QUERY,
    {
      variables: {
        cursor: null,
        limit: 6
      },
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network'
    }
  );

  const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const handleRetry = async () => {
    try {
      setInternetLoader(true);
      await refetch();
      setInternetLoader(false);
      setInternetFail(true);
    } catch {
      setInternetLoader(false);
      setInternetFail(false);
    }
  };

  const goBack = () => {
    // Log back button tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.HOME_SHORT_REPORTS.HEADER,
      content_type: ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.HEADER.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });

    navigation.goBack();
  };

  const handleSearchTap = () => {
    // Log search tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.HOME_SHORT_REPORTS.HEADER,
      content_type: ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.HEADER.SEARCH,
      content_action: ANALYTICS_ATOMS.SEARCH
    });
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.SEARCH_SCREEN,
      params: { showSearchResult: false, searchText: '' }
    });
  };

  const loadMore = async () => {
    const hasNextPage = data?.NPlusFocusShortReportListing?.hasNextPage;
    const nextCursor = data?.NPlusFocusShortReportListing?.nextCursor;

    // Log see more tap event
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
      organisms: ANALYTICS_ORGANISMS.HOME_INVESTIGATION.BUTTON,
      content_type: ANALYTICS_MOLECULES.HOME_INVESTIGATION.BUTTON.SEE_MORE,
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (!hasNextPage || !nextCursor || loadMoreLoading) return;

    setLoadMoreLoading(true);
    try {
      await fetchMore({
        variables: {
          cursor: nextCursor,
          limit: 6
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          // Normalize heroImage data to ensure sizes field exists (even if null)
          // This prevents Apollo cache errors when API doesn't return sizes
          const normalizedDocs = fetchMoreResult.NPlusFocusShortReportListing.docs.map(
            (doc: NPlusFocusShortReportListingDoc) => ({
              ...doc,
              heroImage: doc.heroImage
                ? {
                    ...doc.heroImage,
                    sizes: doc.heroImage.sizes ?? null
                  }
                : null
            })
          );

          return {
            NPlusFocusShortReportListing: {
              ...fetchMoreResult.NPlusFocusShortReportListing,
              docs: [...prevResult.NPlusFocusShortReportListing.docs, ...normalizedDocs]
            }
          };
        }
      });
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch({
        cursor: null,
        limit: 6
      });
    } catch (error) {
      const apolloError = error as ApolloError;
      const message =
        apolloError?.graphQLErrors?.[0]?.message ||
        apolloError?.message ||
        t('screens.login.text.somethingWentWrong');
      setToastType('error');
      setToastMessage(message);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, t]);

  const onItemPress = useCallback(
    (slug: string, type: string, index: number, item: ShortInvestigationItem) => {
      // Log short notes card tap event
      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
        organisms: ANALYTICS_ORGANISMS.HOME_SHORT_REPORTS.SHORT_REPORTS,
        content_type:
          type === 'video'
            ? `${ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.SHORT_REPORTS.SHORT_NOTES_CARD} |${index + 1}`
            : `${ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.SHORT_REPORTS.SHORT_NOTES_NEWS} |${index + 1}`,
        content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
        idPage: String(item?.id),
        screen_page_web_url: slug,
        content_title: item?.title
      });

      if (type === 'video') {
        navigation.navigate(routeNames.VIDEOS_STACK, {
          screen: screenNames.INVESTIGATION_DETAIL_SCREEN,
          params: { slug }
        });
      } else {
        navigation.navigate(routeNames.VIDEOS_STACK, {
          screen: screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN,
          params: { slug }
        });
      }
    },
    [navigation]
  );

  const handleBookmarkPress = useCallback(
    debounce(async (id: string, type: string, index: number, item: ShortInvestigationItem) => {
      // Check current bookmark state
      const isCurrentlyBookmarked = item?.isBookmarked ?? false;

      // Log bookmark tap event
      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.NPLUS_FOCUS,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.NPLUS_FOCUS}_${ANALYTICS_PAGE.SHORT_REPORTS}`,
        organisms: ANALYTICS_ORGANISMS.HOME_SHORT_REPORTS.SHORT_REPORTS,
        content_type:
          type === 'video'
            ? `${ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.SHORT_REPORTS.SHORT_NOTES_CARD} |${index + 1}`
            : `${ANALYTICS_MOLECULES.HOME_SHORT_REPORTS.SHORT_REPORTS.SHORT_NOTES_NEWS} |${index + 1}`,
        content_name: isCurrentlyBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
        content_action: isCurrentlyBookmarked
          ? ANALYTICS_ATOMS.UNBOOKMARK
          : ANALYTICS_ATOMS.BOOKMARK,
        idPage: String(item?.id),
        screen_page_web_url: item?.slug,
        content_title: item?.title
      });

      if (guestToken) {
        setBookmarkModalVisible(true);
        return;
      }
      try {
        const result = await toggleBookmark({
          variables: { input: { contentId: id, type: 'Content' } },
          update: (cache: ApolloCache<unknown>, { data: mutationData }) => {
            if (!mutationData?.toggleBookmark?.success) return;

            const contentId = id;
            const isBookmarked = mutationData.toggleBookmark.isBookmarked;
            const itemIdsToUpdate: string[] = [];

            cache.modify({
              fields: {
                NPlusFocusShortReportListing(
                  existingData: Reference | { docs: Reference[] } | undefined,
                  { readField }
                ) {
                  if (!existingData) return existingData;
                  if ('__ref' in existingData) return existingData;
                  if (!('docs' in existingData) || !existingData.docs) return existingData;

                  existingData.docs.forEach((docRef: Reference) => {
                    const docId = readField<string>('id', docRef);
                    if (docId === contentId) {
                      try {
                        const itemId = cache.identify(docRef);
                        if (itemId && !itemIdsToUpdate.includes(itemId)) {
                          itemIdsToUpdate.push(itemId);
                        }
                      } catch {
                        // Skip if we can't identify the item
                      }
                    }
                  });

                  return existingData;
                }
              }
            });
            itemIdsToUpdate.forEach((itemId) => {
              cache.modify({
                id: itemId,
                fields: {
                  isBookmarked() {
                    return isBookmarked;
                  }
                }
              });
            });
          }
        });
        if (result.data?.toggleBookmark?.success) {
          setToastType('success');
          setToastMessage(
            result.data?.toggleBookmark?.message ||
              t('screens.storyPage.author.bookmarkUpdatedSuccessfully')
          );
        } else {
          setToastType('error');
          setToastMessage(
            result.data?.toggleBookmark?.message ||
              t('screens.storyPage.author.failedToUpdateBookmark')
          );
        }
      } catch (error) {
        const apolloError = error as ApolloError;
        const message =
          apolloError?.graphQLErrors?.[0]?.message ||
          apolloError?.message ||
          t('screens.login.text.somethingWentWrong');
        setToastType('error');
        setToastMessage(message);
      }
    }, 300),
    [toggleBookmark, t, guestToken]
  );

  const shortInvestigationsData: ShortInvestigationItem[] =
    data?.NPlusFocusShortReportListing?.docs.map((item: NPlusFocusShortReportListingDoc) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      readTime: item.readTime,
      videoDuration: item.videoDuration,
      isBookmarked: item.isBookmarked,
      heroImage: item.heroImage || null,
      topicTitle:
        Array.isArray(item.topics) && item.topics[0]?.title
          ? item.topics[0].title
          : item.category?.title || null
    })) || [];

  return {
    shortInvestigationsData,
    shortInvestigationsLoading: loading,
    shortInvestigationsError: error,
    refreshing,
    handleRefresh,
    onItemPress,
    handleBookmarkPress,
    totalDocs: data?.NPlusFocusShortReportListing?.totalDocs || 0,
    toastMessage,
    toastType,
    setToastMessage,
    setToastType,
    internetLoader,
    goBack,
    isInternetConnection,
    internetFail,
    handleRetry,
    loadMore,
    loadMoreLoading,
    hasNextPage: data?.NPlusFocusShortReportListing?.hasNextPage || false,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleSearchTap
  };
};

export default useShortInvestigationsViewModel;
