import { gql } from '@apollo/client';

export const GET_NPLUS_VIDEO_QUERY = gql`
  query NPlusVideos {
    NPlusVideos {
      title
      hero {
        id
        title
        slug
        videoUrl
        videoDuration
        aspectRatio
        publishedAt
        heroImage {
          id
          url
        }
        category {
          id
          title
        }
        isBookmarked
      }
      secondary {
        id
        title
        slug
        videoUrl
        videoDuration
        aspectRatio
        publishedAt
        heroImage {
          id
          url
          sizes {
            square {
              url
            }
          }
        }
        category {
          id
          title
        }
        isBookmarked
      }
      carousel {
        id
        title
        slug
        videoDuration
        aspectRatio
        publishedAt
        heroImage {
          id
          url
        }
        category {
          id
          title
        }
        isBookmarked
      }
    }
  }
`;

export const EXCLUSIVE_NPLUS_QUERY = gql`
  query ExclusiveNPlusVideos {
    ExclusiveNPlusVideos {
      title
      videos {
        id
        title
        slug
        videoUrl
        heroImage {
          sizes {
            portrait {
              url
              width
              height
              mimeType
              filesize
              filename
            }
          }
          url
          id
        }
      }
    }
  }
`;

export const PROGRAMAS_NPLUS_QUERY = gql`
  query ProgramasNPlus($channel: String!) {
    ProgramasNPlus(channel: $channel) {
      id
      title
      slug
      publishedAt
      schedule
      order
      heroImage {
        id
        alt
        url
        sizes {
          vintage {
            url
          }
        }
      }
    }
  }
`;

export const PROGRAMS_QUERY = gql`
  query GetPrograms($channel: String, $limit: Int, $excludeSlug: String, $cursor: String) {
    GetPrograms(
      pagination: { limit: $limit, cursor: $cursor }
      filter: { channel: $channel, excludeSlug: $excludeSlug }
    ) {
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        heroImage {
          id
          url
          sizes {
            vintage {
              url
            }
          }
        }
        schedule
        slug
        title
        id
      }
    }
  }
`;

export const PROGRAM_QUERY = gql`
  query Program($slug: String!) {
    Program(slug: $slug) {
      id
      title
      fullPath
      showCode
      publishedAt
      description
      schedule
      slug
      lastSlug
      relatedVideos {
        relationTo
        value {
          id
          title
          readTime
          videoUrl
          videoDuration
          slug
          content {
            heroImage {
              id
              url
            }
          }
        }
      }
      heroImage {
        sizes {
          vintage {
            url
          }
        }
      }
      bannerImage {
        sizes {
          vintage {
            url
          }
        }
      }
      talents {
        id
        title
        titleLowercase
        description
        slug
        heroImage {
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
`;

export const GET_POR_EL_PLANETE_QUERY = gql`
  query PorElPlanetaDocumentaries {
    PorElPlanetaDocumentaries {
      id
      title
      slug
      publishedAt
      heroImage {
        id
        url
        sizes {
          portrait {
            url
          }
        }
      }
    }
  }
`;

export const N_PLUS_FOCUS_QUERY = gql`
  query NPlusFocus {
    NPlusFocus {
      id
      title
      slug
      videoUrl
      videoDuration
      aspectRatio
      summary
      hasInteractive
      interactiveUrl
      publishedAt
      order
      isBookmarked
      heroImage {
        id
        url
        sizes {
          portrait {
            url
          }
        }
      }
    }
  }
`;

export const POR_EL_PLANETA_DETAIL_QUERY = gql`
  query Video($slug: String!) {
    Video(slug: $slug) {
      id
      title
      slug
      fullPath
      videoUrl
      closedCaptionUrl
      videoDuration
      publishedAt
      production {
        title
      }
      excerpt
      topics {
        id
        title
      }
      content {
        videoType
        summary
        heroImage {
          url
        }
      }
      channel {
        title
        channel
      }
    }
  }
`;

