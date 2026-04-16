import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import type { UnsupportedNodeProps } from '@src/views/organisms/Lexical/types';
import { fontSize, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';

/**
 * Fallback renderer for unknown / not‑yet‑implemented node types.
 */

const UnsupportedNode: React.FC<UnsupportedNodeProps> = ({ node, style, customTheme }) => {
  const { t } = useTranslation();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        {t('screens.lexical.text.unsupportedNode', { type: node?.type ?? t('screens.stranger') })}
      </Text>
    </View>
  );
};

export default memo(UnsupportedNode);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: actuatedNormalizeVertical(spacing.l),
      padding: actuatedNormalizeVertical(spacing.l)
    },
    text: {
      fontSize: actuatedNormalizeVertical(fontSize.s),
      color: theme.liveBlogTextBulletsBodyDescription
    }
  });
