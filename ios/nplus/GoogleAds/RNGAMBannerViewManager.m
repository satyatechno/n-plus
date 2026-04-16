#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNGAMBannerViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(adSize, NSString)
RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTDirectEventBlock)

RCT_EXTERN_METHOD(loadAd:(nonnull NSNumber *)reactTag)

@end
