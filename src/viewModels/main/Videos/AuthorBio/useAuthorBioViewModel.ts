import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ToggleBookmarkResponse } from '@src/models/main/Home/StoryPage/AuthorDetails';
import { useTheme } from '@src/hooks/useTheme';
import { IS_BOOKMARKED_BY_USER_QUERY } from '@src/graphql/main/home/queries';
import { TOGGLE_BOOKMARK_MUTATION } from '@src/graphql/main/home/mutations';
import { RootStackParamList, VideosStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { TALENT_QUERY } from '@src/graphql/main/videos/queries';
import { Talent, UserResponse } from '@src/models/main/Videos/Programs';
import { ProgramasItem } from '@src/models/main/Videos/Videos';
import { CHANNEL_TYPE } from '@src/config/enum';
import { shareContent } from '@src/utils/shareContent';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';

const useAuthorBioViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const { guestToken, clearAuth } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<VideosStackParamList, 'AuthorBio'>>();
  const { slug } = route.params || {};
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);

  const {
    data: authorBioData,
    error: authorBioError,
    loading: authorBioLoading,
    refetch: authorBioRefetch
  } = useQuery<UserResponse>(TALENT_QUERY, {
    variables: { slug },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  const [setToggleBookmark, { error: bookmarkToggleError }] = useMutation<ToggleBookmarkResponse>(
    TOGGLE_BOOKMARK_MUTATION,
    {
      fetchPolicy: 'network-only'
    }
  );

  const [toggleBookmarkByUser] = useLazyQuery(IS_BOOKMARKED_BY_USER_QUERY, {
    fetchPolicy: 'network-only'
  });

  const authorDetails: Talent | undefined = authorBioData?.Talent;
  const onRefresh = async () => {
    try {
      setRefreshLoader(true);
      await Promise.all([authorBioRefetch({ slug })]);
      setRefreshLoader(false);
    } catch {
      setRefreshLoader(false);
    }
  };

  const toggleBookmark = async (contentId: string | undefined) => {
    if (!contentId) return;
    const res = await toggleBookmarkByUser({
      variables: { contentId: contentId, type: 'Content' }
    });
    setIsBookmark(res.data.isBookmarkedByUser);
  };

  useEffect(() => {
    if (authorDetails?.id) {
      toggleBookmark(authorDetails.id);
    }
  }, [authorDetails?.id]);

  useEffect(() => {
    if (isInternetConnection) {
      setTimeout(async () => {
        await Promise.all([authorBioRefetch({ slug })]);
      }, 1500);
    }
  }, [isInternetConnection]);

  useEffect(() => {
    setLoading(false);
    if (authorBioError) {
      setErrorMsg(authorBioError.message);
    } else if (bookmarkToggleError) {
      setErrorMsg(bookmarkToggleError.message);
    }
  }, [authorBioError, bookmarkToggleError, loading]);

  const onToggleBookmark = async (contentId: string) => {
    if (guestToken) {
      setBookmarkModalVisible(true);
      return;
    }
    try {
      setIsBookmark(!isBookmark);
      const result = await setToggleBookmark({
        variables: { input: { contentId: contentId, type: 'Content' } }
      });

      logSelectContentEvent({
        idPage: ANALYTICS_PAGE.AUTHOR_BIO,
        screen_page_web_url: ANALYTICS_PAGE.AUTHOR_BIO,
        screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
        organisms: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR?.BUTTON_BOOKMARK,
        content_type: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_BOOKMARK,
        content_name: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_BOOKMARK,
        content_action: isBookmark ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK
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

  const onGoBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.AUTHOR_BIO,
      screen_page_web_url: ANALYTICS_PAGE.AUTHOR_BIO,
      screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
      organisms: ANALYTICS_ORGANISMS.VIDEO.HEADER,
      content_type: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_BACK,
      content_name: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const onShare = async () => {
    if (!authorDetails?.fullPath) return;
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.AUTHOR_BIO,
      screen_page_web_url: ANALYTICS_PAGE.AUTHOR_BIO,
      screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
      organisms: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_SHARE,
      content_type: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_SHARE,
      content_name: ANALYTICS_ORGANISMS.STORY_PAGE.TOP_NAVIGATION_BAR.BUTTON_SHARE,
      content_action: ANALYTICS_ATOMS.SHARE
    });
    await shareContent({ fullPath: authorDetails.fullPath });
  };

  const onCancelPress = () => {
    setBookmarkModalVisible(false);
    clearAuth(true);
  };

  const onConfirmPress = () => {
    setBookmarkModalVisible(false);
    clearAuth();
  };

  const handleCardPress = useCallback((data: ProgramasItem, index: number) => {
    if (!data?.slug) return;
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.AUTHOR_BIO,
      screen_page_web_url: data?.slug,
      screen_name: ANALYTICS_PAGE.AUTHOR_BIO,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.PROGRAMAS}_${ANALYTICS_PAGE.AUTHOR_BIO}`,
      organisms: ANALYTICS_ORGANISMS.VIDEO.PROHRAMAS_DE,
      content_type: `${ANALYTICS_MOLECULES.MY_ACCOUNT.VIDEO_CARD} | ${index + 1}`,
      content_title: data?.title,
      content_name: ANALYTICS_MOLECULES.MY_ACCOUNT.VIDEO_CARD,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.PROGRAMS,
      params: { slug: data.slug, id: data?.id, channel: CHANNEL_TYPE.NOTICIEROS }
    });
  }, []);

  return {
    theme,
    t,
    onGoBack,
    authorDetails,
    authorBioLoading,
    errorMsg,
    setErrorMsg,
    onToggleBookmark,
    onShare,
    isBookmark,
    setIsBookmark,
    setLoading,
    loading,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    navigation,
    onCancelPress,
    onConfirmPress,
    toastType,
    toastMessage,
    setToastMessage,
    onRefresh,
    refreshLoader,
    handleCardPress,
    isInternetConnection
  };
};

export default useAuthorBioViewModel;
