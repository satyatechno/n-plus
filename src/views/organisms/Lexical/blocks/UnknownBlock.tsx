import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, radius, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';

interface UnknownBlockProps {
  blockType?: string;
  fields?: Record<string, unknown>;
  customTheme?: 'light' | 'dark';
}

/**
 * Fallback block for unsupported or unknown block types.
 */

const UnknownBlock = ({ blockType, fields, customTheme }: UnknownBlockProps) => {
  const { t } = useTranslation();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <CustomText
        color={theme?.errorTextColor}
        size={fontSize['m']}
        weight="Boo"
        fontFamily={fonts.franklinGothicURW}
      >
        {t('screens.lexical.text.unknownBlock.notSupported')}
      </CustomText>

      <CustomText color={theme?.errorTextColor} size={fontSize['s']}>
        {t('screens.lexical.text.unknownBlock.unknownType')}
        <CustomText weight="Boo" fontFamily={fonts.franklinGothicURW}>
          {blockType}
        </CustomText>
      </CustomText>

      {fields && (
        <CustomText textStyles={styles.meta}>
          {t('screens.lexical.text.unknownBlock.properties')}: {Object.keys(fields).join(', ')}
        </CustomText>
      )}
    </View>
  );
};

export default memo(UnknownBlock);

const themeStyles = (theme?: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      padding: actuatedNormalize(spacing.l),
      backgroundColor: theme?.mainBackgroundDefault,
      borderRadius: radius.m
    },
    subtitle: {
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    meta: {
      fontSize: fontSize.xs,
      color: theme?.bodyTextOther,
      marginTop: actuatedNormalizeVertical(spacing.s)
    }
  });
