import React from 'react';
import { FlatList, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import InfoCard from '@src/views/molecules/InfoCard';
import { CarouselData } from '@src/models/main/Opinion/Opinion';

/* -------------------------------------------------------------------------- */
/*                               SNAP CONFIG                                  */
/* -------------------------------------------------------------------------- */

const CARD_WIDTH = 190;
const SEPARATOR_WIDTH = spacing.l * 2; // marginHorizontal
const SNAP_INTERVAL = CARD_WIDTH + SEPARATOR_WIDTH;

/* -------------------------------------------------------------------------- */

type InfoCardItem = {
  id?: string | number;
  image?: string;
  title?: string;
  subTitle?: string;
  slug?: string;
  collection?: string;
  category?: { id?: string; title?: string };
};

interface Props {
  data: CarouselData[];
  onItemPress?: (item: CarouselData, index: number) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  renderItemProps?: (item: CarouselData) => Partial<React.ComponentProps<typeof InfoCard>>;
  ItemSeparatorComponent?: React.ComponentType<unknown> | null | undefined;
}

function InfoSnapCarousel({
  data,
  onItemPress,
  contentContainerStyle,
  renderItemProps,
  ItemSeparatorComponent
}: Props) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item, index) => `${item?.id ?? index}`}
      showsHorizontalScrollIndicator={false}
      /* --------------------------- SNAP MAGIC --------------------------- */
      snapToInterval={SNAP_INTERVAL}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      bounces={false}
      /* ------------------------------------------------------------------ */

      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={StyleSheet.flatten([styles.container, contentContainerStyle])}
      renderItem={({ item, index }) => (
        <InfoCard
          item={item as InfoCardItem}
          onPress={() => onItemPress?.(item, index)}
          titleStyles={styles.titleStyles}
          {...renderItemProps?.(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: actuatedNormalize(spacing.s),
    paddingBottom: spacing.xxs
  },
  separator: {
    marginHorizontal: actuatedNormalize(spacing.l)
  },
  titleStyles: {}
});

export default InfoSnapCarousel;
