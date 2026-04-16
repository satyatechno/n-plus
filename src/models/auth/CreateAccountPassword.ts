import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

export interface CreateAccountPasswordViewModel {
  onSubmit: SubmitHandler<CreateAccountPasswordFormValues>;
  onError: SubmitErrorHandler<CreateAccountPasswordFormValues>;
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
}

export interface CreateAccountPasswordFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangeAccountPasswordFormValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export interface CreateAccountPasswordViewModel {
  onSubmit: SubmitHandler<CreateAccountPasswordFormValues>;
  onError: SubmitErrorHandler<CreateAccountPasswordFormValues>;
  passwordCriteria: PasswordCriteria;
  isPasswordCriteriaMatched: boolean;
  setPassword: (value: string) => void;
  loading: boolean;
  errorMessage: string;
  isFormError: boolean;
  setFormError: (value: boolean) => void;
  showOldPassword: boolean;
  setShowOldPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ChangeAccountPasswordViewModel {
  onSubmit: SubmitHandler<ChangeAccountPasswordFormValues>;
  onError: SubmitErrorHandler<CreateAccountPasswordFormValues>;
  passwordCriteria: PasswordCriteria;
  isPasswordCriteriaMatched: boolean;
  setPassword: (value: string) => void;
  loading: boolean;
  errorMessage: string;
  isFormError: boolean;
  setIsFormError: (value: boolean) => void;
  isFormValid: boolean;
  showOldPassword: boolean;
  setShowOldPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  goBack: () => void;
  toastMessage: string;
  toastType: 'success' | 'error';
  handleToastDismiss: () => void;
}

export interface OnboardingInput {
  email: string;
  password: string;
  guestId?: string;
}

export interface OnboardingResponse {
  onboarding: {
    success: boolean;
    mfaToken: string;
  };
}
