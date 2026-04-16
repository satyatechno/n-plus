import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { ApolloError, useMutation } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import { VERIFY_EMAIL_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';
import {
  SignUpOtpViewModel,
  VerifyOnboardingInput,
  VerifyOnboardingOutput
} from '@src/models/auth/SignUpOtp';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';

const useSignUpOtpViewModel = (): SignUpOtpViewModel => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SignUpOtp'>>();
  const { email } = route.params;
  const {
    setTokens,
    setUserId,
    clearGuestToken,
    guestId,
    clearGuestId,
    setIsOnboardingRegistration
  } = useAuthStore();

  const [otp, setOtp] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [resetOtpTrigger, setResetOtpTrigger] = useState<boolean>(false);

  useEffect(() => {
    logContentViewEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION}`
    });
  }, []);

  const [verifyEmail, { data, loading, error }] = useMutation<
    { verifyEmail: VerifyOnboardingOutput['verifyEmail'] },
    { input: VerifyOnboardingInput }
  >(VERIFY_EMAIL_MUTATION);

  useEffect(() => {
    if (data?.verifyEmail?.success) {
      const { authToken, refreshToken, xApiKey } = data.verifyEmail;
      AnalyticsService.setUserContext(email);

      setIsOnboardingRegistration(true);
      clearGuestToken();
      setUserId(data?.verifyEmail?.userId ?? '');
      clearGuestId();
      setTokens(authToken, refreshToken, xApiKey);

      if (data?.verifyEmail?.userId) {
        AnalyticsService.logAppsFlyerEvent('register_successfull', {
          method: 'email',
          user_id_nmas_hit: data.verifyEmail.userId
        });
      }

      setToastType('success');
      setToastMessage(t('screens.changePassword.text.passwordChangeSuccessMessage'));
      setToastVisible(true);

      navigation.navigate(screenNames.SIGN_UP_OTP_SUCCESS, { authToken });
    }
  }, [data, navigation, setTokens, setUserId]);

  useEffect(() => {
    if (error instanceof ApolloError) {
      let extractedMessage = t('screens.validation.form.somethingWentWrong');
      const extMessage = error?.graphQLErrors?.[0]?.extensions?.message;
      if (typeof extMessage === 'string') {
        extractedMessage = extMessage;
      }
      setOtp('');
      setResetOtpTrigger((prev) => !prev);
      setToastType('error');
      setToastMessage(extractedMessage);
      setToastVisible(true);
    }
  }, [error, t]);

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleOtpValidation = async () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_DATA,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_VERIFICATION_CODE,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.VERIFICAR_CODIGO,
      content_action: ANALYTICS_ATOMS.TAP
    });

    await verifyEmail({
      variables: {
        input: {
          otp,
          ...(guestId && { guestId })
        }
      }
    });
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.CREATE_ACCOUNT_OTP_VERIFICATION}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.TAP
    });

    Keyboard.dismiss();
    navigation.goBack();
  };

  return {
    email,
    otp,
    setOtp,
    isValid: !errorMessage,
    handleOtpChange,
    handleOtpValidation,
    loading,
    errorMessage,
    goBack,
    toastVisible,
    toastMessage,
    toastType,
    setToastVisible,
    setToastMessage,
    resetOtpTrigger,
    setResetOtpTrigger
  };
};

export default useSignUpOtpViewModel;
