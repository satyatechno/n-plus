package com.nplus.googleAds

import android.content.Context
import android.util.AttributeSet
import android.view.Gravity
import android.widget.FrameLayout
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.admanager.AdManagerAdRequest
import com.google.android.gms.ads.admanager.AdManagerAdView

class BannerAdView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private var adManagerAdView: AdManagerAdView? = null
    private var adUnitId: String = ""

    var onAdLoaded: (() -> Unit)? = null
    var onAdFailedToLoad: ((String) -> Unit)? = null

    fun setAdUnitId(adUnitId: String) {
        this.adUnitId = adUnitId
    }

    fun setAdSizeType(sizeType: String) {
        // Only MEDIUM_RECTANGLE is supported
    }

    fun loadAd() {
        if (adUnitId.isEmpty()) {
            onAdFailedToLoad?.invoke("Ad Unit ID is not set")
            return
        }

        removeAllViews()
        adManagerAdView?.destroy()

        adManagerAdView = AdManagerAdView(context).apply {
            setAdUnitId(this@BannerAdView.adUnitId)
            setAdSize(AdSize.MEDIUM_RECTANGLE)
            
            adListener = object : AdListener() {
                override fun onAdLoaded() {
                    this@BannerAdView.post {
                        this@BannerAdView.requestLayout()
                        this@BannerAdView.invalidate()
                    }
                    this@BannerAdView.onAdLoaded?.invoke()
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    this@BannerAdView.onAdFailedToLoad?.invoke(adError.message)
                }
            }
        }

        val layoutParams = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.CENTER
        }
        addView(adManagerAdView, layoutParams)
        adManagerAdView?.loadAd(AdManagerAdRequest.Builder().build())
    }

    fun destroyAd() {
        adManagerAdView?.destroy()
        adManagerAdView = null
        removeAllViews()
    }

    override fun requestLayout() {
        super.requestLayout()
        post(measureAndLayout)
    }

    private val measureAndLayout = Runnable {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        )
        layout(left, top, right, bottom)
    }
}
