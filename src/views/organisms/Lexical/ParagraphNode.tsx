import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ParagraphNodeProps } from '@src/views/organisms/Lexical/types';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { LexicalNode, NODE_TYPES } from '@src/models/main/Home/StoryPage/StoryRenderer';

import { scaleFont } from '@src/utils/fontScaler';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { isIos } from '@src/utils/platformCheck';

/**
 * Renders a paragraph (<p>) in ReactNative.
 * Children are rendered through the callback so that nested
 * inline nodes (TextNode, LinkNode, etc.) keep their own logic.
 *
 * @param node - The paragraph node containing children to render
 * @param renderNode - Callback function to render child nodes
 * @param style - Additional styles to apply to the paragraph
 * @param customTheme - Custom theme configuration
 * @param disableNestedParagraphMargin - If true, disables horizontal margin for nested paragraphs
 *
 * @remarks
 * This component handles two rendering scenarios:
 * 1. Standard paragraphs: Rendered as a Text component with inline children
 * 2. Nested paragraphs: Rendered in a View container to prevent double spacing issues
 *
 * The component filters out empty children before rendering:
 * - Text nodes must have non-empty text content after trimming
 * - Other nodes must have at least one child node
 *
 * When nested paragraphs are detected, the component:
 * - Checks if any child is a paragraph node to determine nested structure
 * - Renders nested paragraphs in a View container instead of a Text component
 * - Prevents double spacing by using a container with minimal top margin
 * - Overrides margin-top for nested paragraph nodes to 0
 * - Conditionally applies negative horizontal margin based on disableNestedParagraphMargin prop
 */
const ParagraphNode: React.FC<ParagraphNodeProps> = ({
  node,
  renderNode,
  style,
  customTheme,
  disableNestedParagraphMargin = false
}) => {
  const textSize = useSettingsStore((state) => state.textSize);

  const paragraphStyles = useMemo(
    () => [{ ...styles.paragraph, fontSize: scaleFont(fontSize.s, textSize) }, style],
    [textSize, style]
  );

  const nestedContainerStyle = useMemo(
    () => [
      styles.nestedParagraphContainer,
      !disableNestedParagraphMargin && {
        marginHorizontal: -actuatedNormalize(spacing.xs)
      }
    ],
    [disableNestedParagraphMargin]
  );

  if (!node?.children || node.children.length === 0) return null;

  const validChildren = node.children.filter((child: LexicalNode) => {
    if (child.type === NODE_TYPES.TEXT) {
      return child.text && child.text.trim().length > 0;
    }
    return child.children && child.children.length > 0;
  });

  if (validChildren.length === 0) return null;

  const hasNestedParagraphs = validChildren.some(
    (child: LexicalNode) => child.type === NODE_TYPES.PARAGRAPH
  );

  if (hasNestedParagraphs) {
    const nestedParagraphStyle = { marginTop: 0 };

    return (
      <View style={nestedContainerStyle}>
        {validChildren.map((child: LexicalNode, idx: number) => {
          if (child.type === NODE_TYPES.PARAGRAPH) {
            return (
              <View key={idx}>
                {renderNode(child, idx, [style, nestedParagraphStyle], customTheme)}
              </View>
            );
          }
          return renderNode(child, idx, style, customTheme);
        })}
      </View>
    );
  }

  return (
    <Text
      style={paragraphStyles}
      allowFontScaling={textSize === 'System'}
      textBreakStrategy={!isIos ? 'simple' : undefined}
    >
      {validChildren.map((child: LexicalNode, idx: number) =>
        renderNode(child, idx, style, customTheme)
      )}
    </Text>
  );
};

export default memo(ParagraphNode);

const styles = StyleSheet.create({
  paragraph: {
    fontSize: fontSize.s,
    lineHeight: lineHeight.l,
    letterSpacing: letterSpacing.none,
    marginTop: spacing.s,
    fontFamily: `${fonts.notoSerif}-Regular`,
    flexShrink: 1
  },
  nestedParagraphContainer: {
    marginTop: actuatedNormalizeVertical(spacing.xxs),
    paddingHorizontal: 0
  }
});
