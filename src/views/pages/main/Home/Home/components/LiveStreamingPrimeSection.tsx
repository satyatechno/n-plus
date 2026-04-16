import React, { useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { TFunction } from 'i18next';
import { ApolloQueryResult } from '@apollo/client';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import RNLiveStreamPlayer from '@src/views/organisms/RNVideo/RNLiveStreamPlayer';
import EmbedBlock from '@src/views/organisms/Lexical/blocks/EmbedBlock';
import useLiveStreamingViewModel from '@src/viewModels/main/Home/Home/useLiveStreamingViewModel';
import LiveTVChannelVideoSkeleton from '@src/views/pages/main/Home/LiveTV/components/LiveTVChannelVideoSkeleton';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

interface LiveStreaningPrimeSectionProps {
  t: TFunction<'translation', undefined>;
  theme: AppTheme;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const LiveStreamingPrimeSection = ({
  t,
  theme,
  registerRefetch,
  sectionGapStyle
}: LiveStreaningPrimeSectionProps) => {
  const {
    liveStreamingData,
    signalUrl,
    youtubeLiveVideoUrl,
    showLiveStreaming,
    refetchLiveStreaming
  } = useLiveStreamingViewModel();
  const styles = themeStyles();
  const { shouldAutoPlay } = useSettingsStore();

  useEffect(() => {
    registerRefetch(() => refetchLiveStreaming());
  }, [registerRefetch, refetchLiveStreaming]);

  if (!liveStreamingData) {
    return null;
  }

  return (
    <View style={sectionGapStyle}>
      <CustomText
        weight="Dem"
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.xs}
        color={theme.tagsTextBreakingNews}
        textStyles={styles.breakingNewsText}
      >
        {t('screens.home.text.breakingNews')}
      </CustomText>
      {liveStreamingData?.title && (
        <CustomText
          weight="M"
          fontFamily={fonts.mongoose}
          size={fontSize['10xl']}
          color={theme.sectionTextTitleSpecial}
          textStyles={styles.title}
        >
          {liveStreamingData?.title.toUpperCase()}
        </CustomText>
      )}
      {liveStreamingData?.description && (
        <CustomText
          fontFamily={fonts.notoSerif}
          size={fontSize.s}
          color={theme.sectionTextTitleSpecial}
          textStyles={styles.description}
        >
          {liveStreamingData?.description}
        </CustomText>
      )}
      <View style={styles.liveStreamingView}>
        {youtubeLiveVideoUrl ? (
          <View style={styles.youtubeView}>
            <EmbedBlock
              url={youtubeLiveVideoUrl as string}
              provider="youtube"
              contentContainerStyle={styles.youtubePlayer}
            />
          </View>
        ) : signalUrl && showLiveStreaming ? (
          <RNLiveStreamPlayer
            videoUrl={signalUrl}
            autoStart={shouldAutoPlay()}
            analyticsConfig={{
              screenName: ANALYTICS_COLLECTION.HOME_PAGE,
              contentType: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
              organisms: ANALYTICS_ORGANISMS.HOME_PRIME_SECTION.LIVE_STREAMING,
              channel: liveStreamingData?.liveSignal ?? undefined,
              videoTitle: liveStreamingData?.title || liveStreamingData?.liveSignal
            }}
          />
        ) : (
          <LiveTVChannelVideoSkeleton />
        )}
      </View>
    </View>
  );
};

export default React.memo(LiveStreamingPrimeSection);

const themeStyles = () =>
  StyleSheet.create({
    breakingNewsText: {
      letterSpacing: letterSpacing.sm,
      lineHeight: lineHeight.s,
      paddingHorizontal: spacing.xs,
      paddingTop: spacing.xxxs
    },
    title: {
      letterSpacing: letterSpacing.none,
      lineHeight: lineHeight['10xl'],
      paddingHorizontal: spacing.xs,
      marginBottom: 0,
      paddingTop: spacing.xxxs
    },
    description: {
      letterSpacing: letterSpacing.s,
      lineHeight: lineHeight.l,
      paddingHorizontal: spacing.xs,
      marginBottom: 0
    },
    liveStreamingView: {
      marginTop: spacing.xxs
    },
    youtubeView: {
      width: '100%',
      alignItems: 'center'
    },
    youtubePlayer: {
      marginTop: 0,
      borderRadius: 0,
      width: '100%'
    }
  });
