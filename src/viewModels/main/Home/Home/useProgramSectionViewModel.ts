import { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList } from 'react-native';

import { useQuery } from '@apollo/client';
import Config from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  HOMEPAGE_CHANNELS_QUERY,
  HOMEPAGE_PROGRAMS_SECTION_QUERY
} from '@src/graphql/main/home/queries';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/types';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { ProgramasItem } from '@src/models/main/Videos/Videos';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { Topic } from '@src/views/organisms/TopicChips';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

interface HomepageChannel {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
}

const useProgramSectionViewModel = () => {
  const [programasChannel, setProgramasChannel] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);
  const programasListRef = useRef<FlatList>(null);
  const { data: channelsTopicData, refetch: refetchChannels } = useQuery(HOMEPAGE_CHANNELS_QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (channelsTopicData) {
      setProgramasChannel(
        channelsTopicData?.HomepageChannels?.[0]?.id ?? Config.NPLUS_CHANNEL_FORO_TV
      );
    }
  }, [channelsTopicData]);

  const chipsTopic = channelsTopicData?.HomepageChannels;

  // Fetch programs
  const {
    data: programasNPlusData,
    loading: programasNPlusLoading,
    refetch: refetchProgramas
  } = useQuery(HOMEPAGE_PROGRAMS_SECTION_QUERY, {
    variables: { channel: programasChannel },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: !programasChannel
  });

  const onProgramsTogglePress = useCallback(
    (value: string | Topic, index?: number) => {
      // Log analytics event for 'Category | x2' tap
      const topicValue = typeof value === 'string' ? value : value.title;
      const topicSlug = typeof value === 'string' ? value : value.slug;

      logSelectContentEvent({
        screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
        organisms: ANALYTICS_ORGANISMS.HOME_PAGE.PROGRAMAS,
        content_type: `${ANALYTICS_MOLECULES.HOME_PAGE.CATEGORY_X2} | ${index ? index + 1 : 1}`,
        content_name: topicValue || 'undefined',
        content_action: ANALYTICS_ATOMS.TAP,
        screen_page_web_url: topicSlug || 'undefined',
        idPage: typeof value === 'string' ? value : value.slug || 'undefined'
      });

      if (typeof value === 'string') {
        setProgramasChannel(value);
        refetchProgramas({ channel: value });
      } else {
        // Find the corresponding channel by matching title and slug
        const matchingChannel = channelsTopicData?.HomepageChannels?.find(
          (channel: HomepageChannel) => channel.title === value.title && channel.slug === value.slug
        );
        const channelId = matchingChannel?.id ?? null;
        setProgramasChannel(channelId);
        refetchProgramas({ channel: channelId });
      }
      programasListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    [refetchProgramas, channelsTopicData]
  );

  const onSeeAllProgramsPress = () => {
    // Log analytics event for 'Action_Button_Primary | Más Programas' tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.PROGRAMAS,
      content_type: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_PRIMARY_MAS_PROGRAMAS,
      content_name: ANALYTICS_MOLECULES.HOME_PAGE.ACTION_BUTTON_PRIMARY_MAS_PROGRAMAS,
      content_action: ANALYTICS_ATOMS.TAP
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.PROGRAMS,
      params: { slug: null, channel: null }
    });
  };

  const onProgramsCardPress = (item: ProgramasItem, index?: number) => {
    // Log analytics event for 'Video Card | x5' tap
    logSelectContentEvent({
      screen_name: ANALYTICS_COLLECTION.HOME_PAGE,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.HOME_PAGE}_${ANALYTICS_PAGE.HOME_PAGE}`,
      organisms: ANALYTICS_ORGANISMS.HOME_PAGE.PROGRAMAS,
      content_type: `${ANALYTICS_MOLECULES.HOME_PAGE.VIDEO_CARD_X5} | ${index ? index + 1 : 1}`,
      content_name: item?.title || 'undefined',
      content_action: ANALYTICS_ATOMS.TAP,
      screen_page_web_url: item?.slug || 'undefined',
      idPage: typeof item?.id === 'string' ? item.id : item?.id?.toString() || 'undefined',
      content_title: item?.title,
      Fecha_Publicacion_Texto: item?.publishedAt
    });

    navigation.navigate(routeNames.VIDEOS_STACK, {
      screen: screenNames.PROGRAMS,
      params: { slug: item?.slug, id: item?.id, channel: programasChannel }
    });
  };

  useEffect(() => {
    if (programasNPlusLoading) return;

    const hasData = !!programasNPlusData?.HomepagePrograms;
    setSectionHasData('programs', hasData);

    return () => {
      setSectionHasData('programs', false);
    };
  }, [programasNPlusLoading, programasNPlusData, setSectionHasData]);

  return {
    chipsTopic,
    programasNPlusData,
    programasNPlusLoading,
    onProgramsTogglePress,
    onProgramsCardPress,
    onSeeAllProgramsPress,
    refetchChannels,
    refetchProgramas,
    programasChannel,
    programasListRef
  };
};

export default useProgramSectionViewModel;
