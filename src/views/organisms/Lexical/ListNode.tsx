import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { ListNodeProps } from '@src/views/organisms/Lexical/types';
import { LIST_TYPES } from '@src/views/organisms/Lexical/constants';
import { fontSize, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { scaleFont } from '@src/utils/fontScaler';
import { LexicalNode, NODE_TYPES } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

/**
 * Renders an ordered or bulleted list
 */

const ListNode: React.FC<ListNodeProps> = ({ node, renderNode, style, customTheme }) => {
  const textSize = useSettingsStore((state) => state.textSize);
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  if (!node?.children || node.children.length === 0) return null;

  const listType = node.listType ?? LIST_TYPES.NUMBER;

  const bulletStyles = useMemo(
    () => [styles.bullet, { fontSize: scaleFont(fontSize.s, textSize) }],
    [textSize, styles.bullet]
  );

  const contentStyles = useMemo(
    () => [styles.content, { fontSize: scaleFont(fontSize.s, textSize) }, style],
    [textSize, style, styles.content]
  );

  // Filter out list items with empty children
  const validListItems = node.children.filter((child: LexicalNode) => {
    if (!child.children || child.children.length === 0) return false;
    // Check if any child has actual content
    return child.children.some((nestedChild: LexicalNode) => {
      if (nestedChild.type === NODE_TYPES.TEXT) {
        return nestedChild.text && nestedChild.text.trim().length > 0;
      }
      return nestedChild.children && nestedChild.children.length > 0;
    });
  });

  // If no valid list items, skip rendering
  if (validListItems.length === 0) return null;

  return (
    <View style={StyleSheet.flatten([styles.listContainer, style])}>
      {validListItems.map((child: LexicalNode, index: number) => {
        const isNumberList = listType === LIST_TYPES.NUMBER;

        return (
          <View key={index} style={styles.item}>
            <Text style={bulletStyles} allowFontScaling={textSize === 'System'}>
              {isNumberList ? `${index + 1}. ` : '• '}
            </Text>
            <Text style={contentStyles} allowFontScaling={textSize === 'System'}>
              {child.children?.map((nestedChild: LexicalNode, idx: number) =>
                renderNode(nestedChild, idx, style, customTheme)
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default memo(ListNode);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    listContainer: {
      flex: 1
    },
    item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginLeft: actuatedNormalizeVertical(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.ss)
    },
    bullet: {
      fontSize: fontSize.s,
      fontFamily: `${fonts.notoSerif}-Regular`,
      color: theme.liveBlogTextBulletsBodyDescription,
      marginRight: actuatedNormalizeVertical(spacing.xxs)
    },
    content: {
      fontSize: fontSize.s,
      fontFamily: `${fonts.notoSerif}-Regular`,
      color: theme.liveBlogTextBulletsBodyDescription,
      flex: 1
    }
  });
