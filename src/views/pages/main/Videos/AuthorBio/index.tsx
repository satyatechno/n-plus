import React from 'react';
import { FlatList, RefreshControl, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomToast from '@src/views/molecules/CustomToast';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { themeStyles } from '@src/views/pages/main/Videos/AuthorBio/styles';
import CustomModal from '@src/views/organisms/CustomModal';
import AuthorCard from '@src/views/organisms/AuthorDetail';
import { ProgramItem } from '@src/models/main/Videos/Programs';
import InfoCard from '@src/views/molecules/InfoCard';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import useAuthorBioViewModel from '@src/viewModels/main/Videos/AuthorBio/useAuthorBioViewModel';
import AuthorBioSkeleton from '@src/views/pages/main/Videos/AuthorBio/components/AuthorBioSkeleton';

const AuthorBio: React.FC = () => {
  const {
    theme,
    t,
    onGoBack,
    authorDetails,
    // onToggleBookmark,  --> Commenting it out for now; this code may be useful in the future.
    onShare,
    isBookmark,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    onCancelPress,
    toastType,
    toastMessage,
    onConfirmPress,
    setToastMessage,
    onRefresh,
    refreshLoader,
    authorBioLoading,
    handleCardPress,
    isInternetConnection
  } = useAuthorBioViewModel();
  const styles = themeStyles(theme);

  const authorCardDetails = {
    id: authorDetails?.id,
    title: authorDetails?.title,
    position: authorDetails?.position,
    heroImage: { url: authorDetails?.heroImage?.url },
    description: authorDetails?.description
  };

  const renderItem = ({ item, index }: { item: ProgramItem; index: number }) => (
    <InfoCard
      onPress={() => handleCardPress(item, index)}
      title={item?.title}
      titleFontFamily={fonts.notoSerif}
      titleFontWeight="R"
      titleFontSize={fontSize.m}
      subTitleColor={theme.labelsTextLabelPlay}
      imageUrl={item?.heroImage?.sizes?.vintage?.url}
      subTitle={item?.schedule}
      item={item}
      aspectRatio={4 / 5}
      imageWidth={actuatedNormalize(178)}
      contentContainerStyle={styles.contentContainerStyle}
      titleStyles={styles.titleStyles}
      subTitleStyles={styles.subTitleStyles}
    />
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomHeader onPress={onGoBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRefresh} />}
      >
        {!isInternetConnection && !authorDetails?.slug ? (
          <ErrorScreen
            status="noInternet"
            onRetry={onRefresh}
            containerStyles={styles.errorScreenStyle}
          />
        ) : !authorBioLoading && !authorDetails ? (
          <ErrorScreen
            status="error"
            showErrorButton={false}
            containerStyles={styles.errorScreenStyle}
          />
        ) : (
          <>
            {authorBioLoading ? (
              <AuthorBioSkeleton />
            ) : (
              <>
                <AuthorCard
                  authorDetails={authorCardDetails}
                  isBookmark={isBookmark}
                  onShare={onShare}
                  name={authorDetails?.title}
                  position={authorDetails?.position}
                  imageUrl={authorDetails?.heroImage?.url}
                  bio={authorDetails?.description}
                  LexicalContentBio={false}
                />

                {(authorDetails?.programs?.length ?? 0) > 0 && (
                  <>
                    <CustomText
                      fontFamily={fonts.notoSerifExtraCondensed}
                      size={fontSize['4xl']}
                      weight="R"
                      textStyles={styles.relatedHeading}
                    >
                      {t('screens.program.text.enriqueAcevedoPrograms', {
                        name: authorDetails?.title ?? ''
                      })}
                    </CustomText>
                    <FlatList
                      data={authorDetails?.programs}
                      renderItem={renderItem}
                      numColumns={2}
                      keyExtractor={(_, i) => `item-${i}`}
                      onEndReachedThreshold={0.5}
                      refreshing={refreshLoader}
                      initialNumToRender={6}
                      showsVerticalScrollIndicator={false}
                      columnWrapperStyle={styles.columnWrapper}
                      scrollEnabled={false}
                    />
                  </>
                )}
              </>
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

export default AuthorBio;
