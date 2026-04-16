export interface GuestLoginResponse {
  guestLogin: {
    authToken: string;
    guestId: string;
    refreshToken: string;
    xApiKey?: string;
  };
}
