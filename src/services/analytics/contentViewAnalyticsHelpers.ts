import { AppEventsLogger } from 'react-native-fbsdk-next';

import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { ContentViewParams, AnalyticsParams } from '@src/services/analytics/analyticsTypes';

const buildContentViewPayload = (params: ContentViewParams): AnalyticsParams => {
  const contentItem = params.contentItem;

  const etiquetas =
    contentItem?.topics
      ?.map((t) => t?.title)
      .filter(Boolean)
      .join(',') ||
    params.etiquetas ||
    'undefined';

  const categories = contentItem?.category?.title || params.categories || 'undefined';

  return {
    // -------- Equivalent web page info --------
    idPage: params.idPage ?? contentItem?.id ?? 'undefined',
    screen_page_web_url:
      params.screen_page_web_url ?? params.currentSlug ?? contentItem?.fullPath ?? 'undefined',
    screen_page_web_url_previous:
      params.screen_page_web_url_previous ?? params.previousSlug ?? 'undefined',
    screen_name: params.screen_name ?? 'undefined',

    // -------- Content and navigation --------
    Tipo_Contenido: params.Tipo_Contenido ?? 'undefined',
    author: params.author ?? 'undefined',
    Autor_Editorial: params.Autor_Editorial ?? 'undefined',
    news_wires: params.news_wires ?? 'undefined',
    Embeds: params.Embeds ?? 'undefined',
    Fecha_Publicacion_Texto:
      params.Fecha_Publicacion_Texto ?? contentItem?.publishedAt ?? 'undefined',
    opening_display_type: params.opening_display_type ?? 'undefined',

    // -------- Taxonomy --------
    etiquetas,
    categories,
    federative_entity: params.federative_entity ?? 'undefined',
    production: params.production ?? 'undefined',

    // -------- Content --------
    content_title: params.content_title ?? contentItem?.title ?? 'undefined'
  };
};

export const logContentViewEvent = (params: ContentViewParams): void => {
  try {
    const payload = buildContentViewPayload(params);
    AnalyticsService.logEvent('content_view', payload);
    AppEventsLogger.logEvent('page_view', payload as Record<string, number>);
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};

export type { ContentViewParams };
