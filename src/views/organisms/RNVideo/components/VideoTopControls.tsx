/**
 * VideoTopControls - Top Navigation Control Bar
 *
 * A presentational component that renders the top control bar of the video player,
 * displaying the close button (in fullscreen), captions toggle, and Chromecast button.
 *
 * Layout structure:
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Top Controls Bar                                                │
 * │  ├── Left Section                                               │
 * │  │     └── Close/Exit button (fullscreen only)                  │
 * │  └── Right Section                                              │
 * │        ├── Closed Captions toggle (non-live only)               │
 * │        └── Chromecast button (react-native-google-cast)         │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * Behavior & responsibilities:
 * - Pure presentational component (no internal state)
 * - Close button only visible in fullscreen mode
 * - Captions button hidden in live mode (no VTT available)
 * - Captions opacity indicates enabled state (1.0 = on, 0.5 = off)
 * - Chromecast button uses native Google Cast SDK
 *
 * Platform adaptations:
 * - iOS: Larger top padding (spacing.xl) for notch/Dynamic Island
 * - Android: Smaller top padding (spacing.s)
 * - Fullscreen mode adds extra padding for safe area
 *
 * Side effects & external dependencies:
 * - Uses react-native-google-cast's CastButton for Chromecast
 * - Reads theme from useTheme hook for icon colors
 *
 * @example
 * <VideoTopControls
 *   fullScreen={isFullscreen}
 *   onPressingCross={handleExitFullscreen}
 *   onToggleCaptions={toggleCaptions}
 *   captionsEnabled={captionsEnabled}
 *   styles={overlayStyles}
 *   isLive={isLiveStream}
 * />
 */
import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';

import { CastButton } from 'react-native-google-cast';

import { spacing } from '@src/config/styleConsts';
import { ClosedCaption, CrossIcon } from '@src/assets/icons';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import {
  logLiveVideoEvent,
  logVideoEvent
} from '@src/services/analytics/videoPlayerContentAnalyticsHelper';
import { getCurrentSignalTime } from '@src/utils/dateFormatter';

/**
 * Props for the VideoTopControls component.
 *
 * @property fullScreen - Whether player is in fullscreen mode (shows close button)
 * @property onPressingCross - Handler for close/exit button press
 * @property onToggleCaptions - Handler for captions toggle button press
 * @property captionsEnabled - Current captions state for opacity indication
 * @property isLive - Live mode hides captions button (no VTT support)
 * @property styles - Pre-computed style objects from overlayStyles
 */
export interface VideoTopControlsProps {
  /** Whether the player is in fullscreen mode */
  fullScreen: boolean;
  /** Callback when close/exit button is pressed */
  onPressingCross: () => void;
  /** Callback to toggle closed captions */
  onToggleCaptions: () => void;
  /** Whether closed captions are enabled */
  captionsEnabled?: boolean;
  /** Whether this is a live stream */
  isLive?: boolean;
  /** Style definitions for control elements */
  styles: {
    topRow: ViewStyle;
    topRightIcons: ViewStyle;
    crossButton: ViewStyle;
    castButtonNative: ViewStyle;
    castWrapper: ViewStyle;
    closedCaptionButton: ViewStyle;
  };
  /** Analytics configuration for tracking cast button events */
  analyticsConfig?: {
    contentType?: string;
    screenName?: string;
    organisms?: string;
    videoTitle?: string;
    idPage?: string;
    screenPageWebUrl?: string;
    publication?: string;
    duration?: string;
    tags?: string;
    videoType?: string;
    production?: string;
  };
  /** Handler for cast button press */
  onCastButtonPress?: () => void;
}

/**
 * Top controls bar component implementation.
 *
 * Pure presentational component - receives all state and handlers via props.
 * Memoized with React.memo for performance optimization.
 *
 * @see VideoOverlay - Parent component that provides state and handlers
 * @see VideoBottomControls - Complementary bottom control bar
 */
const VideoTopControls: React.FC<VideoTopControlsProps> = ({
  onPressingCross,
  onToggleCaptions,
  fullScreen,
  captionsEnabled = false,
  styles,
  isLive = false,
  analyticsConfig
}) => {
  const [theme] = useTheme();

  const paddingTop = actuatedNormalizeVertical(fullScreen ? spacing[isIos ? 'xl' : 's'] : 0);

  const handleCastButtonPress = React.useCallback(() => {
    logSelectContentEvent({
      screen_name: analyticsConfig?.screenName,
      organisms: analyticsConfig?.organisms,
      content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
      content_action: ANALYTICS_ATOMS.CAST,
      content_title: analyticsConfig?.videoTitle,
      Tipo_Contenido: analyticsConfig?.contentType
    });

    // Only send logVideoEvent for non-live videos
    if (!isLive) {
      logVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: ANALYTICS_ATOMS.CAST,
        event_label: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType,
        idPage: analyticsConfig?.idPage,
        screen_page_web_url: analyticsConfig?.screenPageWebUrl,
        Fecha_Publicacion_Video: analyticsConfig?.publication,
        Video_Duration: analyticsConfig?.duration,
        video_detail: `${analyticsConfig?.idPage}_${analyticsConfig?.videoType}`,
        EtiquetasVOD: analyticsConfig?.tags,
        production: analyticsConfig?.production
      });
    } else {
      logLiveVideoEvent({
        screen_name: analyticsConfig?.screenName,
        organisms: analyticsConfig?.organisms,
        content_type: ANALYTICS_MOLECULES.MEDIA_PLAYER.MEDIA_PLAYER,
        event_action: ANALYTICS_ATOMS.CAST,
        event_label: analyticsConfig?.videoTitle,
        Tipo_Contenido: analyticsConfig?.contentType,
        idPage: ANALYTICS_ID_PAGE.LIVE_TV,
        screen_page_web_url: SCREEN_PAGE_WEB_URL.LIVE_TV,
        production: analyticsConfig?.production,
        signal_time: getCurrentSignalTime()
      });
    }
  }, [analyticsConfig, isLive]);

  return (
    <View style={[styles.topRow, { paddingTop }]}>
      {fullScreen && (
        <Pressable onPress={onPressingCross} style={styles.crossButton}>
          <CrossIcon stroke={theme.iconIconographyActiveState} height={16} width={16} />
        </Pressable>
      )}

      <View style={styles.topRightIcons}>
        {!isLive && (
          <Pressable onPress={onToggleCaptions} style={styles.closedCaptionButton}>
            <ClosedCaption width={28} height={28} opacity={captionsEnabled ? 1 : 0.5} />
          </Pressable>
        )}

        <View style={styles.castWrapper} onTouchStart={handleCastButtonPress}>
          <CastButton style={styles.castButtonNative as ViewStyle} />
        </View>
      </View>
    </View>
  );
};

export default React.memo(VideoTopControls);
