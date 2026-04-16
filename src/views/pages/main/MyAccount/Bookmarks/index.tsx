import React, { useEffect, useMemo } from 'react';
import { Animated, Modal, RefreshControl, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  themeStyles,
  type BookmarksStyles
} from '@src/views/pages/main/MyAccount/Bookmarks/styles';
import { fonts } from '@src/config/fonts';
import { COLLECTION_TYPE } from '@src/config/enum';
import TopicChips, { type Topic } from '@src/views/organisms/TopicChips';
import RenderCollection from '@src/views/organisms/RenderCollection';
import { BookmarkListItem } from '@src/models/main/MyAccount/Bookmarks';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomModal from '@src/views/organisms/CustomModal';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { BookmarkCollectionIcon } from '@src/assets/icons';
import CustomWebView from '@src/views/atoms/CustomWebView';
import RenderCollectionSkeleton from '@src/views/organisms/RenderCollectionSkeleton';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useBookmarksPageViewModel from '@src/viewModels/main/MyAccount/Bookmark/useBookmarksPageViewModel';

const Bookmarks = () => {
  const {
    theme,
    t,
    contentChipTopics,
    onChipPress,
    hasNext,
    loadingMore,
    onLoadMore,
    searchItems,
    getUserBookmarkLoading,
    collection,
    onToggleBookmark,
    toastType,
    toastMessage,
    setToastMessage,
    bookmarkModalVisible,
    onCancelPress,
    onConfirmPress,
    setBookmarkModalVisible,
    handleSearchNavigation,
    goBack,
    onRetry,
    refreshLoader,
    getUserBookmarkData,
    showWebView,
    setShowWebView,
    webUrl
  } = useBookmarksPageViewModel();

  const styles: BookmarksStyles = useMemo(() => themeStyles(theme), [theme]);

  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  if (showWebView) {
    return (
      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWebView(false)}
      >
        <Animated.View
          style={[styles.webViewContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => setShowWebView(false)}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Animated.View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.myAccount.options.saved')}
        headerTextColor={theme.newsTextTitlePrincipal}
        headerTextWeight="Boo"
        headerTextFontFamily={fonts.franklinGothicURW}
        headerStyle={styles.headerStyles}
        headerTextStyles={styles.headerTextStyles}
      />

      <TopicChips
        topics={contentChipTopics}
        heading=""
        headingTextstyle={styles.chipsHeadingText}
        preselect
        listContainerStyle={styles.chipsListContainer}
        onPress={(value: string | Topic) => {
          if (typeof value === 'string') {
            onChipPress(value as COLLECTION_TYPE);
          }
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRetry} />}
      >
        {getUserBookmarkLoading && !loadingMore ? (
          <RenderCollectionSkeleton styles={styles} collection={collection} />
        ) : (
          <RenderCollection
            key={collection}
            data={
              searchItems?.length
                ? searchItems.map((item) => ({ ...item, interactiveUrl: undefined }))
                : getUserBookmarkData?.map((item: BookmarkListItem) => ({
                    ...item,
                    interactiveUrl: undefined
                  }))
            }
            styles={styles}
            collection={collection}
            onToggleBookmark={onToggleBookmark}
            theme={theme}
            onPress={(payload: { index?: number }) =>
              handleSearchNavigation({
                ...(payload || {}),
                index: payload && payload.index !== undefined ? String(payload.index) : undefined
              })
            }
            hasNext={hasNext}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            emptyIcon={
              <BookmarkCollectionIcon
                width={actuatedNormalize(64)}
                height={actuatedNormalizeVertical(64)}
              />
            }
            emptyTitle={t('screens.bookmarks.empty.title')}
            emptySubtitle={t('screens.bookmarks.empty.subtitle')}
          />
        )}
      </ScrollView>

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />

      <CustomModal
        visible={bookmarkModalVisible}
        modalTitle={t('screens.guestMyAccount.restricted.acessBookmarks')}
        modalMessage={t('screens.guestMyAccount.restricted.simplyLogIn')}
        cancelButtonText={t('screens.splash.text.login')}
        confirmButtonText={t('screens.splash.text.signUp')}
        onCancelPress={onCancelPress}
        onConfirmPress={onConfirmPress}
        onOutsidePress={() => setBookmarkModalVisible(false)}
        onRequestClose={() => setBookmarkModalVisible(false)}
        buttonContainerStyle={styles.modalButtonContainer}
      />
    </SafeAreaView>
  );
};

export default Bookmarks;
