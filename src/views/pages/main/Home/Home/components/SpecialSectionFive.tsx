import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import VideosSkeleton from '@src/views/pages/main/Videos/Videos/components/VideosSkeleton';
import CustomText from '@src/views/atoms/CustomText';
import CarouselCard from '@src/views/molecules/CarouselCard';
import CustomDivider from '@src/views/atoms/CustomDivider';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { useSpecialSectionFiveViewModel } from '@src/viewModels/main/Home/Home/useSpecialSectionFiveViewModel';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
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

interface SpecialSectionFive {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  handleBookmarkPress: (contentId?: string) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const SpecialSectionFive = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}: SpecialSectionFive) => {
  const {
    sectionTitle,
    principal,
    secondary,
    carousel,
    nPlusVideoSectionLoading,
    onNPlusVideoCardPress,
    onCategoryPress,
    refetchSpecialSectionFive,
    onPressViewAll
  } = useSpecialSectionFiveViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (
    item: CarouselItem,
    index?: number,
    itemType?: 'principal' | 'secondary' | 'carousel'
  ) => {
    // Add analytics for bookmark/unbookmark
    const isPrincipalCard = index === 0;
    const moleculeName =
      itemType === 'carousel'
        ? ANALYTICS_MOLECULES.HOME_PAGE.CARAOUSEL_VIDEOS
        : isPrincipalCard
          ? ANALYTICS_MOLECULES.HOME_PAGE.PRINCIPAL_CARD
          : ANALYTICS_MOLECULES.HOME_PAGE.SECONDARY_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_FIVE,
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
      refetchSpecialSectionFive({
        section: 'section_5'
      })
    );
  }, [registerRefetch, refetchSpecialSectionFive]);

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
            {sectionTitle ?? t('screens.videos.text.nPlusVideos')}
          </CustomText>

          <CarouselCard
            type="videos"
            topic={principal?.category?.title ?? ''}
            title={principal?.title}
            minutesAgo={formatDurationToMinutes(principal?.videoDuration)}
            imageUrl={principal?.heroImage?.url ?? ''}
            isBookmarked={principal?.isBookmarked}
            contentContainerStyle={styles.fullImageContainer}
            imageStyle={styles.fullNplusPrimaryImageContainer}
            titleFont={fonts.notoSerif}
            titleSize={fontSize.s}
            titleColor={theme.sectionTextTitleNormal}
            subheadingStyles={styles.nplusVideoHeroTitle}
            onTitlePress={() => onCategoryPress(principal?.category)}
            onPress={() => onNPlusVideoCardPress(principal, 0, 'principal')}
            onBookmarkPress={() => handleBookmarkPressWithAnalytics(principal, 0, 'principal')}
            headingStyles={styles.principalHeading}
            timeTextStyles={styles.cardDurationStyles}
          />

          {secondary?.length > 0 && (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={secondary ?? []}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.carouselContainerVideo}
              renderItem={({ item, index }) => (
                <CarouselCard
                  type="videos"
                  topic={item.topics[0]?.title ?? item?.category?.title}
                  title={item?.title}
                  minutesAgo={formatDurationToMinutes(item?.videoDuration)}
                  imageUrl={item?.heroImage?.sizes?.square?.url ?? ''}
                  isBookmarked={item?.isBookmarked}
                  headingStyles={styles.verticalHeading}
                  contentContainerStyle={styles.verticalVideoContainer}
                  imageStyle={styles.verticalImageStyle}
                  onTitlePress={() => onCategoryPress(item?.category)}
                  onPress={() => onNPlusVideoCardPress(item, (index ?? 0) + 1, 'secondary')}
                  onBookmarkPress={() =>
                    handleBookmarkPressWithAnalytics(item, (index ?? 0) + 1, 'secondary')
                  }
                  bottomRowStyles={styles.bottomRowStyles}
                />
              )}
              ItemSeparatorComponent={() => (
                <CustomDivider style={styles.verticalVideoItemSeparator} />
              )}
              ListFooterComponent={<CustomDivider style={styles.verticalVideoItemSeparator} />}
            />
          )}

          {carousel?.length > 0 && (
            <SnapCarousel
              data={carousel ?? []}
              onCardPress={(item) => {
                const carouselItem = item as CarouselItem;
                const index =
                  carousel?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
                if (carouselItem.slug) {
                  onNPlusVideoCardPress(carouselItem, index, 'carousel');
                }
              }}
              onBookmarkPress={(item) =>
                handleBookmarkPressWithAnalytics(item as CarouselItem, 0, 'carousel')
              }
              onTitlePress={(item) =>
                onCategoryPress(item?.category as { id: string; slug: string; title: string })
              }
              elementType={'videos'}
              imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
            />
          )}
          <SeeAllButton
            text={t('screens.home.text.seeMore')}
            onPress={onPressViewAll}
            color={theme.greyButtonSecondaryOutline}
            buttonStyle={styles.seeAllButton}
          />
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(SpecialSectionFive);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    nPlusVideoTitle: {
      letterSpacing: letterSpacing.xxxs,
      paddingBottom: 0,
      lineHeight: lineHeight['14xl'],
      marginHorizontal: spacing.xs,
      textTransform: 'uppercase',
      marginTop: -spacing.xs,
      marginBottom: -spacing.xxs
    },
    fullImageContainer: {
      width: '100%',
      marginBottom: spacing.m,
      paddingHorizontal: spacing.xs
    },
    fullNplusPrimaryImageContainer: {
      width: undefined, // passing undefined to width will make it take full width of parent in custom component
      height: 200
    },
    nplusVideoHeroTitle: {
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxs,
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.none
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs
    },
    verticalHeading: {
      marginTop: -spacing.xxxxs,
      lineHeight: undefined // undefined is used to remove the default line height
    },
    verticalVideoContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      flexDirection: 'row',
      columnGap: spacing.xs,
      marginHorizontal: spacing.xs
    },
    bottomRowStyles: {
      marginTop: -spacing.xxxxs
    },
    verticalImageStyle: {
      width: 130,
      height: 130
    },
    verticalVideoItemSeparator: {
      height: isIos ? 1 : 2,
      marginTop: spacing.xxs,
      marginBottom: spacing.xxs,
      backgroundColor: theme.dividerGrey
    },
    fullCarouselContainer: {
      paddingLeft: spacing.xs
    },
    principalHeading: {
      marginTop: spacing.xs
    },
    cardDurationStyles: {
      fontWeight: 'normal',
      backgroundColor: 'red'
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xxs,
      marginHorizontal: spacing.xs
    },
    seeAllButtonText: {
      lineHeight: lineHeight.s
    }
  });
