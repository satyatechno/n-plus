import React, { useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';
import CustomText from '@src/views/atoms/CustomText';
import { borderWidth, fontSize, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export interface Topic {
  title: string;
  slug?: string;
}

interface RelatedTopicChipsProps {
  topics: Topic[];
  onPress?: (value: string | Topic, index: number) => void;
  headingFontSize?: number;
  headingFontWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  headingFontFamily?: string;
  headingTextstyle?: TextStyle;
  heading?: string;
  mainContainerstyle?: ViewStyle;
  preselect?: boolean;
  chipsContainerStyle?: StyleProp<ViewStyle>;
  chipsTextstyle?: StyleProp<TextStyle>;
  chipFontWeight?: 'L' | 'R' | 'M' | 'B' | 'Boo' | 'Dem' | 'Med';
  listContainerStyle?: StyleProp<ViewStyle>;
  customTheme?: 'light' | 'dark';
  isCategory?: boolean;
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const TopicChips = ({
  topics,
  onPress,
  headingFontSize,
  headingFontWeight,
  headingFontFamily,
  headingTextstyle,
  heading,
  mainContainerstyle,
  preselect = false,
  chipsContainerStyle,
  chipsTextstyle,
  chipFontWeight,
  listContainerStyle,
  customTheme,
  onMomentumScrollEnd,
  isCategory = false
}: RelatedTopicChipsProps) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    preselect && topics?.length > 0 ? topics[0].title : null
  );

  if (!topics || topics?.length === 0) {
    return null;
  }

  const renderContent = ({ item, index }: { item: Topic; index: number }) => {
    const isSelected = selectedTopic === item.title;
    const handlePress = () => {
      if (preselect) setSelectedTopic(item.title);
      if (isCategory) {
        onPress?.(item, index);
      } else {
        onPress?.(item.slug ?? '', index);
      }
    };

    return (
      <Pressable
        onPress={handlePress}
        style={StyleSheet.flatten([
          isSelected ? styles.selectedContentItem : styles.nonSelectedContentItem,
          chipsContainerStyle
        ])}
      >
        <CustomText
          fontFamily={fonts.franklinGothicURW}
          size={fontSize['xxs']}
          weight={chipFontWeight ?? 'Dem'}
          textStyles={StyleSheet.flatten([
            isSelected ? styles.selectedContentText : styles.nonSelectedContentText,
            chipsTextstyle
          ])}
        >
          {item?.title ?? ''}
        </CustomText>
      </Pressable>
    );
  };

  return (
    <View style={mainContainerstyle}>
      <CustomText
        fontFamily={headingFontFamily ?? fonts.franklinGothicURW}
        size={headingFontSize ?? fontSize.s}
        weight={headingFontWeight ?? 'Dem'}
        color={theme.adaptiveText}
        textStyles={StyleSheet.flatten([styles.headingStyles, headingTextstyle])}
      >
        {heading}
      </CustomText>

      <FlatList
        data={topics}
        renderItem={renderContent}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
        contentContainerStyle={listContainerStyle}
      />
    </View>
  );
};

export default TopicChips;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    selectedContentItem: {
      borderWidth: borderWidth.m,
      paddingVertical: actuatedNormalizeVertical(spacing.xxs),
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginRight: actuatedNormalize(spacing.xs),
      borderRadius: 28,
      borderColor: theme.chipTextActive
    },
    nonSelectedContentItem: {
      borderWidth: borderWidth.m,
      paddingVertical: actuatedNormalizeVertical(spacing.xxs),
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginRight: actuatedNormalize(spacing.xs),
      borderRadius: 28,
      borderColor: theme.chipTextInactive
    },
    selectedContentText: {
      color: theme.chipTextActive,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    nonSelectedContentText: {
      color: theme.chipTextInactive,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    headingStyles: {
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(spacing['2xl'])
    }
  });
