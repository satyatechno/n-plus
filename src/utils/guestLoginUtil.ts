import DeviceInfo from 'react-native-device-info';

import client from '@src/services/apollo/apolloClient';
import { GUEST_LOGIN_MUTATION } from '@src/graphql/auth/mutations';
import useAuthStore from '@src/zustand/auth/authStore';

export const ensureGuestLogin = async (): Promise<boolean> => {
  const { authToken, guestToken, setGuestTokens, setAuthToken, setUserId, setGuestId } =
    useAuthStore.getState();

  if (authToken || guestToken) {
    return true;
  }

  try {
    const deviceId = await DeviceInfo.getUniqueId();

    const resp = await client.mutate({
      mutation: GUEST_LOGIN_MUTATION,
      variables: {
        input: {
          guestId: null,
          deviceId
        }
      }
    });

    const token = resp?.data?.guestLogin?.authToken;
    const refreshToken = resp?.data?.guestLogin?.refreshToken;
    const xApiKey = resp?.data?.guestLogin?.xApiKey;
    const id = resp?.data?.guestLogin?.guestId ?? '';

    if (token && refreshToken) {
      setGuestTokens(token, refreshToken, xApiKey);
      setAuthToken(token);
      setUserId(id);
      setGuestId(id);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
