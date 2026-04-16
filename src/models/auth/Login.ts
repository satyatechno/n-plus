import { SubmitHandler } from 'react-hook-form';
import { ApolloError } from '@apollo/client';

import { AppTheme } from '@src/themes/theme';

export interface LoginViewModel {
  onSubmit: SubmitHandler<LoginFormValues>;
  isFormError: boolean;
  setIsFormError: (error: boolean) => void;
  theme: AppTheme;
  isPasswordVisible: boolean;
  error: ApolloError | undefined;
  loading: boolean;
  t: (text: string) => string;
  alertVisible: boolean;
  setAlertVisible: (visible: boolean) => void;
  setIsPasswordVisible: (visible: boolean) => void;
  getParsedErrorMessage: () => { heading: string; subHeading?: string };
  email: string;
  onForgotPasswordPress: () => void;
  goBack: () => void;
  isSubmitting: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  login: {
    refreshToken: string;
    authToken: string;
    userId: string;
    xApiKey?: string;
  };
}
