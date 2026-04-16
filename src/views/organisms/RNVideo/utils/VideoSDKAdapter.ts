import Config from 'react-native-config';

import { isIos } from '@src/utils/platformCheck';

/**
 * VideoSDKAdapter - Adapter for generating Ad Tag URLs compatible with Google IMA SDK
 *
 * This adapter generates VMAP-compliant Ad Tag URLs for react-native-video's
 * built-in IMA SDK support. It replicates the ad configuration used by
 * N+ web (Broadcast SDK) for consistency.
 *
 * @see https://docs.thewidlarzgroup.com/react-native-video/docs/v6/component/ads
 */

// ============================================
// TYPES
// ============================================

export interface VideoAdConfig {
  /** MCP ID from AKTA (numeric string like "1464189") */
  mcpId: string;
  /** Whether this is a live stream or VOD */
  isLive?: boolean;
  /** Program/show name for targeting */
  programName?: string;
  /** Episode title for targeting */
  episodeTitle?: string;
  /** Content vertical/site (nmas, las-estrellas, telehit, etc.) */
  site?: VideoSite;
  /** Page type where video is displayed */
  pageType?: VideoPageType;
  /** Custom parameters for ad targeting */
  customParams?: Record<string, string>;
  /** Override the default Ad Unit path */
  adUnitPath?: string;
  /** Override the default CMS ID */
  cmsId?: string;
}

export type VideoSite =
  | 'nmas'
  | 'nmaslive'
  | 'las-estrellas'
  | 'telehit'
  | 'canal5'
  | 'unicable'
  | 'elnu9ve'
  | 'bandamax'
  | 'tudn'
  | 'forotv'
  | 'noticieros'
  | 'televisa'
  | 'corporativo';

export type VideoPageType = 'EpisodePage' | 'ClipPage' | 'ShowPage' | 'LivePage' | 'NA';

export type AdType = 'preroll' | 'midroll' | 'postroll' | 'skippablevideo';

// ============================================
// CONSTANTS
// ============================================

/** Google Ad Manager base URL */
const GAM_BASE_URL = 'https://pubads.g.doubleclick.net/gampad/ads';

/** Network ID for Televisa N+ */
const NETWORK_ID = Config.AD_UNIT_NETWORK || '';

/** Default Ad Unit path for N+ */
const DEFAULT_AD_UNIT_PATH = `/${NETWORK_ID}/rm.televisa_nmas`;

/** Default CMS ID for N+ in Google Ad Manager */
const DEFAULT_CMS_ID = Config.AD_UNIT_CMSID || '';

/** Default video size for ads */
const DEFAULT_AD_SIZE = '640x480';

/** App deep link base for ad tracking */
const APP_URL_BASE = 'https://nmas.com.mx';

// ============================================
// AD UNIT MAPPING
// ============================================

/**
 * Maps site identifiers to their Ad Unit paths
 * Based on Broadcast SDK configuration
 */
