import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';

import { ResizeMode } from 'react-native-fast-image';

import { ArrowIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import InfoCard from '@src/views/molecules/InfoCard';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface SnapHorizontalListItem {
  id?: string | number;
  slug?: string;
  heroImage?: { url: string };
  heroImages?: { url: string }[];
  specialImage?: { url: string };
  title?: string;
  schedule?: string;
}

interface SnapHorizontalListProps<T extends SnapHorizontalListItem> {
  heading?: string;
  data: T[];
  onPress?: (item: T, index?: number) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  imageHeight?: number;
  imageWidth?: number;

  titleFontSize?: number;
  titleFontFamily?: string;
  titleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  titleColor?: string;

  headingFontSize?: number;
  headingFontFamily?: string;
  headingFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  headingStyles?: StyleProp<TextStyle>;
  headingUpperCase?: boolean;

  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyles?: TextStyle;
  imageStyle?: StyleProp<ImageStyle>;

  subTitleColor?: string;
  subTitleFontFamily?: string;
  subTitleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  subTitleFontSize?: number;
  subTitleStyles?: TextStyle;

  onSeeAllPress?: () => void;
  seeAllText?: string;
  seeAllColor?: string;
  seeAllButtonStyles?: StyleProp<TextStyle>;

  containerStyle?: StyleProp<ViewStyle>;
  upperCase?: boolean;

  listRef?: React.RefObject<FlatList | null>;
  getImageUrl?: (item: T) => string;
  resizeMode?: ResizeMode;
  listContentContainerStyle?: StyleProp<ViewStyle>;
  extraGap?: number; // @deprecated, use itemSpacing instead
  itemSpacing?: number;
  aspectRatio?: number;
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function SnapHorizontalList<T extends SnapHorizontalListItem>({
  heading,
  data,
  onPress,
  onScroll,

  onMomentumScrollEnd,

  imageWidth = 156,

  titleFontSize = fontSize['10xl'],
  titleFontFamily = fonts.mongoose,
  titleFontWeight = 'M',
  titleColor,

  headingFontSize = fontSize['10xl'],
  headingFontFamily = fonts.mongoose,
  headingFontWeight = 'M',
  headingStyles,
  headingUpperCase = true,

  contentContainerStyle,
  titleStyles,
  imageStyle,

  subTitleColor,
  subTitleFontFamily = fonts.franklinGothicURW,
  subTitleFontWeight,
  subTitleFontSize = fontSize.xxs,
  subTitleStyles,

  onSeeAllPress,
  seeAllText,
  seeAllColor,
  seeAllButtonStyles,

  containerStyle,
  upperCase = false,

  listRef,
  getImageUrl,
  resizeMode,
  listContentContainerStyle,
  extraGap,
  itemSpacing,
  aspectRatio
}: SnapHorizontalListProps<T>) {
  const [theme] = useTheme();

  /* ---------------------------- SNAP CONFIG ---------------------------- */

  const ITEM_WIDTH = imageWidth;
  const ITEM_SPACING = itemSpacing ?? extraGap ?? spacing.xs; // Support legacy extraGap while transitioning
  const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

  /* ------------------------------- STYLES ------------------------------ */

  const styles = StyleSheet.create({
    heading: {
      lineHeight: lineHeight['10xl'],
      borderBottomWidth: 0,
      marginBottom: spacing.xs,
      paddingBottom: 0,
      borderBottomColor: theme.iconIconographyGenericState,
      textTransform: headingUpperCase ? 'uppercase' : 'none'
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.s,
      marginHorizontal: spacing.xs
    },
    seeAllText: {
      lineHeight: lineHeight.s
    }
  });

  /* ------------------------------- RENDER ------------------------------ */

  return (
    <View style={StyleSheet.flatten(containerStyle)}>
      {heading && (
        <CustomText
          fontFamily={headingFontFamily}
          size={headingFontSize}
          weight={headingFontWeight}
          textStyles={[styles.heading, headingStyles as TextStyle]}
        >
          {heading}
        </CustomText>
      )}

      <FlatList
        ref={listRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
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

        keyExtractor={(item, index) => {
          const idKey = item?.id != null ? String(item.id) : undefined;
          const slugKey = item?.slug;
          return idKey ?? slugKey ?? `item-${index}`;
        }}
        renderItem={({ item, index }) => (
          <View>
            <InfoCard
              item={item}
              id={item?.id}
              imageUrl={
                getImageUrl
                  ? getImageUrl(item)
                  : (item?.specialImage?.url ??
                    item?.heroImage?.url ??
                    item?.heroImages?.[0]?.url ??
                    '')
              }
              title={item.title}
              subTitle={item?.schedule}
              onPress={() => onPress?.(item, index)}
              imageWidth={imageWidth}
              titleFontFamily={titleFontFamily}
              titleFontSize={titleFontSize}
              titleFontWeight={titleFontWeight}
              titleColor={titleColor}
              titleStyles={titleStyles}
              imageStyle={imageStyle}
              contentContainerStyle={contentContainerStyle}
              subTitleColor={subTitleColor}
              subTitleFontFamily={subTitleFontFamily}
              subTitleFontWeight={subTitleFontWeight}
              subTitleFontSize={subTitleFontSize}
              subTitleStyles={subTitleStyles}
              upperCase={upperCase}
              resizeMode={resizeMode}
              aspectRatio={aspectRatio}
            />
          </View>
        )}
        contentContainerStyle={StyleSheet.flatten([
          {
            paddingLeft: ITEM_SPACING,
            paddingRight: ITEM_SPACING,
            gap: ITEM_SPACING
          },
          listContentContainerStyle
        ])}
      />

      {seeAllText && (
        <Pressable
          style={StyleSheet.flatten([styles.seeAllButton, seeAllButtonStyles])}
          onPress={() => onSeeAllPress?.()}
          hitSlop={10}
        >
          {({ pressed }) => (
            <>
              <CustomText
                weight={'Dem'}
                fontFamily={fonts.franklinGothicURW}
                size={fontSize.xs}
                color={pressed ? theme.adaptiveDangerSecondary : (seeAllColor ?? seeAllColor)}
                textStyles={styles.seeAllText}
              >
                {seeAllText}{' '}
                {/* Added explicit space to prevent text clipping / disappearance on some devices */}
              </CustomText>
              <ArrowIcon
                stroke={
                  pressed
                    ? theme.adaptiveDangerSecondary
                    : (seeAllColor ?? theme.greyButtonSecondaryOutline)
                }
              />
            </>
          )}
        </Pressable>
      )}
    </View>
  );
}

export default SnapHorizontalList;
