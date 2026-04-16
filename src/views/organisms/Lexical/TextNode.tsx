import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

import { TEXT_FORMATS, TextNodeProps } from '@src/views/organisms/Lexical/types';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize, lineHeight } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';

import { scaleFont } from '@src/utils/fontScaler';
import { TextSize } from '@src/models/main/MyAccount/Settings';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { isIos } from '@src/utils/platformCheck';

/**
 * TextNode
 *
 * Renders a single text node from Lexical JSON, applying formatting such as bold, italic,
 * underline, strikethrough, subscript, and superscript. This component is used by the
 * LexicalContentRenderer to display formatted text content.
 *
 * Formatting is determined by a bitmask (`format`), and styles are composed accordingly.
 * The component also merges any parent styles passed down for consistent appearance.
 *
 * Props:
 *   - node: The Lexical text node object, containing the text and format bitmask.
 *   - style: (optional) Additional styles from parent nodes.
 *
 * Usage:
 *   <TextNode node={node} style={parentStyle} />
 */

function getStyleFromFormat(format: number | undefined, textSize: TextSize): TextStyle {
  if (!format || format === TEXT_FORMATS.NONE) return {};

  const style: TextStyle = {};

  if (format & TEXT_FORMATS.BOLD) {
    style.fontFamily = `${fonts.notoSerif}-Bold`;
    style.fontWeight = 'bold';
  }

  if (format & TEXT_FORMATS.ITALIC) {
    style.fontFamily = `${fonts.franklinGothicURW}-Boo`;
    style.fontStyle = 'italic';
  }

  const decorationLines: string[] = [];
  if (format & TEXT_FORMATS.UNDERLINE) decorationLines.push('underline');
  if (format & TEXT_FORMATS.STRIKETHROUGH) decorationLines.push('line-through');
  if (decorationLines.length > 0) {
    style.textDecorationLine = decorationLines.join(' ') as TextStyle['textDecorationLine'];
  }

  if (format & TEXT_FORMATS.SUPERSCRIPT) {
    style.fontSize = scaleFont(fontSize.xxxs, textSize);
    style.lineHeight = lineHeight.l;
    style.top = -5;
    style.includeFontPadding = false;
  } else if (format & TEXT_FORMATS.SUBSCRIPT) {
    style.fontSize = scaleFont(fontSize.xxxs, textSize);
    style.top = 5;
    style.includeFontPadding = false;
  }

  return style;
}

/* ------------------------------------------------------------------ *
 *  Component                                                          *
 * ------------------------------------------------------------------ */

const TextNode: React.FC<TextNodeProps> = ({ node, style, customTheme }) => {
  const [theme] = useTheme(customTheme);
  const textSize = useSettingsStore((state) => state.textSize);

  const dynamicStyle = useMemo(
    () => getStyleFromFormat(node.format, textSize),
    [node.format, textSize]
  );

  const combinedStyle = useMemo(
    () => [
      {
        ...styles.base,
        fontSize: scaleFont(fontSize.s, textSize),
        color: theme.bodyTextOther,
        includeFontPadding: false
      },
      dynamicStyle,
      style
    ],
    [dynamicStyle, style, textSize, theme.bodyTextOther]
  );

  if (!node?.text) return null;

  return (
    <Text
      style={combinedStyle}
      allowFontScaling={textSize === 'System'}
      textBreakStrategy={!isIos ? 'simple' : undefined}
    >
      {node.text}
    </Text>
  );
};

export default memo(TextNode);

/* ------------------------------------------------------------------ *
 *  Styles                                                             *
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1
  },
  base: {
    fontSize: fontSize.s,
    fontFamily: `${fonts.notoSerif}-Regular`,
    flexShrink: 1
  }
});
