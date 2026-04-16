//TODO: The whole screen is made on a temporary basis.
import React from 'react';
import { Pressable, RefreshControl, ScrollView } from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import CustomText from '@src/views/atoms/CustomText';
import { ArrowIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import CustomLoader from '@src/views/atoms/CustomLoader';
import useDummyHomeViewModel from '@src/viewModels/main/Home/DummyHome/useDummyHomeViewModel';
import { themeStyles } from '@src/views/pages/main/Home/DummyHome/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';

const DummyHome = () => {
  const {
    storySlugs,
    openStoryPage,
    onSeeAllActiveLiveBLogsPress,
    onSeeLiveTVPress,
    goBack,
    postsLoading,
    refreshLoader,
    onRefresh
  } = useDummyHomeViewModel();
  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader variant="primary" onPress={goBack} headerText={''} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        refreshControl={<RefreshControl refreshing={refreshLoader} onRefresh={onRefresh} />}
      >
        {storySlugs?.map((item, index) => (
          <BookmarkCard
            key={index.toString()}
            category={item?.categories?.title ?? t('screens.notificationAlert.text.politics')}
            heading={item?.title}
            subHeading={`${item?.readTime} min`}
            isBookmarkChecked={false}
            id={index.toString()}
            onPress={() => openStoryPage(item?.slug)}
          />
        ))}

        <Pressable
          style={styles.seeAllLiveBlogButton}
          hitSlop={{ top: 10, bottom: 10 }}
          onPress={onSeeAllActiveLiveBLogsPress}
        >
          <CustomText
            weight={'Dem'}
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.s}
            textStyles={styles.seeAllLiveBlogButtonText}
          >
            {t('screens.liveBlog.title')}
          </CustomText>

          <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
        </Pressable>

        <Pressable
          style={styles.seeLiveTVButton}
          hitSlop={{ top: 10, bottom: 10 }}
          onPress={onSeeLiveTVPress}
        >
          <CustomText
            weight={'Dem'}
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.s}
            textStyles={styles.seeAllLiveBlogButtonText}
          >
            {t('screens.liveBlog.text.live')}
          </CustomText>

          <ArrowIcon stroke={theme.greyButtonSecondaryOutline} />
        </Pressable>
      </ScrollView>
      {postsLoading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default DummyHome;
