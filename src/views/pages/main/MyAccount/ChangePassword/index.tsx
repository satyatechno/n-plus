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

import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomText from '@src/views/atoms/CustomText';
import CustomHeading from '@src/views/molecules/CustomHeading';
import PasswordCriteria from '@src/views/organisms/PasswordCriteria';
import { CrossIcon, VisibilityOffIcon, VisibilityOnIcon, WhiteTickIcon } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/main/MyAccount/ChangePassword/styles';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import CustomLoader from '@src/views/atoms/CustomLoader';
import useChangePasswordViewModel from '@src/viewModels/main/MyAccount/ChangePassword/useChangePasswordViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const {
    methods,
    setFormError,
    passwordCriteria,
    isPasswordCriteriaMatched,
    onSubmit,
    onError,
    showOldPassword,
    showPassword,
    showConfirmPassword,
    handleOldPasswordToggle,
    handlePasswordToggle,
    handleConfirmPasswordToggle,
    isFormValid,
    password,
    confirmPassword,
    loading,
    handleGoBack,
    toastType,
    toastVisible,
    toastMessage,
    setToastVisible,
    isFormError
  } = useChangePasswordViewModel();

  const {
    formState: { errors, dirtyFields }
  } = methods;

  return (
    <SafeAreaView style={styles.chnagePasswordContainer}>
      <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'} style={styles.fullContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <FormProvider {...methods}>
            <View style={styles.fullContainer}>
              <View>
                <CustomHeader
                  headerText={t('screens.changePassword.title')}
                  onPress={handleGoBack}
                  headerTextFontFamily={fonts.franklinGothicURW}
                  headerTextWeight="Boo"
                  headerTextStyles={styles.headerTextStyles}
                />
              </View>

              {isFormError ? (
                <View style={styles.formErrorContainer}>
                  <CustomText textStyles={styles.formErrorText}>
                    {t('screens.validation.form.genericError')}
                  </CustomText>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <CustomHeading
                    headingText={t('screens.changePassword.text.heading')}
                    subHeadingText={t('screens.changePassword.text.subHeading')}
                    headingColor={theme.sectionTextTitleSpecial}
                    headingStyles={styles.titleText}
                    subHeadingColor={theme.subtitleTextSubtitle}
                    subHeadingStyles={styles.subtitleText}
                    isLogoVisible={false}
                  />
                  {/* Old Password */}

                  <ControlledTextInput
                    name="oldPassword"
                    label={t('screens.changePassword.text.oldPassword')}
                    placeholder={t('screens.createAccountPassword.text.passwordPlaceholder')}
                    errorTextColor={theme.actionCTAToastError}
                    textInputStyles={[
                      {
                        borderColor: dirtyFields.oldPassword
                          ? errors.oldPassword
                            ? theme.actionCTAToastError
                            : theme.inputFillForegroundInteractiveFocused
                          : theme.inputFillforegroundInteractiveDefault
                      }
                    ]}
                    rightIcon={
                      showOldPassword ? (
                        <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                      ) : (
                        <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                      )
                    }
                    secureTextEntry={!showOldPassword}
                    onRightIconPress={handleOldPasswordToggle}
                    showError={false}
                    setFormError={setFormError}
                  />

                  {/* New Password */}
                  <View style={styles.inputContainer}>
                    <ControlledTextInput
                      name="password"
                      label={t('screens.changePassword.text.newPassword')}
                      placeholder={t('screens.createAccountPassword.text.passwordPlaceholder')}
                      errorTextColor={theme.actionCTAToastError}
                      textInputStyles={[
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
                      showError={false}
                      setFormError={setFormError}
                    />
                  </View>

                  {/* Password Criteria */}
                  {!isPasswordCriteriaMatched && (
                    <PasswordCriteria
                      criteria={passwordCriteria}
                      dirtyFields={dirtyFields.password}
                    />
                  )}

                  {/* Confirm Password */}
                  <View
                    style={
                      !isPasswordCriteriaMatched
                        ? styles.invalidConfirmPasswordInputContainer
                        : styles.confirmPasswordInputContainer
                    }
                  >
                    <ControlledTextInput
                      name="confirmPassword"
                      label={t('screens.changePassword.text.confirmPassword')}
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
                        {
                          borderColor: dirtyFields.confirmPassword
                            ? errors.confirmPassword
                              ? theme.actionCTAToastError
                              : theme.inputFillForegroundInteractiveFocused
                            : theme.inputFillforegroundInteractiveDefault
                        }
                      ]}
                      secureTextEntry={!showConfirmPassword}
                      onRightIconPress={handleConfirmPasswordToggle}
                      setFormError={setFormError}
                      showError={false}
                    />
                  </View>

                  {/* Password Match Message */}
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
                    buttonText={t('screens.changePassword.text.changePasswordButton')}
                    buttonStyles={
                      isFormValid
                        ? styles.validContinueButtonStyle
                        : styles.inValidContinueButtonStyle
                    }
                    onPress={() => {
                      Keyboard.dismiss();
                      methods.handleSubmit(onSubmit, onError)();
                    }}
                    disabled={!isFormValid || loading}
                    buttonTextColor={
                      isFormValid ? theme.primaryCTATextDefault : theme.primaryCTATextDisabled
                    }
                  />
                </ScrollView>
              )}
            </View>
          </FormProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {loading && <CustomLoader />}

      <CustomToast
        type={toastType}
        message={
          toastMessage === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : toastMessage
        }
        isVisible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ChangePassword;
