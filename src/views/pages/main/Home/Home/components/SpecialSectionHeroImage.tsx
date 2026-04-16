import React, { useMemo, useState, useCallback } from 'react';
import { View, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';

import { BackdropBlur, Canvas, Fill, Image, useImage } from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';

import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import CustomButton from '@src/views/molecules/CustomButton';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { BookMark, CheckedBookMark } from '@src/assets/icons';
import PlayCircleIcon from '@src/assets/icons/PlayCircleIcon';
import { AppTheme } from '@src/themes/theme';
import { FallbackImage, BrokenUrlImage } from '@src/assets/images';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

const HERO_HEIGHT = 492;

interface CarouselItem {
  relationTo: string;
  id: string;
  slug?: string;
  title: string;
  videoDuration?: number;
  readTime?: number;
  isBookmarked?: boolean;
  category?: { title: string };
  heroImage?: {
    url: string;
    sizes?: {
      vintage?: {
        url: string;
      };
    };
  };
}

interface SpecialSectionHeroImageProps {
  item: CarouselItem;
  onPress: () => void;
  onBookmarkPress: (id: string) => void;
  theme: AppTheme;
}

const SpecialSectionHeroImage: React.FC<SpecialSectionHeroImageProps> = ({
  item,
  onPress,
  onBookmarkPress,
  theme
}) => {
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const canvasHeight = HERO_HEIGHT;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [contentY, setContentY] = useState<number>(canvasHeight);

  const imageUrl = useMemo(() => {
    if (!item?.heroImage?.sizes?.vintage?.url) return null;
    return item.heroImage.sizes.vintage.url;
  }, [item?.heroImage]);

  const image = useImage(imageUrl || undefined);

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      const measuredHeight = height;

      setContentHeight(measuredHeight);
      setContentY(canvasHeight - measuredHeight);
    },
    [canvasHeight]
  );

  const handleBookmarkPress = useCallback(() => {
    if (item?.id) {
      onBookmarkPress(item.id);
    }
  }, [item?.id, onBookmarkPress]);

  if (!item || !item.id) {
    return null;
  }
  const { isImageDownloadEnabled } = useSettingsStore();
  return (
    <View style={styles.heroImageContainer}>
      <Pressable onPress={onPress} style={styles.pressableContainer}>
        {isImageDownloadEnabled && imageUrl && image ? (
          <Canvas style={{ width: SCREEN_WIDTH, height: canvasHeight }}>
            <Image
              image={image}
              x={0}
              y={0}
              width={SCREEN_WIDTH - spacing.xs * 2}
              height={canvasHeight}
              fit="cover"
            />
            {contentHeight > 0 && (
              <BackdropBlur
                blur={4}
                clip={{
                  x: 0,
                  y: contentY,
                  width: SCREEN_WIDTH - spacing.xs * 2,
                  height: contentHeight
                }}
              >
                <Fill color="rgba(0, 0, 0, 0.5)" />
              </BackdropBlur>
            )}
          </Canvas>
        ) : (
          <CustomImage
            source={imageUrl ? { uri: imageUrl } : undefined}
            style={styles.imageContainer}
            fallbackComponent={
              <View style={styles.fallbackImageContainer}>
                <FallbackImage
                  height={canvasHeight}
                  width={SCREEN_WIDTH - spacing.xs * 2}
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>
            }
            errorComponent={
              <View style={styles.brokenImageContainer}>
                <BrokenUrlImage
                  height={canvasHeight}
                  width={SCREEN_WIDTH - spacing.xs * 2}
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>
            }
          />
        )}

        <View onLayout={handleContentLayout} style={styles.contentWrapper}>
          {contentHeight > 0 && (
            <LinearGradient
              colors={[
                theme.gradientBlack20Alpha,
                theme.gradientOverlayDark,
                theme.loaderBackground
              ]}
              locations={[0, 1, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradient, { height: contentHeight, opacity: 0.01 }]}
            />
          )}
          <View style={styles.heroTextContainer}>
            <CustomButton
              buttonText={item?.category?.title || ''}
              variant="text"
              buttonTextColor={theme.carouselTextDarkTheme}
              buttonTextFontFamily={fonts.superclarendon}
              buttonTextStyles={styles.categoryStyle}
              buttonTextSize={fontSize.xxs}
              buttonTextWeight="R"
            />

            <CustomText
              size={fontSize.s}
              fontFamily={fonts.notoSerif}
              textStyles={styles.titleStyle}
            >
              {item.title}
            </CustomText>
          </View>

          <View style={styles.infoRowWrapper}>
            <View style={styles.infoRow}>
              <View style={styles.durationContainer}>
                {item?.relationTo === 'videos' && (
                  <PlayCircleIcon
                    height={24}
                    width={24}
                    color={theme.carouselTextDarkTheme}
                    style={styles.playIcon}
                  />
                )}

                <CustomText
                  size={fontSize.xxs}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={styles.durationText}
                >
                  {formatDurationToMinutes(item?.videoDuration || item?.readTime || 0)}
                </CustomText>
              </View>
              <Pressable onPress={handleBookmarkPress} style={styles.bookmarkButton}>
                {item?.isBookmarked ? (
                  <CheckedBookMark color={theme.carouselTextDarkTheme} />
                ) : (
                  <BookMark color={theme.carouselTextDarkTheme} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default SpecialSectionHeroImage;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroImageContainer: {
      marginBottom: spacing.xs,
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: HERO_HEIGHT,
      position: 'relative',
      backgroundColor: theme.toggleIcongraphyDisabledState,
      marginHorizontal: spacing.xs
    },
    pressableContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: '100%'
    },
    imageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: '100%'
    },
    fallbackImageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      justifyContent: 'center',
      alignItems: 'center'
    },
    brokenImageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: '100%',
      backgroundColor: theme.toggleIcongraphyDisabledState,
      justifyContent: 'center',
      alignItems: 'center'
    },
    contentWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: SCREEN_WIDTH - spacing.xs * 4
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: SCREEN_WIDTH - spacing.xs * 2
    },
    heroTextContainer: {
      marginHorizontal: spacing.xs,
      marginBottom: 0,
      marginTop: spacing.l
    },
    categoryStyle: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight.s,
      top: -spacing.xxxs
    },
    titleStyle: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight.l,
      marginBottom: spacing.xxxxs
    },
    infoRowWrapper: {
      width: SCREEN_WIDTH - spacing.xl,
      paddingHorizontal: spacing.xs,
      paddingBottom: spacing.m
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1
    },
    durationText: {
      lineHeight: lineHeight.s,
      color: theme.carouselTextDarkTheme
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    playIcon: {
      marginRight: spacing.xxxs
    },
    bookmarkButton: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
