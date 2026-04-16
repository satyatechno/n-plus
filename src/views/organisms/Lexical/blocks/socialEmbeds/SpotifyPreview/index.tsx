import React, { useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import { WebView, WebViewNavigation } from 'react-native-webview';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';

/**
 * Handles navigation events for the Spotify embed WebView.
 * - Intercepts spotify:// deep-link schemes (Save, Follow) → opens in Spotify app
 * - Allows internal embed navigation (open.spotify.com/embed/)
 * - Blocks all other HTTP redirects to prevent rendering Spotify's homepage
 */
const handleSpotifyNavigation = (event: WebViewNavigation): boolean => {
  const { url: targetUrl } = event;

  // Intercept spotify:// deep-link schemes (Save, Follow, etc.)
  if (targetUrl.startsWith('spotify://')) {
    Linking.openURL(targetUrl);
    return false;
  }

  // Allow internal embed resources (scripts, APIs, embed page itself)
  if (targetUrl.includes('open.spotify.com/embed')) {
    return true;
  }

  // Block any other HTTP navigation (homepage redirects, login pages, etc.)
  if (targetUrl.startsWith('http')) {
    Linking.openURL(targetUrl);
    return false;
  }

  // Allow non-HTTP (about:blank, data URIs, etc.)
  return true;
};

interface SpotifyPreviewProps {
  url: string; // Spotify track, playlist, or album URL
}

const getEmbedUrl = (spotifyUrl: string) => {
  if (!spotifyUrl) return '';

  try {
    const cleanUrl = spotifyUrl.split('?')[0];
    const parts = cleanUrl.split('/').filter(Boolean);

    const embedIndex = parts.indexOf('embed');

    if (embedIndex !== -1) {
      return cleanUrl;
    }

    const type = parts[2];
    const id = parts[3];

    if (type && id) {
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
  } catch {
    // Error handling is not needed as we fall back to the original URL
  }

  // fallback
  return spotifyUrl;
};

const SpotifyPreview: React.FC<SpotifyPreviewProps> = ({ url }) => {
  const [webViewHeight, setWebViewHeight] = useState<number>(152);
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const embedUrl = getEmbedUrl(url);

  const embedHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: ${theme.mainBackgroundDefault};
          }
          iframe {
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe 
          src="${embedUrl}" 
          width="100%" 
          height="${webViewHeight}" 
          allow="encrypted-media"
          allowtransparency="true">
        </iframe>

        <script>
          function sendHeight() {
            const height = document.querySelector('iframe').offsetHeight;
            window.ReactNativeWebView.postMessage(height.toString());
          }
          sendHeight();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { height: webViewHeight }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: embedHtml }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={(event) => {
          const height = parseInt(event.nativeEvent.data, 10);
          if (!isNaN(height) && height > 0) {
            setWebViewHeight(height);
          }
        }}
        startInLoadingState
        mixedContentMode="always"
        scalesPageToFit={false}
        onShouldStartLoadWithRequest={handleSpotifyNavigation}
      />
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginTop: actuatedNormalizeVertical(spacing.m),
      backgroundColor: theme.mainBackgroundDefault,
      borderRadius: 0
    },
    webview: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.mainBackgroundDefault
    }
  });

export default SpotifyPreview;
