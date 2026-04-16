import React from 'react';
import { View } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fonts } from '@src/config/fonts';
import CustomLoader from '@src/views/molecules/CustomLoader';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { themeStyles } from '@src/views/pages/auth/ForgotPassword/styles';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import useForgotPasswordViewModel from '@src/viewModels/auth/ForgotPassword/useForgotPasswordViewModel';
import CustomToast from '@src/views/molecules/CustomToast';

const ForgotPassword: React.FC = () => {
  const {
    theme,
    t,
    setIsFormError,
    goBack,
    onSubmit,
    loading,
    errorMessage,
    setAlertVisible,
    alertVisible,
    methods
  } = useForgotPasswordViewModel();
  const styles = themeStyles(theme);

  const {
    formState: { errors, dirtyFields },
    watch
  } = methods;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <CustomHeader
          onPress={goBack}
          headerText={t('screens.forgotPassword.text.forgottenPassword')}
          headerTextColor={theme.newsTextTitlePrincipal}
          headerTextWeight="Boo"
          headerTextFontFamily={fonts.franklinGothicURW}
          headerTextStyles={styles.headerTextStyles}
        />

        <CustomHeading
          isLogoVisible={false}
          headingText={t('screens.forgotPassword.text.resetYourPassword')}
          subHeadingText={t('screens.forgotPassword.text.enterEmailSendResetCode')}
          subHeadingWeight="Boo"
          subHeadingFont={fonts.franklinGothicURW}
        />

        <View style={styles.inputContainer}>
          <FormProvider {...methods}>
            <ControlledTextInput
              name="email"
              label={t('screens.socialMediaAuth.text.email')}
              placeholder={t('screens.socialMediaAuth.text.placeholder')}
              keyboardType="email-address"
              setFormError={setIsFormError}
              textInputStyles={[
                {
                  borderColor:
                    dirtyFields.email || watch('email')?.length > 0
                      ? errors.email || errorMessage
                        ? theme.actionCTAToastError
                        : theme.inputFillForegroundInteractiveFocused
                      : theme.inputFillforegroundInteractiveDefault
                }
              ]}
            />
          </FormProvider>
        </View>

        <CustomButton
          onPress={methods.handleSubmit(onSubmit)}
          buttonText={t('screens.forgotPassword.text.sendCode')}
          disabled={!methods.formState.isValid}
          buttonTextStyles={styles.buttonTextStyle}
        />
      </View>

      <CustomToast
        type={'error'}
        message={errorMessage}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {loading ? <CustomLoader /> : ''}
    </SafeAreaView>
  );
};

export default ForgotPassword;
