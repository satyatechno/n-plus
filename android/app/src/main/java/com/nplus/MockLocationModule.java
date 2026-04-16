package com.nmas.supernova;

import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MockLocationModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext context;

  public MockLocationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
  }

  @Override
  public String getName() {
    return "MockLocation";
  }

  /**
   * Checks if the last known location is from a mock provider
   */
  @ReactMethod
  public void isMockLocationEnabled(Promise promise) {
    try {
      LocationManager lm =
        (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);

      Location location = null;

      if (lm != null) {
        location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        if (location == null) {
          location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        }
      }

      if (location == null) {
        promise.resolve(false);
        return;
      }

      boolean isMock =
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2
          && location.isFromMockProvider();

      promise.resolve(isMock);
    } catch (Exception e) {
      promise.reject("MOCK_LOCATION_ERROR", e);
    }
  }

  /**
   * Checks if Developer Options are enabled
   */
  @ReactMethod
  public void isDeveloperOptionsEnabled(Promise promise) {
    try {
      int enabled = Settings.Secure.getInt(
        context.getContentResolver(),
        Settings.Secure.DEVELOPMENT_SETTINGS_ENABLED,
        0
      );

      promise.resolve(enabled == 1);
    } catch (Exception e) {
      promise.reject("DEV_OPTIONS_ERROR", e);
    }
  }
}
