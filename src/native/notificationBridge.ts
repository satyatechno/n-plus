import { NativeEventEmitter, NativeModules } from 'react-native';

import { isIos } from '@src/utils/platformCheck';

const { NotificationBridge } = NativeModules;

let emitter: NativeEventEmitter | null = null;

if (isIos && NotificationBridge) {
  emitter = new NativeEventEmitter(NotificationBridge);
}

/**
 * Subscribe to push-notification events emitted by the native iOS `NotificationBridge`.
 *
 * Notes:
 * - This is **iOS-only**. On Android (or when the native module is unavailable), this returns a no-op unsubscribe.
 * - The returned function removes all registered event listeners.
 *
 * @param params Subscription callbacks.
 * @param params.onTap Called when the user taps a push notification.
 * @param params.onReceive Called when a push notification is received while the app is running.
 * @returns Unsubscribe function.
 */
export function subscribeToNotifications({
  onTap,
  onReceive
}: {
  onTap?: (payload: unknown) => void;
  onReceive?: (payload: unknown) => void;
}) {
  if (!emitter) {
    return () => {};
  }

  const subs: Array<{ remove: () => void }> = [];

  if (onTap) {
    subs.push(
      emitter.addListener('onNotificationTapped', (payload) => {
        onTap(payload);
      })
    );
  }

  if (onReceive) {
    subs.push(
      emitter.addListener('onMessageReceived', (payload) => {
        onReceive(payload);
      })
    );
  }

  return () => {
    subs.forEach((s) => s.remove());
  };
}
