export interface ShortInvestigationItem {
  id: string;
  type: string;
  openingType?: string;
  title: string;
  slug: string;
  summary: string;
  readTime: number | null;
  videoDuration: number | null;
  isBookmarked: boolean;
  heroImage: {
    id: string;
    alt?: string;
    url: string;
    mimeType?: string;
    sizes?: {
      square?: {
        url?: string;
      };
    };
  } | null;
  topicTitle?: string | null;
}

export interface NPlusFocusShortReportListingDoc {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string;
  readTime: number | null;
  videoDuration: number | null;
  isBookmarked: boolean;
  heroImage: {
    id: string;
    alt?: string;
    url: string;
    mimeType?: string;
    sizes?: {
      square?: {
        url?: string;
      };
    };
  } | null;
  category?: {
    id: string;
    title: string;
  };
  topics?: Array<{
    id: string;
    title: string;
  }>;
}
