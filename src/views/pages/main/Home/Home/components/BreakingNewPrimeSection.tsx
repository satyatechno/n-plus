import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import CarouselCard from '@src/views/molecules/CarouselCard';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import useBreakingNewViewModel from '@src/viewModels/main/Home/Home/useBreakingNewViewModel';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

interface BreakingNewPrimeSection {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  handleBookmarkPress: (contentId?: string, eventPayload?: unknown) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const BreakingNewPrimeSection = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}: BreakingNewPrimeSection) => {
  const {
    heroData,
    secondaryData,
    heroCardDuration,
    onPressNewsDetails,
    refetchBreakingNews,
    handleBookmarkForAnalytics
  } = useBreakingNewViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  useEffect(() => {
    registerRefetch(() => refetchBreakingNews());
  }, [registerRefetch, refetchBreakingNews]);

  if (!heroData) return null;

  return (
    <View style={sectionGapStyle}>
      <CarouselCard
        type={heroData?.type == 'video' || heroData?.type == 'videos' ? 'videos' : ''}
        topic={
          heroData?.isBreaking ? t('screens.home.text.breakingNews') : heroData?.category?.title
        }
        headingFont={heroData?.isBreaking ? fonts.franklinGothicURW : fonts.superclarendon}
        headingWeight={heroData?.isBreaking ? 'Dem' : 'R'}
        headingSize={heroData?.isBreaking ? fontSize.xs : fontSize.xxs}
        title={heroData?.title}
        minutesAgo={formatDurationToMinutes(heroCardDuration ?? 0)}
        imageUrl={
          heroData?.type === 'video' || heroData?.type === 'videos'
            ? heroData?.heroImage?.sizes?.vintage?.url
            : heroData?.heroImage?.sizes?.vintage?.url
        }
        isBookmarked={heroData?.isBookmarked}
        contentContainerStyle={styles.fullImageContainer}
        imageStyle={styles.fullNplusPrimaryImageContainer}
        titleFont={fonts.mongoose}
        titleWeight="M"
        titleSize={fontSize['10xl']}
        titleColor={theme.sectionTextTitleSpecial}
        subheadingStyles={
          heroData?.isBreaking ? styles.nplusVideoHeroBreaking : styles.nplusVideoHeroTitle
        }
        onPress={() => onPressNewsDetails(heroData, true)}
        onBookmarkPress={() => handleBookmarkPress(heroData?.id, handleBookmarkForAnalytics())}
        bottomRowStyles={styles.timeView}
        headingStyles={styles.bottomRowStyles}
        imageBelow={true}
      />

      {secondaryData?.length > 0 && (
        <FlatList
          data={secondaryData}
          keyExtractor={(item, index) => item?.id ?? index.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.carouselContainerVideo}
          renderItem={({ item, index }) => {
            const duration =
              item?.type === 'video' || item?.type === 'videos'
                ? (item?.videoDuration ?? 0)
                : (item?.readTime ?? 0);
            const eventPayload = {
              idPage: item?.id,
              content_title: item.title,
              screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
              Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
              categories: item.category?.title,
              screen_page_web_url: item.slug,
              opening_display_type: `${item?.openingType ?? ''}_${item?.displayType ?? ''}`,
              organisms: ANALYTICS_ORGANISMS.HOME_PRIME_SECTION.BREAKING_NEWS,
              content_type: `${ANALYTICS_MOLECULES.HOME_PRIME_SECTION.NEWS_CARD} ${index}`,
              content_name: 'News Card'
            };
            return (
              <BookmarkCard
                category={
                  item?.topics?.[0]?.title ??
                  item?.category?.title ??
                  t('screens.storyPage.relatedStoryBlock.general')
                }
                heading={item?.title}
                headingColor={theme.sectionTextTitleNormal}
                subHeading={`${formatDurationToMinutes(duration)}`}
                subHeadingColor={theme.labelsTextLabelPlay}
                isBookmarkChecked={item?.isBookmarked}
                id={item?.id ?? ''}
                onPressingBookmark={() => handleBookmarkPress(item?.id ?? '', eventPayload)}
                onPress={() => onPressNewsDetails(item, false, index + 1)}
                isVideo={item?.type === 'video' || item?.type === 'videos'}
                textContainerStyles={styles.textContainer}
                containerStyle={styles.bookmarkCardContainer}
                categoryTextStyles={styles.categoryBox}
                bookmarkContainerStyles={styles.bookmarkBox}
              />
            );
          }}
        />
      )}
    </View>
  );
};
export default React.memo(BreakingNewPrimeSection);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fullImageContainer: {
      width: '100%'
    },
    fullNplusPrimaryImageContainer: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: SCREEN_WIDTH - spacing.xs * 2,
      marginTop: spacing.xs,
      marginHorizontal: spacing.xs
    },
    nplusVideoHeroTitle: {
      marginTop: spacing.xxxxs,
      paddingTop: spacing.xxxs,
      lineHeight: lineHeight['10xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingHorizontal: spacing.xs,
      textTransform: 'uppercase',
      marginBottom: -spacing.xxxs,
      color: theme.sectionTextTitleSpecial
    },
    nplusVideoHeroBreaking: {
      marginTop: spacing.xxxs,
      lineHeight: lineHeight['10xl'],
      letterSpacing: letterSpacing.xxxs,
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.xxs
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs
    },
    headingTextStyles: {
      lineHeight: lineHeight['6xl'],
      marginTop: spacing.xxxxs
    },
    bottomRowStyles: {
      marginTop: 0,
      paddingHorizontal: spacing.xs
    },
    timeView: {
      paddingHorizontal: spacing.xs
    },
    textContainer: {
      gap: 0
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.xs,
      marginBottom: 0,
      borderBottomWidth: borderWidth.s,
      borderTopColor: theme.dividerPrimary,
      paddingBottom: spacing.xs
    },
    categoryBox: {
      marginBottom: spacing.xxxs
    },
    bookmarkBox: {
      marginTop: 0
    }
  });
