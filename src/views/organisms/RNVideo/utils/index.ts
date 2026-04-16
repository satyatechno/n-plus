export {
  generateAdTagUrl,
  generateLiveAdTagUrl,
  generateVODAdTagUrl,
  extractMcpIdFromVideoUrl,
  isValidAdTagUrl,
  shouldHidePiPForAdEvent,
  canShowPiPAfterAdEvent,
  getHlsHeaders
} from '@src/views/organisms/RNVideo/utils/VideoSDKAdapter';

export type {
  VideoAdConfig,
  VideoSite,
  VideoPageType,
  AdType,
  IMAAdEventType,
  IMAAdEvent
} from '@src/views/organisms/RNVideo/utils/VideoSDKAdapter';
