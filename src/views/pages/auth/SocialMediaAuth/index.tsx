import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/auth/SocialMediaAuth/styles';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomLoader from '@src/views/molecules/CustomLoader';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import { SocialMediaAuthFormValues } from '@src/models/auth/SocialMediaAuth';
import { socialMediaAuthSchema } from '@src/utils/schemas/socialMediaAuthSchema';
import { isIos } from '@src/utils/platformCheck';
import useSocialMediaAuthViewModel from '@src/viewModels/auth/SocialMediaAuth/useSocialMediaAuthViewModel';
import { AppleLogoIcon, FacebookLogoIcon, GoogleLogoIcon } from '@src/assets/icons';
import IntroScreens from '@src/views/organisms/IntroScreen';

/**
 * SocialMediaAuth is a React functional component that renders a social media authentication screen.
 *
 * This component provides a form for users to authenticate using their email or via social media providers
 * such as Google, Facebook, and Apple (on iOS). It manages form state, validation, error handling, and loading states.
 *
 * Features:
 * - Email input with validation using react-hook-form and Yup schema.
 * - Toggle between login and registration modes.
 * - Social login buttons for Google, Facebook, and Apple (iOS only).
 * - Displays error messages and loading indicators.
 * - Custom header, footer, and toast notifications.
 *
 * @component
 * @returns {JSX.Element} The rendered social media authentication UI.
 */

