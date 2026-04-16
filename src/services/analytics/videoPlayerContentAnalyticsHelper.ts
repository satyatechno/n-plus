import { AppEventsLogger } from 'react-native-fbsdk-next';

import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { SelectViewParams, AnalyticsParams } from '@src/services/analytics/analyticsTypes';

const buildVideoPayload = (params: SelectViewParams): AnalyticsParams => ({
  // -------- Equivalent web page info --------
  idPage: params.idPage ?? 'undefined',
  screen_page_web_url: params.screen_page_web_url ?? 'undefined',
  screen_name: params.screen_name ?? 'undefined',

  // -------- Content and navigation --------
  Tipo_Contenido: params.Tipo_Contenido ?? 'undefined',

  // -------- Taxonomy --------
  etiquetas: params.etiquetas ?? 'undefined',
  categories: params.categories ?? 'undefined',
  federative_entity: params.federative_entity ?? 'undefined',
  production: params.production ?? 'undefined',

  // -------- Content --------
  organisms: params.organisms ?? 'undefined',

  // ---------Video-------
  Video_Duration: params.Video_Duration ?? 'undefined',
  Fecha_Publicacion_Video: params.Fecha_Publicacion_Video ?? 'undefined',
  event_action: params.event_action ?? 'undefined',
  EtiquetasVOD: params.EtiquetasVOD ?? 'undefined',
  event_label: params.event_label ?? 'undefined',
  video_detail: params.video_detail ?? 'undefined'
});

const buildLiveVideoPayload = (params: SelectViewParams): AnalyticsParams => ({
  // -------- Equivalent web page info --------
  idPage: params.idPage ?? 'undefined',
  screen_page_web_url: params.screen_page_web_url ?? 'undefined',
  screen_name: params.screen_name ?? 'undefined',

  // -------- Content and navigation --------
  Tipo_Contenido: params.Tipo_Contenido ?? 'undefined',

  // -------- Taxonomy --------
  etiquetas: params.etiquetas ?? 'undefined',
  categories: params.categories ?? 'undefined',
  federative_entity: params.federative_entity ?? 'undefined',
  production: params.production ?? 'undefined',

  // -------- Content --------
  organisms: params.organisms ?? 'undefined',

  // ---------Video-------
  signal_time: params.signal_time ?? 'undefined',
  event_action: params.event_action ?? 'undefined',
  event_label: params.event_label ?? 'undefined'
});

export const logVideoEvent = (
  params: SelectViewParams,
  meta_eventName = 'Video',
  eventName: string = 'Video'
): void => {
  try {
    const payload = buildVideoPayload(params);
    const metaPayload = { ...payload };
    if (params.meta_content_action) {
      metaPayload.content_action = params.meta_content_action;
    }
    AnalyticsService.logEvent(eventName, payload);
    AppEventsLogger.logEvent(meta_eventName, metaPayload as Record<string, number>);
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};

export const logLiveVideoEvent = (
  params: SelectViewParams,
  meta_eventName = 'Video_vivo',
  eventName: string = 'Video_vivo'
): void => {
  try {
    const payload = buildLiveVideoPayload(params);
    const metaPayload = { ...payload };
    if (params.meta_content_action) {
      metaPayload.content_action = params.meta_content_action;
    }
    AnalyticsService.logEvent(eventName, payload);
    AppEventsLogger.logEvent(meta_eventName, metaPayload as Record<string, number>);
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};

export type { SelectViewParams };
