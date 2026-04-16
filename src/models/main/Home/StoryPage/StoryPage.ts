export interface HeroImage {
  url?: string;
  height: number;
  width: number;
}

export interface CarouselItem {
  id: string;
  imageUrl?: string;
  topic: string;
  title: string;
  minutesAgo: number;
  isBookmarked?: boolean | null;
  type?: string;
  slug?: string;
  heroImage: { url: string };
  category?: { id?: string; title: string };
  topics?: Array<{ id?: string; title: string }>;
  videoDuration?: number;
  collection?: string;
  relationTo?: string;
  readTime?: number;
  heroImages: HeroImage[];
}

export interface ToggleBookmarkInput {
  contentId: string;
  userId: string;
}

export interface ToggleBookmarkResponse {
  toggleBookmark: {
    success: boolean;
    message: string;
    isBookmarked: boolean;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  category: { id?: string; title: string };
  topics?: Array<{ id: string; title: string }>;
  heroImages?: Array<{ url: string; alt: string }>;
  isBookmarked?: boolean;
  collection?: string;
  readTime?: number;
  slug?: string;
}
