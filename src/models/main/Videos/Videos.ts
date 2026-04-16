import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ExclusiveItem {
  hero?: {
    media?: {
      sizes?: {
        portrait?: {
          url: string;
        };
      };
    };
  };
  specialImage?: {
    url?: {
      sizes?: {
        portrait?: {
          url: string;
        };
      };
    };
  };
  id: string;
  image: string;
  title: string;
  videoUrl?: string;
  aspectRatio?: number;
  slug: string;
  heroImage: {
    sizes: {
      portrait: {
        url: string;
      };
    };
  };
}

export interface SpecialSectionTwoItem extends ExclusiveItem {
  topics?: { title?: string }[];
  category?: { title?: string };
  relationTo?: string;
  publishedAt?: string;
}

export interface ProgramasItem {
  id?: string | number;
  image?: string;
  title?: string;
  subTitle?: string;
  slug?: string;
  publishedAt?: string;
  category?: { title?: string };
  topics?: { title?: string }[];
}

export interface VideoItem {
  id: string;
  imageUrl: string;
  category: string;
  title?: string;
  progress?: number;
  duration?: string;
  videoId?: string;
  slug?: string;
  fullPath?: string;
}

export interface VideoOptionsModalProps {
  visible: boolean;
  onRequestClose: () => void;
  videoTitle: string;
  onInfoPress?: () => void;
  onSharePress?: () => void;
  onRemovePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
  modalOverlayStyle?: StyleProp<ViewStyle>;
  modalContainerStyle?: StyleProp<ViewStyle>;
  modalTitleStyle?: StyleProp<TextStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  iconColor?: string;
}

export interface ImageObject {
  url: string;
}

export interface VideoListItemProps {
  item: ContinueWatchingVideo;
  onPress: (item: ContinueWatchingVideo) => void;
  onMenuPress: (videoId: string) => void;
  titleColor?: string;
  menuIconColor?: string;
  categoryColor?: string;
  category?: string;
  topics?: string[];
  iconColor?: string;
  isImageDownloadEnabled?: boolean;
}

export type FocusDoc = {
  id: string;
  title: string;
  heroImage?: { url: string };
  aspectRatio?: number;
  publishedAt: string;
};

export interface ImageObject {
  url: string;
}

export interface ContinueWatchingVideo {
  platform: string;
  id: string;
  videoId: string;
  title: string;
  slug: string;
  videoUrl: string;
  videoDuration: number;
  updatedAt: string;
  timeWatched: number;
  percentageWatched: number;
  fullPath?: string;
  heroImages?: ImageObject[];
  category?: {
    id?: string;
    title: string;
  } | null;
  topics?:
    | {
        id?: string;
        title: string;
      }[]
    | null;
  program?: {
    id?: string;
    title: string;
  } | null;
  isBookmarked: boolean;
}

export interface ContinueWatchingResponse {
  getUserContinueVideos: {
    videos: ContinueWatchingVideo[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface PorElPlanetaItem {
  id: string;
  title: string;
  slug: string;
}
