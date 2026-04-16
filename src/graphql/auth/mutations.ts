import { gql } from '@apollo/client';

export const REFRESH_APP_SESSION_MUTATION = gql`
  mutation RefreshAppSession {
    refreshAppSession {
      authToken
      refreshToken
      xApiKey
    }
  }
`;

export const REFRESH_GUEST_SESSION_MUTATION = gql`
  mutation RefreshGuestSession {
    refreshGuestSession {
      authToken
      refreshToken
      xApiKey
    }
  }
`;

export const GUEST_LOGIN_MUTATION = gql`
  mutation GuestLogin($input: GuestLoginInput!) {
    guestLogin(input: $input) {
      authToken
      guestId
      refreshToken
      xApiKey
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      userId
      authToken
      refreshToken
      xApiKey
    }
  }
`;

export const ALERT_NOTIFICATION_TOGGLE_MUTATION = gql`
  mutation AlertNotificationToggle($input: [AlertNotificationToggleInput!]!) {
    alertNotificationToggle(input: $input)
  }
`;

export const UPDATE_USER_PREFERENCES_MUTATION = gql`
  mutation UpdateUserPreferences($selectedInterests: [String!]!) {
    updateUserPreferences(selectedInterests: $selectedInterests)
  }
`;

export const SET_PASSWORD_APP_MUTATION = gql`
  mutation SetPasswordApp($input: SetPasswordInput!) {
    setPasswordApp(input: $input) {
      nextStep
    }
  }
`;

export const ONBOARDING_MUTATION = gql`
  mutation Onboarding($input: OnboardingInput!) {
    onboarding(input: $input) {
      success
      mfaToken
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($input: VerifyOnboardingInput!) {
    verifyEmail(input: $input) {
      success
      nextStep
      authToken
      refreshToken
      userId
      xApiKey
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgetPasswordApp($input: ForgetPasswordInput!) {
    forgetPasswordApp(input: $input) {
      passwordToken
      nextStep
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordApp($input: ChangeAppPasswordInput!) {
    changePasswordApp(input: $input) {
      nextStep
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_OTP_MUTATION = gql`
  mutation VerifyForgetPasswordOtp($input: VerifyOtpInput!) {
    verifyForgetPasswordOtp(input: $input) {
      nextStep
    }
  }
`;

export const SOCIAL_LOGIN_APP_MUTATION = gql`
  mutation SocialLoginApp($input: FirebaseInput!) {
    socialLoginApp(input: $input) {
      email
      userId
      authToken
      refreshToken
      xApiKey
      nextStep
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: DeviceIdInput) {
    logout(input: $input) {
      result
    }
  }
`;
