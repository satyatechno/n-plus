import client from '@src/services/apollo/apolloClient';
import { STORE_DEVICE_ID_QUERY } from '@src/graphql/main/home/queries';
import useAuthStore from '@src/zustand/auth/authStore';

export class DeviceTokenService {
  /**
   * storeToken
   *
   * Stores the notification device ID using the Apollo Client.
   * This abstracts away the GraphQL mutation from UI viewModels.
   */
  public static async storeToken(deviceId: string): Promise<void> {
    if (!deviceId) return;

    // Do not attempt to store token if user is a guest or unauthenticated (prevents Apollo throwing auth errors)
    const { guestToken, authToken } = useAuthStore.getState();
    if (guestToken || !authToken) {
      return;
    }

    try {
      await client.mutate({
        mutation: STORE_DEVICE_ID_QUERY,
        variables: { deviceId }
      });
    } catch {
      // Ignored intentionally: If Apollo fails to store the ID, the flow will continue and automatically retry on the next session
      //return;
    }
  }
}
