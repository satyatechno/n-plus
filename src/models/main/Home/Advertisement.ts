export interface HomepageAds {
  activateHomepageAds: boolean;
  appHomepages: string[];
}

export interface StoryPagesConfig {
  adPositionInBody: number;
}

export interface Advertisement {
  id: string;
  activateAds: boolean;
  homepageAds: HomepageAds;
  storyPagesConfig: StoryPagesConfig;
}

export interface AdvertisementResponse {
  Advertisement: Advertisement;
}
