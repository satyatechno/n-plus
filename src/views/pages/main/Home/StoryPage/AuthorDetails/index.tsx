import React from 'react';
import { FlatList, ScrollView, View, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomHeader from '@src/views/molecules/CustomHeader';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/AuthorDetails/styles';
import useAuthorDetailsViewModel from '@src/viewModels/main/Home/StoryPage/AuthorDetails/useAuthorDetailsViewModel';
import { AuthorDetailSkeleton } from '@src/views/pages/main/Home/StoryPage/AuthorDetails/components/AuthorDetailsLoader';
import CustomModal from '@src/views/organisms/CustomModal';
import AuthorCard from '@src/views/organisms/AuthorDetail';
import CustomButton from '@src/views/molecules/CustomButton';
import RecommendedSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/RecommendationSkeletonLoader';
import ErrorScreen from '@src/views/organisms/ErrorScreen';

const AuthorDetail: React.FC = () => {
  const {
    theme,
    t,
    onGoBack,
    authorDetails,
    authorArticle,
    authorDetailsLoading,
    onToggleBookmark,
    onArticleCardPress,
    onArticleBookmarkPress,
    onShare,
    isBookmark,
    setLoading,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onCancelPress,
    toastType,
    toastMessage,
    onConfirmPress,
    setToastMessage,
    hasNext,
    onLoadMore,
    loadMoreLoading,
    onRefresh,
    refreshLoader,
    isInternetConnection,
    authorArticleLoading
  } = useAuthorDetailsViewModel();
  const styles = themeStyles(theme);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomHeader onPress={onGoBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRefresh} />}
      >
        {authorDetailsLoading ? (
          <AuthorDetailSkeleton />
        ) : !authorDetails ? (
          !isInternetConnection ? (
            <ErrorScreen
              status="noInternet"
              onRetry={onRefresh}
              containerStyles={styles.errorScreen}
            />
          ) : (
            <ErrorScreen
              status="error"
              showErrorButton={true}
              OnPressRetry={onRefresh}
              buttonText={t('screens.splash.text.tryAgain')}
              containerStyles={styles.errorScreen}
            />
          )
        ) : (
          <>
            <AuthorCard
              authorDetails={{
                id: authorDetails?.id,
                title: authorDetails?.name,
                position: authorDetails?.position,
                heroImage: { url: authorDetails?.photo?.url },
                description: authorDetails?.bio as unknown as Record<string, unknown>
              }}
              isBookmark={isBookmark}
              onShare={onShare}
              onToggleBookmark={onToggleBookmark}
              name={authorDetails?.name}
              position={authorDetails?.position}
              imageUrl={authorDetails?.photo?.url}
              bio={authorDetails?.bio as unknown as Record<string, unknown>}
            />

            {authorArticleLoading ? (
              <RecommendedSkeleton />
            ) : (
              authorArticle.length > 0 && (
                <>
                  <CustomText
                    size={fontSize['4xl']}
                    weight="R"
                    fontFamily={fonts.notoSerifExtraCondensed}
                    textStyles={styles.moreFromAuthorText}
                  >
                    {t('screens.authorDetails.text.moreFromAuthor')}
                  </CustomText>

                  <FlatList
                    data={authorArticle}
                    renderItem={({ item, index }) => (
                      <BookmarkCard
                        category={item.category?.title}
                        heading={item.title}
                        subHeading={`${item.readTime} min`}
                        isBookmarkChecked={item.isBookmarked}
                        onPressingBookmark={onArticleBookmarkPress(item, index)}
                        onPress={() => {
                          onArticleCardPress(item, index);
                          setLoading(true);
                        }}
                        id={item.id}
                      />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                    ListFooterComponent={() => (
                      <View style={styles.footerContainer}>
                        {loadMoreLoading ? (
                          <View style={styles.loadingContainer}>
                            <RecommendedSkeleton />
                          </View>
                        ) : hasNext ? (
                          <CustomButton
                            onPress={onLoadMore}
                            buttonText={t('screens.common.seeMore')}
                            variant="text"
                            buttonTextColor={theme.newsTextTitlePrincipal}
                            buttonTextWeight="Dem"
                            buttonTextFontFamily={fonts.franklinGothicURW}
                            buttonTextStyles={styles.seeAllText}
                            buttonStyles={styles.seeAllButton}
                            hitSlop={styles.seeAllButtonHitSlop}
                          />
                        ) : null}
                      </View>
                    )}
                  />
                </>
              )
            )}
          </>
        )}
      </ScrollView>

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
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

export default AuthorDetail;
