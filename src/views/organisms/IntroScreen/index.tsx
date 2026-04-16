import React, { useState } from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import useIntroScreenViewModel from '@src/viewModels/auth/IntroScreen/useIntroScreenViewModel';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';

const IntroScreens: React.FC = () => {
  const { images, animations, styles, onContinuePress, goToSlide, currentIndex, progress } =
    useIntroScreenViewModel();

  const [segWidth, setSegWidth] = useState<number>(0);

  const handleTap = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;

    if (x < SCREEN_WIDTH / 2) {
      if (currentIndex > 0) goToSlide(currentIndex - 1);
    } else {
      if (currentIndex < images.length - 1) goToSlide(currentIndex + 1);
      else onContinuePress();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.progressContainer}>
        {images.map((_: ImageSourcePropType, idx: number) => (
          <View
            key={`seg-${idx}`}
            style={styles.progressSegment}
            onLayout={(e: LayoutChangeEvent) => {
              if (!segWidth) setSegWidth(e.nativeEvent.layout.width);
            }}
          >
            <Animated.View
              style={[
                styles.progressFill,
                segWidth
                  ? {
                      width: progress[idx].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, segWidth]
                      })
                    }
                  : undefined
              ]}
            />
          </View>
        ))}
      </View>

      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.imageContainerView}>
          {images.map((img: ImageSourcePropType, index: number) => (
            <Animated.Image
              key={index}
              source={img}
              style={StyleSheet.flatten([
                styles.image,
                {
                  opacity: animations[index],
                  zIndex: index
                }
              ])}
            />
          ))}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default IntroScreens;
