import { ApolloError } from '@apollo/client';
import { AppTheme } from '@src/themes/theme';
import { UseFormReturn } from 'react-hook-form';

export interface ForgotPasswordViewModel {
  setIsFormError: (value: boolean) => void;
  t: (key: string) => string;
  isFormError?: boolean;
  theme: AppTheme;
  onSubmit: (formData: ForgotPasswordFormValues) => Promise<void>;
  loading?: boolean;
  goBack?: () => void;
  alertVisible: boolean;
  setAlertVisible: (value: boolean) => void;
  errorMessage: string;
  email?: string;
  error?: ApolloError;
  methods: UseFormReturn<ForgotPasswordFormValues>;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ForgetPasswordAppResponse {
  forgetPasswordApp: {
    passwordToken: string;
  };
}
