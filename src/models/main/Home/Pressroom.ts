export interface PressroomItem {
  id: string;
  fullPath?: string;
  title: string;
  slug: string;
  collection: string;
  isBookmarked: boolean;
  publishedAt: string;
  featuredImage?: {
    alt: string;
    url: string;
    sizes?: {
      vintage?: {
        url?: string;
      };
      square?: {
        url?: string;
      };
    };
  };
}
