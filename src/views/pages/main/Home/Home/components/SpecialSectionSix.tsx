import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import { AppTheme } from '@src/themes/theme';
import useSpecialSectionSixViewModel from '@src/viewModels/main/Home/Home/useSpecialSectionSixViewModel';
import SnapCarousel from '@src/views/organisms/SnapCarousel';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import SpecialSectionSixSkeleton from '@src/views/pages/main/Home/Home/components/SpecialSectionSixSkeleton';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
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

interface SpecialSectionSixProps {
  handleBookmarkPress: (id: string) => void;
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const SpecialSectionSix = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}: SpecialSectionSixProps) => {
  const { data, loading, onCardPress, handleSeeAllPress, refetchSpecialSectionSix } =
    useSpecialSectionSixViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (item: CarouselItem, index?: number) => {
    // Add analytics for bookmark/unbookmark
    // Special Section 6 has only one type of card (combined carousel)
    const moleculeName = ANALYTICS_MOLECULES.HOME_PAGE.SECONDARY_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.SPECIAL_SECTION_SIX,
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

  const combinedData = useMemo(() => {
    const principal = data?.HomepageSpecialContent?.principal ?? [];
    const secondary = data?.HomepageSpecialContent?.secondary ?? [];

    return [...principal, ...secondary];
  }, [data]);

  useEffect(() => {
    registerRefetch(() =>
      refetchSpecialSectionSix({
        section: 'section_6',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionSix]);

  if (loading) {
    return <SpecialSectionSixSkeleton />;
  }

  if (!data || combinedData.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, sectionGapStyle]}>
      <View>
        {data?.HomepageSpecialContent?.title && (
          <CustomText
            fontFamily={fonts.mongoose}
            size={52}
            weight="M"
            textStyles={styles.textStyles}
          >
            {data?.HomepageSpecialContent?.title.toUpperCase()}
          </CustomText>
        )}

        {data?.HomepageSpecialContent?.subtitle && (
          <CustomText
            fontFamily={fonts.notoSerif}
            size={fontSize.l}
            textStyles={styles.subTitleTextStyles}
          >
            {data?.HomepageSpecialContent?.subtitle}
          </CustomText>
        )}

        {combinedData.length > 0 && (
          <SnapCarousel
            elementType={'videos'}
            data={combinedData ?? []}
            onCardPress={(item: unknown) => {
              const carouselItem = item as CarouselItem;
              const index =
                combinedData?.findIndex((c: CarouselItem) => c.id === carouselItem.id) ?? 0;
              if (carouselItem.slug) {
                onCardPress(carouselItem, index);
              }
            }}
            onBookmarkPress={(item) =>
              handleBookmarkPressWithAnalytics(
                item as CarouselItem,
                combinedData?.findIndex((c: CarouselItem) => c.id === item.id) ?? 0
              )
            }
            getVideoDuration={(item) =>
              item?.relationTo === 'videos'
                ? formatDurationToMinutes(item?.videoDuration || 1)
                : `${item?.readTime} min`
            }
            isShowPlayIcon={(item) => (item?.relationTo === 'videos' ? true : false)}
            bottomRowStyles={styles.bottomRowStyles}
            iconColor={theme.mainBackgrunforproductionPage}
            timeTextStyles={styles.bookmarkStyles}
            headingStyles={styles.headingStyles}
            subHeadingStyles={styles.subheadingStyles}
            showBookmark={false}
            imageStyle={{ aspectRatio: 16 / 9, height: 'auto' }}
          />
        )}

        <SeeAllButton
          text={t('screens.home.text.seeMore')}
          onPress={() => handleSeeAllPress(data?.HomepageSpecialContent?.title)}
          color={theme.mainBackgrunforproductionPage}
          buttonStyle={styles.seeAllButtonStyles}
          textStyle={styles.seeAllText}
          hitSlop={10}
        />
      </View>
    </View>
  );
};

export default React.memo(SpecialSectionSix);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fullCarouselContainer: {
      paddingLeft: spacing.xs,
      marginTop: spacing['2xl']
    },
    textStyles: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.l,
      color: theme.mainBackgrunforproductionPage,
      lineHeight: lineHeight['12xl']
    },
    subTitleTextStyles: {
      lineHeight: lineHeight['2xl'],
      marginHorizontal: spacing.xs,
      color: theme.mainBackgrunforproductionPage
    },
    container: {
      backgroundColor: theme.sectionTextOther,
      flex: 1,
      paddingBottom: spacing.s
    },
    seeAllText: {
      lineHeight: lineHeight.s,
      color: theme.mainBackgrunforproductionPage,
      top: spacing.xxxxs
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xs,
      marginHorizontal: spacing.xs
    },
    headingStyles: {
      color: theme.filledButtonPrimary
    },
    subheadingStyles: {
      marginTop: spacing.xxxs,
      marginBottom: spacing.xxxs,
      color: theme.mainBackgrunforproductionPage
    },
    bookmarkStyles: {
      marginTop: 0
    },
    bottomRowStyles: {}
  });
