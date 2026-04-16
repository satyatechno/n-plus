import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import {
  borderWidth,
  fontSize,
  letterSpacing,
  lineHeight,
  radius,
  spacing
} from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { LexicalContent } from '@src/models/main/Home/LiveBlog';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { isIos } from '@src/utils/platformCheck';
import { ShareIcon } from '@src/assets/icons';
import { NODE_TYPES } from '@src/views/organisms/Lexical/constants';

interface TimelineNodeProps {
  styles: ReturnType<typeof themeStyles>;
  transparentStyle?: StyleProp<ViewStyle>;
}

interface LiveBlogEntryRendererProps {
  timestamp: string;
  content: LexicalContent;
  title?: string;
  isFirst: boolean;
  isLast: boolean;
  liveBlogStatus: boolean;
  onShareButtonPress: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const LiveBlogEntryRenderer: React.FC<LiveBlogEntryRendererProps> = ({
  timestamp,
  content,
  title,
  isLast,
  liveBlogStatus,
  onShareButtonPress,
  contentContainerStyle
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const TimelineDot: React.FC<TimelineNodeProps> = ({ styles, transparentStyle }) => (
    <View style={StyleSheet.flatten([styles.timelineDot, transparentStyle])} />
  );

  const formattedTime = useMemo(
    () => formatMexicoDateTime(timestamp, 'dateTimeObject'),
    [timestamp]
  ) as {
    time: string;
    date: string;
  };

  const renderTimestamp = (isTransparent?: boolean) => (
    <View style={styles.timestampContainer}>
      <CustomText
        weight={'Dem'}
        fontFamily={fonts.franklinGothicURW}
        size={fontSize.xxs}
        color={
          isTransparent
            ? 'transparent'
            : liveBlogStatus
              ? theme.tagsTextBreakingNews
              : theme.labelsTextLabelTime
        }
        textStyles={styles.timestamp}
      >
        {formattedTime?.time || ''}
      </CustomText>
      {formattedTime?.date && (
        <CustomText
          weight={'Boo'}
          fontFamily={fonts.franklinGothicURW}
          size={fontSize.xxs}
          color={
            isTransparent
              ? 'transparent'
              : liveBlogStatus
                ? theme.tagsTextBreakingNews
                : theme.labelsTextLabelTime
          }
          textStyles={styles.timestamp}
        >
          {formattedTime?.date || ''}
        </CustomText>
      )}
    </View>
  );

  const hasContent = content?.root?.children && content.root.children.length > 0;
  const firstNode = hasContent ? content.root.children[0] : null;

  return (
    <View style={styles.blockEntryContainer}>
      {!isLast && (
        <>
          <View
            style={StyleSheet.flatten([
              styles.continuousTimeline,
              {
                height: isLast ? '75%' : '100%'
              },
              contentContainerStyle
            ])}
          >
            {renderTimestamp(true)}
          </View>
        </>
      )}

      {/* Top row */}
      <View style={StyleSheet.flatten([styles.entryRow, contentContainerStyle])}>
        {renderTimestamp()}

        {/* Timeline column */}
        <View style={styles.timelineColumn}>
          <TimelineDot styles={styles} />
        </View>

        <View style={styles.contentContainer}>
          {title && title.trim() !== '' ? (
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              weight={'Dem'}
              size={fontSize.m}
              color={theme.liveBlogTextTitle}
              textStyles={styles.entryTitle}
            >
              {title}
            </CustomText>
          ) : hasContent && firstNode && firstNode.type !== 'block' ? (
            // Render first inline node here if no title

            <View style={styles.firstInlineNode}>
              <LexicalContentRenderer
                content={{
                  root: { ...content.root, children: [firstNode] }
                }}
                spacingHorizontal={0}
                excludeHeadingMarginBottom
                disableNestedParagraphMargin
              />
            </View>
          ) : null}
        </View>
      </View>

      {/* If no title and first node is block */}
      {!title && hasContent && firstNode && firstNode.type === 'block' && (
        <View style={StyleSheet.flatten([styles.fullWidthBlock, styles.firstMediaContent])}>
          <LexicalContentRenderer
            content={{
              root: { ...content.root, children: [firstNode] }
            }}
            spacingHorizontal={0}
            excludeHeadingMarginBottom
            disableNestedParagraphMargin
          />
        </View>
      )}

      {/* Content rendering:
          - If title exists → render ALL nodes
          - If no title → skip first node (already rendered) */}
      {hasContent && (
        <View style={styles.mainLexicalContainer}>
          {(title ? content.root.children : content.root.children.slice(1)).map(
            (node: { type: string; [key: string]: unknown }, index: number) => {
              if (
                node.type == NODE_TYPES.PARAGRAPH &&
                Array.isArray(node?.children) &&
                node.children.length == 0
              ) {
                return null;
              }
              if (node.type === 'block') {
                return (
                  <View key={index} style={styles.fullWidthBlock}>
                    <LexicalContentRenderer
                      content={{
                        root: { ...content.root, children: [node] }
                      }}
                      excludeHeadingMarginBottom
                      disableNestedParagraphMargin
                    />
                  </View>
                );
              } else {
                return (
                  <View
                    key={index}
                    style={StyleSheet.flatten([
                      styles.alignedContent,
                      contentContainerStyle,
                      node.type === 'list'
                        ? styles.contentWithOrderList
                        : styles.contentWithoutImage
                    ])}
                  >
                    {renderTimestamp(true)}
                    <View style={styles.timelineColumn}>
                      <TimelineDot styles={styles} transparentStyle={styles.transparentDot} />
                    </View>
                    <View style={styles.contentContainer}>
                      <LexicalContentRenderer
                        content={{
                          root: { ...content.root, children: [node] }
                        }}
                        spacingHorizontal={0}
                        excludeHeadingMarginBottom
                        disableNestedParagraphMargin
                      />
                    </View>
                  </View>
                );
              }
            }
          )}
        </View>
      )}

      <Pressable
        style={StyleSheet.flatten([styles.shareView, contentContainerStyle])}
        onPress={onShareButtonPress}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <ShareIcon color={theme.iconIconographyGenericState} />
      </Pressable>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    blockEntryContainer: {
      position: 'relative'
    },
    entryRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    timestampContainer: {
      marginTop: isIos ? -1.2 : -4.5, // not using actuatedNormalize because of pixel perfect
      marginRight: actuatedNormalize(9),
      rowGap: 4 // not using actuatedNormalize because of pixel perfect
    },
    timestamp: {
      letterSpacing: letterSpacing.none
    },
    timelineColumn: {
      alignItems: 'center',
      flexShrink: 0,
      marginRight: actuatedNormalize(9),
      height: '100%',
      position: 'relative',
      zIndex: 2
    },
    timelineDot: {
      width: actuatedNormalize(8),
      height: actuatedNormalize(8),
      borderRadius: radius.m,
      backgroundColor: theme.liveBlogEnteriesIndicator,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3
    },
    firstDot: {
      backgroundColor: theme.dividerPrimary
    },
    dotInner: {
      width: actuatedNormalize(6),
      height: actuatedNormalizeVertical(6),
      borderRadius: radius.m,
      backgroundColor: theme.dividerPrimary
    },
    contentContainer: {
      flex: 1,
      marginTop: isIos ? -6 : -6 // not using actuatedNormalize because of pixel perfect
    },
    entryTitle: {
      fontSize: actuatedNormalize(fontSize.m),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      letterSpacing: letterSpacing.none
    },
    fullWidthBlock: {
      width: '100%',
      marginVertical: actuatedNormalizeVertical(spacing.xxs),
      position: 'relative',
      zIndex: 1
    },
    alignedContent: {
      flexDirection: 'row',
      position: 'relative',
      zIndex: 1
    },
    transparentDot: {
      backgroundColor: 'transparent'
    },
    continuousTimeline: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      borderRightWidth: borderWidth.s,
      borderRightColor: theme.dividerPrimary,
      paddingRight: isIos ? 4.1 : 4, // not using actuatedNormalize because of pixel perfect
      marginVertical: actuatedNormalizeVertical(spacing.xxs)
    },
    shareView: {
      alignSelf: 'flex-end',
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    firstInlineNode: {
      marginTop: isIos ? -25.5 : -spacing.l // not using actuatedNormalize because of pixel perfect
    },
    firstMediaContent: {
      marginTop: -spacing.xxs // not using actuatedNormalize because of pixel perfect
    },
    contentWithoutImage: {
      marginTop: actuatedNormalizeVertical(-10)
    },
    contentWithOrderList: {
      marginTop: actuatedNormalizeVertical(8)
    },
    mainLexicalContainer: {
      marginTop: actuatedNormalizeVertical(-spacing.xs)
    }
  });

export default LiveBlogEntryRenderer;
