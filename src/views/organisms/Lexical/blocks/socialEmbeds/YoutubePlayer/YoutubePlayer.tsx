import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle
} from 'react';
import { Linking, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { EventEmitter } from 'events';
import {
  WebView,
  WebViewProps,
  WebViewMessageEvent,
  WebViewNavigation
} from 'react-native-webview';

import {
  PLAYER_ERROR,
  PLAYER_STATES,
  DEFAULT_BASE_URL,
  CUSTOM_USER_AGENT
} from '@src/views/organisms/Lexical/blocks/socialEmbeds/YoutubePlayer/constants';
import {
  playMode,
  soundMode,
  MAIN_SCRIPT,
  PLAYER_FUNCTIONS
} from '@src/views/organisms/Lexical/blocks/socialEmbeds/YoutubePlayer/PlayerScripts';
import { deepComparePlayList } from '@src/views/organisms/Lexical/blocks/socialEmbeds/YoutubePlayer/utils';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import SkeletonLoader from '@src/views/organisms/Lexical/blocks/socialEmbeds/EmbedsSkeletonLoader';

interface InitialPlayerParams {
  end?: number;
  rel?: boolean;
  color?: string;
  start?: number;
  playerLang?: string;
  loop?: boolean;
  cc_lang_pref?: string;
  iv_load_policy?: number;
  modestbranding?: boolean;
  controls?: boolean;
  showClosedCaptions?: boolean;
  preventFullScreen?: boolean;
}

interface YoutubePlayerProps {
  height?: number;
  width?: number;
  videoId?: string;
  playList?: string | string[];
  play?: boolean;
  mute?: boolean;
  volume?: number;
  webViewStyle?: ViewStyle;
  webViewProps?: Partial<WebViewProps>;
  useLocalHTML?: boolean;
  baseUrlOverride?: string;
  playbackRate?: number;
  contentScale?: number;
  onError?: (error: string) => void;
  onReady?: () => void;
  playListStartIndex?: number;
  initialPlayerParams?: InitialPlayerParams;
  allowWebViewZoom?: boolean;
  forceAndroidAutoplay?: boolean;
  onChangeState?: (state: string) => void;
  onFullScreenChange?: (status: boolean) => void;
  onPlaybackQualityChange?: (quality: string) => void;
  onPlaybackRateChange?: (playbackRate: number) => void;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
}

interface YoutubePlayerRef {
  getVideoUrl: () => Promise<string>;
  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  isMuted: () => Promise<boolean>;
  getVolume: () => Promise<number>;
  getPlaybackRate: () => Promise<number>;
  getAvailablePlaybackRates: () => Promise<number[]>;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface WebViewMessage {
  eventType: string;
  data?: string | number | boolean;
}

const YoutubeIframe = forwardRef<YoutubePlayerRef, YoutubePlayerProps>((props, ref) => {
  YoutubeIframe.displayName = 'YoutubeIframe';
  const {
    height,
    videoId,
    playList,
    play = false,
    mute = false,
    volume = 100,
    webViewStyle,
    webViewProps,
    useLocalHTML,
    baseUrlOverride,
    playbackRate = 1,
    contentScale = 1.0,
    onError = (() => {}) as (error: string) => void,
    onReady = () => {},
    playListStartIndex = 0,
    initialPlayerParams,
    allowWebViewZoom = false,
    forceAndroidAutoplay = false,
    onChangeState = (() => {}) as (event: string) => void,
    onFullScreenChange = (() => {}) as (status: boolean) => void,
    onPlaybackQualityChange = (() => {}) as (quality: string) => void,
    onPlaybackRateChange = (() => {}) as (playbackRate: number) => void,
    contentContainerStyle
  } = props;

  const [playerReady, setPlayerReady] = useState(false);
  const lastVideoIdRef = useRef<string | undefined>(videoId);
  const lastPlayListRef = useRef<string | string[] | undefined>(playList);
  const initialPlayerParamsRef = useRef<InitialPlayerParams>(initialPlayerParams || {});

  const webViewRef = useRef<WebView>(null);
  const eventEmitter = useRef(new EventEmitter());
  const { setActiveJWIndex, setIsMediaPipMode, setIsPipMode, setShowMediaPlayer } =
    useVideoPlayerStore();

  useImperativeHandle(
    ref,
    () => ({
      getVideoUrl: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.getVideoUrlScript);
        return new Promise<string>((resolve) => {
          eventEmitter.current.once('getVideoUrl', resolve);
        });
      },
      getDuration: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.durationScript);
        return new Promise<number>((resolve) => {
          eventEmitter.current.once('getDuration', resolve);
        });
      },
      getCurrentTime: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.currentTimeScript);
        return new Promise<number>((resolve) => {
          eventEmitter.current.once('getCurrentTime', resolve);
        });
      },
      isMuted: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.isMutedScript);
        return new Promise<boolean>((resolve) => {
          eventEmitter.current.once('isMuted', resolve);
        });
      },
      getVolume: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.getVolumeScript);
        return new Promise<number>((resolve) => {
          eventEmitter.current.once('getVolume', resolve);
        });
      },
      getPlaybackRate: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.getPlaybackRateScript);
        return new Promise<number>((resolve) => {
          eventEmitter.current.once('getPlaybackRate', resolve);
        });
      },
      getAvailablePlaybackRates: () => {
        webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.getAvailablePlaybackRatesScript);
        return new Promise<number[]>((resolve) => {
          eventEmitter.current.once('getAvailablePlaybackRates', resolve);
        });
      },
      seekTo: (seconds: number, allowSeekAhead: boolean) => {
        webViewRef.current?.injectJavaScript(
          PLAYER_FUNCTIONS.seekToScript(seconds, allowSeekAhead)
        );
      }
    }),
    []
  );

  useEffect(() => {
    if (!playerReady) {
      // no instance of player is ready
      return;
    }

    [
      playMode[String(play) as keyof typeof playMode],
      soundMode[String(mute) as keyof typeof soundMode],
      PLAYER_FUNCTIONS.setVolume(volume),
      PLAYER_FUNCTIONS.setPlaybackRate(playbackRate)
    ].forEach((script) => webViewRef.current?.injectJavaScript(script));
  }, [play, mute, volume, playbackRate, playerReady]);

  useEffect(() => {
    if (!playerReady || lastVideoIdRef.current === videoId) {
      // no instance of player is ready
      // or videoId has not changed
      return;
    }

    lastVideoIdRef.current = videoId;

    webViewRef.current?.injectJavaScript(PLAYER_FUNCTIONS.loadVideoById(videoId || '', play));
  }, [videoId, play, playerReady]);

  useEffect(() => {
    if (!playerReady) {
      // no instance of player is ready
      return;
    }

    if (!playList || deepComparePlayList(lastPlayListRef.current, playList)) {
      return;
    }

    lastPlayListRef.current = playList;

    webViewRef.current?.injectJavaScript(
      PLAYER_FUNCTIONS.loadPlaylist(playList, playListStartIndex, play)
    );
  }, [playList, play, playListStartIndex, playerReady]);

  const onWebMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        switch (message.eventType) {
          case 'fullScreenChange':
            onFullScreenChange(message.data as boolean);
            break;
          case 'playerStateChange': {
            const state = PLAYER_STATES[message.data as keyof typeof PLAYER_STATES] || '';
            onChangeState(state);
            if (state === 'playing') {
              setActiveJWIndex(false);
              setIsMediaPipMode(false);
              setIsPipMode(false);
              setShowMediaPlayer(false);
            }
            break;
          }
          case 'playerReady':
            onReady();
            setPlayerReady(true);
            break;
          case 'playerQualityChange':
            onPlaybackQualityChange(message.data as string);
            break;
          case 'playerError':
            onError(PLAYER_ERROR[message.data as keyof typeof PLAYER_ERROR] || '');
            break;
          case 'playbackRateChange':
            onPlaybackRateChange(message.data as number);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch {
        // Error parsing message from WebView; ignored intentionally
      }
    },
    [
      onReady,
      onError,
      onChangeState,
      onFullScreenChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      setActiveJWIndex
    ]
  );

  const onShouldStartLoadWithRequest = useCallback(
    (request: WebViewNavigation) => {
      try {
        const url = request.mainDocumentURL || request.url;
        if (Platform.OS === 'ios') {
          const iosFirstLoad = url === 'about:blank';
          if (iosFirstLoad) {
            return true;
          }
          const isYouTubeLink = url.startsWith('https://www.youtube.com/');
          if (isYouTubeLink) {
            Linking.openURL(url).catch(() => {});
            return false;
          }
        }
        return url.startsWith(baseUrlOverride || DEFAULT_BASE_URL);
      } catch {
        return true;
      }
    },
    [baseUrlOverride]
  );

  const source = useMemo(() => {
    const ytScript = MAIN_SCRIPT(
      lastVideoIdRef.current,
      lastPlayListRef.current,
      initialPlayerParamsRef.current,
      allowWebViewZoom,
      contentScale
    );

    if (useLocalHTML) {
      const res: { html: string; baseUrl?: string } = { html: ytScript.htmlString };
      if (baseUrlOverride) {
        res.baseUrl = baseUrlOverride;
      }
      return res;
    }

    const base = baseUrlOverride || DEFAULT_BASE_URL;
    const data = ytScript.urlEncodedJSON;

    return { uri: base + '?data=' + data };
  }, [useLocalHTML, contentScale, baseUrlOverride, allowWebViewZoom]);

  return (
    <View style={StyleSheet.flatten([styles.container, { height }, contentContainerStyle])}>
      {!playerReady && <SkeletonLoader height={height} width={'100%'} />}

      <WebView
        bounces={false}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        style={StyleSheet.flatten([styles.webView, webViewStyle, { opacity: playerReady ? 1 : 0 }])}
        mediaPlaybackRequiresUserAction={false}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        allowsFullscreenVideo={!initialPlayerParamsRef.current.preventFullScreen}
        userAgent={
          forceAndroidAutoplay ? Platform.select({ android: CUSTOM_USER_AGENT, ios: '' }) : ''
        }
        {...webViewProps}
        source={source}
        ref={webViewRef}
        onMessage={onWebMessage}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  webView: { backgroundColor: 'transparent' },
  container: {
    width: '100%',
    marginTop: actuatedNormalizeVertical(spacing.m),
    borderRadius: radius.xxs,
    overflow: 'hidden'
  }
});

export default YoutubeIframe;
