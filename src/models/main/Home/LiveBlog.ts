export interface LexicalContent {
  root: {
    children: Array<{
      type: string;
      [key: string]: unknown;
    }>;
  };
}

export interface LinkedEntry {
  id: string;
  title: string;
  content: LexicalContent;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  liveblogStatus?: string;
  activateLiveSignal?: string;
  videoUrl?: string;
  deletedAt?: string;
  contentPrioritization?: {
    isActive: boolean;
  };
  youtubeCode?: string;
  operation?: string;
}
