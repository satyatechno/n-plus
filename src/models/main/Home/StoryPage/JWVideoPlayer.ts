import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';

export interface EpisodeData {
  Video?: {
    id?: string;
    title?: string;
    videoUrl?: string;
    closedCaptionUrl?: string;
    publishedAt?: string | number | Date | null;
    summary?: string;
    content?: {
      excerpt?: string;
      heroImage?: {
        url?: string;
      };
    };
  };
  Videos?: {
    docs?: Array<{
      productions?: {
        specialImage?: {
          url?: string;
        };
      };
    }>;
  };
}

export interface VideoPlayerProps {
  videoUrl: string;
  closedCaptionUrl?: string;
  isPipModeProp?: boolean;
  onEnterPiP?: () => void;
  onExitPiP?: () => void;
  persistPlaybackTime?: (time: number | undefined) => void;
  times: number;
  onCaptionUpdate?: (caption: string) => void;
  onCaptionToggle?: (enabled: boolean) => void;
  keys?: number;
  activeVideoIndex?: number;
  setIsVideoPlaying?: (isVideoPlaying: boolean) => void;
  isVideoPlaying?: boolean;
  hideInternalCaptions?: boolean;
  videoType?: string | null;
  isBackgroundPipMode?: boolean;
  showPlayer?: boolean;
  setShowPlayer?: (value: boolean) => void;
  setToastType?: (type: 'error' | 'success') => void;
  setToastMessage?: (message: string) => void;
  fullScreen?: boolean;
  isMutedProp?: boolean;
  videos?: VideoContent[];
  media?: Media;
  currentCaption?: string;
  isCaptionsEnabled?: boolean;
  thumbnail?: string;
  data?: EpisodeData;
  onPlayerPress?: () => void;
  onPipFullScreenPress?: () => void;
  showPiPIcon?: boolean;
  onTimeUpdate?: (time: number) => void;
  timeWatched?: boolean;
  runOnPlay?: boolean;
  alwaysEnablePiP?: boolean;
  onFullScreenPress?: () => void;
  advertising?: { client: string };
  imaDaiSettings?: { assetKey: string };
  isShowLive?: boolean;
  autoStart?: boolean;
  reelMode?: boolean;
  aspectRatio?: number | string;
}

export interface VideoBottomControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onChangeSpeed: () => void;
  onEnterPiP: () => void;
  onFullScreenPress: () => void;
  formatTime: (time: number) => string;
  theme: AppTheme;
  styles: ReturnType<typeof StyleSheet.create>;
  speed: number;
  showPiPIcon?: boolean;
  fullScreen: boolean;
  isLive?: boolean;
  reelMode?: boolean;
}

export type VideoContent = {
  content?: {
    heroImage?: {
      url?: string;
    };
  };
};

type Media = {
  thumbnailURL?: string;
};

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface JWPlayerTimeEvent {
  nativeEvent?: {
    currentTime?: number;
    position?: number;
    duration?: number;
  };
}

export interface PlayerRef {
  getCurrentCaptions: () => Promise<number>;
  setCurrentCaptions: (index: number) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => void;
  setSpeed: (speed: number) => void;
  seekTo: (timeInSeconds: number) => Promise<void>;
}

export interface VideoTopControlsProps {
  fullScreen: boolean;
  onPressingCross?: () => void;
  onToggleCaptions: () => void;
  styles: ReturnType<typeof StyleSheet.create>;
  onCastPress: () => void;
  isLive?: boolean;
}

export interface McpItem {
  value: VideoItem;
}

export interface VideoItem {
  videoDuration: string | undefined;
  title: string;
  id: string;
  videoUrl: string;
  closedCaptionUrl?: string;
  aspectRatio?: number | string;
  content?: {
    videoType: string;
    heroImage?: {
      url?: string;
    };
  };
}

export interface LiveBlogVideoItem {
  value: {
    title: string;
    id: string;
    videoUrl: string;
    closedCaptionUrl?: string;
    aspectRatio?: string;
    content?: {
      videoType: string;
      heroImage?: {
        url?: string;
      };
    };
  };
}

export interface CaptionMap {
  [index: number]: string;
}
export interface EnabledMap {
  [index: number]: boolean;
}

export interface HeroImage {
  id: string;
  url?: string;
  sizes?: {
    vintage?: { url?: string };
  };
  alt?: string;
  caption?: string;
  height?: number;
  width?: number;
  title?: string;
}

export interface VideoPlayerRef {
  pause?: () => void;
  pauseVideo?: () => void;
  stop?: () => void;
  getPlayer?: () => { pause?: () => void };
}
