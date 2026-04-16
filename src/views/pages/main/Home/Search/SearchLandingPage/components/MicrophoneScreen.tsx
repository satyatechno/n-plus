import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  ScrollView
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { MicrophoneIcon } from '@src/assets/icons';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomText from '@src/views/atoms/CustomText';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import CustomLottieView from '@src/views/atoms/CustomLottieView';
import { Lottie } from '@src/assets/lottie';

export type SearchVoiceModalStyles = {
  voiceModalContainer: ViewStyle;
  microphoneHeader: ViewStyle;
  voiceContentContainer: ViewStyle;
  voiceSubtitle: TextStyle;
  voiceTitle: TextStyle;
  spokenText: TextStyle;
  voiceMicContainer: ViewStyle;
  pulseWrapper: ViewStyle;
  pulseRing: ViewStyle;
  voiceMicButton: ViewStyle;
  lottieStyle: ViewStyle;
  spokenTextStyle: ViewStyle;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onStartRecognizing: () => void;
  spokenText?: string;
  volume: number | string;
  theme: AppTheme;
  styles: SearchVoiceModalStyles;
  voiceError?: string;
};

const MicrophoneScreen = ({
  visible,
  onClose,
  onStartRecognizing,
  spokenText,
  volume,
  theme,
  styles,
  voiceError
}: Props) => {
  const { t } = useTranslation();
  const pulse = useRef(new Animated.Value(0)).current;
  const textScrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const n = typeof volume === 'string' ? parseFloat(volume) : Number(volume);
    const v = Math.max(0, Math.min(1, isNaN(n) ? 0 : n / 10));
    Animated.timing(pulse, {
      toValue: v,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [volume]);

  useEffect(() => {
    requestAnimationFrame(() => {
      textScrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [spokenText, voiceError, visible]);

  const scale1 = pulse.interpolate({
    inputRange: [0, isIos ? 2.3 : 1],
    outputRange: [1, isIos ? 1.8 : 1.3]
  });
  const scale2 = pulse.interpolate({
    inputRange: [0, isIos ? 2.4 : 1],
    outputRange: [1, isIos ? 2.8 : 1.6]
  });
  const scale3 = pulse.interpolate({
    inputRange: [0, isIos ? 2.5 : 1],
    outputRange: [1, isIos ? 3.9 : 1.9]
  });
  const opacity1 = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 2] });
  const opacity2 = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 1] });
  const opacity3 = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.2] });

  return (
    <Modal visible={visible} animationType="fade" backdropColor={theme.mainBackgroundDefault}>
      <View style={styles.voiceModalContainer}>
        <CustomHeader onPress={onClose} headerStyle={styles.microphoneHeader} />

        <View style={styles.voiceContentContainer}>
          <CustomText
            size={fontSize.xs}
            fontFamily={fonts.franklinGothicURW}
            weight="Med"
            textStyles={styles.voiceSubtitle}
          >
            {t('screens.search.text.voiceWelcome')}
          </CustomText>
          <CustomText
            size={fontSize['2xl']}
            fontFamily={fonts.franklinGothicURW}
            weight="Dem"
            textStyles={styles.voiceTitle}
          >
            {t('screens.search.text.voicePrompt')}
          </CustomText>

          <CustomLottieView source={Lottie.microphone} contentContainerStyle={styles.lottieStyle} />

          {spokenText ? (
            <View style={styles.spokenTextStyle}>
              <ScrollView ref={textScrollRef} showsVerticalScrollIndicator={false}>
                <CustomText
                  size={fontSize['2xl']}
                  textStyles={styles.spokenText}
                  fontFamily={fonts.notoSerifExtraCondensed}
                >
                  {spokenText}
                </CustomText>
              </ScrollView>
            </View>
          ) : voiceError ? (
            <View style={styles.spokenTextStyle}>
              <ScrollView ref={textScrollRef} showsVerticalScrollIndicator={false}>
                <CustomText
                  size={fontSize['2xl']}
                  textStyles={styles.spokenText}
                  fontFamily={fonts.notoSerifExtraCondensed}
                >
                  {voiceError}
                </CustomText>
              </ScrollView>
            </View>
          ) : null}
        </View>

        <View style={styles.voiceMicContainer}>
          <View style={styles.pulseWrapper}>
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: scale3 }], opacity: opacity3 }]}
            />
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: scale2 }], opacity: opacity2 }]}
            />
            <Animated.View
              style={[styles.pulseRing, { transform: [{ scale: scale1 }], opacity: opacity1 }]}
            />
          </View>
          <Pressable style={styles.voiceMicButton} onPress={onStartRecognizing}>
            <MicrophoneIcon
              fill={theme.primaryCTATextDefault}
              width={actuatedNormalize(38)}
              height={actuatedNormalizeVertical(48)}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MicrophoneScreen;
