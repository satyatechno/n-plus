import { SubmitHandler } from 'react-hook-form';

import { AppTheme } from '@src/themes/theme';
import { SocialProvider } from '@src/config/enum';

export interface SocialMediaAuthViewModel {
  setIsFormError: (value: boolean) => void;
  t: (text: string) => string;
  theme: AppTheme;
  onSubmit: SubmitHandler<SocialMediaAuthFormValues>;
  loading: boolean;
  errorMessage: string;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  isFormError: boolean;
  alertVisible: boolean;
  setAlertVisible: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  onGoBack: () => void;
  isTutorialShow: boolean;
  email?: string;
  onAppleButtonPress: () => Promise<
    import('@react-native-firebase/auth').FirebaseAuthTypes.UserCredential
  >;
  emailEntered: string;
  googleSignIn: () => void;
  onFacebookButtonPress?: () => void;
  socialLoginLoading: boolean;
  onEmailValidationError: () => void;
  onLoginRegisterToggle: () => void;
}

export interface SocialMediaAuthFormValues {
  email: string;
}

export interface CheckEmailQueryResult {
  checkEmail: {
    exists: boolean;
    isBlocked: boolean;
  };
}

export interface SocialResult {
  token: string;
  socialType: SocialProvider;
}

export interface FirebaseInput {
  token: string;
  socialType: SocialProvider;
  guestId?: string;
}

export interface SocialLoginResult {
  socialLoginApp: {
    authToken: string;
    refreshToken: string;
    userId: string;
    xApiKey?: string;
  };
}
