export interface DeleteAccountReasonsResponse {
  deleteAccountReasons: {
    text: string;
    reasons: string[];
  };
}

export interface DeleteAccountResponse {
  deleteAccount: boolean;
}
