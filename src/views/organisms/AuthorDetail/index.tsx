import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { fonts } from '@src/config/fonts';
import { BookMark, CheckedBookMark, ShareIcon } from '@src/assets/icons';
import { FallbackImage } from '@src/assets/images';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';

interface AuthorCardProps {
  authorDetails: {
    id?: string;
    title?: string;
    position?: string;
    heroImage?: { url?: string };
    description?: string | Record<string, unknown>;
  };
  isBookmark: boolean;
  onShare: () => void;
  onToggleBookmark?: (id: string, type: string) => void;
  name?: string;
  position?: string;
  imageUrl?: string;
  bio?: string | Record<string, unknown>;
  LexicalContentBio?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  authorDetails,
  isBookmark,
  onShare,
  onToggleBookmark,
  name,
  position,
  imageUrl,
  bio,
  LexicalContentBio = true
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  return (
    <>
      <View style={styles.headerSection}>
        <View style={styles.authorNameContainer}>
          <CustomText
            size={fontSize['6xl']}
            fontFamily={fonts.notoSerifExtraCondensed}
            textStyles={styles.authorName}
          >
            {name}
          </CustomText>
          <CustomText
            size={fontSize.xxs}
            fontFamily={fonts.superclarendon}
            color={theme.tagsTextCategory}
            textStyles={styles.designation}
          >
            {position}
          </CustomText>
        </View>

        {imageUrl ? (
          <CustomImage
            source={{ uri: imageUrl }}
            style={[
              styles.imageContainer,
              {
                backgroundColor: imageUrl ? '' : theme.actionCTATextDisabled
              }
            ]}
            resizeMode="cover"
            fallbackComponent={
              <View style={styles.fallbackImageContainerStyle}>
                <FallbackImage
                  width={actuatedNormalize(148)}
                  height={actuatedNormalizeVertical(148)}
                />
              </View>
            }
          />
        ) : (
          <View style={styles.fallBackImageContainer}>
            <FallbackImage width={actuatedNormalize(148)} height={actuatedNormalizeVertical(148)} />
          </View>
        )}
      </View>

      <View style={styles.describingText}>
        {bio &&
          (LexicalContentBio ? (
            <LexicalContentRenderer content={bio} spacingHorizontal={0} />
          ) : (
            <CustomText
              size={fontSize.xs}
              fontFamily={fonts.notoSerif}
              textStyles={styles.describingText}
            >
              {typeof bio === 'string' ? bio : ''}
            </CustomText>
          ))}
      </View>

      <View style={styles.bookMarkContainer}>
        <Pressable onPress={onShare}>
          <ShareIcon color={theme.iconIconographyGenericState} />
        </Pressable>
        {onToggleBookmark && (
          <Pressable
            onPress={() => authorDetails?.id && onToggleBookmark(authorDetails.id, 'Author')}
          >
            {isBookmark ? (
              <CheckedBookMark color={theme.iconIconographyGenericState} />
            ) : (
              <BookMark color={theme.iconIconographyGenericState} />
            )}
          </Pressable>
        )}
      </View>
    </>
  );
};

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    authorNameContainer: {
      width: '50%'
    },
    authorName: {
      lineHeight: actuatedNormalizeVertical(lineHeight['10xl'])
    },
    designation: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    imageContainer: {
      borderRadius: 100,
      width: actuatedNormalizeVertical(148),
      height: actuatedNormalizeVertical(148),
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center'
    },
    describingText: {
      lineHeight: actuatedNormalize(lineHeight['2xl']),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    bookMarkContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: actuatedNormalize(spacing.m),
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    fallBackImageContainer: {
      borderRadius: 100,
      width: actuatedNormalizeVertical(148),
      height: actuatedNormalizeVertical(148),
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.filledButtonPrimary
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 100
    }
  });

export default AuthorCard;
