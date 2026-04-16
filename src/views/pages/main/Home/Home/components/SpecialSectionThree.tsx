import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import VideosSkeleton from '@src/views/pages/main/Videos/Videos/components/VideosSkeleton';
import CustomText from '@src/views/atoms/CustomText';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { useSpecialSectionThreeViewModel } from '@src/viewModels/main/Home/Home/useSpecialSectionThreeViewModel';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import ArticleSnapCarousel from '@src/views/organisms/ArticleSnapCarousel';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

interface SpecialSectionThree {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  handleBookmarkPress: (contentId?: string) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

interface CarouselItem {
  relationTo: string;
  id: string;
  slug?: string;
  title: string;
  videoDuration?: number;
  readTime?: number;
  isBookmarked?: boolean;
  topics?: { title: string }[];
  category?: { title: string };
  publishedAt?: string;
}

const SpecialSectionThree = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}: SpecialSectionThree) => {
  const {
    principal,
    secondary,
    carousel,
    nPlusVideoSectionLoading,
    onNPlusVideoCardPress,
    data,
    refetchSpecialSectionThree
  } = useSpecialSectionThreeViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (item: CarouselItem, index?: number) => {
    // Add analytics for bookmark/unbookmark
    const isPrincipalCard = index === 0;
    const moleculeName = isPrincipalCard
      ? ANALYTICS_MOLECULES.HOME_PAGE.NEWS_PRINICPAL_CARD
      : ANALYTICS_MOLECULES.HOME_PAGE.NEWS_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_THREE,
      content_type: `${moleculeName} | ${(index ?? 0) + 1}`,
      content_title: item?.title,
      content_action: item?.isBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
      content_name: moleculeName,
      categories: item?.category?.title,
      Fecha_Publicacion_Texto: item?.publishedAt,
      opening_display_type: item?.relationTo
    });

    handleBookmarkPress(item?.id ?? '');
  };

  useEffect(() => {
    registerRefetch(() =>
      refetchSpecialSectionThree({
        section: 'section_3',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionThree]);

  if (nPlusVideoSectionLoading) {
    return <VideosSkeleton />;
  }

  if (!principal || Object.keys(principal).length === 0) {
    return null;
  }

  return (
    <View style={sectionGapStyle}>
      {principal ? (
        <View>
          <CustomText
            size={52}
            fontFamily={fonts.mongoose}
            weight="M"
            textStyles={styles.nPlusVideoTitle}
          >
            {data?.HomepageSpecialContent?.title}
          </CustomText>

          <CarouselCard
            type="videos"
            topic={principal?.category?.title}
            title={principal?.title}
            minutesAgo={formatDurationToMinutes(principal?.videoDuration)}
            imageUrl={principal?.heroImage?.sizes?.vintage?.url ?? ''}
            isBookmarked={principal?.isBookmarked}
            contentContainerStyle={styles.fullImageContainer}
            imageStyle={styles.fullNplusPrimaryImageContainer}
            titleFont={fonts.notoSerif}
            titleSize={fontSize.s}
            titleColor={theme.sectionTextTitleSpecial}
            subheadingStyles={styles.nplusVideoHeroTitle}
            onPress={() => onNPlusVideoCardPress(principal, 0, 'principal')}
            onBookmarkPress={() => handleBookmarkPressWithAnalytics(principal, 0)}
            bottomRowStyles={styles.bottomRowStyles}
            headingStyles={styles.bottomRowStyles}
            imageBelow={true}
            showPlayIcon={principal?.relationTo === 'videos'}
          />

          {secondary?.length > 0 && (
            <FlatList
              data={secondary}
              keyExtractor={(item, index) => item?.id ?? index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.carouselContainerVideo}
              renderItem={({ item, index }) => (
                <>
                  <BookmarkCard
                    category={
                      item?.topics?.[0]?.title ??
                      item?.category?.title ??
                      t('screens.storyPage.relatedStoryBlock.general')
                    }
                    heading={item?.title}
                    headingColor={theme.tagsTextAuthor}
                    subHeading={`${formatDurationToMinutes(
                      (item?.videoDuration ?? item?.readTime) || 0
                    )}`}
                    subHeadingColor={theme.tagsTextAuthor}
                    isBookmarkChecked={item?.isBookmarked}
                    id={item?.id ?? ''}
                    containerStyle={styles.bookmarkCardContainer}
                    onPressingBookmark={() =>
                      handleBookmarkPressWithAnalytics(item, (index ?? 0) + 1)
                    }
                    onPress={() => onNPlusVideoCardPress(item, (index ?? 0) + 1, 'secondary')}
                    isVideo={item?.relationTo === 'videos'}
                    textContainerStyles={styles.textContainer}
                    categoryTextStyles={styles.categoryTextStyles}
                    bookmarkContainerStyles={styles.bookmarkContainerStyles}
                  />
                </>
              )}
            />
          )}

          {carousel?.length > 0 && (
            <ArticleSnapCarousel
              data={carousel ?? []}
              onCardPress={(item) => {
                const carouselItem = item as CarouselItem;
                const index =
                  carousel?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
                if (carouselItem.slug) {
                  onNPlusVideoCardPress(carouselItem, index, 'carousel');
                }
              }}
              contentContainerStyle={styles.fullCarouselContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              cardStyle={styles.lastCard}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(SpecialSectionThree);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    nPlusVideoTitle: {
      lineHeight: lineHeight['12xl'],
      marginHorizontal: spacing.xs,
      paddingTop: spacing.xxs,
      paddingBottom: 0,
      textTransform: 'uppercase',
      marginBottom: -spacing.s
    },
    fullImageContainer: {
      width: '100%',
      marginTop: spacing.xs
    },
    fullNplusPrimaryImageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: 492,
      marginTop: spacing.xs,
      marginHorizontal: spacing.xs
    },
    nplusVideoHeroTitle: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.none,
      paddingHorizontal: spacing.xs,
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxxs
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs
    },
    verticalHeading: {
      marginTop: -2,
      lineHeight: undefined // undefined is used to remove the default line height
    },
    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: spacing.xs
    },
    verticalImageStyle: {
      width: 130,
      height: 130
    },
    fullCarouselContainer: {
      paddingLeft: spacing.xs,
      marginTop: spacing.xxs,
      marginBottom: 0
    },
    textContainer: {
      gap: 0
    },
    headingTextStyles: {
      lineHeight: lineHeight['6xl'],
      marginTop: 2
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.xs,
      marginBottom: 0,
      borderBottomWidth: borderWidth.s,
      borderTopColor: theme.dividerPrimary,
      paddingBottom: spacing.xs
    },
    lastCard: {
      borderRightWidth: 0,
      marginRight: 0
    },
    bottomRowStyles: {
      paddingHorizontal: spacing.xs,
      marginTop: undefined
    },
    verticaldivider: {
      borderBottomColor: theme.dividerBlack,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.m
    },
    categoryTextStyles: {
      marginBottom: spacing.xxxs
    },
    separator: {
      height: '86%',
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary,
      marginRight: spacing.s
    },
    bookmarkContainerStyles: {
      marginTop: 0
    }
  });
