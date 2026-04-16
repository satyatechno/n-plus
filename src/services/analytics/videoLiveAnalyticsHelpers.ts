import moment from 'moment-timezone';

import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { VideoLiveParams, VideoLiveAction } from '@src/services/analytics/analyticsTypes';

// ─── Timestamp helper ────────────────────────────────────────────────────────

/**
 * Returns the current Mexico City timestamp formatted as YYYY-MM-DD HH:mm:ss
 *
 * @example
 * signal_time: getLiveSignalTime() // → "2025-09-02 14:27:09"
 */
export const getLiveSignalTime = (): string =>
  moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

// ─── Core event logger ────────────────────────────────────────────────────────

/**
 * Builds the payload for the af_video_live event.
 *
 * device_id, client_ID_hit and user_id_nmas_hit are injected automatically
 * by AnalyticsService.logEvent via buildAppsFlyerParams — do NOT pass them manually.
 */
const buildVideoLivePayload = (params: VideoLiveParams): Record<string, string> => ({
  event_action: params.event_action,
  event_label: params.event_label,
  signal_time: params.signal_time,
  ...(params.channel !== undefined && { channel: params.channel })
});

/**
 * Core function to log an af_video_live event.
 * Prefer using `createVideoLiveTracker` or the individual helpers instead.
 */
export const logVideoLiveEvent = (params: VideoLiveParams): void => {
  try {
    AnalyticsService.logAppsFlyerEvent('video_live', buildVideoLivePayload(params));
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};

// ─── Tracker factory ──────────────────────────────────────────────────────────

/**
 * Creates a pre-configured tracker for a live stream session.
 *
 * Call this once per component using `useMemo`, passing the `analyticsConfig`
 * from `VideoPlayerContext`. Each method captures `signal_time` at the moment
 * it is called (not at creation time).
 *
 * @example
 * const tracker = useMemo(() =>
 *   analyticsConfig?.channel
 *     ? createVideoLiveTracker(analyticsConfig)
 *     : null,
 *   [analyticsConfig?.channel, analyticsConfig?.videoTitle]
 * );
 *
 * // Later:
 * tracker?.pause();
 * tracker?.mute();
 */
export const createVideoLiveTracker = (config: { channel: string; videoTitle?: string }) => {
  const base = (): Omit<VideoLiveParams, 'event_action'> => ({
    event_label: config.videoTitle ?? config.channel,
    signal_time: getLiveSignalTime(),
    channel: config.channel
  });

  const log = (event_action: VideoLiveAction) => logVideoLiveEvent({ ...base(), event_action });

  return {
    // ── Player lifecycle ──────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_start */
    liveVideoStart: () => log('video_vivo_start'),
    /** af_video_live → event_action: video_vivo_pause */
    liveVideoPause: () => log('video_vivo_pause'),
    /** af_video_live → event_action: video_vivo_resume */
    liveVideoResume: () => log('video_vivo_resume'),

    // ── Audio ─────────────────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_mute */
    liveVideoMute: () => log('video_vivo_mute'),
    /** af_video_live → event_action: video_vivo_unmute */
    liveVideoUnmute: () => log('video_vivo_unmute'),

    // ── Screen modes ──────────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_fullscreen */
    liveVideoFullscreen: () => log('video_vivo_fullscreen'),
    /** af_video_live → event_action: video_vivo_exit_fullscreen */
    liveVideoExitFullscreen: () => log('video_vivo_exit_fullscreen'),
    /** af_video_live → event_action: video_vivo_pip_open */
    liveVideoPipOpen: () => log('video_vivo_pip_open'),
    /** af_video_live → event_action: video_vivo_pip_close */
    liveVideoPipClose: () => log('video_vivo_pip_close'),

    // ── Google Cast ───────────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_cast_start */
    liveVideoCastStart: () => log('video_vivo_cast_start'),
    /** af_video_live → event_action: video_vivo_cast_stop */
    liveVideoCastStop: () => log('video_vivo_cast_stop'),

    // ── Ads ───────────────────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_ad_start_preroll */
    liveVideoAdStartPreroll: () => log('video_vivo_ad_start_preroll'),

    // ── Errors ────────────────────────────────────────────────────────────
    /** af_video_live → event_action: video_vivo_error_geoblock */
    liveVideoErrorGeoblock: () => log('video_vivo_error_geoblock'),
    /** af_video_live → event_action: video_vivo_error_playback */
    liveVideoErrorPlayback: () => log('video_vivo_error_playback'),
    /** af_video_live → event_action: video_vivo_error_setup */
    liveVideoErrorSetup: () => log('video_vivo_error_setup'),

    // ── Channel / User ────────────────────────────────────────────────────
    /** af_video_live → event_action: video_selec_operador */
    liveVideoSelectChannel: () => log('video_selec_operador'),
    /** af_video_live → event_action: video_ingreso_exitoso */
    liveVideoLoginSuccess: () => log('video_ingreso_exitoso'),
    /** af_video_live → event_action: video_registro */
    liveVideoRegister: () => log('video_registro')
  };
};

export type VideoLiveTracker = ReturnType<typeof createVideoLiveTracker>;

export type { VideoLiveParams, VideoLiveAction };
