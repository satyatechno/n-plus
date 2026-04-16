import { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SubmitHandler } from 'react-hook-form';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, AuthenticationToken, LoginManager } from 'react-native-fbsdk-next';
import {
  AppleAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithCredential
} from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { sha256 } from 'react-native-sha256';

import {
  CheckEmailQueryResult,
  SocialMediaAuthFormValues,
  SocialMediaAuthViewModel,
  SocialResult
} from '@src/models/auth/SocialMediaAuth';
import { useTheme } from '@src/hooks/useTheme';
import { CHECK_EMAIL_QUERY } from '@src/graphql/auth/queries';
import { screenNames } from '@src/navigation/screenNames';
import { AuthStackParamList } from '@src/navigation/types';
import { SOCIAL_AUTH_NEXT_STEP } from '@src/config/constants';
import useAuthStore from '@src/zustand/auth/authStore';
import useNetworkStore from '@src/zustand/networkStore';
import { SOCIAL_LOGIN_APP_MUTATION } from '@src/graphql/auth/mutations';
import { isIos } from '@src/utils/platformCheck';
import { SocialProvider } from '@src/config/enum';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import {
  logLoginSignUpEvent,
  logSelectContentEvent
} from '@src/services/analytics/selectContentAnalyticsHelpers';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

export interface SocialLoginAppResult {
  socialLoginApp: {
    nextStep: string;
    email: string;
    userId: string;
    authToken: string;
    refreshToken: string;
    xApiKey?: string;
  };
}

