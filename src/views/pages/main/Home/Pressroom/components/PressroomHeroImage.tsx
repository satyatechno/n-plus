import React, { useMemo, useState, useCallback } from 'react';
import { View, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';

import { BackdropBlur, Canvas, Fill, Image, useImage } from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';

import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { BookMark, CheckedBookMark } from '@src/assets/icons';
import { AppTheme } from '@src/themes/theme';
import { PressroomItem } from '@src/models/main/Home/Pressroom';
import { FallbackImage, BrokenUrlImage } from '@src/assets/images';
import { formatMexicoDateOnly } from '@src/utils/dateFormatter';

const HERO_HEIGHT = actuatedNormalizeVertical(492);

interface PressroomHeroImageProps {
  item: PressroomItem;
  onPress: () => void;
  onBookmarkPress: (id: string) => void;
  isBookmarked: boolean;
  theme: AppTheme;
}

const PressroomHeroImage: React.FC<PressroomHeroImageProps> = ({
  item,
  onPress,
  onBookmarkPress,
  isBookmarked,
  theme
}) => {
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const canvasHeight = HERO_HEIGHT;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [contentY, setContentY] = useState<number>(canvasHeight);

  const imageUrl = useMemo(() => {
    if (!item?.featuredImage) return null;
    return item.featuredImage?.sizes?.vintage?.url || item.featuredImage?.url || null;
  }, [item?.featuredImage]);

  const image = useImage(imageUrl || undefined);

  const formattedDate = useMemo(() => {
    if (!item?.publishedAt) return '';
    return formatMexicoDateOnly(item.publishedAt);
  }, [item?.publishedAt]);

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

  return (
    <View style={styles.heroImageContainer}>
      <Pressable onPress={onPress} style={styles.pressableContainer}>
        {imageUrl && image ? (
          <Canvas style={{ width: SCREEN_WIDTH, height: canvasHeight }}>
            <Image
              image={image}
              x={0}
              y={0}
              width={SCREEN_WIDTH}
              height={canvasHeight}
              fit="cover"
            />
            {contentHeight > 0 && (
              <BackdropBlur
                blur={4}
                clip={{
                  x: 0,
                  y: contentY,
                  width: SCREEN_WIDTH,
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
                  width={'100%'}
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>
            }
            errorComponent={
              <View style={styles.brokenImageContainer}>
                <BrokenUrlImage
                  height={canvasHeight}
                  width={'100%'}
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
          {item?.title ? (
            <View style={styles.heroTextContainer}>
              <CustomText
                size={fontSize['6xl']}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.titleStyle}
              >
                {item.title}
              </CustomText>
            </View>
          ) : null}

          <View style={styles.infoRowWrapper}>
            <View style={styles.infoRow}>
              {formattedDate ? (
                <CustomText
                  size={fontSize.xxs}
                  fontFamily={fonts.franklinGothicURW}
                  weight="Med"
                  textStyles={styles.publishedDate}
                >
                  {formattedDate}
                </CustomText>
              ) : (
                <View style={styles.datePlaceholder} />
              )}

              <Pressable onPress={handleBookmarkPress} style={styles.bookmarkButton}>
                {isBookmarked ? (
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

export default PressroomHeroImage;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    heroImageContainer: {
      width: '100%',
      height: HERO_HEIGHT,
      position: 'relative',
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    pressableContainer: {
      width: '100%',
      height: '100%'
    },
    imageContainer: {
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
    contentWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%'
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%'
    },
    heroTextContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    titleStyle: {
      color: theme.carouselTextDarkTheme,
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl'])
    },
    infoRowWrapper: {
      width: '100%',
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.m)
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1
    },
    publishedDate: {
      color: theme.carouselTextDarkTheme,
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    bookmarkButton: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    datePlaceholder: {
      flex: 1
    }
  });
