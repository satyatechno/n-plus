import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import { WebView } from 'react-native-webview';

import { radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { handleWebViewNavigation } from '@src/utils/webViewNavigation';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import SkeletonLoader from '@src/views/organisms/Lexical/blocks/socialEmbeds/EmbedsSkeletonLoader';

interface FacebookPreviewProps {
  url: string;
  customTheme?: 'light' | 'dark';
}

const FacebookPreview: React.FC<FacebookPreviewProps> = ({ url, customTheme }) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  const embedUrl = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}`;
  const initialHeight = 200; // Facebook posts are typically medium height
  const [webViewHeight, setWebViewHeight] = useState<number>(initialHeight);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [heightStabilized, setHeightStabilized] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const lastHeightRef = useRef<number>(initialHeight);

  const injectedJavaScript = `
    (function() {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);

      const style = document.createElement('style');
      style.innerHTML = 'html, body { width: 100%; height: auto; display: block; margin: 0; padding: 0; }';
      document.head.appendChild(style);

      let heightCheckCount = 0;
      let lastHeight = 0;
      let stableHeightCount = 0;
      const STABILITY_THRESHOLD = 3;
      const CHECK_INTERVAL = 500; // Longer for Facebook
      const MAX_ATTEMPTS = 30; // 15 seconds max
      
      function checkHeight() {
        const height = Math.max(
          document.documentElement.scrollHeight || 0,
          document.body.scrollHeight || 0,
          document.documentElement.offsetHeight || 0,
          document.body.offsetHeight || 0
        );
        
        heightCheckCount++;
        
        // Check if height has stabilized
        if (height === lastHeight && height > 250) { // Facebook embeds are usually > 250px
          stableHeightCount++;
          if (stableHeightCount >= STABILITY_THRESHOLD) {
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
        
        // Send current height update
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: 'setHeight', 
          height: height,
          checkCount: heightCheckCount,
          isStable: false
        }));
        
        // Continue checking if not stable and haven't exceeded max attempts
        if (heightCheckCount < MAX_ATTEMPTS) {
          setTimeout(checkHeight, CHECK_INTERVAL);
        } else {
          // Fallback: assume current height is final
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'heightStabilized', 
            height: height,
            checkCount: heightCheckCount
          }));
        }
      }
      
      // Start checking after Facebook content loads
      setTimeout(checkHeight, 1000);
    })();
    true;
  `;

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'setHeight' && data.height) {
        const newHeight = Number(data.height);
        lastHeightRef.current = newHeight;

        // Update height but don't show content yet if not stabilized
        if (!heightStabilized) {
          setWebViewHeight(newHeight);
        }
      }

      if (data.type === 'heightStabilized' && data.height) {
        const finalHeight = Number(data.height);
        setWebViewHeight(finalHeight);
        setHeightStabilized(true);

        // Show content after a brief delay to ensure smooth transition
        setTimeout(() => {
          setIsContentLoaded(true);
        }, 100);
      }
    } catch {
      // Handle legacy numeric messages (fallback)
      const height = parseInt(event.nativeEvent.data, 10);
      if (!isNaN(height) && height > 0) {
        setWebViewHeight(height);
        if (!isContentLoaded) {
          setTimeout(() => {
            setIsContentLoaded(true);
          }, 500);
        }
      }
    }
  };

  const onError = () => {
    setHeightStabilized(true);
    setIsContentLoaded(true);
  };

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
        allowsFullscreenVideo
        scalesPageToFit={false}
        onShouldStartLoadWithRequest={handleWebViewNavigation}
        onError={onError}
      />
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginTop: actuatedNormalizeVertical(spacing.m),
      borderRadius: radius.xxs,
      overflow: 'hidden'
    },
    webview: {
      flex: 1,
      width: '100%',
      maxWidth: 550, // Standard max width for social embeds
      alignSelf: 'center',
      backgroundColor: theme.mainBackgroundDefault
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1
    }
  });

export default FacebookPreview;
