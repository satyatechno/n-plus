import React, { useMemo } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';

import { useTranslation } from 'react-i18next';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, fontSize, lineHeight, borderWidth } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { HeaderOpinionDetailProps } from '@src/models/main/Opinion/Opinion';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';
import { FallBackRoundImage } from '@src/assets/images';

const HeaderOpinionDetail: React.FC<HeaderOpinionDetailProps> = ({
  opinion,
  video,
  story,
  style,
  handleAuthorPress
}) => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { t } = useTranslation();
  const authors = story?.authors ?? opinion?.authors ?? video?.authors ?? [];
  const isNonClickableAuthor = authors?.[0]?.name === 'Redacción N+';

  if (authors.length === 0) return null;

  const authorImage =
    authors.length === 1 ? (authors[0]?.profilePicture?.url ?? authors[0]?.photo?.url) : undefined;

  return (
    <>
      <View style={StyleSheet.flatten([styles.container, style])}>
        {authors.length === 1 ? (
          authorImage ? (
            <Image source={{ uri: authorImage }} style={styles.avatar} />
          ) : (
            <FallBackRoundImage />
          )
        ) : null}
        <View style={styles.textContainer}>
          <CustomText
            size={fontSize.s}
            weight="B"
            fontFamily={fonts.notoSerif}
            textStyles={styles.titleTextStyles}
          >
            {t('screens.opinion.screen.title')}
          </CustomText>

          <View style={styles.bylineRow}>
            <CustomText
              size={fontSize.s}
              weight="Med"
              fontFamily={fonts.franklinGothicURW}
              color={theme.tagsTextAuthor}
            >
              {t('screens.storyPage.author.by')}
            </CustomText>

            {authors.slice(0, 3).map((a, idx) => (
              <View key={`${a.name}-${idx}`} style={styles.authorNameWrapper}>
                {idx > 0 && (
                  <CustomText
                    size={fontSize.s}
                    weight="Med"
                    fontFamily={fonts.franklinGothicURW}
                    color={theme.tagsTextAuthor}
                  >
                    {'| '}
                  </CustomText>
                )}
                <Pressable
                  disabled={isNonClickableAuthor}
                  onPress={() => {
                    if (!isNonClickableAuthor && a?.id && handleAuthorPress) {
                      handleAuthorPress(a.id);
                    }
                  }}
                >
                  <CustomText
                    size={fontSize.s}
                    weight="Med"
                    fontFamily={fonts.franklinGothicURW}
                    color={theme.tagsTextAuthor}
                  >
                    {a.name}
                  </CustomText>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: theme.tagsTextAuthor,
                      marginTop: actuatedNormalizeVertical(isIos ? -2 : 0),
                      height: actuatedNormalizeVertical(isIos ? 2 : 3),
                      borderRadius: 12
                    }}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: actuatedNormalize(spacing.xs),
      paddingVertical: actuatedNormalize(spacing.ss),
      gap: actuatedNormalize(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      gap: isIos ? actuatedNormalize(spacing.xxxs) : actuatedNormalize(0)
    },
    bylineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxxs),
      flexWrap: 'wrap'
    },
    authorNameWrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    authorUnderline: {
      paddingBottom: isIos ? actuatedNormalizeVertical(0) : actuatedNormalizeVertical(1),
      borderBottomWidth: borderWidth.l,
      borderBottomColor: theme.tagsTextAuthor
    },
    underlineText: {
      textDecorationLine: 'underline',
      textDecorationColor: theme.tagsTextAuthor,
      lineHeight: actuatedNormalizeVertical(lineHeight.s),
      top: actuatedNormalizeVertical(3)
    },
    titleTextStyles: {
      color: theme.tagsTextAuthor
    },
    avatar: {
      width: actuatedNormalize(52),
      height: actuatedNormalize(52),
      borderRadius: actuatedNormalize(26)
    }
  });

export default HeaderOpinionDetail;
