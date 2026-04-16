import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

import { ApolloError } from '@apollo/client';

export interface CreateNewPasswordViewModel {
  onSubmit: SubmitHandler<CreateNewPasswordFormValues>;
  onError: SubmitErrorHandler<CreateNewPasswordFormValues>;
  isFormError: boolean;
  setIsFormError: (error: boolean) => void;
  passwordCriteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
  };
  isPasswordCriteriaMatched: boolean;
  setPassword: (value: string) => void;
  error: ApolloError | undefined;
  handlePasswordFocus: () => void;
  handleConfirmPasswordFocus: () => void;
  handleGoBack: () => void;
}

export interface CreateNewPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface SetPasswordAppData {
  setPasswordApp: {
    success: boolean;
    message: string;
    nextStep: string;
  };
}

export interface SetPasswordVariables {
  input: {
    password: string;
  };
}
