import React from 'react';
import { FlatList, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { CarouselItem } from '@src/models/main/Home/StoryPage/StoryPage';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';

interface Props {
  data: CarouselItem[];
  onCardPress?: (item: CarouselItem) => void;
  onBookmarkPress?: (item: CarouselItem) => void;
  listContainerStyle?: StyleProp<ViewStyle>;
  headingStyles?: StyleProp<TextStyle>;
  subHeadingStyles?: StyleProp<TextStyle>;
  iconColor?: string;
  bottomRowStyles?: StyleProp<TextStyle>;
  elementType?: string;
}

const Carousel = ({
  data,
  onCardPress,
  onBookmarkPress,
  listContainerStyle,
  headingStyles,
  subHeadingStyles,
  iconColor,
  bottomRowStyles,
  elementType
}: Props) => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={data}
    keyExtractor={(item) => item.id}
    contentContainerStyle={StyleSheet.flatten([styles.container, listContainerStyle])}
    renderItem={({ item }) => {
      // For videos, format videoDuration from seconds to minutes
      // For non-videos, use minutesAgo if it's already formatted, otherwise format it
      const formattedMinutesAgo = item?.videoDuration
        ? formatDurationToMinutes(item.videoDuration)
        : typeof item?.minutesAgo === 'string'
          ? item.minutesAgo
          : typeof item?.minutesAgo === 'number' && item.minutesAgo > 0
            ? `${item.minutesAgo} min`
            : formatDurationToMinutes(item?.videoDuration ?? 0);

      return (
        <CarouselCard
          type={item?.collection === 'videos' ? 'videos' : (elementType ?? undefined)}
          item={item}
          isBookmarked={item?.isBookmarked}
          onPress={() => onCardPress?.(item)}
          onBookmarkPress={() => onBookmarkPress?.(item)}
          minutesAgo={formattedMinutesAgo}
          topic={item?.topics?.[0]?.title ?? item?.category?.title ?? ''}
          imageUrl={item?.heroImage?.url ?? ''}
          headingStyles={headingStyles}
          subheadingStyles={subHeadingStyles}
          iconColor={iconColor}
          bottomRowStyles={bottomRowStyles}
        />
      );
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.xs
  }
});

export default Carousel;
