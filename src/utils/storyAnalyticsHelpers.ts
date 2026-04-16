import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { ANALYTICS_ATOMS } from './analyticsConstants';

/**
 * Story data structure for analytics
 */
export interface StoryData {
  id?: string;
  fullPath?: string;
  title?: string;
  openingType?: string;
  displayType?: string;
  category?: { title?: string };
  provinces?: Array<{ title?: string }>;
  topics?: Array<{ title?: string }>;
  channel?: { title?: string };
  production?: { title?: string };
}

/**
 * Extracts story taxonomy data for analytics
 * Returns formatted strings for federative entity, etiquetas, and production
 */
export const extractStoryTaxonomy = (story: StoryData | null) => {
  try {
    if (!story) {
      return {
        federativeEntityString: '',
        etiquetasString: '',
        productionValue: ''
      };
    }

    const federativeEntity =
      Array.isArray(story?.provinces) && story.provinces
        ? story.provinces.map((p: { title?: string }) => p?.title).filter(Boolean)
        : [];
    const federativeEntityString = federativeEntity.join(',');
    const etiquetas =
      Array.isArray(story?.topics) && story.topics
        ? story.topics.map((t: { title?: string }) => t?.title).filter(Boolean)
        : [];
    const etiquetasString =
      etiquetas.length > 0 ? etiquetas.join(',').substring(0, 100) : 'undefined';

    const productionValue = [story?.channel?.title, story?.production?.title]
      .filter(Boolean)
      .join('_');

    return {
      federativeEntityString,
      etiquetasString,
      productionValue
    };
  } catch {
    return {
      federativeEntityString: '',
      etiquetasString: '',
      productionValue: ''
    };
  }
};

/**
 * Builds base select_content payload for StoryPage events
 */
export const buildSelectContentPayload = (
  story: StoryData | null,
  contentData: {
    organism: string;
    molecule: string;
    contentName: string;
    currentSlug: string;
    previousSlug?: string;
    screenName?: string;
    tipoContenido?: string;
    contentAction?: string;
  }
) => {
  try {
    if (!story?.id || !story?.fullPath) {
      return null;
    }

    const { federativeEntityString, etiquetasString, productionValue } =
      extractStoryTaxonomy(story);

    const contentTitle = (story.title || '').substring(0, 100);

    return {
      idPage: story.id || 'undefined',
      screen_page_web_url: contentData.currentSlug || 'undefined',
      screen_page_web_url_previous: contentData.previousSlug || 'undefined',
      screen_name: contentData?.screenName ?? 'undefined',
      Tipo_Contenido: contentData?.tipoContenido ?? 'undefined',
      opening_display_type: `${story.openingType || 'undefined'}_${story.displayType || 'undefined'}`,
      etiquetas: etiquetasString || 'undefined',
      categories: story.category?.title || 'undefined',
      federative_entity: federativeEntityString || 'undefined',
      production: productionValue || 'undefined',
      organisms: contentData?.organism || 'undefined',
      content_type: contentData?.molecule || 'undefined',
      content_name: contentData.contentName || 'undefined',
      content_title: contentTitle,
      content_action: contentData?.contentAction ?? ANALYTICS_ATOMS.TAP
    };
  } catch {
    return null;
  }
};

/**
 * Sends select_content analytics event
 * Validates story data and builds payload before sending
 */
export const logSelectContentEvent = (
  story: StoryData | null,
  contentData: {
    organism: string;
    molecule: string;
    contentName: string;
    currentSlug: string;
    previousSlug?: string;
    screenName?: string;
    tipoContenido?: string;
    contentAction?: string;
  }
): void => {
  try {
    const payload = buildSelectContentPayload(story, contentData);
    if (payload) {
      AnalyticsService.logEvent('select_content', payload);
      AppEventsLogger.logEvent('select_content', payload);
    }
  } catch {
    // Silently handle analytics errors to prevent app crashes
  }
};
