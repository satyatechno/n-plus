import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import { ArrowIcon, SearchIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import CustomText from '@src/views/atoms/CustomText';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { themeStyles } from '@src/views/pages/main/Home/ActiveLiveBlogListing/styles';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import { useActiveLiveBlogViewModel } from '@src/viewModels/main/Home/ActiveLiveBlogListing/useActiveLiveBlogViewModel';
import { BlogMedia } from '@src/views/organisms/LiveBlogCard/interface';
import CustomToast from '@src/views/molecules/CustomToast';
import LiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LiveBlogListingSkeleton';
import InactiveLiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/InactiveLiveBlogListingSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { LiveBlogVideoItem } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import { isIos } from '@src/utils/platformCheck';

const ActiveLiveBlogListing = () => {
  const {
    activeBlog,
    inactiveBlog,
    goBack,
    onPressViewAll,
    onPressLiveBlogDetails,
    refreshing,
    onRefresh,
    toastMessage,
    setToastMessage,
    activeBlogLoading,
    activeBlogError,
    inactiveBlogLoading,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry,
    getMediaUrl
  } = useActiveLiveBlogViewModel();
  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  if (activeBlogLoading) {
    return (
      <LiveBlogListingSkeleton
        blogStatus={true}
        isShowLiveBlogEnteries={true}
        isShowInactiveBlog={true}
      />
    );
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (activeBlogError instanceof ApolloError || !activeBlog) {
    return (
      <>
        {!isInternetConnection || !internetFail ? (
          <ErrorScreen status="noInternet" onRetry={handleRetry} />
        ) : (
          <ErrorScreen status="error" />
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        variant="dualVariant"
        onPress={goBack}
        headerText={t('screens.liveBlog.title')}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Dem"
        headerTextStyles={styles.headerText}
        headerStyle={isIos ? styles.headerIos : styles.header}
        additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        additionalButtonStyle={styles.additionalButton}
      />
      <View style={styles.listingContainer}>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <FlatList
            data={activeBlog ?? []}
            renderItem={({ item, index }) => (
              <LiveBlogCard
                key={item?.id}
                t={t}
                title={item?.title}
                subTitle={index == 0 ? '' : item?.extract}
                isLive={item?.contentPrioritization?.isActive}
                blogEntries={index == 0 ? item?.linkedEntries?.docs || [] : []}
                mediaUrl={getMediaUrl(item)}
                handleMedia={true}
                onPress={() => onPressLiveBlogDetails(item, true, index + 1)}
                liveBlogTextBlockStyle={
                  item?.openingType == 'none'
                    ? styles.liveBlogTextBlock
                    : styles.liveBlogTextBlockWithImage
                }
              />
            )}
            keyExtractor={(item) => item?.id}
            decelerationRate={0.8}
            removeClippedSubviews={true}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.inactiveBlogContainer}
          />

          {inactiveBlogLoading ? (
            <InactiveLiveBlogListingSkeleton />
          ) : (
            (inactiveBlog ?? [])?.length > 0 && (
              <View>
                <CustomText
                  size={fontSize['4xl']}
                  fontFamily={fonts.notoSerifExtraCondensed}
                  textStyles={styles.inactiveTitle}
                >
                  {t('screens.liveBlog.text.thisIsHowWeTellYou')}
                </CustomText>
                {(inactiveBlog ?? [])?.map(
                  (
                    item: {
                      id: React.Key | null | undefined;
                      title: string;
                      featuredImage: BlogMedia[];
                      mcpId: LiveBlogVideoItem[];
                      slug: string;
                      openingType: string;
                    },
                    index: number
                  ) => (
                    <>
                      <LiveBlogCard
                        t={t}
                        key={item?.id}
                        title={item?.title}
                        mediaUrl={
                          item?.featuredImage?.[0]?.url ??
                          item?.mcpId?.[0]?.value?.content?.heroImage?.url ??
                          ''
                        }
                        onPress={() => onPressLiveBlogDetails(item, false, index + 1)}
                      />
                      {index < (inactiveBlog ?? []).length - 1 && (
                        <View style={styles.inactiveDivider} />
                      )}
                    </>
                  )
                )}
              </View>
            )
          )}

          {(inactiveBlog ?? [])?.length > 0 && (
            <Pressable style={styles.seeAllLiveNewsButton} onPress={onPressViewAll}>
              <CustomText
                weight={'Dem'}
                fontFamily={fonts.franklinGothicURW}
                size={fontSize.xs}
                textStyles={styles.seeAllLiveNewsText}
              >
                {t('screens.liveBlog.text.seeMoreLiveblogs')}
              </CustomText>
              <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
            </Pressable>
          )}
        </ScrollView>
      </View>

      <CustomToast
        type={'error'}
        message={
          toastMessage === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : toastMessage
        }
        subMessage={!isInternetConnection ? t('screens.splash.text.checkConnection') : ''}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />
    </SafeAreaView>
  );
};

export default ActiveLiveBlogListing;
