import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';

import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';
import {
  CreateAccountPasswordFormValues,
  OnboardingInput,
  OnboardingResponse
} from '@src/models/auth/CreateAccountPassword';
import { PasswordCriteriaTypes } from '@src/views/organisms/PasswordCriteria';
import { createAccountPasswordSchema } from '@src/utils/schemas/createAccountPasswordSchema';
import { ONBOARDING_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';

/**
 * useCreateAccountPasswordViewModel
 *
 * This custom React hook encapsulates all state management and business logic for the
 * "Create Account Password" onboarding screen. It provides:
 *
 * - Form state and validation using react-hook-form and Yup
 * - Password strength validation and criteria tracking
 * - Integration with the onboarding GraphQL mutation (Apollo Client)
 * - Navigation to the OTP screen upon successful onboarding
 * - UI state for password visibility, loading, error, and toast messages
 * - Synchronization of form values with navigation parameters
 *
 * By abstracting these concerns, the hook enables the UI component to focus solely on rendering
 * and user interaction, promoting separation of concerns and reusability.
 *
 * @returns {object} All state, handlers, and helpers required by the Create Account Password screen
 */

const useCreateAccountPasswordViewModel = () => {
  const { t } = useTranslation();
  const { setMfaToken } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'CreateAccountPassword'>>();

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteriaTypes>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [isPasswordCriteriaMatched, setIsPasswordCriteriaMatched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isFormError, setIsFormError] = useState<boolean>(false);

  const paramEmail = route?.params?.email ?? '';
  const methods = useForm<CreateAccountPasswordFormValues>({
    mode: 'onBlur',
    resolver: yupResolver(createAccountPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    logContentViewEvent({
      screen_name: 'Enter details',
      Tipo_Contenido: 'Onboarding_Enter details'
    });
  }, []);
  const password = methods.watch('password');
  const confirmPassword = methods.watch('confirmPassword');
  const liveEmail = methods.watch('email');
  const isFormValid =
    liveEmail.length > 0 && isPasswordCriteriaMatched && password === confirmPassword;
  const [onboardUser, { data, loading, error }] = useMutation<
    OnboardingResponse,
    { input: OnboardingInput }
  >(ONBOARDING_MUTATION);

  useEffect(() => {
    if (paramEmail) {
      methods.setValue('email', paramEmail, { shouldDirty: true });
    }
  }, [paramEmail, methods]);

  useEffect(() => {
    validatePasswordStrength(password || '');
  }, [password]);

  useEffect(() => {
    if (data?.onboarding?.success) {
      setMfaToken(data.onboarding.mfaToken);
      navigation.navigate(screenNames.SIGN_UP_OTP, {
        email: methods.getValues('email'),
        password: methods.getValues('password')
      });
    }
  }, [data, navigation, methods, setMfaToken]);

  useEffect(() => {
    if (error) {
      const message =
        (error?.graphQLErrors?.[0]?.extensions?.message as string) ||
        (error?.graphQLErrors?.[0]?.message as string) ||
        error?.message ||
        t('screens.login.text.somethingWentWrong');
      setToastMessage(message);
    }
  }, [error, t]);

  useEffect(() => {
    if (!paramEmail) {
      setIsFormError(true);
    }
  }, [paramEmail]);

  const validatePasswordStrength = (value: string): void => {
    const criteria: PasswordCriteriaTypes = {
      length: value.length >= 8 && value.length <= 15,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[^\p{L}\p{N}]/u.test(value)
    };
    setPasswordCriteria(criteria);
    setIsPasswordCriteriaMatched(Object.values(criteria).every(Boolean));
  };

  const onSubmit: SubmitHandler<CreateAccountPasswordFormValues> = (formData) => {
    Keyboard.dismiss();

    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      Tipo_Contenido: ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT_PASSWORD,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_DATA,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_CREAR_CUENTA,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.CREAR_CUENTA,
      content_action: ANALYTICS_ATOMS.TAP
    });

    onboardUser({
      variables: {
        input: {
          email: formData.email,
          password: formData.password
        }
      }
    });
  };

  const onError: SubmitErrorHandler<CreateAccountPasswordFormValues> = () => {
    setToastMessage(t('validation.form.inputValidationError'));
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_PASSWORD,
      Tipo_Contenido: ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT_PASSWORD,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.TAP
    });

    Keyboard.dismiss();
    navigation.goBack();
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    methods,
    passwordCriteria,
    isPasswordCriteriaMatched,
    validatePasswordStrength,
    onSubmit,
    onError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isFormValid,
    password,
    confirmPassword,
    loading,
    goBack,
    toastMessage,
    setToastMessage,
    isFormError,
    setIsFormError,
    handlePasswordToggle,
    handleConfirmPasswordToggle
  };
};

export default useCreateAccountPasswordViewModel;
