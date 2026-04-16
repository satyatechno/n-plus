import UIKit
import GoogleMobileAds
import React

@objc(RNGAMBannerView)
class RNGAMBannerView: UIView {
    
    private var bannerView: AdManagerBannerView?
    private var adUnitId: String = ""
    
    @objc var onAdLoaded: RCTDirectEventBlock?
    @objc var onAdFailedToLoad: RCTDirectEventBlock?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    @objc func setAdUnitId(_ adUnitId: String) {
        self.adUnitId = adUnitId
    }
    
    @objc func setAdSize(_ adSize: String) {
        // Only MEDIUM_RECTANGLE is supported
    }
    
    @objc func loadAd() {
        guard !adUnitId.isEmpty else { return }
        
        bannerView?.removeFromSuperview()
        
        bannerView = AdManagerBannerView(adSize: AdSizeMediumRectangle)
        bannerView?.adUnitID = adUnitId
        bannerView?.delegate = self
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootViewController = windowScene.windows.first?.rootViewController {
            bannerView?.rootViewController = rootViewController
        }
        
        if let banner = bannerView {
            addSubview(banner)
            banner.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                banner.centerXAnchor.constraint(equalTo: centerXAnchor),
                banner.centerYAnchor.constraint(equalTo: centerYAnchor)
            ])
        }
        
        bannerView?.load(AdManagerRequest())
    }
    
    @objc func destroyAd() {
        bannerView?.removeFromSuperview()
        bannerView = nil
    }
    
    deinit {
        destroyAd()
    }
}

extension RNGAMBannerView: BannerViewDelegate {
    
    func bannerViewDidReceiveAd(_ bannerView: BannerView) {
        onAdLoaded?([:])
    }
    
    func bannerView(_ bannerView: BannerView, didFailToReceiveAdWithError error: Error) {
        onAdFailedToLoad?(["error": error.localizedDescription])
    }
}
