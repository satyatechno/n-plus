export type OtpViewModel = {
  isTimerRunning: boolean;
  formattedTime: string;
  resetTimer: () => void;
  onResend: () => Promise<void>;
  resendLoading: boolean;
  resendError: string | null;
  resendToastVisible: boolean;
  setResendToastVisible: (val: boolean) => void;
  resendToastMessage: string;
  resendToastType: 'success' | 'error';
  loading: boolean;
};
