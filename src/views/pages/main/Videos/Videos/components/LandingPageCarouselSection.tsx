import React, { useRef } from 'react';
import { FlatList, View, StyleProp, ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LandingPageCarouselSkeleton } from '@src/views/pages/main/Videos/Videos/components/LandingPageCarouselSkeleton';
import { useTheme } from '@src/hooks/useTheme';
import { SCREEN_WIDTH } from '@src/utils/pixelScaling';
import { RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import CarouselHeroCard from '@src/views/pages/main/Videos/Videos/components/CarouselHeroCard';
import { useSettingsStore } from '@src/zustand/main/settingsStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';
import { extractLexicalText } from '@src/utils/extractLexicalText';

interface CarouselItem {
  slug?: string;
  heroImage?: { url: string };
  id: string;
  title: string;
  uri?: string;
  videoUrl?: string;
  type?: 'gif' | 'image' | 'video';
  aspectRatio?: number;
  excerpt?: unknown;
  summary?: unknown;
  description?: unknown;
  subtitle?: unknown;
}

interface LandingPageCarouselSectionProps {
  data?: {
    VideoHeroCarousel: CarouselItem[];
  };
  loading?: boolean;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const ITEM_WIDTH = SCREEN_WIDTH;

const LandingPageCarouselSection: React.FC<LandingPageCarouselSectionProps> = ({
  data,
  loading,
  sectionGapStyle
}) => {
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const [theme] = useTheme();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { shouldAutoPlay } = useSettingsStore();

  const handleItemPress = (item: CarouselItem) => {
    // Analytics for carousel card tap
    logSelectContentEvent({
      screen_page_web_url: SCREEN_PAGE_WEB_URL.VIDEOS_LANDING_PAGE,
      idPage: item?.id || '',
      screen_name: ANALYTICS_COLLECTION.VIDEOS,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.VIDEOS}_${ANALYTICS_PAGE.HOME_VIDEOS}`,
      organisms: ANALYTICS_ORGANISMS.VIDEOS.HERO,
      content_type: ANALYTICS_MOLECULES.VIDEOS.VIDEOS,
      content_title: item.title,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.EPISODE_DETAIL_PAGE,
      params: {
        slug: item?.slug
      }
    });
  };

  const renderItem = ({ item }: { item: CarouselItem; index: number }) => {
    // Map API data to CarouselHeroCardItem expected format
    // API returns `videoUrl`, Card expects `uri` and `type`
    const heroCardItem = {
      ...item,
      uri: item.uri ?? item.videoUrl ?? '',
      type: item.type ?? (item.videoUrl ? 'video' : 'image'),
      aspectRatio: item.aspectRatio,
      excerpt:
        extractLexicalText(item.excerpt) ||
        extractLexicalText(item.summary) ||
        extractLexicalText(item.description) ||
        extractLexicalText(item.subtitle),
      heroImage: item.heroImage
    };

    return (
      <CarouselHeroCard
        item={heroCardItem}
        autoStart={shouldAutoPlay()}
        onPress={() => handleItemPress(item)}
        theme={theme}
        width={ITEM_WIDTH}
      />
    );
  };

  if (loading || !data?.VideoHeroCarousel?.length) {
    return <LandingPageCarouselSkeleton />;
  }

  if (data.VideoHeroCarousel.length === 0) {
    return;
  }

  return (
    <View style={sectionGapStyle}>
      <FlatList
        ref={flatListRef}
        data={data?.VideoHeroCarousel?.length ? [data.VideoHeroCarousel[0]] : []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.id ? `carousel-${item.id}-${index}` : `carousel-${index}`
        }
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default React.memo(LandingPageCarouselSection);
