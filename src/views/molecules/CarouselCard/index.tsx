import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import CustomText from '@src/views/atoms/CustomText';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { fonts } from '@src/config/fonts';
import { FallbackImage } from '@src/assets/images';
import { PlayCircle, BookMark, CheckedBookMark } from '@src/assets/icons';
import { AppTheme } from '@src/themes/theme';
import useAuthStore from '@src/zustand/auth/authStore';
import { formatMexicoDateOnly, formatMexicoDateTime } from '@src/utils/dateFormatter';
import CustomImage from '@src/views/atoms/CustomImage';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';

interface Props {
  item?: {
    imageUrl?: string;
    type?: string;
    topic?: string;
    title?: string;
    minutesAgo?: number | string;
    isBookmarked?: boolean | null;
    publishedAt?: string;
    slug?: string;
    collection?: string;
    category?: { id?: string; title?: string };
  };
  onPress?: () => void;
  onBookmarkPress?: (isBookmark?: boolean) => void;
  headingStyles?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  type?: string;
  topic?: string;
  title?: string;
  minutesAgo?: number | string;
  imageUrl?: string;
  isBookmarked?: boolean | null;
  showBookmark?: boolean;
  hideImage?: boolean;
  subheadingStyles?: StyleProp<TextStyle>;
  iconColor?: string;
  textColor?: string;
  bottomRowStyles?: StyleProp<TextStyle>;
  titleFont?: string;
  titleWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  titleSize?: number;
  titleColor?: string;
  publishedAt?: string;
  imagePosition?: 'left' | 'right';
  subText?: string;
  showOnlyDate?: boolean;
  publishedTextStyle?: StyleProp<TextStyle>;
  onTitlePress?: () => void;
  showPlayIcon?: boolean;
  hidePlayIconOnly?: boolean;
  contentStyles?: StyleProp<ViewStyle>;
  timeTextStyles?: StyleProp<TextStyle>;
  imageBelow?: boolean;
  headingFont?: string;
  headingSize?: number;
  headingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
}

