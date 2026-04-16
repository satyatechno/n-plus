/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mmkvVideoPlayerStorage } from '@src/utils/mmkv';

interface VideoPlayerState {
  activeVideoIndex: number;
  mediaTime: number;
  isVideoMediaPlaying: boolean;
  isMediaPipMode: boolean;
  activeVideoUrl: string | null;
  currentVideoType: string | null;
  isPipMode: boolean;
  isVideoPlaying: boolean;
  activeJWIndex: boolean;
  isFullScreen: boolean;
  isFullScreenPipMode: boolean;
  isShowMediaPlayer: boolean;
  isAudioPlaying: boolean;
  isMediaFullScreen: boolean;
}

interface VideoPlayerActions {
  setActiveVideoIndex: (index: number) => void;
  setMediaTime: (times: number) => void;
  setIsMediaVideoPlaying: (playing: boolean) => void;
  setIsMediaPipMode: (isMediaPipMode: boolean) => void;
  setActiveVideoUrl: (url: string | null) => void;
  setCurrentVideoType: (type: string | null) => void;
  setIsPipMode: (isPipMode: boolean) => void;
  setIsVideoPlaying: (isVideoPlaying: boolean) => void;
  setActiveJWIndex: (isAudioPlaying: boolean) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  setFullScreenPipMode: (isFullScreenPipMode: boolean) => void;
  setShowMediaPlayer: (isShowMediaPlayer: boolean) => void;
  setAudioPlaying: (isAudioPlaying: boolean) => void;
  setMediaFullScreen: (isMediaFullScreen: boolean) => void;
}

const useVideoPlayerStore = create<VideoPlayerState & VideoPlayerActions>()(
  immer(
    persist(
      (set) => ({
        activeVideoIndex: 0,
        mediaTime: 0,
        isVideoMediaPlaying: false,
        isMediaPipMode: false,
        activeVideoUrl: null,
        currentVideoType: null,
        isPipMode: false,
        isVideoPlaying: false,
        activeJWIndex: false,
        isFullScreen: false,
        isFullScreenPipMode: false,
        isShowMediaPlayer: false,
        isAudioPlaying: false,
        isMediaFullScreen: false,

        setMediaFullScreen: (value) =>
          set((state) => {
            state.isMediaFullScreen = value;
          }),
        setIsVideoPlaying: (value) =>
          set((state) => {
            state.isVideoPlaying = value;
          }),
        setAudioPlaying: (value) =>
          set((state) => {
            state.isAudioPlaying = value;
          }),
        setFullScreen: (value) =>
          set((state) => {
            state.isFullScreen = value;
          }),

        setFullScreenPipMode: (value) =>
          set((state) => {
            state.isFullScreenPipMode = value;
          }),

        setActiveJWIndex: (value) =>
          set((state) => {
            state.activeJWIndex = value;
          }),

        setCurrentVideoType: (index) =>
          set((state) => {
            state.currentVideoType = index;
          }),

        setIsPipMode: (index) =>
          set((state) => {
            state.isPipMode = index;
          }),
        setActiveVideoIndex: (index) =>
          set((state) => {
            state.activeVideoIndex = index;
          }),

        setMediaTime: (index) =>
          set((state) => {
            state.mediaTime = index;
          }),
        setIsMediaVideoPlaying: (playing) =>
          set((state) => {
            state.isVideoMediaPlaying = playing;
          }),

        setIsMediaPipMode: (isMediaPipMode) =>
          set((state) => {
            state.isMediaPipMode = isMediaPipMode;
          }),
        setActiveVideoUrl: (url) =>
          set((state) => {
            state.activeVideoUrl = url;
          }),
        setShowMediaPlayer: (value) =>
          set((state) => {
            state.isShowMediaPlayer = value;
          })
      }),
      {
        name: 'video-player-storage',
        storage: createJSONStorage(() => mmkvVideoPlayerStorage),
        partialize: (state) => {
          const {
            isMediaPipMode,
            isVideoMediaPlaying,
            currentVideoType,
            mediaTime,
            isVideoPlaying,
            isPipMode,
            activeJWIndex,
            isFullScreen,
            isFullScreenPipMode,
            isShowMediaPlayer,
            isMediaFullScreen,
            ...persistedState
          } = state;
          return persistedState;
        }
      }
    )
  )
);

export default useVideoPlayerStore;
