import React, { memo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import CustomImage from '@src/views/atoms/CustomImage';
import { fonts } from '@src/config/fonts';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';

interface MediaData {
  caption: string;
  url?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

interface MediaBlockProps {
  media?: MediaData;
  style?: StyleProp<ViewStyle>;
  customTheme?: 'light' | 'dark';
}

const MediaBlock: React.FC<MediaBlockProps> = ({ media, style, customTheme }) => {
  const { t } = useTranslation();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  if (!media?.url) {
    return (
      <View style={styles.fallback}>
        <CustomText>{t('screens.lexical.text.mediaBlock.fallback')}</CustomText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {(media?.mimeType === 'image/jpeg' ||
        media?.mimeType === 'image/webp' ||
        media?.mimeType === 'image/png') && (
        <View style={styles.imageContainer}>
          <View
            style={StyleSheet.flatten([
              styles.imageContainerChild,
              {
                aspectRatio: media?.width && media?.height ? media.width / media.height : 16 / 9
              }
            ])}
          >
            <CustomImage source={{ uri: media?.url }} style={styles.image} resizeMode="cover" />
          </View>

          <View style={styles.captionView}>
            <CustomText
              size={fontSize.xxs}
              weight="Boo"
              fontFamily={fonts.franklinGothicURW}
              color={theme.sectionTextTitleSpecial}
              textStyles={styles.caption}
            >
              {media?.caption || 'Foto N+'}
            </CustomText>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(MediaBlock);

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    image: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    caption: {
      width: '100%',
      color: theme.labelsTextLabelPlace,
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight.xs),
      alignSelf: 'flex-start',
      flexWrap: 'wrap',
      backgroundColor: theme.mainBackgroundDefault
    },
    captionView: {
      width: '100%',
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    fallback: {
      marginVertical: actuatedNormalizeVertical(spacing.s),
      padding: actuatedNormalizeVertical(spacing.xs),
      alignItems: 'center'
    },
    imageContainer: {
      flex: 1,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainerChild: {
      width: '100%'
    }
  });