export const VIDEO_QUERY = gql`
  query Video($slug: String!) {
    Video(slug: $slug) {
      id
      title
      readTime
      videoUrl
      closedCaptionUrl
      videoDuration
      publishedAt
      updatedAt
      createdAt
      aspectRatio
      slug
      fullPath
      excerpt
      production {
        id
        title
        description
      }
      provinces {
        title
      }
      productions {
        interactivePage
        externalURL
        awards {
          awardName
          awardDescription
          awardWon
          id
        }
        crews {
          crewMemberName
          crewMemberJob
          crewMemberPhoto {
            id
            title
            url
          }
        }
        specialImage {
          id
          alt
          title
          updatedAt
          createdAt
          url
          thumbnailURL
        }
      }
      relatedPosts {
        relationTo
        value {
          __typename
          ... on VideoRelatedVideoContents {
            id
            title
            slug
            videoDuration
            readTime
            videoUrl
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
            content {
              heroImage {
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
      content {
        tvShow {
          id
          title
          slug
        }
        videoType
        summary
        heroImage {
          url
        }
      }
      channel {
        title
        channel
      }
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
    }
  }
`;

export const VIDEO_HERO_CAROUSEL_QUERY = gql`
  query VideoHeroCarousel {
    VideoHeroCarousel {
      id
      title
      slug
      videoUrl
      videoDuration
      aspectRatio
      hasInteractive
      interactiveUrl
      publishedAt
      excerpt
      summary
      description
      subtitle
      heroImage {
        url
        mimeType
      }
    }
  }
`;

export const TALENT_QUERY = gql`
  query Talent($slug: String!) {
    Talent(slug: $slug) {
      id
      title
      description
      fullPath
      slug
      heroImage {
        url
        id
      }
      programs {
        id
        title
        description
        schedule
        position
        slug
        heroImage {
          url
          id
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

export const ULTIMANOTIAS_QUERY = gql`
  query UltimasNoticias {
    UltimasNoticias {
      id
      title
      slug
      videoUrl
      videoDuration
      aspectRatio
      summary
      hasInteractive
      interactiveUrl
      publishedAt
      order
      isBookmarked
      heroImage {
        url
      }
      category {
        id
        title
        slug
      }
      topics {
        id
        title
      }
    }
  }
