import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import { WebView } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview';

import { radius, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import SkeletonLoader from '@src/views/organisms/Lexical/blocks/socialEmbeds/EmbedsSkeletonLoader';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TikTokPreviewProps {
  url: string;
  customTheme?: 'light' | 'dark';
}

interface HeightMessage {
  type: 'setHeight' | 'heightStabilized';
  height: number;
  checkCount: number;
  isStable?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIKTOK_EMBED_BASE_URL = 'https://www.tiktok.com/embed/v2';
const TIKTOK_EMBED_DOMAIN = 'tiktok.com/embed';
const BLOCKED_SCHEMES = ['snssdk1233://', 'musically://', 'itms-apps://', 'market://'];

const INITIAL_HEIGHT = 700;
const MIN_VALID_HEIGHT = 400;
const STABILITY_THRESHOLD = 3;
const CHECK_INTERVAL_MS = 500;
const MAX_ATTEMPTS = 30;
const INITIAL_DELAY_MS = 1000;
const CONTENT_REVEAL_DELAY_MS = 100;
const FALLBACK_REVEAL_DELAY_MS = 500;
const MAX_RETRIES = 1;

// ─── Pure helpers (Single Responsibility) ────────────────────────────────────

/**
 * Extracts the TikTok video ID from a public URL.
 * @example
 *   getTikTokVideoId('https://www.tiktok.com/@n.mas/video/7489175178320877829')
 *   // → '7489175178320877829'
 */
const getTikTokVideoId = (url: string): string => {
  const match = url.match(/\/video\/(\d+)/);
  return match?.[1] ?? '';
};

/** Builds the direct embed URL for a given video ID. */
const buildEmbedUrl = (videoId: string): string => `${TIKTOK_EMBED_BASE_URL}/${videoId}`;

/**
 * Custom navigation handler for TikTok embeds.
 * - Allows internal embed navigation (same domain/embed path)
 * - Blocks deep-link schemes that cause Play Store redirects on Android
 * - Opens the actual target URL for external clicks (profiles, related videos)
 */
const createTikTokNavigationHandler =
  (originalUrl: string) =>
  (event: WebViewNavigation): boolean => {
    const { url: targetUrl, navigationType } = event;

    // Block TikTok deep-link schemes and app store redirects → fallback to original post
    if (BLOCKED_SCHEMES.some((scheme) => targetUrl.startsWith(scheme))) {
      Linking.openURL(originalUrl);
      return false;
    }

    // Allow internal embed navigation (resources, scripts, API calls)
    if (targetUrl.includes(TIKTOK_EMBED_DOMAIN)) {
      return true;
    }

    // External click → open the actual target URL (profile, related video, etc.)
    if (navigationType === 'click' && targetUrl.startsWith('http')) {
      Linking.openURL(targetUrl);
      return false;
    }

    // Allow everything else (about:blank, data URIs, etc.)
    return true;
  };

/**
 * Generates the JavaScript to inject into the WebView after the page loads.
 * Handles viewport configuration and height stabilization polling.
 */
const buildInjectedJavaScript = (): string => `
  (function() {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);

    var style = document.createElement('style');
    style.textContent = '* { max-width: 100% !important; } body { margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }';
    document.head.appendChild(style);

    var heightCheckCount = 0;
    var lastHeight = 0;
    var stableHeightCount = 0;

    function checkHeight() {
      var height = Math.max(
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0,
        document.documentElement.offsetHeight || 0,
        document.body.offsetHeight || 0
      );

      heightCheckCount++;

      if (height === lastHeight && height > ${MIN_VALID_HEIGHT}) {
        stableHeightCount++;
        if (stableHeightCount >= ${STABILITY_THRESHOLD}) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'heightStabilized',
            height: height,
            checkCount: heightCheckCount
          }));
          return;
        }
      } else {
        stableHeightCount = 0;
      }

      lastHeight = height;

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'setHeight',
        height: height,
        checkCount: heightCheckCount,
        isStable: false
      }));

      if (heightCheckCount < ${MAX_ATTEMPTS}) {
        setTimeout(checkHeight, ${CHECK_INTERVAL_MS});
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'heightStabilized',
          height: height,
          checkCount: heightCheckCount
        }));
      }
    }

    setTimeout(checkHeight, ${INITIAL_DELAY_MS});
  })();
  true;
`;

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * TikTokPreview
 *
 * Renders a TikTok video embed inside a WebView using TikTok's
 * direct embed URL (`/embed/v2/{videoId}`).
 *
 * Follows the same architectural pattern as FacebookPreview:
 *   - Loads the provider URL directly (`source={{ uri }}`)
 *   - Injects viewport + height-stabilization JS post-load
 *   - Shows a SkeletonLoader until the height is stable
 */
const TikTokPreview: React.FC<TikTokPreviewProps> = ({ url, customTheme }) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const [webViewHeight, setWebViewHeight] = useState<number>(INITIAL_HEIGHT);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [heightStabilized, setHeightStabilized] = useState(false);

  const webViewRef = useRef<WebView>(null);
  const lastHeightRef = useRef<number>(INITIAL_HEIGHT);

  const videoId = getTikTokVideoId(url);
  const embedUrl = buildEmbedUrl(videoId);
  const injectedJavaScript = buildInjectedJavaScript();

  // ── Event handlers ───────────────────────────────────────────────────────

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data: HeightMessage = JSON.parse(event.nativeEvent.data);

        if (data.type === 'setHeight' && data.height) {
          lastHeightRef.current = Number(data.height);

          if (!heightStabilized) {
            setWebViewHeight(Number(data.height));
          }
        }

        if (data.type === 'heightStabilized' && data.height) {
          setWebViewHeight(Number(data.height));
          setHeightStabilized(true);
          setTimeout(() => setIsContentLoaded(true), CONTENT_REVEAL_DELAY_MS);
        }
      } catch {
        // Legacy numeric fallback
        const height = parseInt(event.nativeEvent.data, 10);
        if (!isNaN(height) && height > 0) {
          setWebViewHeight(height);
          if (!isContentLoaded) {
            setTimeout(() => setIsContentLoaded(true), FALLBACK_REVEAL_DELAY_MS);
          }
        }
      }
    },
    [heightStabilized, isContentLoaded]
  );

  const retryCountRef = useRef(0);

  const onError = useCallback(() => {
    // Auto-retry once on transient errors (e.g. ERR_HTTP2_PROTOCOL_ERROR after backgrounding)
    if (retryCountRef.current < MAX_RETRIES && webViewRef.current) {
      retryCountRef.current += 1;
      webViewRef.current.reload();
      return;
    }

    // After max retries, keep skeleton visible (don't show the ugly error page)
    setHeightStabilized(true);
  }, []);

  const handleNavigation = useCallback(
    (event: WebViewNavigation) => createTikTokNavigationHandler(url)(event),
    [url]
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { height: webViewHeight }]}>
      {!isContentLoaded && <SkeletonLoader height={webViewHeight} />}
      <WebView
        ref={webViewRef}
        source={{ uri: embedUrl }}
        style={[styles.webview, { opacity: isContentLoaded ? 1 : 0 }]}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        automaticallyAdjustContentInsets={false}
        mixedContentMode="always"
        scalesPageToFit={false}
        allowsInlineMediaPlayback
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={handleNavigation}
        onError={onError}
      />
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginTop: spacing.m,
      borderRadius: radius.xxs,
      overflow: 'hidden'
    },
    webview: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.mainBackgroundDefault
    }
  });

export default TikTokPreview;
