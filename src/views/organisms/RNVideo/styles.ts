import { StyleSheet } from 'react-native';

import { lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    playerContainer: {
      width: '100%',
      backgroundColor: 'transparent',
      aspectRatio: 16 / 9
    },
    // Container for reel/shorts mode - fills available space instead of using fixed aspect ratio
    reelPlayerContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent'
    },
    player: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent'
    },
    noInternetContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.trackDisabled,
      flex: 1
    },
    fullScreen: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent'
    },
    // Fullscreen Modal container
    fullScreenContainer: {
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center'
    },
    // Video player in fullscreen mode
    fullScreenPlayer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000'
    }
  });

export const overlayStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // Main overlay container
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
      padding: 10,
      zIndex: 999999
    },

    // Top controls row
    topRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    topRightIcons: {
      flexDirection: 'row',
      marginLeft: 'auto',
      gap: spacing.xs
    },
    crossButton: {
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      bottom: actuatedNormalizeVertical(3)
    },
    castButtonNative: {
      width: 28,
      height: 28,
      tintColor: theme.bodyTextDarkTheme
    },
    castWrapper: {
      bottom: actuatedNormalizeVertical(2)
    },
    closedCaptionButton: {
      bottom: actuatedNormalizeVertical(spacing.xxxxs)
    },

    // Bottom controls zone - prevents taps from hiding controls
    bottomControlsZone: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: actuatedNormalizeVertical(spacing['4xl']),
      paddingBottom: actuatedNormalizeVertical(spacing.xxs),
      paddingHorizontal: actuatedNormalize(spacing.xxs)
    },

    // Progress bar
    progressBarContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(spacing['5xl']),
      left: 0,
      right: 0,
      height: actuatedNormalizeVertical(5),
      backgroundColor: theme.bodyTextDarkTheme,
      marginHorizontal: actuatedNormalize(spacing['xxs'])
    },
    progressBar: {
      height: actuatedNormalizeVertical(5),
      backgroundColor: theme.filledButtonPrimary
    },
    progressThumb: {
      width: actuatedNormalize(14),
      height: actuatedNormalizeVertical(14),
      borderRadius: radius['m'],
      backgroundColor: theme.iconIconographyPrimary,
      bottom: actuatedNormalizeVertical(6),
      alignSelf: 'flex-end',
      left: actuatedNormalize(spacing.xs)
    },

    // Bottom controls row
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: radius.m,
      width: '100%',
      flexShrink: 1
    },
    bottomLeftIcons: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      top: actuatedNormalizeVertical(6)
    },
    bottomRightIcons: {
      flexDirection: 'row',
      gap: spacing.xs,
      alignSelf: 'flex-end',
      alignItems: 'center'
    },
    bottomRightIconsWithoutPiP: {
      flexDirection: 'row',
      gap: spacing.xs,
      alignSelf: 'flex-end',
      alignItems: 'center'
    },
    bottomRightIconsStyleLive: {
      flexDirection: 'row',
      marginLeft: 'auto',
      gap: spacing.xs,
      alignItems: 'center'
    },
    bottomIconsContainer: {
      top: actuatedNormalizeVertical(2)
    },
    bottomIconsContainerPiP: {
      top: actuatedNormalizeVertical(5)
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      height: actuatedNormalizeVertical(24),
      width: actuatedNormalize(24),
      alignSelf: 'center'
    },
    timeText: {
      color: theme.labelsTextLabelDarkTheme,
      top: isIos ? actuatedNormalize(2) : 0
    },
    copyright: {
      lineHeight: actuatedNormalizeVertical(8),
      color: theme.bodyTextDarkTheme,
      top: actuatedNormalizeVertical(spacing.xxxs),
      alignSelf: 'flex-end'
    },

    // Captions
    captionContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(100),
      width: '100%',
      alignItems: 'center',
      zIndex: 999
    },
    captionText: {
      color: theme.labelsTextLabelPlace,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing['xxs']),
      paddingVertical: actuatedNormalizeVertical(spacing['xxxs']),
      textAlign: 'center',
      lineHeight: lineHeight['m']
    },
    internalCaptionContainer: {
      position: 'absolute',
      bottom: actuatedNormalizeVertical(spacing['6xl']),
      left: actuatedNormalize(spacing.xs),
      right: actuatedNormalize(spacing.xs),
      alignItems: 'center',
      zIndex: 1000,
      justifyContent: 'center'
    },
    internalCaptionText: {
      color: theme.bodyTextDarkTheme,
      backgroundColor: theme.captionsBackground,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingVertical: actuatedNormalizeVertical(spacing.xxxs),
      textAlign: 'center',
      lineHeight: lineHeight.xxs
    },

    // PiP overlay
    pipOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'space-between',
      backgroundColor: 'transparent'
    },

    // Buffering state
    bufferingCross: {
      position: 'absolute',
      top: actuatedNormalizeVertical(31),
      left: actuatedNormalize(10),
      paddingHorizontal: actuatedNormalize(spacing.xxs),
      paddingVertical: actuatedNormalizeVertical(spacing.xxs),
      zIndex: 999999
    }
  });
