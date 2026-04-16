import React, { useMemo, memo } from 'react';
import { View, StyleSheet } from 'react-native';

import HtmlBlock from '@src/views/organisms/Lexical/blocks/HtmlBlock';
import MediaBlock from '@src/views/organisms/Lexical/blocks/MediaBlock';
import PdfBlock from '@src/views/organisms/Lexical/blocks/PdfBlock';
import EmbedBlock from '@src/views/organisms/Lexical/blocks/EmbedBlock';
import RelatedStoryBlock from '@src/views/organisms/Lexical/blocks/RelatedStoryBlock';
import UnknownBlock from '@src/views/organisms/Lexical/blocks/UnknownBlock';
import { BLOCK_TYPES } from '@src/views/organisms/Lexical/constants';
import HighChartBlock from '@src/views/organisms/Lexical/blocks/HighChartBlock';
import { BlockNodeProps } from '@src/views/organisms/Lexical/types';
import VideoBlock, { VideoData } from '@src/views/organisms/Lexical/blocks/VideoBlock';

/**
 * Dynamically renders the appropriate block type component based on the node.
 */

const BlockNode = ({
  node,
  style,
  customTheme,
  story,
  currentSlug,
  slugHistory,
  collection,
  page
}: BlockNodeProps) => {
  const blockType = useMemo(() => node.fields?.blockType as string, [node.fields?.blockType]);

  const renderBlock = useMemo(() => {
    switch (blockType) {
      case BLOCK_TYPES.HTML_BLOCK:
        return <HtmlBlock html={node?.fields?.htmlContent as string} customTheme={customTheme} />;

      case BLOCK_TYPES.CHART_BLOCK:
        return <HighChartBlock url={node?.fields?.url as string} />;

      case BLOCK_TYPES.IMAGE_BLOCK:
        return (
          <MediaBlock
            media={
              node?.fields?.media as
                | {
                    caption: string;
                    url?: string;
                    alt?: string;
                    title?: string;
                    width?: number;
                    height?: number;
                    mimeType?: string;
                  }
                | undefined
            }
            customTheme={customTheme}
            style={style}
          />
        );

      case BLOCK_TYPES.PDF_BLOCK:
        return (
          <PdfBlock
            pdfFile={
              node?.fields?.pdfFile as
                | { url?: string; title?: string; filename?: string }
                | undefined
            }
            customTheme={customTheme}
            story={story}
            currentSlug={currentSlug}
            slugHistory={slugHistory}
            collection={collection}
            page={page}
          />
        );

      case BLOCK_TYPES.O_EMBED:
        return (
          <EmbedBlock
            url={node?.fields?.url as string}
            provider={node.fields?.provider as string}
            customTheme={customTheme}
          />
        );

      case BLOCK_TYPES.VIDEO_BLOCK:
        return (
          <VideoBlock
            videoRelated={node?.fields?.videoRelated as { relationTo: string; value: VideoData }[]}
            customTheme={customTheme}
          />
        );

      case BLOCK_TYPES.RELATED_CONTENT:
        return (
          <RelatedStoryBlock
            selectedDocs={
              node?.fields?.selectedDocs as
                | Array<{
                    relationTo?: string;
                    value?: {
                      title?: string;
                      slug?: string;
                      fullPath?: string;
                      readTime?: number;
                      videoDuration?: number;
                      category?: { title?: string };
                      topics?: Array<{ title?: string }>;
                      heroImage?: Array<{ url?: string; alt?: string; caption?: string }>;
                      openingType?: string;
                    };
                  }>
                | undefined
            }
            categories={node?.fields?.categories as Array<{ title?: string }> | undefined}
            titleBlock={node?.fields?.titleBlock as string | undefined}
            introContent={node?.fields?.introContent as { text?: string } | undefined}
            customTheme={customTheme}
            style={style}
            story={story}
            currentSlug={currentSlug}
            slugHistory={slugHistory}
            collection={collection}
            page={page}
          />
        );

      default:
        return (
          <UnknownBlock
            blockType={blockType}
            fields={node.fields as Record<string, unknown>}
            customTheme={customTheme}
          />
        );
    }
  }, [blockType, node.fields, customTheme, story, currentSlug, slugHistory, collection, page]);

  return <View style={styles.wrapper}>{renderBlock}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});

export default memo(BlockNode);
