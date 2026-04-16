import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import useThemeStore from '@src/zustand/auth/themeStore';
import { nPLusLogoGif, whiteNPlusLogoGif } from '@src/assets/gifs';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/pages/auth/Splash/styles';
import CustomText from '@src/views/atoms/CustomText';

interface SplashOverlayProps {
  onAnimationComplete: () => void;
}

const ANIMATION_DURATION = 2500;
const FADE_OUT_DURATION = 300;

const SplashOverlay = ({ onAnimationComplete }: SplashOverlayProps) => {
  const [theme] = useTheme();
  const darkMode = useThemeStore();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const dateOpacity = useRef(new Animated.Value(0)).current;

  const currentDateInSpanish = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const isDarkMode =
    darkMode.theme === 'dark' || (darkMode.theme === 'system' && colorScheme === 'dark');

  useEffect(() => {
    Animated.timing(dateOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_OUT_DURATION,
        useNativeDriver: true
      }).start(() => {
        onAnimationComplete();
      });
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          ...StyleSheet.absoluteFillObject,
          zIndex: 1000,
          opacity: fadeAnim,
          backgroundColor: theme.mainBackgroundDefault
        }
      ]}
      pointerEvents="none"
      renderToHardwareTextureAndroid={true} // Helps with blending artifacts on Android
    >
      <View style={styles.centerContent}>
        <View style={styles.animationWrapper}>
          <Animated.Image
            source={isDarkMode ? whiteNPlusLogoGif : nPLusLogoGif}
            style={styles.logoAnimation}
            resizeMode="contain"
          />
        </View>

        <Animated.Text style={{ opacity: dateOpacity }}>
          <CustomText
            size={fontSize['m']}
            weight="R"
            textStyles={[styles.text, { color: theme.labelsTextLabelPlace }]}
            fontFamily={fonts.notoSerifExtraCondensed}
          >
            {currentDateInSpanish}
          </CustomText>
        </Animated.Text>

        <Animated.Text style={[styles.textWrapper, { opacity: dateOpacity }]}>
          <CustomText
            size={fontSize['2xl']}
            weight="M"
            textStyles={[styles.subHeadingText, { color: theme.labelsTextLabelPlace }]}
            fontFamily={fonts.notoSerifExtraCondensed}
          >
            {t('screens.splash.text.decideInformed')}
          </CustomText>
        </Animated.Text>
      </View>

      <View style={styles.bottomSpacer} />
    </Animated.View>
  );
};

export default SplashOverlay;
