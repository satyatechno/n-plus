import React, { memo } from 'react';

import { EmbedBlockProps } from '@src/views/organisms/Lexical/blocks/types';
import FacebookPreview from '@src/views/organisms/Lexical/blocks/socialEmbeds/FacebookPreview';
import InstaPreview from '@src/views/organisms/Lexical/blocks/socialEmbeds/InstagramPreview';
import SpotifyPreview from '@src/views/organisms/Lexical/blocks/socialEmbeds/SpotifyPreview';
import TikTokPreview from '@src/views/organisms/Lexical/blocks/socialEmbeds/TikTokPreview';
import XPreview from '@src/views/organisms/Lexical/blocks/socialEmbeds/XPreview';
import YoutubePlayer from '@src/views/organisms/Lexical/blocks/socialEmbeds/YoutubePlayer';

/**
 * EmbedBlock
 *
 * Renders an embedded block for supported providers such as YouTube, X (Twitter), and Instagram.
 * Selects the appropriate preview/player component based on the provider.
 *
 * Props:
 *   - url: The URL to embed.
 *   - provider: The provider type (e.g., 'youtube', 'x', 'instagram').
 *
 * Usage:
 *   <EmbedBlock url={url} provider={provider} />
 *
 * Supported Providers:
 *   - YouTube: Renders YoutubePlayer with extracted videoId.
 *   - X (Twitter): Renders TwitterPreview.
 *   - Instagram: Renders InstaPreview.
 *   - Facebook: Renders FacebookPreview.
 *   - Spotify: Renders SpotifyPreview.
 *   - TikTok: Renders TikTokPreview.
 *
 * Falls back to null if no provider is specified.
 */

const getYouTubeVideoId = (url: string): string => {
  // Handle standard YouTube URL format (youtube.com/watch?v=...)
  if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0];
  }

  // Handle shortened YouTube URL format (youtu.be/...)
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }

  // Fallback for other formats
  return url.split('/').pop()?.split('?')[0] || '';
};

const EmbedBlock = ({ url, provider, customTheme, contentContainerStyle }: EmbedBlockProps) => {
  if (provider === 'youtube') {
    return (
      <YoutubePlayer
        videoId={getYouTubeVideoId(url)}
        contentContainerStyle={[{ aspectRatio: 16 / 9 }, contentContainerStyle]}
      />
    );
  }

  if (provider === 'x') {
    return <XPreview url={url} customTheme={customTheme} />;
  }

  if (provider === 'instagram') {
    return <InstaPreview url={url} customTheme={customTheme} />;
  }

  if (provider === 'facebook') {
    return <FacebookPreview url={url} customTheme={customTheme} />;
  }

  if (provider === 'spotify') {
    return <SpotifyPreview url={url} />;
  }

  if (provider === 'tiktok') {
    return <TikTokPreview url={url} customTheme={customTheme} />;
  }

  return null;
};

export default memo(EmbedBlock);
