import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useMutation, ApolloError } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { RootStackParamList } from '@src/navigation/types';
import {
  ChangePasswordInput,
  ChangePasswordResponse,
  ChangePasswordFormValues
} from '@src/models/main/MyAccount/ChangePassword';
import { PasswordCriteria } from '@src/models/auth/CreateAccountPassword';
import { changePasswordSchema } from '@src/utils/schemas/changePasswordSchema';
import { CHANGE_PASSWORD_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

const useChangePasswordViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFormError, setFormError] = useState<boolean>(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const { setShowLogoGif } = useAuthStore();

  const methods = useForm<ChangePasswordFormValues>({
    mode: 'onSubmit',
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = methods.watch('password');
  const confirmPassword = methods.watch('confirmPassword');

  const { clearAuth } = useAuthStore.getState();
  const [changePasswordApp, { data, loading, error }] = useMutation<
    ChangePasswordResponse,
    { input: ChangePasswordInput }
  >(CHANGE_PASSWORD_MUTATION);

  const validatePasswordStrength = (value: string): void => {
    const criteria: PasswordCriteria = {
      length: value.length >= 8 && value.length <= 15,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[^A-Za-z0-9]/.test(value)
    };
    setPasswordCriteria(criteria);
  };

  const isPasswordCriteriaMatched = Object.values(passwordCriteria).every(Boolean);

  useEffect(() => {
    validatePasswordStrength(password || '');
  }, [password]);

  useEffect(() => {
    if (data?.changePasswordApp?.nextStep) {
      AnalyticsService.logEvent('profile_change_password');
      setToastMessage(t('screens.changePassword.text.passwordChangeSuccessMessage'));
      setToastType('success');
      setToastVisible(true);
      setShowLogoGif(false);
      const timeout = setTimeout(() => {
        setToastVisible(false);
        clearAuth(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  useEffect(() => {
    if (error instanceof ApolloError) {
      const extMessage = error?.graphQLErrors?.[0]?.extensions?.message;
      const fallbackMessage =
        error?.graphQLErrors?.[0]?.message || (error?.networkError as Error)?.message;

      const extractedMessage =
        typeof extMessage === 'string'
          ? extMessage
          : typeof fallbackMessage === 'string'
            ? fallbackMessage
            : t('screens.recommendedForYou.text.resendError');

      setErrorMessage(extractedMessage);
      setToastMessage(extractedMessage);
      setToastType('error');
      setToastVisible(true);
      const isUnexpectedError = !extMessage;
      setFormError(isUnexpectedError);
    }
  }, [error]);

  const isFormValid =
    methods.getValues('oldPassword').length > 0 &&
    isPasswordCriteriaMatched &&
    password === confirmPassword;

  const onSubmit = (formData: ChangePasswordFormValues): void => {
    logSelectContentEvent(
      {
        idPage: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
        screen_page_web_url: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
        screen_name: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CAMBIAR_CONTRASENA}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_CHANGED_PASSWORD,
        content_name: 'Cambiar contraseña',
        content_action: ANALYTICS_ATOMS.TAP,
        meta_content_action: ANALYTICS_META_EVENTS.PROFILE_CHANGE
      },
      ANALYTICS_META_EVENTS.PROFILE_CHANGE
    );
    setErrorMessage('');
    setFormError(false);

    changePasswordApp({
      variables: {
        input: {
          oldPassword: formData.oldPassword,
          newPassword: formData.password
        }
      }
    });
  };

  const onError = (): void => {
    const message = t('screens.validation.form.genericError');
    setErrorMessage(message);
    setFormError(true);
    setToastMessage(message);
    setToastType('error');
    setToastVisible(true);
  };

  const handleOldPasswordToggle = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
      screen_page_web_url: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
      screen_name: ANALYTICS_PAGE.CAMBIAR_CONTRASENA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CAMBIAR_CONTRASENA}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.BACK
    });
    Keyboard.dismiss();
    navigation.goBack();
  };

  return {
    methods,
    isFormError,
    setFormError,
    passwordCriteria,
    isPasswordCriteriaMatched,
    onSubmit,
    onError,
    showOldPassword,
    setShowOldPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleOldPasswordToggle,
    handlePasswordToggle,
    handleConfirmPasswordToggle,
    isFormValid,
    password,
    confirmPassword,
    loading,
    errorMessage,
    handleGoBack,
    toastVisible,
    setToastVisible,
    toastMessage,
    toastType
  };
};

export default useChangePasswordViewModel;
