import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import useLoginViewModel from '@src/viewModels/auth/Login/useLoginViewModel';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { LoginFormValues } from '@src/models/auth/Login';
import { VisibilityOffIcon, VisibilityOnIcon } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';
import { loginSchema } from '@src/utils/schemas/loginSchema';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/auth/Login/styles';
import CustomLoader from '@src/views/atoms/CustomLoader';
import CustomText from '@src/views/atoms/CustomText';
import CustomToast from '@src/views/molecules/CustomToast';

/**
 * A functional component that renders the login screen.
 *
 * This component displays a heading with a logo, a subheading, and two form
 * fields for entering an email address and a password. The component also
 * renders a button to continue to the next step and a footer with terms and
 * conditions and a link to the privacy policy.
 *
 * @returns {JSX.Element} A login screen component.
 */

const LoginScreen: React.FC = () => {
  const {
    setIsFormError,
    onSubmit,
    theme,
    isPasswordVisible,
    error,
    loading,
    t,
    email,
    isFormError,
    alertVisible,
    setAlertVisible,
    getParsedErrorMessage,
    setIsPasswordVisible,
    goBack,
    onForgotPasswordPress,
    isSubmitting
  } = useLoginViewModel();
  const { ...methods } = useForm<LoginFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: email || ''
    }
  });
  const styles = themeStyles(theme);

  const {
    formState: { errors, dirtyFields },
    watch
  } = methods;

  const parsedError = getParsedErrorMessage();

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.login.title')}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Boo"
        headerTextStyles={styles.headerText}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={isIos ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {isFormError ? (
              <View style={styles.formErrorContainer}>
                <CustomText textStyles={styles.formErrorText}>
                  {t('screens.login.text.formError')}
                </CustomText>
              </View>
            ) : (
              <>
                <CustomHeading
                  isLogoVisible={false}
                  subHeadingText={t('screens.login.text.enterYourEmailPassword')}
                  subHeadingFont={fonts.franklinGothicURW}
                  subHeadingWeight="Boo"
                  headingText={t('screens.login.text.enterYourDetails')}
                />

                <FormProvider {...methods}>
                  <ControlledTextInput
                    name="email"
                    label={t('screens.login.text.email')}
                    labelTextWeight="Med"
                    placeholder={t('screens.login.text.emailPlaceholder')}
                    keyboardType="email-address"
                    setFormError={setIsFormError}
                    errorTextSize={fontSize['xxs']}
                    errorTextWeight="Boo"
                    errorTextColor={theme.actionCTAToastError}
                    errorTextFontFamily={fonts.franklinGothicURW}
                    labelTextStyles={styles.emailLabel}
                    textInputStyles={[
                      {
                        borderColor: errors.email
                          ? theme.actionCTAToastError
                          : dirtyFields.email || watch('email')?.length > 0
                            ? theme.inputFillForegroundInteractiveFocused
                            : theme.inputFillforegroundInteractiveDefault
                      }
                    ]}
                  />

                  <ControlledTextInput
                    name="password"
                    label={t('screens.login.text.password')}
                    labelTextWeight="Med"
                    placeholder={t('screens.login.text.enterPassword')}
                    rightIcon={
                      isPasswordVisible ? (
                        <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                      ) : (
                        <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                      )
                    }
                    onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    secureTextEntry={!isPasswordVisible}
                    setFormError={setIsFormError}
                    errorTextSize={fontSize['xxs']}
                    errorTextWeight="Boo"
                    errorTextColor={theme.actionCTAToastError}
                    labelTextStyles={styles.passwordLabel}
                    textInputStyles={[
                      styles.passwordInput,
                      {
                        borderColor: errors.password
                          ? theme.actionCTAToastError
                          : dirtyFields.password
                            ? theme.inputFillForegroundInteractiveFocused
                            : theme.inputFillforegroundInteractiveDefault
                      }
                    ]}
                  />
                </FormProvider>

                <CustomButton
                  variant="text"
                  buttonStyles={styles.forgotPasswordButton}
                  buttonText={t('screens.login.text.forgotPassword')}
                  onPress={onForgotPasswordPress}
                  buttonTextColor={theme.bodyTextHyperlinked}
                  buttonTextSize={fontSize['xs']}
                  buttonTextWeight="Med"
                  buttonTextFontFamily={fonts.franklinGothicURW}
                  buttonTextStyles={styles.forgotPasswordButtonText}
                  getTextColor={(pressed) =>
                    pressed ? theme.textAccentSecondary : theme.bodyTextHyperlinked
                  }
                />

                <CustomButton
                  buttonStyles={styles.button}
                  buttonText={t('screens.login.title')}
                  onPress={methods.handleSubmit(onSubmit)}
                  disabled={!dirtyFields.password && !dirtyFields.email}
                  buttonTextStyles={styles.buttonTextStyle}
                />
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {error && (
        <CustomToast
          type="error"
          message={parsedError?.heading ?? ''}
          subMessage={parsedError?.subHeading ?? ''}
          isVisible={alertVisible}
          onDismiss={() => setAlertVisible(false)}
        />
      )}

      {(isSubmitting || loading) && <CustomLoader />}
    </SafeAreaView>
  );
};

export default LoginScreen;
