import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { ArrowUpIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import type { CategoryItem as CategoryItemType } from '@src/models/main/Home/Category/CategoryListing';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';

interface CategoryItemProps {
  item: CategoryItemType;
  isExpanded: boolean;
  onToggle: (item: CategoryItemType) => void;
  onNavigate: (category: CategoryItemType) => void;
  onCategorySelect?: () => void;
  theme: AppTheme;
}

const CategoryItem = ({ item, isExpanded, onToggle, onNavigate, theme }: CategoryItemProps) => (
  <View>
    <View style={styles.categoryItem}>
      <Pressable style={styles.categoryTextPressable} onPress={() => onNavigate(item)}>
        <CustomText
          weight="Dem"
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.categoryTitle}
          size={fontSize.xs}
          color={theme.newsTextTitlePrincipal}
        >
          {item.title}
        </CustomText>
      </Pressable>

      {item.hasSubcategories ? (
        <Pressable
          hitSlop={{ top: 15, bottom: 15, left: 25, right: 25 }}
          style={styles.iconContainer}
          onPress={() => onToggle(item)}
        >
          <ArrowUpIcon
            style={{ transform: [{ rotate: isExpanded ? '0deg' : '90deg' }] }}
            color={theme.newsTextTitlePrincipal}
          />
        </Pressable>
      ) : null}
    </View>

    {item.hasSubcategories && isExpanded && item.subcategories && (
      <View style={styles.subcategoriesContainer}>
        {item.subcategories.map((subcategory, index) => (
          <Pressable
            key={subcategory.id}
            style={[
              styles.subcategoryItem,
              index === (item.subcategories?.length ?? 0) - 1 && styles.lastSubcategoryItem
            ]}
            onPress={() => onNavigate(subcategory)}
          >
            <CustomText
              weight="Boo"
              fontFamily={fonts.franklinGothicURW}
              textStyles={styles.subcategoryTitle}
              size={fontSize.xs}
              color={theme.newsTextTitlePrincipal}
            >
              {subcategory.title}
            </CustomText>
          </Pressable>
        ))}
      </View>
    )}
  </View>
);

export default CategoryItem;

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryTextPressable: {
    flex: 1
  },
  categoryTitle: {
    lineHeight: actuatedNormalizeVertical(lineHeight.l),
    letterSpacing: letterSpacing.none,
    top: actuatedNormalizeVertical(2)
  },
  subcategoriesContainer: {
    marginTop: actuatedNormalizeVertical(spacing.s)
  },
  subcategoryItem: {
    marginBottom: actuatedNormalizeVertical(spacing.s)
  },
  lastSubcategoryItem: {
    marginBottom: 0
  },
  subcategoryTitle: {
    lineHeight: actuatedNormalizeVertical(lineHeight.l),
    letterSpacing: letterSpacing.none
  },
  iconContainer: {
    paddingHorizontal: actuatedNormalize(10)
  }
});
