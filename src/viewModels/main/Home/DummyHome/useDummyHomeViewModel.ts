import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackHandler } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { HomeViewModel } from '@src/models/main/Home/Home';
import { POSTS_QUERY } from '@src/graphql/main/home/queries';

/**
 * DummyHome ViewModel hook for fetching and managing home page posts.
 * Handles navigation and translation utilities for Home screen features.
 */

const useDummyHomeViewModel = (): HomeViewModel => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);

  const {
    data: postsData,
    loading: postsLoading,
    refetch: refetchPosts
  } = useQuery(POSTS_QUERY, {
    variables: {
      sort: '-updatedAt'
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const openStoryPage = (slug: string): void => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.STORY_PAGE_RENDERER,
      params: { slug }
    });
  };

  const onSeeAllActiveLiveBLogsPress = useCallback(() => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.ACTIVE_LIVE_BLOG_LISTING
    });
  }, []);

  const onSeeLiveTVPress = useCallback(() => {
    navigation.navigate(routeNames.HOME_STACK, {
      screen: screenNames.LIVE_TV,
      params: {}
    });
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshLoader(true);
      await Promise.all([refetchPosts()]);
      setRefreshLoader(false);
    } catch {
      setRefreshLoader(false);
    }
  };

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: routeNames.HOME_STACK,
          params: {
            screen: screenNames.HOME
          }
        }
      ]
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => backHandler.remove();
  }, [goBack]);

  return {
    t,
    theme,
    storySlugs: postsData?.GetPosts?.docs,
    openStoryPage,
    onSeeAllActiveLiveBLogsPress,
    onSeeLiveTVPress,
    goBack,
    postsLoading,
    refreshLoader,
    onRefresh
  };
};

export default useDummyHomeViewModel;
