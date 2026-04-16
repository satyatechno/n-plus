import { StyleSheet } from 'react-native';

import { ISO639_1, OnReceiveAdEventData } from 'react-native-video';

import { AppTheme } from '@src/themes/theme';
import { EpisodeData, VideoContent } from '@src/models/main/Home/StoryPage/JWVideoPlayer';

export interface PerformanceConfig {
  /** Use smaller buffers to reduce memory (default: true for low-end) */
  lowMemoryMode?: boolean;
  /** Progress update interval in ms (default: 500, higher = less CPU) */
  progressUpdateInterval?: number;
  /** Disable background playback to save resources */
  disableBackgroundPlayback?: boolean;
  /** Cache size in MB (0 to disable, default: 50) */
  cacheSizeMB?: number;
}

export interface QualityOption {
  label: string;
  value: string;
  isRecommended?: boolean;
}

export interface VODSettingsBottomSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** Callback to close the sheet */
  onClose: () => void;
  /** Whether captions are currently enabled */
  captionsEnabled?: boolean;
  /** Callback when captions setting changes */
  onCaptionsChange?: (enabled: boolean) => void;
  /** Current playback speed */
  currentSpeed?: number;
  /** Callback when speed changes */
  onSpeedChange?: (speed: number) => void;
  /** Current quality setting */
  currentQuality?: string;
  /** Callback when quality changes */
  onQualityChange?: (quality: string) => void;
  /** Whether this is a live stream */
  isLive?: boolean;
  /** Whether to show quality option */
  showQualityOption?: boolean;
  /** Whether to show subtitles option */
  showSubtitlesOption?: boolean;
  /** Available qualities */
  availableQualities?: string[];
}

export interface RNVideoPlayerProps {
  /** Callback to request external rendering of settings sheet. Passing this prop disables internal rendering (except fullscreen). */
  onSettingsRequest?: (props: VODSettingsBottomSheetProps | null) => void;
  /** The URL of the video to play */
  videoUrl: string;
  /** URL for closed captions (VTT format) */
  closedCaptionUrl?: string;
  isPipModeProp?: boolean;
  onEnterPiP?: () => void;
  onExitPiP?: () => void;
  persistPlaybackTime?: (time: number | undefined) => void;
  /** Initial seek time in seconds */
  initialSeekTime: number;
  onCaptionUpdate?: (caption: string) => void;
  onCaptionToggle?: (enabled: boolean) => void;
  keys?: number;
  activeVideoIndex?: number;
  setIsVideoPlaying?: (isVideoPlaying: boolean) => void;
  videoType?: string | null;
  isBackgroundPipMode?: boolean;
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
  runOnPlay?: boolean;
  alwaysEnablePiP?: boolean;
  onFullScreenPress?: () => void;
  /** VMAP/VAST Ad Tag URL for Google IMA SDK ads */
  adTagUrl?: string;
  adLanguage?: ISO639_1;
  /** Callback when ad events are received from IMA SDK */
  onReceiveAdEvent?: (event: OnReceiveAdEventData) => void;
  /** Callback when ad status changes (playing/not playing) */
  onAdStatusChanged?: (isAdPlaying: boolean) => void;
  isShowLive?: boolean;
  autoStart?: boolean;
  reelMode?: boolean;
  aspectRatio?: number;
  /** Performance configuration for low-end devices */
  performanceConfig?: PerformanceConfig;
  has9_16?: boolean;
  blocked?: boolean;
  /** Analytics content type (e.g., 'Video', 'Audio') */
  analyticsContentType?: string;
  /** Analytics screen name (e.g., 'Episode detail page', 'Live page') */
  analyticsScreenName?: string;
  /** Analytics organisms (e.g., 'VOD', 'Live') */
  analyticsOrganism?: string;
  analyticsIdPage?: string;
  analyticScreenPageWebUrl?: string;
  analyticsPublication?: string;
  analyticsDuration?: string;
  analyticsTags?: string;
  analyticVideoType?: string;
  analyticsProduction?: string;
}

export interface RNVideoBottomControlsProps {
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

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface RNVideoRef {
  seek: (time: number) => void;
  pause: () => void;
  resume: () => void;
}

type Media = {
  thumbnailURL?: string;
};

export interface OnProgressData {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}

export interface OnLoadData {
  currentTime: number;
  duration: number;
  naturalSize: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
}

export interface OnBufferData {
  isBuffering: boolean;
}

export interface OnPictureInPictureStatusChangedData {
  isActive: boolean;
}

export interface VODSettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  availableQualities?: string[];
  captionsEnabled?: boolean;
  onCaptionsChange?: (enabled: boolean) => void;
  currentSpeed?: number;
  onSpeedChange?: (speed: number) => void;
  currentQuality?: string;
  onQualityChange?: (quality: string) => void;
  showQualityOption?: boolean;
  isLive?: boolean;
  showSubtitlesOption?: boolean;
}
