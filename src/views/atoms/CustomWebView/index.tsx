import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, SafeAreaView, BackHandler } from 'react-native';

import { WebView } from 'react-native-webview';

import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import CustomHeader from '@src/views/molecules/CustomHeader';
import useAuthStore from '@src/zustand/auth/authStore';

type Props = {
  uri: string;
  containerStyle?: StyleProp<ViewStyle>;
  webViewStyle?: StyleProp<ViewStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  isVisible?: boolean;
  onClose?: () => void;
};

const CustomWebView: React.FC<Props> = ({
  uri,
  containerStyle,
  webViewStyle,
  headerContainerStyle,
  isVisible = false,
  onClose
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const webviewRef = useRef<WebView>(null);
  const { authToken, refreshToken } = useAuthStore();

  const [canGoBack, setCanGoBack] = useState(false);

  const handleBackPress = useCallback(() => {
    if (canGoBack && webviewRef.current) {
      webviewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [canGoBack]);

  const sendTokenToWeb = () => {
    const message = {
      type: 'AUTH_TOKEN',
      payload: { token: authToken, refreshToken: refreshToken, webviewKey: 'FromAppSide' }
    };

    webviewRef.current?.postMessage(JSON.stringify(message));
  };

  const handleHeaderBackPress = () => {
    if (canGoBack && webviewRef.current) {
      webviewRef.current.goBack();
    } else {
      onClose?.();
    }
  };

  if (!isVisible) return null;

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={[styles.headerContainer, headerContainerStyle]}>
        <CustomHeader
          variant="primary"
          headerText=""
          onPress={handleHeaderBackPress}
          headerTextWeight="Med"
        />
      </View>
      <WebView
        ref={webviewRef}
        source={{ uri }}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'WEB_READY') {
            sendTokenToWeb();
          }
        }}
        injectedJavaScript={`
          (function() {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
          })();
          true;
        `}
        scalesPageToFit={false}
        mixedContentMode="always"
        style={[styles.webView, webViewStyle]}
        startInLoadingState={true}
        limitsNavigationsToAppBoundDomains={true}
      />
    </SafeAreaView>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    headerContainer: {},
    webView: {
      flex: 1
    }
  });

export default CustomWebView;
