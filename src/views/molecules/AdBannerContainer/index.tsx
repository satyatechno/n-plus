import React, { memo, useMemo } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

import { useTranslation } from 'react-i18next';

import { GAMBannerAd } from '@src/views/atoms/GAMBannerAd';
import CustomText from '@src/views/atoms/CustomText';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { fontSize, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';

interface AdBannerContainerProps {
  containerStyle?: ViewStyle;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const AdBannerContainer: React.FC<AdBannerContainerProps> = ({
  containerStyle,
  sectionGapStyle
}) => {
  const [theme] = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          backgroundColor: theme.adsBackground,
          paddingTop: actuatedNormalizeVertical(spacing.s),
          paddingBottom: actuatedNormalizeVertical(spacing.s)
        },
        adText: {
          marginBottom: actuatedNormalizeVertical(spacing.xxs)
        }
      }),
    [theme]
  );

  return (
    <View style={[styles.container, containerStyle, sectionGapStyle]}>
      <CustomText
        size={fontSize.xxs}
        weight="Med"
        fontFamily={fonts.franklinGothicURW}
        color={theme.dividerPrimary}
        textStyles={styles.adText}
      >
        {t('screens.ads.text.publicidad')}
      </CustomText>
      <GAMBannerAd />
    </View>
  );
};

export default memo(AdBannerContainer);
