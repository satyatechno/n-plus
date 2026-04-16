export interface NPlusShortReport {
  id: string;
  title: string;
  slug?: string;
  type: 'post' | 'video';
  summary?: string;
  publishedAt?: string;
  order?: number | null;
  readTime?: number | null;
  videoDuration?: number | null;
  isBookmarked?: boolean;
  heroImage?: { url?: string } | null;
  topics?: { id: string; title: string; slug: string }[] | null;
  category?: { id: string; title: string; slug: string } | null;
}

interface ImageSizes {
  portrait?: { url?: string };
  vintage?: { url?: string };
  square?: { url?: string };
}

interface SpecialImage {
  sizes?: ImageSizes;
  title?: string;
  url?: string;
}

interface Productions {
  specialImage: SpecialImage;
}

export interface InvestigationItem {
  id: string | number;
  productions: Productions;
  content?: {
    heroImage?: {
      url?: string;
      sizes?: ImageSizes;
    };
  };
  title?: string;
  subTitle?: string;
  image?: string;
  slug: string;
}

interface VideosData {
  docs: InvestigationItem[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
  nextCursor?: string;
}

export interface InvestigationResponse {
  Videos: VideosData;
}

interface VideoCategory {
  title: string;
}

interface VideoTopic {
  title: string;
}

export interface VideoItemCategoryTopics {
  category?: VideoCategory;
  topics?: VideoTopic[];
  topic?: string;
}
