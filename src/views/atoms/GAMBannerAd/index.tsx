import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  View,
  ViewStyle,
  NativeSyntheticEvent,
  NativeModules
} from 'react-native';

import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';

import { actuatedNormalize } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';

const COMPONENT_NAME = 'RNGAMBannerView';
const AD_SIZE = 'MEDIUM_RECTANGLE';
const AD_WIDTH = actuatedNormalize(300);
const AD_HEIGHT = actuatedNormalize(250);

interface NativeAdEvent {
  error?: string;
}

interface GAMBannerAdProps {
  adUnitId?: string;
  style?: ViewStyle;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: string) => void;
}

interface NativeProps {
  adUnitId: string;
  adSize: string;
  style?: ViewStyle | ViewStyle[];
  onAdLoaded?: (event: NativeSyntheticEvent<NativeAdEvent>) => void;
  onAdFailedToLoad?: (event: NativeSyntheticEvent<NativeAdEvent>) => void;
}

const NativeGAMBannerView = requireNativeComponent<NativeProps>(COMPONENT_NAME);

export const GAMBannerAd: React.FC<GAMBannerAdProps> = ({
  adUnitId,
  style,
  onAdLoaded,
  onAdFailedToLoad
}) => {
  const bannerRef = useRef<React.ElementRef<typeof NativeGAMBannerView>>(null);
  const adUnit = adUnitId || Config.GAM_AD_UNIT_ID || '';
  const [theme] = useTheme();
  const { t } = useTranslation();
  const [adError, setAdError] = useState<boolean>(false);

  const loadAd = useCallback(() => {
    if (bannerRef.current) {
      const viewId = findNodeHandle(bannerRef.current);
      if (viewId) {
        if (!isIos) {
          UIManager.dispatchViewManagerCommand(viewId, 'loadAd', []);
        } else if (isIos) {
          NativeModules.RNGAMBannerViewManager?.loadAd(viewId);
        }
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [loadAd, adUnit]);

  const handleAdLoaded = useCallback(() => {
    setAdError(false);
    onAdLoaded?.();
  }, [onAdLoaded]);

  const handleAdFailedToLoad = useCallback(
    (event: NativeSyntheticEvent<NativeAdEvent>) => {
      setAdError(true);
      onAdFailedToLoad?.(event.nativeEvent?.error || 'Unknown error');
    },
    [onAdFailedToLoad]
  );

  if (!NativeGAMBannerView || !adUnit) {
    return null;
  }

  if (adError) {
    return (
      <View
        style={[
          {
            width: AD_WIDTH,
            height: AD_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center'
          },
          style
        ]}
      >
        <CustomText
          size={fontSize.s}
          weight="Med"
          fontFamily={fonts.franklinGothicURW}
          color={theme.dividerPrimary}
          textStyles={{ textAlign: 'center' }}
        >
          {t('screens.ads.text.networkError')}
        </CustomText>
      </View>
    );
  }

  return (
    <NativeGAMBannerView
      ref={bannerRef}
      adUnitId={adUnit}
      adSize={AD_SIZE}
      style={[{ width: AD_WIDTH, height: AD_HEIGHT }, style as ViewStyle]}
      onAdLoaded={handleAdLoaded}
      onAdFailedToLoad={handleAdFailedToLoad}
    />
  );
};

export default GAMBannerAd;
