import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Modal, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import useNPlusFocusViewModel from '@src/viewModels/main/Home/Home/useNPlusFocusViewModel';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage, NPlusFocusImage } from '@src/assets/images';
import { AppTheme } from '@src/themes/theme';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import NPlusFocusSkeleton from '@src/views/pages/main/Home/Home/components/NPlusFocusSkeleton';
import SeeAllButton from '@src/views/molecules/SeeAllButton';

interface NPlusFocusProps {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  handleBookmarkPress: (contentId?: string) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const NPlusFocus = ({
  t,
  theme,
  handleBookmarkPress,
  registerRefetch,
  sectionGapStyle
}: NPlusFocusProps) => {
  const {
    data,
    loading,
    handleSeeAllPress,
    goToInvestigationDetailScreen,
    handleInteractiveResearchPress,
    showWebView,
    webUrl,
    setShowWebView,
    onNPlusVideoCardPress,
    refetchNPlusFocus
  } = useNPlusFocusViewModel();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  useEffect(() => {
    registerRefetch(() =>
      refetchNPlusFocus({
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchNPlusFocus]);

  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  if (showWebView) {
    return (
      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWebView(false)}
      >
        <Animated.View
          style={[styles.webViewContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => setShowWebView(false)}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Animated.View>
      </Modal>
    );
  }

  if (loading) {
    return <NPlusFocusSkeleton />;
  }

  if (!data?.HomepageNfocus || data.HomepageNfocus.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, sectionGapStyle]}>
      <View style={styles.programHeroImageContainer}>
        <View style={styles.imageContainer}>
          {data?.HomepageNfocus?.[0]?.specialImage?.sizes?.vintage?.url ? (
            <>
              <NPlusFocusImage
                fill={theme.carouselTextDarkTheme}
                width={113}
                height={26}
                style={styles.nplusLogo}
              />

              <CustomImage
                source={{ uri: data?.HomepageNfocus?.[0]?.specialImage?.sizes?.vintage?.url ?? '' }}
                style={styles.programHeroImage}
                fallbackComponent={
                  <View style={styles.fallbackImageContainerStyle}>
                    <FallbackImage
                      width="100%"
                      height="100%"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </View>
                }
              />
            </>
          ) : (
            <View style={styles.fallbackImageContainerStyle}>
              <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </View>
          )}

          <LinearGradient
            colors={[theme.gradientTransparentBlack, theme.mainBackgrunforproductionPage]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
          <CustomText
            fontFamily={fonts.mongoose}
            textStyles={styles.programTitle}
            size={fontSize['10xl']}
            weight="M"
          >
            {data?.HomepageNfocus?.[0]?.title ?? ''}
          </CustomText>
        </View>
      </View>

      <View style={styles.programDetailContainer}>
        <CustomButton
          buttonText={t('screens.home.text.seeResearch')}
          buttonStyles={styles.lastEpisodeButton}
          buttonTextColor={theme.mainBackgrunforproductionPage}
          onPress={() => goToInvestigationDetailScreen(data?.HomepageNfocus?.[0]?.slug)}
        />

        {data?.HomepageNfocus?.[0]?.hasInteractive && (
          <CustomButton
            variant="outlined"
            buttonText={t('screens.nPlusFocus.text.viewInteractive')}
            buttonStyles={styles.viewInteractiveButton}
            outlinedBorderColor={theme.carouselTextDarkTheme}
            onPress={handleInteractiveResearchPress}
            getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
          />
        )}

        <SeeAllButton
          text={t('screens.home.text.exploreNplusFocus')}
          onPress={handleSeeAllPress}
          color={theme.newsTextDarkThemePages}
          buttonStyle={styles.seeAllButtonStyles}
          textStyle={styles.seeAllText}
          hitSlop={10}
        />
      </View>

      {data?.HomepageNfocus?.[1] && (
        <View style={styles.carouselContainerVideo}>
          <CarouselCard
            type="videos"
            topic={data.HomepageNfocus[1]?.category?.title}
            title={data.HomepageNfocus[1]?.title}
            minutesAgo={formatDurationToMinutes(data.HomepageNfocus[1]?.videoDuration)}
            imageUrl={data.HomepageNfocus[1]?.heroImage?.sizes?.square?.url ?? ''}
            isBookmarked={data.HomepageNfocus[1]?.isBookmarked}
            headingStyles={[styles.verticalHeading, { color: 'white' }]}
            contentContainerStyle={styles.verticalVideoContainer}
            imageStyle={styles.verticalImageStyle}
            onBookmarkPress={() => handleBookmarkPress(data.HomepageNfocus[1]?.id)}
            subheadingStyles={styles.subHeadingStyles}
            showBookmark={true}
            bottomRowStyles={styles.bottomRowStyles}
            iconColor={theme.carouselTextDarkTheme}
            onPress={() => {
              onNPlusVideoCardPress(data.HomepageNfocus[1], 1);
            }}
          />
          <CustomDivider style={styles.divider} />
        </View>
      )}

      {data?.HomepageNfocus?.[2] && (
        <BookmarkCard
          category={
            data.HomepageNfocus[1]?.category?.title ??
            t('screens.storyPage.relatedStoryBlock.general')
          }
          heading={data.HomepageNfocus[2]?.title}
          headingColor={theme.newsTextTitlePrincipal}
          subHeading={formatDurationToMinutes(data.HomepageNfocus[2]?.videoDuration).toString()}
          subHeadingColor={theme.labelsTextLabelPlay}
          isBookmarkChecked={data.HomepageNfocus[2]?.isBookmarked}
          id={data.HomepageNfocus[2]?.id ?? ''}
          containerStyle={styles.bookmarkCardContainer}
          onPressingBookmark={() => handleBookmarkPress(data.HomepageNfocus[2]?.id ?? '')}
          primaryColor={theme.carouselTextDarkTheme}
          headingTextStyles={styles.headingTextStyles}
          subHeadingTextStyles={styles.subHeadingTextStyles}
          pressedBackgroundColor={theme.mainBackgrunforproductionPage}
          onPress={() => {
            onNPlusVideoCardPress(data.HomepageNfocus[2], 2);
          }}
          isVideo={true}
        />
      )}
      {data?.HomepageNfocus?.[2] && <CustomDivider style={styles.greyDivider} />}
    </View>
  );
};

export default React.memo(NPlusFocus);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    programHeroImageContainer: {
      width: '100%',
      height: 492,
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    programHeroImage: {
      width: '100%',
      aspectRatio: 4 / 5,
      resizeMode: 'cover'
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 122
    },
    programDetailContainer: {
      marginHorizontal: spacing.xs,
      paddingBottom: spacing.xxs
    },
    programTitle: {
      position: 'absolute',
      left: spacing.xs,
      right: spacing.xs,
      bottom: 0,
      lineHeight: lineHeight['8xl'],
      color: theme.sectionTextOther,
      textTransform: 'uppercase',
      paddingTop: spacing.xx
    },
    viewInteractiveButton: {
      width: '100%'
    },
    seeAllButton: {
      bottom: spacing.xs
    },
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage,
      paddingBottom: spacing.xxxs
    },
    lastEpisodeButton: {
      marginTop: spacing.s,
      marginBottom: spacing.xxs,
      backgroundColor: theme.carouselTextDarkTheme,
      width: '100%'
    },
    seeAllText: {
      lineHeight: lineHeight.s,
      color: theme.newsTextDarkThemePages,
      top: spacing.xxxxs
    },
    seeAllButtonStyles: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.s,
      paddingBottom: spacing.s
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: spacing.xs,
      backgroundColor: theme.mainBackgroundDefault
    },
    carouselContainerVideo: {
      marginHorizontal: spacing.xs
    },
    verticalHeading: {
      marginTop: spacing.xxxxs,
      lineHeight: lineHeight.s,
      color: theme.carouselTextDarkTheme
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
    subHeadingStyles: {
      color: theme.carouselTextDarkTheme,
      marginRight: spacing.xxs,
      marginBottom: spacing.xxxxs
    },
    headingTextStyles: {
      marginTop: spacing.xxxs,
      lineHeight: lineHeight.l,
      color: theme.carouselTextDarkTheme
    },
    bottomRowStyles: {
      marginTop: spacing.xxxxs
    },
    bookmarkCardContainer: {
      marginHorizontal: spacing.xs,
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0
    },
    subHeadingTextStyles: {
      color: theme.carouselTextDarkTheme,
      lineHeight: lineHeight.xs
    },
    divider: {
      marginVertical: spacing.xs,
      backgroundColor: theme.borderColor,
      height: 1
    },
    greyDivider: {
      backgroundColor: theme.dividerPrimary,
      height: 1,
      marginHorizontal: spacing.xs,
      marginVertical: spacing.xs
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    nplusLogo: {
      position: 'absolute',
      top: spacing.l,
      zIndex: 2,
      left: spacing.xs
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  });
