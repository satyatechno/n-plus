import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { ApolloError, useMutation } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { useTranslation } from 'react-i18next';

import { MyAccountStackParamList } from '@src/navigation/types';
import { DeleteVerifyInput } from '@src/models/main/MyAccount/DeleteAccountOtpVerify';
import { screenNames } from '@src/navigation/screenNames';
import { DELETE_VERIFY_MUTATION } from '@src/graphql/main/MyAccount/mutations';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

/**
 * A hook to manage the state and effects of the OTP screen for deleting an account.
 *
 * @returns {OtpViewModel} An object containing the OTP state, validation logic, and mutation state.
 *
 * @property {string} otp - The OTP input value.
 * @property {boolean} isValid - Indicates whether the OTP input is valid.
 * @property {(otpValue: string) => void} handleOtpChange - Sets the OTP input value.
 * @property {() => Promise<void>} handleOtpValidation - Verifies the OTP input value on the server.
 * @property {boolean} loading - Indicates whether the verification mutation is in progress.
 * @property {string | null} errorMessage - The latest error message from the verification mutation.
 */

const useDeleteAccountOtpViewModel = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [resetOtpTrigger, setResetOtpTrigger] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const route = useRoute();
  const { finalReason } = route.params as { email: string; finalReason: string };

  const [deleteVerify, { data, loading, error }] = useMutation<
    { deleteVerify: boolean },
    { input: DeleteVerifyInput }
  >(DELETE_VERIFY_MUTATION);

  useEffect(() => {
    if (data?.deleteVerify) {
      const payload = {
        idPage: ANALYTICS_ID_PAGE.MI_CUENTA,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA,
        screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.VALIDATE_OTP}`,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_VERIFY_CODE,
        content_name: t('screens.deleteAccountOtp.text.verifyCode'),
        content_action: ANALYTICS_ATOMS.TAP
      };
      AppEventsLogger.logEvent(ANALYTICS_META_EVENTS.DELETE_ACCOUNT_SUCCESSFULL, payload);
      navigation.navigate(screenNames.DELETE_ACCOUNT_OTP_SUCCESS, undefined);
    }
  }, [data, navigation, t]);

  useEffect(() => {
    if (error instanceof ApolloError) {
      const extractedMessage = String(
        error?.graphQLErrors?.[0]?.extensions?.message ||
          (error?.networkError as Error)?.message ||
          t('screens.recommendedForYou.text.resendError')
      );
      setOtp('');
      setResetOtpTrigger((prev) => !prev);
      setErrorMessage(extractedMessage);
      setToastMessage(extractedMessage);
      setToastType('error');
      setToastVisible(true);
    }
  }, [error]);

  const handleOtpChange = (otpValue: string) => {
    logSelectContentEvent({
      screen_name: 'Validate OTP',
      Tipo_Contenido: 'My account_validate OTP',
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.INPUT_NUMBER,
      content_type: `${ANALYTICS_MOLECULES.MY_ACCOUNT.INPUT_NUMBER} ${otpValue.length}`,
      content_name: `Number ${otpValue.length}`,
      content_action: 'otp_input_complete'
    });
    setOtp(otpValue);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleOtpValidation = async () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MI_CUENTA,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA,
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.VALIDATE_OTP}`,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_VERIFY_CODE,
      content_name: t('screens.deleteAccountOtp.text.verifyCode'),
      content_action: ANALYTICS_ATOMS.TAP
    });
    await deleteVerify({
      variables: {
        input: {
          otp,
          deletionReason: finalReason
        }
      }
    });
  };

  const handleGoBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MI_CUENTA,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA,
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.VALIDATE_OTP}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_action: ANALYTICS_ATOMS.BACK
    });
    Keyboard.dismiss();
    navigation.goBack();
  };

  return {
    otp,
    setOtp,
    isValid: !errorMessage,
    handleOtpChange,
    handleOtpValidation,
    loading,
    errorMessage,
    handleGoBack,
    toastVisible,
    setToastVisible,
    toastMessage,
    toastType,
    resetOtpTrigger,
    setResetOtpTrigger
  };
};

export default useDeleteAccountOtpViewModel;
