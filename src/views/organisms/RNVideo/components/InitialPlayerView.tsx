import React from 'react';
import { StyleSheet, TouchableOpacity, Pressable, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { PlayCircleWhite } from '@src/assets/icons';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import { FallbackImage } from '@src/assets/images';
import { useTheme } from '@src/hooks/useTheme';
import { EpisodeData } from '@src/models/main/Home/StoryPage/JWVideoPlayer';
import CustomImage from '@src/views/atoms/CustomImage';
import { colors } from '@src/themes/colors';
import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_ORGANISMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

type VideoContent = {
  content?: {
    heroImage?: {
      url?: string;
    };
  };
  thumbnailImageUrl?: string;
};

type Media = {
  thumbnailURL?: string;
};

type InitialPlayerViewProps = {
  onStart: () => void;
  videos?: VideoContent[];
  media?: Media;
  activeVideoIndex?: number;
  thumbnail?: string;
  data?: EpisodeData;
  aspectRatio?: number | string;
  reelMode?: boolean;
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
  };
};

const InitialPlayerView: React.FC<InitialPlayerViewProps> = ({
  onStart,
  videos,
  activeVideoIndex,
  thumbnail,
  data,
  aspectRatio = 16 / 9,
  reelMode,
  analyticsConfig
}) => {
  const videoThumbnailUrl =
    data?.Video?.content?.heroImage?.url ||
    data?.Videos?.docs?.[0]?.productions?.specialImage?.url ||
    (typeof activeVideoIndex === 'number'
      ? videos?.[activeVideoIndex]?.thumbnailImageUrl
      : videos?.[0]?.thumbnailImageUrl);

  const heroUrl =
    typeof activeVideoIndex === 'number'
      ? videos?.[activeVideoIndex]?.content?.heroImage?.url
      : undefined;

  const displayUrl = heroUrl || thumbnail || videoThumbnailUrl || null;

  const [theme] = useTheme();

  return (
    <Pressable
      style={[styles.container, reelMode ? { height: '100%' } : { aspectRatio }]}
      onPress={() => {
        // Log analytics event for tap on initial player view
        logSelectContentEvent({
          screen_name: analyticsConfig?.screenName,
          organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
          content_type: `${ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER} | ${activeVideoIndex !== undefined ? activeVideoIndex + 1 : 1}`,
          content_action: ANALYTICS_ATOMS.TAP_AND_SWIPE_RIGHT,
          content_title: analyticsConfig?.videoTitle || 'undefined',
          Tipo_Contenido: analyticsConfig?.contentType
        });

        // Call original onStart
        onStart();
      }}
    >
      {displayUrl ? (
        <CustomImage
          source={{ uri: displayUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
          fallbackComponent={
            <View style={styles.fallbackImageContainerStyle}>
              <FallbackImage width="100%" height="101%" preserveAspectRatio="xMidYMid slice" />
            </View>
          }
        />
      ) : (
        <View style={styles.fallbackImageContainerStyle}>
          <FallbackImage width="100%" height="101%" preserveAspectRatio="xMidYMid slice" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', theme.gradientOverlay91Alpha]}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity onPress={onStart} style={styles.iconWrapper}>
        <PlayCircleWhite />
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.black,
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  iconWrapper: {
    position: 'absolute',
    bottom: actuatedNormalizeVertical(spacing.xxs),
    left: actuatedNormalize(spacing.xxs)
  },
  fallbackImageContainerStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF3640',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
});

export default InitialPlayerView;
