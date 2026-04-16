import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ForgetPasswordAppResponse,
  ForgotPasswordFormValues,
  ForgotPasswordViewModel
} from '@src/models/auth/ForgotPassword';
import { useTheme } from '@src/hooks/useTheme';
import { FORGOT_PASSWORD_MUTATION } from '@src/graphql/auth/mutations';
import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import { socialMediaAuthSchema } from '@src/utils/schemas/socialMediaAuthSchema';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

const useForgotPasswordViewModel = (): ForgotPasswordViewModel => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const { setPasswordToken } = useAuthStore();
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const route = useRoute<RouteProp<AuthStackParamList, 'CreateAccountPassword'>>();
  const { email } = route.params || {};
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    logContentViewEvent({
      idPage: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_name: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD}`
    });
  }, []);

  const [forgotPasswordApp, { data, error, loading }] =
    useMutation<ForgetPasswordAppResponse>(FORGOT_PASSWORD_MUTATION);

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_name: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.goBack();
  };

  const { ...methods } = useForm<ForgotPasswordFormValues>({
    mode: 'all',
    resolver: yupResolver(socialMediaAuthSchema),
    defaultValues: {
      email: email || ''
    }
  });

  useEffect(() => {
    if (error) {
      setErrorMessage(
        (error?.graphQLErrors?.[0]?.extensions?.message as string) ??
          t('screens.splash.text.noInternet')
      );
      setAlertVisible(true);
    }
    if (data) {
      if (setPasswordToken) {
        setPasswordToken(data?.forgetPasswordApp?.passwordToken ?? '');
      }
      navigation.navigate(screenNames.FORGOT_PASSWORD_OTP_VERIFY, {
        email: methods.getValues('email')
      });
      setErrorMessage('');
    }
  }, [error, data]);

  const onSubmit = async (formData: ForgotPasswordFormValues) => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      screen_name: ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_FORGOT_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_SEND_CODE,
      content_name: 'Enviar código',
      content_action: ANALYTICS_ATOMS.TAP
    });

    try {
      await forgotPasswordApp({
        variables: {
          input: {
            email: formData.email
          }
        }
      });
    } catch {
      setErrorMessage(t('screens.login.text.somethingWentWrong'));
      setAlertVisible(true);
    }
  };

  return {
    theme,
    t,
    setIsFormError,
    isFormError,
    onSubmit,
    loading,
    methods,
    goBack,
    alertVisible,
    setAlertVisible,
    errorMessage,
    email
  };
};

export default useForgotPasswordViewModel;
