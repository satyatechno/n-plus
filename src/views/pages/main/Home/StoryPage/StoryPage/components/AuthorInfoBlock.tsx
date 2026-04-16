import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';

import { useTranslation } from 'react-i18next';

import { spacing, fontSize, lineHeight, letterSpacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { UpdateIcon } from '@src/assets/icons';
import { FallBackRoundImage } from '@src/assets/images';
import { isIos } from '@src/utils/platformCheck';
import { formatMexicoDateTime, formatUpdatedTime } from '@src/utils/dateFormatter';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';
import { logSelectContentEvent, StoryData } from '@src/utils/storyAnalyticsHelpers';

type Author = {
  id?: string;
  name: string;
  image?: string;
  isEditorial?: boolean;
  isDefaultAuthor?: boolean;
  url?: string;
  photo?: {
    sizes?: {
      square?: {
        url?: string;
      };
    };
  };
  slug?: string;
};

type Props = {
  authors: Author[];
  publishedAt: string;
  updatedAt?: string;
  onPressingAuthor: (authorId: string, slug: string) => void;
  customTheme?: 'light' | 'dark';
  story?: StoryData;
  currentSlug?: string;
  previousSlug?: string;
  screenName?: string;
  tipoContenido?: string;
  pageType?: 'story' | 'shortInvestigation';
};

const AuthorInfoBlock = ({
  authors = [],
  publishedAt,
  updatedAt,
  onPressingAuthor,
  customTheme,
  story,
  currentSlug,
  previousSlug,
  screenName,
  tipoContenido,
  pageType = 'story'
}: Props) => {
  const [theme] = useTheme(customTheme);
  const { t } = useTranslation();

  const handleAuthorPress = (author: Author) => {
    // Track analytics for author click
    if (story && currentSlug) {
      const organism =
        pageType === 'shortInvestigation'
          ? ANALYTICS_ORGANISMS.SHORT_INVESTIGATION_DETAIL_PAGE.AUTHOR_INFO_BLOCK
          : ANALYTICS_ORGANISMS.STORY_PAGE.AUTHOR_CARD;

      const authorIndex = authors.findIndex((a: { id?: string }) => a.id === author.id) ?? -1;
      let molecule;

      if (pageType === 'shortInvestigation') {
        molecule = `${ANALYTICS_MOLECULES.SHORT_INVESTIGATION_DETAIL_PAGE.AUTHOR_INFO_BLOCK.BASE_NAME} | ${authorIndex + 1}`;
      } else {
        molecule = `${author.name} | X${authorIndex + 1}`;
      }

      logSelectContentEvent(story, {
        organism,
        molecule,
        contentName: author.name,
        currentSlug,
        previousSlug,
        screenName,
        tipoContenido
      });
    }

    onPressingAuthor(author.id ?? '', author.slug ?? '');
  };

  const renderUpdatedTime = () => {
    const formattedTime = formatUpdatedTime(updatedAt || publishedAt);
    if (!formattedTime) return null;

    return (
      <View style={styles.updatedRow}>
        <UpdateIcon color={theme.iconIconographyOtherState} style={styles.updateIcon} />

        <CustomText
          size={fontSize.xxs}
          color={theme.iconIconographyOtherState}
          textStyles={styles.textStyles}
        >
          {formattedTime}
        </CustomText>
      </View>
    );
  };

  const renderAuthors = () => {
    if (!authors?.length) return null;
    const authorPhotoUrl = authors[0]?.photo?.sizes?.square?.url;

    const renderImage = () => {
      if (authorPhotoUrl) {
        return <Image source={{ uri: authorPhotoUrl }} style={styles.authorImage} />;
      }
      return (
        <View style={styles.authorImage}>
          <FallBackRoundImage width="100%" height="100%" />
        </View>
      );
    };

    return (
      <View style={styles.authorContainer}>
        {authors.length === 1 && renderImage()}

        <View style={styles.authorInfoBlock}>
          <View style={styles.authorRow}>
            <CustomText
              fontFamily={fonts.notoSerifExtraCondensed}
              size={fontSize.s}
              color={theme.tagsTextAuthor}
            >
              {`${t('screens.storyPage.author.by')} `}
            </CustomText>
            {authors.map((author, index) => {
              const isLast = index === authors.length - 1;

              if (author.isDefaultAuthor) {
                return (
                  <CustomText
                    key={author.name}
                    fontFamily={fonts.notoSerifExtraCondensed}
                    size={fontSize.s}
                    color={theme.tagsTextAuthor}
                    textStyles={styles.linkText}
                  >
                    {author.name}
                    {!isLast && ` ${t('screens.storyPage.author.separator')} `}
                  </CustomText>
                );
              }

              return (
                <React.Fragment key={author.name}>
                  <Pressable onPress={() => handleAuthorPress(author)}>
                    <CustomText
                      fontFamily={fonts.notoSerifExtraCondensed}
                      size={fontSize.s}
                      color={theme.tagsTextAuthor}
                      textStyles={styles.linkText}
                    >
                      {author.name}
                    </CustomText>
                  </Pressable>

                  {!isLast && (
                    <CustomText
                      fontFamily={fonts.notoSerifExtraCondensed}
                      size={fontSize.s}
                      color={theme.tagsTextAuthor}
                    >
                      {` ${t('screens.storyPage.author.separator')} `}
                    </CustomText>
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Published Date */}
          <CustomText
            size={fontSize.xxs}
            color={theme.labelsTextLabelPlace}
            fontFamily={fonts.franklinGothicURW}
            weight="Med"
            textStyles={styles.publishedDate}
          >
            {(() => {
              const formatted = formatMexicoDateTime(publishedAt);
              return typeof formatted === 'string' ? formatted : '';
            })()}
          </CustomText>

          {/* Updated Date (if any) */}
          {renderUpdatedTime()}
        </View>
      </View>
    );
  };

  return <View style={styles.container}>{renderAuthors()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xx
  },
  authorContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xxs
  },
  authorImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignSelf: 'center',
    marginRight: spacing.xs,
    overflow: 'hidden'
  },
  authorInfoBlock: {
    flex: 1,
    justifyContent: 'center'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  authorTextWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  linkText: {
    textDecorationLine: 'underline'
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxxs
  },
  updateIcon: {
    marginTop: spacing.xxxs,
    marginRight: spacing.xxs
  },
  publishedDate: {
    marginTop: isIos ? spacing.xxxs : 2,
    lineHeight: lineHeight.m,
    letterSpacing: letterSpacing.none
  },
  textStyles: {
    top: 2
  }
});

export default AuthorInfoBlock;
