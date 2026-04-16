import React, { memo, useMemo } from 'react';
import { Text } from 'react-native';

import { HeadingNodeProps } from '@src/views/organisms/Lexical/types';
import { htmlHeading } from '@src/config/styleConsts';

import { scaleFont } from '@src/utils/fontScaler';
import { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { useTheme } from '@src/hooks/useTheme';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

/**
 * HeadingNode
 *
 * Renders a heading node (<h1>, <h2>, etc.) from Lexical JSON in React Native.
 * This component displays the heading's children using the provided renderNode callback,
 * applying heading styles defined in htmlHeading and any parent styles passed down.
 *
 * Props:
 *   - node: The Lexical heading node object, containing its children.
 *   - renderNode: Callback to render child nodes (for nested formatting).
 *   - style: (optional) Additional styles from parent nodes.
 *
 * Usage:
 *   <HeadingNode node={node} renderNode={renderNode} style={parentStyle} />
 *
 * Children are rendered as block elements, inheriting parent and heading styles.
 */

const HeadingNode = ({
  node,
  renderNode,
  style,
  customTheme,
  excludeHeadingMarginBottom
}: HeadingNodeProps) => {
  const textSize = useSettingsStore((state) => state.textSize);
  const [theme] = useTheme(customTheme);
  if (!node?.children || node.children.length === 0) return null;

  const headingStyles = useMemo(
    () => [
      {
        ...htmlHeading,
        color: theme.liveBlogTextBulletsBodyDescription,
        fontSize: scaleFont(htmlHeading.fontSize, textSize),
        ...(excludeHeadingMarginBottom && { marginBottom: 0 })
      },
      style
    ],
    [textSize, style, excludeHeadingMarginBottom, theme]
  );

  return (
    <Text style={headingStyles} allowFontScaling={textSize === 'System'}>
      {node.children.map((child: LexicalNode, idx: number) =>
        renderNode(child, idx, headingStyles, customTheme)
      )}
    </Text>
  );
};

export default memo(HeadingNode);
