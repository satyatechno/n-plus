import { useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CreateNewPasswordFormValues } from '@src/models/auth/CreateNewPassword';
import { PasswordCriteriaTypes } from '@src/views/organisms/PasswordCriteria';

import { screenNames } from '@src/navigation/screenNames';
import { SET_PASSWORD_APP_MUTATION } from '@src/graphql/auth/mutations';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { AuthStackParamList } from '@src/navigation/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createNewPasswordSchema } from '@src/utils/schemas/createNewPasswordSchema';

/**
 * Handles form logic and displays password criteria,
 * form errors, loading state, and the footer with links to terms and privacy policy.
 * @param {string} password password input by the user
 * @returns {{
 *   methods: import('react-hook-form').UseFormReturn<CreateNewPasswordFormValues>,
 *   passwordCriteria: PasswordCriteriaTypes,
 *   isPasswordCriteriaMatched: boolean,
 *   validatePasswordStrength: (value: string) => void,
 *   onSubmit: SubmitHandler<CreateNewPasswordFormValues>,
 *   onError: SubmitErrorHandler<CreateNewPasswordFormValues>,
 *   showPassword: boolean,
 *   setShowPassword: (value: boolean) => void,
 *   showConfirmPassword: boolean,
 *   setShowConfirmPassword: (value: boolean) => void,
 *   isFormValid: boolean,
 *   loading: boolean,
 *   setAlertVisible: (value: boolean) => void,
 *   alertVisible: boolean,
 *   error: ApolloError | undefined
 * }}
 */

const useCreateNewPasswordViewModel = () => {
  const [isFormError, setIsFormError] = useState<boolean>(false);
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
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPasswordOtp'>>();
  const { email } = route.params;

  useEffect(() => {
    logContentViewEvent({
      idPage: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_name: ANALYTICS_PAGE.UPDATE_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.UPDATE_PASSWORD}`
    });
  }, []);

  const handleGoBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_name: ANALYTICS_PAGE.UPDATE_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.UPDATE_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_name: 'Back',
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.goBack();
  };

  const methods = useForm<CreateNewPasswordFormValues>({
    mode: 'onChange',
    resolver: yupResolver(createNewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const { watch, formState, handleSubmit } = methods;
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [setPasswordApp, { loading, data, error }] = useMutation(SET_PASSWORD_APP_MUTATION);

  useEffect(() => {
    if (data?.setPasswordApp?.nextStep === '0') {
      navigation.navigate(screenNames.CREATE_NEW_PASSWORD_SUCCESS, { email });
    }
  }, [data, navigation]);

  useEffect(() => {
    if (password?.length > 0) {
      validatePasswordStrength(password);
    }
  }, [password]);

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

  const onSubmit: SubmitHandler<CreateNewPasswordFormValues> = async (data) => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_page_web_url: ANALYTICS_PAGE.UPDATE_PASSWORD,
      screen_name: ANALYTICS_PAGE.UPDATE_PASSWORD,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.UPDATE_PASSWORD}`,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.BUTTON,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.LOGIN_BUTTON_CONTINUE,
      content_name: 'Continuar',
      content_action: ANALYTICS_ATOMS.TAP
    });

    try {
      await setPasswordApp({
        variables: {
          input: {
            password: data.password
          }
        }
      });

      navigation.navigate(screenNames.CREATE_NEW_PASSWORD_SUCCESS, { email });
    } catch {
      setAlertVisible(true);
    }
  };

  const isFormValid =
    formState.isValid && isPasswordCriteriaMatched && password === confirmPassword;

  return {
    isFormError,
    setIsFormError,
    passwordCriteria,
    isPasswordCriteriaMatched,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    setAlertVisible,
    alertVisible,
    error,
    isFormValid,
    handleSubmit,
    password,
    confirmPassword,
    methods,
    handleGoBack
  };
};

export default useCreateNewPasswordViewModel;
