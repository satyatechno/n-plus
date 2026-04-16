import { gql } from '@apollo/client';

export const TOGGLE_BOOKMARK_MUTATION = gql`
  mutation ToggleBookmark($input: ToggleBookmarkInput!) {
    toggleBookmark(input: $input) {
      success
      message
      isBookmarked
    }
  }
`;

export const TOGGLE_FOLLOW_TOPIC_MUTATION = gql`
  mutation ToggleFollowTopic($input: ToggleFollowInput!) {
    toggleFollowTopic(input: $input) {
      success
      message
      isFollowed
    }
  }
`;
