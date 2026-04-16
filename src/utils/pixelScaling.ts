import { Dimensions, PixelRatio } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;
const scaleVertical = SCREEN_HEIGHT / 812;

const tabletScale = SCREEN_WIDTH / 660;
const tabletScaleVertical = SCREEN_HEIGHT / 1024;

export function actuatedNormalize(size: number) {
  const newSize = size * (isTab() ? tabletScale : scale);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function actuatedNormalizeVertical(size: number) {
  const newSize = size * (isTab() ? tabletScaleVertical : scaleVertical);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function isTab() {
  if (SCREEN_WIDTH > 550) {
    return true;
  } else {
    return false;
  }
}

export function isScreenHeight770() {
  if (SCREEN_HEIGHT > 740 && SCREEN_HEIGHT < 760) {
    return true;
  } else {
    return false;
  }
}
