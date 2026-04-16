import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { useQuery } from '@apollo/client';
import Config from 'react-native-config';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LIVE_STREAMING_PRIME_SECTION_QUERY } from '@src/graphql/main/home/queries';
import { useHomeSectionStatusStore } from '@src/zustand/main/homeSectionStatusStore';
import { useGeoblockCheck } from '@src/hooks/useGeoblockCheck';
import { RootStackParamList } from '@src/navigation/types';

const useLiveStreamingViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFirstMount = useRef(true);
  const dataRef = useRef<{
    HomepagePrime?: { liveStreaming?: { liveSignal?: string; youtubeCode?: string } | null } | null;
  }>(undefined);
  const [signalUrl, setSignalUrl] = useState<string>('');
  const [showLiveStreaming, setShowLiveStreaming] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const setSectionHasData = useHomeSectionStatusStore((s) => s.setSectionHasData);
  const { checkAndSetGeoblock } = useGeoblockCheck();

  const channelUIDKeys: Record<string, string> = {
    'foro-tv': Config.NPLUS_FORO_UID ?? '',
    noticieros: Config.NPLUS_UID ?? '',
    'nplus-guadalajara': Config.NPLUS_GUADALAJARA_UID ?? '',
    'nplus-monterrey': Config.NPLUS_MONTERREY_UID ?? '',
    youtube: 'youtube'
  };

  const {
    data,
    refetch: refetchLiveStreaming,
    loading
  } = useQuery(LIVE_STREAMING_PRIME_SECTION_QUERY);

  // Keep a stable ref to latest data so we can access it in effects without adding it as a dependency
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const youtubeLiveVideoUrl = useMemo(
    () =>
      data?.HomepagePrime?.liveStreaming?.liveSignal == 'youtube'
        ? data?.HomepagePrime?.liveStreaming?.youtubeCode
        : '',
    [data]
  );

  const fetchSignalUrl = useCallback(
    async (uniqueChannelId: string, onSuccess?: () => void) => {
      const response = await fetch(`${Config.SIGNAL_BASE_URL}${uniqueChannelId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        return;
      }

      const responseData = await response.json();

      const { tvssDomain, signal } = responseData?.data?.tansmissionEvent ?? {};

      // Verify geoblock by IP — same as Broadcast SDK web checkGeoblockLivestream()
      if (tvssDomain) {
        checkAndSetGeoblock(tvssDomain).catch(() => {});
      }

      if (signal) {
        setSignalUrl(`${Config.CUSTOM_LIVE_STREAM_URL}${signal}`);
        onSuccess?.();
      }
    },
    [checkAndSetGeoblock]
  );

  useEffect(() => {
    if (isFocused) {
      setShowLiveStreaming(true);
      // Re-fetch when returning to tab (not on initial mount) to reset geoblock state
      if (!isFirstMount.current) {
        const currentData = dataRef.current;
        const liveSignal = currentData?.HomepagePrime?.liveStreaming?.liveSignal;
        if (liveSignal && liveSignal !== 'youtube') {
          fetchSignalUrl(channelUIDKeys[liveSignal ?? '']);
        }
      }
    } else {
      setShowLiveStreaming(false);
    }
    if (isFirstMount.current) {
      isFirstMount.current = false;
    }
  }, [isFocused, navigation, fetchSignalUrl]);

  useEffect(() => {
    if (
      data?.HomepagePrime?.liveStreaming?.liveSignal &&
      data?.HomepagePrime?.liveStreaming?.liveSignal !== 'youtube'
    ) {
      setShowLiveStreaming(false);
      fetchSignalUrl(
        channelUIDKeys[data?.HomepagePrime?.liveStreaming?.liveSignal ?? ''],
        () => setShowLiveStreaming(true) // Show player only after signal is ready
      );
    }
  }, [data, fetchSignalUrl]);

  useEffect(() => {
    if (loading) return;

    const hasData = !!data?.HomepagePrime?.liveStreaming;
    setSectionHasData('liveStreamingPrime', hasData);

    return () => {
      setSectionHasData('liveStreamingPrime', false);
    };
  }, [loading, data, setSectionHasData]);

  return {
    liveStreamingData: data?.HomepagePrime?.liveStreaming,
    signalUrl,
    youtubeLiveVideoUrl,
    showLiveStreaming,
    setShowLiveStreaming,
    refetchLiveStreaming
  };
};

export default useLiveStreamingViewModel;
