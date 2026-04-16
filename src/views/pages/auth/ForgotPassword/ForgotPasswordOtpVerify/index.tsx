import React from 'react';
import { useTranslation } from 'react-i18next';

import { useForgotPasswordOtpTimerViewModel } from '@src/viewModels/auth/ForgotPassword/useForgotPasswordOtpTimerViewModel';
import OtpTemplate from '@src/views/templates/auth/Otp';
import { maskEmail } from '@src/utils/maskEmail';
import useForgotPasswordOtpVerifyViewModel from '@src/viewModels/auth/ForgotPassword/useForgotPasswordOtpVerifyViewModel';

/**
 * Screen component for entering and verifying a 6-digit OTP (One-Time Password) during the forgot password flow.
 *
 * - Uses useForgotPasswordOtpVerifyViewModel for OTP input and validation
 * - Uses useForgotPasswordOtpTimerViewModel for resend and timer
 * - Renders OtpTemplate and CustomToast
 */

const ForgotPasswordOtp: React.FC = () => {
  const {
    otp,
    setOtp,
    isValid,
    handleOtpChange,
    handleOtpValidation,
    loading,
    handleGoBack,
    toastVisible,
    toastMessage,
    toastType,
    setToastVisible,
    email,
    resetOtpTrigger,
    setResetOtpTrigger
  } = useForgotPasswordOtpVerifyViewModel();

  const {
    formattedTime,
    isTimerRunning,
    onResend,
    resendLoading,
    toastVisible: resendToastVisible,
    toastMessage: resendToastMessage,
    toastType: resendToastType,
    setToastVisible: setResendToastVisible
  } = useForgotPasswordOtpTimerViewModel();

  const { t } = useTranslation();

  return (
    <OtpTemplate
      title={t('screens.forgotPasswordOtp.title')}
      heading={t('screens.forgotPasswordOtp.text.heading')}
      subHeading={`${t('screens.forgotPasswordOtp.text.subHeading')} ${maskEmail(email)}`}
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
        setResetOtpTrigger((prev) => !prev);
        onResend();
      }}
      resendLoading={resendLoading}
      onHeaderPress={handleGoBack}
      toastVisible={toastVisible}
      toastMessage={toastMessage}
      toastType={toastType}
      setToastVisible={setToastVisible}
      resendToastVisible={resendToastVisible}
      resendToastMessage={resendToastMessage}
      resendToastType={resendToastType}
      setResendToastVisible={setResendToastVisible}
      loading={loading}
      resetOtpTrigger={resetOtpTrigger}
    />
  );
};

export default ForgotPasswordOtp;
