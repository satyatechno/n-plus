import React, { useState } from 'react';
import { View, StyleProp, ImageStyle, ImageRequireSource } from 'react-native';

import FastImage, {
  ImageStyle as FastImageStyle,
  ResizeMode,
  Source
} from 'react-native-fast-image';

import { BrokenUrlImage, FallbackImage } from '@src/assets/images';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

interface CustomImageProps {
  source?: Source | ImageRequireSource;
  style?: StyleProp<ImageStyle>;
  fallbackComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  resizeMode?: ResizeMode | undefined;
}

/**
 * A custom image component that uses react-native-fast-image and provides
 * error handling and fallbacks.
 *
 * @param {string} uri - The source URI of the image.
 * @param {StyleProp<ImageStyle>} style - The style of the image component.
 * @param {React.ReactNode} fallbackComponent - A component to render when no uri is provided.
 * @param {React.ReactNode} errorComponent - A component to render when the image fails to load.
 * @param {'cover' | 'contain' | 'stretch'} resizeMode - The resize mode of the image component.
 */

const CustomImage: React.FC<CustomImageProps> = ({
  source,
  style,
  fallbackComponent,
  errorComponent,
  resizeMode = 'cover'
}) => {
  const [loadError, setLoadError] = useState<boolean>(false);
  const { isImageDownloadEnabled } = useSettingsStore();

  if (
    !source ||
    (typeof source === 'object' && 'uri' in source && !source.uri) ||
    !isImageDownloadEnabled
  ) {
    return (
      <View style={style}>{fallbackComponent ?? <FallbackImage width="100%" height="100%" />}</View>
    );
  }

  if (loadError) {
    return (
      <View style={style}>
        {errorComponent ?? (
          <BrokenUrlImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        )}
      </View>
    );
  }

  return (
    <FastImage
      style={style as StyleProp<FastImageStyle>}
      source={source}
      resizeMode={FastImage.resizeMode[resizeMode]}
      onError={() => setLoadError(true)}
    />
  );
};

export default CustomImage;
