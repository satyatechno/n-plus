import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { FallbackImage } from '@src/assets/images';
import { AppTheme } from '@src/themes/theme';
import { MenuIcon, PlayCircle } from '@src/assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import CustomImage from '@src/views/atoms/CustomImage';

interface Props {
  item: {
    imageUrl?: string;
    category: string;
    title: string;
    progress?: number;
  };
  onPress?: () => void;
  onMenuPress?: () => void;
  titleColor?: string;
  menuIconColor?: string;
  categoryColor?: string;
  iconColor?: string;
}

const VideoCarouselCard = ({
  item,
  onPress,
  onMenuPress,
  titleColor,
  menuIconColor,
  categoryColor,
  iconColor
}: Props) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const renderImage = () => {
    if (item.imageUrl) {
      return (
        <CustomImage source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      );
    }
    return (
      <View style={styles.image}>
        <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
    );
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {renderImage()}

        <LinearGradient
          colors={[theme.gradientBlack30Alpha, theme.gradientBlack30Alpha]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.playIconContainer}>
          <PlayCircle
            width={actuatedNormalize(34)}
            height={actuatedNormalizeVertical(34)}
            color={iconColor ?? theme.mainBackgroundSecondary}
          />
        </View>

        {item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {item.category && (
          <CustomText
            fontFamily={fonts.superclarendon}
            size={fontSize.xxs}
            color={categoryColor ?? theme.tagsTextCategory}
            textStyles={styles.category}
          >
            {item.category}
          </CustomText>
        )}

        <View style={styles.titleContainer}>
          <CustomText
            fontFamily={fonts.notoSerif}
            size={fontSize.s}
            color={titleColor ?? theme.newsTextTitlePrincipal}
            textStyles={styles.title}
          >
            {item.title}
          </CustomText>

          <Pressable style={styles.menuButton} onPress={onMenuPress}>
            <MenuIcon fill={menuIconColor ?? ''} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      width: actuatedNormalize(260),
      overflow: 'hidden',
      marginRight: actuatedNormalize(spacing.xs)
    },
    imageContainer: {
      position: 'relative',
      width: '100%'
    },
    image: {
      width: '100%',
      height: actuatedNormalizeVertical(148),
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      flex: 1,
      paddingTop: spacing.xxs
    },
    category: {
      marginBottom: spacing.xxxs,
      lineHeight: lineHeight.s
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    title: {
      flex: 1,
      lineHeight: lineHeight.l,
      marginRight: spacing.xxs
    },
    progressContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: actuatedNormalizeVertical(6),
      backgroundColor: theme.titleForegroundInteractiveDefault30Alpha
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.tagsTextCategory
    },
    playIconContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuButton: {
      width: actuatedNormalize(24),
      height: actuatedNormalizeVertical(24),
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

export default VideoCarouselCard;
