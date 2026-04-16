import React, { useState } from 'react';
import {
  View,
  Pressable,
  ViewStyle,
  PanResponderInstance,
  LayoutAnimation,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { useTheme } from '@src/hooks/useTheme';
import ReplayIcon from '@src/assets/icons/ReplayIcon';
import Speed1x from '@src/assets/icons/Speed1x';
import Speed2x from '@src/assets/icons/Speed2x';
import { CrossIcon, Info, PauseIcon, PlayIcon } from '@src/assets/icons';
import themeStyles from '@src/views/organisms/AudioPlayerCard/styles';
import {
  TOOLTIP_OFFSET_GESTURE_NAV,
  TOOLTIP_OFFSET_IOS,
  TOOLTIP_OFFSET_ANDROID
} from '@src/config/constants';
import Speed1pt5x from '@src/assets/icons/Speed1pt5x';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useGestureNavigation } from '@src/hooks/useGestureNavigation';
import { isIos } from '@src/utils/platformCheck';

interface Props {
  title: string;
  isPlaying: boolean;
  speed: number;
  infoVisible: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onChangeSpeed: () => void;
  onClose: () => void;
  onToggleInfo: () => void;
  currentTime: number;
  duration: number;
  progress: SharedValue<number>;
  panResponder: PanResponderInstance;
  progressBarRef: React.RefObject<View>;
  progressBarX: React.MutableRefObject<number>;
  progressBarWidth: React.MutableRefObject<number>;
  t: (key: string) => string;
}

/**
 * @function AudioPlayerCardUI
 * @description A UI component for an audio player card with playback controls.
 * @param {Props} props - Component props.
 * @param {string} props.title - Title of the audio player card.
 * @param {boolean} props.isPlaying - Whether the audio is currently playing.
 * @param {number} props.speed - Playback speed of the audio (1x, 1.5x, 2x).
 * @param {boolean} props.infoVisible - Whether the info modal is visible.
 * @param {() => void} props.onTogglePlay - Callback function triggered when the user presses the play/pause button.
 * @param {() => void} props.onReplay - Callback function triggered when the user presses the replay button.
 * @param {() => void} props.onChangeSpeed - Callback function triggered when the user presses the speed button.
 * @param {() => void} props.onClose - Callback function triggered when the user presses the close button.
 * @param {() => void} props.onToggleInfo - Callback function triggered when the user presses the info button.
 * @param {number} props.currentTime - Current time of the audio in seconds.
 * @param {number} props.duration - Duration of the audio in seconds.
 * @param {SharedValue<number>} props.progress - Shared value for the progress of the audio.
 * @param {PanResponderInstance} props.panResponder - Pan responder instance for the progress bar.
 * @param {React.RefObject<View>} props.progressBarRef - Ref object for the progress bar.
 * @param {React.MutableRefObject<number>} props.progressBarX - Mutable ref object for the x position of the progress bar.
 * @param {React.MutableRefObject<number>} props.progressBarWidth - Mutable ref object for the width of the progress bar.
 * @param {t: (key: string) => string} props.t - Translation function for the component.
 * @returns {ReactElement} The rendered audio player component with UI or skeleton loading state.
 */

