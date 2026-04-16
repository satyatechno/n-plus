import { useState, useEffect, useMemo, useCallback } from 'react';
import { Keyboard } from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloError, useMutation } from '@apollo/client';
import { useRoute } from '@react-navigation/native';

import { FORGOT_PASSWORD_MUTATION } from '@src/graphql/auth/mutations';
import { ForgetPasswordAppResponse } from '@src/models/auth/ForgotPassword';
import useAuthStore from '@src/zustand/auth/authStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';

const INITIAL_SECONDS = 120;

export const useForgotPasswordOtpTimerViewModel = () => {
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { setPasswordToken } = useAuthStore();

  useEffect(() => {
    logContentViewEvent({
      screen_name: 'Confirm code',
      Tipo_Contenido: 'Onboarding_Confirm code'
    });
  }, []);

  const { t } = useTranslation();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [forgotPasswordApp, { loading }] =
    useMutation<ForgetPasswordAppResponse>(FORGOT_PASSWORD_MUTATION);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (!startTime) setStartTime(Date.now());

    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      const remaining = INITIAL_SECONDS - elapsed;

      if (remaining <= 0) {
        clearInterval(intervalId);
        setIsTimerRunning(false);
        setSecondsLeft(0);
        setStartTime(null);
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning, startTime]);

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(INITIAL_SECONDS);
    setStartTime(Date.now());
    setIsTimerRunning(true);
  }, []);

  const onResend = useCallback(async () => {
    Keyboard.dismiss();
    if (loading) return;

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.RESEND_LINK,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.RESEND,
      content_action: ANALYTICS_ATOMS.LINK_REENVIAR
    });

    try {
      const response = await forgotPasswordApp({
        variables: {
          input: { email }
        }
      });

      if (response?.data?.forgetPasswordApp?.passwordToken) {
        if (setPasswordToken) {
          setPasswordToken(response?.data?.forgetPasswordApp?.passwordToken ?? '');
        }
        resetTimer();
        setToastType('success');
        setToastMessage(t('screens.recommendedForYou.text.resendSuccess'));
        setToastVisible(true);
      }
    } catch (error) {
      const err = error as ApolloError;
      const message = String(
        err?.graphQLErrors?.[0]?.extensions?.message ||
          (err?.networkError as Error)?.message ||
          t('screens.recommendedForYou.text.resendError')
      );
      setResendError(message);
      setToastType('error');
      setToastMessage(message);
      setToastVisible(true);
    }
  }, [forgotPasswordApp, loading, resetTimer, t, email]);

  return {
    isTimerRunning,
    formattedTime,
    resetTimer,
    onResend,
    resendLoading: loading,
    resendError,
    toastVisible,
    toastMessage,
    toastType,
    setToastVisible
  };
};
