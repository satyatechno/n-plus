import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { useTranslation } from 'react-i18next';
import { logContentViewEvent } from '@src/services/analytics/contentViewAnalyticsHelpers';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import useAuthStore from '@src/zustand/auth/authStore';
import { FirstSlide, SecondSlide, ThirdSlide } from '@src/assets/images';
import { themeStyles } from '@src/views/organisms/IntroScreen/styles';

const images = [FirstSlide, SecondSlide, ThirdSlide];

const useIntroScreenViewModel = () => {
  const animations = useRef(images.map(() => new Animated.Value(0))).current;
  const textPositions = useRef([
    new Animated.Value(-SCREEN_WIDTH),
    new Animated.Value(SCREEN_WIDTH),
    new Animated.Value(-SCREEN_WIDTH)
  ]).current;

  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { setIsTutorialShow } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useRef(images.map(() => new Animated.Value(0))).current;
  const progressRunIdRef = useRef(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    logContentViewEvent({
      screen_name: 'Intro Screen',
      Tipo_Contenido: 'Onboarding_Intro Screen'
    });
  }, []);

  const startAutoProgress = (index: number) => {
    progress.forEach((bar) => bar.stopAnimation());
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const runId = ++progressRunIdRef.current;

    progress.forEach((bar, i) => {
      if (i < index) bar.setValue(1);
      else bar.setValue(0);
    });

    progress[index].setValue(0);

    Animated.timing(progress[index], {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (!finished) return;
      if (runId !== progressRunIdRef.current) return;

      const next = index + 1;

      if (next < images.length) {
        progress[index].setValue(1);
        goToSlide(next);
      } else {
        onContinuePress();
      }
    });
  };

  useEffect(() => {
    {
      progress.forEach((bar) => bar.stopAnimation());
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, []);

  const onContinuePress = () => {
    setIsTutorialShow(false);
  };

  const animateSlide = (i: number, cb?: () => void) => {
    Animated.parallel([
      Animated.timing(animations[i], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),

      Animated.timing(textPositions[i], {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      })
    ]).start(() => cb && cb());
  };

  const goToSlide = (nextIndex: number) => {
    if (nextIndex === currentIndex) return;
    if (animatingRef.current) return;

    const prevIndex = currentIndex;
    const direction = nextIndex > prevIndex ? 1 : -1;

    progress.forEach((bar) => bar.stopAnimation());
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    progress.forEach((bar, i) => {
      if (i < nextIndex) bar.setValue(1);
      else if (i === nextIndex) bar.setValue(0);
      else bar.setValue(0);
    });

    textPositions[nextIndex].setValue(direction > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH);
    animations[nextIndex].setValue(0);

    animatingRef.current = true;
    Animated.parallel([
      Animated.timing(animations[prevIndex], {
        toValue: 0,
        duration: 550,
        useNativeDriver: true
      }),
      Animated.timing(animations[nextIndex], {
        toValue: 1,
        duration: 550,
        useNativeDriver: true
      }),
      Animated.timing(textPositions[prevIndex], {
        toValue: direction > 0 ? -SCREEN_WIDTH : SCREEN_WIDTH,
        duration: 350,
        useNativeDriver: true
      }),
      Animated.timing(textPositions[nextIndex], {
        toValue: 0,
        duration: 350,
        useNativeDriver: true
      })
    ]).start(() => {
      animatingRef.current = false;
      setCurrentIndex(nextIndex);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      timeoutRef.current = setTimeout(() => startAutoProgress(nextIndex), 80);
    });
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animatingRef.current) return;
    timeoutRef.current = setTimeout(() => startAutoProgress(currentIndex), 60);
  }, [currentIndex]);

  useEffect(() => {
    animateSlide(0);
  }, []);

  return {
    images,
    animations,
    textPositions,
    t,
    styles,
    onContinuePress,
    currentIndex,
    goToSlide,
    progress
  };
};

export default useIntroScreenViewModel;
