import { Linking } from 'react-native';

import { WebViewNavigation } from 'react-native-webview';

/**
 * Handles WebView navigation events for social media embeds.
 * Opens external URLs in the device's default browser instead of navigating within the WebView.
 *
 * @param event - The WebView navigation event
 * @returns false to prevent navigation if it's an external click, true otherwise
 */

export const handleWebViewNavigation = (event: WebViewNavigation): boolean => {
  const isExternal = event.url.startsWith('http');

  if (isExternal && event.navigationType === 'click') {
    Linking.openURL(event.url);
    return false;
  }

  return true;
};