const SITE_AD_UNIT_MAP: Record<VideoSite, string> = {
  nmas: `/${NETWORK_ID}/rm.televisa_nmas`,
  nmaslive: `/${NETWORK_ID}/rm.televisa_nmas`,
  'las-estrellas': `/${NETWORK_ID}/rm.televisa_lasestrellas`,
  telehit: `/${NETWORK_ID}/rm.televisa_telehit`,
  canal5: `/${NETWORK_ID}/rm.televisa_canal5`,
  unicable: `/${NETWORK_ID}/rm.televisa_unicable`,
  elnu9ve: `/${NETWORK_ID}/rm.televisa_elnu9ve`,
  bandamax: `/${NETWORK_ID}/rm.televisa_bandamax`,
  tudn: `/${NETWORK_ID}/rm.televisa_tudn`,
  forotv: `/${NETWORK_ID}/rm.televisa_forotv`,
  noticieros: `/${NETWORK_ID}/rm.televisa_noticieros`,
  televisa: `/${NETWORK_ID}/rm.televisa`,
  corporativo: `/${NETWORK_ID}/rm.televisa_corporativo`
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extracts the MCP ID from a video URL
 *
 * Video URLs have the format:
 * https://tkx.mp.lura.live/rest/v2/mcp/video/1464189/master.m3u8
 *
 * @param videoUrl - The video URL to extract from
 * @returns The MCP ID or undefined if not found
 */
export const extractMcpIdFromVideoUrl = (videoUrl: string): string | undefined => {
  if (!videoUrl) return undefined;

  // Match pattern: /video/{mcpId}/ where mcpId is numeric
  const match = videoUrl.match(/\/video\/(\d+)\//);

  if (match && match[1]) {
    return match[1];
  }

  return undefined;
};

/**
 * Builds custom parameters string (NOT pre-encoded)
 * URLSearchParams will handle the encoding
 */
const buildCustomParams = (params: Record<string, string>): string => {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== '' && value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return filteredParams;
};

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Generates a VMAP-compliant Ad Tag URL for Google IMA SDK
 *
 * @param config - Video configuration with ad targeting parameters
 * @returns Complete Ad Tag URL string
 *
 * @example
 * ```tsx
 * const adTagUrl = generateAdTagUrl({
 *   mcpId: '1464189',
 *   isLive: false,
 *   programName: 'N+ Noticias',
 *   site: 'nmas',
 *   pageType: 'EpisodePage'
 * });
 * ```
 */
export const generateAdTagUrl = (config: VideoAdConfig): string => {
  const {
    mcpId,
    isLive = false,
    programName = '',
    episodeTitle = '',
    site = 'nmas',
    pageType = 'NA',
    customParams = {},
    adUnitPath,
    cmsId
  } = config;

  // Build Ad Unit path: /6881/rm.televisa_nmas/envivo or /6881/rm.televisa_nmas/vod
  const baseAdUnit = adUnitPath || SITE_AD_UNIT_MAP[site] || DEFAULT_AD_UNIT_PATH;
  const adUnitSuffix = isLive ? 'envivo' : 'vod';
  const fullAdUnit = `${baseAdUnit}/${adUnitSuffix}`;

  // Build custom parameters string
  const custParams = buildCustomParams({
    program_name: programName,
    episode_title: episodeTitle,
    page_type: pageType,
    platform: 'app_mobile',
    app_name: 'nplus',
    ...customParams
  });

  // Build URL parameters
  const params = new URLSearchParams({
    // Ad Unit path - defines where the ad is shown
    iu: fullAdUnit,
    // Video size
    sz: DEFAULT_AD_SIZE,
    // CMS ID in Google Ad Manager
    cmsid: cmsId || DEFAULT_CMS_ID,
    // Video ID - MUST be the numeric MCP ID from AKTA
    vid: mcpId,
    // Custom targeting parameters
    cust_params: custParams,
    // URL for ad context (app deep link or web URL)
    url: `${APP_URL_BASE}/video/${mcpId}`,
    description_url: `${APP_URL_BASE}/video/${mcpId}`,
    // Environment type - 'vp' for video players in apps
    env: 'vp',
    // Instream video
    impl: 's',
    // Ad type - request skippable video ads
    ad_type: 'skippablevideo',
    // Google DFP request flag
    gdfp_req: '1',
    // Output format - VMAP for preroll, midroll, postroll in one response
    output: 'xml_vmap1',
    // Start position
    unviewed_position_start: '1',
    // Ad rule - enables ad breaks
    ad_rule: '1',
    // Cache buster - unique per request
    correlator: Date.now().toString()
  });

  const finalUrl = `${GAM_BASE_URL}?${params.toString()}`;

  return finalUrl;
};

/**
 * Generates Ad Tag URL for live streams
 * Convenience function with isLive=true default
 */
export const generateLiveAdTagUrl = (config: Omit<VideoAdConfig, 'isLive'>): string =>
  generateAdTagUrl({ ...config, isLive: true });

/**
 * Generates Ad Tag URL for VOD content
 * Convenience function with isLive=false default
 */
export const generateVODAdTagUrl = (config: Omit<VideoAdConfig, 'isLive'>): string =>
  generateAdTagUrl({ ...config, isLive: false });

/**
 * Validates if an Ad Tag URL is properly formatted
 */
export const isValidAdTagUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'pubads.g.doubleclick.net' &&
      parsed.pathname === '/gampad/ads' &&
      parsed.searchParams.has('iu') &&
      parsed.searchParams.has('vid')
    );
  } catch {
    return false;
  }
};

