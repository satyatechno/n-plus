import { gql } from '@apollo/client';

export const RECENT_OPINION_LIST_QUERY = gql`
  query RecentCategory($categoryId: String!, $limit: Int!, $isBookmarked: Boolean) {
    RecentCategory(input: { limit: $limit, categoryId: $categoryId, isBookmarked: $isBookmarked }) {
      data {
        id
        title
        fullPath
        slug
        collection
        excerpt
        isBookmarked
        aspectRatio
        publishedAt
        authors {
          id
          slug
          name
          profilePicture {
            url
            sizes {
              square {
                url
              }
            }
          }
        }
        heroImages {
          url
          height
          width
          sizes {
            vintage {
              url
            }
          }
        }
      }
    }
  }
`;

export const MORE_OPINION_LIST_QUERY = gql`
  query MoreFromCategory(
    $categoryId: String
    $isBookmarked: Boolean
    $count: Int!
    $nextCursor: String
    $limit: Int!
  ) {
    MoreFromCategory(
      input: {
        categoryId: $categoryId
        isBookmarked: $isBookmarked
        count: $count
        nextCursor: $nextCursor
        limit: $limit
      }
    ) {
      data {
        id
        title
        slug
        collection
        excerpt
        isBookmarked
        aspectRatio
        publishedAt
        authors {
          id
          name
          slug
          profilePicture {
            url
            sizes {
              square {
                url
              }
            }
          }
        }
        heroImages {
          url
          height
          width
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

export const VIDEO_OPINION_DETAIL_QUERY = gql`
  query Video($slug: String!) {
    Video(slug: $slug) {
      id
      title
      excerpt
      videoUrl
      fullPath
      category {
        id
        title
        slug
      }
      closedCaptionUrl
      videoDuration
      publishedAt
      slug
      aspectRatio
      mcpid
      authors {
        id
        name
        slug
        photo {
          url
        }
      }
      content {
        videoType
        summary
        heroImage {
          url
          width
          height
          title
        }
      }
    }
  }
`;

export const POST_OPINION_DETAIL_QUERY = gql`
  query Post($slug: String!) {
    Post(slug: $slug) {
      id
      title
      excerpt
      summary
      openingType
      content
      fullPath
      publishedAt
      textToSpeech
      channel {
        title
      }
      production {
        title
      }
      readTime
      category {
        id
        title
        slug
      }
      slug
      heroImage {
        id
        title
        caption
        url
        width
        height
        sizes {
          square {
            url
          }
          vintage {
            url
          }
        }
      }
      authors {
        id
        name
        slug
        photo {
          url
        }
      }
      mcpId {
        value {
          content {
            videoType
            heroImage {
              id
              url
            }
          }
          id
          title
          readTime
          mcpid
          videoUrl
          closedCaptionUrl
          videoDuration
          publishedAt
          updatedAt
          createdAt
        }
      }
    }
  }
`;

export const MORE_FROM_AUTHORS_OPINION_QUERY = gql`
  query MoreFromAuthors(
    $categoryId: String!
    $contentId: String!
    $authorId: String!
    $limit: Int!
  ) {
    MoreFromAuthors(
      input: { categoryId: $categoryId, contentId: $contentId, authorId: $authorId, limit: $limit }
    ) {
      data {
        id
        title
        slug
        collection
        summary
        description
        authors {
          id
          name
          slug
          profilePicture {
            id
            url
            sizes {
              square {
                url
              }
            }
          }
        }
      }
    }
  }
`;
