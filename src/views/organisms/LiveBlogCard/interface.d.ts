import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

import { TFunction } from 'i18next';

import { LexicalContent } from '@src/models/main/Home/LiveBlog';

type BlogEntries = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: LexicalContent;
};

type BlogMedia = {
  id: string;
  url: string;
};

export interface LiveBlogCardProps {
  t: TFunction<'translation', undefined>;
  title: string;
  subTitle?: string | null;
  isLive?: boolean;
  inactiveBlog?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  blogEntries?: BlogEntries[];
  mediaUrl: string;
  vintageUrl?: string;
  landscapeUrl?: string;
  hasEmptyMediaUrl?: boolean;
  handleMedia?: boolean;
  subHeadingSize?: number;
  subHeadingFont?: string;
  subHeadingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med' | undefined;
  subHeadingColor?: string;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  bookmarkIconContainerStyle?: StyleProp<ViewStyle>;
  liveBlogTextBlockStyle?: StyleProp<ViewStyle>;
  liveBlogTagTextStyle?: StyleProp<TextStyle>;
  headingStyle?: StyleProp<TextStyle>;
  subHeadingStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  blogMediaContainerStyle?: StyleProp<ViewStyle>;
  isShowTitleOnTop?: boolean;
  bottomTitleContainerStyle?: StyleProp<ViewStyle>;
  hasEmptyMediaUrl?: boolean;
}
