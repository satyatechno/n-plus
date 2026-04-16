import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';

import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomText from '@src/views/atoms/CustomText';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import { CrossIcon, VisibilityOffIcon, VisibilityOnIcon, WhiteTickIcon } from '@src/assets/icons';
import CustomLoader from '@src/views/molecules/CustomLoader';
import CustomToast from '@src/views/molecules/CustomToast';
import { themeStyles } from '@src/views/pages/auth/CreateNewPassword/styles';
import useCreateNewPasswordViewModel from '@src/viewModels/auth/CreateNewPassword/useCreateNewPasswordViewModel';
import PasswordCriteria from '@src/views/organisms/PasswordCriteria';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const CreateNewPassword: React.FC = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const {
    isFormError,
    setIsFormError,
    onSubmit,
    passwordCriteria,
    isPasswordCriteriaMatched,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    setAlertVisible,
    alertVisible,
    error,
    password,
    confirmPassword,
    isFormValid,
    handleSubmit,
    methods,
    handleGoBack
  } = useCreateNewPasswordViewModel();
  const {
    formState: { dirtyFields }
  } = methods;

  return (
    <SafeAreaView style={styles.fullContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'} style={styles.fullContainer}>
          <View style={styles.header}>
            <CustomHeader
              headerText={t('screens.createNewPassword.title')}
              onPress={handleGoBack}
              headerTextFontFamily={fonts.franklinGothicURW}
              headerTextWeight="Boo"
              headerTextStyles={styles.headerText}
            />
          </View>

          {isFormError ? (
            <View style={styles.formErrorContainer}>
              <CustomText textStyles={styles.formErrorText}>
                {t('screens.createAccountPassword.error')}
              </CustomText>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <CustomHeading
                headingText={t('screens.createNewPassword.text.heading')}
                subHeadingText={t('screens.createNewPassword.text.subHeading')}
                headingColor={theme.sectionTextTitleSpecial}
                subHeadingColor={theme.subtitleTextSubtitle}
                subHeadingFont={fonts.franklinGothicURW}
                subHeadingWeight="Boo"
                isLogoVisible={false}
              />

              <FormProvider {...methods}>
                <ControlledTextInput
                  name="password"
                  label={t('screens.createNewPassword.text.password')}
                  labelTextWeight="Med"
                  placeholder={t('screens.createNewPassword.text.passwordPlaceholder')}
                  errorTextWeight="Boo"
                  errorTextColor={theme.actionCTAToastError}
                  textInputStyles={styles.textInputStyles}
                  errorTextFontFamily={fonts.franklinGothicURW}
                  rightIcon={
                    showPassword ? (
                      <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                    ) : (
                      <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                    )
                  }
                  secureTextEntry={!showPassword}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  setFormError={setIsFormError}
                  showError={false}
                  labelTextStyles={styles.passwordLabel}
                />

                {!isPasswordCriteriaMatched && (
                  <PasswordCriteria
                    criteria={passwordCriteria}
                    dirtyFields={dirtyFields.password}
                  />
                )}

                <View style={styles.confirmPasswordInputContainer}>
                  <ControlledTextInput
                    name="confirmPassword"
                    label={t('screens.createNewPassword.text.confirmPassword')}
                    labelTextWeight="Med"
                    placeholder={t('screens.createNewPassword.text.passwordPlaceholder')}
                    rightIcon={
                      showConfirmPassword ? (
                        <VisibilityOnIcon fill={theme.iconIconographyDisabledState2} />
                      ) : (
                        <VisibilityOffIcon fill={theme.iconIconographyDisabledState2} />
                      )
                    }
                    errorTextWeight="Boo"
                    errorTextColor={theme.onBoardingTextErrorHelperText}
                    textInputStyles={styles.textInputStyles}
                    errorTextFontFamily={fonts.franklinGothicURW}
                    secureTextEntry={!showConfirmPassword}
                    onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    setFormError={setIsFormError}
                    showError={false}
                    labelTextStyles={styles.confirmPasswordLabel}
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
                  buttonText={t('screens.createNewPassword.text.continue')}
                  buttonStyles={
                    isFormValid
                      ? styles.validContinueButtonStyle
                      : styles.inValidContinueButtonStyle
                  }
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isFormValid}
                  buttonTextSize={fontSize['s']}
                  buttonTextColor={
                    isFormValid ? theme.primaryCTATextDefault : theme.primaryCTATextDisabled
                  }
                />
              </FormProvider>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <ConsentFooter screenName="Reset password" tipoContenido="Onboarding_Reset password" />

      <CustomToast
        type="error"
        message={
          (
            error?.graphQLErrors?.[0]?.extensions as {
              reasons?: { message?: string }[];
            }
          )?.reasons?.[0]?.message || t('screens.login.text.somethingWentWrong')
        }
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {loading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default CreateNewPassword;
