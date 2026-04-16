export interface VerifyOtpInput {
  otp: string;
}

export interface VerifyOtpResponseDto {
  nextStep: string;
}
