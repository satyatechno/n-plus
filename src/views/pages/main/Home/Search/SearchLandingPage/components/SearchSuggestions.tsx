import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { MysteryIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages/main/Home/Search/SearchLandingPage/styles';
import { useTheme } from '@src/hooks/useTheme';

type SuggestionItem = {
  title?: string;
  slug?: string;
  collection?: string;
  [key: string]: unknown;
};

type Props = {
  visible: boolean;
  suggestions: SuggestionItem[];
  onItemPress: (item: SuggestionItem) => void;
  styles: ReturnType<typeof themeStyles>;

  history?: SuggestionItem[];
  showHistory?: boolean;
  onClearHistory?: () => void;
};

const SearchSuggestions = ({
  visible,
  suggestions,
  onItemPress,
  styles,
  history = [],
  showHistory = false
}: Props) => {
  const [theme] = useTheme();
  const { t } = useTranslation();
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(-8);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, translateY]);
  if (!visible) return null;

  return (
    <View style={styles.searchResultContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {showHistory ? (
          <>
            {history && (
              <CustomText
                size={fontSize.xs}
                fontFamily={fonts.franklinGothicURW}
                textStyles={styles.searchHistoryText}
                color={theme.dividerPrimary}
              >
                {t('screens.search.text.recentSearches')}
              </CustomText>
            )}
            {(history ?? []).slice(0, 5).map((histItem: SuggestionItem | string, index: number) => {
              const title = typeof histItem === 'string' ? histItem : (histItem.title ?? '');
              const payload =
                typeof histItem === 'string' ? ({ title: histItem } as SuggestionItem) : histItem;
              return (
                <Pressable
                  key={`h-${index}`}
                  style={styles.searchResultText}
                  onPress={() => onItemPress(payload)}
                >
                  <MysteryIcon fill={theme.labelsTextLabelPlace} />
                  <CustomText
                    size={fontSize.xs}
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={styles.searchSuggestionText}
                  >
                    {title.length > 40 ? `${title.slice(0, 34)}...` : title}
                  </CustomText>
                </Pressable>
              );
            })}
          </>
        ) : (
          suggestions?.slice(0, 6).map((item: SuggestionItem, index: number) => {
            const title = item?.title ?? '';
            const displayTitle = title.length > 40 ? `${title.slice(0, 40)}...` : title;

            return (
              <Pressable
                key={index}
                style={styles.searchResultText}
                onPress={() => onItemPress(item)}
              >
                <MysteryIcon fill={theme.labelsTextLabelPlace} />
                <CustomText
                  size={fontSize.xs}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={styles.searchSuggestionText}
                >
                  {displayTitle}
                </CustomText>
              </Pressable>
            );
          })
        )}
      </Animated.View>
    </View>
  );
};

export default SearchSuggestions;
