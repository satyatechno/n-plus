import { useState, useEffect, useMemo, useCallback } from 'react';
import { Keyboard } from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloError, useMutation } from '@apollo/client';

import { DeleteAccountResponse } from '@src/models/main/MyAccount/DeleteAccountReasons';
import { DELETE_ACCOUNT_MUTATION } from '@src/graphql/main/MyAccount/mutations';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';

const INITIAL_SECONDS = 120;

export const useDeleteAccountOtpTimerViewModel = () => {
  const { t } = useTranslation();

  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [resendToastVisible, setResendToastVisible] = useState<boolean>(false);
  const [resendToastMessage, setResendToastMessage] = useState<string>('');
  const [resendToastType, setResendToastType] = useState<'success' | 'error'>('error');

  const [resendOtp, { loading }] = useMutation<DeleteAccountResponse>(DELETE_ACCOUNT_MUTATION);

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
    setStartTime(Date.now());
    setSecondsLeft(INITIAL_SECONDS);
    setIsTimerRunning(true);
  }, []);

  const onResend = useCallback(async () => {
    Keyboard.dismiss();
    if (loading) return;

    logSelectContentEvent({
      screen_name: 'Validate OTP',
      Tipo_Contenido: 'My account_validate OTP',
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_RESEND_CODE,
      content_name: 'Resend code',
      content_action: 'profile_erase_account_resend_code'
    });

    try {
      const response = await resendOtp();

      if (response?.data) {
        resetTimer();
        setResendToastMessage(t('screens.recommendedForYou.text.resendSuccess'));
        setResendToastType('success');
        setResendToastVisible(true);
      }
    } catch (error) {
      const err = error as ApolloError;
      const extractedMessage = String(
        err?.graphQLErrors?.[0]?.extensions?.message ||
          (err?.networkError as Error)?.message ||
          t('screens.recommendedForYou.text.resendError')
      );

      setResendToastMessage(extractedMessage);
      setResendToastType('error');
      setResendToastVisible(true);
    }
  }, [resendOtp, loading, resetTimer, t]);

  return {
    isTimerRunning,
    formattedTime,
    resetTimer,
    onResend,
    resendLoading: loading,
    resendToastVisible,
    setResendToastVisible,
    resendToastMessage,
    resendToastType
  };
};
