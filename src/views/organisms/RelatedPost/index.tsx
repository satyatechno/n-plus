import React from 'react';
import { StyleSheet, View, Pressable, StyleProp, TextStyle } from 'react-native';

import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomText from '@src/views/atoms/CustomText';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import { PlayCircle } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';
import { AppTheme } from '@src/themes/theme';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage } from '@src/assets/images';

interface HeadingProps {
  headingText: string;
  headingColor?: string;
  headingSize?: number;
  headingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  headingFont?: string;
  headingStyles?: StyleProp<TextStyle>;
}

interface SubHeadingProps {
  subHeadingText: string;
  subHeadingColor?: string;
  subHeadingSize?: number;
  subHeadingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  subHeadingFont?: string;
  subHeadingStyles?: StyleProp<TextStyle>;
}

interface ReadingTimeProps {
  readingTime: string;
  readingSize?: number;
  readingWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  readingFont?: string;
  readingColor?: string;
  readingStyles?: StyleProp<TextStyle>;
}

interface NewsCardProps extends HeadingProps, SubHeadingProps, ReadingTimeProps {
  onPress?: () => void;
  imageUrl?: string;
  isVideo?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  onPress,
  headingText,
  headingColor,
  headingSize = fontSize.xxs,
  headingWeight = 'R',
  headingFont = fonts.superclarendon,
  headingStyles,
  subHeadingText,
  subHeadingColor,
  subHeadingSize = fontSize.s,
  subHeadingWeight = 'R',
  subHeadingFont = fonts.notoSerif,
  subHeadingStyles,
  readingTime,
  readingSize = fontSize.xxs,
  readingWeight = 'Med',
  readingFont = fonts.franklinGothicURW,
  readingStyles,
  imageUrl,
  isVideo = false
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <CustomImage
        source={imageUrl ? { uri: imageUrl } : undefined}
        style={styles.image}
        fallbackComponent={
          <View style={styles.fallbackImageContainerStyle}>
            <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>
        }
      />

      <View style={styles.textContainer}>
        <CustomHeading
          headingText={headingText}
          headingColor={headingColor}
          headingSize={headingSize}
          headingWeight={headingWeight}
          headingFont={headingFont}
          headingStyles={StyleSheet.flatten([styles.heading, headingStyles])}
          subHeadingText={subHeadingText}
          subHeadingColor={subHeadingColor ?? theme.subtitleTextSubtitle}
          subHeadingSize={subHeadingSize}
          subHeadingWeight={subHeadingWeight}
          subHeadingFont={subHeadingFont}
          subHeadingStyles={StyleSheet.flatten([styles.subheading, subHeadingStyles])}
          isLogoVisible={false}
        />

        <View
          style={[
            styles.readingTimeContainer,
            { right: isVideo ? actuatedNormalize(4) : actuatedNormalize(0) }
          ]}
        >
          {isVideo ? (
            <>
              <PlayCircle color={theme.iconIconographyGenericState} />
              <CustomText
                size={readingSize}
                weight={readingWeight}
                fontFamily={readingFont}
                color={theme.labelsTextLabelPlay}
                textStyles={StyleSheet.flatten([styles.readingTimeWithPlayIcon, readingStyles])}
              >
                {readingTime}
              </CustomText>
            </>
          ) : (
            <CustomText
              size={readingSize}
              weight={readingWeight}
              fontFamily={readingFont}
              color={theme.labelsTextLabelPlay}
              textStyles={StyleSheet.flatten([styles.readingTime, readingStyles])}
            >
              {readingTime}
            </CustomText>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary,
      paddingBottom: spacing.xs,
      paddingTop: spacing.xs
    },
    image: {
      width: 100,
      height: 100,
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    textContainer: {
      flex: 1,
      marginLeft: spacing.xs
    },
    heading: {
      marginTop: 0,
      lineHeight: lineHeight.m
    },
    subheading: {
      lineHeight: lineHeight.l,
      marginBottom: spacing.xxxxs,
      marginTop: 0
    },
    readingTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    readingTimeWithPlayIcon: {
      marginLeft: spacing.xxs,
      top: isIos ? 2 : 0
    },
    readingTime: {
      top: isIos ? 2 : 0
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

export default NewsCard;
