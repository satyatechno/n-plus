import React, { memo, useCallback, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
  Modal,
  ViewStyle
} from 'react-native';

import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import RelatedPost from '@src/views/organisms/RelatedPost';
import { fonts } from '@src/config/fonts';
import CustomText from '@src/views/atoms/CustomText';
import CustomWebView from '@src/views/atoms/CustomWebView';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { formatDurationToMinutes } from '@src/utils/formatDurationToMinutes';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { RootStackParamList } from '@src/navigation/types';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { ANALYTICS_ORGANISMS, ANALYTICS_ATOMS } from '@src/utils/analyticsConstants';
import { logSelectContentEvent, StoryData } from '@src/utils/storyAnalyticsHelpers';

/**
 * RelatedStoryBlock
 *
 * Renders a block displaying related stories, typically used within Lexical content.
 * Shows a heading, optional intro content, and a list of related stories (selectedDocs).
 *
 * Props:
 *   - selectedDocs: Array of related story items, each with title, slug, readTime, and categories.
 *   - introContent: Optional introductory text/content to display above the stories.
 *   - categories: Optional array of category data for filtering or display.
 *
 * Usage:
 *   <RelatedStoryBlock
 *     selectedDocs={selectedDocs}
 *     introContent={introContent}
 *     categories={categories}
 *   />
 *
 * The block uses theme styles and i18n for localization.
 */

interface RelatedStoryItem {
  relationTo?: string;
  value?: {
    title?: string;
    slug?: string;
    fullPath?: string;
    readTime?: number;
    videoDuration?: number;
    category?: { title?: string };
    topics?: Array<{ title?: string }>;
    heroImage?: Array<{
      url?: string;
      alt?: string;
      caption?: string;
      sizes?: {
        square?: {
          url?: string;
        };
      };
    }>;
    content?: {
      heroImage?: {
        sizes?: {
          square?: {
            url?: string;
          };
        };
        url?: string;
      };
    };
    openingType?: string;
    hero?: {
      media?: {
        sizes?: {
          square?: {
            url?: string;
          };
        };
      };
    };
  };
}

interface CategoryData {
  title?: string;
}

interface ContentData {
  text?: string;
}

interface RelatedStoryBlockProps {
  selectedDocs?: RelatedStoryItem[];
  titleBlock?: string;
  introContent?: ContentData;
  categories?: CategoryData[];
  slug?: string;
  style?: StyleProp<ViewStyle>;
  customTheme?: 'light' | 'dark';
  story?: StoryData | null;
  currentSlug?: string;
  slugHistory?: string[];
  collection?: string;
  page?: string;
}

const RelatedStoryBlock: React.FC<RelatedStoryBlockProps> = ({
  selectedDocs = [],
  titleBlock,
  introContent,
  style,
  customTheme,
  story,
  currentSlug,
  slugHistory = [],
  collection,
  page
}) => {
  const { t } = useTranslation();
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const handleWebViewClose = useCallback(() => {
    setShowWebView(false);
    setWebUrl('');
  }, []);

  const handlePress = useCallback(
    (item: RelatedStoryItem, itemIndex: number) => {
      const slug = item.value?.slug || '';

      // Send SELECT_CONTENT event when related story is clicked
      if (story && currentSlug && itemIndex >= 0) {
        const previousSlug =
          slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
        logSelectContentEvent(story, {
          organism: ANALYTICS_ORGANISMS.STORY_PAGE.RELACIONADO,
          molecule: `Card Style/1 | ${itemIndex + 1}`,
          contentName: item.value?.title || 'undefined',
          currentSlug,
          previousSlug,
          screenName: page || 'undefined',
          tipoContenido: collection && page ? `${collection}_${page}` : 'undefined',
          contentAction: ANALYTICS_ATOMS.TAP
        });
      }

      if (item.relationTo === 'pages') {
        const fullPath = item.value?.fullPath || '';
        if (fullPath) {
          const url = `${Config.WEBSITE_BASE_URL || ''}${fullPath}`;
          setWebUrl(url);
          setShowWebView(true);
        }
      } else if (item.relationTo === 'videos') {
        navigation.navigate(routeNames.VIDEOS_STACK, {
          screen: screenNames.VIDEO_DETAIL_PAGE,
          params: { slug }
        });
      } else {
        navigation.navigate(routeNames.HOME_STACK, {
          screen: screenNames.STORY_PAGE_RENDERER,
          params: { slug }
        });
      }
    },
    [navigation, story, currentSlug, slugHistory]
  );

  return (
    <View style={[styles.container, style]}>
      <CustomText
        textStyles={styles.titleStyles}
        fontFamily={fonts.franklinGothicURW}
        weight="Dem"
        size={fontSize.xl}
      >
        {titleBlock || introContent?.text || t('screens.storyPage.relatedStoryBlock.title')}
      </CustomText>

      <FlatList
        data={selectedDocs}
        keyExtractor={(item, index) => `${item.value?.slug || index}`}
        renderItem={({ item, index }: ListRenderItemInfo<(typeof selectedDocs)[0]>) => {
          const isVideo = item.relationTo === 'videos';
          const isPage = item.relationTo === 'pages';
          const readingTime = isPage
            ? ''
            : isVideo
              ? String(formatDurationToMinutes(item.value?.videoDuration ?? 0))
              : `${item.value?.readTime} min`;
          const imageUrl =
            item.value?.content?.heroImage?.sizes?.square?.url ||
            item.value?.heroImage?.[0]?.sizes?.square?.url ||
            item.value?.hero?.media?.sizes?.square?.url;

          return (
            <RelatedPost
              imageUrl={imageUrl}
              headingText={item.value?.topics?.[0]?.title ?? item.value?.category?.title ?? ''}
              subHeadingText={item.value?.title ?? ''}
              subHeadingFont={fonts.notoSerif}
              readingTime={readingTime}
              headingStyles={styles.headingStyles}
              isVideo={isVideo}
              onPress={() => handlePress(item, index)}
            />
          );
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      />

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={handleWebViewClose}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={handleWebViewClose}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}
    </View>
  );
};

export default memo(RelatedStoryBlock);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.l
    },
    separatorDivider: {
      marginTop: spacing.xxxxs,
      marginBottom: spacing.m,
      borderColor: theme.dividerPrimary
    },
    titleStyles: {
      lineHeight: lineHeight['2xl'],
      letterSpacing: letterSpacing.s
    },
    headingStyles: {
      lineHeight: lineHeight.s,
      color: theme.tagsTextCategory,
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    subheadingStyles: {
      color: theme.newsTextTitlePrincipal
    },
    contentContainerStyle: {
      borderTopWidth: borderWidth.s,
      borderTopColor: theme.dividerPrimary,
      marginTop: spacing.xxs
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      paddingLeft: actuatedNormalize(spacing.xs)
    }
  });
