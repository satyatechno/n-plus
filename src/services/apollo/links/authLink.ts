import Config from 'react-native-config';
import { Platform } from 'react-native';
import { setContext } from '@apollo/client/link/context';

import useAuthStore from '@src/zustand/auth/authStore';
import { USER_TYPE } from '@src/config/enum';
import uuid from 'react-native-uuid';

const authLink = setContext(async (operation, { headers }) => {
  const { operationName = '' } = operation;
  const {
    authToken,
    refreshToken,
    passwordToken,
    guestToken,
    guestRefreshToken,
    mfaToken,
    xApiKey
  } = useAuthStore.getState();
  const basicToken = Config.BASIC_AUTH ?? 'bm1hczpubWFzLXBhc3N3b3Jk';
  const deviceId = uuid.v4();

  // Use xApiKey from store if available, otherwise fallback to Config
  const apiKey = xApiKey || Config.X_API_KEY;

  const defaultHeaders = {
    ...headers,
    'Content-Type': 'application/json',
    'Accept-Language': 'es',
    'x-api-key': apiKey,
    platform: '2',
    os: Platform.OS === 'ios' ? '1' : '2',
    'user-type': guestToken ? USER_TYPE.GUEST : USER_TYPE.REGISTERED,
    'x-request-id': deviceId,
    'x-usage-api-version': 1
  };

  const basicAuthOps = [
    'Onboarding',
    'CheckEmail',
    'ForgetPasswordApp',
    'GuestLogin',
    'Login',
    'SocialLoginApp'
  ];
  if (basicAuthOps.includes(operationName)) {
    return {
      headers: {
        ...defaultHeaders,
        authorization: `Basic ${basicToken}`
      }
    };
  }

  const mfaOps = ['VerifyEmail', 'VerifyOTP', 'VerifyPhone', 'ForgetPasswordApp'];
  if (mfaOps.includes(operationName)) {
    return {
      headers: {
        ...defaultHeaders,
        'x-mfa-token': mfaToken ? `Bearer ${mfaToken}` : ''
      }
    };
  }

  if (operationName === 'VerifyForgetPasswordOtp' || operationName === 'SetPasswordApp') {
    return {
      headers: {
        ...defaultHeaders,
        'x-mfa-token': `Bearer ${passwordToken}`
      }
    };
  }

  if (operationName === 'RefreshAppSession' || operationName === 'Logout') {
    return {
      headers: {
        ...defaultHeaders,
        'x-mfa-token': refreshToken ? `Bearer ${refreshToken}` : ''
      }
    };
  }

  if (operationName === 'RefreshGuestSession') {
    return {
      headers: {
        ...defaultHeaders,
        'x-mfa-token': guestRefreshToken ? `Bearer ${guestRefreshToken}` : ''
      }
    };
  }
  // For guest sessions, prioritize guestToken; otherwise use authToken
  // This ensures refreshed guest tokens are used instead of stale authToken
  const token = guestToken || authToken;
  return {
    headers: {
      ...defaultHeaders,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

export default authLink;
