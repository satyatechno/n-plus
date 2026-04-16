import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Modal, ViewStyle, TextStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@src/hooks/useTheme';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { useHeaderViewModel } from '@src/viewModels/main/Home/StoryPage/Header/useHeaderViewModel';
import { useLiveTVStore } from '@src/zustand/main/liveTVStore';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import { isIos } from '@src/utils/platformCheck';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CategoryListing from '@src/views/pages/main/Home/Category/CategoryListing';
import CustomButton from '@src/views/molecules/CustomButton';

interface Props {
  categories?: string[];
  activeCategory?: string;
  onCategoryPress?: (category: string) => void;
  useHeaderData?: boolean;
  customTheme?: 'light' | 'dark';
  variant?: 'default' | 'homePage';
  containerStyle?: ViewStyle;
  categoryTextStyle?: TextStyle;
}

const CategoryHeader: React.FC<Props> = ({
  categories: propCategories,
  activeCategory,
  onCategoryPress,
  useHeaderData = true,
  customTheme,
  variant = 'default',
  containerStyle,
  categoryTextStyle
}) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme, variant);
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { t } = useTranslation();
  const { setShouldPause } = useLiveTVStore();
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    categories: headerCategories,
    loading,
    error,
    onCategoryPress: headerOnCategoryPress,
    showWebView,
    webUrl,
    handleWebViewClose
  } = useHeaderViewModel();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  useEffect(() => {
    const unsubscribe = (
      navigation as unknown as { addListener: (event: string, callback: () => void) => () => void }
    ).addListener('tabPress', () => {
      handleCloseCategoryModal();
      scrollToTop();
    });

    return unsubscribe;
  }, [navigation]);

  const categories = useHeaderData ? headerCategories : propCategories || [];
  const currentActive = activeCategory || categories[0];

  const handleCategoryPress = (category: string) => {
    handleCloseCategoryModal();
    if (useHeaderData) {
      headerOnCategoryPress(category);
    } else if (onCategoryPress) {
      onCategoryPress(category);
    }
  };

  const handleMorePress = () => {
    setShouldPause(true); // Pause Live TV when More button is clicked
    setShowCategoryModal((prev) => !prev);
  };

  const handleCloseCategoryModal = () => {
    setShouldPause(false); // Resume Live TV when modal is closed
    setShowCategoryModal(false);
  };

  if (loading) {
    return <CategoryHeaderSkeleton />;
  }

  if (error && useHeaderData) {
    return (
      <View style={StyleSheet.flatten(StyleSheet.flatten([styles.container, containerStyle]))}>
        <CustomText size={fontSize.xs} color={theme.menusTextHeaderInactive}>
          {t('screens.login.text.somethingWentWrong')}
        </CustomText>
      </View>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {categories.map((cat, index) => {
            const isActive = cat === currentActive;
            const shouldUseActiveColor = variant === 'homePage' ? false : isActive;

            return (
              <Pressable
                key={`${cat}-${index}`}
                style={styles.itemWrapper}
                onPress={() => handleCategoryPress(cat)}
              >
                <CustomText
                  size={fontSize.xs}
                  fontFamily={fonts.franklinGothicURW}
                  textStyles={StyleSheet.flatten([styles.categoryText, categoryTextStyle])}
                  weight={'Dem'}
                  color={
                    shouldUseActiveColor
                      ? theme.menusTextHeaderActive
                      : theme.menusTextHeaderInactive
                  }
                >
                  {cat}
                </CustomText>

                {isActive && index !== categories.length - 1 && variant === 'default' && (
                  <View style={styles.separator} />
                )}
              </Pressable>
            );
          })}

          {/* More button - only show for homePage variant */}
          {variant === 'homePage' && (
            <CustomButton
              onPress={handleMorePress}
              buttonText={t('screens.common.more')}
              variant="text"
              buttonTextColor={
                showCategoryModal ? theme.menusTextHeaderActive : theme.menusTextHeaderInactive
              }
              buttonTextWeight="Dem"
              buttonTextFontFamily={fonts.franklinGothicURW}
              buttonTextStyles={styles.categoryText}
              buttonStyles={styles.itemWrapper}
              buttonTextSize={fontSize.xs}
            />
          )}
        </ScrollView>
      </View>

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={handleWebViewClose}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={handleWebViewClose}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}

      {showCategoryModal && <CategoryListing onCategorySelect={handleCloseCategoryModal} />}
    </>
  );
};

export default CategoryHeader;

const themeStyles = (theme: AppTheme, variant: 'default' | 'homePage' = 'default') =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    loadingContainer: {
      paddingVertical: actuatedNormalizeVertical(spacing.s),
      alignItems: 'center'
    },
    errorContainer: {
      paddingVertical: actuatedNormalizeVertical(spacing.s),
      alignItems: 'center'
    },
    scroll: {
      alignItems: 'center',
      paddingStart: actuatedNormalize(spacing.s)
    },
    itemWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    categoryText: {
      marginRight: actuatedNormalize(variant === 'homePage' ? spacing.l : spacing.xs),
      top: isIos ? 2 : 0,
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    separator: {
      width: actuatedNormalize(isIos ? 1 : 2),
      height: actuatedNormalizeVertical(16),
      backgroundColor: theme.dividerGrey,
      marginRight: actuatedNormalize(spacing.xs)
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundSecondary
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundSecondary
    }
  });
