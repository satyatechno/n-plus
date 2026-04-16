import Foundation
import React

@objc(RNGAMBannerViewManager)
class RNGAMBannerViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return RNGAMBannerView()
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func loadAd(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            if let view = self.bridge?.uiManager.view(forReactTag: reactTag) as? RNGAMBannerView {
                view.loadAd()
            }
        }
    }
}