`;
export const GET_USER_CONTINUE_VIDEOS = gql`
  query GetUserContinueVideos($limit: Int, $isBookmarked: Boolean!, $nextCursor: String) {
    getUserContinueVideos(
      input: { limit: $limit, isBookmarked: $isBookmarked, nextCursor: $nextCursor }
    ) {
      videos {
        id
        title
        openingType
        summary
        platform
        fullPath
        slug
        publishedAt
        collection
        viewCount
        isBookmarked
        readTime
        videoDuration
        updatedAt
        createdAt
        timeWatched
        percentageWatched
        category {
          id
          title
        }
        heroImages {
          url
        }
        programs {
          id
          title
          slug
        }
        topics {
          id
          title
        }
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const NPLUS_FOCUS_LANDING_PAGE = gql`
  query NPlusFocusLanding {
    NPlusFocusLanding {
      docs {
        id
        title
        slug
        videoUrl
        videoDuration
        aspectRatio
        excerpt
        summary
        hasInteractive
        interactiveUrl
        publishedAt
        order
        isBookmarked
        heroImage {
          url
        }
        specialImage {
          url
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

export const N_PLUS_FOCUS_INTERACTIVES_QUERY = gql`
  query NPlusFocusInteractives {
    NPlusFocusInteractives {
      docs {
        id
        title
        slug
        excerpt
        publishedAt
        updatedAt
        createdAt
        fullPath
        hero {
          media {
            id
            title
            caption
            url
            sizes {
              portrait {
                url
              }
              vintage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const NPLUS_FOCUS_INVESTIGATIONS_QUERY = gql`
  query NPlusFocusInvestigations {
    NPlusFocusInvestigations {
      docs {
        id
        title
        slug
        videoUrl
        videoDuration
        summary
        hasInteractive
        interactiveUrl
        publishedAt
        order
        isBookmarked
        heroImage {
          url
          sizes {
            square {
              url
            }
            portrait {
              url
            }
          }
        }
        specialImage {
          url
          sizes {
            portrait {
              url
            }
          }
        }
      }
    }
  }
`;

export const NPLUS_FOCUS_SHORT_REPORTS_QUERY = gql`
  query NPlusFocusShortReports {
    NPlusFocusShortReports {
      docs {
        id
        title
        slug
        type
        summary
        publishedAt
        order
        readTime
        videoDuration
        isBookmarked
        heroImage {
          url
        }
        topics {
          id
          title
          slug
        }
        category {
          id
          title
          slug
        }
      }
    }
  }
`;

export const PRO_EL_PLANETA_HERO_DOCUMENTARIES_QUERY = gql`
  query PorElPlanetaHeroDocumentaries {
    PorElPlanetaHeroDocumentaries {
      id
      title
      slug
      videoUrl
      videoDuration
      summary
      excerpt
      isBookmarked
      specialImage {
        id
        url
        sizes {
          vintage {
            url
          }
        }
      }
    }
  }
`;

export const GET_RECENTLY_ADDED_DOCUMENTARIES_QUERY = gql`
  query Videos(
    $production: String!
    $sort: String!
    $limit: Int!
    $excludeSlug: String
    $cursor: String
  ) {
    Videos(
      filter: { production: $production, excludeSlug: $excludeSlug }
      pagination: { sort: $sort, limit: $limit, cursor: $cursor }
    ) {
      hasNextPage
      nextCursor
      docs {
        id
        title
        slug
        content {
          heroImage {
            id
            url
            sizes {
              portrait {
                url
              }
            }
          }
        }
        productions {
          specialImage {
            url
            sizes {
              portrait {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const VIDEOS_QUERY = gql`
  query Videos(
    $videoType: VideoTypeEnum
    $production: String
    $tvShow: String
    $cursor: String
    $limit: Int
    $slug: String
    $excludeSlug: String
    $category: String
    $topic: String
  ) {
    Videos(
      filter: {
        videoType: $videoType
        production: $production
        tvShow: $tvShow
        slug: $slug
        excludeSlug: $excludeSlug
        category: $category
        topic: $topic
      }
      pagination: { cursor: $cursor, limit: $limit }
    ) {
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        id
        title
        titleLowercase
        readTime
        mcpid
        videoUrl
        category {
          id
          title
        }
        topics {
          title
        }
        closedCaptionUrl
        videoDuration
        publishedAt
        slug
        aspectRatio
        updatedAt
        createdAt
        content {
          summary
          heroImage {
            id
            title
            url
            thumbnailURL
            sizes {
              square {
                url
              }
              portrait {
                url
              }
              vintage {
                url
              }
            }
          }
        }
        productions {
          awards {
            awardName
            awardDescription
            awardWon
            id
          }
          crews {
            crewMemberName
            crewMemberJob
            crewMemberPhoto {
              id
              title
              updatedAt
              url
              thumbnailURL
              createdAt
            }
          }
          interactivePage
          externalURL
          specialImage {
            id
            title
            updatedAt
            createdAt
            url
            thumbnailURL
            sizes {
              portrait {
                url
              }
              vintage {
                url
              }
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

export const POR_EL_PLANETA_RECENT_DOCUMENTARIES_QUERY = gql`
  query PorElPlanetaRecentDocumentaries {
    PorElPlanetaRecentDocumentaries {
      id
      title
      slug
      order
      heroImage {
        id
        url
      }
      specialImage {
        url
        sizes {
          portrait {
            url
          }
        }
      }
      videoUrl
    }
  }
`;

export const INTERACTIVE_VIDEOS_QUERY = gql`
  query GetPages($production: String, $cursor: String, $limit: Int) {
    GetPages(filter: { production: $production }, pagination: { cursor: $cursor, limit: $limit }) {
      docs {
        id
        title
        fullPath
        hero {
          media {
            sizes {
              landscape {
                url
              }
            }
          }
        }
      }
      hasNextPage
      nextCursor
    }
  }
`;

export const NPLUS_FOCUS_SHORT_LISTING_QUERY = gql`
  query NPlusFocusShortReportListing($excludeId: String, $mostViewed: Boolean, $limit: Int) {
    NPlusFocusShortReportListing(
      filter: { excludeId: $excludeId, mostViewed: $mostViewed }
      pagination: { limit: $limit }
    ) {
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        id
        type
        openingType
        title
        slug
        summary
        publishedAt
        readTime
        videoDuration
        hasInteractive
        interactiveUrl
        isBookmarked
        order
        heroImage {
          id
          url
        }
        category {
          id
          title
        }
        topics {
          id
          title
        }
      }
    }
  }
`;

export const N_PLUS_FOCUS_SHORT_REPORT_LISTING_QUERY = gql`
  query NPlusFocusShortReportListing($cursor: String, $limit: Int) {
    NPlusFocusShortReportListing(filter: {}, pagination: { cursor: $cursor, limit: $limit }) {
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        id
        type
        title
        openingType
        slug
        summary
        readTime
        videoDuration
        isBookmarked
        heroImage {
          url
          sizes {
            square {
              url
            }
          }
        }
        category {
          id
          title
        }
        topics {
          id
          title
        }
      }
    }
  }
`;

export const CHANNELS_QUERY = gql`
  query ChannelNPlus {
    ChannelNPlus {
      id
      title
      slug
      fullPath
    }
  }
`;

export const POR_EL_PLANETA_MOST_VIEWED_QUERY = gql`
  query PorElPlanetaMostViewedDocumentaries {
    PorElPlanetaMostViewedDocumentaries {
      id
      fullPath
      title
      slug
      videoDuration
      aspectRatio
      publishedAt
      specialImage {
        url
        title
        caption
        sizes {
          portrait {
            url
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTION_HERO_DOCUMENTARIES = gql`
  query GetProductionHeroDocumentaries($production: String!, $isBookmarked: Boolean) {
    GetProductionHeroDocumentaries(production: $production, isBookmarked: $isBookmarked) {
      id
      title
      slug
      fullPath
      videoDuration
      summary
      aspectRatio
      publishedAt
      isBookmarked
      bannerImage {
        sizes {
          vintage {
            url
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTION_MOST_VIEWED_DOCUMENTARIES = gql`
  query GetProductionMostViewedDocumentaries($production: String!, $isBookmarked: Boolean) {
    GetProductionMostViewedDocumentaries(production: $production, isBookmarked: $isBookmarked) {
      id
      title
      slug
      fullPath
      videoDuration
      summary
      aspectRatio
      publishedAt
      isBookmarked
      bannerImage {
        sizes {
          portrait {
            url
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTION_VIDEOS = gql`
  query GetVideos(
    $excludeSlug: String
    $production: String
    $videoType: String
    $limit: Int
    $cursor: String
  ) {
    GetVideos(
      filter: { excludeSlug: $excludeSlug, production: $production, videoType: $videoType }
      pagination: { limit: $limit, cursor: $cursor }
    ) {
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        id
        title
        slug
        fullPath
        publishedAt
        content {
          heroImage {
            sizes {
              portrait {
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTION_POST = gql`
  query GetPosts(
    $excludeSlug: String
    $production: String
    $limit: Int
    $cursor: String
    $isBookmarked: Boolean
  ) {
    GetPosts(
      filter: { excludeSlug: $excludeSlug, production: $production, isBookmarked: $isBookmarked }
      pagination: { limit: $limit, cursor: $cursor }
    ) {
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      nextCursor
      docs {
        id
        title
        slug
        fullPath
        publishedAt
        readTime
        heroImage {
          sizes {
            landscape {
              url
              width
              height
            }
          }
        }
        category {
          id
          title
          fullPath
          slug
        }
        topics {
          id
          title
          fullPath
          slug
        }
        isBookmarked
        readTime
      }
    }
  }
`;