const CarouselCard = ({
  item,
  onPress,
  onBookmarkPress,
  headingStyles,
  imageStyle,
  contentContainerStyle,
  type,
  topic,
  title,
  minutesAgo,
  imageUrl,
  isBookmarked,
  showBookmark = true,
  hideImage = false,
  subheadingStyles,
  iconColor,
  textColor,
  titleFont,
  titleWeight,
  titleSize,
  titleColor,
  publishedAt,
  bottomRowStyles,
  imagePosition = 'left',
  subText,
  showOnlyDate,
  publishedTextStyle,
  onTitlePress,
  showPlayIcon = true,
  contentStyles,
  timeTextStyles,
  imageBelow = false,
  headingFont,
  headingSize,
  headingWeight,
  hidePlayIconOnly = false
}: Props) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { guestToken } = useAuthStore.getState();
  const [isBookmark, setIsBookmark] = useState<boolean>(
    item?.isBookmarked || isBookmarked || false
  );

  useEffect(() => {
    setIsBookmark(item?.isBookmarked ?? isBookmarked ?? false);
  }, [item?.isBookmarked, isBookmarked]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (onPress) {
      onPress?.();
      return;
    }
    if (item?.category?.id === Config.OPINION_CATEGORY_ID && item?.slug) {
      navigation.navigate(routeNames.OPINION_STACK, {
        screen: screenNames.OPINION_DETAIL_PAGE,
        params: { slug: item.slug, collection: item.collection }
      });
    }
  };

  const renderImage = () => {
    if (hideImage) return null;
    return (
      <CustomImage
        source={item?.imageUrl || imageUrl ? { uri: item?.imageUrl || imageUrl } : undefined}
        style={StyleSheet.flatten([styles.image, imageStyle])}
        resizeMode="cover"
        fallbackComponent={
          <View style={styles.fallbackImageContainerStyle}>
            <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>
        }
      />
    );
  };

  const finalTextColor = textColor || theme.labelsTextLabelPlay;

  const subheadingStylesWithImage = StyleSheet.flatten([styles.subheading, subheadingStyles]);

  const subheadingStylesWithoutImage = StyleSheet.flatten([
    styles.subheadingNoImage,
    subheadingStyles
  ]);
  const publishedData = showOnlyDate
    ? formatMexicoDateOnly(item?.publishedAt ?? publishedAt ?? '')
    : formatMexicoDateTime(item?.publishedAt ?? publishedAt ?? '');

  return (
    <Pressable
      style={StyleSheet.flatten([
        styles.card,
        contentContainerStyle,
        imagePosition === 'right' && styles.cardRow
      ])}
      onPress={handlePress}
    >
      {!imageBelow && imagePosition === 'left' && renderImage()}

      <View style={styles.cardContent}>
        <View style={StyleSheet.flatten([styles.content, contentStyles])}>
          {subText ? (
            <CustomText
              size={fontSize.xs}
              fontFamily={fonts.franklinGothicURW}
              weight="Boo"
              textStyles={styles.subText}
            >
              {subText}
            </CustomText>
          ) : null}
          <CustomHeading
            headingText={item?.topic || topic}
            subHeadingText={item?.title || title}
            headingColor={theme.tagsTextCategory}
            headingSize={headingSize ?? fontSize.xxs}
            headingWeight={headingWeight}
            headingFont={headingFont ?? fonts.superclarendon}
            onHeadingTextPress={onTitlePress}
            subHeadingFont={titleFont || fonts.notoSerif}
            subHeadingWeight={titleWeight || 'R'}
            subHeadingSize={titleSize || fontSize.s}
            subHeadingColor={titleColor || theme.newsTextTitlePrincipal}
            subHeadingStyles={hideImage ? subheadingStylesWithoutImage : subheadingStylesWithImage}
            headingStyles={StyleSheet.flatten([styles.heading, headingStyles])}
          />

          <View style={StyleSheet.flatten([styles.bottomRow, bottomRowStyles])}>
            {
              <View style={styles.leftInfo}>
                {showPlayIcon && (item?.type === 'videos' || type === 'videos') ? (
                  <>
                    {!hidePlayIconOnly && (
                      <PlayCircle
                        width={24}
                        height={24}
                        style={styles.playIcon}
                        color={iconColor ?? theme.iconIconographyGenericState}
                      />
                    )}
                    {item?.minutesAgo || minutesAgo ? (
                      <CustomText
                        weight="M"
                        fontFamily={fonts.franklinGothicURW}
                        size={fontSize.xxs}
                        color={iconColor ?? theme.labelsTextLabelPlay}
                        textStyles={styles.playTime}
                      >
                        {`${item?.minutesAgo || minutesAgo}`}
                      </CustomText>
                    ) : (
                      <CustomText
                        weight="Med"
                        size={fontSize.xxs}
                        fontFamily={fonts.franklinGothicURW}
                        textStyles={StyleSheet.flatten([styles.date, publishedTextStyle])}
                      >
                        {typeof publishedData === 'string'
                          ? publishedData
                          : publishedData?.date
                            ? publishedData.date
                            : ''}
                      </CustomText>
                    )}
                  </>
                ) : type === 'publishedAt' ? (
                  <CustomText
                    weight="Boo"
                    size={fontSize.xxs}
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={StyleSheet.flatten([styles.date, publishedTextStyle])}
                  >
                    {typeof publishedData === 'string'
                      ? publishedData + ' ' // ' ' is needed in some cases to avoid text cutting off
                      : publishedData?.date
                        ? publishedData.date
                        : ''}
                  </CustomText>
                ) : (
                  <CustomText
                    weight="M"
                    fontFamily={fonts.franklinGothicURW}
                    size={fontSize.xxs}
                    color={finalTextColor}
                    textStyles={StyleSheet.flatten([styles.playTime, timeTextStyles])}
                  >
                    {`${item?.minutesAgo || minutesAgo}`}
                  </CustomText>
                )}
              </View>
            }
            {showBookmark && (
              <Pressable
                style={styles.bookmarkContainer}
                onPress={() => {
                  onBookmarkPress?.(!isBookmark);

                  if (!guestToken) {
                    setIsBookmark(!isBookmark);
                    return;
                  }
                }}
              >
                {isBookmark ? (
                  <CheckedBookMark
                    color={iconColor ?? theme.iconIconographyGenericState}
                    width={24}
                    height={24}
                  />
                ) : (
                  <BookMark
                    color={iconColor ?? theme.iconIconographyGenericState}
                    width={24}
                    height={24}
                  />
                )}
              </Pressable>
            )}
          </View>
        </View>
        {imagePosition === 'right' && renderImage()}
      </View>

      {imageBelow && renderImage()}
    </Pressable>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      width: 260,
      overflow: 'hidden',
      marginRight: spacing.xs
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    image: {
      width: '100%',
      height: 146,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.toggleIcongraphyDisabledState,
      flexShrink: 0
    },
    content: {
      flex: 1
    },
    heading: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight.s,
      color: theme.tagsTextCategory
    },
    subheading: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs,
      letterSpacing: letterSpacing.s
    },
    subheadingNoImage: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs,
      letterSpacing: letterSpacing.none,
      fontSize: fontSize['2xl']
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leftInfo: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    playIcon: {
      marginRight: spacing.xxs
    },
    bookmarkContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center'
    },
    playTime: {
      top: 0
    },
    date: {
      lineHeight: lineHeight.m,
      color: theme.labelsTextLabelPlay
    },
    subText: {
      color: theme.labelsTextLabelPlay,
      lineHeight: lineHeight.m
    },
    cardContent: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.xs
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  });

export default CarouselCard;
