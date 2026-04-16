import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { borderWidth, lineHeight, spacing } from '@src/config/styleConsts';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { AppTheme } from '@src/themes/theme';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import ArticleSnapCarousel from '@src/views/organisms/ArticleSnapCarousel';
import SpecialSectionOneSkeleton from '@src/views/pages/main/Home/Home/components/SpecialSectionOneSkeleton';
import useSpecialSectionFourViewModel from '@src/viewModels/main/Home/Home/useSpecialSectionFourViewModel';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { isIos } from '@src/utils/platformCheck';
import { MAX_TITLE_CHARS } from '@src/config/constants';
import SpecialSectionHeroImage from '@src/views/pages/main/Home/Home/components/SpecialSectionHeroImage';
import { CarouselData } from '@src/models/main/Opinion/Opinion';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

interface SpecialSectionFourProps {
  handleBookmarkPress: (id: string) => void;
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
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

const SpecialSectionFour: React.FC<SpecialSectionFourProps> = ({
  handleBookmarkPress,
  t,
  theme,
  registerRefetch,
  sectionGapStyle
}) => {
  const { data, loading, onCategoryPress, onCardPress, refetchSpecialSectionFour } =
    useSpecialSectionFourViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (
    item: CarouselItem,
    index?: number,
    itemType?: 'principal' | 'secondary' | 'highlighted'
  ) => {
    // Add analytics for bookmark/unbookmark
    const isPrincipalCard = index === 0;
    const moleculeName =
      itemType === 'highlighted'
        ? ANALYTICS_MOLECULES.HOME_PAGE.CARD_STYLE_3
        : isPrincipalCard
          ? ANALYTICS_MOLECULES.HOME_PAGE.NEWS_PRINICPAL_CARD
          : ANALYTICS_MOLECULES.HOME_PAGE.NEWS_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_FOUR,
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
      refetchSpecialSectionFour({
        section: 'section_4',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionFour]);

  const principalItem = data?.principal[0];
  const isHighlightedTitleLong = data?.highlighted?.title?.length > MAX_TITLE_CHARS;

  return (
    <View style={sectionGapStyle}>
      {loading ? (
        <SpecialSectionOneSkeleton />
      ) : (
        <View style={styles.container}>
          <View>
            {data?.title && (
              <CustomText
                fontFamily={fonts.mongoose}
                size={52}
                weight="M"
                textStyles={styles.textStyles}
              >
                {data?.title}
              </CustomText>
            )}

            {principalItem && (
              <SpecialSectionHeroImage
                item={principalItem}
                onPress={() => onCardPress?.(principalItem, 0, 'principal')}
                onBookmarkPress={() =>
                  handleBookmarkPressWithAnalytics(principalItem, 0, 'principal')
                }
                theme={theme}
              />
            )}

            {data?.secondary?.length > 0 &&
              data.secondary.map((item: CarouselItem, index: number) => (
                <BookmarkCard
                  key={item.id ?? index.toString()}
                  category={
                    item?.topics?.[0]?.title ??
                    item?.category?.title ??
                    t('screens.storyPage.relatedStoryBlock.general')
                  }
                  heading={item?.title}
                  headingColor={theme.tagsTextAuthor}
                  subHeading={`${
                    item?.relationTo === 'videos'
                      ? formatDurationToMinutes(item?.videoDuration ?? 0)
                      : `${item?.readTime ?? 0} min`
                  }`}
                  subHeadingColor={theme.tagsTextAuthor}
                  isBookmarkChecked={item?.isBookmarked}
                  id={item?.id ?? ''}
                  containerStyle={styles.bookmarkCardContainer}
                  onPressingBookmark={() =>
                    handleBookmarkPressWithAnalytics(item, (index ?? 0) + 1, 'secondary')
                  }
                  onCategoryPress={() => onCategoryPress(item?.category)}
                  onPress={() => {
                    if (item.slug) {
                      onCardPress(item, (index ?? 0) + 1, 'secondary');
                    }
                  }}
                  isVideo={item?.relationTo === 'videos'}
                  categoryTextStyles={styles.categoryTextStyles}
                  headingTextStyles={styles.headingTextStyles}
                  bookmarkContainerStyles={styles.bookmarkContainerStyles}
                />
              ))}

            <ArticleSnapCarousel
              data={data?.carousel || []}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onCardPress={(item) => {
                const carouselItem = item as CarouselItem;
                if (carouselItem.slug && carouselItem.relationTo) {
                  const index =
                    data?.carousel?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
                  onCardPress(carouselItem, index, 'carousel');
                }
              }}
              onCategoryPress={(item: CarouselData) => onCategoryPress(item?.category)}
              contentContainerStyle={styles.containerStyle}
              cardStyle={styles.lastCard}
              durationTextStyle={styles.durationTextStyle}
            />

            {data?.highlighted && (
              <View
                style={
                  isHighlightedTitleLong
                    ? styles.carouselContainerVideoStyles
                    : styles.carouselContainerVideo
                }
              >
                <CarouselCard
                  type="videos"
                  topic={data.highlighted?.topics?.[0]?.title ?? data.highlighted?.category?.title}
                  title={data.highlighted?.title}
                  minutesAgo={formatDurationToMinutes(
                    data.highlighted?.videoDuration ?? data.highlighted?.readTime
                  )}
                  imageUrl={data.highlighted?.heroImage?.sizes?.square?.url ?? ''}
                  isBookmarked={data.highlighted?.isBookmarked}
                  headingStyles={isHighlightedTitleLong ? styles.heading : styles.verticalHeading}
                  contentContainerStyle={styles.verticalVideoContainer}
                  imageStyle={styles.verticalImageStyle}
                  onTitlePress={() => {
                    const displayedText =
                      data.highlighted?.topics?.[0]?.title ?? data.highlighted?.category?.title;
                    const isCategory = displayedText === data.highlighted?.category?.title;

                    onCategoryPress({
                      id: isCategory
                        ? data.highlighted?.category?.id
                        : data.highlighted?.topics?.[0]?.id,
                      slug: isCategory
                        ? data.highlighted?.category?.slug
                        : data.highlighted?.topics?.[0]?.slug,
                      title: displayedText,
                      type: isCategory ? 'category' : 'topic'
                    });
                  }}
                  onPress={() => onCardPress(data.highlighted, 0, 'highlighted')}
                  onBookmarkPress={() =>
                    handleBookmarkPressWithAnalytics(data.highlighted, 0, 'highlighted')
                  }
                  showPlayIcon={data.highlighted?.relationTo === 'videos' ? true : false}
                  subheadingStyles={styles.verticalSubheading}
                  bottomRowStyles={styles.bottomRowStyles}
                  iconColor={theme.mainBackgrunforproductionPage}
                  textColor={theme.mainBackgrunforproductionPage}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(SpecialSectionFour);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    textStyles: {
      lineHeight: lineHeight['12xl'],
      marginHorizontal: spacing.xs,
      textTransform: 'uppercase'
    },
    headingTextStyles: {
      marginBottom: spacing.xxxxs
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs,
      paddingBottom: 0,
      marginBottom: spacing.xs
    },
    containerStyle: {
      paddingLeft: spacing.xs
    },
    lastCard: {
      borderRightWidth: 0,
      marginRight: 0
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs,
      backgroundColor: theme.submarineGreen,
      marginTop: spacing.s
    },
    verticalHeading: {
      marginTop: -2,
      lineHeight: lineHeight.m, // 18px per Figma
      paddingTop: spacing.xxs,
      color: theme.filledButtonPrimary
    },
    verticalVideoContainer: {
      width: '100%',
      flexDirection: 'row',
      columnGap: spacing.xs,
      paddingRight: 2
    },
    verticalImageStyle: {
      width: 130,
      height: '100%',
      aspectRatio: 1 / 1
    },
    verticalSubheading: {
      color: theme.mainBackgrunforproductionPage,
      paddingRight: spacing.xs
    },
    durationTextStyle: {
      top: isIos ? 2 : 1
    },
    carouselContainerVideoStyles: {
      paddingTop: spacing.xs,
      paddingLeft: spacing.xs,
      paddingBottom: spacing.xxs,
      marginHorizontal: spacing.xs,
      backgroundColor: theme.submarineGreen,
      marginTop: spacing.s,
      marginBottom: spacing.s
    },
    heading: {
      marginTop: undefined, // undefined is used to remove the default line height,
      lineHeight: undefined, // undefined is used to remove the default line height,
      color: theme.filledButtonPrimary
    },
    categoryTextStyles: {
      marginBottom: spacing.xxxs
    },
    separator: {
      height: '80%',
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary,
      marginRight: spacing.s
    },
    bookmarkContainerStyles: {
      bottom: 0,
      paddingBottom: spacing.xs
    },
    bottomRowStyles: {
      marginTop: 0
    }
  });
