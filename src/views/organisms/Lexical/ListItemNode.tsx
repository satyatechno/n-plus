import React, { memo, useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import type { ListItemNodeProps } from '@src/views/organisms/Lexical/types';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';

import { scaleFont } from '@src/utils/fontScaler';
import { LexicalNode, NODE_TYPES } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
/**
 * ListItemNode
 *
 * Renders a single list item node (<li>) from Lexical JSON.
 * This component is used by the LexicalContentRenderer to display
 * the content of a list item, including any nested children.
 *
 * Props:
 *   - node: The Lexical list item node object, containing its children.
 *   - renderNode: Callback to render child nodes.
 *   - style: (optional) Additional styles from parent nodes.
 *
 * Usage:
 *   <ListItemNode node={node} renderNode={renderNode} style={parentStyle} />
 *
 * Children are rendered in a column layout, inheriting font styles.
 */

const ListItemNode: React.FC<ListItemNodeProps> = ({ node, renderNode, style, customTheme }) => {
  const textSize = useSettingsStore((state) => state.textSize);
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const itemStyles = useMemo(
    () => [styles.content, { fontSize: scaleFont(fontSize.s, textSize) }, style],
    [textSize, style, styles.content]
  );

  if (!node?.children || node.children.length === 0) return null;

  // Handle nested lists and regular content differently
  const hasNestedList = node.children.some((child: LexicalNode) => child.type === NODE_TYPES.LIST);

  if (hasNestedList) {
    return (
      <View style={styles.nestedContainer}>
        {node.children.map((child: LexicalNode, idx: number) =>
          renderNode(child, idx, style, customTheme)
        )}
      </View>
    );
  }

  return (
    <Text style={itemStyles} allowFontScaling={textSize === 'System'}>
      {node.children.map((child: LexicalNode, idx: number) =>
        renderNode(child, idx, style, customTheme)
      )}
    </Text>
  );
};

export default memo(ListItemNode);

/* ------------------------------------------------------------------ *
 *  Styles                                                             *
 * ------------------------------------------------------------------ */

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      fontSize: fontSize.s,
      fontFamily: `${fonts.notoSerif}-Regular`,
      color: theme.liveBlogTextBulletsBodyDescription
    },
    nestedContainer: {
      flex: 1
    }
  });
