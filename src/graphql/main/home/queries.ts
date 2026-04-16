import { gql } from '@apollo/client';

export const HEADER_QUERY = gql`
  query Header {
    Header {
      updatedAt
      createdAt
      navItems {
        id
        label
        linkType
        openInNewTab
        contentSource
        contentSourceSlug
        fullPath
        customUrl
        selectedItem {
          relationTo
          value {
            ... on Category {
              id
              title
              slug
            }
            ... on Channel {
              id
              title
              slug
            }
            ... on LiveBlog {
              id
              title
              slug
            }
            ... on Page {
              id
              title
              slug
            }
            ... on PressRoom {
              id
              title
              slug
            }
            ... on Production {
              id
              title
              slug
            }
            ... on Program {
              id
              title
              slug
            }
            ... on Province {
              id
              title
              slug
            }
            ... on Post {
              id
              title
              slug
            }
            ... on Topic {
              id
              title
              slug
            }
            ... on Talent {
              id
              title
              slug
            }
            ... on Video {
              id
              title
              slug
            }
          }
        }
      }
    }
  }
`;

export const AUTHOR_DETAIL_QUERY = gql`
  query User($slug: String!) {
    User(slug: $slug) {
      id
      name
      position
      bio
      fullPath
      photo {
        url
        thumbnailURL
      }
    }
  }
`;

export const MORE_FROM_AUTHORS_QUERY = gql`
  query MoreFromAuthors(
    $isBookmarked: Boolean
    $authorId: String!
    $limit: Int
    $nextCursor: String
  ) {
    MoreFromAuthors(
      input: {
        isBookmarked: $isBookmarked
        authorId: $authorId
        limit: $limit
        nextCursor: $nextCursor
      }
    ) {
      data {
        id
        title
        slug
        readTime
        category {
          id
          title
          slug
        }
        isBookmarked
        collection
      }
      pagination {
        hasNext
        nextCursor
      }
    }
  }
`;

export const LATEST_NEWS_QUERY = gql`
  query GetLatestNews($limit: Int, $contentId: String, $isBookmarked: Boolean, $count: Int) {
    GetLatestNews(
      input: { limit: $limit, contentId: $contentId, isBookmarked: $isBookmarked, count: $count }
    ) {
      data {
        id
        title
        category {
          id
          title
          slug
        }
        topics {
          id
          title
        }
        heroImages {
          url
          alt
        }
        isBookmarked
        readTime
        collection
        slug
      }
    }
  }
`;

export const RECOMMENDED_STORIES_QUERY = gql`
  query GetRecommendedStories($limit: Int, $isBookmarked: Boolean, $contentId: String) {
    GetRecommendedStories(
      input: { limit: $limit, isBookmarked: $isBookmarked, contentId: $contentId }
    ) {
      data {
        id
        title
        category {
          id
          title
          slug
        }
        topics {
          id
          title
        }
        slug
        isBookmarked
        readTime
        collection
      }
    }
  }
`;

export const STORY_BY_SLUG_QUERY = gql`
  query Post($slug: String!) {
    Post(slug: $slug) {
      id
      title
      excerpt
      openingType
      displayType
      summary
      publishedAt
      wire
      textToSpeech
      readTime
      slug
      fullPath
      updatedAt
      createdAt
      contentPrioritization {
        isBreaking
      }
      content
      category {
        id
        title
        description
        slug
        updatedAt
        createdAt
      }
      provinces {
        id
        title
      }
      relatedPosts {
        relationTo
        value {
          ... on PostRelatedPostContents {
            id
          }
          ... on PostRelatedVideoContents {
            id
          }
        }
      }
      production {
        id
        title
      }
      channel {
        id
        title
      }
      topics {
        id
        title
        description
        slug
        disabled
        showInRecommendForYou
        updatedAt
        createdAt
      }
      authors {
        id
        name
        position
        bio
        isActive
        isDefaultAuthor
        slug
        photo {
          id
          alt
          title
          caption
          url
          thumbnailURL
          width
          height
          sizes {
            square {
              url
            }
          }
        }
        socialMedia {
          x
          facebook
          instagram
          tiktok
        }
      }
      populatedAuthors {
        id
        name
      }
      heroImage {
        id
        alt
        title
        caption
        prefix
        updatedAt
        createdAt
        url
        thumbnailURL
        filename
        mimeType
        filesize
        width
        height
        focalX
        focalY
        sizes {
          vintage {
            url
          }
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
          aspectRatio
          videoDuration
          publishedAt
          updatedAt
          createdAt
        }
      }
    }
  }
`;

