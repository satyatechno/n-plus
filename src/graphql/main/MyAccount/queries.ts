import { gql } from '@apollo/client';

export const ALL_NEWSLETTERS_QUERY = gql`
  query GetAllNewsletters {
    getAllNewsletters {
      _id
      name
      desc
      thumbnail
      interval
      isSubscribed
    }
  }
`;

export const USER_NEWSLETTERS_QUERY = gql`
  query GetUserNewsletters {
    getUserNewsletters {
      _id
      name
      desc
      thumbnail
      interval
      isSubscribed
    }
  }
`;

export const UNSUBSCRIBE_REASONS_QUERY = gql`
  query GetNewsletterUnsubscribeReasons {
    getNewsletterUnsubscribeReasons
  }
`;

export const MY_PROFILE_DATA_QUERY = gql`
  query MyProfile {
    myProfile {
      id
      _id
      gender
      dob
      email
      name {
        first
        last
      }
    }
  }
`;

export const GET_PUSH_AND_INAPP_NOTIFICATION_LIST = gql`
  query PushAndInAppNotificationList {
    pushAndInAppNotificationList {
      push {
        topic
        isSubscribed
        id
      }
      inApp {
        topic
        isSubscribed
        id
      }
    }
  }
`;

export const DELETE_ACCOUNT_REASONS_QUERY = gql`
  query DeleteAccountReasons {
    deleteAccountReasons {
      text
      reasons
    }
  }
`;

export const GET_MY_NOTIFICATION_LIST = gql`
  query GetUserNotifications($input: GetUserNotificationsInput!) {
    getUserNotifications(input: $input) {
      notifications {
        id
        title
        content
        slug
        image
        collection
        createdAt
        isRead
        fullPath
        liveblogEntryId
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId)
  }
`;

export const MARK_ALL_NOTIFICATION_AS_UNREAD = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const DELETE_SELECTED_NOTIFICATION = gql`
  mutation DeleteNotifications($notificationIds: [String!]!) {
    deleteNotifications(notificationIds: $notificationIds)
  }
`;

export const DELETE_ALL_NOTIFICATION = gql`
  mutation DeleteAllNotifications {
    deleteAllNotifications
  }
`;

export const GET_USER_BOOKMARKS_QUERY = gql`
  query GetUserBookmarks($input: GetUserBookmarksInput!) {
    getUserBookmarks(input: $input) {
      data {
        id
        title
        slug
        fullPath
        collection
        liveblogStatus
        openingType
        summary
        description
        readTime
        videoDuration
        isBookmarked
        bookmarkedAt
        publishedAt
        createdAt
        category {
          id
          title
          slug
        }
        production {
          id
          title
          slug
        }
        topics {
          id
          title
          slug
        }
        heroImages {
          url
          sizes {
            vintage {
              url
            }
          }
        }
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const GET_RECOMMENDED_SECTIONS_QUERY = gql`
  query GetRecommendedSections {
    GetRecommendedSections {
      sections {
        sectionType
        items {
          id
          title
          slug
          collection
          summary
          description
          schedule
          content
          readTime
          liveblogStatus
          openingType
          videoUrl
          interactiveUrl
          videoDuration
          videoType
          isBookmarked
          platform
          fullPath
          category {
            id
            title
            slug
          }
          topics {
            id
            title
            slug
          }
          programs {
            id
            title
            slug
          }
          heroImages {
            id
            url
            title
            thumbnailUrl
          }
          publishedAt
          authors {
            name
          }
        }
      }
    }
  }
`;
