import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@src/navigation/types';
import { AppTheme } from '@src/themes/theme';

export interface AuthorDetailsViewModel {
  theme: AppTheme;
  t: (key: string) => string;
  onGoBack: () => void;
  authorArticle: Article[];
  authorDetails?: UserData;
  authorDetailsLoading: boolean;
  authorArticleLoading: boolean;
  errorMsg: string;
  setErrorMsg: (value: string) => void;
  onToggleBookmark: (contentId: string, type: string) => Promise<void>;
  onShare: () => Promise<void>;
  onAuthorArticlePress: (item: {
    slug: string;
    collection: string;
    category?: { id: string };
  }) => void;
  onArticleCardPress: (item: Article, index: number) => void;
  onArticleBookmarkPress: (
    item: Article,
    index: number
  ) => (contentId: string, type: string, isAddingBookmark?: boolean) => void;
  isBookmark: boolean;
  setIsBookmark: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  loading: boolean;
  bookmarkModalVisible: boolean;
  setBookmarkModalVisible: (value: boolean) => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  onCancelPress: () => void;
  onConfirmPress: () => void;
  toastType: 'success' | 'error';
  toastMessage: string;
  setToastMessage: (value: string) => void;
  onRefresh: () => void;
  refreshLoader: boolean;
  hasNext: boolean;
  onLoadMore: () => Promise<void>;
  loadMoreLoading: boolean;
  isInitialLoading: boolean;
  isInternetConnection: boolean;
}

interface Pagination {
  total: number;
  offset: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  readTime: number;
  isBookmarked: boolean;
  collection: string;
}

export interface GetAuthorsArticlesResponse {
  GetAuthorsArticles: {
    pagination: Pagination;
    data: Article[];
  };
}

export interface MoreFromAuthorsPagination {
  hasNext: boolean;
  nextCursor: string;
}

export interface MoreFromAuthorsResponse {
  MoreFromAuthors: {
    data: Article[];
    pagination: MoreFromAuthorsPagination;
  };
}

export interface BioRoot {
  root: {
    children: Array<{
      children: Array<{
        text: string;
      }>;
    }>;
  };
}

export interface UserData {
  id: string;
  name: string;
  position: string;
  bio: BioRoot;
  photo: UserPhoto;
  fullPath: string;
}
export interface UserPhoto {
  url: string;
  thumbnailURL: string | null;
}

export interface UserResponse {
  User: UserData;
}

export interface UserQueryVariables {
  id: string;
}

export interface ToggleBookmarkResponse {
  toggleBookmark: {
    success: boolean;
    message: string;
    isBookmarked: boolean;
  };
}

export interface ToggleBookmarkVariables {
  input: {
    contentId: string;
    contentType: string;
  };
}