// ============================================
// AD EVENT TYPES (from IMA SDK)
// ============================================

/**
 * IMA SDK Ad Event types that can be received via onReceiveAdEvent
 * @see https://docs.thewidlarzgroup.com/react-native-video/docs/v6/component/ads#events
 */
export type IMAAdEventType =
  | 'AD_BREAK_ENDED'
  | 'AD_BREAK_FETCHED'
  | 'AD_BREAK_READY'
  | 'AD_BREAK_STARTED'
  | 'AD_BUFFERING'
  | 'AD_CAN_PLAY'
  | 'AD_METADATA'
  | 'AD_PERIOD_ENDED'
  | 'AD_PERIOD_STARTED'
  | 'AD_PROGRESS'
  | 'ALL_ADS_COMPLETED'
  | 'CLICK'
  | 'COMPLETED'
  | 'CONTENT_PAUSE_REQUESTED'
  | 'CONTENT_RESUME_REQUESTED'
  | 'CUEPOINTS_CHANGED'
  | 'FIRST_QUARTILE'
  | 'IMPRESSION'
  | 'INTERACTION'
  | 'LINEAR_CHANGED'
  | 'LOADED'
  | 'LOG'
  | 'MIDPOINT'
  | 'PAUSED'
  | 'RESUMED'
  | 'SKIPPABLE_STATE_CHANGED'
  | 'SKIPPED'
  | 'STARTED'
  | 'STREAM_LOADED'
  | 'TAPPED'
  | 'THIRD_QUARTILE'
  | 'UNKNOWN'
  | 'USER_CLOSE'
  | 'VIDEO_CLICKED'
  | 'VIDEO_ICON_CLICKED'
  | 'VOLUME_CHANGED'
  | 'VOLUME_MUTED';

export interface IMAAdEvent {
  event: IMAAdEventType;
  data?: Record<string, unknown>;
}

/**
 * Helper to determine if PiP should be hidden based on ad event
 * PiP cannot start during ads on iOS
 */
export const shouldHidePiPForAdEvent = (event: IMAAdEvent): boolean => {
  const eventsRequiringPiPHidden: IMAAdEventType[] = [
    'LOADED',
    'STARTED',
    'AD_BREAK_STARTED',
    'CONTENT_PAUSE_REQUESTED'
  ];
  return eventsRequiringPiPHidden.includes(event.event);
};

/**
 * Helper to determine if PiP can be shown again based on ad event
 */
export const canShowPiPAfterAdEvent = (event: IMAAdEvent): boolean => {
  const eventsAllowingPiP: IMAAdEventType[] = [
    'ALL_ADS_COMPLETED',
    'AD_BREAK_ENDED',
    'CONTENT_RESUME_REQUESTED',
    'SKIPPED',
    'COMPLETED',
    'AD_PERIOD_ENDED',
    'USER_CLOSE'
  ];
  return eventsAllowingPiP.includes(event.event);
};

/**
 * Returns HLS headers for video streaming requests
 */
export const getHlsHeaders = () => ({
  'User-Agent': `NPlus/1.0 (${isIos ? 'iOS' : 'Android'}; React Native)`,
  Accept: '*/*',
  'Accept-Language': 'es-MX,es;q=0.9',
  Origin: 'https://nmas.com.mx',
  Referer: 'https://nmas.com.mx/'
});

export default {
  generateAdTagUrl,
  generateLiveAdTagUrl,
  generateVODAdTagUrl,
  extractMcpIdFromVideoUrl,
  isValidAdTagUrl,
  shouldHidePiPForAdEvent,
  canShowPiPAfterAdEvent
};
