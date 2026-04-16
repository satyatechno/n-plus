import { StyleProp, TextStyle, ViewStyle, ImageStyle } from 'react-native';

import { TFunction } from 'i18next';

import { TransformedCategoryItem } from '@src/models/main/Home/Category/CategoryTopicDetail';

export interface CategoryContentListProps {
  t: TFunction<'translation', undefined>;
  data: TransformedCategoryItem[];
  heading?: string;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onItemPress: (item: TransformedCategoryItem, index: number) => void;
  onBookmarkPress?: (item: TransformedCategoryItem, index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  listContainerStyle?: StyleProp<ViewStyle>;
  headingStyle?: StyleProp<TextStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
  seeMoreButtonStyle?: StyleProp<ViewStyle>;
  seeMoreButtonTextStyle?: StyleProp<TextStyle>;
  seeMoreButtonHitSlop?: { top: number; bottom: number; left: number; right: number };
  carouselCardContainerStyle?: StyleProp<ViewStyle>;
  carouselHeadingStyle?: StyleProp<TextStyle>;
  carouselContentContainerStyle?: StyleProp<ViewStyle>;
  carouselImageStyle?: StyleProp<ImageStyle>;
  carouselSubheadingStyle?: StyleProp<TextStyle>;
  liveBlogBookmarkContainerStyle?: StyleProp<ViewStyle>;
}
