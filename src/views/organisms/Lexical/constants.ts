/**
 * Block types for BlockNode component
 * Defines the different types of content blocks that can be rendered
 */

export const BLOCK_TYPES = {
  HTML_BLOCK: 'htmlBlock',
  IMAGE_BLOCK: 'imageBlock',
  PDF_BLOCK: 'pdfBlock',
  O_EMBED: 'oEmbed',
  RELATED_CONTENT: 'relatedContent',
  CHART_BLOCK: 'chartBlock',
  VIDEO_BLOCK: 'videoBlock'
} as const;

/**
 * Node types for LexicalContentRenderer
 */

export const NODE_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  TEXT: 'text',
  LINK: 'link',
  AUTOLINK: 'autolink',
  LIST: 'list',
  LIST_ITEM: 'listitem',
  QUOTE: 'quote',
  HORIZONTAL_RULE: 'horizontalrule',
  LINE_BREAK: 'linebreak',
  BLOCK: 'block'
} as const;

/** List types for ListNode component */

export const LIST_TYPES = {
  NUMBER: 'number'
} as const;

/* ---------- Utility types ---------- */

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];
export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
export type ListType = (typeof LIST_TYPES)[keyof typeof LIST_TYPES];
