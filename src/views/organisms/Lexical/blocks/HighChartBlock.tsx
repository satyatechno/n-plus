import React, { memo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import WebView from 'react-native-webview';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';

/**
 * HighChartBlock
 *
 * Renders a Highcharts (or other chart) embed within a WebView for Lexical content.
 * This component dynamically adjusts its height to fit the chart content by listening
 * for messages from the WebView's injected JavaScript, which posts the document's scrollHeight.
 *
 * Props:
 *   - url: The URL of the chart to embed (should be a public, embeddable page).
 *
 * Usage:
 *   <HighChartBlock url={url} />
 *
 * The component is intended for use within Lexical block rendering.
 */

interface HighChartBlockProps {
  url: string;
}

const HighChartBlock = ({ url }: HighChartBlockProps) => {
  const [webViewHeight, setWebViewHeight] = useState<number>(1);
  const webViewRef = useRef(null);

  if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;

  const injectedJS = `
    (function() {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);

      setTimeout(function() {
        window.ReactNativeWebView.postMessage(
          Math.max(
            document.documentElement.scrollHeight, 
            document.body.scrollHeight
          ).toString()
        );
      }, 100);
    })();
    true;
  `;

  return (
    <View style={[styles.container, { height: webViewHeight }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          const height = parseInt(event.nativeEvent.data, 10);
          if (!isNaN(height)) {
            setWebViewHeight(height);
          }
        }}
        startInLoadingState
        automaticallyAdjustContentInsets={false}
        mixedContentMode="always"
        allowsFullscreenVideo
        scalesPageToFit={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginTop: actuatedNormalizeVertical(spacing.m)
  }
});

export default memo(HighChartBlock);
