import React from 'react';
import {
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';

import { lineHeight, spacing } from '@src/config/styleConsts';
import ArticleCarouselCard from '@src/views/organisms/ArticleCarouselCard';
import { CarouselData } from '@src/models/main/Opinion/Opinion';

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const CARD_WIDTH = 320;
const CARD_SPACING = spacing.xs;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

/* -------------------------------------------------------------------------- */

interface Props {
  data: CarouselData[];
  imageUrl?: string;
  onCardPress?: (item: CarouselData) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ItemSeparatorComponent?: React.ComponentType<unknown> | null | undefined;
  cardStyle?: StyleProp<ViewStyle>;
  durationTextStyle?: StyleProp<TextStyle>;
  onCategoryPress?: (data: CarouselData) => void;
  dateTextStyle?: StyleProp<TextStyle>;
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

function ArticleSnapCarousel({
  data,
  imageUrl,
  onCardPress,
  contentContainerStyle,
  ItemSeparatorComponent,
  cardStyle,
  durationTextStyle,
  onCategoryPress,
  dateTextStyle,
  onMomentumScrollEnd
}: Props) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item: CarouselData, index) => item?.id ?? index.toString()}
      onMomentumScrollEnd={onMomentumScrollEnd}
      /* ------------------------- SNAP CONFIG ------------------------- */
      snapToInterval={ItemSeparatorComponent ? SNAP_INTERVAL + spacing.xxxs : SNAP_INTERVAL}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      bounces={false}
      /* --------------------------------------------------------------- */

      contentContainerStyle={StyleSheet.flatten([styles.container, contentContainerStyle])}
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={({ item, index }: { item: CarouselData; index: number }) => {
        const isLastItem = index === data.length - 1;

        return (
          <ArticleCarouselCard
            item={item}
            imageUrl={imageUrl}
            onCardPress={() => onCardPress?.(item)}
            containerStyle={isLastItem ? cardStyle : undefined}
            showDuration
            isVideo={item?.relationTo === 'videos'}
            hideDivider={!!ItemSeparatorComponent}
            durationTextStyle={durationTextStyle}
            onCategoryPress={() => onCategoryPress?.(item)}
            dateTextStyle={dateTextStyle}
            titleTextStyle={styles.titleTextStyle}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.xs
  },
  lastCard: {
    borderRightWidth: 0,
    marginRight: 0
  },
  titleTextStyle: {
    lineHeight: lineHeight.m
  }
});

export default ArticleSnapCarousel;