const useSocialMediaAuthViewModel = (): SocialMediaAuthViewModel => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SocialAuth'>>();

  useEffect(() => {
    logContentViewEvent({
      screen_name: isLogin ? 'Login' : 'Create account',
      Tipo_Contenido: isLogin ? 'Onboarding_Login' : 'Onboarding_Create account'
    });
  }, []);

  const { email, showLoginScreen } = route.params || {};
  const {
    isTutorialShow,
    setTokens,
    setUserId,
    setSignInUsingSocialMedia,
    clearGuestToken,
    clearGuestId,
    guestId,
    setIsOnboardingRegistration
  } = useAuthStore();
  const { isInternetConnection } = useNetworkStore();
  const [isLogin, setIsLogin] = useState<boolean>(!!showLoginScreen);
  const [emailEntered, setEmailEntered] = useState<string>(email || '');
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [socialLoginLoading, setSocialLoginLoading] = useState<boolean>(false);

  const onGoBack = () => {
    logSelectContentEvent({
      idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
      screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
      screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
      Tipo_Contenido: isLogin
        ? ANALYTICS_COLLECTION.ONBOARDING_LOGIN
        : ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.HEADER,
      content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_BACK,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.goBack();
  };

  const onEmailValidationError = () => {
    AnalyticsService.logEvent('error_occurred', {
      screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
      Tipo_Contenido: isLogin
        ? ANALYTICS_COLLECTION.ONBOARDING_LOGIN
        : ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
      content_name: 'Formato de correo inválido',
      content_action: ANALYTICS_ATOMS.TAP
    });
  };

  const onLoginRegisterToggle = () => {
    logSelectContentEvent(
      {
        idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_name: isLogin
          ? ANALYTICS_PAGE.ONBOARDING_LOGIN
          : ANALYTICS_PAGE.ONBOARDING_CREATE_ACCOUNT,
        Tipo_Contenido: ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
        organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_WITH_EMAIL,
        content_name: isLogin ? 'Registrate link' : 'Inicia sesión link',
        content_action: isLogin
          ? ANALYTICS_ATOMS.INICIA_SESION
          : ANALYTICS_ATOMS.CONTINUAR_CREAR_CUENTA
      },
      ANALYTICS_META_EVENTS.LEAD
    );
  };

  const [socialLoginApp, { data: socialLoginData, error: socialLoginError }] =
    useMutation<SocialLoginAppResult>(SOCIAL_LOGIN_APP_MUTATION);

  const [checkEmail, { loading, error }] = useLazyQuery<CheckEmailQueryResult>(CHECK_EMAIL_QUERY, {
    fetchPolicy: 'network-only',
    onError: () => {
      setErrorMessage(
        !isInternetConnection
          ? t('screens.splash.text.noInternet')
          : t('screens.login.text.somethingWentWrong')
      );
      setAlertVisible(true);
    },
    onCompleted: (data) => {
      const exists = data?.checkEmail.exists;

      if (isLogin) {
        if (!exists) {
          setErrorMessage(t('screens.socialMediaAuth.text.emailNotRegistered'));
          setAlertVisible(true);
        } else {
          navigation.navigate(screenNames.LOGIN, { email: emailEntered });
          setErrorMessage('');
        }
      } else {
        if (exists) {
          setErrorMessage(t('screens.socialMediaAuth.text.emailAlreadyRegistered'));
          setAlertVisible(true);
        } else {
          navigation.navigate(screenNames.CREATE_ACCOUNT_PASSWORD, { email: emailEntered });
          setErrorMessage('');
        }
      }
    }
  });

  useEffect(() => {
    setSocialLoginLoading(false);
    if (socialLoginError) {
      const errMsg: string =
        (socialLoginError?.graphQLErrors?.[0]?.extensions?.message as string) ??
        (socialLoginError?.networkError?.message as string) ??
        t('screens.login.text.somethingWentWrong');

      setErrorMessage(errMsg);
      setAlertVisible(true);
    }

    if (socialLoginData) {
      setIsLogin(false);
      AnalyticsService.setUserContext(socialLoginData.socialLoginApp.email);

      const authToken = socialLoginData?.socialLoginApp?.authToken;
      const nextStep = socialLoginData.socialLoginApp.nextStep;
      const refreshToken = socialLoginData?.socialLoginApp?.refreshToken;
      const xApiKey = socialLoginData?.socialLoginApp?.xApiKey;
      setSignInUsingSocialMedia(true);
      setUserId(socialLoginData?.socialLoginApp?.userId);
      clearGuestId();

      if (nextStep === SOCIAL_AUTH_NEXT_STEP.ALREADY_LOGGED_IN || !nextStep) {
        setTokens(authToken, refreshToken, xApiKey);
        AnalyticsService.logAppsFlyerEvent('login_successfull', {
          user_id_nmas_hit: socialLoginData?.socialLoginApp?.userId,
          method: 'social'
        });
      } else if (nextStep === SOCIAL_AUTH_NEXT_STEP.NEW_REGISTRATION) {
        setIsOnboardingRegistration(true);
        setTokens(authToken, refreshToken, xApiKey);
        navigation.navigate(screenNames.SET_RECOMMENDATIONS, {
          isOnboarding: true,
          authToken: socialLoginData.socialLoginApp.authToken
        });
      }
    }
  }, [socialLoginError, socialLoginData]);

  const onSocialLoginPress = async ({ token, socialType }: SocialResult) => {
    clearGuestToken();
    await socialLoginApp({
      variables: {
        input: {
          token: token,
          socialType: socialType,
          ...(guestId && { guestId })
        }
      }
    });
  };

  const onSubmit: SubmitHandler<SocialMediaAuthFormValues> = ({ email }) => {
    Keyboard.dismiss();
    setEmailEntered(email);

    if (!isLogin) {
      logSelectContentEvent({
        idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_name: isLogin
          ? ANALYTICS_PAGE.ONBOARDING_LOGIN
          : ANALYTICS_PAGE.ONBOARDING_CREATE_ACCOUNT,
        Tipo_Contenido: ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
        organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_WITH_EMAIL,
        content_type: isLogin
          ? ANALYTICS_MOLECULES.ONBOARDING.BUTTON_CONTINUE_INICIAR_SESION
          : ANALYTICS_MOLECULES.ONBOARDING.BUTTON_CONTINUE_CREAR_CUENTA,
        content_name: ANALYTICS_MOLECULES.ONBOARDING.CONTINUAR,
        content_action: ANALYTICS_ATOMS.TAP
      });
    }

    try {
      checkEmail({ variables: { input: { email } } });
    } catch {
      setErrorMessage(error?.message || t('screens.login.text.somethingWentWrong'));
      setAlertVisible(true);
    }
  };

  const generateRandomNonce = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  async function onAppleButtonPress(): Promise<
    import('@react-native-firebase/auth').FirebaseAuthTypes.UserCredential
  > {
    Keyboard.dismiss();
    setSocialLoginLoading(true);

    logSelectContentEvent(
      {
        idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        Tipo_Contenido: isLogin
          ? ANALYTICS_COLLECTION.ONBOARDING_LOGIN
          : ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
        organisms: isLogin
          ? ANALYTICS_ORGANISMS.ONBOARDING.LOGIN_SOCIAL_MEDIA
          : ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_WITH_SOCIAL_MEDIA,
        content_type: `${ANALYTICS_MOLECULES.ONBOARDING.SOCIAL_MEDIA_BUTTON} | 3`,
        content_name: isLogin
          ? ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN_APPLE
          : ANALYTICS_MOLECULES.ONBOARDING.BUTTON_REGISTER_APPLE,
        content_action: isLogin ? ANALYTICS_ATOMS.LOGIN_APPLE : ANALYTICS_ATOMS.REGISTER_APPLE
      },
      isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD
    );

    logLoginSignUpEvent(
      {
        screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        method: 'apple'
      },
      isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD,
      isLogin ? 'login' : 'sign_up'
    );

    try {
      if (!isInternetConnection) {
        setSocialLoginLoading(false);
        setErrorMessage(t('screens.socialMediaAuth.text.appleSocialLoginError'));
        setAlertVisible(true);
        throw new Error(t('screens.socialMediaAuth.text.appleSocialLoginError'));
      }
      const rawNonce = generateRandomNonce();

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        nonce: rawNonce
      });

      const { identityToken } = appleAuthRequestResponse;
      if (!identityToken) throw new Error(t('screens.login.text.somethingWentWrong'));

      const appleCredential = AppleAuthProvider.credential(identityToken, rawNonce);

      const userCredential = await signInWithCredential(getAuth(), appleCredential);
      const idToken = await userCredential.user.getIdToken();

      await onSocialLoginPress({ token: idToken, socialType: SocialProvider.APPLE });

      return userCredential;
    } catch (error) {
      setSocialLoginLoading(false);
      throw error;
    }
  }

  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: Config.WEBCLIENT_ID,
        offlineAccess: true
      });
    } catch {
      setErrorMessage(t('screens.socialMediaAuth.text.cancelAppleLogin'));
      setAlertVisible(true);
    }
  }, []);

  const googleSignIn = useCallback(async (): Promise<void> => {
    try {
      setSocialLoginLoading(true);
      logSelectContentEvent(
        {
          idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
          screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
          screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
          Tipo_Contenido: isLogin
            ? ANALYTICS_COLLECTION.ONBOARDING_LOGIN
            : ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
          organisms: isLogin
            ? ANALYTICS_ORGANISMS.ONBOARDING.LOGIN_SOCIAL_MEDIA
            : ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_WITH_SOCIAL_MEDIA,
          content_type: `${ANALYTICS_MOLECULES.ONBOARDING.SOCIAL_MEDIA_BUTTON} | 1`,
          content_name: isLogin
            ? ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN_GOOGLE
            : ANALYTICS_MOLECULES.ONBOARDING.BUTTON_REGISTER_GOOGLE,
          content_action: isLogin ? ANALYTICS_ATOMS.LOGIN_GOOGLE : ANALYTICS_ATOMS.REGISTER_GOOGLE
        },
        isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD
      );
      logLoginSignUpEvent(
        {
          screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
          method: 'google'
        },
        isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD,
        isLogin ? 'login' : 'sign_up'
      );

      if (!isInternetConnection) {
        setSocialLoginLoading(false);
        setErrorMessage(t('screens.socialMediaAuth.text.appleSocialLoginError'));
        setAlertVisible(true);
        return;
      }

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(getAuth(), credential);

      const firebaseIdToken = await result.user.getIdToken();

      onSocialLoginPress({ token: firebaseIdToken, socialType: SocialProvider.GOOGLE });
    } catch {
      setSocialLoginLoading(false);
    }
  }, [isInternetConnection]);

  const onFacebookButtonPress = async () => {
    Keyboard.dismiss();
    setSocialLoginLoading(true);

    logSelectContentEvent(
      {
        idPage: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_page_web_url: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        Tipo_Contenido: isLogin
          ? ANALYTICS_COLLECTION.ONBOARDING_LOGIN
          : ANALYTICS_COLLECTION.ONBOARDING_CREATE_ACCOUNT,
        organisms: isLogin
          ? ANALYTICS_ORGANISMS.ONBOARDING.LOGIN_SOCIAL_MEDIA
          : ANALYTICS_ORGANISMS.ONBOARDING.REGISTRATION_WITH_SOCIAL_MEDIA,
        content_type: `${ANALYTICS_MOLECULES.ONBOARDING.SOCIAL_MEDIA_BUTTON} | 2`,
        content_name: isLogin
          ? ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN_FACEBOOK
          : ANALYTICS_MOLECULES.ONBOARDING.BUTTON_REGISTER_FACEBOOK,
        content_action: isLogin ? ANALYTICS_ATOMS.LOGIN_META : ANALYTICS_ATOMS.REGISTER_META
      },
      isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD
    );

    logLoginSignUpEvent(
      {
        screen_name: isLogin ? ANALYTICS_PAGE.LOGIN : ANALYTICS_PAGE.CREATE_ACCOUNT,
        method: 'facebook'
      },
      isLogin ? ANALYTICS_META_EVENTS.LOGIN_SUCCESSFULL : ANALYTICS_META_EVENTS.LEAD,
      isLogin ? 'login' : 'sign_up'
    );

    try {
      const auth = getAuth();
      let result;

      // "nonce," a number used once for authentication to prevent security issues like replay attacks
      const nonce = generateRandomNonce();
      const nonceSha256 = await sha256(nonce);

      if (isIos) {
        result = await LoginManager.logInWithPermissions(
          ['public_profile', 'email'],
          'limited',
          nonceSha256
        );
      } else {
        result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      }

      if (result.isCancelled) {
        setSocialLoginLoading(false);
        return;
      }

      const data = await new Promise<unknown>((resolve, reject) => {
        if (isIos) {
          AuthenticationToken.getAuthenticationTokenIOS().then(resolve).catch(reject);
        } else {
          AccessToken.getCurrentAccessToken().then(resolve).catch(reject);
        }
      });

      if (!data || typeof data !== 'object') {
        setSocialLoginLoading(false);
        setErrorMessage(t('screens.updateProfile.text.tokenInvalid'));
        setAlertVisible(true);
        return;
      }

      let facebookCredential;
      if (isIos) {
        const authData = data as { authenticationToken?: string };
        if ('authenticationToken' in data && typeof authData.authenticationToken === 'string') {
          facebookCredential = FacebookAuthProvider.credential(authData.authenticationToken, nonce);
        } else {
          throw new Error(t('screens.socialMediaAuth.text.authTokenError'));
        }
      } else {
        const accessData = data as { accessToken?: string };
        if ('accessToken' in data && typeof accessData.accessToken === 'string') {
          facebookCredential = FacebookAuthProvider.credential(accessData.accessToken);
        } else {
          throw new Error(t('screens.socialMediaAuth.text.accessTokenError'));
        }
      }

      const userCredential = await signInWithCredential(auth, facebookCredential);
      const idToken = await userCredential.user.getIdToken();

      onSocialLoginPress({ token: idToken, socialType: SocialProvider.FACEBOOK });
    } catch {
      setSocialLoginLoading(false);
      setErrorMessage(t('screens.updateProfile.text.errorMessage'));
      setAlertVisible(true);
    }
  };

  return {
    setIsFormError,
    isFormError,
    t,
    theme,
    onSubmit,
    errorMessage,
    loading,
    isLogin,
    setIsLogin,
    alertVisible,
    setAlertVisible,
    onGoBack,
    isTutorialShow,
    setErrorMessage,
    email,
    onAppleButtonPress,
    emailEntered,
    googleSignIn,
    onFacebookButtonPress,
    onLoginRegisterToggle,
    socialLoginLoading,
    onEmailValidationError
  };
};

export default useSocialMediaAuthViewModel;
