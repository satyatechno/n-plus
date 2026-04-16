import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useMutation } from '@apollo/client';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import type { LoginResponse, LoginFormValues, LoginViewModel } from '@src/models/auth/Login';
import { useTheme } from '@src/hooks/useTheme';
import { LOGIN_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';
import { DeviceTokenService } from '@src/services/api/DeviceTokenService';
import { AuthStackParamList, RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import {
  logLoginSignUpEvent,
  logSelectContentEvent
} from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

/**
 * A custom hook that provides the view model for the login screen.
 *
 * This hook manages the state and logic related to the login process,
 * including form error handling, password visibility toggling, and
 * managing login attempts. It also provides the necessary translations
 * and theme styles for the login screen.
 *
 * @returns {LoginViewModel} The view model containing:
 * - `onSubmit`: A function to handle form submission, triggering the login mutation.
 * - `isFormError`: A boolean indicating if there is a form error.
 * - `setIsFormError`: A function to set the form error state.
 * - `styles`: The styles for the login screen based on the current theme.
 * - `theme`: The current theme object.
 * - `isPasswordVisible`: A boolean indicating if the password is visible.
 * - `togglePasswordVisibility`: A function to toggle the password visibility.
 * - `error`: An ApolloError object representing any error during the login mutation.
 * - `loading`: A boolean indicating if the login mutation is in progress.
 * - `t`: The translation function for localized text.
 */

const useLoginViewModel = (): LoginViewModel => {
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const { email } = route.params || {};
  const [theme] = useTheme();
  const { t } = useTranslation();
  const { setTokens, clearGuestToken, setUserId, setGuestId, deviceId } = useAuthStore();
  const [login, { loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    logContentViewEvent({
      screen_name: ANALYTICS_PAGE.LOGIN_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_PASSWORD}`
    });
  }, []);

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_PASSWORD,
      screen_name: ANALYTICS_PAGE.LOGIN_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.goBack();
  };

  const onForgotPasswordPress = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.LOGIN_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.LOGIN_PASSWORD,
      screen_name: ANALYTICS_PAGE.LOGIN_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_FORGOT_PASSWORD,
      content_name: 'Forgot password',
      content_action: ANALYTICS_ATOMS.OLVIDASTE_TU_CONTRASENA
    });

    navigation.navigate(routeNames.AUTH_STACK, {
      screen: screenNames.FORGOT_PASSWORD,
      params: { email }
    });
  };

  useEffect(() => {
    if (error) {
      setAlertVisible(true);
      setIsSubmitting(false);
    }
  }, [error]);

  //TODO-> will update this once backend updates the error message and display them in heading and subheading format.
  const getParsedErrorMessage = () => {
    const rawMessage = (error?.graphQLErrors?.[0]?.extensions?.message as string)?.trim() ?? '';
    if (!rawMessage)
      return {
        heading: t('screens.login.text.somethingWentWrong'),
        subHeading: undefined
      };

    const isLong = rawMessage.length > 100;
    if (!isLong) {
      return { heading: rawMessage, subHeading: undefined };
    }
    const sentences = rawMessage
      .split('.')
      .map((s) => s.trim())
      .filter(Boolean);

    const heading = sentences[0];
    const subHeading = sentences.slice(1).join('. ');

    return { heading, subHeading };
  };

  const onSubmit: SubmitHandler<LoginFormValues> = async (formData) => {
    Keyboard.dismiss();
    setIsSubmitting(true);

    try {
      const { data } = await login({
        variables: {
          input: {
            email: formData.email,
            password: formData.password
          }
        }
      });
      await AnalyticsService.setUserContext(formData.email);

      clearGuestToken();
      const loginData = data?.login;

      if (loginData?.authToken && loginData?.refreshToken && loginData?.userId) {
        setUserId(loginData?.userId);
        setTokens(loginData.authToken, loginData.refreshToken, loginData?.xApiKey);

        logSelectContentEvent(
          {
            idPage: ANALYTICS_PAGE.LOGIN_PASSWORD,
            screen_page_web_url: ANALYTICS_PAGE.LOGIN_PASSWORD,
            screen_name: ANALYTICS_PAGE.LOGIN_PASSWORD,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.LOGIN_PASSWORD}`,
            organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
            content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN,
            content_name: 'Inicia sesión',
            content_action: ANALYTICS_ATOMS.TAP,
            meta_content_action: ANALYTICS_ATOMS.LOGIN_SUCCESSFULL
          },
          ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL
        );

        logLoginSignUpEvent(
          {
            screen_name: ANALYTICS_PAGE.LOGIN_PASSWORD,
            method: 'email'
          },
          ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL,
          'login'
        );

        AnalyticsService.logAppsFlyerEvent('login_successfull', {
          method: 'email',
          user_id_nmas_hit: loginData.userId
        });

        // Sync device token immediately after logging in to prevent missed push notifications for recent logins
        if (deviceId) {
          void DeviceTokenService.storeToken(deviceId);
        }
      }
      setGuestId('');
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      if (error) {
        setAlertVisible(true);
      }
    }
  };

  return {
    onSubmit,
    isFormError,
    setIsFormError,
    theme,
    isPasswordVisible,
    setIsPasswordVisible,
    error,
    loading,
    t,
    alertVisible,
    setAlertVisible,
    getParsedErrorMessage,
    goBack,
    email,
    onForgotPasswordPress,
    isSubmitting
  };
};

export default useLoginViewModel;
