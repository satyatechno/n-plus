import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import {
  FlatList,
  Platform,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity
} from 'react-native';

import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage } from '@src/assets/images';

interface CarouselItem {
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
}

interface CarouselProps {
  customTheme?: 'light' | 'dark';
  images: CarouselItem[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  captionTextStyle?: StyleProp<TextStyle>;
  aspectRatio?: number;
  maxImages?: number;
  defaultCaption?: string;
  progressBarActiveColor?: string;
  progressBarInactiveColor?: string;
  onSlideChange?: (index: number) => void;
}

/**
 * 0.9 on iOS (faster than 'fast') matches Android's snappier feel.
 */
const DECELERATION_RATE = Platform.OS === 'ios' ? 0.9 : 'fast';

const ProgressBarCarousel: React.FC<CarouselProps> = ({
  images,
  contentContainerStyle,
  captionTextStyle,
  customTheme,
  aspectRatio = 4 / 5,
  maxImages = 5,
  defaultCaption,
  progressBarActiveColor = '#FFFFFF',
  progressBarInactiveColor = 'rgba(255, 255, 255, 0.35)',
  onSlideChange
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme, progressBarActiveColor, progressBarInactiveColor);

  const limitedImages = useMemo(() => images?.slice(0, maxImages) || [], [images, maxImages]);

  // Reset activeIndex if images change and current index is out of bounds
  useEffect(() => {
    if (limitedImages.length > 0 && activeIndex >= limitedImages.length) {
      setActiveIndex(limitedImages.length - 1);
    }
  }, [limitedImages.length, activeIndex]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (slideIndex >= 0 && slideIndex < limitedImages.length && slideIndex !== activeIndex) {
        setActiveIndex(slideIndex);
      }
    },
    [activeIndex, limitedImages.length]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (slideIndex >= 0 && slideIndex < limitedImages.length) {
        setActiveIndex(slideIndex);
        onSlideChange?.(slideIndex);
      }
    },
    [onSlideChange, limitedImages.length]
  );

  const handleProgressBarPress = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        setActiveIndex(index);
        flatListRef.current?.scrollToIndex({
          index,
          animated: true
        });
        onSlideChange?.(index);
      }
    },
    [activeIndex, onSlideChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: CarouselItem }) => {
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
    },
    [aspectRatio, styles.imageContainer, styles.image, styles.fallbackImageContainerStyle]
  );

  const getItemLayout = useCallback(
    (data: ArrayLike<CarouselItem> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index
    }),
    []
  );

  if (!limitedImages?.length) return null;

  return (
    <View style={StyleSheet.flatten([styles.container, contentContainerStyle])}>
      <View style={styles.carouselWrapper}>
        {limitedImages.length > 1 && (
          <View style={styles.progressBarContainer}>
            {limitedImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.progressBarWrapper}
                onPress={() => handleProgressBarPress(index)}
                activeOpacity={0.8}
              >
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: index <= activeIndex ? '100%' : '0%' }
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <FlatList
          data={limitedImages}
          keyExtractor={(item, index) => item?.id || `carousel-item-${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={limitedImages.length > 1}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          ref={flatListRef}
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="start"
          decelerationRate={DECELERATION_RATE}
          bounces={false}
          removeClippedSubviews={false}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          disableIntervalMomentum={true}
          getItemLayout={getItemLayout}
        />
      </View>

      <View>
        <CustomText
          weight="Boo"
          fontFamily={fonts.franklinGothicURW}
          textStyles={StyleSheet.flatten([styles.imageTitle, captionTextStyle])}
          size={fontSize.xxs}
        >
          {limitedImages[activeIndex]?.caption || defaultCaption || ''}
        </CustomText>
      </View>
    </View>
  );
};

export const themeStyles = (
  theme: AppTheme,
  progressBarActiveColor: string,
  progressBarInactiveColor: string
) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.xx
    },
    carouselWrapper: {
      position: 'relative',
      paddingHorizontal: 12
    },
    progressBarContainer: {
      position: 'absolute',
      top: 24,
      left: 24,
      right: 24,
      height: 6,
      borderRadius: 3,
      flexDirection: 'row',
      zIndex: 100,
      gap: 6
    },
    progressBarWrapper: {
      flex: 1,
      height: 6
    },
    progressBarBackground: {
      flex: 1,
      backgroundColor: progressBarInactiveColor,
      borderRadius: 3,
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: progressBarActiveColor
    },
    imageContainer: {
      width: SCREEN_WIDTH,
      alignItems: 'center',
      justifyContent: 'center'
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
    imageTitle: {
      color: theme.labelsTextLabelPlace,
      lineHeight: lineHeight.m,
      marginHorizontal: spacing.xs,
      marginTop: spacing.xxs
    }
  });

export default ProgressBarCarousel;
