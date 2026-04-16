import { AppEventsLogger } from 'react-native-fbsdk-next';

import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { SelectViewParams, AnalyticsParams } from '@src/services/analytics/analyticsTypes';

const buildSelectContentPayload = (params: SelectViewParams): AnalyticsParams => ({
  // -------- Equivalent web page info --------
  idPage: params.idPage ?? 'undefined',
  screen_page_web_url: params.screen_page_web_url ?? 'undefined',
  screen_name: params.screen_name ?? 'undefined',

  // -------- Content and navigation --------
  Tipo_Contenido: params.Tipo_Contenido ?? 'undefined',
  opening_display_type: params.opening_display_type ?? 'undefined',

  // -------- Taxonomy --------
  etiquetas: params.etiquetas ?? 'undefined',
  categories: params.categories ?? 'undefined',
  federative_entity: params.federative_entity ?? 'undefined',
  production: params.production ?? 'undefined',

  // -------- Content --------
  organisms: params.organisms ?? 'undefined',
  content_type: params.content_type ?? 'undefined',
  content_name: params.content_name ?? 'undefined',
  content_action: params.content_action ?? 'undefined',
  content_title: params.content_title ?? 'undefined'
});

export const logSelectContentEvent = (
  params: SelectViewParams,
  meta_eventName = 'select_content',
  eventName: string = 'select_content'
): void => {
  try {
    const payload = buildSelectContentPayload(params);
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

export const logLoginSignUpEvent = (
  params: { screen_name: string; method: string },
  meta_eventName = 'select_content',
  eventName: string = 'select_content'
): void => {
  try {
    AnalyticsService.logEvent(eventName, { ...params });
    AppEventsLogger.logEvent(meta_eventName, { ...params });
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};

export type { SelectViewParams };
