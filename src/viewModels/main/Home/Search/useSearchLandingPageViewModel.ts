import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Easing, FlatList, PermissionsAndroid } from 'react-native';

import Voice, {
  type SpeechResultsEvent,
  type SpeechVolumeChangeEvent
} from '@react-native-voice/voice';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Config from 'react-native-config';
import { PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';

import {
  GET_MOST_INTERESTED_CONTENT_QUERY,
  GET_MOST_POPULAR_SEARCH_CONTENT_QUERY,
  GET_MOST_VIEWED_TOPICS_QUERY,
  SEARCH_PAYLOAD_CONTENT_QUERY,
  SEARCH_PAYLOAD_QUERY
} from '@src/graphql/main/home/queries';
import useSearchHistoryStore from '@src/zustand/main/searchHistoryStore';
import { useTheme } from '@src/hooks/useTheme';
import { HomeStackParamList, RootStackParamList } from '@src/navigation/types';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { isIos } from '@src/utils/platformCheck';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { COLLECTION_TYPE, SORTING_TYPE } from '@src/config/enum';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { ToggleBookmarkResponse } from '@src/models/main/Home/StoryPage/StoryPage';
import { SearchContentItem } from '@src/models/main/MyAccount/Bookmarks';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { CarouselItem } from '@src/models/main/Home/StoryPage/StoryPage';
import { CarouselData } from '@src/models/main/Opinion/Opinion';
import { type Topic } from '@src/views/organisms/TopicChips';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

/**
 * Custom React hook that manages the view model logic for the "Programs" screen in the Videos section.
 *
 * Handles fetching and pagination of programs data, navigation between program details,
 * channel/topic switching, and error/retry logic. Integrates with translation, theming,
 * and authentication stores.
 *
 * @returns {object} An object containing:
 * - `t`: Translation function from i18n.
 * - `theme`: Current theme object.
 * - `goBack`: Function to handle back navigation or slug history pop.
 * - `chipsTopic`: Array of available program channels/topics.
 * - `programasNPlusData`: List of program items for the current channel/page.
 * - `onProgramsTogglePress`: Handler to switch between program channels/topics.
 * - `hasMore`: Boolean indicating if more programs can be loaded (pagination).
 * - `programsLoading`: Boolean indicating if programs data is loading.
 * - `handleLoadMore`: Handler to fetch the next page of programs.
 * - `programData`: Data for the currently selected program.
 * - `slug`: Current program slug.
 * - `handleCardPress`: Handler for selecting a program card (updates slug/history).
 * - `isInternetConnection`: Boolean indicating internet connectivity status.
 * - `onRetry`: Handler to retry fetching data on error.
 * - `flatListRef`: Ref to the FlatList component for scrolling.
 * - `programsError`: Error object from programs query.
 * - `refreshLoader`: Boolean indicating if a refresh is in progress.
 */

const useSearchLandingPageViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInternetConnection } = useNetworkStore();
  const flatListRef = useRef<FlatList>(null);
  const { guestToken } = useAuthStore();
  const route = useRoute<RouteProp<HomeStackParamList, 'SearchScreen'>>();
  const { showSearchResult, searchText } = route.params;

  const normalizeSearchQuery = (raw: string): string => {
    let q = (raw || '').trim();
    q = q.replace(/\./g, '');
    q = q.replace(/[-_+]/g, ' ');
    q = q.replace(/[!,?;:]/g, ' ');
    q = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    q = q.replace(/[^\p{L}\p{N}\s]/gu, ' ');
    q = q.replace(/\s+/g, ' ').trim();

    return q.toLowerCase();
  };

  const onRefreshResults = async () => {
    setRefreshLoader(true);
    try {
      const raw = (methods.getValues('searchText') ?? '').trim();
      const query = normalizeSearchQuery(raw || currentSearch);
      const result = await refetchSearchPayloadContent({
        input: {
          search: query,
          // sorting: sorting,
          collection: collection,
          isBookmarked: true,
          limit: 10,
          cursor: null
        }
      });
      const list = (result?.data?.SearchPayloadContent?.data ?? []) as SearchContentItem[];
      const pagination = result?.data?.SearchPayloadContent?.pagination;
      setSearchItems(list);
      setNextCursor(pagination?.nextCursor ?? null);
      setHasNext(Boolean(pagination?.hasNext));
    } finally {
      setRefreshLoader(false);
    }
  };

  const [currentSearch, setCurrentSearch] = useState<string>(
    normalizeSearchQuery(searchText ?? '')
  );
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [volume, setVolume] = useState<string>('');
  const [isSearchBar, setIsSearchBar] = useState<boolean>(false);
  const [collection, setCollection] = useState<COLLECTION_TYPE>(COLLECTION_TYPE.VIDEOS);
  const [sorting, setSorting] = useState<SORTING_TYPE>(SORTING_TYPE.MOST_RECENT);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { recentSearches, addSearchTerm, clearHistory } = useSearchHistoryStore();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const micSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iosForceCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stopRecordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [voiceError, setVoiceError] = useState<string>('');
  const isClosingRef = useRef<boolean>(false);
  const [searchItems, setSearchItems] = useState<SearchContentItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasPermissionAsked, setHasPermissionAsked] = useState(false);

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const v = Math.max(0, Math.min(1, isNaN(parseFloat(volume)) ? 0 : parseFloat(volume) / 10));
    Animated.timing(pulse, {
      toValue: v,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [volume]);

  const slideAnim = useMemo(() => new Animated.Value(1000), []);
  const collapsedWidth = SCREEN_WIDTH * 0.7;
  const expandedWidth = SCREEN_WIDTH * 0.906;
  const widthAnim = useRef(
    new Animated.Value(isSearchBar ? expandedWidth : collapsedWidth)
  ).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isSearchBar ? expandedWidth : collapsedWidth,
      duration: isSearchBar ? 520 : 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [isSearchBar]);

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  const methods = useForm({
    defaultValues: {
      searchText: ''
    }
  });
  useEffect(() => {
    methods.setValue('searchText', spokenText, { shouldDirty: true, shouldValidate: true });
  }, [spokenText]);

  const contentChip = [
    { title: 'Videos', collection: COLLECTION_TYPE.VIDEOS },
    { title: 'Noticias', collection: COLLECTION_TYPE.POSTS },
    { title: 'Liveblogs', collection: COLLECTION_TYPE.LIVE_BLOGS },
    { title: 'Interactivos', collection: COLLECTION_TYPE.INTERACTIVOS },
    { title: 'Programas', collection: COLLECTION_TYPE.PROGRAMS },
    { title: 'Autores', collection: COLLECTION_TYPE.AUTHORS },
    { title: 'Sala de Prensa', collection: COLLECTION_TYPE.PRESS_ROOM }
  ];

  const contentChipTopics = (contentChip ?? []).map(
    (c: { title: string; collection: COLLECTION_TYPE }) => ({
      title: c.title,
      slug: c.collection
    })
  );

  const {
    data: mostPopularSearchContentData,
    loading: mostPopularSearchContentLoading,
    refetch: refetchMostPopularSearchContent
  } = useQuery(GET_MOST_POPULAR_SEARCH_CONTENT_QUERY, {
    variables: {
      limit: 3
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const { data: searchPayloadData } = useQuery(SEARCH_PAYLOAD_QUERY, {
    variables: {
      input: {
        search: normalizeSearchQuery(methods.watch('searchText') ?? ''),
        collection: collection
      }
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: mostInterestedContentData,
    loading: mostInterestedContentLoading,
    refetch: refetchMostInterestedContent
  } = useQuery(GET_MOST_INTERESTED_CONTENT_QUERY, {
    variables: { limit: 4, count: 3 },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const {
    data: searchPayloadContentData,
    loading: searchPayloadContentLoading,
    refetch: refetchSearchPayloadContent
  } = useQuery(SEARCH_PAYLOAD_CONTENT_QUERY, {
    variables: {
      input: {
        search: currentSearch,
        // sorting: sorting,
        collection: collection,
        isBookmarked: true,
        cursor: null,
        limit: 10
      }
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    returnPartialData: false
  });

  useEffect(() => {
    const list = (searchPayloadContentData?.SearchPayloadContent?.data ??
      []) as SearchContentItem[];
    const pagination = searchPayloadContentData?.SearchPayloadContent?.pagination;

    if (!loadingMore) {
      setSearchItems(list);
    }

    setNextCursor(pagination?.nextCursor ?? null);
    setHasNext(Boolean(pagination?.hasNext));

    if (currentSearch) {
      logContentViewEvent({
        idPage: ANALYTICS_ID_PAGE.RESULTADOS_SEARCH,
        screen_name: ANALYTICS_PAGE.RESULTADOS_SEARCH,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH
      });
    }
  }, [searchPayloadContentData, currentSearch, collection]);

  const {
    data: getMostViewedTopicsData,
    loading: getMostViewedTopicsLoading,
    refetch: refetchGetMostViewedTopics
  } = useQuery(GET_MOST_VIEWED_TOPICS_QUERY, {
    variables: {
      input: {
        limit: 5
      }
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    returnPartialData: false
  });

  const [setToggleBookmark] = useMutation<ToggleBookmarkResponse>(TOGGLE_BOOKMARK_MUTATION, {
    fetchPolicy: 'network-only'
  });

  const onChipPress = (collectionKey: COLLECTION_TYPE) => {
    if (collectionKey === collection) return;

    const raw = (methods.getValues('searchText') ?? '').trim();
    const query = normalizeSearchQuery(raw || currentSearch);
    setCurrentSearch(query);

    setCollection(collectionKey);
    setSearchItems([]);
    setNextCursor(null);
    setHasNext(false);
  };

  const onLoadMore = async () => {
    if (!hasNext || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const raw = (methods.getValues('searchText') ?? '').trim();
      const query = normalizeSearchQuery(raw || currentSearch);
      const result = await refetchSearchPayloadContent({
        input: {
          search: query,
          // sorting: sorting,
          collection: collection,
          isBookmarked: true,
          limit: 10,
          cursor: nextCursor
        }
      });
      const newList = (result?.data?.SearchPayloadContent?.data ?? []) as SearchContentItem[];
      const pagination = result?.data?.SearchPayloadContent?.pagination;
      setSearchItems((prev: SearchContentItem[]) => [...prev, ...newList]);
      setNextCursor(pagination?.nextCursor);
      setHasNext(Boolean(pagination?.hasNext));
      setLoadingMore(false);
    } catch {
      setLoadingMore(false);
    }
  };

  const onSelectSorting = (value: SORTING_TYPE) => {
    if (value === sorting) return;
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.RESULTADOS_SEARCH,
      screen_name: ANALYTICS_PAGE.RESULTADOS_SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.FILTER_WITH_ICON_Filters,
      content_type:
        value === 'RELEVANCE'
          ? ANALYTICS_MOLECULES.SEARCH.RELEVANCIA
          : ANALYTICS_MOLECULES.SEARCH.RECIENTE,
      content_name:
        value === 'RELEVANCE'
          ? ANALYTICS_MOLECULES.SEARCH.RELEVANCIA
          : ANALYTICS_MOLECULES.SEARCH.RECIENTE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setSorting(value);
    setSearchItems([]);
    setNextCursor(null);
    setHasNext(false);
    const raw = (methods.getValues('searchText') ?? '').trim();
    const query = normalizeSearchQuery(raw || currentSearch);
    refetchSearchPayloadContent({
      input: {
        search: query,
        // sorting: value,
        collection: collection,
        isBookmarked: true,
        limit: 10
      }
    });
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: showSearchResult ? ANALYTICS_ID_PAGE.RESULTADOS_SEARCH : ANALYTICS_ID_PAGE.SEARCH,
      screen_name: showSearchResult ? ANALYTICS_PAGE.RESULTADOS_SEARCH : ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: showSearchResult
        ? `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`
        : `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_HEADER,
      content_type: ANALYTICS_MOLECULES.SEARCH.BACK,
      content_name: ANALYTICS_MOLECULES.SEARCH.BACK,
      screen_page_web_url: showSearchResult
        ? SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH
        : SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
    if (showSearchResult) {
      setCollection(COLLECTION_TYPE.VIDEOS);
      methods.setValue('searchText', '');
      setSearchItems([]);
      setNextCursor(null);
      setHasNext(false);
      (navigation as unknown as { setParams: (p: unknown) => void }).setParams?.({
        showSearchResult: false
      });
      return;
    }
    navigation.goBack();
  };

  useEffect(() => {
    methods.setValue('searchText', (searchText ?? '').trim());
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    logContentViewEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH
    });

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (micSilenceTimerRef.current) clearTimeout(micSilenceTimerRef.current);
      if (iosForceCloseTimerRef.current) clearTimeout(iosForceCloseTimerRef.current);
      if (stopRecordingTimerRef.current) clearTimeout(stopRecordingTimerRef.current);
    };
  }, []);

  const requestPermissions = async () => {
    if (!isIos) {
      const hasMic = !isIos
        ? await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        : false;
      try {
        if (hasPermissionAsked) {
          if (hasMic) {
            setHasPermission(true);
            setIsVoiceModalVisible(true);
            await Voice.start('es-ES');
            return;
          } else {
            Alert.alert(
              t('screens.search.text.permissions.requiredTitle'),
              t('screens.search.text.permissions.microphoneRequiredMessage'),
              [
                { text: t('screens.search.text.common.cancel'), style: 'cancel' },
                {
                  text: t('screens.search.text.common.ok'),
                  onPress: () => {
                    openSettings();
                  },
                  style: 'default'
                }
              ]
            );
            return;
          }
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          setIsVoiceModalVisible(true);
          setHasPermissionAsked(true);
          await Voice.start('es-ES');
        } else {
          setHasPermission(false);
          setHasPermissionAsked(true);
          Alert.alert(
            t('screens.search.text.permissions.requiredTitle'),
            t('screens.search.text.permissions.microphoneRequiredMessage'),
            [
              { text: t('screens.search.text.common.cancel'), style: 'cancel' },
              {
                text: t('screens.search.text.common.ok'),
                onPress: () => {
                  openSettings();
                },
                style: 'default'
              }
            ]
          );
        }
      } catch {
        setHasPermission(false);
      }
    } else {
      const status = await request(PERMISSIONS.IOS.MICROPHONE);
      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
        setIsVoiceModalVisible(true);
        await Voice.start('es-ES');
      } else if (status === RESULTS.BLOCKED) {
        setHasPermission(false);
        Alert.alert(
          t('screens.search.text.permissions.requiredTitle'),
          t('screens.search.text.permissions.microphoneRequiredMessage'),
          [
            { text: t('screens.search.text.common.cancel'), style: 'cancel' },
            {
              text: t('screens.search.text.common.ok'),
              onPress: () => {
                openSettings();
              },
              style: 'default'
            }
          ]
        );
      } else {
        setHasPermission(false);
        Alert.alert(
          t('screens.search.text.permissions.requiredTitle'),
          t('screens.search.text.permissions.microphoneRequiredMessage')
        );
      }
    }
    if (!isInternetConnection) {
      setVoiceError(t('screens.search.text.noInternetConnectionMicrophone'));
    }
    if (micSilenceTimerRef.current) clearTimeout(micSilenceTimerRef.current);
    micSilenceTimerRef.current = setTimeout(() => {
      if (methods.getValues('searchText').length === 0)
        setVoiceError(t('screens.search.text.voiceDidNotUnderstand'));
    }, 7000);
  };

  const onSpeechRecognized = () => {};

  const onSpeechEnd = async () => {
    if (methods.getValues('searchText')?.length === 0) {
      setVoiceError(t('screens.search.text.voiceDidNotUnderstand'));
      await Voice.stop();
      return;
    }
    await closeVoiceModal();
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (stopRecordingTimerRef.current) clearTimeout(stopRecordingTimerRef.current);
    stopRecordingTimerRef.current = setTimeout(() => {
      closeVoiceModal();
    }, 1500);

    const values = e.value && e.value?.length > 0 ? e.value : [];
    const text = values?.[0] ?? '';
    setSpokenText(text);
    methods.setValue('searchText', text, { shouldDirty: true, shouldValidate: true });
    if (text) setVoiceError('');
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    if (stopRecordingTimerRef.current) clearTimeout(stopRecordingTimerRef.current);
    stopRecordingTimerRef.current = setTimeout(() => {
      closeVoiceModal();
    }, 1500);

    const values = e.value && e.value?.length > 0 ? e.value : [];
    const partial = values?.[0] ?? '';
    setSpokenText(partial);
    methods.setValue('searchText', partial, { shouldDirty: true, shouldValidate: true });
    if (partial) setVoiceError('');
  };

  const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    setVolume(String(e.value));
  };

  const _startRecognizing = async () => {
    if (isVoiceModalVisible) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.SEARCH_AUDIO,
        screen_name: ANALYTICS_PAGE.SEARCH_AUDIO,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH_AUDIO}`,
        organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_AUDIO_BAR,
        content_type: ANALYTICS_MOLECULES.SEARCH.SEARCH_AUDIO_BAR,
        content_name: ANALYTICS_MOLECULES.SEARCH.IC_VOICE_SEARCH_CTA,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH_AUDIO,
        content_action: ANALYTICS_ATOMS.IC_VOICE_SEARCH_CTA
      });
    } else {
      logSelectContentEvent({
        idPage: showSearchResult ? ANALYTICS_ID_PAGE.RESULTADOS_SEARCH : ANALYTICS_ID_PAGE.SEARCH,
        screen_name: showSearchResult ? ANALYTICS_PAGE.RESULTADOS_SEARCH : ANALYTICS_PAGE.SEARCH,
        Tipo_Contenido: showSearchResult
          ? `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`
          : `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
        organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_HEADER,
        content_name: ANALYTICS_MOLECULES.SEARCH.AUDIO,
        screen_page_web_url: showSearchResult
          ? SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH
          : SCREEN_PAGE_WEB_URL.SEARCH,
        content_action: ANALYTICS_ATOMS.TAP
      });
    }
    try {
      await Voice.destroy();

      if (micSilenceTimerRef.current) clearTimeout(micSilenceTimerRef.current);
      if (iosForceCloseTimerRef.current) clearTimeout(iosForceCloseTimerRef.current);
      if (stopRecordingTimerRef.current) clearTimeout(stopRecordingTimerRef.current);

      isClosingRef.current = false;
      setSpokenText('');
      setVolume('');
      setVoiceError('');
      methods.reset({ searchText: '' });
      if (!hasPermission) {
        await requestPermissions();
        return;
      }

      Voice.removeAllListeners();
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;
      Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

      setIsVoiceModalVisible(true);
      await Voice.start('es-ES');
      if (!isInternetConnection) {
        setVoiceError(t('screens.search.text.noInternetConnectionMicrophone'));
      }
      if (micSilenceTimerRef.current) clearTimeout(micSilenceTimerRef.current);
      micSilenceTimerRef.current = setTimeout(() => {
        if (methods.getValues('searchText').length === 0)
          setVoiceError(t('screens.search.text.voiceDidNotUnderstand'));
      }, 5000);

      if (iosForceCloseTimerRef.current) clearTimeout(iosForceCloseTimerRef.current);

      iosForceCloseTimerRef.current = setTimeout(() => {
        if (methods.getValues('searchText').length > 0) {
          isClosingRef.current = true;
          closeVoiceModal();
        }
      }, 5000);
    } catch (e) {
      setToastMessage(String(e));
    }
  };

  const closeVoiceModal = async () => {
    if (stopRecordingTimerRef.current) clearTimeout(stopRecordingTimerRef.current);

    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH_AUDIO,
      screen_name: ANALYTICS_PAGE.SEARCH_AUDIO,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH_AUDIO}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_AUDIO_HEADER,
      content_type: ANALYTICS_MOLECULES.SEARCH.BACK,
      content_name: ANALYTICS_MOLECULES.SEARCH.BACK,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH_AUDIO,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setTimeout(async () => {
      try {
        await Voice.stop();
      } finally {
        setIsVoiceModalVisible(false);
        const rawQuery = (methods.getValues('searchText') ?? '').trim();
        await triggerResultsFromQuery(rawQuery);
        isClosingRef.current = false;
        if (iosForceCloseTimerRef.current) clearTimeout(iosForceCloseTimerRef.current);
        if (micSilenceTimerRef.current) clearTimeout(micSilenceTimerRef.current);
      }
    }, 1000);
  };

  const triggerResultsFromQuery = async (raw: string) => {
    const rawQuery = (raw ?? '').trim();
    const normalized = normalizeSearchQuery(rawQuery);
    if (normalized.length === 0) return;

    if (!showSearchResult) {
      (navigation as unknown as { setParams: (p: unknown) => void }).setParams?.({
        showSearchResult: true,
        searchText: rawQuery
      });
      if (collection !== COLLECTION_TYPE.VIDEOS) {
        setCollection(COLLECTION_TYPE.VIDEOS);
      }
    }

    setCurrentSearch(normalized);
    addSearchTerm({ title: rawQuery });
    setSearchItems([]);
    setNextCursor(null);
    setHasNext(false);
  };

  const onRetry = async () => {
    setRefreshLoader(true);
    try {
      await Promise.all([
        refetchMostPopularSearchContent({
          limit: 3
        }),
        refetchGetMostViewedTopics({
          limit: 5
        }),
        refetchMostInterestedContent({
          limit: 4,
          count: 3
        })
      ]);
    } finally {
      setRefreshLoader(false);
    }
  };

  const handleSearchResultPress = (item: {
    title?: string;
    slug?: string;
    collection?: string;
  }) => {
    const raw = (item?.title ?? '').trim();
    const slug = (item?.slug ?? '').trim();
    const collectionKey = item?.collection;

    if (slug && collectionKey) {
      if (collectionKey === 'videos') {
        handleSearchNavigation({
          routeName: routeNames.VIDEOS_STACK,
          screenName: screenNames.VIDEO_DETAIL_PAGE,
          slug
        });
        addSearchTerm({ title: raw || slug, slug, collection: collectionKey });
        setIsSearchBar(false);
        return;
      }

      if (collectionKey === 'posts') {
        handleSearchNavigation({
          routeName: routeNames.HOME_STACK,
          screenName: screenNames.STORY_PAGE_RENDERER,
          slug
        });
        addSearchTerm({ title: raw || slug, slug, collection: collectionKey });
        setIsSearchBar(false);
        return;
      }
    }
    methods.setValue('searchText', raw, { shouldDirty: true, shouldValidate: true });
    if (!showSearchResult) {
      if (collection !== COLLECTION_TYPE.VIDEOS) {
        setCollection(COLLECTION_TYPE.VIDEOS);
        setSearchItems([]);
        setNextCursor(null);
        setHasNext(false);
      }
      (navigation as unknown as { setParams: (p: unknown) => void }).setParams?.({
        showSearchResult: true,
        searchText: raw
      });
    }
    triggerResultsFromQuery(raw);
    addSearchTerm({ title: raw });
    setIsSearchBar(false);
  };

  const onToggleBookmark = async (contentId: string, type: string) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }

    try {
      const result = await setToggleBookmark({
        variables: { input: { contentId, type } }
      });

      if (result.data?.toggleBookmark?.success) {
        setToastType('success');
        setToastMessage(
          result.data.toggleBookmark.message ||
            t('screens.storyPage.author.bookmarkUpdatedSuccessfully')
        );
      } else {
        setToastType('error');
        setToastMessage(
          result.data?.toggleBookmark?.message ||
            t('screens.storyPage.author.failedToUpdateBookmark')
        );
      }
    } catch {
      setToastType('error');
      setToastMessage(t('screens.login.text.somethingWentWrong'));
    }
  };

  const handleSearchNavigation = ({
    routeName,
    screenName,
    slug,
    id
  }: {
    routeName: string;
    screenName: string;
    slug?: string;
    id?: string;
  }) => {
    const params: Record<string, unknown> = {};
    if (slug) params.slug = slug;
    if (id) params.id = id;

    (navigation as unknown as { navigate: (routeName: string, params: unknown) => void }).navigate(
      routeName,
      {
        screen: screenName,
        params
      }
    );
  };

  const onCardPress = (item: { collection?: string; slug?: string; id?: string }) => {
    if (!item?.collection) return;

    if (item.collection === 'videos') {
      handleSearchNavigation({
        routeName: routeNames.VIDEOS_STACK,
        screenName: screenNames.VIDEO_DETAIL_PAGE,
        slug: item?.slug
      });
    } else {
      handleSearchNavigation({
        routeName: routeNames.HOME_STACK,
        screenName: screenNames.STORY_PAGE_RENDERER,
        slug: item?.slug
      });
    }
  };

  const handleInteractiveResearchPress = ({ interactiveUrl }: { interactiveUrl?: string }) => {
    const url = interactiveUrl;

    if (url) {
      setWebUrl(Config.WEBSITE_BASE_URL + url);
      setShowWebView(true);
    }
  };

  const onCategoryPress = (item?: {
    id?: string;
    slug?: string;
    title?: string;
    type?: 'category' | 'topic';
  }) => {
    if (!item?.title) return;

    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.CATEGORY_DETAIL_SCREEN,
      params: {
        id: item?.id || '',
        slug: item?.slug || '',
        title: item?.title || '',
        type: 'topic'
      }
    });
  };

  const onMostPopularSearchPress = (item: CarouselItem, index: number) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.BÚSQUEDAS_POPULARES,
      content_type: `${ANALYTICS_MOLECULES.SEARCH.NEWS_CARD} | ${index + 1}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.SEARCH.NEWS_CARD,
      content_title: item?.title
    });
    onCardPress({
      collection: item?.collection,
      slug: item?.slug,
      id: item?.id
    });
  };

  const onTopicChipPress = (value: string | Topic, index: number) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.INTERESES,
      content_type: `${ANALYTICS_MOLECULES.SEARCH.PILL} | ${index + 1}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.SEARCH.PILL,
      content_title: typeof value === 'string' ? value : value.title
    });
    if (typeof value === 'string') {
      onCategoryPress({ title: value });
    } else {
      onCategoryPress(value);
    }
  };

  const onInterestedContentPress = (item: CarouselData, index: number) => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.PODRÍA_INTERESARTE,
      content_type: `${ANALYTICS_MOLECULES.SEARCH.CAROUSEL_CARD} | ${index + 1}`,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP,
      content_name: ANALYTICS_MOLECULES.SEARCH.CAROUSEL_CARD,
      content_title: item?.title
    });
    onCardPress(item);
  };

  const onSearchResultPress = (item: SearchContentItem, collectionType: string, index?: number) => {
    const mapping =
      CONTENT_TYPE_ANALYTICS_MAPPING[collectionType as keyof typeof CONTENT_TYPE_ANALYTICS_MAPPING];
    if (mapping) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.RESULTADOS_SEARCH,
        screen_name: ANALYTICS_PAGE.RESULTADOS_SEARCH,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`,
        organisms: ANALYTICS_ORGANISMS.SEARCH_RESULTS,
        content_type: index ? `${mapping.molecule} | ${index}` : mapping.molecule,
        content_name: index ? `${mapping.molecule} | ${index}` : mapping.molecule,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH,
        content_action: ANALYTICS_ATOMS.TAP_IN_TEXT,
        content_title: item?.title,
        categories: item?.category?.title,
        etiquetas: item?.topics
          ?.map((t) => t?.title)
          .filter(Boolean)
          .join(',')
      });
    }
  };

  const onSearchResultBookmarkPress = (
    item: SearchContentItem,
    collectionType: string,
    isBookmarked: boolean,
    title?: string,
    index?: number
  ) => {
    const mapping =
      CONTENT_TYPE_ANALYTICS_MAPPING[collectionType as keyof typeof CONTENT_TYPE_ANALYTICS_MAPPING];
    if (mapping) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.RESULTADOS_SEARCH,
        screen_name: ANALYTICS_PAGE.RESULTADOS_SEARCH,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`,
        organisms: ANALYTICS_ORGANISMS.SEARCH_RESULTS,
        content_type: `${mapping.molecule} | ${index}`,
        content_name: isBookmarked
          ? ANALYTICS_MOLECULES.SEARCH.BOOKMARK
          : ANALYTICS_MOLECULES.SEARCH.UNBOOKMARK,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH,
        content_action: isBookmarked
          ? ANALYTICS_MOLECULES.SEARCH.BOOKMARK
          : ANALYTICS_MOLECULES.SEARCH.UNBOOKMARK,
        categories: item?.category?.title,
        content_title: item?.title ?? title,
        etiquetas: item?.topics
          ?.map((t) => t?.title)
          .filter(Boolean)
          .join(',')
      });
    }
  };

  const handleMostPopularSearchPress = (item: CarouselItem) => {
    const index =
      mostPopularSearchContentData?.GetMostPopularSearchContent?.findIndex(
        (originalItem: CarouselItem) => originalItem.id === item.id
      ) ?? 0;
    onMostPopularSearchPress(item, index);
  };

  const handleTopicChipPress = (value: string | Topic) => {
    const index =
      getMostViewedTopicsData?.GetMostViewedTopics?.findIndex((topic: Topic) =>
        typeof value === 'string' ? topic.title === value : topic.title === (value as Topic).title
      ) ?? 0;
    onTopicChipPress(value, index);
  };

  const handleInterestedContentPress = (item: CarouselData) => {
    const index =
      mostInterestedContentData?.GetMostInterestedContent?.findIndex(
        (originalItem: CarouselData) => originalItem.id === item.id
      ) ?? 0;
    onInterestedContentPress(item, index);
  };

  const handleTopicChipPressAnalytics = (value: string | Topic, index: number) => {
    const contentTypeMap: Record<string, string> = {
      videos: 'Content type Pill Video',
      posts: 'Content type Pill Noticias',
      liveblogs: 'Content type Pill Liveblog',
      programs: 'Content type Pill Programas',
      press_room: 'Content type Pill Sala de prensa',
      podcasts: 'Content type Pill Podcast',
      maps: 'Content type Pill Mapas',
      authors: 'Content type Pill Autores'
    };

    const contentName =
      typeof value === 'string'
        ? contentTypeMap[value] || 'Content type Pill'
        : 'Content type Pill';

    logSelectContentEvent({
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH_LANDING_SCREEN.CONTENT_TYPE,
      content_type: `${ANALYTICS_MOLECULES.SEARCH_LANDING_SCREEN.CATEGORY_PILL} | ${index + 1}`,
      content_name: contentName,
      content_action: ANALYTICS_ATOMS.TAP
    });
  };

  const handleSearchResultBookmarkPress = (
    contentId: string,
    contentType: string,
    title?: string,
    index?: number
  ) => {
    // Find the item that was bookmarked for analytics
    const bookmarkedItem =
      searchItems?.find((item: SearchContentItem) => item.id === contentId) ||
      searchPayloadContentData?.SearchPayloadContent?.data?.find(
        (item: SearchContentItem) => item.id === contentId
      );

    if (bookmarkedItem && !guestToken) {
      // Check if the item is currently bookmarked
      const isCurrentlyBookmarked = bookmarkedItem.isBookmarked;
      onSearchResultBookmarkPress(bookmarkedItem, collection, !isCurrentlyBookmarked, title, index);
    }

    onToggleBookmark(contentId, contentType);
  };

  const handleSearchBarTapAnalytics = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_BAR,
      content_type: ANALYTICS_MOLECULES.SEARCH.SEARCH_BAR,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const handleSearchBarCloseAnalytics = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.SEARCH,
      screen_name: ANALYTICS_PAGE.SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.SEARCH_BAR,
      content_name: ANALYTICS_MOLECULES.SEARCH.CLOSE,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const handleFilterIconAnalytics = useCallback(() => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.RESULTADOS_SEARCH,
      screen_name: ANALYTICS_PAGE.RESULTADOS_SEARCH,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.SEARCH}_${ANALYTICS_PAGE.RESULTADOS_SEARCH}`,
      organisms: ANALYTICS_ORGANISMS.SEARCH.FILTER_WITH_ICON,
      content_type: ANALYTICS_MOLECULES.SEARCH.FILTER_WITH_ICON,
      content_name: ANALYTICS_MOLECULES.SEARCH.FILTER_WITH_ICON,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.RESULTADOS_SEARCH,
      content_action: ANALYTICS_ATOMS.TAP
    });
  }, []);

  const CONTENT_TYPE_ANALYTICS_MAPPING = {
    [COLLECTION_TYPE.VIDEOS]: {
      molecule: `${ANALYTICS_MOLECULES.SEARCH.CARD_STYLE}/1`
    },
    [COLLECTION_TYPE.POSTS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.NEWS_SECTION
    },
    [COLLECTION_TYPE.LIVE_BLOGS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.LIVE_BLOG
    },
    [COLLECTION_TYPE.TALENTS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.TALENT
    },
    [COLLECTION_TYPE.PROGRAMS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.VIDEO_CARD
    },
    [COLLECTION_TYPE.PRESS_ROOM]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.OPINION_NEWS_CARD
    },
    [COLLECTION_TYPE.PODCASTS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE
    },
    [COLLECTION_TYPE.INTERACTIVOS]: {
      molecule: ANALYTICS_MOLECULES.SEARCH.CARD_STYLE
    },
    [COLLECTION_TYPE.AUTHORS]: {
      molecule: `${ANALYTICS_MOLECULES.SEARCH.TALENT}/1`
    }
  } as const;

  return {
    t,
    theme,
    goBack,
    isInternetConnection,
    onRetry,
    flatListRef,
    refreshLoader,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    toastMessage,
    setToastMessage,
    mostPopularSearchContentData: mostPopularSearchContentData?.GetMostPopularSearchContent,
    mostPopularSearchContentLoading,
    methods,
    _startRecognizing,
    isVoiceModalVisible,
    setIsVoiceModalVisible,
    closeVoiceModal,
    spokenText,
    voiceError,
    volume,
    widthAnim,
    slideAnim,
    setIsSearchBar,
    isSearchBar,
    searchPayloadData: searchPayloadData?.SearchPayload,
    handleSearchResultPress,
    contentChip,
    contentChipTopics,
    showSearchResult,
    onChipPress,
    sorting,
    setSorting,
    isFilterVisible,
    setIsFilterVisible,
    onSelectSorting,
    searchPayloadContentData: (searchPayloadContentData?.SearchPayloadContent?.data ??
      undefined) as SearchContentItem[] | undefined,
    searchItems,
    hasNext,
    loadingMore,
    onLoadMore,
    onRefreshResults,
    searchPayloadContentLoading,
    collection,
    onToggleBookmark,
    toastType,
    getMostViewedTopicsData: getMostViewedTopicsData?.GetMostViewedTopics,
    handleSearchNavigation,
    getMostViewedTopicsLoading,
    mostInterestedContentData,
    mostInterestedContentLoading,
    onCardPress,
    recentSearches,
    clearSearchHistory: clearHistory,
    handleInteractiveResearchPress,
    showWebView,
    setShowWebView,
    webUrl,
    onCategoryPress,
    onMostPopularSearchPress,
    onTopicChipPress,
    onInterestedContentPress,
    onSearchResultPress,
    onSearchResultBookmarkPress,
    handleMostPopularSearchPress,
    handleTopicChipPress,
    handleInterestedContentPress,
    handleSearchResultBookmarkPress,
    handleTopicChipPressAnalytics,
    handleSearchBarTapAnalytics,
    handleSearchBarCloseAnalytics,
    handleFilterIconAnalytics
  };
};

export default useSearchLandingPageViewModel;
