import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, TouchableWithoutFeedback, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { SORTING_TYPE } from '@src/config/enum';
import { themeStyles } from '@src/views/pages/main/Home/Search/SearchLandingPage/styles';

type Props = {
  visible: boolean;
  sorting: SORTING_TYPE;
  onSelect: (value: SORTING_TYPE) => void;
  onRequestClose: () => void;
  styles: ReturnType<typeof themeStyles>;
};

const FilterOption = ({ visible, sorting, onSelect, onRequestClose, styles }: Props) => {
  const { t } = useTranslation();
  const [shouldRender, setShouldRender] = useState<boolean>(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ]).start();
    } else if (shouldRender) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: -8,
          duration: 120,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true
        })
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  const filterOptions: Array<{ title: string; StoreType: SORTING_TYPE }> = [
    { title: t('screens.search.text.mostRecent'), StoreType: SORTING_TYPE.MOST_RECENT },
    { title: t('screens.search.text.relevance'), StoreType: SORTING_TYPE.RELEVANCE }
  ];

  const handleOptionPress = (value: SORTING_TYPE) => {
    onSelect(value);
    onRequestClose();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.filterBackdrop} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.filterPopoverContainer,
          {
            opacity: opacity,
            transform: [{ translateY }]
          }
        ]}
      >
        {filterOptions.map(({ title, StoreType }) => (
          <Pressable
            key={StoreType}
            style={styles.filterOptionRow}
            onPress={() => handleOptionPress(StoreType)}
          >
            <View
              style={[
                styles.radioOuter,
                sorting === StoreType && {
                  borderColor: styles?.radioInnerSelected?.backgroundColor
                }
              ]}
            >
              {sorting === StoreType ? <View style={styles.radioInnerSelected} /> : null}
            </View>
            <CustomText
              size={fontSize.xs}
              fontFamily={fonts.franklinGothicURW}
              weight={sorting === StoreType ? 'Dem' : undefined}
            >
              {title}
            </CustomText>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
};

export default FilterOption;
