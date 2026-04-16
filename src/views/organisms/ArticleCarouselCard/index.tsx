import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Pressable
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { FallbackImage } from '@src/assets/images';
import CustomImage from '@src/views/atoms/CustomImage';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import CustomButton from '@src/views/molecules/CustomButton';
import PlayCircleIcon from '@src/assets/icons/PlayCircleIcon';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';

interface Category {
  title?: string;
  slug?: string;
  id?: string;
}

interface HeroImage {
  url?: string;
  sizes?: {
    square?: {
      url?: string;
    };
  };
}

interface ArticleCarouselCardProps {
  item: {
    topics?: Category[];
    id?: string;
    slug?: string;
    title: string;
    readTime?: number;
    category?: Category;
    heroImages?: HeroImage[];
    publishedAt?: string;
    heroImage?: HeroImage;
    videoDuration?: number;
    collection?: string;
  };
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  categoryTextStyle?: StyleProp<TextStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  dateTextStyle?: StyleProp<TextStyle>;
  dateFormatter?: (date: string) => string;
  onCardPress?: (item: ArticleCarouselCardProps['item']) => void;
  showPublishedDate?: boolean;
  showDuration?: boolean;
  onCategoryPress?: () => void;
  isVideo?: boolean;
  durationTextStyle?: StyleProp<TextStyle>;
  hideDivider?: boolean;
  imageUrl?: string;
}

const ArticleCarouselCard: React.FC<ArticleCarouselCardProps> = ({
  item,
  containerStyle,
  imageStyle,
  contentStyle,
  categoryTextStyle,
  titleTextStyle,
  dateTextStyle,
  dateFormatter = formatMexicoDateTime,
  onCardPress,
  showPublishedDate = false,
  showDuration = false,
  onCategoryPress,
  isVideo,
  durationTextStyle,
  hideDivider = false,
  imageUrl: externalImageUrl
}) => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const publishedAt = item.publishedAt ? dateFormatter(item.publishedAt) : '';
  const imageUrl =
    externalImageUrl ||
    item?.heroImage?.sizes?.square?.url ||
    item?.heroImages?.[0]?.url ||
    item?.heroImage?.url ||
    '';

  const handlePress = () => {
    if (item.category?.id === Config.OPINION_CATEGORY_ID && item.slug) {
      navigation.navigate(routeNames.OPINION_STACK, {
        screen: screenNames.OPINION_DETAIL_PAGE,
        params: { slug: item.slug, collection: item.collection || '' }
      });
    } else {
      onCardPress?.(item);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={StyleSheet.flatten([
          hideDivider ? styles.cardWithoutBorder : styles.card,
          containerStyle
        ])}
      >
        <CustomImage
          source={{ uri: imageUrl }}
          style={StyleSheet.flatten([styles.image, imageStyle])}
          fallbackComponent={
            <View style={styles.fallbackImageContainerStyle}>
              <FallbackImage height={130} width={130} />
            </View>
          }
        />

        <View style={StyleSheet.flatten([styles.content, contentStyle])}>
          <View>
            {((item.topics && item.topics[0]?.title) || item.category?.title) && (
              <CustomButton
                variant="text"
                buttonText={item.topics?.[0]?.title || item.category?.title || ''}
                onPress={onCategoryPress}
                buttonTextSize={fontSize.xxs}
                buttonTextFontFamily={fonts.superclarendon}
                buttonTextWeight="R"
                buttonTextColor={theme.tagsTextCategory}
                buttonTextStyles={StyleSheet.flatten([styles.category, categoryTextStyle])}
                buttonStyles={styles.categoryButton}
              />
            )}

            <CustomText
              fontFamily={fonts.notoSerif}
              size={fontSize.xs}
              textStyles={StyleSheet.flatten([styles.title, titleTextStyle])}
            >
              {item.title}
            </CustomText>
          </View>

          {(isVideo || showDuration) && (item.videoDuration || item.readTime) && (
            <View style={styles.durationContainer}>
              {isVideo && (
                <PlayCircleIcon
                  height={24}
                  width={24}
                  color={theme.tagsTextAuthor}
                  style={styles.playIcon}
                />
              )}

              {showDuration && (
                <CustomText
                  weight="M"
                  size={fontSize.xxs}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.duration, durationTextStyle])}
                >
                  {item.videoDuration
                    ? formatDurationToMinutes(item.videoDuration)
                    : `${item.readTime} min`}
                </CustomText>
              )}
            </View>
          )}

          {showPublishedDate && publishedAt ? (
            <CustomText
              weight="Med"
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              textStyles={StyleSheet.flatten([styles.date, dateTextStyle])}
            >
              {typeof publishedAt === 'string'
                ? publishedAt
                : publishedAt
                  ? `${publishedAt.date} ${publishedAt.time}`
                  : ''}
            </CustomText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      width: 320,
      overflow: 'hidden',
      marginRight: spacing.xs,
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary
    },
    cardWithoutBorder: {
      flexDirection: 'row',
      width: 320,
      overflow: 'hidden',
      marginTop: spacing.xxs
    },
    image: {
      width: 130,
      height: 130
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xs,
      paddingTop: spacing.xxs,
      gap: spacing.xxxxs
    },
    category: {
      color: theme.tagsTextCategory,
      bottom: spacing.xxs
    },
    title: {
      lineHeight: lineHeight.m,
      bottom: spacing.xxxs
    },
    date: {
      lineHeight: lineHeight.m,
      color: theme.labelsTextLabelPlace
    },
    fallbackImage: { backgroundColor: theme.filledButtonPrimary },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    categoryButton: {
      alignSelf: 'flex-start',
      height: 'auto',
      paddingVertical: 0,
      paddingHorizontal: 0
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    playIcon: {
      marginRight: spacing.xxxs
    },
    duration: {
      top: 0
    }
  });

export default ArticleCarouselCard;
