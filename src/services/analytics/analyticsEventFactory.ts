import { SelectViewParams } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';

/**
 * Factory for creating standardized analytics events
 * Reduces code duplication and ensures consistency
 */

export class AnalyticsEventFactory {
  static createSelectContentEvent(
    params: Omit<SelectViewParams, 'etiquetas' | 'categories' | 'federative_entity' | 'production'>
  ): SelectViewParams {
    return {
      ...params
    };
  }

  static createVideoEvent(
    idPage: string,
    contentName: string,
    organisms: string,
    contentType: string,
    contentAction: string,
    screenName: string = 'Videos',
    contentTypeType: string = 'Videos_Home_Video'
  ): SelectViewParams {
    return this.createSelectContentEvent({
      idPage,
      screen_name: screenName,
      Tipo_Contenido: contentTypeType,
      organisms,
      content_type: contentType,
      content_name: contentName,
      content_action: contentAction
    });
  }

  static createCarouselSwipeEvent(
    idPage: string,
    contentName: string,
    organisms: string,
    contentType: string,
    screenName: string = 'Videos',
    contentTypeType: string = 'Videos_Home_Video'
  ): SelectViewParams {
    return this.createSelectContentEvent({
      idPage,
      screen_name: screenName,
      Tipo_Contenido: contentTypeType,
      organisms,
      content_type: contentType,
      content_name: contentName,
      content_action: 'swipe_right'
    });
  }

  static createTapEvent(
    idPage: string,
    contentName: string,
    organisms: string,
    contentType: string,
    screenName: string = 'Videos',
    contentTypeType: string = 'Videos_Home_Video'
  ): SelectViewParams {
    return this.createSelectContentEvent({
      idPage,
      screen_name: screenName,
      Tipo_Contenido: contentTypeType,
      organisms,
      content_type: contentType,
      content_name: contentName,
      content_action: 'tap'
    });
  }

  // CTA (Call to Action) Analytics Methods
  static createProgramsCtaEvent(): SelectViewParams {
    return this.createSelectContentEvent({
      idPage: '',
      screen_name: 'Videos',
      Tipo_Contenido: 'Videos_Home_Video',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.PROGRAMS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.PROGRAMS_CTA_SECTION,
      content_name: '',
      content_action: 'tap'
    });
  }

  static createNPlusFocusCtaEvent(): SelectViewParams {
    return this.createSelectContentEvent({
      idPage: '',
      screen_name: 'Videos',
      Tipo_Contenido: 'Home_Video',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.N_PLUS_FOCUS,
      content_type: ANALYTICS_MOLECULES.VIDEOS.N_PLUS_FOCUS_CTA_SECTION,
      content_name: '',
      content_action: 'tap'
    });
  }

  static createPorElPlanetaCtaEvent(): SelectViewParams {
    return this.createSelectContentEvent({
      idPage: '',
      screen_name: 'Videos',
      Tipo_Contenido: 'Home_Video',
      organisms: ANALYTICS_ORGANISMS.VIDEOS.POR_EL_PLANETA,
      content_type: ANALYTICS_MOLECULES.VIDEOS.POR_EL_PLANETA_CTA_SECTION,
      content_name: '',
      content_action: 'tap'
    });
  }
}
