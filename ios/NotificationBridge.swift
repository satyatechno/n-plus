import Foundation
import React

@objc(NotificationBridge)
class NotificationBridge: RCTEventEmitter {

  private static var shared: NotificationBridge?
  private static var pendingTappedPayload: [AnyHashable: Any]?
  private static var hasListeners = false

  override init() {
    super.init()
    NotificationBridge.shared = self
  }

  // RN will call this when JS starts listening
  override func startObserving() {
    NotificationBridge.hasListeners = true

    // 🔥 Replay pending cold-start payload
    if let payload = NotificationBridge.pendingTappedPayload {
      NotificationBridge.pendingTappedPayload = nil
      sendEvent(withName: "onNotificationTapped", body: payload)
    }
  }

  override func stopObserving() {
    NotificationBridge.hasListeners = false
  }

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    return ["onNotificationTapped", "onMessageReceived"]
  }

  // MARK: - Public Emitters
  @objc static func emitNotificationTapped(_ payload: [AnyHashable: Any]) {
    DispatchQueue.main.async {
      // If JS is listening → send immediately
      if let shared = shared, hasListeners {
        shared.sendEvent(
          withName: "onNotificationTapped",
          body: payload
        )
      } else {
        // JS not ready yet → cache safely
        pendingTappedPayload = payload
      }
    }
  }

  @objc static func emitMessageReceived(_ payload: [AnyHashable: Any]) {
    DispatchQueue.main.async {
      if let shared = shared, hasListeners {
        shared.sendEvent(
          withName: "onMessageReceived",
          body: payload
        )
      }
    }
  }
}
