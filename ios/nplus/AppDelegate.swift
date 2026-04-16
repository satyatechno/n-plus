import UIKit
import react_native_orientation_locker
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FBSDKCoreKit
import RNGoogleSignin
import Firebase
import GoogleCast
import Indigitall
import IndigitallReactNativePlugin
import GoogleMobileAds
import AVFoundation
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()
    
    MobileAds.shared.start(completionHandler: nil)
    

    // react-native-video: Configure AVAudioSession for background playback
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback)
      try AVAudioSession.sharedInstance().setActive(true)
    } catch {
      print("Failed to set audio session category: \(error)")
    }

    UNUserNotificationCenter.current().delegate = self;

    let criteria = GCKDiscoveryCriteria(applicationID: kGCKDefaultMediaReceiverApplicationID)
    let options = GCKCastOptions(discoveryCriteria: criteria)
    GCKCastContext.setSharedInstanceWith(options)
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "nplus",
      in: window,
      launchOptions: launchOptions
    )

    ApplicationDelegate.shared.application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )
    
    if let remoteNotification =
        launchOptions?[.remoteNotification] as? [AnyHashable: Any] {
      // 🔹 Send to React Native
      NotificationBridge.emitNotificationTapped(remoteNotification)
    }

    return true
  }
  
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
      return RCTLinkingManager.application(
        application,
        continue: userActivity,
        restorationHandler: restorationHandler
      )
    }
  
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
    DispatchQueue.main.async {
      let name = NSNotification.Name(rawValue: "onMessagedReceived")
      NotificationCenter.default.post(name: name, object: nil, userInfo: notification.request.content.userInfo)
    };
    return Indigitall.willPresentNotification()
  }

  // MARK: - User tapped notification (background / killed)
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
    let userInfo = response.notification.request.content.userInfo
    NotificationBridge.emitNotificationTapped(userInfo)

    IndigitallReactNativePlugin.handleTapNotification(response)
    await Indigitall.handle(with: response)
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      //get token
      IndigitallReactNativePlugin.sendToken(deviceToken)
      Indigitall.setDeviceToken(deviceToken)
    }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    return ApplicationDelegate.shared.application(
      app,
      open: url,
      sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
      annotation: options[UIApplication.OpenURLOptionsKey.annotation]
    )
    ||
    GIDSignIn.sharedInstance.handle(url)
  }
  
  func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
