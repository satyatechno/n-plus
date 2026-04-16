import type { StyleProp, ViewStyle } from 'react-native';

export interface EmbedBlockProps {
  /** The URL to embed */
  url: string;
  /** The provider/platform for the embed (e.g., 'youtube', 'spotify') */
  provider?: 'youtube' | 'spotify' | 'x' | 'instagram' | 'facebook' | 'tiktok' | string;
  customTheme?: 'light' | 'dark';
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
}
