import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { ADVERTISEMENT_QUERY } from '@src/graphql/main/home/queries';
import { AdvertisementResponse } from '@src/models/main/Home/Advertisement';

export const useAdvertisement = () => {
  const { data: advertisementData, refetch: refetchAdvertisement } =
    useQuery<AdvertisementResponse>(ADVERTISEMENT_QUERY, {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network'
    });

  const appHomepages = useMemo(
    () => advertisementData?.Advertisement?.homepageAds?.appHomepages ?? [],
    [advertisementData]
  );

  const adConfig = useMemo(() => {
    const ad = advertisementData?.Advertisement;
    if (ad?.activateAds && ad?.storyPagesConfig?.adPositionInBody) {
      return {
        showAd: true,
        adPositionInBody: ad.storyPagesConfig.adPositionInBody
      };
    }

    return { showAd: false, adPositionInBody: 0 };
  }, [advertisementData]);

  const shouldShowBannerAds = useMemo(
    () => (page: string) => appHomepages.includes(page),
    [appHomepages]
  );

  return {
    advertisementData,
    refetchAdvertisement,
    appHomepages,
    adConfig,
    shouldShowBannerAds
  };
};

export default useAdvertisement;
