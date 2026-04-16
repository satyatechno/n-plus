import React, { useCallback, useMemo, useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { useVideoPlayerContext } from '@src/views/organisms/RNVideo/context/VideoPlayerContext';
import { overlayStyles } from '@src/views/organisms/RNVideo/styles';
import { colors } from '@src/themes/colors';
import { spacing } from '@src/config/styleConsts';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  AudioMute,
  FullScreen,
  ShareIcon,
  ClosedCaption
} from '@src/assets/icons';

export interface SocialVideoOverlayProps {
  onFullScreenPress: () => void;

  onSharePress?: () => void;
  aspectRatio?: number;
}

const SocialVideoOverlay: React.FC<SocialVideoOverlayProps> = ({
  onFullScreenPress,
  onSharePress,
  aspectRatio
}) => {
  const [theme] = useTheme();
  const styles = useMemo(() => overlayStyles(theme), [theme]);
  const socialStyles = useMemo(() => createSocialStyles(), []);

  const { state, togglePlay, toggleMute, toggleCaptions } = useVideoPlayerContext();

  const { isPlaying, isMuted, isBuffering, captionsEnabled } = state;

  const isHorizontal = useMemo(() => {
    if (!aspectRatio) return true;
    return Math.abs(aspectRatio - 16 / 9) < 0.05 || aspectRatio >= 1;
  }, [aspectRatio]);

  // Animated Play/Pause Indicator
  const playPauseOpacity = useSharedValue(0);
  const playPauseScale = useSharedValue(0.5);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  const animatePlayPause = useCallback(
    (paused: boolean) => {
      setShowPlayIcon(paused);
      playPauseOpacity.value = 1;
      playPauseScale.value = 0.5;

      playPauseScale.value = withTiming(1, { duration: 200 });
      playPauseOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(400, withTiming(0, { duration: 300 }))
      );
    },
    [playPauseOpacity, playPauseScale]
  );

  const handleTap = useCallback(() => {
    const isNowPaused = !isPlaying;
    togglePlay();
    animatePlayPause(!isNowPaused);
  }, [togglePlay, isPlaying, animatePlayPause]);

  const playPauseStyle = useAnimatedStyle(() => ({
    opacity: playPauseOpacity.value,
    transform: [{ scale: playPauseScale.value }]
  }));

  const iconSize = 24;
  const centerIconSize = 50;

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.overlay}>
        {/* Centered Play/Pause Animation */}
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
          {isBuffering ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <Animated.View style={[socialStyles.centerIcon, playPauseStyle]}>
              {isPlaying ? (
                <PauseIcon width={centerIconSize} height={centerIconSize} fill={colors.white} />
              ) : (
                <PlayIcon width={centerIconSize} height={centerIconSize} fill={colors.white} />
              )}
            </Animated.View>
          )}
        </View>

        {/* Bottom Right Controls */}
        <View
          style={[
            socialStyles.bottomControls,
            isHorizontal && socialStyles.bottomControlsHorizontal
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleMute}>
            <View style={socialStyles.iconButton}>
              {isMuted ? (
                <AudioMute width={iconSize} height={iconSize} fill={colors.white} />
              ) : (
                <VolumeIcon width={iconSize} height={iconSize} fill={colors.white} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={toggleCaptions}>
            <View style={socialStyles.iconButton}>
              <ClosedCaption
                width={iconSize}
                height={iconSize}
                fill={captionsEnabled ? theme.iconIconographyPrimary : colors.white}
              />
            </View>
          </TouchableWithoutFeedback>

          {onSharePress ? (
            <TouchableWithoutFeedback onPress={onSharePress}>
              <View style={socialStyles.iconButton}>
                <ShareIcon
                  width={iconSize}
                  height={iconSize}
                  fill={colors.white}
                  color={colors.white}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null}

          <TouchableWithoutFeedback onPress={onFullScreenPress}>
            <View style={socialStyles.iconButton}>
              <FullScreen width={iconSize} height={iconSize} fill={colors.white} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const createSocialStyles = () =>
  StyleSheet.create({
    bottomControls: {
      position: 'absolute',
      bottom: spacing.m,
      right: spacing.m,
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.s
    },
    bottomControlsHorizontal: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s
    },
    iconButton: {
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: spacing.xxs,
      borderRadius: spacing.m,
      justifyContent: 'center',
      alignItems: 'center'
    },
    centerIcon: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: spacing.m,
      borderRadius: 50
    }
  });

export default React.memo(SocialVideoOverlay);
