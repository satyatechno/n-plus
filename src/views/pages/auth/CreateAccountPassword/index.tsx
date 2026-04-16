import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';

import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/auth/CreateAccountPassword/styles';
import { isIos } from '@src/utils/platformCheck';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomText from '@src/views/atoms/CustomText';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import PasswordCriteria from '@src/views/organisms/PasswordCriteria';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import CustomLoader from '@src/views/atoms/CustomLoader';
import { WhiteTickIcon, VisibilityOffIcon, VisibilityOnIcon, CrossIcon } from '@src/assets/icons';
import useCreateAccountPasswordViewModel from '@src/viewModels/auth/CreateAccountPassword/useCreateAccountPasswordViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

/**
 * CreateAccountPassword component
 *
 * Handles account creation form logic and displays password criteria,
 * form errors, loading state, and the footer with links to terms and privacy policy.
 *
 * @returns {JSX.Element}
 */

const CreateAccountPassword: React.FC = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const {
    methods,
    onSubmit,
    passwordCriteria,
    isPasswordCriteriaMatched,
    showPassword,
    showConfirmPassword,
    isFormValid,
    password,
    confirmPassword,
    loading,
    toastMessage,
    setToastMessage,
    isFormError,
    setIsFormError,
    goBack,
    handlePasswordToggle,
    handleConfirmPasswordToggle
  } = useCreateAccountPasswordViewModel();
  const {
    formState: { errors, dirtyFields }
  } = methods;

  return (
    <SafeAreaView style={styles.mainFullContainer}>
      <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'} style={styles.fullContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <FormProvider {...methods}>
            {isFormError ? (
              <View style={styles.formErrorContainer}>
                <CustomText textStyles={styles.formErrorText}>
                  {t('screens.login.text.formError')}
                </CustomText>
              </View>
            ) : (
              <View style={styles.fullContainer}>
                <View>
                  <CustomHeader
                    headerText={t('screens.createAccountPassword.title')}
                    onPress={goBack}
                    headerTextFontFamily={fonts.franklinGothicURW}
                    headerTextWeight="Boo"
                    headerTextStyles={styles.headerTextStyles}
                  />
                </View>

                <ScrollView
                  contentContainerStyle={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <CustomHeading
                    headingText={t('screens.createAccountPassword.text.heading')}
                    subHeadingText={t('screens.createAccountPassword.text.subHeading')}
                    headingColor={theme.sectionTextTitleSpecial}
                    headingStyles={styles.titleText}
                    subHeadingColor={theme.subtitleTextSubtitle}
                    subHeadingStyles={styles.subtitleText}
                    isLogoVisible={false}
                  />

                  {/* email input */}
                  <ControlledTextInput
                    name="email"
                    label={t('screens.createAccountPassword.text.email')}
                    keyboardType="email-address"
                    setFormError={setIsFormError}
                    errorTextColor={theme.actionCTAToastError}
                    textInputStyles={[
                      {
                        borderColor: dirtyFields.email
                          ? errors.email
                            ? theme.actionCTAToastError
                            : theme.inputFillForegroundInteractiveFocused
                          : theme.inputFillforegroundInteractiveDefault
                      }
                    ]}
                  />

                  {/* password input */}
                  <View style={styles.inputContainer}>
                    <ControlledTextInput
                      name="password"
                      label={t('screens.createAccountPassword.text.password')}
                      placeholder={t('screens.createAccountPassword.text.passwordPlaceholder')}
                      errorTextColor={theme.actionCTAToastError}
                      textInputStyles={[
                        styles.passwordTextInputStyles,
                        {
                          borderColor: dirtyFields.password
                            ? errors.password
                              ? theme.actionCTAToastError
                              : theme.inputFillForegroundInteractiveFocused
                            : theme.inputFillforegroundInteractiveDefault
                        }
                      ]}
                      rightIcon={
                        showPassword ? (
                          <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                        ) : (
                          <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                        )
                      }
                      secureTextEntry={!showPassword}
                      onRightIconPress={handlePasswordToggle}
                      setFormError={setIsFormError}
                      showError={false}
                    />
                  </View>

                  {!isPasswordCriteriaMatched && (
                    <PasswordCriteria
                      criteria={passwordCriteria}
                      dirtyFields={dirtyFields.password}
                    />
                  )}

                  {/* confirm password input */}
                  <View
                    style={
                      !isPasswordCriteriaMatched
                        ? styles.invalidConfirmPasswordInputContainer
                        : styles.confirmPasswordInputContainer
                    }
                  >
                    <ControlledTextInput
                      name="confirmPassword"
                      label={t('screens.createAccountPassword.text.confirmPassword')}
                      placeholder={t('screens.createAccountPassword.text.passwordPlaceholder')}
                      rightIcon={
                        showConfirmPassword ? (
                          <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                        ) : (
                          <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                        )
                      }
                      errorTextColor={theme.actionCTAToastError}
                      textInputStyles={[
                        styles.passwordTextInputStyles,
                        {
                          borderColor: dirtyFields.confirmPassword
                            ? errors.confirmPassword
                              ? theme.actionCTAToastError
                              : theme.inputFillForegroundInteractiveFocused
                            : theme.inputFillforegroundInteractiveDefault
                        }
                      ]}
                      secureTextEntry={!showConfirmPassword}
                      setFormError={setIsFormError}
                      onRightIconPress={handleConfirmPasswordToggle}
                      showError={false}
                    />
                  </View>

                  {confirmPassword.length > 0 && (
                    <View style={styles.passwordMatchContainer}>
                      <View
                        style={StyleSheet.flatten([
                          styles.circle,
                          dirtyFields
                            ? confirmPassword === password
                              ? styles.circleFilled
                              : styles.circleRedFilled
                            : styles.circleEmpty
                        ])}
                      >
                        {confirmPassword === password ? (
                          <View style={styles.tickIcon}>
                            <WhiteTickIcon
                              width={actuatedNormalize(10)}
                              height={actuatedNormalizeVertical(12)}
                              strokeWidth={0.5}
                            />
                          </View>
                        ) : (
                          <View style={styles.tickIcon}>
                            <CrossIcon
                              stroke={theme.toggleIcongraphySwitch}
                              width={actuatedNormalize(8)}
                              height={actuatedNormalizeVertical(10)}
                              strokeWidth={2}
                            />
                          </View>
                        )}
                      </View>
                      <CustomText
                        size={fontSize.xs}
                        fontFamily={fonts.franklinGothicURW}
                        weight="Boo"
                        color={
                          dirtyFields
                            ? confirmPassword === password
                              ? theme.toastAndAlertsTextSuccess
                              : theme.actionCTAToastError
                            : theme.bodyTextMain
                        }
                        textStyles={styles.passwordMatchText}
                      >
                        {confirmPassword === password
                          ? t('screens.createAccountPassword.text.passwordMatch')
                          : t('screens.createAccountPassword.text.passwordDoesNotMatch')}
                      </CustomText>
                    </View>
                  )}

                  <CustomButton
                    buttonText={t('screens.createAccountPassword.text.createAccount')}
                    buttonStyles={
                      isFormValid
                        ? styles.validContinueButtonStyle
                        : styles.inValidContinueButtonStyle
                    }
                    onPress={() => {
                      Keyboard.dismiss();
                      methods.handleSubmit(onSubmit)();
                    }}
                    disabled={!isFormValid}
                    buttonTextColor={
                      isFormValid ? theme.primaryCTATextDefault : theme.primaryCTATextDisabled
                    }
                  />
                </ScrollView>
              </View>
            )}
          </FormProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ConsentFooter
        screenName="Create account Password"
        tipoContenido="Onboarding_Create account Password"
      />

      {loading && <CustomLoader />}

      <CustomToast
        type="error"
        message={
          toastMessage === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : toastMessage
        }
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
      />
    </SafeAreaView>
  );
};

export default CreateAccountPassword;
