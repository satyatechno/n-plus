package com.nplus.googleAds

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

class BannerAdViewManager(
    private val reactContext: ReactApplicationContext
) : SimpleViewManager<BannerAdView>() {

    companion object {
        const val REACT_CLASS = "RNGAMBannerView"
        const val COMMAND_LOAD_AD = 1
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): BannerAdView {
        return BannerAdView(reactContext).apply {
            onAdLoaded = {
                reactContext.getJSModule(RCTEventEmitter::class.java)
                    .receiveEvent(id, "onAdLoaded", Arguments.createMap())
            }
            onAdFailedToLoad = { error ->
                val event = Arguments.createMap().apply { putString("error", error) }
                reactContext.getJSModule(RCTEventEmitter::class.java)
                    .receiveEvent(id, "onAdFailedToLoad", event)
            }
        }
    }

    @ReactProp(name = "adUnitId")
    fun setAdUnitId(view: BannerAdView, adUnitId: String?) {
        adUnitId?.let { view.setAdUnitId(it) }
    }

    @ReactProp(name = "adSize")
    fun setAdSize(view: BannerAdView, adSize: String?) {
        adSize?.let { view.setAdSizeType(it) }
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        return MapBuilder.builder<String, Any>()
            .put("onAdLoaded", MapBuilder.of("registrationName", "onAdLoaded"))
            .put("onAdFailedToLoad", MapBuilder.of("registrationName", "onAdFailedToLoad"))
            .build()
    }

    override fun getCommandsMap(): Map<String, Int> {
        return MapBuilder.of("loadAd", COMMAND_LOAD_AD)
    }

    override fun receiveCommand(view: BannerAdView, commandId: String, args: ReadableArray?) {
        if (commandId == "loadAd") view.loadAd()
    }

    override fun onDropViewInstance(view: BannerAdView) {
        super.onDropViewInstance(view)
        view.destroyAd()
    }
}