const AudioPlayerCardUI = ({
  title,
  isPlaying,
  speed,
  infoVisible,
  onTogglePlay,
  onReplay,
  onChangeSpeed,
  onClose,
  onToggleInfo,
  currentTime,
  duration,
  progress,
  panResponder,
  progressBarRef,
  progressBarX,
  progressBarWidth,
  t
}: Props) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const [progressWidth, setProgressWidth] = useState<Double | number>(0);
  const [playerHeight, setPlayerHeight] = useState<number>(0);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  };

  const updateProgressWidth = (value: number) => {
    const progressValue = Math.min(Math.max(value, 0), 1) * 100;

    LayoutAnimation.configureNext({
      duration: 100,
      create: { type: 'linear', property: 'opacity' },
      update: { type: 'linear' }
    });

    setProgressWidth(progressValue);
  };

  useAnimatedReaction(
    () => progress.value,
    (currentValue) => {
      runOnJS(updateProgressWidth)(currentValue);
    }
  );

  const isGestureNavigation = useGestureNavigation();

  const handlePlayerLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    setPlayerHeight(event.nativeEvent.layout.height);
  };

  const tooltipBottomOffset =
    playerHeight +
    (isGestureNavigation
      ? actuatedNormalizeVertical(TOOLTIP_OFFSET_GESTURE_NAV)
      : actuatedNormalizeVertical(isIos ? TOOLTIP_OFFSET_IOS : TOOLTIP_OFFSET_ANDROID));

  return (
    <View style={styles.playerContainer} pointerEvents="box-none" onLayout={handlePlayerLayout}>
      <View style={styles.header} pointerEvents="box-none">
        <CustomText
          fontFamily={fonts.franklinGothicURW}
          weight="Med"
          size={fontSize['xs']}
          textStyles={styles.title}
        >
          {title}
        </CustomText>

        <View style={styles.headerIcons} pointerEvents="box-none">
          <Pressable
            onPress={onToggleInfo}
            style={styles.crossIconStyles}
            pointerEvents="auto"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Info fill={theme.iconIconographyGenericState} />
          </Pressable>
          <Pressable
            onPress={onClose}
            style={styles.crossIconStyles}
            pointerEvents="auto"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CrossIcon stroke={theme.iconIconographyGenericState} />
          </Pressable>
        </View>
      </View>

      <View style={styles.controls} pointerEvents="box-none">
        <Pressable
          onPress={onTogglePlay}
          style={styles.playIconStyles}
          pointerEvents="auto"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          {isPlaying ? (
            <PauseIcon fill={theme.iconIconographyGenericState} />
          ) : (
            <PlayIcon fill={theme.iconIconographyGenericState} />
          )}
        </Pressable>

        <Pressable
          onPress={onReplay}
          pointerEvents="auto"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <ReplayIcon fill={theme.iconIconographyGenericState} />
        </Pressable>

        <Pressable
          onPress={onChangeSpeed}
          style={styles.playSpeedStyle}
          pointerEvents="auto"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          {speed === 1 ? (
            <Speed1x fill={theme.iconIconographyGenericState} />
          ) : speed === 1.5 ? (
            <Speed1pt5x color={theme.iconIconographyGenericState} />
          ) : (
            <Speed2x fill={theme.iconIconographyGenericState} />
          )}
        </Pressable>

        <View style={styles.progressBarContainer} pointerEvents="box-none">
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            weight="Boo"
            size={fontSize['xxs']}
            textStyles={styles.progressBarText}
          >
            {formatTime(currentTime)}
          </CustomText>

          <View
            ref={progressBarRef}
            style={styles.progressContainer as ViewStyle}
            {...panResponder.panHandlers}
            pointerEvents="auto"
            onLayout={() =>
              progressBarRef.current?.measureInWindow((x, _, width) => {
                progressBarX.current = x;
                progressBarWidth.current = width;
              })
            }
          >
            <View style={styles.progressBarWrapper}>
              <View
                style={StyleSheet.flatten([styles.progressBar, { width: `${progressWidth}%` }])}
                pointerEvents="none"
                collapsable={false}
              />
            </View>
          </View>

          <CustomText
            fontFamily={fonts.franklinGothicURW}
            weight="Boo"
            size={fontSize['xxs']}
            textStyles={styles.progressBarText}
          >
            -{formatTime(duration - currentTime)}
          </CustomText>
          <Modal
            visible={infoVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onToggleInfo}
          >
            <TouchableWithoutFeedback onPress={onToggleInfo}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View
                    style={[
                      styles.localTooltipBox,
                      {
                        bottom: tooltipBottomOffset
                      }
                    ]}
                  >
                    <CustomText
                      fontFamily={fonts.franklinGothicURW}
                      weight="Boo"
                      size={fontSize.xs}
                      color={theme.menusTextDarkThemePagesActive}
                      textStyles={styles.textStyles}
                    >
                      {t('screens.jwAudioPlayer.text.aiGeneratedVoice')}
                    </CustomText>
                    <View style={styles.pointer} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayerCardUI;
