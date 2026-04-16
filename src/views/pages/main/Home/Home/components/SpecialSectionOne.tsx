import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { ApolloQueryResult } from '@apollo/client';
import { TFunction } from 'i18next';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { borderWidth, lineHeight, spacing } from '@src/config/styleConsts';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { AppTheme } from '@src/themes/theme';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import ArticleSnapCarousel from '@src/views/organisms/ArticleSnapCarousel';
import SpecialSectionOneSkeleton from '@src/views/pages/main/Home/Home/components/SpecialSectionOneSkeleton';
import useSpecialSectionOneViewModel from '@src/viewModels/main/Home/Home/useSpecialSectionOneViewModel';
import SpecialSectionHeroImage from '@src/views/pages/main/Home/Home/components/SpecialSectionHeroImage';

interface SpecialSectionOneProps {
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

const SpecialSectionOne: React.FC<SpecialSectionOneProps> = ({
  handleBookmarkPress,
  t,
  theme,
  registerRefetch,
  sectionGapStyle
}) => {
  const { data, loading, onCategoryPress, onCardPress, refetchSpecialSectionOne } =
    useSpecialSectionOneViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const principalItem = data?.principal[0];

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
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_ONE,
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
      refetchSpecialSectionOne({
        section: 'section_1',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionOne]);

  return (
    <View style={sectionGapStyle}>
      {loading ? (
        <SpecialSectionOneSkeleton />
      ) : (
        <>
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
                onBookmarkPress={() => handleBookmarkPressWithAnalytics(principalItem, 0)}
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
                  subHeading={
                    item?.relationTo === 'videos'
                      ? String(formatDurationToMinutes(item?.videoDuration || 0))
                      : String(item?.readTime ?? 0) + ' min'
                  }
                  subHeadingColor={theme.tagsTextAuthor}
                  isBookmarkChecked={item?.isBookmarked}
                  id={item?.id ?? ''}
                  containerStyle={styles.bookmarkCardContainer}
                  onPressingBookmark={() => handleBookmarkPressWithAnalytics(item, index + 1)}
                  onCategoryPress={() => onCategoryPress(item?.category)}
                  onPress={() => {
                    if (item.slug) {
                      onCardPress(item, index, 'secondary');
                    }
                  }}
                  isVideo={item?.relationTo === 'videos'}
                  bookmarkContainerStyles={styles.bookmarkContainerStyles}
                  categoryTextStyles={styles.categoryTextStyles}
                  textContainerStyles={styles.new}
                />
              ))}

            {data?.carousel?.length > 0 && (
              <ArticleSnapCarousel
                data={data?.carousel || []}
                onCardPress={(item) => {
                  const carouselItem = item as CarouselItem;
                  const index =
                    data?.carousel?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
                  if (carouselItem.slug) {
                    onCardPress(carouselItem, index, 'carousel');
                  }
                }}
                contentContainerStyle={styles.containerStyle}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onCategoryPress={(item) =>
                  onCategoryPress(
                    item?.category as {
                      id?: string;
                      slug?: string;
                      title?: string;
                      type?: 'category' | 'topic';
                    }
                  )
                }
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default React.memo(SpecialSectionOne);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    textStyles: {
      lineHeight: 48,
      marginHorizontal: spacing.xs,
      textTransform: 'uppercase',
      marginBottom: spacing.xxxs
    },
    headingTextStyles: {
      lineHeight: lineHeight['6xl']
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs,
      paddingBottom: 0,
      paddingTop: spacing.xxs
    },
    containerStyle: {
      paddingLeft: spacing.xs,
      marginTop: spacing.xs
    },
    lastCard: {
      borderRightWidth: 0,
      marginRight: 0
    },
    bookmarkContainerStyles: {
      bottom: spacing.xs
    },
    categoryTextStyles: {
      bottom: 0
    },
    new: {
      marginBottom: -spacing.xxxs,
      marginTop: -spacing.xxs
    },
    separator: {
      height: '86%',
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary,
      marginRight: spacing.s
    }
  });
