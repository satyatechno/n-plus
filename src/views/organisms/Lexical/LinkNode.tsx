import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Linking, Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import type { LinkNodeProps } from '@src/views/organisms/Lexical/types';
import { fontSize } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import type { AppTheme } from '@src/themes/theme';
import type { LexicalNode } from '@src/models/main/Home/StoryPage/StoryRenderer';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import type { RootStackParamList } from '@src/navigation/types';
import { scaleFont } from '@src/utils/fontScaler';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { logSelectContentEvent } from '@src/utils/storyAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';

/**
 * LinkNode
 *
 * Renders a hyperlink (<a>) node from Lexical JSON in React Native.
 * This component displays the link text and handles user interaction
 * by attempting to open the provided URL using the device's browser.
 *
 * - If the URL is invalid or cannot be opened, an alert is shown.
 * - The link style is themed and underlined.
 * - Font size scales according to user preferences.
 *
 * Props:
 *   - node: The Lexical link node object, containing its children and URL.
 *   - renderNode: Callback to render child nodes (for nested formatting).
 *   - style: (optional) Additional styles from parent nodes.
 *
 * Usage:
 *   <LinkNode node={node} renderNode={renderNode} style={parentStyle} />
 *
 * Children are rendered as inline text, inheriting parent styles.
 */

const getLinkText = (node: LinkNodeProps['node']): string => {
  if (!node?.children?.length) return 'undefined';
  const texts = node.children
    .filter((c: LexicalNode) => c.type === 'text' && c.text)
    .map((c: LexicalNode) => (c as { text?: string }).text || '')
    .filter(Boolean);
  return texts.join(' ') || 'undefined';
};

const LinkNode = ({
  node,
  renderNode,
  style,
  customTheme,
  story,
  currentSlug,
  slugHistory,
  collection,
  page
}: LinkNodeProps) => {
  const linkData = node.fields;
  const { t } = useTranslation();
  const [resolvedTheme] = useTheme(customTheme);
  const textSize = useSettingsStore((state) => state.textSize);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const themeStyles = createThemeStyles(resolvedTheme);

  if (!node?.children?.length) return null;

  const url = (node?.fields?.url || node?.url || '') as string;
  const linkType = linkData?.linkType as string | undefined;
  const doc = linkData?.doc as { relationTo?: string; value?: { slug?: string } } | undefined;

  const { parentTextStyles, linkFontSize } = useMemo(() => {
    const flattenedStyle = StyleSheet.flatten(style as StyleProp<TextStyle>);
    const textStyles: Partial<TextStyle> = {
      color: resolvedTheme.bodyTextOther,
      textDecorationLine: 'underline',
      fontStyle: 'italic'
    };

    if (flattenedStyle?.fontFamily) {
      textStyles.fontFamily = flattenedStyle.fontFamily;
    }
    if (flattenedStyle?.fontSize) {
      textStyles.fontSize = flattenedStyle.fontSize;
    }
    if (flattenedStyle?.lineHeight) {
      textStyles.lineHeight = flattenedStyle.lineHeight;
    }
    if (flattenedStyle?.letterSpacing !== undefined) {
      textStyles.letterSpacing = flattenedStyle.letterSpacing;
    }

    const fontSizeValue = flattenedStyle?.fontSize || scaleFont(fontSize.s, textSize);

    return {
      parentTextStyles: textStyles,
      linkFontSize: fontSizeValue
    };
  }, [style, resolvedTheme.bodyTextHyperlinked, textSize]);

  const linkStyles = useMemo(
    () => [{ ...themeStyles.link, fontSize: linkFontSize }, style],
    [themeStyles.link, linkFontSize, style]
  );

  const handlePress = useCallback(async () => {
    if (story && currentSlug) {
      const previousSlug =
        slugHistory && slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
      const contentName = getLinkText(node) || url || 'undefined';
      logSelectContentEvent(story as Parameters<typeof logSelectContentEvent>[0], {
        organism: ANALYTICS_ORGANISMS.STORY_PAGE.BODY,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.TEXT_BLOCK,
        contentName,
        currentSlug,
        previousSlug,
        screenName: page || 'undefined',
        tipoContenido: collection && page ? `${collection}_${page}` : 'undefined',
        contentAction: ANALYTICS_MOLECULES.STORY_PAGE.LINK_HYPERLINK
      });
    }

    // Handle internal links
    if (linkType === 'internal' && doc?.relationTo && doc?.value?.slug) {
      const relationTo = doc.relationTo;
      const slug = doc.value.slug;

      if (relationTo === 'videos') {
        navigation.navigate(routeNames.VIDEOS_STACK, {
          screen: screenNames.VIDEO_DETAIL_PAGE,
          params: { slug }
        });
        return;
      }

      if (relationTo === 'posts') {
        navigation.push(routeNames.HOME_STACK, {
          screen: screenNames.STORY_PAGE_RENDERER,
          params: { slug }
        });
        return;
      }
    }

    // Handle custom/external links
    if (!url) return;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        throw new Error(t('screens.lexical.text.link.notAvailable'));
      }
    } catch {
      Alert.alert(
        t('screens.lexical.text.link.notAvailable'),
        t('screens.lexical.text.link.notAvailable')
      );
    }
  }, [linkType, doc, url, navigation, t, story, currentSlug, slugHistory, node]);

  return (
    <Text onPress={handlePress} style={linkStyles} allowFontScaling={textSize === 'System'}>
      {node.children?.map((child: LexicalNode, childIndex: number) =>
        renderNode(child, childIndex, parentTextStyles, customTheme)
      )}
    </Text>
  );
};

const createThemeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    link: {
      fontSize: fontSize.xs,
      color: theme.bodyTextOther,
      textDecorationLine: 'underline',
      fontStyle: 'italic'
    }
  });

export default memo(LinkNode);
