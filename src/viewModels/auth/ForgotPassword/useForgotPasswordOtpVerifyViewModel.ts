import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { ApolloError, useMutation } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AuthStackParamList } from '@src/navigation/types';
import { VerifyOtpInput, VerifyOtpResponseDto } from '@src/models/auth/ForgotPasswordOtpVerify';
import { screenNames } from '@src/navigation/screenNames';
import { VERIFY_FORGOT_PASSWORD_OTP_MUTATION } from '@src/graphql/auth/mutations';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

const useForgotPasswordOtpVerifyViewModel = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPasswordOtp'>>();
  const { email } = route.params;

  useEffect(() => {
    logContentViewEvent({
      idPage: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION}`
    });
  }, []);

  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [resetOtpTrigger, setResetOtpTrigger] = useState<boolean>(false);

  const [verifyOtp, { data, loading, error }] = useMutation<
    { verifyForgetPasswordOtp: VerifyOtpResponseDto },
    { input: VerifyOtpInput }
  >(VERIFY_FORGOT_PASSWORD_OTP_MUTATION);

  useEffect(() => {
    if (data?.verifyForgetPasswordOtp?.nextStep) {
      navigation.navigate(screenNames.CREATE_NEW_PASSWORD, { email });
    }
  }, [data, navigation]);

  useEffect(() => {
    if (error instanceof ApolloError) {
      const extractedMessage = String(
        error?.graphQLErrors?.[0]?.extensions?.message ||
          (error?.networkError as Error)?.message ||
          t('screens.login.text.somethingWentWrong')
      );
      setOtp('');
      setResetOtpTrigger((prev) => !prev);
      setToastType('error');
      setToastMessage(extractedMessage);
      setToastVisible(true);
    }
  }, [error, t]);

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    if (errorMessage) setErrorMessage(null);
  };

  const handleOtpValidation = async () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_VERIFICATION_CODE,
      content_name: 'Verificar código',
      content_action: ANALYTICS_ATOMS.TAP
    });

    await verifyOtp({ variables: { input: { otp } } });
  };

  const handleGoBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.TAP
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
    handleGoBack,
    toastVisible,
    toastMessage,
    toastType,
    setToastVisible,
    email,
    resetOtpTrigger,
    setResetOtpTrigger
  };
};

export default useForgotPasswordOtpVerifyViewModel;
