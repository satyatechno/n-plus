import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { screenNames } from '@src/navigation/screenNames';

export const ContentSourceSlug = {
  categories: 'categories',
  channels: 'channels',
  provinces: 'provinces',
  'live-blogs': 'live-blogs',
  pages: 'pages',
  'press-room': 'press-room',
  productions: 'productions',
  programs: 'programs',
  posts: 'posts',
  topics: 'topics',
  talents: 'talents',
  videos: 'videos'
} as const;

export const RequiredItemSelection = {
  categories: true,
  channels: true,
  provinces: false,
  'live-blogs': false,
  pages: true,
  'press-room': false,
  productions: true,
  programs: false,
  posts: true,
  topics: true,
  talents: false,
  videos: false
} as const;

export const ProductionTypes = {
  nPlusFocus: 'N+ Focus',
  porElPlaneta: 'Por el planeta'
} as const;

export const NavigationMode = {
  app: 'app',
  webview: 'webview'
} as const;

export type AppRouteConfig = {
  mode: typeof NavigationMode.app;
  route: string;
};

export type WebViewConfig = {
  mode: typeof NavigationMode.webview;
};

export type DefaultDetailRouteConfig = {
  mode: typeof NavigationMode.app | typeof NavigationMode.webview;
  defaultRoute: string | Record<string, string>;
  detailRoute: string;
};

export type RouteConfig = AppRouteConfig | WebViewConfig | DefaultDetailRouteConfig;

export const ContentSourceNavigation: Record<keyof typeof ContentSourceSlug, RouteConfig> = {
  categories: { mode: NavigationMode.app, route: screenNames.CATEGORY_DETAIL_SCREEN },
  channels: { mode: NavigationMode.webview },
  provinces: {
    mode: NavigationMode.webview,
    defaultRoute: screenNames.STATES_LANDING,
    detailRoute: screenNames.STATE_DETAIL
  },
  'live-blogs': {
    mode: NavigationMode.app,
    defaultRoute: screenNames.ACTIVE_LIVE_BLOG_LISTING,
    detailRoute: screenNames.LIVE_BLOG
  },
  pages: { mode: NavigationMode.webview },
  'press-room': {
    mode: NavigationMode.app,
    defaultRoute: screenNames.PRESS_ROOM_LANDING,
    detailRoute: screenNames.PRESS_ROOM_DETAIL
  },
  productions: {
    mode: NavigationMode.app,
    defaultRoute: {
      [ProductionTypes.nPlusFocus]: screenNames.NPLUS_FOCUS_LANDING_PAGE,
      [ProductionTypes.porElPlaneta]: screenNames.POR_EL_PLANETA_LANDING_PAGE
    },
    detailRoute: screenNames.INVESTIGATION_DETAIL_SCREEN
  },
  programs: {
    mode: NavigationMode.app,
    defaultRoute: screenNames.PROGRAMS,
    detailRoute: screenNames.PROGRAMS
  },
  posts: { mode: NavigationMode.app, route: screenNames.STORY_PAGE_RENDERER },
  topics: { mode: NavigationMode.app, route: screenNames.CATEGORY_DETAIL_SCREEN },
  talents: {
    mode: NavigationMode.app,
    defaultRoute: screenNames.TALENT_LISTING,
    detailRoute: screenNames.AUTHOR_BIO
  },
  videos: {
    mode: NavigationMode.app,
    defaultRoute: screenNames.VIDEOS,
    detailRoute: screenNames.VIDEO_DETAIL_PAGE
  }
} as const;

export const ChannelTitles = {
  nPlusFocus: 'N+ Focus',
  porElPlaneta: 'Por el planeta',
  nPlus: 'N+',
  nPlusForo: 'N+ Foro'
} as const;

export type LinkType = 'internal' | 'custom';

export interface SelectedItem {
  relationTo: string;
  value: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  linkType: string;
  openInNewTab: boolean | null;
  contentSource: string | null;
  contentSourceSlug: string | null;
  fullPath: string | null;
  customUrl: string | null;
  selectedItem: SelectedItem | null;
  subItems: NavItem[];
}

export interface SecondaryHeaderResponse {
  SecondaryHeader: {
    id: string;
    updatedAt: string;
    createdAt: string;
    navItems: NavItem[];
  };
}

export type NavigationModeType = (typeof NavigationMode)[keyof typeof NavigationMode];

export interface NavigationConfig {
  contentSource: keyof typeof ContentSourceSlug | null;
  linkType: LinkType;
  customUrl: string | null;
  slug: string | null;
  fullPath: string | null;
}

export interface CategoryItem {
  id: string;
  title: string;
  hasSubcategories?: boolean;
  subcategories?: CategoryItem[];
  navigationConfig: NavigationConfig;
  selectedItem?: SelectedItem;
}

export type NavigationProp = NativeStackNavigationProp<NavigationParams>;

export type NavigationParams = {
  AuthStack: undefined;
  HomeStack: undefined;
  MyAccountStack: undefined;
  VideosStack: {
    screen:
      | 'Videos'
      | 'Programs'
      | 'EpisodeDetailPage'
      | 'NPlusFocusLandingPage'
      | 'PorElPlanetaLandingPage'
      | 'ProductionPage'
      | 'InvestigationListingScreen'
      | 'VideoDetailPage'
      | 'AuthorBio'
      | 'InvestigationDetailScreen'
      | 'TalentListing';
    params?: { slug?: string } | undefined;
  };
};

// Common navigation mappings used across view models
export const VideoScreenMapping: Record<string, NavigationParams['VideosStack']['screen']> = {
  [screenNames.VIDEOS]: 'Videos',
  [screenNames.NPLUS_FOCUS_LANDING_PAGE]: 'NPlusFocusLandingPage',
  [screenNames.POR_EL_PLANETA_LANDING_PAGE]: 'PorElPlanetaLandingPage',
  [screenNames.PRODUCTION_PAGE]: 'ProductionPage',
  [screenNames.VIDEO_DETAIL_PAGE]: 'VideoDetailPage',
  [screenNames.AUTHOR_BIO]: 'AuthorBio',
  [screenNames.PROGRAMS]: 'Programs',
  [screenNames.EPISODE_DETAIL_PAGE]: 'EpisodeDetailPage',
  [screenNames.INVESTIGATION_LISTING_SCREEN]: 'InvestigationListingScreen',
  [screenNames.INVESTIGATION_DETAIL_SCREEN]: 'InvestigationDetailScreen',
  [screenNames.TALENT_LISTING]: 'TalentListing'
};

export const HomeStackScreens = [
  screenNames.STORY_PAGE_RENDERER,
  screenNames.LIVE_BLOG,
  screenNames.ACTIVE_LIVE_BLOG_LISTING,
  screenNames.INACTIVE_LIVE_BLOG_LISTING,
  screenNames.CATEGORY_LISTING,
  screenNames.CATEGORY_DETAIL_SCREEN,
  screenNames.PRESS_ROOM_LANDING,
  screenNames.PRESS_ROOM_DETAIL,
  screenNames.STATES_LANDING,
  screenNames.STATE_DETAIL
] as const;
