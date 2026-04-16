import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Animated,
  TouchableOpacity
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LandingPageCarouselSkeleton } from '@src/views/pages/main/Videos/Videos/components/LandingPageCarouselSkeleton';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, spacing, fontWeight } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import { RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { BookMark, CheckedBookMark, ShareIcon } from '@src/assets/icons';
import { formatMexicoDateOnly } from '@src/utils/dateFormatter';
import CustomImage from '@src/views/atoms/CustomImage';
import useAuthStore from '@src/zustand/auth/authStore';
import { FallbackImage, BrokenUrlImage } from '@src/assets/images';

const ITEM_WIDTH = SCREEN_WIDTH;
const ITEM_HEIGHT = (SCREEN_WIDTH * 5) / 4;
const AUTO_SCROLL_INTERVAL = 5000;

interface Author {
  name: string;
}

export interface OpinionItem {
  isBookmarked: boolean;
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  heroImages?: { url?: string; sizes?: { vintage?: { url?: string } } }[];
  authors?: Author[];
  collection?: string;
  excerpt?: string;
  fullPath?: string;
}

interface OpinionCarouselCardProps {
  data: OpinionItem[];
  loading?: boolean;
  handleBookmarkPress: (id: string) => void;
  onSharePress?: (item: OpinionItem) => void | Promise<void>;
  handleBookmarkAnalytics?: (isBookmarked: boolean, contentTitle: string, category: string) => void;
  handleTapInTextAnalytics?: (contentTitle: string, category: string) => void;
}

const OpinionCarouselCard: React.FC<OpinionCarouselCardProps> = ({
  data,
  loading,
  handleBookmarkPress,
  onSharePress,
  handleBookmarkAnalytics,
  handleTapInTextAnalytics
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [bookmarkedItems, setBookmarkedItems] = useState<{ [key: string]: boolean }>({});
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<OpinionItem>>(null);
  // Tracks items the user has manually toggled so the useEffect doesn't overwrite them
  const userToggledIds = useRef<{ [key: string]: boolean }>({});
  const progressAnim = useRef<Animated.Value[]>([]);
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { guestToken } = useAuthStore();

  // Inicializar animaciones de progreso
  useEffect(() => {
    if (!data?.length || data.length <= 1) {
      progressAnim.current = [];
      return;
    }

    if (progressAnim.current.length !== data.length) {
      progressAnim.current = Array.from(
        { length: data.length },
        (_, index) => progressAnim.current[index] || new Animated.Value(0)
      );
    }
  }, [data?.length]);

  useEffect(() => {
    if (data) {
      const next: { [key: string]: boolean } = {};
      data.forEach((item) => {
        if (userToggledIds.current[item.id] !== undefined) {
          next[item.id] = userToggledIds.current[item.id];
        } else {
          next[item.id] = item.isBookmarked || false;
        }
      });
      setBookmarkedItems(next);
    }
  }, [data]);

  const handleBookmarkToggle = useCallback(
    (itemId: string) => {
      const isCurrentlyBookmarked = bookmarkedItems[itemId];
      const item = data.find((item) => item.id === itemId);

      if (!guestToken) {
        setBookmarkedItems((prev) => {
          const newValue = !prev[itemId];
          userToggledIds.current[itemId] = newValue;
          return { ...prev, [itemId]: newValue };
        });
      }

      // Call analytics with content data
      handleBookmarkAnalytics?.(!isCurrentlyBookmarked, item?.title || '', item?.collection || '');

      handleBookmarkPress(itemId);
    },
    [guestToken, handleBookmarkPress, bookmarkedItems, handleBookmarkAnalytics, data]
  );

  const handleScrollBeginDrag = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
      setIsPaused(false);
    },
    [activeIndex]
  );

  const goToNext = useCallback(() => {
    if (!data?.length) return;

    setActiveIndex((prevIndex) => {
      const nextIndex = prevIndex < data.length - 1 ? prevIndex + 1 : 0;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true
      });
      return nextIndex;
    });
  }, [data]);

  useEffect(() => {
    if (!data || data.length <= 1 || isPaused) return;
    progressAnim.current.forEach((anim, index) => {
      if (index < activeIndex) {
        anim.setValue(1);
      } else if (index > activeIndex) {
        anim.setValue(0);
      }
    });

    const currentProgress = progressAnim.current[activeIndex];
    currentProgress.setValue(0);

    const animation = Animated.timing(currentProgress, {
      toValue: 1,
      duration: AUTO_SCROLL_INTERVAL,
      useNativeDriver: false
    });

    animation.start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });

    return () => {
      animation.stop();
    };
  }, [activeIndex, data, goToNext, isPaused]);

  const handleProgressBarPress = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        setActiveIndex(index);
        flatListRef.current?.scrollToIndex({
          index,
          animated: true
        });
      }
    },
    [activeIndex]
  );

  const hasSingleItem = data?.length === 1;

  const renderItem = useCallback(
    ({ item }: { item: OpinionItem }) => {
      const description = item?.excerpt;
      const poster = item?.heroImages?.[0]?.sizes?.vintage?.url || item?.heroImages?.[0]?.url;

      return (
        <View style={styles.itemWrapper}>
          <Pressable
            onPress={() => {
              handleTapInTextAnalytics?.(item.title || '', item.collection || '');
              navigation.navigate(routeNames.OPINION_STACK, {
                screen: screenNames.OPINION_DETAIL_PAGE,
                params: { slug: item.slug, collection: item.collection }
              });
            }}
          >
            <View style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                <CustomImage
                  source={poster ? { uri: poster } : undefined}
                  style={styles.media}
                  fallbackComponent={
                    <View style={styles.fallbackImageContainer}>
                      <FallbackImage
                        height={ITEM_HEIGHT}
                        width={'100%'}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </View>
                  }
                  errorComponent={
                    <View style={styles.brokenImageContainer}>
                      <BrokenUrlImage
                        height={ITEM_HEIGHT}
                        width={'100%'}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </View>
                  }
                />
              </View>
            </View>

            <View style={styles.textContainer}>
              {item.authors?.[0]?.name && (
                <CustomText
                  size={fontSize.s}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={styles.authorText}
                  weight="Boo"
                >
                  {item.authors?.[0]?.name}
                </CustomText>
              )}

              <CustomText
                size={fontSize.xl}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.title}
              >
                {item.title}
              </CustomText>
              {description && (
                <CustomText
                  size={fontSize.s}
                  fontFamily={fonts.notoSerif}
                  textStyles={styles.description}
                >
                  {description}
                </CustomText>
              )}
            </View>
          </Pressable>

          <View style={styles.headerContainer}>
            <CustomText
              weight="Boo"
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              color={theme.labelsTextLabelPlay}
              textStyles={styles.date}
            >
              {formatMexicoDateOnly(item.publishedAt)}
            </CustomText>

            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={() => onSharePress?.(item)}>
                <ShareIcon color={theme.iconIconographyGenericState} />
              </Pressable>

              <Pressable style={styles.headerButton} onPress={() => handleBookmarkToggle(item.id)}>
                {bookmarkedItems[item.id] ? (
                  <CheckedBookMark color={theme.iconIconographyGenericState} />
                ) : (
                  <BookMark color={theme.iconIconographyGenericState} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [
      bookmarkedItems,
      handleBookmarkToggle,
      hasSingleItem,
      navigation,
      onSharePress,
      styles,
      theme.iconIconographyGenericState,
      theme.labelsTextLabelPlay,
      handleTapInTextAnalytics
    ]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<OpinionItem> | null | undefined, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index
    }),
    []
  );

  if (loading) return <LandingPageCarouselSkeleton />;
  if (!data) return null;

  return (
    <View>
      <View style={styles.carouselContainer}>
        {/* Barras de progreso */}
        {data.length > 1 && (
          <View style={styles.progressBarContainer}>
            {data.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={styles.progressBarWrapper}
                onPress={() => handleProgressBarPress(index)}
                activeOpacity={0.8}
              >
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressAnim.current[index]
                          ? progressAnim.current[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            })
                          : '0%'
                      }
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <FlatList
          ref={flatListRef}
          data={data}
          extraData={bookmarkedItems}
          horizontal
          pagingEnabled
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews
          updateCellsBatchingPeriod={50}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          getItemLayout={getItemLayout}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />
      </View>
      <View style={styles.separator} />
    </View>
  );
};

export default OpinionCarouselCard;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    carouselContainer: {
      position: 'relative'
    },
    progressBarContainer: {
      position: 'absolute',
      top: spacing.xs,
      left: spacing.xs,
      right: spacing.xs,
      flexDirection: 'row',
      zIndex: 100,
      gap: 4,
      paddingLeft: spacing.xxs,
      paddingRight: spacing.xxs
    },
    progressBarWrapper: {
      flex: 1,
      height: 3
    },
    progressBarBackground: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 2,
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 2
    },
    itemWrapper: {
      marginBottom: 0
    },
    itemContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    imageContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingInline: spacing.xs,
      backgroundColor: theme.mainBackgroundDefault
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
    textContainer: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.xs,
      width: ITEM_WIDTH - spacing.xs * 2
    },
    title: {
      lineHeight: lineHeight['4xl'],
      color: theme.tagsTextAuthor,
      fontWeight: fontWeight.bold,
      width: '100%'
    },
    description: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxs,
      width: '100%'
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dot: {
      width: spacing.xxx,
      height: spacing.xxx,
      borderRadius: 6,
      marginHorizontal: 3,
      borderColor: theme.iconIconographyGenericState,
      borderWidth: borderWidth.m
    },
    activeDot: {
      backgroundColor: theme.iconIconographyGenericState
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerButton: {
      padding: spacing.xxxs
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      marginTop: spacing.xxxxs,
      marginBottom: spacing.xxs
    },
    separator: {
      marginHorizontal: spacing.xs,
      marginBottom: spacing.xs,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.tagsTextAuthor
    },
    date: {
      lineHeight: lineHeight.xs
    },
    authorText: {
      lineHeight: lineHeight.l,
      marginBottom: spacing.xxxs,
      color: theme.tagsTextAuthor
    }
  });
