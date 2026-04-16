import React, { memo, useRef, useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, useWindowDimensions, Image } from 'react-native';

import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import RenderHtml, {
  CustomTagRendererRecord,
  defaultSystemFonts,
  HTMLElementModel,
  MixedStyleRecord,
  TNode,
  CustomRendererProps,
  HTMLContentModel
} from 'react-native-render-html';

import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import {
  borderWidth,
  fontSize,
  htmlHeading,
  lineHeight,
  radius,
  spacing
} from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import CustomText from '@src/views/atoms/CustomText';

import { scaleFont } from '@src/utils/fontScaler';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { TextSize } from '@src/models/main/MyAccount/Settings';

/**
 * HtmlBlock
 *
 * Renders a block of HTML content inside a React Native view.
 * Uses react-native-render-html for most HTML, with custom font support and theming.
 *
 * Props:
 *   - html: The HTML string to render.
 *
 * Features:
 *   - Custom system fonts for consistent typography.
 *   - Themed styles for headings, paragraphs, and lists.
 *   - Handles links using React Native's Linking API.
 *   - Supports custom rendering for iframes and other tags as needed.
 *
 * Usage:
 *   <HtmlBlock html={htmlString} />
 *
 * This component is used by BlockNode to render HTML_BLOCK nodes from Lexical JSON.
 */

interface DOMNode {
  type: string;
  data?: string;
  name?: string;
  children?: DOMNode[];
  tagName?: string;
}

type ListItemNode = TNode & {
  domNode: DOMNode;
  parent?: {
    tagName?: string;
    children?: ListItemNode[];
  };
};

interface ListItemRendererProps extends CustomRendererProps<TNode> {
  tnode: ListItemNode;
}

/**
 * Recursively serializes a DOMNode tree back into an HTML string.
 * Used to extract table HTML for rendering in a WebView.
 */
const serializeDomNode = (node: DOMNode): string => {
  if (node.type === 'text') return node.data || '';

  if (!node.name) {
    return (node.children || []).map(serializeDomNode).join('');
  }

  const attrs = (node as unknown as Record<string, unknown>).attribs as
    | Record<string, string>
    | undefined;
  const attrString = attrs
    ? Object.entries(attrs)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('')
    : '';

  const children = (node.children || []).map(serializeDomNode).join('');
  return `<${node.name}${attrString}>${children}</${node.name}>`;
};

// ─── Table constants ─────────────────────────────────────────────────────────

const TABLE_DEFAULT_HEIGHT = 200;
const TABLE_MIN_HEIGHT = 100;

interface TableThemeConfig {
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  headerBackground: string;
}

/**
 * Builds a self-contained HTML document for rendering a table in a WebView.
 * Includes themed CSS and a height measurement script.
 */
const buildTableDocument = (tableHtml: string, config: TableThemeConfig): string => `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, sans-serif;
          font-size: ${config.fontSize}px;
          color: ${config.textColor};
          background: ${config.backgroundColor};
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid ${config.borderColor};
        }
        th, td {
          border: 1px solid ${config.borderColor};
          padding-left: 3px;
          padding-right: 3px;
          padding-top: 6px;
          padding-bottom: 6px;
          text-align: center;
          white-space: nowrap;
        }
        th {
          background-color: ${config.headerBackground};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      ${tableHtml}
      <script>
        function sendHeight() {
          var h = document.body.scrollHeight;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'tableHeight', height: h }));
        }
        window.addEventListener('load', sendHeight);
        setTimeout(sendHeight, 300);
      </script>
    </body>
  </html>
`;

interface HtmlBlockProps {
  html: string;
}

interface IframeRendererProps {
  tnode: {
    attributes?: {
      src?: string;
      height?: string;
      width?: string;
    };
  };
}

interface HtmlBlockProps {
  html: string;
  customTheme?: 'light' | 'dark';
}

interface IframeRendererProps {
  tnode: {
    attributes?: {
      src?: string;
      height?: string;
      width?: string;
    };
  };
}

