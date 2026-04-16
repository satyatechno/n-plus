import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import { WebView } from 'react-native-webview';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/organisms/Lexical/blocks/socialEmbeds/EmbedsSkeletonLoader';
import { AppTheme } from '@src/themes/theme';
import { handleWebViewNavigation } from '@src/utils/webViewNavigation';

interface XPreviewProps {
  url: string; // Full public tweet link
  customTheme?: 'light' | 'dark';
}

const XPreview: React.FC<XPreviewProps> = ({ url, customTheme }) => {
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  const initialHeight = 300;
  const [webViewHeight, setWebViewHeight] = useState<number>(initialHeight);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [heightStabilized, setHeightStabilized] = useState<boolean>(false);
  const webViewRef = useRef<WebView>(null);
  const lastHeightRef = useRef<number>(initialHeight);

  const tweetUrl = url.replace('x.com', 'twitter.com');

  const embedHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <blockquote class="twitter-tweet">
          <a href="${tweetUrl}">View Tweet</a>
        </blockquote>
        <script async src="https://platform.twitter.com/widgets.js"></script>
        <script>
          let heightCheckCount = 0;
          let lastHeight = 0;
          let stableHeightCount = 0;
          const STABILITY_THRESHOLD = 3;
          const CHECK_INTERVAL = 300;
          const MAX_ATTEMPTS = 40; // 12 seconds max
          
          function checkHeight() {
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load();
              
              setTimeout(function() {
                const height = Math.max(
                  document.documentElement.scrollHeight || 0,
                  document.body.scrollHeight || 0,
                  document.documentElement.offsetHeight || 0,
                  document.body.offsetHeight || 0
                );
                
                heightCheckCount++;
                
                // Check if height has stabilized
                if (height === lastHeight && height > 200) { // Twitter embeds are usually > 200px
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
              }, 1000); // Initial delay for Twitter embed to start loading
            } else {
              // Twitter script not loaded yet, try again
              if (heightCheckCount < MAX_ATTEMPTS) {
                setTimeout(checkHeight, CHECK_INTERVAL);
                heightCheckCount++;
              }
            }
          }
          
          // Start checking after a brief delay
          setTimeout(checkHeight, 500);
        </script>
      </body>
    </html>
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
        originWhitelist={['*']}
        source={{ html: embedHtml }}
        style={StyleSheet.flatten([styles.webview, { opacity: isContentLoaded ? 1 : 0 }])}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={handleMessage}
        mixedContentMode="always"
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
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    webview: {
      flex: 1,
      width: '100%',
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

export default XPreview;
