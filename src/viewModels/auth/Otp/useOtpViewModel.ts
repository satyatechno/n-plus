import { useState, useEffect, useMemo, useCallback } from 'react';
import { Keyboard } from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloError, useMutation } from '@apollo/client';
import { RouteProp, useRoute } from '@react-navigation/native';

import { OnboardingInput, OnboardingResponse } from '@src/models/auth/CreateAccountPassword';
import { AuthStackParamList } from '@src/navigation/types';
import { ONBOARDING_MUTATION } from '@src/graphql/auth/mutations';
import { OtpViewModel } from '@src/models/auth/Otp';
import useAuthStore from '@src/zustand/auth/authStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

export const useOtpViewModel = (initialSeconds: number = 120): OtpViewModel => {
  const { setMfaToken } = useAuthStore();

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [resendToastVisible, setResendToastVisible] = useState<boolean>(false);
  const [resendToastMessage, setResendToastMessage] = useState<string>('');
  const [resendToastType, setResendToastType] = useState<'success' | 'error'>('success');

  const { t } = useTranslation();

  const route = useRoute<RouteProp<AuthStackParamList, 'SignUpOtp'>>();
  const { email, password } = route.params;

  const [onboarding, { loading }] = useMutation<
    { onboarding: OnboardingResponse['onboarding'] },
    { input: OnboardingInput }
  >(ONBOARDING_MUTATION);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (!startTime) setStartTime(Date.now());

    const intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      const newSecondsLeft = initialSeconds - elapsedSeconds;

      if (newSecondsLeft <= 0) {
        setIsTimerRunning(false);
        setSecondsLeft(0);
        setStartTime(null);
        clearInterval(intervalId);
      } else {
        setSecondsLeft(newSecondsLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning, startTime, initialSeconds]);

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const resetTimer = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setStartTime(Date.now());
    setIsTimerRunning(true);
  }, [initialSeconds]);

  const onResend = useCallback(async () => {
    Keyboard.dismiss();

    if (!email || !password || loading) return;

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_DATA,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.RESEND_LINK,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.RESEND,
      content_action: ANALYTICS_ATOMS.LINK_REENVIAR
    });

    try {
      const response = await onboarding({
        variables: {
          input: { email, password }
        }
      });

      if (response.data?.onboarding) {
        setMfaToken(response.data?.onboarding.mfaToken);
        resetTimer();
        setResendToastType('success');
        setResendToastMessage(t('screens.recommendedForYou.text.resendSuccess'));
        setResendToastVisible(true);
      }
    } catch (error) {
      const err = error as ApolloError;

      let extractedMessage = t('screens.recommendedForYou.text.resendError');

      const extMsg = err?.graphQLErrors?.[0]?.extensions?.message;
      const fallbackMsg = err?.graphQLErrors?.[0]?.message || (err?.networkError as Error)?.message;

      if (typeof extMsg === 'string') {
        extractedMessage = extMsg;
      } else if (typeof fallbackMsg === 'string') {
        extractedMessage = fallbackMsg;
      }
      setResendToastType('error');
      setResendToastMessage(extractedMessage);
      setResendToastVisible(true);
    }
  }, [email, password, onboarding, resetTimer, loading, t]);

  return {
    isTimerRunning,
    formattedTime,
    resetTimer,
    onResend,
    resendLoading: loading,
    resendError: null,
    loading,
    resendToastVisible,
    setResendToastVisible,
    resendToastMessage,
    resendToastType
  };
};
