import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';

import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage } from '@src/assets/images';
import { useTranslation } from 'react-i18next';
import { logSelectContentEvent } from '@src/utils/storyAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';

interface StoryData {
  id?: string;
  title?: string;
  fullPath?: string;
  openingType?: string;
  displayType?: string;
  category?: {
    id?: string;
    title?: string;
  };
  provinces?: Array<{
    id?: string;
    title?: string;
  }>;
  topics?: Array<{
    id?: string;
    title?: string;
  }>;
  channel?: {
    id?: string;
    title?: string;
  };
  production?: {
    id?: string;
    title?: string;
  };
}

interface CarouselProps {
  customTheme?: 'light' | 'dark';
  images: {
    id: string;
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    sizes?: {
      vintage?: {
        url?: string;
      };
    };
  }[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  captionTextStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  story?: StoryData;
  currentSlug?: string;
  previousSlug?: string;
  screenName?: string;
  tipoContenido?: string;
  pageType?: 'story' | 'shortInvestigation' | 'opinion';
  contentAction?: string;
}

interface CarouselItem {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  customTheme?: 'light' | 'dark';
  sizes?: {
    vintage?: {
      url?: string;
    };
  };
}

const HeroMediaCarousel: React.FC<CarouselProps> = ({
  images,
  contentContainerStyle,
  captionTextStyle,
  customTheme,
  story,
  currentSlug,
  previousSlug,
  screenName,
  tipoContenido,
  pageType = 'story',
  contentAction
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  const { t } = useTranslation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slideIndex !== activeIndex) {
      setActiveIndex(slideIndex);

      if (story && images[slideIndex]) {
        const imageCaption = images[slideIndex]?.caption || `Image ${slideIndex + 1}`;
        const contentName = imageCaption.substring(0, 100);

        // Use appropriate analytics constants based on pageType
        const organism =
          pageType === 'shortInvestigation' || pageType === 'opinion'
            ? ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.HERO_MEDIA_CAROUSEL
            : ANALYTICS_ORGANISMS.STORY_PAGE.HERO;

        const molecule =
          pageType === 'shortInvestigation' || pageType === 'opinion'
            ? `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.HERO_MEDIA_CAROUSEL.BASE_NAME}${slideIndex + 1}`
            : `${ANALYTICS_MOLECULES.STORY_PAGE.HERO_MEDIA_CAROUSEL.BASE_NAME}${slideIndex + 1}`;

        logSelectContentEvent(story, {
          organism,
          molecule,
          contentName,
          currentSlug: currentSlug || 'undefined',
          previousSlug: previousSlug || 'undefined',
          screenName,
          tipoContenido,
          contentAction: contentAction || 'undefined'
        });
      }
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => {
    const aspectRatio = 4 / 5;
    const imageUrl = item.sizes?.vintage?.url || item.url;

    return (
      <View style={styles.imageContainer}>
        <CustomImage
          source={imageUrl ? { uri: imageUrl } : undefined}
          style={[styles.image, { aspectRatio }]}
          resizeMode="cover"
          fallbackComponent={
            <View style={styles.fallbackImageContainerStyle}>
              <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </View>
          }
        />
      </View>
    );
  };

  if (!images?.length) return null;

  return (
    <View style={StyleSheet.flatten([styles.flatlistView, contentContainerStyle])}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={images.length > 1 ? true : false}
        onScroll={handleScroll}
        ref={flatListRef}
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        disableIntervalMomentum={true}
        snapToOffsets={images.map((_, index) => index * SCREEN_WIDTH)}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index
        })}
      />
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={StyleSheet.flatten([styles.dot, index === activeIndex && styles.activeDot])}
            />
          ))}
        </View>
      )}
      <View>
        <CustomText
          weight="Boo"
          fontFamily={fonts.franklinGothicURW}
          textStyles={StyleSheet.flatten([styles.imageTitle, captionTextStyle])}
          size={fontSize.xxs}
        >
          {images[activeIndex]?.caption || t('screens.storyPage.heroMediaCarousel.caption')}
        </CustomText>
      </View>
    </View>
  );
};

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    imageContainer: {
      width: SCREEN_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12
    },
    image: {
      width: '100%',
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    flatlistView: {
      marginTop: spacing.xx
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.xxs
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: radius.xxs,
      marginHorizontal: spacing.xxxs,
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.m
    },
    activeDot: {
      backgroundColor: theme.iconIconographyGenericState
    },
    imageTitle: {
      color: theme.labelsTextLabelPlace,
      lineHeight: lineHeight.m,
      marginHorizontal: spacing.xs,
      marginTop: spacing.xxs
    }
  });

export default HeroMediaCarousel;
