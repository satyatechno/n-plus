import { gql } from '@apollo/client';

export const CONTINUE_VIDEO_MUTATION = gql`
  mutation ContinueVideo(
    $videoId: String!
    $timeWatched: Int!
    $userId: String!
    $totalDuration: Int!
  ) {
    continueVideo(
      input: {
        videoId: $videoId
        timeWatched: $timeWatched
        userId: $userId
        totalDuration: $totalDuration
      }
    )
  }
`;

export const DELETE_VIDEO_MUTATION = gql`
  mutation DeleteContinueVideo($videoId: String!) {
    deleteContinueVideo(videoId: $videoId)
  }
`;
