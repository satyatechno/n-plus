import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, PanResponder } from 'react-native';

import Video, { type VideoRef } from 'react-native-video';
import { useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import AudioPlayerSkeleton from '@src/views/organisms/AudioPlayerCard/component/AudioCardSkeleton';
import AudioPlayerCardUI from '@src/views/organisms/AudioPlayerCard/component/AudioPlayerCardUI';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ID_PAGE,
  ANALYTICS_ORGANISMS,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';

interface StoryData {
  id?: string;
  fullPath?: string;
  title?: string;
  openingType?: string;
  displayType?: string;
  category?: { title?: string };
  provinces?: Array<{ title?: string }>;
  topics?: Array<{ title?: string }>;
  channel?: { title?: string };
  production?: { title?: string };
}

interface AudioPlayerCardProps {
  audioUrl: string;
  audioCardTitle: string;
  onPress: () => void;
  story?: StoryData | null;
  currentSlug?: string;
  previousSlug?: string;
  tipoContenido?: string;
  screen_page_web_url?: string;
  screenName?: string;
}

/**
 * AudioPlayerCard - A customizable audio player component with playback controls
 *
 * @component
 *
 * @description
 * Renders an audio player card with features including:
 * - Play/pause toggle
 * - Progress tracking with draggable progress bar
 * - Playback speed adjustment (1x, 1.5x, 2x)
 * - Replay functionality (rewind 5 seconds)
 * - Buffering state indication
 * - Global audio state synchronization
 * - Responsive gesture handling
 *
 * @param {AudioPlayerCardProps} props - Component props
 * @param {string} props.audioUrl - The URI of the audio file to be played
 * @param {string} props.audioCardTitle - The title to display for the audio player
 * @param {() => void} props.onPress - Callback function triggered when the player is closed
 *
 * @returns {ReactElement} The rendered audio player component with UI or skeleton loading state
 *
 * @example
 * ```tsx
 * <AudioPlayerCard
 *   audioUrl="https://example.com/audio.mp3"
 *   audioCardTitle="My Podcast"
 *   onPress={() => console.log('Player closed')}
 * />
 * ```
 *
 * @remarks
 * - Uses Reanimated for smooth progress animations
 * - Integrates with a global video player store for audio state management
 * - Automatically resets audio state on component unmount
 * - Supports pan gesture recognition for progress bar dragging
 */

const AudioPlayerCard = ({
  audioUrl,
  audioCardTitle,
  onPress,
  story,
  currentSlug = '',
  previousSlug = '',
  tipoContenido,
  screen_page_web_url,
  screenName
}: AudioPlayerCardProps) => {
  const { t } = useTranslation();

  const playerRef = useRef<VideoRef>(null);
  const progressBarRef = useRef<View>(null);
  const isDragging = useRef<boolean>(false);
  const progressBarWidth = useRef<number>(0);
  const progressBarX = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const isSeeking = useRef<boolean>(false);

  const { setAudioPlaying, isAudioPlaying } = useVideoPlayerStore();
  const progress = useSharedValue(0);
  const speedOptions = useMemo(() => [1, 1.5, 2], []);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    // Sync global audio playing state with local state for autoplay
    setIsPlaying(isAudioPlaying);
  }, [isAudioPlaying]);

  useEffect(
    () => () => {
      // Pause audio and close card when component unmounts (user navigates away)
      setIsPlaying(false);
      setAudioPlaying(false);
      onPress();
    },
    [onPress]
  );

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const newPlayingState = !prev;
      setAudioPlaying(newPlayingState);
      if (story) {
        logSelectContentEvent({
          idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
          screen_page_web_url: screen_page_web_url,
          screen_name: screenName,
          Tipo_Contenido: tipoContenido,
          organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
          content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
          content_action: newPlayingState ? ANALYTICS_ATOMS.PLAY : ANALYTICS_ATOMS.PAUSE,
          content_title: (story?.title || '').substring(0, 100)
        });
      }

      return newPlayingState;
    });
  };

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setAudioPlaying(false);

    // Log analytics event for close button tap
    if (story) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
        screen_page_web_url: screen_page_web_url,
        screen_name: screenName,
        Tipo_Contenido: tipoContenido,
        organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
        content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
        content_action: ANALYTICS_ATOMS.CLOSE,
        content_title: (story?.title || '').substring(0, 100)
      });
    }

    onPress();
  }, [onPress, story, currentSlug, previousSlug, tipoContenido]);

  const changeSpeed = useCallback(() => {
    const index = speedOptions.indexOf(speed);
    const newSpeed = speedOptions[(index + 1) % speedOptions.length];
    setSpeed(newSpeed);

    // Log analytics event for speed change
    if (story) {
      let speedAction;
      switch (newSpeed) {
        case 1:
          speedAction = ANALYTICS_ATOMS.SPEED_1X;
          break;
        case 1.5:
          speedAction = ANALYTICS_ATOMS.SPEED_1_5X;
          break;
        case 2:
          speedAction = ANALYTICS_ATOMS.SPEED_2X;
          break;
        default:
          speedAction = ANALYTICS_ATOMS.SPEED_1X;
      }

      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
        screen_page_web_url: screen_page_web_url,
        screen_name: screenName,
        Tipo_Contenido: tipoContenido,
        organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
        content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
        content_action: speedAction,
        content_title: (story?.title || '').substring(0, 100)
      });
    }
  }, [speed, speedOptions, story, currentSlug, previousSlug, tipoContenido]);

  const replay = useCallback(() => {
    isSeeking.current = true;
    const newTime = Math.max(currentTime - 5, 0);
    playerRef.current?.seek(newTime);
    setCurrentTime(newTime);
    progress.value = duration ? newTime / duration : 0;

    // Log analytics event for rewind 5 seconds
    if (story) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
        screen_page_web_url: screen_page_web_url,
        screen_name: screenName,
        Tipo_Contenido: tipoContenido,
        organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
        content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
        content_action: ANALYTICS_ATOMS.REPLAY_5,
        content_title: (story?.title || '').substring(0, 100)
      });
    }

    setTimeout(() => {
      isSeeking.current = false;
    }, 300);
  }, [currentTime, duration, story, currentSlug, previousSlug, tipoContenido]);

  const onLoad = useCallback(
    (meta: { duration: number }) => {
      setDuration(meta.duration);
      setIsBuffering(false);

      // Log analytics event when audio player loads/opens
    },
    [story, currentSlug, previousSlug, tipoContenido]
  );

  const onProgress = useCallback(
    (e: { currentTime: number }) => {
      setCurrentTime(e.currentTime);
      if (!isDragging.current && duration) {
        progress.value = e.currentTime / duration;
      }
    },
    [duration]
  );

  const toggleInfo = useCallback(() => {
    setInfoVisible(!infoVisible);

    // Log analytics event for info icon tap
    if (story) {
      logSelectContentEvent({
        idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
        screen_page_web_url: screen_page_web_url,
        screen_name: screenName,
        Tipo_Contenido: tipoContenido,
        organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
        content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
        content_action: ANALYTICS_ATOMS.INFO,
        content_title: (story?.title || '').substring(0, 100)
      });
    }
  }, [infoVisible, story, currentSlug, previousSlug, tipoContenido]);

  const onEnd = useCallback(() => {
    setIsPlaying(false);
    setAudioPlaying(false);
    setCurrentTime(0);
    progress.value = 0;
  }, []);

  const onBuffer = useCallback(({ isBuffering: buffering }: { isBuffering: boolean }) => {
    if (!isSeeking.current) {
      setIsBuffering(buffering);
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true;

        // Log analytics event for progress bar interaction
        if (story) {
          logSelectContentEvent({
            idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
            screen_page_web_url: screen_page_web_url,
            screen_name: screenName,
            Tipo_Contenido: tipoContenido,
            organisms: ANALYTICS_ORGANISMS.AUDIO_PLAYER,
            content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
            content_action: ANALYTICS_ATOMS.PROGRESS_BAR,
            content_title: (story?.title || '').substring(0, 100)
          });
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const relativeX = gestureState.moveX - progressBarX.current;
        const newProgress = Math.min(Math.max(relativeX / (progressBarWidth.current || 1), 0), 1);
        progress.value = newProgress;
        setCurrentTime(newProgress * durationRef.current);
      },
      onPanResponderRelease: () => {
        const seekTime = progress.value * durationRef.current;
        playerRef.current?.seek(seekTime);
        setCurrentTime(seekTime);
        setTimeout(() => {
          isDragging.current = false;
        }, 300);
      }
    })
  ).current;

  return (
    <>
      <Video
        ref={playerRef}
        source={{ uri: audioUrl }}
        paused={!isPlaying}
        rate={speed}
        repeat={true}
        ignoreSilentSwitch="ignore"
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        onBuffer={onBuffer}
        style={{ width: 0, height: 0 }}
      />

      {isBuffering ? (
        <AudioPlayerSkeleton />
      ) : (
        <AudioPlayerCardUI
          title={audioCardTitle}
          isPlaying={isPlaying}
          speed={speed}
          infoVisible={infoVisible}
          onTogglePlay={togglePlay}
          onReplay={replay}
          onChangeSpeed={changeSpeed}
          onClose={closePlayer}
          onToggleInfo={toggleInfo}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          panResponder={panResponder}
          progressBarRef={progressBarRef as React.RefObject<View>}
          progressBarX={progressBarX}
          progressBarWidth={progressBarWidth}
          t={t}
        />
      )}
    </>
  );
};

export default AudioPlayerCard;
