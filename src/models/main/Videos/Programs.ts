export type ProgramItem = {
  id?: string | number;
  title?: string;
  description?: string;
  schedule?: string;
  position?: string;
  slug?: string;
  heroImage?: {
    id?: string | number;
    url?: string;
    sizes?: {
      portrait?: { url?: string };
      landscape?: { url?: string };
      square?: { url?: string };
      vintage?: { url?: string };
    };
  };
};

export type BannerImageSize = {
  url?: string;
};

export type BannerImage = {
  sizes?: {
    vintage?: BannerImageSize;
  };
};

export type Program = {
  id?: string;
  title?: string;
  showCode?: string;
  publishedAt?: string;
  description?: string | Record<string, unknown>;
  schedule?: string;
  position?: string;
  slug?: string;
  lastSlug?: string;
  bannerImage?: BannerImage;
  relatedVideos?: Array<{
    id?: string;
    title?: string;
    readTime?: number;
    videoUrl?: string;
    videoDuration?: number;
    slug?: string;
    content?: {
      heroImage?: { id?: string; url?: string };
    };
  }>;
  talents?: Array<{
    id?: string;
    title?: string;
    titleLowercase?: string;
    description?: string;
    slug?: string;
    heroImage?: { id?: string; url?: string };
  }>;
};

export type Talent = {
  id?: string;
  title?: string;
  fullPath?: string;
  description?: string | Record<string, unknown>;
  slug?: string;
  heroImage?: { id?: string | number; url?: string };
  programs?: ProgramItem[];
  position?: string;
};

export interface UserResponse {
  Talent: Talent;
}

export interface AuthorBio {
  id?: string;
  name?: string;
  position?: string;
  photo?: {
    url?: string;
  };
}

export interface CombinedRelatedVideos {
  value?: {
    id?: string;
    slug?: string;
    title?: string;
    videoDuration?: number;
    content?: { heroImage?: { url?: string } };
  };
}

export interface filteredEpisodes {
  id?: string;
  slug?: string;
  title?: string;
  videoDuration?: number;
  content?: { heroImage?: { url?: string } };
}
