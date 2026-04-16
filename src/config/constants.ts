import { t } from 'i18next';

import { TextSize, ThemeOption, VideoAutoPlayOption } from '@src/models/main/MyAccount/Settings';

const DARK = 'dark' as const;
const LIGHT = 'light' as const;
const SYSTEM = 'system' as const;
const ANDROID = 'android' as const;
const IOS = 'ios' as const;
const DAI = 'dai' as const;

export default {
  DARK,
  LIGHT,
  SYSTEM,
  ANDROID,
  IOS,
  DAI
};

export const MAX_TITLE_CHARS = 50;
export const MAX_FIREBASE_PARAM_LENGTH = 100;

export const themeOptions: { label: string; value: ThemeOption }[] = [
  { label: t('screens.settings.text.light'), value: 'light' },
  { label: t('screens.settings.text.dark'), value: 'dark' },
  { label: t('screens.settings.text.system'), value: 'system' }
];

export const textSizeOptions: { label: string; value: TextSize }[] = [
  { label: t('screens.settings.text.small'), value: 'Chica' },
  { label: t('screens.settings.text.medium'), value: 'Mediana' },
  { label: t('screens.settings.text.large'), value: 'Grande' }
];

export const videoAutoPlayOptions: { label: string; value: VideoAutoPlayOption }[] = [
  {
    label: t('screens.settings.text.autoPlayAlways'),
    value: 'Siempre'
  },
  {
    label: t('screens.settings.text.autoPlayWifiOnly'),
    value: 'Solo con Wi-Fi'
  },
  {
    label: t('screens.settings.text.autoPlayNever'),
    value: 'Nunca'
  }
];

export enum VideoAutoPlay {
  NEVER = 'Nunca',
  ALWAYS = 'Siempre',
  WIFI_ONLY = 'Solo con Wi-Fi'
}

export type ScreenMapping = {
  collection: string;
  production?: string | null;
  category?: string | null;
  path: string;
  stack: string;
  screen: string;
  slug?: string | null;
};

export const TOOLTIP_OFFSET_GESTURE_NAV = 78;
export const TOOLTIP_OFFSET_IOS = 75;
export const TOOLTIP_OFFSET_ANDROID = 56;

export const SOCIAL_AUTH_NEXT_STEP = {
  ALREADY_LOGGED_IN: '0',
  NEW_REGISTRATION: '2'
} as const;

export const SCREEN_MAPPINGS: ScreenMapping[] = [
  {
    collection: 'videos',
    production: 'por-el-planeta',
    path: 'videos/por-el-planeta',
    stack: 'VideosStack',
    screen: 'PorElPlanetaDetailPage'
  },
  {
    collection: 'productions',
    production: null,
    slug: 'por-el-planeta',
    path: 'productions/por-el-planeta',
    stack: 'VideosStack',
    screen: 'PorElPlanetaLandingPage'
  },
  {
    collection: 'videos',
    production: 'nmas-focus',
    path: 'videos/nmas-focus',
    stack: 'VideosStack',
    screen: 'InvestigationDetailScreen'
  },
  {
    collection: 'posts',
    production: 'nmas-focus',
    path: 'posts/nmas-focus',
    stack: 'VideosStack',
    screen: 'ShortInvestigationDetailScreen'
  },
  {
    collection: 'productions',
    production: null,
    slug: 'nmas-focus',
    path: 'productions/nmas-focus',
    stack: 'VideosStack',
    screen: 'NPlusFocusLandingPage'
  },
  {
    collection: 'posts',
    production: null,
    category: 'opinion',
    path: 'opinion',
    stack: 'OpinionStack',
    screen: 'OpinionDetailPage'
  },
  {
    collection: 'videos',
    production: null,
    category: 'opinion',
    path: 'opinion',
    stack: 'OpinionStack',
    screen: 'OpinionDetailPage'
  },
  { collection: 'posts', production: null, path: 'story', stack: 'HomeStack', screen: 'StoryPage' },
  {
    collection: 'users',
    production: null,
    path: 'author',
    stack: 'HomeStack',
    screen: 'AuthorDetails'
  },
  {
    collection: 'live-blogs',
    production: null,
    path: 'live-blog',
    stack: 'HomeStack',
    screen: 'LiveBlog'
  },
  {
    collection: 'videos',
    production: null,
    path: 'episode',
    stack: 'VideosStack',
    screen: 'EpisodeDetailPage'
  },
  {
    collection: 'programs',
    production: null,
    path: 'programs',
    stack: 'VideosStack',
    screen: 'Programs'
  },
  {
    collection: 'talents',
    production: null,
    path: 'talent',
    stack: 'VideosStack',
    screen: 'AuthorBio'
  },
  {
    collection: 'categories',
    production: null,
    path: 'category',
    stack: 'HomeStack',
    screen: 'CategoryTopicDetailScreen'
  },
  {
    collection: 'topics',
    production: null,
    path: 'category',
    stack: 'HomeStack',
    screen: 'CategoryTopicDetailScreen'
  },
  {
    collection: 'productions',
    production: null,
    path: 'productions/nmas-originales',
    stack: 'VideosStack',
    screen: 'ProductionPage'
  }
];