const SocialMediaAuth: React.FC = () => {
  const {
    setIsFormError,
    t,
    theme,
    onSubmit,
    isLogin,
    setIsLogin,
    setAlertVisible,
    errorMessage,
    isFormError,
    loading,
    alertVisible,
    isTutorialShow,
    setErrorMessage,
    onGoBack,
    email,
    onAppleButtonPress,
    emailEntered,
    googleSignIn,
    socialLoginLoading,
    onFacebookButtonPress,
    onEmailValidationError,
    onLoginRegisterToggle
  } = useSocialMediaAuthViewModel();
  const styles = themeStyles(theme);

  const { ...methods } = useForm<SocialMediaAuthFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(socialMediaAuthSchema),
    defaultValues: {
      email: email || ''
    }
  });

  const {
    formState: { errors, dirtyFields },
    watch
  } = methods;

  React.useEffect(() => {
    if (errors.email) {
      onEmailValidationError();
    }
  }, [errors.email, isLogin, onEmailValidationError]);

  if (isTutorialShow && !isLogin) {
    return (
      <View style={styles.introScreenView}>
        <IntroScreens />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={styles.container} behavior={isIos ? 'padding' : 'height'}>
        <View style={styles.innerContainer}>
          {isFormError ? (
            <View style={styles.formErrorContainer}>
              <CustomText textStyles={styles.formErrorText}>
                {t('screens.socialMediaAuth.text.problemWithLoading')}
              </CustomText>
            </View>
          ) : (
            <>
              <CustomHeader onPress={onGoBack} />

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.headerContainer}>
                    <CustomHeading
                      isLogoVisible={true}
                      logoHeight={actuatedNormalizeVertical(43)}
                      logoWidth={actuatedNormalize(77)}
                      headingText={
                        isLogin
                          ? t('screens.socialMediaAuth.text.welcomeBack')
                          : t('screens.socialMediaAuth.text.createYourAccount')
                      }
                      subHeadingText={
                        isLogin ? t('screens.socialMediaAuth.text.enterYourEmail') : ''
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <FormProvider {...methods}>
                      <ControlledTextInput
                        name="email"
                        label={t('screens.socialMediaAuth.text.email')}
                        labelTextStyles={styles.labelTextStyles}
                        placeholder={t('screens.socialMediaAuth.text.placeholder')}
                        keyboardType="email-address"
                        setFormError={setIsFormError}
                        textInputStyles={[
                          {
                            borderColor:
                              errors.email || (errorMessage && emailEntered)
                                ? theme.actionCTAToastError
                                : dirtyFields.email || watch('email')?.length > 0
                                  ? theme.inputFillForegroundInteractiveFocused
                                  : theme.inputFillforegroundInteractiveDefault
                          }
                        ]}
                      />
                    </FormProvider>
                  </View>
                  <CustomButton
                    onPress={methods.handleSubmit(onSubmit)}
                    buttonText={t('screens.socialMediaAuth.text.continue')}
                    disabled={watch('email')?.length === 0}
                    buttonTextSize={fontSize.s}
                    buttonTextStyles={styles.buttonTextStyle}
                  />
                  <View style={styles.orDividerContainer}>
                    <LinearGradient
                      colors={['transparent', theme.iconIconographyDisabledState1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.orLineLeft}
                    />

                    <CustomText
                      size={fontSize.s}
                      weight="Boo"
                      fontFamily={fonts.franklinGothicURW}
                      textStyles={styles.orText}
                    >
                      {t('screens.socialMediaAuth.text.or')}
                    </CustomText>

                    <LinearGradient
                      colors={[theme.iconIconographyDisabledState1, 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.orLineRight}
                    />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.socialButtonContainer,
                      pressed && {
                        backgroundColor: theme.toggleIcongraphyDisabledState
                      }
                    ]}
                    onPress={googleSignIn}
                  >
                    <GoogleLogoIcon />

                    <CustomText
                      weight="Med"
                      fontFamily={fonts.franklinGothicURW}
                      //TODO -> Dummy text will be removed as we get google credentials
                      textStyles={styles.descriptionText}
                    >
                      {t('screens.socialMediaAuth.text.googleTitle')}
                    </CustomText>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.socialButtonContainer,
                      pressed && {
                        backgroundColor: theme.toggleIcongraphyDisabledState
                      }
                    ]}
                    onPress={onFacebookButtonPress}
                  >
                    <FacebookLogoIcon />

                    <CustomText
                      weight="Med"
                      fontFamily={fonts.franklinGothicURW}
                      //TODO -> Dummy text will be removed as we get facebook credentials
                      textStyles={styles.descriptionText}
                    >
                      {t('screens.socialMediaAuth.text.facebookTitle')}
                    </CustomText>
                  </Pressable>

                  {isIos && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.socialButtonContainer,
                        pressed && {
                          backgroundColor: theme.toggleIcongraphyDisabledState
                        }
                      ]}
                      onPress={onAppleButtonPress}
                    >
                      <AppleLogoIcon />

                      <CustomText
                        weight="Med"
                        fontFamily={fonts.franklinGothicURW}
                        // TODO -> Dummy text will be removed as we get apple credentials
                        textStyles={styles.descriptionText}
                      >
                        {t('screens.socialMediaAuth.text.appleTitle')}
                      </CustomText>
                    </Pressable>
                  )}

                  <View style={styles.logInLinkContainer}>
                    <CustomText
                      size={fontSize.xs}
                      weight="Boo"
                      textStyles={styles.textStyles}
                      fontFamily={fonts.franklinGothicURW}
                    >
                      {isLogin
                        ? t('screens.socialMediaAuth.text.dontHaveAccount')
                        : t('screens.socialMediaAuth.text.alreadyHaveAnAccount')}
                    </CustomText>

                    <CustomButton
                      variant="text"
                      buttonText={
                        isLogin
                          ? t('screens.socialMediaAuth.text.register')
                          : t('screens.socialMediaAuth.text.signIn')
                      }
                      onPress={() => {
                        onLoginRegisterToggle();
                        setIsLogin(!isLogin);
                        setAlertVisible(false);
                        setErrorMessage('');
                      }}
                      buttonTextColor={theme.bodyTextHyperlinked}
                      buttonTextSize={fontSize['xs']}
                      buttonTextStyles={styles.textStyles}
                      getTextColor={(pressed) =>
                        pressed ? theme.textAccentSecondary : theme.bodyTextHyperlinked
                      }
                    />
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <ConsentFooter screenName="Create account" tipoContenido="Onboarding_Create account" />

      <CustomToast
        type="error"
        message={errorMessage}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {(loading || socialLoginLoading) && <CustomLoader />}
    </SafeAreaView>
  );
};

export default SocialMediaAuth;
