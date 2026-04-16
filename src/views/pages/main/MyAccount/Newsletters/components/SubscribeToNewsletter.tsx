import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomToast from '@src/views/molecules/CustomToast';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import { SocialMediaAuthFormValues } from '@src/models/auth/SocialMediaAuth';
import { socialMediaAuthSchema } from '@src/utils/schemas/socialMediaAuthSchema';
import { isIos } from '@src/utils/platformCheck';
import { AppTheme } from '@src/themes/theme';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import CustomLoader from '@src/views/atoms/CustomLoader';
import { fonts } from '@src/config/fonts';

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

const SubscribeToNewsletter: React.FC = () => {
  const {
    setIsFormError,
    t,
    theme,
    setAlertVisible,
    isFormError,
    alertVisible,
    goBack,
    showToastType,
    toastMessage,
    buttonInToast,
    changeSubscriptionLoading,
    onValidSubmit,
    changeSubscriptionData
  } = useNewslettersViewModel();
  const styles = themeStyles(theme);

  const { ...methods } = useForm<SocialMediaAuthFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(socialMediaAuthSchema),
    defaultValues: {
      email: ''
    }
  });

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    watch
  } = methods;

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
              <CustomHeader
                onPress={goBack}
                headerText={t('screens.newsletters.title')}
                headerTextFontFamily={fonts.franklinGothicURW}
                headerTextSize={fontSize.s}
                headerTextWeight="Boo"
                headerTextStyles={styles.headerText}
              />

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainerStyle}>
                  <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContainer}
                  >
                    <View>
                      <CustomHeading
                        headingText={t('screens.newsletters.text.subscribeToNewsletter')}
                        headingFont={fonts.notoSerifExtraCondensed}
                        headingSize={fontSize['2xl']}
                        headingStyles={styles.headingTextStyles}
                        subHeadingText={t('screens.newsletters.text.leaveUsYourMail')}
                        subHeadingFont={fonts.franklinGothicURW}
                        subHeadingSize={fontSize.xs}
                        subHeadingWeight="Boo"
                        subHeadingStyles={styles.subheadingTextStyles}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <FormProvider {...methods}>
                        <ControlledTextInput
                          name="email"
                          label={t('screens.socialMediaAuth.text.email')}
                          labelTextStyles={styles.labelTextStyles}
                          placeholder={t('screens.newsletters.text.enterEmailAddress')}
                          keyboardType="email-address"
                          setFormError={setIsFormError}
                          textInputStyles={[
                            {
                              borderColor: errors.email
                                ? theme.inputFillForegroundInteractiveError
                                : dirtyFields.email || watch('email')?.length > 0
                                  ? theme.inputFillForegroundInteractiveFocused
                                  : theme.inputFillforegroundInteractiveDefault
                            }
                          ]}
                        />
                      </FormProvider>
                    </View>
                  </ScrollView>

                  <View>
                    <CustomButton
                      onPress={handleSubmit(onValidSubmit)}
                      buttonText={t('screens.socialMediaAuth.text.continue')}
                      disabled={!watch('email') || watch('email').trim().length === 0}
                      buttonTextSize={fontSize.s}
                      buttonTextStyles={styles.buttonTextStyle}
                      buttonStyles={styles.buttonStyles}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <CustomToast
        type={showToastType === 'success' ? 'success' : 'error'}
        message={
          changeSubscriptionData?.changeNewsletterSubscriptionStatus === true && watch('email')
            ? `${t('screens.newsletters.text.emailRecieved')} ${watch('email')}`
            : toastMessage
        }
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        buttonText={buttonInToast}
        toastContainerStyle={styles.toastContainerStyle}
      />

      {changeSubscriptionLoading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default SubscribeToNewsletter;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    container: {
      flex: 1
    },

    inputContainer: {
      height: actuatedNormalizeVertical(82),
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginBottom: actuatedNormalizeVertical(spacing['7xl'])
    },

    validContinueButtonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.filledButtonPrimary,
      borderRadius: radius.m
    },

    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },

    textStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    labelTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    formErrorContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    formErrorText: {
      textAlign: 'center'
    },
    innerContainer: {
      flex: 1
    },
    toastContainerStyle: {
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(5)
    },
    innerContainerStyle: {
      flex: 1
    },
    headerText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3),
      color: theme.newsTextTitlePrincipal
    },
    headingTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['6xl'])
    },
    subheadingTextStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      marginTop: undefined
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: actuatedNormalize(2)
    },
    buttonStyles: {
      marginVertical: spacing.s
    }
  });