export const ANALYTICS_COLLECTION_MAPPING: Record<string, string> = {
  Home: 'Homepage',
  LiveTv: 'Live',
  PorElPlanetaDetailPage: 'Productoras',
  PorElPlanetaLandingPage: 'Productoras',
  PorElPlanetaDocumentaries: 'Productoras',
  InvestigationDetailScreen: 'N+ Focus',
  ShortInvestigationDetailScreen: 'N+ Focus',
  NPlusFocusLandingPage: 'N+ Focus',
  OpinionDetailPage: 'Opinión',
  OpinionLandingPage: 'Opinión',
  StoryPage: 'Story page',
  AuthorDetails: 'Author bio',
  AuthorBio: 'Author bio',
  TalentListing: 'Author bio',
  LiveBlog: 'Liveblogs',
  ActiveLiveBlogListing: 'Liveblogs',
  InactiveLiveBlogListing: 'Liveblogs',
  EpisodeDetailPage: 'Videos',
  AllEpisodes: 'Videos',
  VideoDetailPage: 'Videos',
  Videos: 'Videos',
  Programs: 'Programas',

  // Onboarding
  Login: 'Onboarding',
  CreateAccountPassword: 'Onboarding',
  SignUpOtp: 'Onboarding',
  SignUpOtpSuccess: 'Onboarding',
  ForgotPassword: 'Onboarding',
  ForgotPasswordOtp: 'Onboarding',
  ForgotPasswordOtpVerify: 'Onboarding',
  CreateNewPassword: 'Onboarding',
  CreateNewPasswordSuccess: 'Onboarding',
  SocialAuth: 'Onboarding',
  Splash: 'Onboarding',

  // Mi cuenta
  MyAccount: 'Mi cuenta',
  UpdateProfile: 'Mi cuenta',
  ContactUs: 'Mi cuenta',
  Settings: 'Mi cuenta',
  ChangePassword: 'Mi cuenta',
  NotificationSetting: 'Mi cuenta',
  Newsletters: 'Mi cuenta',
  DeleteAccountConfirmation: 'Mi cuenta',
  DeleteAccountOtp: 'Mi cuenta',
  DeleteAccountOtpSuccess: 'Mi cuenta',
  Bookmarks: 'Mi cuenta',
  MyNotification: 'Mi cuenta',

  // Search
  SearchLandingPage: 'Search',
  SearchScreen: 'Search',

  // Categories & States
  CategoryListing: 'Categorías',
  CategoryTopicDetailScreen: 'Categorías',
  StatesLanding: 'States',
  StateDetail: 'States',

  // Press room
  PressRoomLanding: 'Sala de Prensa',
  PressRoomDetail: 'Sala de Prensa'
};
