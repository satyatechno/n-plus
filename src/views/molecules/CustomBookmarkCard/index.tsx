import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { BookMark, CheckedBookMark } from '@src/assets/icons';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import useAuthStore from '@src/zustand/auth/authStore';
import CustomImage from '@src/views/atoms/CustomImage';
import PlayCircleIcon from '@src/assets/icons/PlayCircleIcon';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { FallbackImage } from '@src/assets/images';

interface BookmarkCardProps {
  category?: string;
  heading: string;
  subHeading: string;
  id: string;
  onPressingBookmark?: (id: string, type: string, isBookmark?: boolean) => void;
  onPress?: () => void;
  isBookmarkChecked?: boolean;
  primaryColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  pressedBackgroundColor?: string;
  headingColor?: string;
  subHeadingColor?: string;
  index?: number | null;
  categoryFont?: string;
  categoryTextSize?: number;
  categoryTextStyles?: StyleProp<TextStyle>;
  headingFont?: string;
  headingTextSize?: number;
  headingTextStyles?: StyleProp<TextStyle>;
  subHeadingFont?: string;
  subHeadingTextSize?: number;
  subHeadingTextStyles?: StyleProp<TextStyle>;
  imageUrl?: string;
  onCategoryPress?: (category: string) => void;
  isVideo?: boolean;
  categoryWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  subHeadingWeightText?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  slug?: string;
  collection?: string;
  categoryId?: string;
  bookmarkContainerStyles?: StyleProp<ViewStyle>;
  textContainerStyles?: StyleProp<ViewStyle>;
}

const BookmarkCard = ({
  category,
  heading,
  subHeading,
  id,
  onPressingBookmark,
  onPress,
  isBookmarkChecked,
  primaryColor,
  headingColor,
  subHeadingColor,
  containerStyle,
  pressedBackgroundColor,
  categoryFont,
  categoryWeight = 'R',
  categoryTextSize,
  categoryTextStyles,
  headingFont,
  headingTextSize,
  headingTextStyles,
  subHeadingFont,
  subHeadingWeightText = 'M',
  subHeadingTextSize,
  subHeadingTextStyles,
  index = null,
  imageUrl,
  isVideo,
  slug,
  collection,
  categoryId,
  bookmarkContainerStyles,
  textContainerStyles
}: BookmarkCardProps) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const [isBookmark, setIsBookmark] = useState(isBookmarkChecked);
  const { guestToken } = useAuthStore();
  const [showImage, setShowImage] = useState<boolean>(!!imageUrl);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setIsBookmark(isBookmarkChecked);
  }, [isBookmarkChecked]);

  useEffect(() => {
    setShowImage(!!imageUrl);
  }, [imageUrl]);

  const handlePress = () => {
    if (categoryId === Config.OPINION_CATEGORY_ID && slug) {
      navigation.navigate(routeNames.OPINION_STACK, {
        screen: screenNames.OPINION_DETAIL_PAGE,
        params: { slug, collection }
      });
    } else {
      onPress?.();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.newsContainer,
        index === 0 && { paddingTop: 0 },
        pressed && { backgroundColor: pressedBackgroundColor ?? theme.mainBackgroundSecondary },
        containerStyle
      ]}
      onPress={handlePress}
    >
      <View style={styles.contentRow}>
        <View style={StyleSheet.flatten([styles.textContainer, textContainerStyles])}>
          <View>
            {category && (
              <CustomText
                fontFamily={categoryFont ?? fonts.superclarendon}
                size={categoryTextSize ?? fontSize.xxs}
                weight={categoryWeight}
                textStyles={StyleSheet.flatten([styles.newsTextStyles, categoryTextStyles])}
                color={primaryColor ?? theme.tagsTextCategory}
              >
                {category}
              </CustomText>
            )}
            <CustomText
              fontFamily={headingFont ?? fonts.notoSerif}
              size={headingTextSize ?? fontSize.s}
              textStyles={StyleSheet.flatten([styles.headingTextStyles, headingTextStyles])}
              color={headingColor ?? theme.newsTextTitlePrincipal}
            >
              {heading}
            </CustomText>
          </View>

          <View style={StyleSheet.flatten([styles.bookmarkContainer, bookmarkContainerStyles])}>
            <View style={styles.durationContainer}>
              {isVideo && (
                <PlayCircleIcon
                  height={24}
                  width={24}
                  color={primaryColor ?? theme.tagsTextAuthor}
                  style={styles.playIcon}
                />
              )}
              <CustomText
                fontFamily={subHeadingFont ?? fonts.franklinGothicURW}
                weight={subHeadingWeightText}
                size={subHeadingTextSize ?? fontSize.xxs}
                textStyles={StyleSheet.flatten([styles.dateTimeTextStyles, subHeadingTextStyles])}
                color={subHeadingColor ?? theme.labelsTextLabelPlay}
              >
                {subHeading + ' '} {/* [' ' is needed in some cases to avoid text cutting off] */}
              </CustomText>
            </View>
            <Pressable
              onPress={() => {
                onPressingBookmark?.(id, 'Content', !isBookmark);
                if (!guestToken) {
                  setIsBookmark(!isBookmark);
                }
              }}
            >
              {isBookmark ? (
                <CheckedBookMark color={primaryColor ?? theme.iconIconographyGenericState} />
              ) : (
                <BookMark color={primaryColor ?? theme.iconIconographyGenericState} />
              )}
            </Pressable>
          </View>
        </View>

        {!!imageUrl && showImage && (
          <CustomImage
            source={{ uri: imageUrl }}
            resizeMode="cover"
            style={styles.thumbnail}
            fallbackComponent={
              <View style={styles.fallbackImageContainerStyle}>
                <FallbackImage width={'100%'} height={'100%'} />
              </View>
            }
          />
        )}
      </View>
    </Pressable>
  );
};

export default BookmarkCard;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    newsContainer: {
      flex: 1,
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      paddingBottom: spacing.xs,
      marginBottom: spacing.xs
    },
    newsTextStyles: {
      lineHeight: lineHeight.s
    },
    contentRow: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.xs
    },
    textContainer: {
      flex: 1,
      gap: spacing.xxxs
    },
    headingTextStyles: {
      lineHeight: lineHeight.l,
      marginBottom: spacing.xxxxs,
      letterSpacing: letterSpacing.none
    },
    dateTimeTextStyles: {
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none
    },
    bookmarkContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    thumbnail: {
      width: 100,
      height: 100
    },
    categoryButton: {
      alignSelf: 'flex-start',
      height: 'auto',
      paddingVertical: 0,
      paddingHorizontal: 0
    },
    playIcon: {
      marginRight: spacing.xxxs
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    fallbackImageContainerStyle: {
      width: 100,
      height: 100,
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  });
