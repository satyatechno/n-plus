import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import VideosSkeleton from '@src/views/pages/main/Videos/Videos/components/VideosSkeleton';
import CustomText from '@src/views/atoms/CustomText';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { useSpecialSectionSevenViewModel } from '@src/viewModels/main/Home/Home/useSpecialSectionSevenViewModel';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import ArticleSnapCarousel from '@src/views/organisms/ArticleSnapCarousel';
import CustomDivider from '@src/views/atoms/CustomDivider';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

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

interface SpecialSectionSeven {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  handleBookmarkPress: (contentId?: string) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const SpecialSectionSeven = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch
}: SpecialSectionSeven) => {
  const {
    principal,
    secondary,
    carousel,
    nPlusVideoSectionLoading,
    onNPlusVideoCardPress,
    refetchSpecialSectionSeven,
    data
  } = useSpecialSectionSevenViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (item: CarouselItem, index?: number) => {
    // Add analytics for bookmark/unbookmark
    const isPrincipalCard = index === 0;
    const moleculeName = isPrincipalCard
      ? ANALYTICS_MOLECULES.HOME_PAGE.PRINCIPAL_CARD
      : ANALYTICS_MOLECULES.HOME_PAGE.SECONDARY_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_SEVEN,
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
      refetchSpecialSectionSeven({
        section: 'section_7',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionSeven]);

  if (nPlusVideoSectionLoading) {
    return <VideosSkeleton />;
  }

  if (!principal) {
    return null;
  }

  return (
    <View style={[{ marginBottom: spacing.xl }]}>
      {principal ? (
        <View>
          <CustomText
            size={52}
            weight="M"
            fontFamily={fonts.mongoose}
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
            titleSize={fontSize.l}
            titleColor={theme.sectionTextTitleNormal}
            subheadingStyles={styles.nplusVideoHeroTitle}
            onPress={() => onNPlusVideoCardPress(principal, 0, 'principal')}
            onBookmarkPress={() => handleBookmarkPressWithAnalytics(principal, 0)}
            bottomRowStyles={styles.bottomRowStyles}
            headingStyles={styles.headingStyles}
            showPlayIcon={principal?.relationTo === 'videos'}
          />

          <CustomDivider style={styles.divider} />

          {secondary?.length > 0 && (
            <FlatList
              data={secondary}
              keyExtractor={(item, index) => item?.id ?? index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.carouselContainerVideo}
              renderItem={({ item, index }) => (
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
                  bookmarkContainerStyles={styles.bookmarkContainer}
                  categoryTextStyles={styles.verticalHeadingTextStyles}
                  headingTextStyles={styles.bookmarkSubHeadingTextStyles}
                />
              )}
            />
          )}

          {carousel?.length > 0 && (
            <ArticleSnapCarousel
              data={carousel ?? []}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onCardPress={(item) => {
                const carouselItem = item as CarouselItem;
                const index =
                  carousel?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
                if (carouselItem.slug) {
                  onNPlusVideoCardPress(carouselItem, index, 'carousel');
                }
              }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(SpecialSectionSeven);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    nPlusVideoTitle: {
      lineHeight: lineHeight['12xl'],
      marginHorizontal: spacing.xs,
      paddingTop: spacing.xxs,
      paddingBottom: 0
    },
    fullImageContainer: {
      width: '100%'
    },
    fullNplusPrimaryImageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2, // passing undefined to width will make it take full width of parent in custom component
      height: 492,
      marginHorizontal: spacing.xs
    },
    nplusVideoHeroTitle: {
      marginTop: spacing.xxs,
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.none,
      paddingHorizontal: spacing.xs
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
    verticalVideoItemSeparator: {
      height: isIos ? 1 : 2,
      marginTop: spacing.xxs,
      marginBottom: spacing.xl,
      backgroundColor: theme.dividerGrey
    },
    fullCarouselContainer: {
      paddingLeft: spacing.xs,
      paddingBottom: spacing.m
    },
    divider: {
      borderBottomColor: theme.dividerPrimary,
      marginHorizontal: spacing.xs,
      borderBottomWidth: borderWidth.s,
      marginVertical: spacing.xxs
    },
    headingTextStyles: {
      lineHeight: lineHeight['6xl']
    },
    bookmarkSubHeadingTextStyles: {
      marginTop: spacing.xxxs
    },
    bookmarkCardContainer: {
      paddingBottom: 0,
      paddingTop: 0,
      marginHorizontal: spacing.xs
    },
    lastCard: {
      borderRightWidth: 0,
      marginRight: 0
    },
    bottomRowStyles: {
      paddingHorizontal: spacing.xs,
      marginTop: 0
    },
    headingStyles: {
      paddingHorizontal: spacing.xs
    },
    bookmarkContainer: {
      marginBottom: spacing.xs
    },
    verticalHeadingTextStyles: {},
    separator: {
      height: '86%',
      borderRightWidth: borderWidth.ss,
      borderRightColor: theme.dividerPrimary,
      marginRight: spacing.s
    }
  });
