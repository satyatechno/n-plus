import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ALL_NEWSLETTERS_QUERY,
  UNSUBSCRIBE_REASONS_QUERY,
  USER_NEWSLETTERS_QUERY
} from '@src/graphql/main/MyAccount/queries';
import {
  ChangeNewsletterSubscriptionResult,
  GetNewsletterUnsubscribeReasonsResponse,
  Newsletter,
  NewslettersViewModel
} from '@src/models/main/MyAccount/Newsletters';
import { useTheme } from '@src/hooks/useTheme';
import { MyAccountStackParamList } from '@src/navigation/types';
import { CHANGE_NEWSLETTER_SUBSCRIPTION_MUTATION } from '@src/graphql/main/MyAccount/mutations';
import useUserStore from '@src/zustand/main/userStore';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { screenNames } from '@src/navigation/screenNames';
import { SocialMediaAuthFormValues } from '@src/models/auth/SocialMediaAuth';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

const useNewslettersViewModel = (): NewslettersViewModel => {
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const route = useRoute();
  const selectedNewsletters = (
    route.params as { selectedNewsletters?: { newsletter: string; isSubscribed: boolean }[] }
  )?.selectedNewsletters;
  const [mySubscriptions, setMySubscriptions] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [buttonInToast, setButtonInToast] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToastType, setShowToastType] = useState<string>('');
  const [unSubscribeAll, setUnSubscribeAll] = useState<boolean>(false);
  const [unSubscribeReason, setUnSubscribeReason] = useState<string[]>([]);
  const [IsClickUndoButton, setIsClickUndoButton] = useState<boolean>(false);
  const [changeSubscriptionLoading, setChangeSubscriptionLoading] = useState<boolean>(false);
  const { userData } = useUserStore();
  const { clearAuth, guestToken } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [internetFail, setinternetFail] = useState<boolean>(isInternetConnection);
  const [internetLoader, setInternetLoader] = useState<boolean>(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<
    { newsletter: string; isSubscribed: boolean }[]
  >([]);

  const [newsletterSubscribedUndo, setNewsletterSubscribedUndo] = useState<
    { newsletter: string; isSubscribed: boolean }[]
  >([]);

  const [newsletterNotSubscribed, setNewsletterNotSubscribed] = useState<
    { newsletter: string; isSubscribed: boolean }[]
  >([]);

  const [latestAllNewsletters, setLatestAllNewsletters] = useState<Newsletter[]>([]);
  const [latestUserNewsletters, setLatestUserNewsletters] = useState<Newsletter[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const [getAllNewsletters, { loading: getAllNewslettersLoading, error: getAllNewslettersError }] =
    useLazyQuery<{ getAllNewsletters: Newsletter[] }>(ALL_NEWSLETTERS_QUERY, {
      fetchPolicy: 'no-cache'
    });

  const [
    getUnSubscribeReasons,
    { data: unSubscribeData, loading: unSubscribeLoading, error: unSubscribeError }
  ] = useLazyQuery<GetNewsletterUnsubscribeReasonsResponse>(UNSUBSCRIBE_REASONS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  const [changeSubscription, { data: changeSubscriptionData, error: changeSubscriptionError }] =
    useMutation<ChangeNewsletterSubscriptionResult>(CHANGE_NEWSLETTER_SUBSCRIPTION_MUTATION, {
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true
    });

  const [getUserNewsletters, { error: userNewslettersError }] = useLazyQuery<{
    getUserNewsletters: Newsletter[];
  }>(USER_NEWSLETTERS_QUERY, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true
  });

  const fetchAllNewsletters = async () => {
    const res = await getAllNewsletters({ fetchPolicy: 'network-only' });
    setLatestAllNewsletters(res.data?.getAllNewsletters ?? []);
  };

  const fetchUserNewsletters = async () => {
    const res = await getUserNewsletters({
      fetchPolicy: 'network-only',
      variables: { input: { isSubscribed: true } }
    });
    setLatestUserNewsletters(res.data?.getUserNewsletters ?? []);
  };

  const fetchNewslettersWithDelay = async () => {
    await fetchUserNewsletters();
    await fetchAllNewsletters();
  };

  useEffect(() => {
    getUnSubscribeReasons();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllNewsletters();
      fetchUserNewsletters();
    }, [])
  );

  useEffect(() => {
    setInternetLoader(false);
    const error = changeSubscriptionError ?? getAllNewslettersError ?? unSubscribeError;
    const isNetworkError =
      error?.message === 'Network request failed' || error?.message === 'Unauthorized';
    if (error) {
      if (isInternetConnection) {
        setButtonInToast('');
        if ('graphQLErrors' in error && Array.isArray(error.graphQLErrors)) {
          const graphQLError = error.graphQLErrors[0];
          setToastMessage(
            graphQLError?.extensions?.message ?? t('screens.recommendedForYou.text.resendError')
          );
        }
        setShowToastType('error');
        setAlertVisible(isNetworkError ? false : true);
        setinternetFail(true);
        setChangeSubscriptionLoading(false);
      } else {
        setinternetFail(false);
        setChangeSubscriptionLoading(false);
      }
    } else {
      setInternetLoader(false);
    }
    if (changeSubscriptionData && !IsClickUndoButton) {
      if (mySubscriptions) {
        setShowToastType('success');
        setButtonInToast('Deshacer');
        setToastMessage(
          unSubscribeAll
            ? t('screens.newsletters.text.unsubscribedFromAllOurNewsletters')
            : t('screens.newsletters.text.unsubscribedFromThisNewsletter')
        );
        setAlertVisible(true);
      } else {
        setButtonInToast('');
        setShowToastType('success');
        setToastMessage(t('screens.newsletters.text.subscribeSuccess'));
        setAlertVisible(true);
        AnalyticsService.logEvent('profile_newsletter_subscribe');
      }
    }
  }, [
    changeSubscriptionError,
    changeSubscriptionData,
    getAllNewslettersError,
    unSubscribeError,
    userNewslettersError
  ]);

  const onSubmit = async (customReason?: string) => {
    setChangeSubscriptionLoading(true);
    const screenName = ANALYTICS_COLLECTION.MY_ACCOUNT;
    const tipoContenido = `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`;

    if (!mySubscriptions && newsletterSubscribed.length > 0) {
      logSelectContentEvent(
        {
          screen_name: screenName,
          Tipo_Contenido: tipoContenido,
          organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.SUBSCRIPTION,
          content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SUBSCRIBE,
          content_name: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SUBSCRIBE,
          content_action: ANALYTICS_ATOMS.TAP,
          meta_content_action: ANALYTICS_ATOMS.NEWSLETTER_SUBSCRIBE,
          screen_page_web_url: SCREEN_PAGE_WEB_URL.NEWSLETTER
        },
        ANALYTICS_META_EVENTS.SUBSCRIBE
      );
    }

    if (guestToken && newsletterSubscribed.length > 0) {
      navigation.navigate(screenNames.SUBSCRIBE_TO_NEWSLETTER, {
        selectedNewsletters: newsletterSubscribed
      });
      setChangeSubscriptionLoading(false);
      return;
    }

    if (unSubscribeAll) {
      const newsletterNotSubscribed = (latestUserNewsletters ?? []).map((item: Newsletter) => ({
        newsletter: item._id,
        isSubscribed: false
      }));
      setNewsletterSubscribedUndo(newsletterNotSubscribed);
    } else {
      setNewsletterSubscribedUndo(newsletterNotSubscribed);
    }
    setModalVisible(false);

    if (newsletterSubscribed.length <= 0 && !mySubscriptions) {
      setButtonInToast('');
      setShowToastType('error');
      setToastMessage(t('screens.newsletters.text.selectAtLeastOneNewsletter'));
      setAlertVisible(true);
    } else {
      const otherReasonText = t('screens.newsletters.text.otherReason');
      const allReasons = customReason
        ? [...unSubscribeReason.filter((r) => r !== otherReasonText), customReason]
        : unSubscribeReason;
      const reasonsString = allReasons.join(', ');
      const data = mySubscriptions
        ? unSubscribeAll
          ? (latestUserNewsletters ?? []).map((item: Newsletter) => ({
              newsletter: item._id,
              isSubscribed: false,
              unsubscribeReason: reasonsString
            }))
          : newsletterNotSubscribed.map((item) => ({
              ...item,
              unsubscribeReason: reasonsString
            }))
        : newsletterSubscribed.map((item) => ({
            ...item,
            unsubscribeReason: reasonsString
          }));

      await changeSubscription({
        variables: {
          input: data
        }
      });
      setIsClickUndoButton(false);

      await fetchNewslettersWithDelay();
    }

    setNewsletterSubscribed([]);
    setNewsletterNotSubscribed([]);
    setUnSubscribeReason([]);
    setChangeSubscriptionLoading(false);
  };

  const allNewslettersData = latestAllNewsletters;
  const userNewslettersData = latestUserNewsletters;
  const checkBoxTopic = unSubscribeData?.getNewsletterUnsubscribeReasons;

  const goBack = () => {
    const screenName = ANALYTICS_COLLECTION.MY_ACCOUNT;
    const tipoContenido = `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`;

    logSelectContentEvent({
      screen_name: screenName,
      Tipo_Contenido: tipoContenido,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: ANALYTICS_ATOMS.BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const undoUnsubscribe = async () => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
      organisms: '',
      content_type: '',
      content_name: 'Deshacer',
      content_action: ANALYTICS_ATOMS.TAP
    });

    const updatedList = newsletterSubscribedUndo.map((item) => ({
      ...item,
      isSubscribed: true
    }));

    setIsClickUndoButton(true);

    await changeSubscription({
      variables: {
        input: updatedList
      }
    });

    await fetchNewslettersWithDelay();
    setNewsletterSubscribedUndo([]);
  };

  const onCheckBoxPress = (id: string) => {
    const data = newsletterSubscribed.filter((item) => item.newsletter !== id);
    setNewsletterSubscribed(data);
  };

  const onUnCheckBoxPress = (id: string) => {
    setNewsletterSubscribed((prev) => [...prev, { newsletter: id, isSubscribed: true }]);
  };

  const onSubscribedCheckBoxPress = (id: string) => {
    const data = newsletterNotSubscribed.filter((item) => item.newsletter !== id);
    setNewsletterNotSubscribed(data);
  };

  const onSubscribedUnCheckBoxPress = (id: string) => {
    setNewsletterNotSubscribed((prev) => [...prev, { newsletter: id, isSubscribed: false }]);
  };

  const onUnsubscribeResponsePress = (value: string) => {
    const otherReasonText = t('screens.newsletters.text.otherReason');
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
      organisms:
        value === otherReasonText
          ? ANALYTICS_ORGANISMS.MY_ACCOUNT.TEXT_BOX
          : ANALYTICS_ORGANISMS.MY_ACCOUNT.CHECKBOX_OPTIONS,
      content_type:
        value === otherReasonText
          ? ANALYTICS_MOLECULES.MY_ACCOUNT.OTHER_REASON
          : ANALYTICS_MOLECULES.MY_ACCOUNT.CHECK_BOX,
      content_name: value,
      content_action: ANALYTICS_ATOMS.TAP
    });

    if (value === otherReasonText) {
      setUnSubscribeReason((prev) => [otherReasonText, ...prev]);
    } else {
      setUnSubscribeReason((prev) =>
        prev.includes(otherReasonText) ? [value, ...prev] : [...prev, value]
      );
    }
  };

  const onUnsubscribeResponse = (value: string) => {
    const data = unSubscribeReason.filter((item) => item !== value);
    setUnSubscribeReason(data);
  };

  const toggleMySubscriptions = (value: boolean) => {
    const screenName = ANALYTICS_COLLECTION.MY_ACCOUNT;
    const tipoContenido = `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`;
    const tabName = value ? 'My suscriptions' : 'Suscription';

    logSelectContentEvent({
      screen_name: screenName,
      Tipo_Contenido: tipoContenido,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.SEGMENTED_TABS,
      content_type: !mySubscriptions
        ? ANALYTICS_MOLECULES.MY_ACCOUNT.MY_SUBSCRIPTIONS
        : ANALYTICS_MOLECULES.MY_ACCOUNT.SUBSCRIPTION,
      content_name: tabName,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setMySubscriptions(value);
  };

  const onDesubscribePress = () => {
    if (guestToken) {
      setVisible(true);
      return;
    }

    setUnSubscribeAll(false);
    if (newsletterNotSubscribed.length > 0) {
      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DESUBSCRIBE,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_UNSUBSCRIBE,
        content_name: 'Desuscribirse',
        content_action: ANALYTICS_ATOMS.TAP
      });
      setModalVisible(!isModalVisible);
    } else {
      setButtonInToast('');
      setShowToastType('error');
      setToastMessage(t('screens.newsletters.text.selectAtLeastOneNewsletter'));
      setAlertVisible(true);
    }
  };

  const openModal = () => {
    if (guestToken) {
      setVisible(true);
      return;
    }
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DESUBSCRIBE,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_UNSUBSCRIBE_ALL,
      content_name: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_UNSUBSCRIBE_ALL,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setUnSubscribeAll(true);
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.CLOSE_BUTTON,
      content_name: ANALYTICS_MOLECULES.MY_ACCOUNT.CLOSE_BUTTON,
      content_action: ANALYTICS_ATOMS.TAP
    });
    setModalVisible(!isModalVisible);
    setUnSubscribeReason([]);
  };

  const handleRetry = async () => {
    try {
      setInternetLoader(true);

      await fetchNewslettersWithDelay();
      await getUnSubscribeReasons();
    } catch {
      setinternetFail(false);
      setInternetLoader(false);
    }
  };

  const onSubscribePress = async (email: string) => {
    if (!email) return;

    const newsletters = selectedNewsletters ?? newsletterSubscribed;
    if (newsletters.length === 0) return;

    try {
      setInternetLoader(true);

      const subscriptionData = newsletters.map((item) => ({
        newsletter: item.newsletter,
        email,
        isSubscribed: true
      }));

      await changeSubscription({
        variables: {
          input: subscriptionData
        }
      });
      await fetchNewslettersWithDelay();
      setShowToastType('success');
      setNewsletterSubscribed([]);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch {
      setShowToastType('error');
    } finally {
      setInternetLoader(false);
    }
  };

  const handlePress = (showLogin = false) => {
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT[showLogin ? 'BUTTON_LOG_IN' : 'BUTTON_REGISTER'],
      content_name: showLogin ? 'Log in' : 'Register',
      content_action: showLogin ? 'login' : 'register'
    });
    clearAuth(showLogin);
  };

  const onValidSubmit = (data: SocialMediaAuthFormValues) => {
    onSubscribePress(data.email);
  };

  return {
    setIsFormError,
    t,
    theme,
    isFormError,
    goBack,
    mySubscriptions,
    toggleMySubscriptions,
    flatlistData: mySubscriptions
      ? allNewslettersData.filter((i) => i.isSubscribed === true)
      : [...allNewslettersData].sort((a, b) => Number(a.isSubscribed) - Number(b.isSubscribed)),
    userNewslettersData,
    newsletterSubscribed,
    unSubscribeLoading,
    onUnsubscribeResponse,
    unSubscribeReason,
    onUnCheckBoxPress,
    onCheckBoxPress,
    onSubscribedUnCheckBoxPress,
    onSubscribedCheckBoxPress,
    onUnsubscribeResponsePress,
    getAllNewslettersLoading,
    isModalVisible,
    openModal,
    onDesubscribePress,
    onSubmit,
    checkBoxTopic,
    changeSubscriptionLoading,
    newsletterNotSubscribed,
    userNewslettersLoading: false,
    undoUnsubscribe,
    showToastType,
    alertVisible,
    setAlertVisible,
    toastMessage,
    buttonInToast,
    internetFail,
    internetLoader,
    isInternetConnection,
    handleRetry,
    userData: userData ?? undefined,
    closeModal,
    guestToken: guestToken ?? undefined,
    handlePress,
    visible,
    onClose: () => setVisible(false),
    onValidSubmit,
    changeSubscriptionData: changeSubscriptionData ?? undefined
  };
};

export default useNewslettersViewModel;