const systemFonts = [
  ...defaultSystemFonts,
  `${fonts.franklinGothicURW}-Boo`,
  `${fonts.franklinGothicURW}-Dem`,
  `${fonts.franklinGothicURW}-Med`,
  `${fonts.notoSerif}-Regular`,
  `${fonts.notoSerif}-Medium`,
  `${fonts.notoSerif}-Bold`,
  `${fonts.notoSerifExtraCondensed}-Regular`,
  `${fonts.notoSerifExtraCondensed}-Medium`,
  `${fonts.notoSerifExtraCondensed}-Bold`,
  `${fonts.superclarendon}-Regular`,
  `${fonts.superclarendon}-Medium`,
  `${fonts.superclarendon}-Bold`
];

const HtmlBlock = ({ html, customTheme }: HtmlBlockProps) => {
  const { width } = useWindowDimensions();
  const [theme] = useTheme(customTheme);
  const textSize = useSettingsStore((state) => state.textSize);
  const styles = themeStyles(theme, textSize);

  const isClickable = useRef<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      isClickable.current = true;
    }, 4000);
  }, []);

  const cleanHtmlContent = html
    ?.replace(/\\"/g, '"')
    .replace(/\\'/g, String.fromCharCode(39))
    .replace(/\\\//g, '/')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\r/g, '')
    .replace(/\\&/g, '&')
    .replace(/\\</g, '<')
    .replace(/\\>/g, '>')
    .replace(/\\=/g, '=')
    .replace(/\\s+/g, ' ')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<div[^>]*>\s*<\/div>/g, '');

  const customRenderers = {
    img: ({ tnode }: { tnode: TNode }) => {
      const src = tnode.attributes?.src;
      const widthAttr = tnode.attributes?.width;
      const heightAttr = tnode.attributes?.height;

      if (!src) return null;

      const imageWidth = widthAttr ? Number(widthAttr) : '100%';
      const imageHeight = heightAttr ? Number(heightAttr) : actuatedNormalizeVertical(200);

      return (
        <View
          style={{
            width: imageWidth,
            height: imageHeight,
            marginVertical: actuatedNormalizeVertical(spacing.l),
            alignSelf: 'center'
          }}
        >
          <Image source={{ uri: src }} style={styles.image} />
        </View>
      );
    },

    a: ({ TDefaultRenderer, tnode, ...props }: Record<string, unknown>) => {
      const href = (tnode as { attributes?: { href?: string } }).attributes?.href;
      const DefaultRenderer = TDefaultRenderer as React.ComponentType<{
        tnode: unknown;
        [key: string]: unknown;
      }>;
      return (
        <Text
          onPress={() => {
            if (href) Linking.openURL(href);
          }}
          allowFontScaling={textSize === 'System'}
        >
          <DefaultRenderer tnode={tnode} {...props} />
        </Text>
      );
    },

    /* ---------- Dynamic Iframe Height WebView Renderer With External Link Handling ---------- */
    iframe: ({ tnode }: IframeRendererProps) => {
      const src = tnode.attributes?.src;
      const defaultHeight = Number(tnode.attributes?.height || actuatedNormalizeVertical(200));
      const [iframeHeight, setIframeHeight] = useState(defaultHeight);
      const webViewRef = useRef<WebView>(null);

      if (!src) return null;

      const isGoogleMaps = src.includes('google.com/maps/embed') || src.includes('maps.google.com');

      const injectedJavaScript = `
    (function() {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);

      function sendHeight() {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
      }
      setInterval(sendHeight, 600);
      window.addEventListener("load", sendHeight);
      window.addEventListener("resize", sendHeight);

      document.addEventListener("click", function(event) {
        const target = event.target.closest("a");
        if (target && target.href) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "linkClick",
            url: target.href
          }));
        }
      });
    })();
    true;
  `;

      const openExternalURL = (url: string) => {
        if (url && url.startsWith('http')) {
          Linking.openURL(url);
          return false;
        }
        return true;
      };

      const onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
        const isExternal = event.url.startsWith('http');
        if (isExternal && event.navigationType === 'click') {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      };

      const handleMessage = (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data?.type === 'height' && data?.height) {
          setIframeHeight(Math.max(data.height, actuatedNormalizeVertical(200)));
        }

        if (data?.type === 'linkClick' && data?.url) {
          openExternalURL(data.url);
        }
      };

      const source = isGoogleMaps
        ? {
            html: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                background-color: transparent; 
              }
              iframe { 
                border: none; 
                width: 100vw; 
                height: ${defaultHeight}px; 
              }
            </style>
          </head>
          <body>
            <iframe src="${src}" allowfullscreen></iframe>
          </body>
        </html>
      `
          }
        : { uri: src };

      return (
        <View
          style={[styles.iframeContainer, { height: isGoogleMaps ? defaultHeight : iframeHeight }]}
        >
          <WebView
            key={src}
            ref={webViewRef}
            source={source}
            onMessage={handleMessage}
            injectedJavaScript={injectedJavaScript}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            allowsFullscreenVideo
            automaticallyAdjustContentInsets
            scalesPageToFit={isGoogleMaps ? false : undefined}
            nestedScrollEnabled={isGoogleMaps}
            bounces={!isGoogleMaps}
          />
        </View>
      );
    },

    table: ({ tnode }: { tnode: TNode }) => {
      const tableHtml = serializeDomNode(tnode.domNode as unknown as DOMNode);
      const [tableHeight, setTableHeight] = useState(TABLE_DEFAULT_HEIGHT);
      const tableWebViewRef = useRef<WebView>(null);

      const tableDocument = buildTableDocument(tableHtml, {
        fontSize: scaleFont(fontSize.s, textSize),
        textColor: theme.liveBlogTextBulletsBodyDescription,
        backgroundColor: theme.mainBackgroundDefault,
        borderColor: theme.borderColor,
        headerBackground: theme.mainBackgroundSecondary
      });

      return (
        <View style={{ width: '100%', height: tableHeight, marginTop: spacing.m }}>
          <WebView
            ref={tableWebViewRef}
            originWhitelist={['*']}
            source={{ html: tableDocument }}
            style={{ flex: 1, width: '100%', backgroundColor: theme.mainBackgroundDefault }}
            javaScriptEnabled
            scrollEnabled
            scalesPageToFit={false}
            onMessage={(event: WebViewMessageEvent) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data?.type === 'tableHeight' && data?.height) {
                  setTableHeight(Math.max(data.height, TABLE_MIN_HEIGHT));
                }
              } catch {
                // Ignore parse errors
              }
            }}
          />
        </View>
      );
    },

    sup: ({ TDefaultRenderer, tnode, ...props }: Record<string, unknown>) => {
      const DefaultRenderer = TDefaultRenderer as React.ComponentType<{
        tnode: unknown;
        [key: string]: unknown;
      }>;
      return (
        <View>
          <CustomText>
            <DefaultRenderer tnode={tnode} {...props} />
          </CustomText>
        </View>
      );
    },

    sub: ({ TDefaultRenderer, tnode, ...props }: Record<string, unknown>) => {
      const DefaultRenderer = TDefaultRenderer as React.ComponentType<{
        tnode: unknown;
        [key: string]: unknown;
      }>;
      return (
        <CustomText>
          <DefaultRenderer tnode={tnode} {...props} />
        </CustomText>
      );
    },

    li: ({ tnode }: ListItemRendererProps) => {
      /**
       * Extracts clean text content from a DOM node, removing any list markers
       */

      const extractTextContent = (node: DOMNode): string => {
        if (!node) return '';

        if (node.type === 'text') {
          const text = node.data || '';
          // Remove any existing list markers (numbers followed by dot)
          return text.replace(/^\d+\.\s*/, '').trim();
        }

        if (node.children?.length) {
          return node.children.map((child) => extractTextContent(child)).join('');
        }

        return '';
      };

      /**
       * Gets the appropriate list marker (number or bullet) based on list type
       */

      const getListMarker = (node: ListItemNode): string => {
        const parentTag = node.parent?.tagName;

        if (parentTag === 'ol' && Array.isArray(node.parent?.children)) {
          const index = node.parent.children.findIndex((child) => child === node);
          return `${index + 1}. `;
        }

        if (parentTag === 'ul') {
          return '• ';
        }

        return '';
      };

      const marker = getListMarker(tnode);
      const textContent = extractTextContent(tnode.domNode);

      return (
        <View style={styles.listItemContainer}>
          <CustomText textStyles={styles.listItemText}>{marker}</CustomText>
          <CustomText textStyles={styles.listItemText}>{textContent}</CustomText>
        </View>
      );
    }
  } as const;

  const customHTMLElementModels = {
    iframe: HTMLElementModel.fromCustomModel({
      tagName: 'iframe',
      contentModel: HTMLContentModel.mixed,
      getUADerivedStyleFromAttributes({ width, height }: { width?: string; height?: string }) {
        return {
          width: width || '100%',
          height: height || actuatedNormalizeVertical(200)
        };
      }
    })
  };

  const tagsStyles = useMemo(
    () => ({
      p: styles.paragraph,
      h1: styles.heading,
      h2: styles.heading,
      h3: styles.heading,
      h4: styles.heading,
      h5: styles.heading,
      h6: styles.heading,
      strong: styles.bold,
      b: styles.bold,
      em: styles.italic,
      u: styles.underline,
      s: styles.strikethrough,
      sup: styles.superscript,
      sub: styles.subscript,
      a: styles.link,
      ol: { ...styles.list, ...styles.ol, listStyleType: 'none' },
      ul: { ...styles.list, ...styles.ul, listStyleType: 'none' },
      li: styles.listItemText,
      // Table tags are handled by the custom WebView renderer — no native styles needed
      table: { margin: 0, padding: 0 }
    }),
    [styles, textSize, theme]
  );

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={width}
        source={{ html: cleanHtmlContent }}
        tagsStyles={tagsStyles as MixedStyleRecord}
        renderers={customRenderers as unknown as CustomTagRendererRecord}
        customHTMLElementModels={customHTMLElementModels}
        systemFonts={systemFonts}
      />
    </View>
  );
};

const themeStyles = (theme: AppTheme, textSize: TextSize) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    paragraph: {
      fontSize: scaleFont(fontSize.s, textSize),
      lineHeight: actuatedNormalizeVertical(lineHeight['2xl']),
      marginTop: actuatedNormalizeVertical(spacing.m),
      fontFamily: `${fonts.notoSerif}-Regular`,
      color: theme.liveBlogTextBulletsBodyDescription
    },
    bold: {
      fontWeight: 'bold'
    },
    italic: {
      fontFamily: `${fonts.franklinGothicURW}-Boo`,
      fontStyle: 'italic'
    },
    underline: {
      textDecorationLine: 'underline'
    },
    strikethrough: {
      textDecorationLine: 'line-through'
    },
    superscript: {
      fontSize: scaleFont(fontSize.xxxs, textSize),
      lineHeight: lineHeight.l
    },
    subscript: {
      fontSize: scaleFont(fontSize.xxxs, textSize)
    },
    link: {
      color: theme.bodyTextHyperlinked,
      textDecorationLine: 'underline'
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain'
    },
    listItemContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    listItemText: {
      fontSize: scaleFont(fontSize.s, textSize),
      fontFamily: `${fonts.notoSerif}-Regular`,
      lineHeight: lineHeight['2xl'],
      color: theme.liveBlogTextBulletsBodyDescription
    },
    list: {
      marginTop: actuatedNormalizeVertical(spacing.m)
    },
    ul: {
      marginLeft: 0,
      paddingLeft: 0
    },
    ol: {
      marginLeft: 0,
      paddingLeft: 0
    },
    table: {
      borderWidth: borderWidth.m,
      borderColor: theme.borderColor,
      width: '100%'
    },
    tr: {
      flexDirection: 'row'
    },
    th: {
      borderWidth: borderWidth.m,
      borderColor: theme.borderColor,
      backgroundColor: theme.mainBackgroundSecondary,
      padding: actuatedNormalize(spacing.l),
      fontWeight: 'bold',
      textAlign: 'center'
    },
    td: {
      borderWidth: borderWidth.m,
      borderColor: theme.borderColor,
      padding: actuatedNormalize(spacing.l),
      textAlign: 'center'
    },
    heading: {
      ...htmlHeading,
      fontSize: scaleFont(htmlHeading.fontSize, textSize),
      color: theme.liveBlogTextBulletsBodyDescription
    },
    iframeContainer: {
      width: '100%',
      marginTop: actuatedNormalizeVertical(spacing.m),
      borderRadius: radius.xxs,
      overflow: 'hidden'
    }
  });

export default memo(HtmlBlock);
