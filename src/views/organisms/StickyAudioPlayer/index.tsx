import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { AudioMute, VolumeIcon } from '@src/assets/icons';
import CustomText from '@src/views/atoms/CustomText';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, fontSize, letterSpacing, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import useVideoPlayerStore from '@src/zustand/main/videoPlayerStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_ID_PAGE,
  ANALYTICS_MOLECULES
} from '@src/utils/analyticsConstants';

const StickyAudioPlayer = ({
  miniPlayerWorking,
  audioDuration,
  onPress,
  customTheme,
  screenName,
  tipoContenido,
  screen_page_web_url
}: {
  miniPlayerWorking: boolean;
  audioDuration: string;
  onPress: () => void;
  customTheme?: 'light' | 'dark';
  screenName?: string;
  tipoContenido?: string;
  screen_page_web_url?: string;
}) => {
  const [theme] = useTheme(customTheme);
  const { t } = useTranslation();
  const styles = themeStyles(theme);
  const { isAudioPlaying } = useVideoPlayerStore();

  const handlePressWithAnalytics = React.useCallback(() => {
    // Log analytics event for tap interaction
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.AUDIO_PLAYER,
      screen_page_web_url: screen_page_web_url,
      screen_name: screenName,
      Tipo_Contenido: tipoContenido,
      content_type: ANALYTICS_MOLECULES.STORY_PAGE.INSIDE_NOTE.PLAY_ARTICLE,
      content_action: isAudioPlaying
        ? ANALYTICS_ATOMS.AUDIO_PLAY_MUTE
        : ANALYTICS_ATOMS.AUDIO_PLAY_PLAYING
    });

    // Call original onPress handler
    onPress();
  }, [screenName, tipoContenido, isAudioPlaying, onPress]);

  return (
    <Pressable style={styles.card} onPress={handlePressWithAnalytics}>
      <View style={styles.iconWrapper}>
        {miniPlayerWorking && isAudioPlaying ? (
          <VolumeIcon
            height={actuatedNormalizeVertical(24)}
            width={actuatedNormalize(24)}
            fill={theme.iconIconographyGenericState}
          />
        ) : (
          <AudioMute
            height={actuatedNormalizeVertical(24)}
            width={actuatedNormalize(24)}
            fill={theme.iconIconographyGenericState}
          />
        )}
      </View>
      <CustomText
        color={theme.labelsTextLabelPlay}
        textStyles={styles.text}
        fontFamily={fonts.franklinGothicURW}
        weight="Med"
        size={fontSize.xxs}
      >
        {miniPlayerWorking && isAudioPlaying
          ? t('screens.jwAudioPlayer.text.playing')
          : `${t('screens.jwAudioPlayer.text.listenToThisArticle')}${audioDuration} min`}
      </CustomText>
    </Pressable>
  );
};

export default StickyAudioPlayer;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.xxs,
      gap: spacing.xs
    },
    text: {
      letterSpacing: letterSpacing.none
    },
    iconWrapper: {
      width: actuatedNormalize(32),
      height: actuatedNormalize(32),
      borderRadius: 50,
      borderWidth: borderWidth.m,
      borderColor: theme.iconIconographyGenericState,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
