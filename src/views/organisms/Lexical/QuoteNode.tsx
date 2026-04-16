import React, { memo, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import type { QuoteNodeProps } from '@src/views/organisms/Lexical/types';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { Quotes } from '@src/assets/icons';

import { scaleFont } from '@src/utils/fontScaler';
import { LexicalNode, NODE_TYPES } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

/**
 * Renders a blockquote element
 */

const QuoteNode = ({ node, renderNode, style, customTheme }: QuoteNodeProps) => {
  const [theme] = useTheme(customTheme);
  const textSize = useSettingsStore((state) => state.textSize);

  const themeStyles = getThemeStyles(theme);

  const quoteStyles = useMemo(
    () => [{ ...themeStyles.content, fontSize: scaleFont(fontSize.l, textSize) }, style],
    [themeStyles.content, textSize, style]
  );

  const hasParagraphChild = useMemo(
    () =>
      node?.children?.some((child: LexicalNode) => child.type === NODE_TYPES.PARAGRAPH) ?? false,
    [node?.children]
  );

  const quoteContainerStyle = useMemo(
    () => [themeStyles.quoteContainer, hasParagraphChild && { marginTop: 0 }],
    [themeStyles.quoteContainer, hasParagraphChild]
  );

  if (!node?.children || node.children.length === 0) return null;

  return (
    <View style={StyleSheet.flatten([style, themeStyles.container])}>
      <Quotes color={theme.blockQuotesTextQuote} />

      {hasParagraphChild ? (
        <View style={quoteContainerStyle}>
          {node.children?.map((child: LexicalNode, idx: number) =>
            renderNode(child, idx, quoteStyles, customTheme)
          )}
        </View>
      ) : (
        <Text style={quoteContainerStyle} allowFontScaling={textSize === 'System'}>
          {node.children?.map((child: LexicalNode, idx: number) =>
            renderNode(child, idx, quoteStyles, customTheme)
          )}
        </Text>
      )}
    </View>
  );
};

export default memo(QuoteNode);

/* ------------------------------------------------------------------ *
 *  Styles                                                             *
 * ------------------------------------------------------------------ */

const getThemeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    content: {
      fontFamily: `${fonts.notoSerifExtraCondensed}-Regular`,
      color: theme.blockQuotesTextText,
      lineHeight: lineHeight['4xl'],
      letterSpacing: letterSpacing.none
    },
    quoteContainer: {
      marginLeft: spacing.m,
      marginTop: actuatedNormalizeVertical(spacing.m)
    }
  });
