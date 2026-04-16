import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export interface ChangePasswordFormValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface CreateAccountPasswordViewModel {
  onSubmit: SubmitHandler<ChangePasswordFormValues>;
  onError: SubmitErrorHandler<ChangePasswordFormValues>;
  passwordCriteria: PasswordCriteria;
  isPasswordCriteriaMatched: boolean;
  setPassword: (value: string) => void;
  loading: boolean;
  errorMessage: string;
  isFormError: boolean;
  setFormError: (value: boolean) => void;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  changePasswordApp: {
    nextStep: string;
  };
}
