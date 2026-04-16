import { StyleProp, ViewStyle } from 'react-native';

export interface RecentOpinionListResponse {
  RecentCategory: {
    data: Opinion[];
  };
}

export interface MoreFromCategoryOpinionListResponse {
  MoreFromCategory: {
    data: Opinion[];
  };
}

export interface Opinion {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  collection: string;
  isBookmarked: boolean;
  aspectRatio: number;
  authors: Author[];
  heroImages: HeroImage[];
  height: number;
  onPress?: () => void;
  onSharePress?: (opinion: Opinion) => void;
  onBookmarkPress?: (opinion: Opinion) => void;
}

export interface HeroImage {
  url?: string;
  height: number;
  width: number;
}

export interface ProfilePicture {
  url?: string | null;
  sizes?: {
    square: {
      url?: string | null;
    };
  };
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  profilePicture?:
    | ProfilePicture
    | { id?: string; url?: string; sizes?: { square: { url?: string } } };
  photo?: { url?: string };
}

export interface ContentItem {
  id?: string;
  title?: string;
  slug?: string;
  collection?: string;
  summary?: string;
  description?: string;
  authors?: Author[];
}

export interface AuthorHeader {
  id?: string;
  slug?: string;
  name: string;
  profilePicture?: {
    url?: string;
  };
  photo?: {
    url?: string;
  };
}

export interface Story {
  authors?: AuthorHeader[];
}

interface Video {
  authors?: AuthorHeader[];
  content?: {
    heroImage?: {
      url?: string;
    };
  };
}

export interface HeaderOpinionDetailProps {
  opinion?: Opinion;
  video?: Video;
  story?: Story;
  style?: StyleProp<ViewStyle>;
  handleAuthorPress?: (id: string) => void;
}

export interface Category {
  title?: string;
  slug?: string;
  id?: string;
}

export interface CarouselData {
  topics?: Category[];
  id?: string;
  slug?: string;
  title: string;
  readTime?: number;
  category?: Category;
  Category?: Category;
  heroImages?: HeroImage[];
  publishedAt?: string;
  heroImage?: HeroImage;
  videoDuration?: number;
  collection?: string;
  relationTo: string;
  type: string;
  authors: Author[];
  isBookmarked: boolean;
}

export interface OpinionItem {
  id: string;
  slug: string;
  title: string;
  type: string;
  isBookmarked?: boolean;
  category?: { title: string };
  publishedAt?: string;
  topics?: { title: string }[];
  authors?: { name: string; photo?: { url: string } }[];
  heroImage?: { sizes?: { vintage?: { url: string } } };
  isHero?: string;
}
