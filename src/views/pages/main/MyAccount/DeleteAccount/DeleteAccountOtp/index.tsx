import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';

import OtpTemplate from '@src/views/templates/auth/Otp';
import { maskEmail } from '@src/utils/maskEmail';
import { AuthStackParamList } from '@src/navigation/types';
import useDeleteAccountOtpViewModel from '@src/viewModels/main/MyAccount/DeleteAccount/useDeleteAccountOtpTimerViewModel';
import { useDeleteAccountOtpTimerViewModel } from '@src/viewModels/main/MyAccount/DeleteAccount/useDeleteAccountOtpViewModel';
import { themeStyles } from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountOtp/styles';

/**
 * Screen component for entering and verifying a 6-digit OTP (One-Time Password) for account deletion.
 *
 * What this screen does:
 * - Displays a UI where users can input a 6-digit OTP code.
 * - Uses useDeleteAccountOtpViewModel for OTP input and validation.
 * - Uses useOtpTimerViewModel for timer and resend logic.
 * - Renders OtpTemplate for consistent UI.
 *
 * @returns The OTP screen UI with input, validation, and resend logic.
 */

const DeleteAccountOtp: React.FC = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'SignUpOtp'>>();
  const { email } = route?.params ?? {};

  const {
    otp,
    setOtp,
    isValid,
    handleOtpChange,
    handleOtpValidation,
    loading,
    handleGoBack,
    toastMessage,
    toastType,
    toastVisible,
    setToastVisible,
    resetOtpTrigger,
    setResetOtpTrigger
  } = useDeleteAccountOtpViewModel();

  const {
    formattedTime,
    isTimerRunning,
    resendLoading,
    onResend,
    resendToastVisible,
    setResendToastVisible,
    resendToastMessage,
    resendToastType
  } = useDeleteAccountOtpTimerViewModel();

  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(), []);

  return (
    <OtpTemplate
      title={t('screens.deleteAccountOtp.title')}
      heading={t('screens.deleteAccountOtp.text.heading')}
      subHeading={`${t('screens.deleteAccountOtp.text.subHeading')} ${maskEmail(email)}`}
      resendText={t('screens.deleteAccountOtp.text.resendCode')}
      buttonText={t('screens.deleteAccountOtp.text.verifyCode')}
      didntReceiveCode={t('screens.deleteAccountOtp.text.didntReceiveCode')}
      resend={t('screens.deleteAccountOtp.text.resend')}
      isValid={isValid}
      otp={otp}
      onOtpChange={handleOtpChange}
      onValidate={handleOtpValidation}
      loading={loading}
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
      resetOtpTrigger={resetOtpTrigger}
      containerContentStyle={styles.container}
      isDeleteOtp={true}
    />
  );
};

export default DeleteAccountOtp;
