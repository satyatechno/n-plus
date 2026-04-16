import { gql } from '@apollo/client';

export const GET_RECOMMENDED_TOPICS_QUERY = gql`
  query Preferences {
    Preferences {
      id
      preferenceSections {
        id
        preferenceType
        displayInOnboarding
        onboardingSortOrder
        selectedItem {
          relationTo
          value {
            id
            title
          }
          isSelected
        }
      }
    }
  }
`;

export const GET_ONBORDING_SELECTED_TOPICS_QUERY = gql`
  query GetOnboardingSelectedTopics($input: GetOnboardingSelectedTopicsInput!) {
    GetOnboardingSelectedTopics(input: $input) {
      hasMore
      topics {
        topicTitle
        topicsdata {
          data {
            id
            title
          }
        }
        isSelected
        userSelected
      }
    }
  }
`;

export const CHECK_EMAIL_QUERY = gql`
  query CheckEmail($input: CheckEmailInput!) {
    checkEmail(input: $input) {
      exists
      isBlocked
    }
  }
`;

export const ALERT_NOTIFICATION_LIST_QUERY = gql`
  query AlertNotificationList($input: NotificationListInput!) {
    alertNotificationList(input: $input) {
      id
      topic
      isSubscribed
    }
  }
`;

export const CHECK_PATH_QUERY = gql`
  query CheckPath($path: String!) {
    CheckPath(path: $path) {
      isValid
      id
      title
      fullPath
      slug
      collection
      production
      province
      parentCategory
      category
    }
  }
`;
