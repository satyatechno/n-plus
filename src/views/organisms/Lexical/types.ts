import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';

/* ------------------------------------------------------------------ *
 *  Base props & helpers                                               *
 * ------------------------------------------------------------------ */

/**
 * Base props interface shared by every node component.
 * ReactNative uses the `style` prop, not `className`.
 */
export interface BaseNodeProps {
  /** Optional RN style object or array */
  style?: StyleProp<ViewStyle | TextStyle>;
  customTheme?: 'light' | 'dark';
}

/** Props for nodes that can contain children */
export interface NodeWithChildrenProps extends BaseNodeProps {
  node: LexicalNode;
  renderNode: (
    node: LexicalNode,
    index: number,
    parentStyles?: StyleProp<ViewStyle | TextStyle>,
    customTheme?: 'light' | 'dark'
  ) => React.ReactNode;
  excludeHeadingMarginBottom?: boolean;
  disableNestedParagraphMargin?: boolean;
}

/** Props for leaf‑only nodes */
export interface NodeWithoutChildrenProps extends BaseNodeProps {
  node: LexicalNode;
}

/* ------------------------------------------------------------------ *
 *  Text‑format bitmask (unchanged)                                    *
 * ------------------------------------------------------------------ */

export const TEXT_FORMATS = {
  NONE: 0,
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64
} as const;

export type TextFormat = (typeof TEXT_FORMATS)[keyof typeof TEXT_FORMATS];

/* ------------------------------------------------------------------ *
 *  Data helpers for specific node types                               *
 * ------------------------------------------------------------------ */

export interface LinkData {
  url?: string;
  newTab?: boolean;
}

export interface RelationshipData {
  title?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface UploadData {
  url?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  filename?: string;
  mimeType?: string;
  filesize?: number;
}

/* ------------------------------------------------------------------ *
 *  Node‑specific prop aliases                                         *
 * ------------------------------------------------------------------ */

export type TextNodeProps = NodeWithoutChildrenProps;
export type ParagraphNodeProps = NodeWithChildrenProps;
export type HeadingNodeProps = NodeWithChildrenProps;
export interface LinkNodeProps extends NodeWithChildrenProps {
  story?: StoryAnalyticsData | null;
  currentSlug?: string;
  slugHistory?: string[];
  collection?: string;
  page?: string;
}
export type ListNodeProps = NodeWithChildrenProps;
export type ListItemNodeProps = NodeWithChildrenProps;
export type QuoteNodeProps = NodeWithChildrenProps;
export type RelationshipNodeProps = NodeWithoutChildrenProps;

export interface StoryAnalyticsData {
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

export interface BlockNodeProps extends BaseNodeProps {
  node: LexicalNode;
  story?: StoryAnalyticsData | null;
  currentSlug?: string;
  slugHistory?: string[];
  collection?: string;
  page?: string;
}

export interface UploadNodeProps extends NodeWithoutChildrenProps {
  renderNode?: (
    node: LexicalNode,
    index: number,
    parentStyles?: StyleProp<ViewStyle | TextStyle>
  ) => React.ReactNode;
}

export type UnsupportedNodeProps = NodeWithoutChildrenProps;
export type SimpleNodeProps = BaseNodeProps;

/** Union of every node‑component prop shape */
export type NodeProps =
  | TextNodeProps
  | ParagraphNodeProps
  | HeadingNodeProps
  | LinkNodeProps
  | ListNodeProps
  | ListItemNodeProps
  | QuoteNodeProps
  | RelationshipNodeProps
  | UploadNodeProps
  | UnsupportedNodeProps
  | SimpleNodeProps;
