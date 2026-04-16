import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import { ApolloQueryResult } from '@apollo/client';

import useOpinionsSectionViewModel from '@src/viewModels/main/Home/Home/useOpinionsSectionViewModel';
import { AppTheme } from '@src/themes/theme';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage } from '@src/assets/images';
import CustomButton from '@src/views/molecules/CustomButton';
import { BookMark, CheckedBookMark } from '@src/assets/icons';
import PlayCircleIcon from '@src/assets/icons/PlayCircleIcon';
import CustomDivider from '@src/views/atoms/CustomDivider';
import InfoSnapCarousel from '@src/views/organisms/InfoSnapCarousel';
import OpinionsSectionSkeleton from '@src/views/pages/main/Home/Home/components/OpinionsSectionSkeleton';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
import { CarouselData, OpinionItem } from '@src/models/main/Opinion/Opinion';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_MOLECULES,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

interface OpinionSectionProps {
  handleBookmarkPress: (id: string) => void;
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const OpinionsSection: React.FC<OpinionSectionProps> = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}) => {
  const { data, loading, handleNavigationToDetailPage, handleSeeAllPress, refetchOpinions } =
    useOpinionsSectionViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const handleBookmarkPressWithAnalytics = (item: OpinionItem, isHero?: boolean) => {
    const moleculeName = isHero
      ? ANALYTICS_MOLECULES.HOME_PAGE.NEWS_PRINICPAL_CARD
      : ANALYTICS_MOLECULES.HOME_PAGE.OPINION_CAROUSEL_CARD;

    logSelectContentEvent({
      screen_page_web_url: item?.slug || 'undefined',
      idPage: item?.id || 'undefined',
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.OPINION_SECTION,
      content_type: `${moleculeName} | ${isHero ? 1 : 'carousel'}`,
      content_title: item?.title || 'undefined',
      content_action: item?.isBookmarked ? ANALYTICS_ATOMS.UNBOOKMARK : ANALYTICS_ATOMS.BOOKMARK,
      content_name: moleculeName,
      categories: 'undefined',
      Fecha_Publicacion_Texto: 'undefined',
      etiquetas: 'undefined'
    });

    handleBookmarkPress(item?.id ?? '');
  };

  useEffect(() => {
    registerRefetch(() =>
      refetchOpinions({
        section: 'section_4',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchOpinions]);

  if (loading) {
    return <OpinionsSectionSkeleton />;
  }

  if (!data?.HomepageOpinion || data.HomepageOpinion.length === 0) {
    return null;
  }

  const heroItem = data?.HomepageOpinion?.find?.((item: { isHero: string }) => item.isHero);
  const heroImageUrl = heroItem?.heroImage?.sizes?.vintage?.url ?? null;

  return (
    <View style={[styles.container, sectionGapStyle]}>
      <CustomText weight="M" fontFamily={fonts.mongoose} size={52} textStyles={styles.title}>
        {t('screens.home.text.opinions').toUpperCase()}
      </CustomText>
      <View style={styles.heroImageContainer}>
        <Pressable onPress={() => handleNavigationToDetailPage(heroItem, true, 0)}>
          {heroImageUrl ? (
            <CustomImage
              source={{ uri: heroImageUrl }}
              style={styles.heroImage}
              fallbackComponent={
                <View style={styles.fallbackImageContainerStyle}>
                  <FallbackImage height={492} width={'100%'} />
                </View>
              }
            />
          ) : (
            <View style={styles.fallbackImage}>
              <FallbackImage height={492} width={'100%'} />
            </View>
          )}

          {heroItem?.type === 'videos' && (
            <View style={styles.playIconContainer}>
              <PlayCircleIcon height={48} width={48} color={theme.carouselTextDarkTheme} />
            </View>
          )}

          <LinearGradient
            colors={[theme.gradientBlack0Alpha, theme.gradientSilver30Alpha]}
            locations={[0.828, 0.9929]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
        </Pressable>
      </View>

      <View style={styles.heroTextContainer}>
        {heroItem?.authors?.[0]?.name && (
          <CustomButton
            buttonText={heroItem?.authors?.[0]?.name ?? ''}
            variant="text"
            buttonTextColor={theme.carouselTextDarkTheme}
            buttonTextFontFamily={fonts.franklinGothicURW}
            buttonTextStyles={styles.categoryStyle}
            buttonTextWeight="Boo"
            buttonTextSize={fontSize.s}
          />
        )}

        <CustomText
          size={fontSize.xl}
          fontFamily={fonts.notoSerifExtraCondensed}
          textStyles={styles.titleStyle}
        >
          {heroItem?.title}
        </CustomText>

        <View style={styles.bookmarkWrapper}>
          <Pressable onPress={() => handleBookmarkPressWithAnalytics(heroItem, true)}>
            {heroItem?.isBookmarked ? (
              <CheckedBookMark color={theme.carouselTextDarkTheme} />
            ) : (
              <BookMark color={theme.carouselTextDarkTheme} />
            )}
          </Pressable>
        </View>
        <CustomDivider style={styles.divider} />
      </View>

      {loading ? (
        <OpinionsSectionSkeleton />
      ) : (
        <InfoSnapCarousel
          data={
            data?.HomepageOpinion?.filter((item: { isHero: string }) => !item.isHero)?.slice(
              0,
              10
            ) ?? []
          }
          onItemPress={(item: CarouselData, index: number) =>
            handleNavigationToDetailPage(item as OpinionItem, false, index)
          }
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItemProps={(item) => ({
            id: item?.id,
            imageUrl: item?.authors?.[0]?.photo?.url ?? '',
            title: item?.authors?.[0]?.name ?? '',
            subTitle: item?.title || 'undefined',
            imageStyle: styles.imageStyle,
            titleFontFamily: fonts.franklinGothicURW,
            titleFontSize: fontSize.xs,
            titleFontWeight: 'Boo',
            titleStyles: styles.titleStyles,
            subTitleColor: theme.carouselTextDarkTheme,
            subTitleFontFamily: fonts.notoSerif,
            subTitleFontWeight: 'R',
            subTitleFontSize: fontSize.xs,
            subTitleStyles: styles.subTitleStyles,
            contentContainerStyle: styles.contentContainerStyle
          })}
        />
      )}

      <SeeAllButton
        text={t('screens.home.text.moreOpinion')}
        onPress={handleSeeAllPress}
        color={theme.newsTextDarkThemePages}
        buttonStyle={styles.seeAllButtonStyles}
        textStyle={styles.seeAllText}
      />
    </View>
  );
};

export default React.memo(OpinionsSection);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: spacing.m
    },
    title: {
      color: theme.neutralDivider,
      marginHorizontal: spacing.xs,
      lineHeight: lineHeight['12xl'],
      textTransform: 'uppercase',
      paddingTop: spacing.l,
      marginBottom: spacing.xxxs
    },
    heroImageContainer: {
      marginBottom: spacing.s,
      marginLeft: spacing.xs,
      height: 'auto',
      position: 'relative',
      aspectRatio: 4 / 5
    },
    heroImage: {
      width: '100%',
      height: '100%'
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '7%',
      zIndex: 1
    },
    bookmarkWrapper: {
      alignSelf: 'flex-end',
      bottom: spacing.xxs
    },
    fallbackImage: {
      backgroundColor: theme.filledButtonPrimary
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    heroTextContainer: {
      marginBottom: spacing.xs,
      marginHorizontal: spacing.xs
    },
    categoryStyle: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight.l
    },
    titleStyle: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight['4xl']
    },
    playIconContainer: {
      position: 'absolute',
      bottom: spacing.xxxs,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2
    },
    divider: {
      marginTop: spacing.xxxs
    },
    itemSeparator: {
      borderRightWidth: borderWidth.s,
      borderRightColor: theme.dividerGrey,
      marginHorizontal: spacing.l,
      height: '90%'
    },
    opinionRecentTitle: {
      marginVertical: spacing.xl,
      letterSpacing: letterSpacing.xxxs,
      borderBottomWidth: borderWidth.m,
      paddingBottom: spacing.xxs,
      lineHeight: lineHeight['6xl'],
      borderBottomColor: theme.sectionTextTitleSpecial,
      marginHorizontal: spacing.xs
    },
    imageStyle: {
      borderRadius: 80,
      alignSelf: 'flex-start',
      width: 80,
      height: 80,
      marginBottom: spacing.xs,
      marginTop: spacing.xxxs
    },
    titleStyles: {
      lineHeight: lineHeight.m,
      color: theme.carouselTextDarkTheme,
      marginTop: 0,
      marginBottom: spacing.xxxs
    },
    subTitleStyles: {
      lineHeight: lineHeight.m,
      width: 174,
      color: theme.carouselTextDarkTheme
    },
    contentContainerStyle: {
      width: 190
    },
    opinionsListContent: {
      paddingHorizontal: spacing.s
    },
    seeAllText: {
      lineHeight: lineHeight.s,
      color: theme.newsTextDarkThemePages,
      top: 2
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xxs,
      marginHorizontal: spacing.xs,
      paddingBottom: spacing.xxxs
    }
  });
