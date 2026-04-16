export interface SignUpOtpViewModel {
  otp: string;
  setOtp: (otp: string) => void;
  isValid: boolean;
  handleOtpChange: (otp: string) => void;
  handleOtpValidation: () => void;
  loading: boolean;
  errorMessage: string | null;
  goBack: () => void;
  toastVisible: boolean;
  toastMessage: string;
  toastType: 'error' | 'success';
  setToastVisible: (visible: boolean) => void;
  setToastMessage: (msg: string) => void;
  email?: string;
  resetOtpTrigger: boolean;
  setResetOtpTrigger: (trigger: boolean) => void;
}

export type VerifyOnboardingInput = {
  otp: string;
  guestId?: string;
};

export type VerifyOnboardingOutput = {
  verifyEmail: {
    success: boolean;
    nextStep: string;
    authToken: string;
    refreshToken: string;
    userId?: string;
    xApiKey?: string;
  };
};

export type OtpTimerViewModel = {
  isTimerRunning: boolean;
  formattedTime: string;
  resetTimer: () => void;
  onResend: () => Promise<void>;
  resendLoading: boolean;
  resendError: string | null;
  resendToastMessage: string;
  resendToastType: 'success' | 'error';
  loading: boolean;
  setResendToastMessage: (msg: string) => void;
  handleResendPress: () => void;
};
