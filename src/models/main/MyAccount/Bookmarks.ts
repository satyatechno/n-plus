import { COLLECTION_TYPE } from '@src/config/enum';
import { AppTheme } from '@src/themes/theme';

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type RenderCollectionStyles = {
  emptyStateContainer: ViewStyle;
  emptyStateTitle: TextStyle;
  emptyStateSubtitle: TextStyle;
  root: ViewStyle;
  carouselContainerVideo: ViewStyle;
  verticalHeading: TextStyle;
  verticalVideoContainer: ViewStyle;
  verticalImageStyle: ImageStyle;
  videosTextColumn: ViewStyle;
  videosBottomRow: ViewStyle;
  seeMoreButtonDisabled: ViewStyle;
  postsContainer: ViewStyle;
  postsItem: ViewStyle;
  postsSubtitleRow: ViewStyle;
  postsDivider: ViewStyle;
  bookmarkContainer: ViewStyle;
  liveBlogItemContainer: ViewStyle;
  liveBlogTextContainer: ViewStyle;
  liveBlogSubtitleSpacer: ViewStyle;
  liveBlogDivider: ViewStyle;
  liveBlogItemSeparator: ViewStyle;
  bookmarkIconContainerStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
  titleStyles: TextStyle;
  titleRowStyles: TextStyle;
  authorBookmarkIconContainerStyle: ViewStyle;
  subTitleStyles: TextStyle;
  flatList: ViewStyle;
  columnWrapper: ViewStyle;
  programsItem: ViewStyle;
  talentsContainer: ViewStyle;
  talentsRow: ViewStyle;
  talentsAvatar: ImageStyle;
  talentsTextCol: ViewStyle;
  defaultContainer: ViewStyle;
  defaultItem: ViewStyle;
  defaultSpacer: ViewStyle;
  liveBlogBookmarkIconContainerStyle: ViewStyle;
  verMasButton: ViewStyle;
  skeletonflatList: ViewStyle;
  loadMoreButton: ViewStyle;
};

export type SearchContentItem = {
  interactiveUrl?: string | undefined;
  fullPath?: string | undefined;
  id?: string;
  title?: string;
  readTime?: number;
  isBookmarked?: boolean;
  publishedAt?: string;
  heroImages?: { url?: string } | null;
  category?: { title?: string } | null;
  topics?: Array<{ title?: string } | null> | null;
  schedule?: string;
  contentPrioritization?: { isActive?: boolean } | null;
  slug?: string;
  liveblogStatus?: boolean;
  videoDuration?: number;
};

export type Props = {
  data: SearchContentItem[] | undefined | null;
  styles: RenderCollectionStyles;
  collection: COLLECTION_TYPE;
  onToggleBookmark: (contentId: string, type: string, title?: string, index?: number) => void;
  theme: AppTheme;
  onPress: ({
    routeName,
    screenName,
    slug,
    id,
    interactiveUrl,
    index
  }: {
    routeName?: string;
    screenName?: string;
    slug?: string;
    id?: string;
    interactiveUrl?: string;
    index?: number;
  }) => void;
  hasNext?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
};

export type BookmarkListItem = { id?: string; slug?: string } & { [key: string]: unknown };

export type GetUserBookmarksResponse = {
  getUserBookmarks?: {
    data?: BookmarkListItem[];
    pagination?: { nextCursor?: string | null; hasNext?: boolean };
  };
};
