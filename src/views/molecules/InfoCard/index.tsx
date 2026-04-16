import React, { useState } from 'react';
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { toUpper } from 'lodash';
import { ResizeMode } from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Config from 'react-native-config';

import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { FallbackImage } from '@src/assets/images';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { BookMark, CheckedBookMark } from '@src/assets/icons';
import CustomImage from '@src/views/atoms/CustomImage';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';

type InfoCardItem = {
  id?: string | number;
  image?: string;
  title?: string;
  subTitle?: string;
  slug?: string;
  collection?: string;
  category?: { id?: string; title?: string };
};

interface InfoCardProps {
  item: InfoCardItem;
  onPress?: (item: InfoCardItem) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  imageHeight?: number;
  imageWidth?: number;
  imageStyle?: StyleProp<ImageStyle>;
  titleColor?: string;
  titleFontFamily?: string;
  titleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  titleFontSize?: number;
  titleStyles?: TextStyle;
  subTitleColor?: string;
  subTitleFontFamily?: string;
  subTitleFontWeight?: 'R' | 'M' | 'B' | 'Med' | 'Dem' | 'Boo';
  subTitleFontSize?: number;
  subTitleStyles?: TextStyle;
  id?: string | number;
  imageUrl?: string;
  title?: string;
  subTitle?: string;
  additionalIcon?: React.ReactNode;
  upperCase?: boolean;
  isBookmark?: boolean;
  onAdditionalIconPress?: () => void;
  bookmarkIconContainerStyle?: StyleProp<ViewStyle>;
  resizeMode?: ResizeMode | undefined;
  aspectRatio?: number;
}

const InfoCard = ({
  item,
  onPress,
  contentContainerStyle,
  imageHeight,
  imageWidth,
  imageStyle,
  titleColor,
  titleFontFamily,
  titleFontWeight,
  titleFontSize,
  titleStyles,
  subTitleColor,
  subTitleFontFamily = fonts.franklinGothicURW,
  subTitleFontWeight = 'Med',
  subTitleFontSize = fontSize.xxs,
  subTitleStyles,
  id,
  imageUrl,
  title,
  subTitle,
  upperCase,
  isBookmark,
  onAdditionalIconPress,
  bookmarkIconContainerStyle,
  resizeMode,
  aspectRatio
}: InfoCardProps) => {
  const [theme] = useTheme();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(isBookmark ?? false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBookmarkToggle = () => {
    const newValue = !isBookmarked;
    setIsBookmarked(newValue);
    onAdditionalIconPress?.();
  };

  const handlePress = () => {
    if (onPress) {
      onPress(item);
      return;
    }
    if (item?.category?.id === Config.OPINION_CATEGORY_ID && item?.slug) {
      navigation.navigate(routeNames.OPINION_STACK, {
        screen: screenNames.OPINION_DETAIL_PAGE,
        params: { slug: item.slug, collection: item.collection }
      });
    }
  };

  const styles = StyleSheet.create({
    itemContainer: {
      width: imageWidth ?? 0
    },
    imageContainerStyle: {
      width: '100%',
      height: imageHeight ? imageHeight : 'auto',
      aspectRatio: aspectRatio ?? aspectRatio,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    image: {
      height: '100%',
      width: '100%'
    },
    title: {
      marginTop: spacing.xs,
      lineHeight: lineHeight['8xl'],
      marginRight: spacing.xs
    },
    bookmarkIconContainer: {
      position: 'absolute',
      right: 0,
      bottom: spacing.s
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

  return (
    <Pressable
      key={id}
      style={StyleSheet.flatten([styles.itemContainer, contentContainerStyle])}
      onPress={handlePress}
    >
      <View
        style={StyleSheet.flatten([
          styles.imageContainerStyle,
          { backgroundColor: !imageUrl ? theme.toggleIcongraphyDisabledState : undefined },
          imageStyle
        ])}
      >
        {!imageUrl ? (
          <View style={styles.fallbackImageContainerStyle}>
            <FallbackImage width="100%" height="103%" preserveAspectRatio="xMidYMid slice" />
          </View>
        ) : (
          <CustomImage
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode={resizeMode ?? 'stretch'}
            fallbackComponent={
              <View style={styles.fallbackImageContainerStyle}>
                <FallbackImage width="100%" height="103%" preserveAspectRatio="xMidYMid slice" />
              </View>
            }
          />
        )}
      </View>

      {title && (
        <CustomText
          fontFamily={titleFontFamily}
          size={titleFontSize}
          weight={titleFontWeight}
          color={titleColor}
          textStyles={StyleSheet.flatten([styles.title, titleStyles ?? {}])}
        >
          {upperCase ? toUpper(title) : title || ''}
        </CustomText>
      )}

      {subTitle && (
        <CustomText
          fontFamily={subTitleFontFamily}
          size={subTitleFontSize}
          weight={subTitleFontWeight}
          color={subTitleColor}
          textStyles={[subTitleStyles ?? {}]}
        >
          {subTitle || ''}
        </CustomText>
      )}

      {onAdditionalIconPress && (
        <Pressable
          style={StyleSheet.flatten([bookmarkIconContainerStyle ?? styles.bookmarkIconContainer])}
          onPress={handleBookmarkToggle}
        >
          {isBookmarked ? (
            <CheckedBookMark color={theme.iconIconographyGenericState} />
          ) : (
            <BookMark color={theme.iconIconographyGenericState} />
          )}
        </Pressable>
      )}
    </Pressable>
  );
};

export default InfoCard;
