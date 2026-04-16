import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { ResizeMode } from 'react-native-fast-image';

import { ArrowIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import InfoCard from '@src/views/molecules/InfoCard';

export interface HorizontalInfoItem {
  id?: string | number;
  slug?: string;
  heroImage?: {
    url: string;
  };
  heroImages?: [
    {
      url: string;
    }
  ];
  specialImage?: {
    url: string;
  };
  title?: string;
  schedule?: string;
  fullPath?: string;
  interactiveUrl?: string;
}

interface HorizontalInfoListProps<T extends HorizontalInfoItem> {
  heading?: string;
  data: T[];
  onPress?: (item: T) => void;
  imageWidth?: number;
  titleFontSize?: number;
  titleFontFamily?: string;
  titleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  titleColor?: string;
  headingFontSize?: number;
  headingFontFamily?: string;
  headingFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyles?: TextStyle;
  imageStyle?: StyleProp<ImageStyle> | undefined;
  subTitleColor?: string;
  subTitleFontFamily?: string | undefined;
  subTitleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  subTitleFontSize?: number | undefined;
  subTitleStyles?: TextStyle;
  onSeeAllPress?: () => void;
  seeAllText?: string | undefined;
  headingStyles?: StyleProp<TextStyle>;
  seeAllColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  seeAllButtonStyles?: StyleProp<TextStyle>;
  upperCase?: boolean;
  listRef?: React.RefObject<FlatList | null>;
  getImageUrl?: (item: T) => string;
  resizeMode?: ResizeMode | undefined;
  listContentContainerStyle?: StyleProp<ViewStyle>;
  aspectRatio?: number;
}

function HorizontalInfoList<T extends HorizontalInfoItem>({
  heading,
  data,
  onPress,
  imageWidth = 156,
  titleFontSize = fontSize['10xl'],
  titleFontFamily = fonts.mongoose,
  titleFontWeight = 'M',
  titleColor,
  headingFontSize = fontSize['4xl'],
  headingFontFamily = fonts.notoSerif,
  headingFontWeight = 'R',
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
  headingStyles,
  seeAllColor,
  containerStyle,
  seeAllButtonStyles,
  upperCase = false,
  listRef,
  getImageUrl,
  resizeMode,
  listContentContainerStyle,
  aspectRatio
}: HorizontalInfoListProps<T>) {
  const [theme] = useTheme();

  const styles = StyleSheet.create({
    heading: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl']),
      borderBottomWidth: 1,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      borderBottomColor: theme.iconIconographyGenericState
    },
    itemContainer: {
      width: actuatedNormalize(imageWidth)
    },
    title: {
      marginTop: actuatedNormalizeVertical(spacing.s),
      lineHeight: actuatedNormalizeVertical(lineHeight['8xl']),
      width: '90%'
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    seeAllText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    }
  });

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
        keyExtractor={(item, index) => {
          const idKey = item?.id !== undefined && item?.id !== null ? String(item.id) : undefined;
          const slugKey = item?.slug;
          const titleKey = item?.title ? `${item.title}-${index}` : `item-${index}`;
          return idKey ?? slugKey ?? titleKey;
        }}
        renderItem={({ item }) => (
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
            onPress={() => onPress?.(item)}
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
        )}
        contentContainerStyle={StyleSheet.flatten([
          {
            justifyContent: 'space-between',
            gap: actuatedNormalize(spacing.xs),
            paddingLeft: actuatedNormalize(spacing.xs),
            paddingRight: actuatedNormalize(spacing.xs)
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
                {seeAllText}
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

export default HorizontalInfoList;
