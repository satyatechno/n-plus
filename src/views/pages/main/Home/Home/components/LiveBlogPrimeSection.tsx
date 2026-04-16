import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import { AppTheme } from '@src/themes/theme';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import { spacing, lineHeight } from '@src/config/styleConsts';
import { useLiveBlogPrimeSectionViewModel } from '@src/viewModels/main/Home/Home/useLiveBlogPrimeSection';
import SeeAllButton from '@src/views/molecules/SeeAllButton';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';

interface LiveBlogPrimeSection {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const LiveBlogPrimeSection = ({
  t,
  theme,
  registerRefetch,
  sectionGapStyle
}: LiveBlogPrimeSection) => {
  const {
    liveBlogData,
    liveBlogEnteries,
    onPressLiveBlogDetails,
    onPressViewAll,
    refetchLiveBlog
  } = useLiveBlogPrimeSectionViewModel();

  const styles = useMemo(() => themeStyles(theme), [theme]);

  useEffect(() => {
    registerRefetch(() => refetchLiveBlog());
  }, [registerRefetch, refetchLiveBlog]);

  if (!liveBlogData) {
    return null;
  }

  return (
    <View style={sectionGapStyle}>
      <LiveBlogCard
        key={liveBlogData?.id}
        t={t}
        title={liveBlogData?.title}
        isLive={liveBlogData?.contentPrioritization?.isActive}
        isShowTitleOnTop={true}
        blogEntries={liveBlogEnteries ?? []}
        mediaUrl={liveBlogData?.featuredImage?.[0]?.url ?? ''}
        vintageUrl={liveBlogData?.featuredImage?.[0]?.sizes?.vintage?.url ?? ''}
        blogMediaContainerStyle={styles.blogMediaContainerStyle}
        handleMedia={true}
        onPress={() => onPressLiveBlogDetails(liveBlogData, true)}
        headingStyle={styles.lbHeading}
      />

      <SeeAllButton
        text={t('screens.home.text.goToLiveNews')}
        onPress={onPressViewAll}
        color={theme.greyButtonSecondaryOutline}
        buttonStyle={styles.seeAllLiveNewsButton}
        textStyle={styles.seeAllLiveNewsText}
      />
    </View>
  );
};

export default React.memo(LiveBlogPrimeSection);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    seeAllLiveNewsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.xxs,
      marginTop: spacing.xs,
      marginHorizontal: spacing.xs
    },
    blogMediaContainerStyle: {
      width: SCREEN_WIDTH - spacing.xs * 2,
      height: 'auto',
      aspectRatio: 4 / 5,
      marginHorizontal: spacing.xs,
      marginTop: spacing.xxxxs,
      backgroundColor: theme.toggleIcongraphyDisabledState
    },
    lbHeading: {
      marginTop: spacing.xxxs,
      lineHeight: lineHeight['3xl'],
      paddingTop: spacing.xxxs,
      marginBottom: spacing.xxxs
    },
    seeAllLiveNewsText: {
      lineHeight: lineHeight.s
    }
  });
