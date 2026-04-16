import React from 'react';

import { useTranslation } from 'react-i18next';

import OtpTemplate from '@src/views/templates/auth/Otp';
import useSignUpOtpViewModel from '@src/viewModels/auth/SignUpOtp/useSignUpOtpViewModel';
import { useOtpViewModel } from '@src/viewModels/auth/Otp/useOtpViewModel';
import { maskEmail } from '@src/utils/maskEmail';

/**
 * Screen component for entering and verifying a 6-digit OTP (One-Time Password).
 *
 * - Uses useSignUpOtpViewModel for OTP input and validation
 * - Uses useOtpViewModel for resend and timer
 * - Renders OtpTemplate and CustomToast
 */

const SignUpOtp: React.FC = () => {
  const {
    email,
    otp,
    setOtp,
    isValid,
    handleOtpChange,
    handleOtpValidation,
    goBack,
    toastVisible,
    toastMessage,
    toastType,
    setToastVisible,
    resetOtpTrigger,
    setResetOtpTrigger,
    loading
  } = useSignUpOtpViewModel();

  const {
    formattedTime,
    isTimerRunning,
    onResend,
    resendLoading,
    resendToastVisible,
    setResendToastVisible,
    resendToastMessage,
    resendToastType
  } = useOtpViewModel();

  const { t } = useTranslation();

  return (
    <OtpTemplate
      title={t('screens.signUpOtp.title')}
      heading={t('screens.signUpOtp.text.heading')}
      subHeading={`${t('screens.signUpOtp.text.subHeading')} ${maskEmail(email as string)}`}
      resendText={t('screens.signUpOtp.text.resendCode')}
      buttonText={t('screens.signUpOtp.text.verifyCode')}
      didntReceiveCode={t('screens.signUpOtp.text.didntReceiveCode')}
      resend={t('screens.signUpOtp.text.resend')}
      isValid={isValid}
      otp={otp}
      onOtpChange={handleOtpChange}
      onValidate={handleOtpValidation}
      isTimerRunning={isTimerRunning}
      formattedTime={formattedTime}
      onResend={() => {
        setOtp('');
        setResetOtpTrigger(!resetOtpTrigger);
        onResend();
      }}
      resendLoading={resendLoading}
      onHeaderPress={goBack}
      toastVisible={toastVisible}
      toastMessage={toastMessage}
      toastType={toastType}
      setToastVisible={setToastVisible}
      resendToastVisible={resendToastVisible}
      resendToastMessage={resendToastMessage}
      resendToastType={resendToastType}
      setResendToastVisible={setResendToastVisible}
      resetOtpTrigger={resetOtpTrigger}
      loading={loading}
    />
  );
};

export default SignUpOtp;
