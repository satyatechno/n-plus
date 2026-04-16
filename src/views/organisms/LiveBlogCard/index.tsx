import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { FallbackImage } from '@src/assets/images';
import { fonts } from '@src/config/fonts';
import { fontSize, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CustomImage from '@src/views/atoms/CustomImage';
import CustomText from '@src/views/atoms/CustomText';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { themeStyles } from '@src/views/organisms/LiveBlogCard/styles';
import { LiveBlogCardProps } from '@src/views/organisms/LiveBlogCard/interface';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { LexicalContent } from '@src/models/main/Home/LiveBlog';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { CheckedBookMark, BookMark } from '@src/assets/icons';
import useAuthStore from '@src/zustand/auth/authStore';
import CustomLottieView from '@src/views/atoms/CustomLottieView';
import { Lottie } from '@src/assets/lottie';
import constants from '@src/config/constants';

const LiveBlogCard = ({
  t,
  title,
  inactiveBlog,
  subTitle,
  isLive,
  blogEntries,
  contentContainerStyle,
  mediaUrl,
  vintageUrl,
  landscapeUrl,
  onPress,
  handleMedia,
  subHeadingSize,
  subHeadingFont,
  subHeadingWeight,
  subHeadingColor,
  showBookmark,
  isBookmarked,
  onBookmarkPress,
  bookmarkIconContainerStyle,
  liveBlogTextBlockStyle,
  liveBlogTagTextStyle,
  headingStyle,
  subHeadingStyle,
  imageStyle,
  blogMediaContainerStyle,
  isShowTitleOnTop,
  bottomTitleContainerStyle,
  hasEmptyMediaUrl
}: LiveBlogCardProps) => {
  const colorScheme = useColorScheme();
  const [theme, selectedTheme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { guestToken } = useAuthStore();
  const [isBookmark, setIsBookmark] = React.useState(isBookmarked);

  const currentTheme =
    selectedTheme == 'system'
      ? colorScheme == 'dark'
        ? constants.DARK
        : constants.LIGHT
      : selectedTheme;

  useEffect(() => {
    setIsBookmark(isBookmarked);
  }, [isBookmarked]);

  const handleBookmarkPress = () => {
    onBookmarkPress?.();
    if (!guestToken) {
      setIsBookmark(!isBookmark);
    }
  };

  return (
    <Pressable style={contentContainerStyle} onPress={onPress}>
      {isShowTitleOnTop && (
        <>
          {isLive && (
            <View
              style={StyleSheet.flatten([styles.liveBlogTextBlockOnTop, liveBlogTextBlockStyle])}
            >
              <CustomLottieView
                source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
              />
              <CustomText
                weight="Dem"
                fontFamily={fonts.franklinGothicURW}
                size={fontSize.xs}
                color={theme.tagsTextLive}
                textStyles={StyleSheet.flatten([styles.liveBlogTagText, liveBlogTagTextStyle])}
              >
                {t('screens.liveBlog.title')}
              </CustomText>
            </View>
          )}

          <CustomHeading
            headingText={title || ''}
            headingFont={fonts.franklinGothicURW}
            headingStyles={StyleSheet.flatten([styles.heading, headingStyle])}
            headingWeight="Dem"
            headingColor={theme.newsTextTitlePrincipal}
            subHeadingText={subTitle || ''}
            subHeadingSize={subHeadingSize ?? fontSize.xs}
            subHeadingFont={subHeadingFont ?? fonts.notoSerif}
            subHeadingWeight={subHeadingWeight ?? 'R'}
            subHeadingColor={subHeadingColor ?? theme.subtitleTextSubtitle}
            subHeadingStyles={StyleSheet.flatten([styles.subHeading, subHeadingStyle])}
          />
        </>
      )}
      {(!handleMedia || mediaUrl || vintageUrl || landscapeUrl || hasEmptyMediaUrl) && (
        <View style={StyleSheet.flatten([styles.blogMediaContainer, blogMediaContainerStyle])}>
          {vintageUrl || landscapeUrl || (mediaUrl && !hasEmptyMediaUrl) ? (
            <CustomImage
              source={
                vintageUrl
                  ? { uri: vintageUrl }
                  : landscapeUrl
                    ? { uri: landscapeUrl }
                    : mediaUrl
                      ? { uri: mediaUrl }
                      : undefined
              }
              style={StyleSheet.flatten([styles.image, imageStyle])}
              fallbackComponent={
                <View style={styles.fallbackImageContainerStyle}>
                  <FallbackImage
                    height={'100%'}
                    width={'100%'}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </View>
              }
            />
          ) : (
            <View style={styles.fallbackImageContainerStyle}>
              <FallbackImage height={'100%'} width={'100%'} preserveAspectRatio="xMidYMid slice" />
            </View>
          )}
        </View>
      )}

      {!isShowTitleOnTop && (
        <View style={bottomTitleContainerStyle}>
          {isLive && (
            <View
              style={StyleSheet.flatten([
                mediaUrl ? styles.liveBlogTextBlock : styles.entryWithoutMedia,
                liveBlogTextBlockStyle
              ])}
            >
              <CustomLottieView
                source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
                lottieStyle={styles.liveDot}
              />
              <CustomText
                weight="Dem"
                fontFamily={fonts.franklinGothicURW}
                size={fontSize.xs}
                color={theme.tagsTextLive}
                textStyles={StyleSheet.flatten([styles.liveBlogTagText, liveBlogTagTextStyle])}
              >
                {t('screens.liveBlog.title')}
              </CustomText>
            </View>
          )}

          {inactiveBlog && (
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
              size={fontSize.xs}
              color={theme.menusTextHeaderInactive}
              textStyles={styles.endOfCoverageText}
            >
              {t('screens.liveBlog.text.endOfCoverage')}
            </CustomText>
          )}

          <CustomHeading
            headingText={title || ''}
            headingFont={fonts.franklinGothicURW}
            headingStyles={StyleSheet.flatten([styles.heading, headingStyle])}
            headingWeight="Dem"
            headingColor={theme.newsTextTitlePrincipal}
            subHeadingText={subTitle || ''}
            subHeadingSize={subHeadingSize ?? fontSize.xs}
            subHeadingFont={subHeadingFont ?? fonts.notoSerif}
            subHeadingWeight={subHeadingWeight ?? 'R'}
            subHeadingColor={subHeadingColor ?? theme.subtitleTextSubtitle}
            subHeadingStyles={StyleSheet.flatten([styles.subHeading, subHeadingStyle])}
          />
        </View>
      )}

      {showBookmark ? (
        <Pressable onPress={handleBookmarkPress} style={bookmarkIconContainerStyle} hitSlop={8}>
          {isBookmark ? (
            <CheckedBookMark color={theme.iconIconographyGenericState} />
          ) : (
            <BookMark color={theme.iconIconographyGenericState} />
          )}
        </Pressable>
      ) : null}

      {blogEntries && blogEntries.length > 0 && (
        <View style={styles.timelineContainer}>
          {blogEntries.map(
            (
              entry: { title: string; createdAt: string; content: LexicalContent },
              index: number
            ) => {
              const formattedTime = formatMexicoDateTime(entry?.createdAt, 'dateTimeObject') as {
                time: string;
                date: string;
              };
              return (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineLeftColumn,
                      index !== blogEntries.length - 1 && {
                        paddingBottom: actuatedNormalizeVertical(spacing.xxs)
                      }
                    ]}
                  >
                    <CustomText
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      size={fontSize.xxs}
                      color={theme.tagsTextBreakingNews}
                      textStyles={styles.timelineTime}
                    >
                      {formattedTime?.time || ''}
                    </CustomText>

                    <CustomText
                      weight="Boo"
                      fontFamily={fonts.franklinGothicURW}
                      size={fontSize.xxs}
                      color={theme.tagsTextBreakingNews}
                      textStyles={styles.timelineDate}
                    >
                      {formattedTime?.date || ''}
                    </CustomText>
                  </View>

                  <View style={styles.timelineMiddleColumn}>
                    {index < blogEntries.length - 1 && (
                      <CustomDivider style={styles.timelineLine} />
                    )}

                    <View style={styles.timelineDot} />
                  </View>

                  <View
                    style={StyleSheet.flatten([
                      styles.timelineRightColumn,
                      index !== blogEntries.length - 1 && styles.timelineContentItem
                    ])}
                  >
                    {entry?.title && entry?.title.trim() !== '' ? (
                      <CustomText
                        fontFamily={fonts.notoSerif}
                        size={fontSize.xs}
                        color={theme.liveBlogTextTitle}
                        textStyles={styles.timelineContent}
                      >
                        {entry?.title}
                      </CustomText>
                    ) : entry?.content && entry?.content?.root?.children?.[0]?.type !== 'block' ? (
                      <View style={styles.lexicalView}>
                        <LexicalContentRenderer
                          content={{
                            root: {
                              ...entry?.content?.root,
                              children: [entry?.content?.root?.children?.[0]]
                            }
                          }}
                          spacingHorizontal={0}
                          contentTextStyle={{ marginTop: 0 }}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}
    </Pressable>
  );
};

export default LiveBlogCard;
