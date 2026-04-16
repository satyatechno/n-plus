import React, { useMemo, useState, useCallback } from 'react';
import { View, Pressable, StyleSheet, Share, Alert } from 'react-native';

import { Canvas, Image, useImage } from '@shopify/react-native-skia';

import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing, letterSpacing } from '@src/config/styleConsts';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { FallbackImage, BrokenUrlImage } from '@src/assets/images';

import { RNSocialVideoPlayer } from '@src/views/organisms/RNVideo';

interface CarouselHeroCardItem {
  slug?: string;
  heroImage?: { url: string };
  id: string;
  title: string;
  uri: string;
  type: 'gif' | 'image' | 'video';
  aspectRatio?: number | string;
  excerpt?: string;
}

interface CarouselHeroCardProps {
  item: CarouselHeroCardItem;
  onPress: () => void;

  theme: AppTheme;
  width?: number;

  isActive?: boolean;
  autoStart?: boolean;
}

const CarouselHeroCard: React.FC<CarouselHeroCardProps> = ({
  item,
  onPress,
  theme,
  width = SCREEN_WIDTH,
  isActive = true,
  autoStart = true
}) => {
  const parsedAspectRatio = useMemo(() => {
    let originalRatio = 16 / 9;

    if (typeof item.aspectRatio === 'number') {
      originalRatio = item.aspectRatio;
    } else if (typeof item.aspectRatio === 'string' && item.aspectRatio.includes('/')) {
      const [w, h] = item.aspectRatio.split('/');
      const parsedW = parseInt(w, 10);
      const parsedH = parseInt(h, 10);
      if (!isNaN(parsedW) && !isNaN(parsedH) && parsedH !== 0) {
        originalRatio = parsedW / parsedH;
      }
    }

    const is16by9 = Math.abs(originalRatio - 16 / 9) < 0.05;
    if (is16by9) {
      return originalRatio;
    }

    return 4 / 5;
  }, [item.aspectRatio]);

  const innerWidth = width - spacing.xs * 2;
  const mediaHeight = innerWidth / parsedAspectRatio;

  const styles = useMemo(() => themeStyles(theme, width, mediaHeight), [theme, width, mediaHeight]);

  const [showSkiaCanvas, setShowSkiaCanvas] = useState<boolean>(true);

  const imageUrl = useMemo(() => item?.heroImage?.url || null, [item?.heroImage]);

  const image = useImage(imageUrl || undefined, () => {
    setShowSkiaCanvas(false);
  });

  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: item.title,
        url: item.uri || item.slug,
        title: item.title
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  }, [item]);

  if (!item || !item.id) {
    return null;
  }

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={onPress} style={styles.pressableContainer}>
        <View style={styles.titleContainer}>
          <CustomText
            weight="M"
            fontFamily={fonts.mongoose}
            size={fontSize['10xl']}
            textStyles={styles.title}
          >
            {item.title.toUpperCase()}
          </CustomText>

          {item.excerpt && (
            <CustomText fontFamily={fonts.notoSerif} size={fontSize.s} textStyles={styles.subtitle}>
              {item.excerpt}
            </CustomText>
          )}
        </View>

        <View style={styles.imageContainer}>
          {item.type === 'video' ? (
            <RNSocialVideoPlayer
              videoUrl={item.uri ?? ''}
              aspectRatio={parsedAspectRatio}
              thumbnail={imageUrl || undefined}
              isActive={isActive}
              autoStart={autoStart}
              isMutedProp={true}
              onSharePress={handleShare}
            />
          ) : imageUrl && showSkiaCanvas ? (
            <Canvas style={{ width: innerWidth, height: mediaHeight }}>
              <Image
                image={image}
                x={0}
                y={0}
                width={innerWidth}
                height={mediaHeight}
                fit="cover"
              />
            </Canvas>
          ) : (
            <CustomImage
              source={imageUrl ? { uri: imageUrl } : undefined}
              style={styles.media}
              fallbackComponent={
                <View style={styles.fallbackImageContainer}>
                  <FallbackImage
                    height={mediaHeight}
                    width={'100%'}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </View>
              }
              errorComponent={
                <View style={styles.brokenImageContainer}>
                  <BrokenUrlImage
                    height={mediaHeight}
                    width={'100%'}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </View>
              }
            />
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default CarouselHeroCard;

const themeStyles = (theme: AppTheme, width: number, height: number) =>
  StyleSheet.create({
    cardContainer: {
      width: width,
      position: 'relative',
      marginBottom: spacing.xl
    },
    pressableContainer: {
      width: '100%'
    },
    imageContainer: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xs
    },
    media: {
      width: '100%',
      height: '100%'
    },
    fallbackImageContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      justifyContent: 'center',
      alignItems: 'center'
    },
    brokenImageContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.toggleIcongraphyDisabledState,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleContainer: {
      marginHorizontal: spacing.xs,
      marginBottom: spacing.xxs
    },
    title: {
      paddingTop: spacing.xxs,
      lineHeight: lineHeight['10xl'],
      letterSpacing: letterSpacing.xxs,
      color: theme.newsTextHorizontalVideoTitle
    },
    subtitle: {
      lineHeight: lineHeight.l,
      color: theme.newsTextHorizontalVideoTitle
    }
  });
