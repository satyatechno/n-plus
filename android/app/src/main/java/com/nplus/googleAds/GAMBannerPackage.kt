package com.nplus.googleAds

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class GAMBannerPackage : ReactPackage {

    companion object {
        @Volatile
        private var viewManagerInstance: BannerAdViewManager? = null
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        if (viewManagerInstance == null) {
            synchronized(this) {
                if (viewManagerInstance == null) {
                    viewManagerInstance = BannerAdViewManager(reactContext)
                }
            }
        }
        return listOf(viewManagerInstance!!)
    }
}
