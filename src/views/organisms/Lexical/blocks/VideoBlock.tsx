import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import RNVideoPlayer from '@src/views/organisms/RNVideo';
import { generateVODAdTagUrl, extractMcpIdFromVideoUrl } from '@src/views/organisms/RNVideo/utils';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useNetworkStore from '@src/zustand/networkStore';

export interface MediaData {
  url: string;
  alt?: string;
}

export interface VideoData {
  id: string;
  title: string;
  videoUrl: string;
  aspectRatio: string;
  closedCaptionUrl?: string;
  videoDuration: number;
  videoType?: string;
  slug: string;
  publishedAt?: string;
  createdAt?: string;
  readTime?: number;
  mcpid?: number;
  content?: {
    heroImage?: MediaData;
  };
}

interface VideoBlockProps {
  customTheme?: 'light' | 'dark';
  videoRelated: {
    relationTo: string;
    value: VideoData;
  }[];
}

const VideoBlock: React.FC<VideoBlockProps> = ({ videoRelated, customTheme }) => {
  const { isInternetConnection } = useNetworkStore();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const video = videoRelated?.[0]?.value ?? {};

  const videoUrl = video?.videoUrl ?? '';
  const title = video?.title ?? '';
  const thumbnail = video?.content?.heroImage?.url ?? '';

  // Generate Ad Tag URL for IMA SDK
  const adTagUrl = useMemo(() => {
    const mcpId = video?.mcpid?.toString() || extractMcpIdFromVideoUrl(videoUrl);

    if (!mcpId) {
      return undefined;
    }

    return generateVODAdTagUrl({
      mcpId,
      programName: title,
      site: 'nmas',
      pageType: 'EpisodePage' // Use a valid type from VideoPageType
    });
  }, [video?.mcpid, videoUrl, title]);

  return (
    <View style={styles.container}>
      {!isInternetConnection ? (
        <ErrorScreen
          status="noInternet"
          showRetryButton={false}
          fontSizeHeading={fontSize.xs}
          fontSizeSubheading={fontSize.xxxs}
          containerStyles={styles.noInternetContainer}
        />
      ) : (
        <View style={styles.videoContainer}>
          <RNVideoPlayer
            videoUrl={videoUrl}
            thumbnail={thumbnail}
            adTagUrl={adTagUrl}
            adLanguage="es"
            videoType="vod"
            autoStart={false}
            initialSeekTime={0}
          />
        </View>
      )}

      {!!title && (
        <CustomText
          size={fontSize.xxs}
          weight="Boo"
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.videoCaption}
        >
          {title}
        </CustomText>
      )}
    </View>
  );
};

export default VideoBlock;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    videoContainer: {
      width: '100%',
      aspectRatio: 16 / 9
    },
    videoCaption: {
      color: theme.labelsTextLabelPlace,
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      alignSelf: 'flex-start',
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      marginLeft: actuatedNormalize(spacing.xs),
      backgroundColor: theme.mainBackgroundDefault
    },
    blankView: {
      height: actuatedNormalizeVertical(200),
      width: actuatedNormalize(350),
      backgroundColor: theme.filledButtonAction,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius.m
    },
    textStyles: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      color: theme.labelsTextLabelTime
    },
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
    },
    fullScreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.mainBackgroundDefault,
      zIndex: 1000
    }
  });
