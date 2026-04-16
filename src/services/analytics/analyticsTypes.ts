/**
 * Common Analytics Types and Interfaces
 * Shared across all analytics helper modules
 */

import { SearchContentItem } from '@src/models/main/MyAccount/Bookmarks';
import { COLLECTION_TYPE } from '@src/config/enum';

/**
 * Base payload type for all analytics events
 */
export type AnalyticsParams = Record<string, string | number | undefined>;

/**
 * Common properties shared by all analytics events
 * Based on CONTENT_VIEW requirements
 */
export interface BaseAnalyticsParams {
  // -------- Equivalent web page info --------
  idPage?: string;
  screen_page_web_url?: string;
  screen_page_web_url_previous?: string;
  screen_name?: string;

  // -------- Content and navigation --------
  Tipo_Contenido?: string;
  author?: string;
  Autor_Editorial?: string;
  news_wires?: string;
  Embeds?: string;
  Fecha_Publicacion_Texto?: string;
  opening_display_type?: string;

  // -------- Taxonomy --------
  etiquetas?: string;
  categories?: string;
  federative_entity?: string;
  production?: string;

  // -------- Content --------
  content_title?: string;

  // ---------Video-------
  Video_Duration?: string;
  Fecha_Publicacion_Video?: string;
  event_action?: string;
  EtiquetasVOD?: string;
  video_detail?: string;
  event_label?: string;
  signal_time?: string;
}

/**
 * Search-specific properties
 * Used for search-related analytics events
 */
export interface SearchSpecificParams {
  contentItem?: SearchContentItem | null;
  collection?: COLLECTION_TYPE;
  currentSlug?: string;
  previousSlug?: string;
  searchQuery?: string;
}

/**
 * Select-specific properties
 * Used for user interaction/selection events
 */
export interface SelectSpecificParams {
  content_type?: string;
  content_id?: string;
  content_name?: string;
  content_action?: string;
  meta_content_action?: string;
  action?: string;
  organisms?: string;
  molecules?: string;
}

/**
 * CONTENT_VIEW event parameters
 * Combines base + search properties
 */
export interface ContentViewParams extends BaseAnalyticsParams, SearchSpecificParams {}

/**
 * SELECT_VIEW event parameters
 * Combines base + select properties
 */
export interface SelectViewParams extends BaseAnalyticsParams, SelectSpecificParams {}

/**
 * Live stream interaction actions
 * Used for the af_video_live event
 */
export type VideoLiveAction =
  | 'video_vivo_start'
  | 'video_vivo_pause'
  | 'video_vivo_resume'
  | 'video_vivo_mute'
  | 'video_vivo_unmute'
  | 'video_vivo_fullscreen'
  | 'video_vivo_exit_fullscreen'
  | 'video_vivo_pip_open'
  | 'video_vivo_pip_close'
  | 'video_vivo_cast_start'
  | 'video_vivo_cast_stop'
  | 'video_vivo_ad_start_preroll'
  | 'video_vivo_error_geoblock'
  | 'video_vivo_error_playback'
  | 'video_vivo_error_setup'
  | 'video_selec_operador'
  | 'video_ingreso_exitoso'
  | 'video_registro';

/**
 * AF_VIDEO_LIVE event parameters
 * Tracks live-stream interactions (start, pause, mute, resume, complete).
 * Enables measuring engagement in live broadcasts and optimizing real-time audience behavior.
 *
 * Note: device_id, client_ID_hit and user_id_nmas_hit are injected automatically
 * by AnalyticsService.logEvent via buildAppsFlyerParams — do NOT pass them manually.
 */
export interface VideoLiveParams {
  /** Interaction type */
  event_action: VideoLiveAction;
  /** Title of the video / live stream */
  event_label: string;
  /** Timestamp of the interaction in Mexico City time. Format: YYYY-MM-DD HH:mm:ss */
  signal_time: string;
  /** Channel associated with the video (e.g. 'nmas', 'foro-tv', 'nplus-guadalajara') */
  channel?: string;
}
