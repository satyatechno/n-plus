export type HeroImage = {
  url: string;
  title: string;
  caption: string;
  sizes?: {
    vintage?: {
      url?: string;
    };
    landscape?: {
      url?: string;
    };
  };
};

export type Topic = {
  id: string;
  title: string;
  slug: string;
};

export type Category = {
  id: string;
  title: string;
};

export type CategoryTopicDetailItem = {
  id: string;
  slug: string;
  collection: string;
  heroImages: HeroImage[];
  topics: Topic[];
  category?: Category;
  title: string;
  summary: string;
  excerpt?: string;
  readTime: number;
  videoDuration?: number;
  isBookmarked: boolean;
  publishedAt: string;
  liveblogStatus?: string;
  openingType?: string;
};

export type RecentCategoryData = {
  data: CategoryTopicDetailItem[];
};

export type RecentCategoryResponse = {
  RecentCategory: RecentCategoryData;
};

export type GetRecentCategoryInput = {
  categoryId: string;
  isBookmarked?: boolean;
  limit: number;
};

export type TransformedCategoryItem = {
  imageUrl: string;
  vintageUrl?: string;
  landscapeUrl?: string;
  topic: string;
  title: string;
  minutesAgo: string | number;
  isBookmarked: boolean;
  publishedAt: string;
  type: string;
  id: string;
  slug: string;
  collection: string;
  caption: string;
  summary: string;
  excerpt?: string;
  liveblogStatus?: string;
  topics?: Topic[];
  openingType: string;
};

export type Pagination = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type MoreFromCategoryData = {
  data: CategoryTopicDetailItem[];
  pagination: Pagination;
};

export type MoreFromCategoryResponse = {
  MoreFromCategory: MoreFromCategoryData;
};

export type MoreFromCategoryInput = {
  categoryId: string;
  isBookmarked?: boolean;
  count?: number;
  nextCursor?: string | null;
  limit?: number;
};

export type TopicData = {
  activateAds?: boolean;
};

export type TopicResponse = {
  Topic: TopicData;
};

export type RecentTopicData = {
  data: CategoryTopicDetailItem[];
};

export type RecentTopicResponse = {
  RecentTopics: RecentTopicData;
};

export type MoreFromTopicData = {
  data: CategoryTopicDetailItem[];
  pagination: Pagination;
};

export type MoreFromTopicResponse = {
  MoreFromTopics: MoreFromTopicData;
};

export type MoreFromTopicInput = {
  topicId: string;
  isBookmarked?: boolean;
  count?: number;
  nextCursor?: string | null;
  limit?: number;
};

export type RecentData = RecentCategoryData | RecentTopicData;
export type MoreData = MoreFromCategoryData | MoreFromTopicData;

export type RecentResponse = RecentCategoryResponse | RecentTopicResponse;
export type MoreResponse = MoreFromCategoryResponse | MoreFromTopicResponse;
