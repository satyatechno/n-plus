import React from 'react';
import {
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';

import { spacing } from '@src/config/styleConsts';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { CarouselItem } from '@src/models/main/Home/StoryPage/StoryPage';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';

interface Props {
  data: CarouselItem[];
  onCardPress?: (item: CarouselItem, index: number) => void;
  onBookmarkPress?: (item: CarouselItem) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  listContainerStyle?: StyleProp<ViewStyle>;
  headingStyles?: StyleProp<TextStyle>;
  subHeadingStyles?: StyleProp<TextStyle>;
  iconColor?: string;
  bottomRowStyles?: StyleProp<TextStyle>;
  elementType?: string;
  showBookmark?: boolean;
  showPlayIcon?: boolean;
  getVideoDuration?: (item: CarouselItem) => string | number;
  isShowPlayIcon?: (item: CarouselItem) => boolean;
  videoDuration?: number;
  timeTextStyles?: StyleProp<TextStyle>;
  textColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
  cardContainerStyle?: StyleProp<ViewStyle>;
  onTitlePress?: (item: CarouselItem) => void;
  getImageUrl?: (item: CarouselItem) => string;
  hidePlayIconOnly?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               SNAP CONFIG                                  */
/* -------------------------------------------------------------------------- */

const CARD_WIDTH = 260;
const CARD_SPACING = spacing.xs;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

/* -------------------------------------------------------------------------- */

const SnapCarousel = ({
  data,
  onCardPress,
  onBookmarkPress,
  onScroll,
  onMomentumScrollEnd,
  listContainerStyle,
  headingStyles,
  subHeadingStyles,
  iconColor,
  bottomRowStyles,
  elementType,
  showBookmark,
  isShowPlayIcon,
  getVideoDuration,
  timeTextStyles,
  textColor,
  imageStyle,
  cardContainerStyle,
  onTitlePress,
  getImageUrl,
  hidePlayIconOnly = false
}: Props) => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={data}
    keyExtractor={(item) => item.id}
    onScroll={onScroll}
    onMomentumScrollEnd={onMomentumScrollEnd}
    scrollEventThrottle={16}
    /* ---------------- SNAP EFFECT ---------------- */
    snapToInterval={SNAP_INTERVAL}
    snapToAlignment="start"
    decelerationRate="fast"
    disableIntervalMomentum
    bounces={false}
    /* --------------------------------------------- */

    contentContainerStyle={StyleSheet.flatten([styles.container, listContainerStyle])}
    renderItem={({ item, index }) => {
      const formattedMinutesAgo = item?.videoDuration
        ? formatDurationToMinutes(item.videoDuration)
        : typeof item?.minutesAgo === 'string'
          ? item.minutesAgo
          : typeof item?.minutesAgo === 'number' && item.minutesAgo > 0
            ? `${item.minutesAgo} min`
            : formatDurationToMinutes(item?.videoDuration ?? 0);

      return (
        <View>
          <CarouselCard
            type={item?.collection === 'videos' ? 'videos' : elementType}
            item={item}
            topic={item?.topics?.[0]?.title ?? item?.category?.title ?? ''}
            isBookmarked={item?.isBookmarked}
            minutesAgo={getVideoDuration ? getVideoDuration(item) : formattedMinutesAgo}
            imageUrl={getImageUrl ? getImageUrl(item) : (item?.heroImage?.url ?? '')}
            onBookmarkPress={() => onBookmarkPress?.(item)}
            onPress={() => onCardPress?.(item, index)}
            headingStyles={headingStyles}
            subheadingStyles={subHeadingStyles}
            iconColor={iconColor}
            bottomRowStyles={bottomRowStyles}
            showPlayIcon={isShowPlayIcon ? isShowPlayIcon(item) : true}
            showBookmark={showBookmark}
            timeTextStyles={timeTextStyles}
            textColor={textColor}
            imageStyle={imageStyle}
            contentContainerStyle={cardContainerStyle}
            onTitlePress={() => onTitlePress?.(item)}
            hidePlayIconOnly={hidePlayIconOnly}
          />
        </View>
      );
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.xs
  }
});

export default SnapCarousel;
