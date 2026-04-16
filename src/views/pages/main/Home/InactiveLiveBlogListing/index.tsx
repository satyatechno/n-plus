import React, { useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import { SearchIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { themeStyles } from '@src/views/pages/main/Home/InactiveLiveBlogListing/styles';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import { useInactiveLiveBlogViewModel } from '@src/viewModels/main/Home/InactiveLiveBlogListing/useInactiveLiveBlogViewModel';
import CustomToast from '@src/views/molecules/CustomToast';
import LiveBlogListingSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/LiveBlogListingSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';

const InactiveLiveBlogListing = () => {
  const {
    inactiveBlog,
    goBack,
    onPressLiveBlogDetails,
    refreshing,
    onRefresh,
    toastMessage,
    setToastMessage,
    inactiveBlogLoading,
    inactiveBlogError,
    internetLoader,
    isInternetConnection,
    internetFail,
    handleRetry
  } = useInactiveLiveBlogViewModel();
  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  if (inactiveBlogLoading) {
    return (
      <LiveBlogListingSkeleton
        blogStatus={false}
        isShowInactiveBlog={false}
        isShowLiveBlogEnteries={false}
      />
    );
  }

  if (internetLoader) {
    return <ErrorScreen status="loading" />;
  }

  if (inactiveBlogError instanceof ApolloError || !inactiveBlog) {
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
        headerText={t('screens.liveBlog.text.thisIsHowWeTellYou')}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Dem"
        headerTextStyles={styles.headerText}
        headerStyle={styles.header}
        additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        additionalButtonStyle={styles.additionalButton}
      />
      <View style={styles.listingContainer}>
        <FlatList
          data={inactiveBlog ?? []}
          keyExtractor={(item) => item?.id}
          renderItem={({ item, index }) => (
            <LiveBlogCard
              key={index}
              t={t}
              title={item?.title}
              subTitle={item?.extract}
              isLive={item?.liveblogStatus}
              mediaUrl={
                item?.featuredImage?.[0]?.url ??
                item?.mcpId?.[0]?.value?.content?.heroImage?.url ??
                ''
              }
              onPress={() => onPressLiveBlogDetails(item, index + 1)}
              headingStyle={styles.inactiveTitle}
            />
          )}
          removeClippedSubviews={true}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.inactiveBlogContainer}
        />
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

export default InactiveLiveBlogListing;
