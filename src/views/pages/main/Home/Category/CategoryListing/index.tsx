import React, { useMemo } from 'react';
import { FlatList, Modal, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import { useTheme } from '@src/hooks/useTheme';
import type { CategoryItem } from '@src/models/main/Home/Category/CategoryListing';
import { useCategoryListingViewModel } from '@src/viewModels/main/Home/Category/CategoryListing/useCategoryListingViewModel';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CategoryListingSkeleton from '@src/views/pages/main/Home/Category/CategoryListing/components/CategoryListingSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomToast from '@src/views/molecules/CustomToast';
import { themeStyles } from '@src/views/pages/main/Home/Category/CategoryListing/styles';
import CategoryItemComponent from '@src/views/pages/main/Home/Category/CategoryListing/components/CategoryItem';
import { SCREEN_HEIGHT } from '@src/utils/pixelScaling';

interface CategoryListingProps {
  onCategorySelect?: () => void;
}

const CategoryListing = ({ onCategorySelect }: CategoryListingProps) => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const { t } = useTranslation();
  const {
    expandedCategories,
    handleToggleCategory,
    categoryData,
    handleNavigateToCategory,
    showWebView,
    webUrl,
    handleWebViewClose,
    error,
    isLoading,
    isInternetConnection,
    handleRetry,
    toastMessage,
    toastType,
    setToastMessage
  } = useCategoryListingViewModel();

  if (error instanceof ApolloError || !categoryData) {
    return (
      <View style={styles.container}>
        <ErrorScreen
          status={!isInternetConnection ? 'noInternet' : 'error'}
          onRetry={handleRetry}
          contentContainerStyle={{
            marginTop: '-70%'
          }}
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: CategoryItem }) => (
    <CategoryItemComponent
      item={item}
      isExpanded={expandedCategories.has(item?.id ?? '')}
      onToggle={handleToggleCategory}
      onNavigate={handleNavigateToCategory}
      onCategorySelect={onCategorySelect}
      theme={theme}
    />
  );

  if (isLoading) {
    return <View style={styles.container}>{<CategoryListingSkeleton />}</View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id ?? ''}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: SCREEN_HEIGHT * 0.78 }}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListFooterComponent={<View style={styles.divider} />}
      />

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

      <CustomToast
        type={toastType}
        message={toastMessage}
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />
    </View>
  );
};

export default CategoryListing;
