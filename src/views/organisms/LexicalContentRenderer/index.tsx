import React, { memo, useCallback, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import RenderHTML from 'react-native-render-html';
import { FlashList } from '@shopify/flash-list';

import AdBannerContainer from '@src/views/molecules/AdBannerContainer';

import { NODE_TYPES } from '@src/models/main/Home/StoryPage/StoryRenderer';
import type { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';
import BlockNode from '@src/views/organisms/Lexical/BlockNode';
import HeadingNode from '@src/views/organisms/Lexical/HeadingNode';
import LineBreakNode from '@src/views/organisms/Lexical/LineBreakNode';
import LinkNode from '@src/views/organisms/Lexical/LinkNode';
import ListItemNode from '@src/views/organisms/Lexical/ListItemNode';
import ListNode from '@src/views/organisms/Lexical/ListNode';
import ParagraphNode from '@src/views/organisms/Lexical/ParagraphNode';
import QuoteNode from '@src/views/organisms/Lexical/QuoteNode';
import TextNode from '@src/views/organisms/Lexical/TextNode';
import UnsupportedNode from '@src/views/organisms/Lexical/UnsupportedNode';
import { actuatedNormalize, SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import { BLOCK_TYPES } from '@src/views/organisms/Lexical/constants';

/**
 * LexicalContentRenderer
 *
 * This component is responsible for rendering content that may be in either HTML string format
 * or Lexical JSON format (as used by the Lexical editor). It determines the format of the content,
 * parses it if necessary, and renders it using the appropriate components.
 *
 * - If the content is a string, it attempts to parse it as JSON. If parsing fails, it is rendered as HTML.
 * - If the content is valid Lexical JSON, it is rendered using custom Lexical node components.
 * - If the content is not provided or is invalid, nothing is rendered.
 *
 * Props:
 *   - content: The content to render. Can be a string (HTML or JSON) or a Lexical JSON object.
 *   - slug: (optional) A unique identifier for the content, if needed for tracking or analytics.
 *
 * Usage:
 *   <LexicalContentRenderer content={storyContent} />
 *
 * The component uses FlashList for efficient rendering of Lexical node arrays,
 * and RenderHTML for HTML string content.
 */

interface AdConfig {
  showAd: boolean;
  adPositionInBody: number;
}

interface StoryAnalyticsData {
  id?: string;
  fullPath?: string;
  title?: string;
  openingType?: string;
  displayType?: string;
  category?: { title?: string };
  provinces?: Array<{ title?: string }>;
  topics?: Array<{ title?: string }>;
  channel?: { title?: string };
  production?: { title?: string };
}

interface LexicalContentRendererProps {
  content?: Record<string, unknown> | string | null;
  slug?: string;
  spacingHorizontal?: number;
  contentTextStyle?: StyleProp<TextStyle>;
  customTheme?: 'light' | 'dark';
  excludeHeadingMarginBottom?: boolean;
  disableNestedParagraphMargin?: boolean;
  adConfig?: AdConfig;
  story?: StoryAnalyticsData | null;
  currentSlug?: string;
  slugHistory?: string[];
  collection?: string;
  page?: string;
}

interface LexicalRoot {
  root: {
    children?: LexicalNode[];
  };
}

function isLexicalJson(obj: unknown): obj is LexicalRoot {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const root = (obj as { root?: unknown }).root;

  if (typeof root !== 'object' || root === null || !('children' in root)) {
    return false;
  }

  const children = (root as { children?: unknown }).children;
  return Array.isArray(children);
}

const LexicalContentRenderer: React.FC<LexicalContentRendererProps> = ({
  content,
  spacingHorizontal,
  contentTextStyle,
  customTheme,
  excludeHeadingMarginBottom,
  disableNestedParagraphMargin,
  adConfig,
  story,
  currentSlug,
  slugHistory,
  collection,
  page
}) => {
  if (!content) return null;

  const contentToRender = useMemo(() => {
    if (!content) return null;

    if (typeof content === 'string') {
      try {
        const maybeJson = JSON.parse(content);
        return isLexicalJson(maybeJson) ? maybeJson : content;
      } catch {
        return content;
      }
    }

    return content;
  }, [content]);

  if (typeof contentToRender === 'string') {
    const flattenedStyle = StyleSheet.flatten(contentTextStyle);
    return (
      <View style={contentTextStyle}>
        <RenderHTML
          contentWidth={SCREEN_WIDTH}
          source={{ html: contentToRender }}
          baseStyle={flattenedStyle as Record<string, unknown>}
        />
      </View>
    );
  }

  const root: LexicalRoot['root'] | null = isLexicalJson(contentToRender)
    ? contentToRender.root
    : null;

  if (!root?.children || root.children.length === 0) return null;

  const getComponentForType = (type: string) => {
    switch (type) {
      case NODE_TYPES.PARAGRAPH:
        return ParagraphNode;
      case NODE_TYPES.HEADING:
        return HeadingNode;
      case NODE_TYPES.TEXT:
        return TextNode;
      case NODE_TYPES.LINK:
        return LinkNode;
      case NODE_TYPES.AUTOLINK:
        return LinkNode;
      case NODE_TYPES.LIST:
        return ListNode;
      case NODE_TYPES.LIST_ITEM:
        return ListItemNode;
      case NODE_TYPES.QUOTE:
        return QuoteNode;
      case NODE_TYPES.LINE_BREAK:
        return LineBreakNode;
      case NODE_TYPES.BLOCK:
        return BlockNode;
      default:
        return UnsupportedNode;
    }
  };

  const renderNode = useCallback(
    (
      node: LexicalNode,
      index: number,
      parentStyles?: React.ComponentProps<typeof View>['style'],
      customTheme?: 'light' | 'dark'
    ) => {
      const NodeComponent = getComponentForType(node.type);

      if (
        node.type === NODE_TYPES.TEXT ||
        node.type === NODE_TYPES.LINE_BREAK ||
        node.type === NODE_TYPES.LINK ||
        node.type === NODE_TYPES.AUTOLINK
      ) {
        const linkProps =
          node.type === NODE_TYPES.LINK || node.type === NODE_TYPES.AUTOLINK
            ? { story, currentSlug, slugHistory, collection, page }
            : {};
        return (
          <NodeComponent
            key={index}
            node={node}
            renderNode={renderNode}
            style={parentStyles}
            customTheme={customTheme}
            {...linkProps}
          />
        );
      }

      let shouldExcludeHeadingMargin = excludeHeadingMarginBottom;
      if (node.type === NODE_TYPES.HEADING && root?.children) {
        const remainingNodes = root.children.slice(index + 1);
        const hasNonHeadingContent = remainingNodes.some(
          (remainingNode) => remainingNode.type !== NODE_TYPES.HEADING
        );
        if (!hasNonHeadingContent) {
          shouldExcludeHeadingMargin = true;
        }
      }

      return (
        <View
          key={index}
          style={{
            paddingHorizontal:
              (node.type === NODE_TYPES.BLOCK &&
                node.fields?.blockType === BLOCK_TYPES.IMAGE_BLOCK) ||
              (node.type === NODE_TYPES.BLOCK && node.fields?.blockType === BLOCK_TYPES.VIDEO_BLOCK)
                ? 0
                : actuatedNormalize(spacingHorizontal ?? spacing.xs)
          }}
        >
          <NodeComponent
            key={index}
            node={node}
            renderNode={renderNode}
            style={[parentStyles]}
            customTheme={customTheme}
            {...(node.type === NODE_TYPES.HEADING && {
              excludeHeadingMarginBottom: shouldExcludeHeadingMargin
            })}
            {...(node.type === NODE_TYPES.PARAGRAPH && { disableNestedParagraphMargin })}
            {...(node.type === NODE_TYPES.BLOCK && {
              story,
              currentSlug,
              slugHistory,
              collection,
              page
            })}
          />
        </View>
      );
    },
    [
      spacingHorizontal,
      excludeHeadingMarginBottom,
      disableNestedParagraphMargin,
      root,
      story,
      currentSlug,
      slugHistory,
      collection,
      page
    ]
  );

  const adInsertionIndices = useMemo(() => {
    if (!adConfig?.showAd || !adConfig?.adPositionInBody || !root?.children) {
      return new Set<number>();
    }
    const n = adConfig.adPositionInBody;
    const indices = new Set<number>();
    let paragraphCount = 0;

    root.children.forEach((node, index) => {
      if (node.type === NODE_TYPES.PARAGRAPH) {
        paragraphCount++;
        if (paragraphCount % n === 0) {
          indices.add(index);
        }
      }
    });

    return indices;
  }, [adConfig, root?.children]);

  const renderAdBanner = useCallback(
    () => <AdBannerContainer containerStyle={{ marginVertical: actuatedNormalize(spacing.m) }} />,
    []
  );

  const renderNodeItem = useCallback(
    ({ item, index }: { item: LexicalNode; index: number }) => {
      const nodeElement = renderNode(item, index, contentTextStyle, customTheme);
      if (adInsertionIndices.has(index)) {
        return (
          <>
            {nodeElement}
            {renderAdBanner()}
          </>
        );
      }
      return nodeElement;
    },
    [renderNode, adInsertionIndices, renderAdBanner, contentTextStyle, customTheme]
  );

  return (
    <FlashList
      data={root.children}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderNodeItem}
      estimatedItemSize={80}
      removeClippedSubviews
      scrollEnabled={false}
      extraData={adConfig}
    />
  );
};

export default memo(LexicalContentRenderer);
