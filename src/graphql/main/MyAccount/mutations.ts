import { gql } from '@apollo/client';

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UserProfileUpdateInput!) {
    updateProfile(input: $input)
  }
`;

export const CHANGE_NEWSLETTER_SUBSCRIPTION_MUTATION = gql`
  mutation ChangeNewsletterSubscriptionStatus($input: [ChangeSubscriptionStatusInput!]!) {
    changeNewsletterSubscriptionStatus(input: $input)
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const DELETE_VERIFY_MUTATION = gql`
  mutation DeleteVerify($input: DeleteVerifyInput!) {
    deleteVerify(input: $input)
  }
`;
