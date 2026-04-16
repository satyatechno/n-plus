import React from 'react';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import { CircularTickIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages/auth/SignUpOtpSuccess/styles';
import SuccessScreen from '@src/views/templates/auth/SuccessScreen';
import useSignUpOtpSuccessViewModel from '@src/viewModels/auth/SignUpOtp/useSignUpOtpSuccessViewModel';
import { useBlockBackNavigation } from '@src/hooks/useBlockBackNavigation';

/**
 * A screen component for displaying a success message after the user has successfully verified
 * their OTP (One-Time Password) during the sign-up process.
 *
 * This component is responsible for rendering the UI for the success screen, which includes a
 * heading, subheading, and a button to continue to the next step.
 *
 * @returns The success screen UI.
 */

const SignUpOtpSuccess: React.FC = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { onContinue } = useSignUpOtpSuccessViewModel();
  useBlockBackNavigation();

  return (
    <SuccessScreen
      title={t('screens.signUpOtpSuccess.title')}
      subtitle={t('screens.signUpOtpSuccess.text.heading')}
      buttonText={t('screens.signUpOtpSuccess.text.continueText')}
      onButtonPress={onContinue}
      buttonStyle={styles.continueButton}
      iconComponent={<CircularTickIcon color={theme.colorSecondary600} />}
    />
  );
};

export default SignUpOtpSuccess;
