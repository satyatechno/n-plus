import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  logLiveVideoEvent,
  logVideoEvent
} from '@src/services/analytics/videoPlayerContentAnalyticsHelper';
import { getCurrentSignalTime } from '@src/utils/dateFormatter';

export interface VideoAnalyticsConfig {
  screenName?: string;
  contentType?: string;
  organisms?: string;
  videoTitle?: string;
  idPage?: string;
  screenPageWebUrl?: string;
  publication?: string;
  duration?: string;
  tags?: string;
  videoType?: string;
  production?: string;
}

export interface VideoProgressTracker {
  hasStarted: boolean;
  hasReached25Percent: boolean;
  hasReached50Percent: boolean;
  hasReached75Percent: boolean;
  hasCompleted: boolean;
}

/**
 * Track video load event
 */
export const logVideoLoadEvent = (config: VideoAnalyticsConfig): void => {
  const isLiveVideo = !config.duration && !config.publication && !config.videoType;
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.LOAD,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });

  if (isLiveVideo) {
    // Live video analytics
    logLiveVideoEvent({
      screen_name: config?.screenName,
      organisms: config?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.LOAD,
      event_label: config?.videoTitle,
      Tipo_Contenido: config?.contentType,
      idPage: ANALYTICS_ID_PAGE.LIVE_TV,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
      production: config?.production,
      signal_time: getCurrentSignalTime()
    });
  } else {
    logVideoEvent({
      screen_name: config?.screenName,
      organisms: config?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      event_action: ANALYTICS_ATOMS.LOAD,
      event_label: config?.videoTitle,
      Tipo_Contenido: config?.contentType,
      idPage: config?.idPage,
      screen_page_web_url: config?.screenPageWebUrl,
      Fecha_Publicacion_Video: config?.publication,
      Video_Duration: config?.duration,
      video_detail: `${config?.idPage}_${config?.videoType}`,
      EtiquetasVOD: config?.tags,
      production: config?.production
    });
  }
};

/**
 * Track video start event (first playback)
 */
export const logVideoStartEvent = (config: VideoAnalyticsConfig): void => {
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.START,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });
  logVideoEvent({
    screen_name: config?.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    event_action: ANALYTICS_ATOMS.START,
    event_label: config?.videoTitle,
    Tipo_Contenido: config?.contentType,
    idPage: config?.idPage,
    screen_page_web_url: config?.screenPageWebUrl,
    Fecha_Publicacion_Video: config?.publication,
    Video_Duration: config?.duration,
    video_detail: `${config?.idPage}_${config?.videoType}`,
    EtiquetasVOD: config?.tags,
    production: config?.production
  });
};

/**
 * Track video 25% progress milestone
 */
export const logVideo25PercentEvent = (config: VideoAnalyticsConfig): void => {
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.PROGRESS_25,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });
  logVideoEvent({
    screen_name: config?.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    event_action: ANALYTICS_ATOMS.PROGRESS_25,
    event_label: config?.videoTitle,
    Tipo_Contenido: config?.contentType,
    idPage: config?.idPage,
    screen_page_web_url: config?.screenPageWebUrl,
    Fecha_Publicacion_Video: config?.publication,
    Video_Duration: config?.duration,
    video_detail: `${config?.idPage}_${config?.videoType}`,
    EtiquetasVOD: config?.tags,
    production: config?.production
  });
};

/**
 * Track video 50% progress milestone
 */
export const logVideo50PercentEvent = (config: VideoAnalyticsConfig): void => {
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.PROGRESS_50,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });
  logVideoEvent({
    screen_name: config?.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    event_action: ANALYTICS_ATOMS.PROGRESS_50,
    event_label: config?.videoTitle,
    Tipo_Contenido: config?.contentType,
    idPage: config?.idPage,
    screen_page_web_url: config?.screenPageWebUrl,
    Fecha_Publicacion_Video: config?.publication,
    Video_Duration: config?.duration,
    video_detail: `${config?.idPage}_${config?.videoType}`,
    EtiquetasVOD: config?.tags,
    production: config?.production
  });
};

/**
 * Track video 75% progress milestone
 */
export const logVideo75PercentEvent = (config: VideoAnalyticsConfig): void => {
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.PROGRESS_75,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });
  logVideoEvent({
    screen_name: config?.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    event_action: ANALYTICS_ATOMS.PROGRESS_75,
    event_label: config?.videoTitle,
    Tipo_Contenido: config?.contentType,
    idPage: config?.idPage,
    screen_page_web_url: config?.screenPageWebUrl,
    Fecha_Publicacion_Video: config?.publication,
    Video_Duration: config?.duration,
    video_detail: `${config?.idPage}_${config?.videoType}`,
    EtiquetasVOD: config?.tags,
    production: config?.production
  });
};

/**
 * Track video complete event
 */
export const logVideoCompleteEvent = (config: VideoAnalyticsConfig): void => {
  logSelectContentEvent({
    screen_name: config.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    content_action: ANALYTICS_ATOMS.COMPLETE,
    content_title: config.videoTitle,
    Tipo_Contenido: config.contentType
  });
  logVideoEvent({
    screen_name: config?.screenName,
    organisms: config?.organisms,
    content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
    event_action: ANALYTICS_ATOMS.COMPLETE,
    event_label: config?.videoTitle,
    Tipo_Contenido: config?.contentType,
    idPage: config?.idPage,
    screen_page_web_url: config?.screenPageWebUrl,
    Fecha_Publicacion_Video: config?.publication,
    Video_Duration: config?.duration,
    video_detail: `${config?.idPage}_${config?.videoType}`,
    EtiquetasVOD: config?.tags,
    production: config?.production
  });
};

/**
 * Check and track video progress milestones
 * Returns updated progress tracker state
 */
export const trackVideoProgress = (
  currentTime: number,
  duration: number,
  tracker: VideoProgressTracker,
  config: VideoAnalyticsConfig
): VideoProgressTracker => {
  if (duration <= 0) {
    return tracker;
  }

  const progressPercentage = currentTime / duration;
  const newTracker = { ...tracker };

  // Track video start (first playback beyond 0 seconds)
  if (!newTracker.hasStarted && currentTime > 0) {
    newTracker.hasStarted = true;
    logVideoStartEvent(config);
  }

  // Track 25% milestone
  if (!newTracker.hasReached25Percent && progressPercentage >= 0.25) {
    newTracker.hasReached25Percent = true;
    logVideo25PercentEvent(config);
  }

  // Track 50% milestone
  if (!newTracker.hasReached50Percent && progressPercentage >= 0.5) {
    newTracker.hasReached50Percent = true;
    logVideo50PercentEvent(config);
  }

  // Track 75% milestone
  if (!newTracker.hasReached75Percent && progressPercentage >= 0.75) {
    newTracker.hasReached75Percent = true;
    logVideo75PercentEvent(config);
  }

  // Track video completion (95% to account for slight variations)
  if (!newTracker.hasCompleted && progressPercentage >= 0.95) {
    newTracker.hasCompleted = true;
    logVideoCompleteEvent(config);
  }

  return newTracker;
};

/**
 * Create initial video progress tracker state
 */
export const createVideoProgressTracker = (): VideoProgressTracker => ({
  hasStarted: false,
  hasReached25Percent: false,
  hasReached50Percent: false,
  hasReached75Percent: false,
  hasCompleted: false
});

/**
 * Reset video progress tracker state
 */
export const resetVideoProgressTracker = (): VideoProgressTracker => ({
  hasStarted: false,
  hasReached25Percent: false,
  hasReached50Percent: false,
  hasReached75Percent: false,
  hasCompleted: false
});
