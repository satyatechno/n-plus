import React from 'react';
import { FlatList, View, RefreshControl, ScrollView, Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import useAllEpisodesViewModel from '@src/viewModels/main/Videos/AllEpisodes/useAllEpisodesViewModel';
import { themeStyles } from '@src/views/pages/main/Videos/AllEpisodes/styles';
import { fontSize } from '@src/config/styleConsts';
import CarouselCard from '@src/views/molecules/CarouselCard';
import AllEpisodesSkeletonLoader from '@src/views/pages/main/Videos/AllEpisodes/components/AllEpisodesSkeletonLoader';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import CustomText from '@src/views/atoms/CustomText';

const AllEpisodes = () => {
  const { t } = useTranslation();
  const {
    goBack,
    theme,
    allEpisodes,
    loading,
    loadNextPage,
    hasNextPage,
    refreshing,
    handleCardPress,
    refreshList,
    isInternetConnection
  } = useAllEpisodesViewModel();

  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <CustomHeader
          onPress={goBack}
          headerText={t('screens.videos.text.allEpisodes')}
          headerTextFontFamily={fonts.franklinGothicURW}
          headerTextWeight="Dem"
          headerTextSize={fontSize.s}
          headerTextStyles={styles.headerText}
        />
      </View>

      <View style={styles.separator} />

      {!isInternetConnection && !loading ? (
        <ErrorScreen
          status="noInternet"
          onRetry={refreshList}
          contentContainerStyle={styles.errorContainer}
        />
      ) : loading && allEpisodes.length === 0 ? (
        <AllEpisodesSkeletonLoader />
      ) : !allEpisodes || allEpisodes.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshList} />}
        >
          <ErrorScreen
            status="error"
            onRetry={refreshList}
            showErrorButton={false}
            contentContainerStyle={styles.errorContainer}
          />
        </ScrollView>
      ) : (
        <FlatList
          style={styles.flatList}
          data={allEpisodes}
          keyExtractor={(item, index) => `${item?.id}-${index}`}
          renderItem={({ item, index }) => (
            <CarouselCard
              item={item}
              type="videos"
              title={item?.title}
              onPress={() => handleCardPress(item?.slug, index)}
              minutesAgo={formatDurationToMinutes(item?.videoDuration)}
              imageUrl={item?.content?.heroImage?.sizes.square?.url ?? ''}
              isBookmarked={false}
              headingStyles={styles.verticalHeading}
              contentContainerStyle={styles.verticalVideoContainer}
              imageStyle={styles.verticalImageStyle}
              showBookmark={false}
              subheadingStyles={styles.verticalSubheading}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListFooterComponent={() =>
            hasNextPage ? (
              <Pressable
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={loadNextPage}
              >
                {!hasNextPage ? (
                  <AllEpisodesSkeletonLoader />
                ) : (
                  <CustomText
                    weight={'Dem'}
                    fontFamily={fonts.franklinGothicURW}
                    size={fontSize.xs}
                    color={theme.actionCTATextDefault}
                    textStyles={styles.seeMoreText}
                  >
                    {t('screens.liveBlog.text.seeMore')}
                  </CustomText>
                )}
              </Pressable>
            ) : null
          }
          contentContainerStyle={styles.relatedVideosContainer}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshList} />}
        />
      )}
    </SafeAreaView>
  );
};

export default AllEpisodes;