export const LIVE_BLOG_BY_SLUG_QUERY = gql`
  query LiveBlog($slug: String!) {
    LiveBlog(slug: $slug) {
      id
      title
      fullPath
      showContext
      context
      publishedAt
      extract
      openingType
      activateLiveSignal
      liveStreamingOrigin
      youtubeCode
      updatedAt
      lastUpdated
      contentPrioritization {
        isActive
      }
      category {
        id
        title
      }
      mcpId {
        value {
          content {
            videoType
            heroImage {
              title
              url
              thumbnailURL
            }
          }
          id
          title
          readTime
          mcpid
          videoUrl
          aspectRatio
          closedCaptionUrl
          videoDuration
          publishedAt
          slug
          updatedAt
          createdAt
        }
      }
      featuredImage {
        id
        alt
        title
        caption
        prefix
        updatedAt
        createdAt
        url
        thumbnailURL
        filename
        mimeType
        filesize
        width
        height
        focalX
        focalY
      }
    }
  }
`;

export const LIVE_BLOGS_LISTING_QUERY = gql`
  query LiveBlogs($isActive: Boolean!, $sort: String!, $limit: Int!) {
    LiveBlogs(filter: { isActive: $isActive }, pagination: { sort: $sort, limit: $limit }) {
      hasNextPage
      docs {
        id
        title
        extract
        slug
        openingType
        contentPrioritization {
          isActive
        }
        linkedEntries {
          docs {
            id
            title
            content
            createdAt
            updatedAt
          }
        }
        featuredImage {
          id
          url
          thumbnailURL
        }
        mcpId {
          value {
            id
            content {
              heroImage {
                id
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const INACTIVE_LIVE_BLOGS_QUERY = gql`
  query LiveBlogs($isActive: Boolean!, $sort: String!) {
    LiveBlogs(filter: { isActive: $isActive }, pagination: { sort: $sort, limit: 2 }) {
      hasNextPage
      docs {
        id
        title
        slug
        openingType
        featuredImage {
          id
          url
          thumbnailURL
        }
        mcpId {
          value {
            id
            content {
              heroImage {
                id
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const IS_BOOKMARKED_BY_USER_QUERY = gql`
  query IsBookmarkedByUser($contentId: String!, $type: BookmarkType!) {
    isBookmarkedByUser(contentId: $contentId, type: $type)
  }
`;

export const LIVEBLOG_STATUS_CHANGED_SUBSCRIPTION = `
  subscription LiveBlogStatusChanged($liveBlogId: ID!) {
    liveBlogStatusChanged(liveBlogId: $liveBlogId) {
      id
      title
      liveBlogId
      liveblogStatus
      videoUrl
      activateLiveSignal
      youtubeCode
      contentPrioritization
      updatedAt
      operation
    }
  }
`;

export const LIVEBLOG_ENTRY_UPDATED_SUBSCRIPTION = `
  subscription LiveBlogEntryUpdated($liveBlogId: ID!) {
    liveBlogEntryUpdated(liveBlogId: $liveBlogId) {
      id
      title
      content
      publishedAt
      liveBlogId
      createdAt
      updatedAt
      operation
    }
  }
`;

export const LIVEBLOG_ENTRY_CREATED_SUBSCRIPTION = `
  subscription LiveBlogEntryCreated($liveBlogId: ID!) {
    liveBlogEntryCreated(liveBlogId: $liveBlogId) {
      id
      title
      content
      publishedAt
      liveBlogId
      createdAt
      updatedAt
      operation
    }
  }
`;

export const LIVEBLOG_ENTRY_DELETE_SUBSCRIPTION = `
  subscription LiveBlogEntryDeleted($liveBlogId: ID!) {
    liveBlogEntryDeleted(liveBlogId: $liveBlogId) {
      id
      title
      content
      publishedAt
      liveBlogId
      createdAt
      updatedAt
      deletedAt
      operation
    }
  }
`;

export const GET_LIVE_BLOG_ALL_ENTRIES_QUERY = gql`
  query LiveBlogEntries($liveBlog: String!, $limit: Int!, $cursor: String) {
    LiveBlogEntries(
      pagination: { cursor: $cursor, limit: $limit }
      filter: { liveBlog: $liveBlog }
    ) {
      limit
      hasNextPage
      nextCursor
      docs {
        id
        title
        content
        updatedAt
        createdAt
      }
    }
  }
`;

export const GET_LIVE_BLOG_ENTRY_QUERY = gql`
  query LiveBlogEntry($id: String!) {
    LiveBlogEntry(id: $id) {
      id
      title
      titleLowercase
      content
      createdAt
      liveBlog {
        id
        slug
        contentPrioritization {
          isActive
        }
      }
    }
  }
`;

export const POSTS_QUERY = gql`
  query GetPosts($sort: String!) {
    GetPosts(pagination: { sort: $sort }) {
      docs {
        id
        title
        readTime
        slug
        category {
          id
          title
        }
      }
      prevPage
      nextPage
      hasNextPage
      hasPrevPage
      page
      totalPages
    }
  }
`;

export const GET_MOST_POPULAR_SEARCH_CONTENT_QUERY = gql`
  query GetMostPopularSearchContent($input: GetMostPopularSearchContentInput) {
    GetMostPopularSearchContent(input: $input) {
      id
      slug
      title
      readTime
      collection
      heroImages {
        url
      }
      category {
        id
        title
        slug
      }
      publishedAt
      topics {
        id
        title
        slug
      }
    }
  }
`;

export const SEARCH_PAYLOAD_QUERY = gql`
  query SearchPayload($input: SearchPayloadInput!) {
    SearchPayload(input: $input) {
      id
      slug
      title
      collection
    }
  }
`;

export const SEARCH_PAYLOAD_CONTENT_QUERY = gql`
  query SearchPayloadContent($input: SearchPayloadContentInput!) {
    SearchPayloadContent(input: $input) {
      data {
        id
        slug
        title
        collection
        fullPath
        summary
        description
        readTime
        isBookmarked
        publishedAt
        videoDuration
        liveblogStatus
        interactiveUrl
        schedule
        category {
          id
          title
          slug
        }
        heroImages {
          url
          thumbnailUrl
          sizes {
            vintage {
              url
            }
          }
        }
        topics {
          id
          title
          slug
        }
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const RECENT_CATEGORY_QUERY = gql`
  query RecentCategory($categoryId: String, $isBookmarked: Boolean, $limit: Int) {
    RecentCategory(input: { categoryId: $categoryId, isBookmarked: $isBookmarked, limit: $limit }) {
      data {
        openingType
        heroImages {
          url
          title
          caption
          sizes {
            vintage {
              url
            }
            landscape {
              url
            }
          }
        }
        topics {
          id
          title
          slug
        }
        category {
          id
          title
        }
        title
        summary
        excerpt
        readTime
        videoDuration
        isBookmarked
        publishedAt
        collection
        slug
        id
        liveblogStatus
      }
    }
  }
`;

export const GET_MOST_VIEWED_TOPICS_QUERY = gql`
  query GetMostViewedTopics($input: GetMostViewedTopicsInput!) {
    GetMostViewedTopics(input: $input) {
      id
      slug
      title
    }
  }
`;

export const GET_IS_LIVE_BLOG_FOLLOWED = gql`
  query IsFollowedByUser($id: String!) {
    isFollowedByUser(topicId: $id)
  }
`;

export const GET_MOST_INTERESTED_CONTENT_QUERY = gql`
  query GetMostInterestedContent($limit: Int, $count: Int) {
    GetMostInterestedContent(input: { limit: $limit, count: $count }) {
      id
      slug
      title
      summary
      description
      excerpt
      content
      readTime
      mcpid
      publishedAt
      collection
      heroImages {
        url
        title
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

export const MORE_FROM_CATEGORY_QUERY = gql`
  query MoreFromCategory(
    $categoryId: String!
    $isBookmarked: Boolean
    $count: Int
    $nextCursor: String
    $limit: Int
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
        openingType
        heroImages {
          url
          title
          caption
          sizes {
            vintage {
              url
            }
            landscape {
              url
            }
          }
        }
        topics {
          id
          title
          slug
        }
        category {
          id
          title
        }
        title
        summary
        excerpt
        readTime
        videoDuration
        isBookmarked
        publishedAt
        collection
        slug
        id
        liveblogStatus
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const RECENT_TOPIC_QUERY = gql`
  query RecentTopics($topicId: String, $isBookmarked: Boolean, $limit: Int) {
    RecentTopics(input: { topicId: $topicId, isBookmarked: $isBookmarked, limit: $limit }) {
      data {
        openingType
        heroImages {
          url
          title
          caption
          sizes {
            vintage {
              url
            }
            landscape {
              url
            }
          }
        }
        topics {
          id
          title
          slug
        }
        category {
          id
          title
        }
        title
        summary
        excerpt
        readTime
        videoDuration
        isBookmarked
        publishedAt
        collection
        slug
        id
        liveblogStatus
      }
    }
  }
`;

export const MORE_FROM_TOPIC_QUERY = gql`
  query MoreFromTopics(
    $topicId: String!
    $isBookmarked: Boolean
    $count: Int
    $nextCursor: String
    $limit: Int
  ) {
    MoreFromTopics(
      input: {
        topicId: $topicId
        isBookmarked: $isBookmarked
        count: $count
        nextCursor: $nextCursor
        limit: $limit
      }
    ) {
      data {
        openingType
        heroImages {
          url
          title
          caption
          sizes {
            vintage {
              url
            }
            landscape {
              url
            }
          }
        }
        topics {
          id
          title
          slug
        }
        category {
          id
          title
        }
        title
        summary
        excerpt
        readTime
        videoDuration
        isBookmarked
        publishedAt
        collection
        slug
        id
        liveblogStatus
      }
      pagination {
        nextCursor
        hasNext
      }
    }
  }
`;

export const GET_PRESS_ROOM_CONTENT_QUERY = gql`
  query GetPressRooms($isBookmarked: Boolean, $limit: Int, $cursor: String) {
    GetPressRooms(
      filter: { isBookmarked: $isBookmarked }
      pagination: { limit: $limit, cursor: $cursor }
    ) {
      docs {
        id
        fullPath
        title
        slug
        fullPath
        collection
        isBookmarked
        publishedAt
        featuredImage {
          alt
          url
          sizes {
            vintage {
              url
            }
            square {
              url
            }
          }
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;

export const SECONDARY_HEADER_QUERY = gql`
  query SecondaryHeader {
    SecondaryHeader {
      id
      updatedAt
      createdAt
      navItems {
        id
        label
        linkType
        openInNewTab
        contentSource
        contentSourceSlug
        fullPath
        customUrl
        selectedItem {
          relationTo
          value {
            ... on Category {
              id
              title
              slug
            }
            ... on Channel {
              id
              title
              slug
            }
            ... on Topic {
              id
              title
              slug
            }
            ... on LiveBlog {
              id
              title
              slug
            }
            ... on Page {
              id
              title
              slug
            }
            ... on PressRoom {
              id
              title
              slug
            }
            ... on Production {
              id
              title
              slug
            }
            ... on Program {
              id
              title
              slug
            }
            ... on Province {
              id
              title
              slug
            }
            ... on Post {
              id
              title
              slug
            }
            ... on Talent {
              id
              title
              slug
            }
            ... on Video {
              id
              title
              slug
            }
          }
        }
        subItems {
          id
          label
          linkType
          openInNewTab
          contentSource
          contentSourceSlug
          fullPath
          customUrl
          selectedItem {
            relationTo
            value {
              ... on Category {
                id
                title
                slug
              }
              ... on Channel {
                id
                title
                slug
              }
              ... on Topic {
                id
                title
                slug
              }
              ... on LiveBlog {
                id
                title
                slug
              }
              ... on Page {
                id
                title
                slug
              }
              ... on PressRoom {
                id
                title
                slug
              }
              ... on Production {
                id
                title
                slug
              }
              ... on Program {
                id
                title
                slug
              }
              ... on Province {
                id
                title
                slug
              }
              ... on Post {
                id
                title
                slug
              }
              ... on Talent {
                id
                title
                slug
              }
              ... on Video {
                id
                title
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const STORE_DEVICE_ID_QUERY = gql`
  mutation StoreDeviceToken($deviceId: String!) {
    storeDeviceToken(input: { deviceId: $deviceId }) {
      success
    }
  }
`;

export const REMOVE_DEVICE_ID_QUERY = gql`
  mutation RemoveDeviceToken($deviceId: String!) {
    removeDeviceToken(input: { deviceId: $deviceId }) {
      success
    }
  }
`;

export const HOMEPAGE_SPECIAL_CONTENT_QUERY = gql`
  query HomepageSpecialContent($section: String!, $isBookmarked: Boolean) {
    HomepageSpecialContent(section: $section, isBookmarked: $isBookmarked) {
      title
      subtitle
      redirectTo {
        id
        title
        slug
        fullPath
      }
      principal {
        id
        title
        slug
        publishedAt
        readTime
        videoDuration
        mcpId
        relationTo
        isBookmarked
        heroImage {
          url
          id
          sizes {
            vintage {
              url
            }
          }
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
        summary
        excerpt
        isBookmarked
      }
      secondary {
        id
        title
        slug
        excerpt
        summary
        publishedAt
        readTime
        videoDuration
        mcpId
        relationTo
        isBookmarked
        heroImage {
          url
          caption
          id
          sizes {
            square {
              url
            }
          }
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
      carousel {
        id
        title
        slug
        excerpt
        summary
        publishedAt
        readTime
        videoDuration
        mcpId
        relationTo
        isBookmarked
        heroImage {
          url
          id
          sizes {
            square {
              url
            }
          }
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
      highlighted {
        id
        title
        slug
        publishedAt
        readTime
        videoDuration
        relationTo
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
          slug
        }
        topics {
          id
          title
          slug
        }
      }
      videos {
        id
        title
        slug
        videoDuration
        mcpId
        relationTo
        isBookmarked
        fullPath
        videoUrl
        heroImage {
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

export const HOMEPAGE_OPINION_QUERY = gql`
  query HomepageOpinion($isBookmarked: Boolean) {
    HomepageOpinion(isBookmarked: $isBookmarked) {
      id
      title
      type
      slug
      videoUrl
      videoDuration
      readTime
      aspectRatio
      summary
      hasInteractive
      interactiveUrl
      publishedAt
      order
      isHero
      isBookmarked
      heroImage {
        url
        sizes {
          vintage {
            url
          }
        }
      }
      category {
        title
        id
      }
      topics {
        id
        title
      }
      authors {
        id
        name
        slug
        photo {
          id
          url
        }
      }
    }
  }
`;

export const LIVEBLOG_PRIME_SECTION_QUERY = gql`
  query HomepagePrime {
    HomepagePrime {
      liveBlog {
        id
        title
        showContext
        context
        publishedAt
        liveblogStatusText
        openingType
        extract
        readTime
        lastUpdated
        slug
        updatedAt
        createdAt
        featuredImage {
          id
          url
          sizes {
            vintage {
              url
            }
          }
        }
        linkedEntries(limit: 4) {
          docs {
            id
            title
            content
            createdAt
            updatedAt
          }
        }
        contentPrioritization {
          isActive
        }
      }
    }
  }
`;

export const LIVE_STREAMING_PRIME_SECTION_QUERY = gql`
  query HomepagePrime {
    HomepagePrime {
      liveStreaming {
        id
        title
        description
        liveSignal
        youtubeCode
      }
    }
  }
`;

export const BREAKING_NEW_PRIME_SECTION_QUERY = gql`
  query HomepagePrime {
    HomepagePrime {
      breakingNews {
        hero {
          id
          type
          openingType
          title
          slug
          fullPath
          summary
          publishedAt
          readTime
          videoDuration
          hasInteractive
          interactiveUrl
          isBookmarked
          order
          isBreaking
          aspectRatio
          heroImage {
            id
            url
            sizes {
              portrait {
                url
              }
              vintage {
                url
              }
              landscape {
                url
              }
            }
          }
          topics {
            id
            title
          }
          category {
            id
            title
          }
        }
        secondary {
          id
          type
          openingType
          title
          slug
          fullPath
          summary
          publishedAt
          readTime
          videoDuration
          hasInteractive
          interactiveUrl
          isBookmarked
          order
          isBreaking
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
  }
`;

export const HOMEPAGE_NFOCUS_SECTION_QUERY = gql`
  query HomepageNfocus($isBookmarked: Boolean) {
    HomepageNfocus(isBookmarked: $isBookmarked) {
      id
      title
      slug
      videoUrl
      videoDuration
      mcpId
      aspectRatio
      fullPath
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
        }
      }
      specialImage {
        url
        sizes {
          vintage {
            url
          }
        }
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
`;

export const HOMEPAGE_PROGRAMS_SECTION_QUERY = gql`
  query HomepagePrograms($channel: String) {
    HomepagePrograms(channel: $channel) {
      id
      title
      slug
      fullPath
      publishedAt
      schedule
      order
      isBookmarked
      heroImage {
        sizes {
          square {
            url
          }
          vintage {
            url
          }
        }
      }
    }
  }
`;

export const HOMEPAGE_CHANNELS_QUERY = gql`
  query HomepageChannels {
    HomepageChannels {
      id
      title
      slug
      fullPath
    }
  }
`;

export const PAGE_WIDGETS_QUERY = gql`
  query PageWidgets($page: PageType, $slug: String) {
    PageWidgets(page: $page, slug: $slug) {
      countdownTimer {
        id
        title
        description
        eventDate
        startDate
        endDate
        redirectUrl
      }
      weatherWidget {
        enabled
        location {
          city
        }
      }
      exchangeRateWidget {
        appEnabled
      }
    }
  }
`;

export const WEATHER_WIDGET_QUERY = gql`
  query GetCurrentWeather($city: String!) {
    getCurrentWeather(input: { query: $city }) {
      temp_c
      temp_f
      maxtemp_c
      maxtemp_f
      mintemp_c
      mintemp_f
      wind_mph
      wind_kph
      wind_dir
      humidity
      air_quality {
        co
        no2
        o3
        so2
        pm2_5
        pm10
        usEpaIndex
      }
      location {
        name
        region
        country
        lat
        lon
        tz_id
        localtime
      }
      condition {
        text
        icon
      }
    }
  }
`;

export const ADVERTISEMENT_QUERY = gql`
  query Advertisement {
    Advertisement {
      id
      activateAds
      homepageAds {
        activateHomepageAds
        appHomepages
      }
      storyPagesConfig {
        adPositionInBody
      }
    }
  }
`;

export const EXCHANGE_RATE_WIDGET_QUERY = gql`
  query GetExchangeRate {
    getExchangeRate {
      baseCode
      targetCode
      currentRate
      previousRate
      absoluteChange
      percentageChange
      lastUpdated
      targetData {
        locale
        twoLetterCode
        currencyName
        currencyNameShort
        displaySymbol
        flagUrl
      }
    }
  }
`;

export const TOPIC_QUERY = gql`
  query Topic($slug: String) {
    Topic(slug: $slug) {
      activateAds
    }
  }
`;
