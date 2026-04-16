export interface StoryContent {
  root: {
    children: StoryBlock[];
  };
}

export interface StoryBlock {
  type: string;
  [key: string]: unknown;
}

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
  UPLOAD: 'upload',
  BLOCK: 'block',
  RELATIONSHIP: 'relationship'
} as const;

export interface LexicalNode {
  type: string;
  version: number;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  detail?: number;
  mode?: string;
  direction?: string;
  indent?: number;
  tag?: string;
  listType?: string;
  start?: number;
  checked?: boolean;
  value?: number | Record<string, unknown>;
  fields?: Record<string, unknown>;
  relationTo?: string;
  id?: string;
  url?: string;
  provider?: string;
  blockType?: string;
  htmlContent?: string;
  code?: string;
  language?: string;
  media?: Record<string, unknown>;
  pdfFile?: Record<string, unknown>;
  style?: string;
  content?: Record<string, unknown>;
}
